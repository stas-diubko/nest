import { Injectable, Inject } from '@nestjs/common';
import { AddProductModel, GetAllProductsModel } from '../models/cart.model';
import { CartRepository, BooksRepository } from '../repositories';

@Injectable()
export class CartService {
  constructor(
      public cartRepository: CartRepository,
      public booksRepository: BooksRepository
    ) { }

  async findAllProducts(userId): Promise<GetAllProductsModel> {
      const products = await this.cartRepository.findAllProducts(userId);
      let books = await this.booksRepository.findAllBooks()
      let targetProducts = []
      for(let i = 0; i < books.length; i++) {
        for (let g = 0; g < products.length; g++) {
          if (books[i]._id == products[g].bookId) {
            targetProducts.push({
              userId: products[g].userId,
              bookId: books[i]._id,
              title: books[i].title,
              author: books[i].author,
              description: books[i].description,
              price: books[i].price,
              bookImage: books[i].bookImage,
              quantity: products[g].quantity
            })
          }
        }
      }

      return {  
        data: targetProducts 
      };
  }
  async getCartLength(userId): Promise<any> {
    const products = await this.cartRepository.findAllProducts(userId);
    let books = await this.booksRepository.findAllBooks()
    let targetProducts = []
    for(let i = 0; i < books.length; i++) {
      for (let g = 0; g < products.length; g++) {
        if (books[i]._id == products[g].bookId) {
          targetProducts.push({
            userId: products[g].userId,
            bookId: books[i]._id,
            title: books[i].title,
            author: books[i].author,
            description: books[i].description,
            price: books[i].price,
            bookImage: books[i].bookImage,
            quantity: products[g].quantity
          })
        }
      }
    }

    let isLength = false;
    if (targetProducts.length !== 0) {
      isLength = true;
    }
    return {  
      data: isLength
    };
}

  async deleteProduct(userId, bookId): Promise<any> {
    await this.cartRepository.deleteProduct(userId, bookId)
  }

  async updateProduct(product, userId): Promise<any> {
      await this.cartRepository.updateProduct(product, product.bookId, product.userId)
      return { success: true };
  }

  async addProduct(product): Promise<AddProductModel> {
    let targetProducts:any = await this.cartRepository.findAllProducts(product.userId);
    let index = targetProducts.findIndex((i:any) => i.bookId == product.bookId);
    if (index == -1) {
      await this.cartRepository.addProduct(product)
    }
    return { success: true, message: 'Add is done!' };
  }
}