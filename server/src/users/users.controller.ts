import { Controller, Get, Param, UseGuards, Patch, Body, Post, Delete, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.usersService.updateProfile(req.user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@Request() req: any, @Body() passwordData: { currentPassword: string; newPassword: string }) {
    return this.usersService.changePassword(req.user.id, passwordData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  getAddresses(@Request() req: any) {
    return this.usersService.getAddresses(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  createAddress(@Request() req: any, @Body() addressData: any) {
    return this.usersService.createAddress(req.user.id, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('addresses/:id')
  updateAddress(@Request() req: any, @Param('id') id: string, @Body() addressData: any) {
    return this.usersService.updateAddress(req.user.id, id, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:id')
  deleteAddress(@Request() req: any, @Param('id') id: string) {
    return this.usersService.deleteAddress(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
