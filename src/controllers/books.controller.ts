import { Controller, Get, Post, Req, Put, Delete, UseGuards, Res } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';

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

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteBook(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.deleteBook(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    addBook(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.addBook(req, res);
    }
}
