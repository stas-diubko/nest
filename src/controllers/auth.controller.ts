import { Controller, Get, Request, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post()
    async login(@Req() user: Request){
        return this.authService.login(user);
    }
}

 