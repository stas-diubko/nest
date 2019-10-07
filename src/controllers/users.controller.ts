import { Controller, Get, Post, Req, Res, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import * as Request1 from "@nestjs/common"
import { Roles } from "../common/roles.decorator"
import { RolesGuard } from '../common/role.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }
    @UseGuards(AuthGuard('jwt'))
    @Put()
    findAll(@Req() user: Request): any {
        return this.usersService.findAll(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/avatar/:id')
    getAvatar(@Req() avatar: Request) {
        return this.usersService.getAvatar(avatar);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/avatar/:id')
    updateUser(@Req() user: Request) {
        return this.usersService.updateUser(user);
    }

    @UseGuards(RolesGuard)
    @Delete('/:id')
    @Roles('admin')
    delete(@Req() user: Request): any {
        return this.usersService.delete(user);
    }

    @Post('/register')
    register(@Req() user: Request): any {
        return this.usersService.register(user);
    }

}
