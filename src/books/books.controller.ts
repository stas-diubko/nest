import { Controller, Get, Post, Req, Put, Delete, UseGuards, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }
    
    @UseGuards(AuthGuard('jwt'))
    @Put()
    findAllForAdmin(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.findAllForAdmin(req, res);
    }

    @Get()
    findAllBooks(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.findAllBooks(req, res);
    }
    
    @Get('/:id')
    findOne(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.findOne(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    updateBook(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.updateBook(req, res);
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
