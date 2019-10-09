import { Controller, Get, Post, Req, Put, Delete, UseGuards, Res } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { Roles } from "../common/roles.decorator"
import { RolesGuard } from '../common/role.guard';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }
    
    @UseGuards(RolesGuard)
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

    @UseGuards(RolesGuard)
    @Put('/:id')
    @Roles('admin')
    updateBook(@Req() book: Request): any {
        return this.booksService.updateBook(book.body, book.params.id);
    }

    @UseGuards(RolesGuard)
    @Delete('/:id')
    @Roles('admin')
    deleteBook(@Req() book: Request): any {
        return this.booksService.deleteBook(book.params.id);
    }

    @UseGuards(RolesGuard)
    @Post()
    @Roles('admin')
    addBook(@Req() book: Request): any {
        return this.booksService.addBook(book.body);
    }
}
