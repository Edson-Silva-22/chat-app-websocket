import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.signIn(createAuthDto);
    
  }

  @Get('verifyToken')
  async verifyToken(@Req() request: Request) {
    return await this.authService.verifyToken(request);
  }
}
