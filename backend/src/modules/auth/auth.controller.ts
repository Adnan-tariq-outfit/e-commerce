import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as fs from 'fs/promises';

import { multerConfig } from 'src/common/config/image-upload/multer.config';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { StrictThrottle } from 'src/common/decorators/throttle.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('avatar_url', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account and returns JWT tokens',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerDto: RegisterDto,
  ): Promise<AuthResponseDto> {
    const imageUrl = file ? `uploads/${file.filename}` : undefined;
    try {
      return await this.authService.register(registerDto, imageUrl);
    } catch (error) {
      if (file) {
        await fs.unlink(file.path).catch((err) => {
          console.error(`Failed to delete uploaded file: ${file.path}`, err);
        });
      }
      throw error;
    }
  }

  @Post('login')
  @StrictThrottle()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates user and returns JWT tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('JWT-refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Returns new access and refresh tokens using the refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async refresh(@GetUser('id') userId: string): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logs out the user and invalidates the refresh token',
  })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async logout(@GetUser('id') userId: string): Promise<void> {
    return this.authService.logout(userId);
  }
}
