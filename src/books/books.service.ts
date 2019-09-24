import { Injectable, Inject, HttpException } from '@nestjs/common';
import { books } from './books.entity';
import { Response } from 'express';
import { getToken } from '../help/actions';


@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof books) { }

  async findAll(res): Promise<books[]> {
  
    try{
       const books:any = await this.BOOKS_REPOSITORY.findAll<books>();
      return res.status(200).send({
      success: true,
      data: books
    });
    } catch(error) {
      res.status(500).send({
        success: false,
        message: error
      });
    }
    
  }

  async findOne(req, res): Promise<books> {
    let book: any = await this.BOOKS_REPOSITORY.findOne<books>({ where: { _id: req.params.id } });
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
      const books = await this.BOOKS_REPOSITORY.findOne<books>({ where: { _id: req.params.id } })

     if(books) {
      const book = req.body;
      await this.BOOKS_REPOSITORY.update<books>(book, { where: { _id: req.params.id } })
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

            await this.BOOKS_REPOSITORY.create<books>(book)
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