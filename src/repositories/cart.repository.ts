import { Injectable, Inject } from '@nestjs/common';
import { Cart } from '../documents';


@Injectable()
export class CartRepository {
    @Inject('CART_REPOSITORY') public CART_REPOSITORY: typeof Cart
        
    async findAllProducts(userId){
        return  this.CART_REPOSITORY.findAll<Cart>({ where: { userId: userId }});
    }
        
    // async incrementProduct(id: string){
    //     return this.CART_REPOSITORY.destroy({ where: { _id: id } })
    // }

    async addProduct(product: Cart){
        return this.CART_REPOSITORY.create<Cart>(product)
    }

    async updateProduct(product: Cart, id:any, userId:any){
        return this.CART_REPOSITORY.update<Cart>(product, { where: { bookId: id, userId: userId }})
    }
    async deleteProduct(userId, bookId){
        return this.CART_REPOSITORY.destroy({where: {userId, bookId}})
    }
}