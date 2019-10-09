import { Injectable, Inject } from '@nestjs/common';
import { AddBookModel, UpdateBookModel, GetAllBooksModel, GetAllBooksForAdminModel } from '../models/book.model';
import { BooksRepository } from '../repositories';

@Injectable()
export class BooksService {
  constructor(
      public booksRepository: BooksRepository
    ) { }

  async findAllForAdmin(booksBody): Promise<GetAllBooksForAdminModel> {

      const currentBooks = await this.booksRepository.findAllForAdmin();
      
      if (booksBody.isSort) {
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
      
      const newArr = currentBooks.slice(booksBody.page, booksBody.page + booksBody.pageSize)
       
      return { 
        data: newArr, 
        booksLength: currentBooks.length 
      };
  }

  async findAllBooks(): Promise<GetAllBooksModel> {
      const books:any = await this.booksRepository.findAllBooks();
      return {  
        data: books 
      };
  }

  async findOne(bookId): Promise<GetAllBooksModel> {

    let currentBook = await this.booksRepository.findOne(bookId);
    
    if(currentBook){
      return { 
        data: currentBook 
      };
    }
    
  }

  async updateBook(bookBody, bookId): Promise<UpdateBookModel> {

    const books = await this.booksRepository.findOne(bookId)
   
    if(books) {
      const currentBook = bookBody;
      await this.booksRepository.updateBook(currentBook, bookId )
      return { success: true };
    }

  }

  async deleteBook(bookId): Promise<UpdateBookModel> {
        await this.booksRepository.deleteBook(bookId)
          return { success: true };
  }

  async addBook(book): Promise<AddBookModel> {
      await this.booksRepository.addBook(book)
      return { success: true, message: 'Add is done!' };
  }
}