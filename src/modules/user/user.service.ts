import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateNonce(): string {
    return randomBytes(32).toString('hex');
  }

  async getNonce(address: string): Promise<{ nonce: string }> {
    let user = await this.userRepository.findOne({ where: { address } });

    if (!user) {
      user = this.userRepository.create({
        address,
      });
    }

    const nonce = this.generateNonce();
    user.nonce = nonce;
    await this.userRepository.save(user);

    return { nonce };
  }

  async verifySignature(user: User, signature: string): Promise<boolean> {
    if (!user || !user.nonce) {
      throw new UnauthorizedException('Please get nonce first');
    }

    try {
      const recoveredAddress = ethers.verifyMessage(user.nonce, signature);
      return recoveredAddress === user.address;
    } catch (error) {
      return false;
    }
  }

  async login(signature: string, address: string) {
    const user = await this.userRepository.findOne({ where: { address } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await this.verifySignature(user, signature);
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    // 清空 nonce
    user.nonce = '';
    await this.userRepository.save(user);

    const token = this.jwtService.sign({ id: user.id, address: user.address });

    return {
      user,
      token,
    };
  }

  async updateUser(userId: number, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateData);
    await this.userRepository.save(user);
    return user;
  }
}
