import { Cart } from '../documents/cart.entity';

export const cartProviders = [
  {
    provide: 'CART_REPOSITORY',
    useValue: Cart,
  },
];