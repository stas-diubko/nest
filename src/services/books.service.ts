import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Book } from '../documents/books.entity';
import { Response } from 'express';
import { getToken } from '../common/actions';
import { AddBookModel, DeleteBookModel, UpdateBookModel, GetOneBookModel, GetAllBooksModel, GetAllBooksForAdminModel } from '../models/book.model';

@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof Book) { }

  async findAllForAdmin(req, res): Promise<GetAllBooksForAdminModel> {
  
      const allBooks: any = await this.BOOKS_REPOSITORY.findAll<Book>();
      
      const books:any = await this.BOOKS_REPOSITORY.findAll<Book>();
      if (req.body.isSort) {
        books.sort(function(a, b) {
          if (a.author < b.author) {
              return 1;
          }
          if (a.author > b.author) {
              return -1;
          }
          return 0;
      });
      }
      
      const newArr = books.slice(req.body.page, req.body.page + req.body.pageSize)
       
      return res.status(200).send({
      success: true,
      data: newArr,
      booksLength: allBooks.length
    });
  }

  async findAllBooks(req, res): Promise<GetAllBooksModel> {
    
      const books:any = await this.BOOKS_REPOSITORY.findAll<Book>();
      
      return res.status(200).send({
      success: true,
      data: books
    });
  }

  async findOne(req, res): Promise<GetOneBookModel> {
    let book: any = await this.BOOKS_REPOSITORY.findOne<Book>({ where: { _id: req.params.id } });
    
    if(book){
      return res.status(200).send({
        success: true,
        data: book
      });
    }else{
      return res.status(404).send({
        success: false,
        message: 'Requset body is incorrect!',
      });
    }
  }

  async updateBook(req, res): Promise<UpdateBookModel> {
    const books = await this.BOOKS_REPOSITORY.findOne<Book>({ where: { _id: req.params.id } })

    if(books) {
      const book = req.body;
      await this.BOOKS_REPOSITORY.update<Book>(book, { where: { _id: req.params.id } })
      return res.status(200).send({
        success: true
      });
    } else return res.status(404).send({
      success: false,
      message: 'Book not found!',
    }); 
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