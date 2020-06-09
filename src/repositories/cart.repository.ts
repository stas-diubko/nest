import { Injectable, Inject } from '@nestjs/common';
import { Cart, Book, User } from '../documents';


@Injectable()
export class CartRepository {
    @Inject('CART_REPOSITORY') public CART_REPOSITORY: typeof Cart
        
    async findAllProducts(userId){
        return  this.CART_REPOSITORY.findAll<Cart>({ where: { userId: userId }, include: [Book, User]});
    }

    async findOneProduct(userId: number, bookId: number, cartStatus: string){
        return  this.CART_REPOSITORY.findOne<Cart>({ where: { userId, bookId, cartStatus}});
    }
        
    // async incrementProduct(id: string){
    //     return this.CART_REPOSITORY.destroy({ where: { _id: id } })
    // }

    async addProduct(product: Cart){
        return this.CART_REPOSITORY.create<Cart>(product)
    }

    async updateProduct(product: any){
        return this.CART_REPOSITORY.update<Cart>(product, { where: { id: product.id }})
    }

    async deleteProduct(userId, bookId){
        return this.CART_REPOSITORY.destroy({where: {userId, bookId}})
    }
}