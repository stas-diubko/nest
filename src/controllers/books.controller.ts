import { Controller, Get, Post, Req, Put, Delete, UseGuards, Res, SetMetadata } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import {Roles} from "../common/roles.decorator"
import { RolesGuard } from '../common/role.guard';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }
    
    @UseGuards(AuthGuard('jwt'))
    @Put()
    findAllForAdmin(@Req() books: Request): any {
        return this.booksService.findAllForAdmin(books);
    }

    @Get()
    findAllBooks(): any {
        return this.booksService.findAllBooks();
    }
    
    @Get('/:id')
    findOne(@Req() book: Request): any {
        return this.booksService.findOne(book);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    updateBook(@Req() book: Request): any {
        return this.booksService.updateBook(book);
    }

    @UseGuards(RolesGuard)
    @Delete('/:id')
    @Roles('admin')
    deleteBook(@Req() book: Request): any {
        return this.booksService.deleteBook(book);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    addBook(@Req() book: Request): any {
        return this.booksService.addBook(book);
    }
}
