import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: DeepPartial<User>): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    const updatedUser = await this.findOne(id);
    return updatedUser!;
  }

  async updateProfile(id: string, updateData: { name?: string; email?: string; phone?: string }): Promise<User> {
    // Check if email is already taken by another user
    if (updateData.email) {
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email is already taken');
      }
    }

    await this.usersRepository.update(id, updateData);
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async changePassword(id: string, passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id }, select: ['id', 'password'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    if (!user.password) {
      throw new BadRequestException('User does not have a password set');
    }
    const isCurrentPasswordValid = await bcrypt.compare(passwordData.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 10);
    
    await this.usersRepository.update(id, { password: hashedNewPassword });
    return { message: 'Password changed successfully' };
  }

  async getAddresses(userId: string): Promise<any[]> {
    // For now, return empty array. In a real app, you'd have an Address entity
    // and fetch addresses related to the user
    return [];
  }

  async createAddress(userId: string, addressData: any): Promise<any> {
    // For now, return the address data with an ID
    // In a real app, you'd save to an Address entity
    return {
      id: Date.now().toString(),
      userId,
      ...addressData,
      createdAt: new Date()
    };
  }

  async updateAddress(userId: string, addressId: string, addressData: any): Promise<any> {
    // For now, return the updated address data
    // In a real app, you'd update the Address entity
    return {
      id: addressId,
      userId,
      ...addressData,
      updatedAt: new Date()
    };
  }

  async deleteAddress(userId: string, addressId: string): Promise<{ message: string }> {
    // For now, just return success message
    // In a real app, you'd delete from Address entity
    return { message: 'Address deleted successfully' };
  }
}
