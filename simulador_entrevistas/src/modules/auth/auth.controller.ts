import { Controller, Post, Get, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

interface RequestConGoogleUser {
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente con token' })
  @ApiResponse({ status: 400, description: 'El correo ya existe o datos inválidos' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({ status: 200, description: 'Login correcto, retorna access_token' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Inicia el flujo de login con Google' })
  googleAuth() {
    // El guard redirige a Google; este método no ejecuta nada.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback de Google: emite el JWT y redirige al frontend' })
  async googleCallback(@Req() req: RequestConGoogleUser, @Res() res: Response) {
    const { access_token } = await this.authService.validateGoogleUser(req.user);
    const frontend =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    return res.redirect(`${frontend}/auth/callback?token=${access_token}`);
  }
}
