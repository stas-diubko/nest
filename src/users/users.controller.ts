import { Controller, Get, Post, Req, Res, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import * as Request1 from "@nestjs/common"

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }
    @UseGuards(AuthGuard('jwt'))
    @Put()
    findAll(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.findAll(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/avatar/:id')
    getAvatar(@Req() req: Request, @Res() res: Response) {
        return this.usersService.getAvatar(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/avatar/:id')
    changeUserData(@Req() req: Request, @Res() res: Response) {
        return this.usersService.changeUserData(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    findOne(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.findOne(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    delete(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.delete(req, res);
    }

    @Post('/register')
    register(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.register(req, res);
    }

}
