import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Book } from '../documents/books.entity';
import { Response } from 'express';
import { getToken } from '../common/actions';
import { AddBookModel, DeleteBookModel, UpdateBookModel, GetOneBookModel, GetAllBooksModel, GetAllBooksForAdminModel } from '../models/book.model';
import { BooksRepository } from '../repositories';

@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof Book,
    public booksRepository: BooksRepository 
    ) { }

  async findAllForAdmin(books): Promise<GetAllBooksForAdminModel> {
   
      const currentBooks:any = await this.booksRepository.findAllForAdmin();
      if (books.body.isSort) {
        currentBooks.sort(function(a, b) {
          if (a.author < b.author) {
              return 1;
          }
          if (a.author > b.author) {
              return -1;
          }
          return 0;
      });
      }
      
      const newArr = currentBooks.slice(books.body.page, books.body.page + books.body.pageSize)
       
      return { success: true, data: newArr, booksLength: currentBooks.length };
  }

  async findAllBooks(): Promise<GetAllBooksModel> {
      const books:any = await this.booksRepository.findAllBooks();
      return { success: true,  data: books };
  }

  async findOne(book): Promise<GetOneBookModel> {
    let currentBook: any = await this.booksRepository.findOne(book.params.id);
    
    if(currentBook){
      return { success: true, data: currentBook };
    }
    
  }

  async updateBook(book): Promise<UpdateBookModel> {
    
    const books = await this.booksRepository.findOne(book.params.id)
   
    if(books) {
      const currentBook = book.body;
      await this.booksRepository.updateBook(currentBook, book.params.id )
      return { success: true };
    }
  }

  async deleteBook(req, res): Promise<DeleteBookModel> {
    let token = await getToken(req.headers.authorization);
    
      if(token.isAdmin){
        await this.BOOKS_REPOSITORY.destroy({ where: { _id: req.params.id } })
          return res.status(200).send({
            success: true
          });
      }
      else return res.status(404).send({
          success: false,
          message: 'Requset body is not correct!',
        });
  }

  async addBook(req, res): Promise<AddBookModel> {
      const book = req.body;

      await this.BOOKS_REPOSITORY.create<Book>(book)
      return res.status(200).send({
        success: true,
        message: 'Add is done!'
      });
  }
}