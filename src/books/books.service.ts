import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Books } from './books.entity';
import { Response } from 'express';
import { getToken } from '../help/actions';

@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof Books) { }

  async findAllForAdmin(req, res): Promise<Books[]> {
  
    try{
      const allBooks: any = await this.BOOKS_REPOSITORY.findAll<Books>();
      
      const books:any = await this.BOOKS_REPOSITORY.findAll<Books>();
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
    catch(error) {
      res.status(500).send({
        success: false,
        message: error
        
      });
    }
  }

  async findAllBooks(req, res): Promise<Books[]> {
    try{
      const books:any = await this.BOOKS_REPOSITORY.findAll<Books>();
      
      return res.status(200).send({
      success: true,
      data: books,
      
    });
    } 
    catch(error) {
      res.status(500).send({
        success: false,
        message: error
        
      });
    }
  }

  async findOne(req, res): Promise<Books> {
    let book: any = await this.BOOKS_REPOSITORY.findOne<Books>({ where: { _id: req.params.id } });
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

  async updateBook(req, res): Promise<any> {
    try {
      const books = await this.BOOKS_REPOSITORY.findOne<Books>({ where: { _id: req.params.id } })

     if(books) {
      const book = req.body;
      await this.BOOKS_REPOSITORY.update<Books>(book, { where: { _id: req.params.id } })
      return res.status(200).send({
        success: true
      });
    } else return res.status(404).send({
      success: false,
      message: 'Book not found!',
    }); 
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error
      });
    }
    
  }

  async deleteBook(req, res): Promise<any> {
    let token = await getToken(req.headers.authorization);
    
    try{
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
    }catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async addBook(req, res): Promise<any> {
    try{
      const book = req.body;

      await this.BOOKS_REPOSITORY.create<Books>(book)
      return res.status(200).send({
        success: true,
        message: 'Add is done!'
      });
    }
     catch (error) {
       res.status(404).send({
          success: false,
          message: error
        });
     }
  }
}