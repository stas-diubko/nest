import { Controller, Get, Post, Req, Put, Delete, UseGuards, Body } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { Roles } from "../common/roles.decorator"
import { RolesGuard } from '../common/role.guard';
import { AddBooksViewModel } from '../models/book.model';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }
    
    @UseGuards(RolesGuard, AuthGuard('jwt'))
    @Put()
    @Roles('admin')
    findAllForAdmin(@Req() books: Request): any {
        return this.booksService.findAllForAdmin(books.body);
    }

    @Get()
    findAllBooks(): any {
        return this.booksService.findAllBooks();
    }
    
    @Get('/:id')
    findOne(@Req() book: Request): any {
        return this.booksService.findOne(book.params.id);
    }

    @UseGuards(RolesGuard, AuthGuard('jwt'))
    @Put('/:id')
    @Roles('admin')
    updateBook(@Req() book: Request){
        return this.booksService.updateBook(book.body, book.params.id);
    }

    @UseGuards(RolesGuard, AuthGuard('jwt'))
    @Delete('/:id')
    @Roles('admin')
    deleteBook(@Req() book: Request): any {
        return this.booksService.deleteBook(book.params.id);
    }

    @UseGuards(RolesGuard, AuthGuard('jwt'))
    @Post()
    @Roles('admin')
    addBook(@Body() book:AddBooksViewModel) {
        return this.booksService.addBook(book);
    } 
}
