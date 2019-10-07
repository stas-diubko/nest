import { Injectable, Inject } from '@nestjs/common';
import { Book } from '../documents/books.entity';
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

  async findOne(book): Promise<GetOneBookModel> {
    let currentBook: any = await this.booksRepository.findOne(book.params.id);
    
    if(currentBook){
      return { 
        data: currentBook 
      };
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

  async deleteBook(book): Promise<DeleteBookModel> {
    // let token = await getToken(book.headers.authorization);
    
      // if(token.role == "admin"){
        await this.booksRepository.deleteBook(book.params.id)
          return { success: true };
      // }
  }

  async addBook(book): Promise<AddBookModel> {
      const currentBook = book.body;
      await this.booksRepository.addBook(currentBook)
      return { success: true, message: 'Add is done!' };
  }
}