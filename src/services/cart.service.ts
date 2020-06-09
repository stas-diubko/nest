import { Injectable, Inject, HttpException } from '@nestjs/common';
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
      
      return {  
        data: products 
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

  // async updateProduct(product, userId): Promise<any> {
  //     await this.cartRepository.updateProduct(product, product.bookId, product.userId)
  //     return { success: true };
  // }

  async addProduct(dataProduct): Promise<AddProductModel> {
    let product = await this.booksRepository.findOne(dataProduct.bookId);
    let targetProductInCart = await this.cartRepository.findOneProduct(dataProduct.userId, dataProduct.bookId, 'pending');
    if(!product) throw new HttpException('Product not found', 404);
    if(!targetProductInCart) {
      dataProduct.cartStatus = 'pending';
      dataProduct.quantity = 1;
      dataProduct.cartPrice = product.price;
      await this.cartRepository.addProduct(dataProduct);
    } else {
      return { success: true, message: 'Product already added to cart' };
    }

    return { success: true, message: 'Product added to cart' };
  }
}