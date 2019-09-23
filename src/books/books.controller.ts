import { Controller, Get, Post, Req, Put, Delete, UseGuards, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(): any {
        return this.booksService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/takeEditBook/:id')
    findOne(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.findOne(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    updatBook(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.updatBook(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/deleteBooks')
    deleteBook(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.deleteBook(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    addBook(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.addBook(req, res);
    }
}
