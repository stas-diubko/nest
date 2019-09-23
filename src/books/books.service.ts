import { Injectable, Inject, HttpException } from '@nestjs/common';
import { books } from './books.entity';
import { Response } from 'express';
import { getRole } from '../help/actions';


@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof books) { }

  async findAll(): Promise<books[]> {
    return await this.BOOKS_REPOSITORY.findAll<books>();
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

  async updatBook(req, res): Promise<any> {
    if(req.params.id) {
      const book = req.body;
      await this.BOOKS_REPOSITORY.update<books>(book, { where: { _id: req.params.id } })
      return res.status(200).send({
        success: true
      });
    } else return res.status(404).send({
      success: false,
      message: 'Requset body is incorrect!',
    });

  }

  async deleteBook(req, res): Promise<any> {
    let role = await getRole(req.headers.authorization);
    try{
      if(role.isAdmin === 'admin'){
        if (req.body) {
        await req.body.forEach(async id => {
            await this.BOOKS_REPOSITORY.destroy({ where: { _id: id } })
        });
          return res.status(200).send({
            success: true
          });
        } else return res.status(404).send({
          success: false,
          message: 'Requset body is incorrect!',
        });
      }
    }catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async addBook(req, res): Promise<any> {
      if (req.body.title){
        const book = req.body;
        await this.BOOKS_REPOSITORY.create<books>(book)
        return res.status(200).send({
          success: true,
          message: 'Add is done!'
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'Requset body is incorrect!',
        });
      }
  }
}