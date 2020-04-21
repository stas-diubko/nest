import { Controller, Get, Post, Req, Put, Delete, UseGuards, Body } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { Roles } from "../common/roles.decorator"
import { RolesGuard } from '../common/role.guard';
import { AddCartViewModel } from '../models/cart.model';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }
    
    @UseGuards(AuthGuard('jwt'))
    @Post()
    addBook(@Body() product:AddCartViewModel) {
        return this.cartService.addProduct(product);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    findAllBooks(@Req() req: Request) {
        return this.cartService.findAllProducts(req.params.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/length/:id')
    getCartLength(@Req() req: Request) {
        return this.cartService.getCartLength(req.params.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    updateProduct(@Body() product: AddCartViewModel, @Req() req: Request) {
        return this.cartService.updateProduct(product, req.params.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id/:bookId')
    delete(@Req() req: Request) {
        // console.log(req.params);
        return this.cartService.deleteProduct(req.params.id, req.params.bookId)
    }
}