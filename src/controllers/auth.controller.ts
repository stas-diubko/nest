import { Controller, Get, Post, Req, Res, UseGuards, Put } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express'
import { ApiImplicitBody } from '@nestjs/swagger';
import { UserLoginModel } from '../swager/register-model';

@Controller('login')
export class AuthController {
    constructor(
        private readonly authService: AuthService,

    ) { }

    @UseGuards(AuthGuard('local'))
    @Post()
    @ApiImplicitBody({name:'loginUser', type: UserLoginModel})
    async login(@Req() req: Request){
        return this.authService.login(req);
    }

    @Put('/reset-password')
    resetPassword(@Req() body: Request) {
        return this.authService.resetPassword(body.body.email);
    }

    @Put('/reset-user-password/:id')
    resetUserPassword(@Req() user: Request){
        return this.authService.resetUserPassword(user.body, user.params.id);
    }
}

 