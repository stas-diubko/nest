import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Cart } from './cart.entity';

@Table
export class Book extends Model<Book> {

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    field: '_id',
  })
  _id: number;
  
  @Column
  title: string;

  @Column
  author: string;

  @Column
  description: string;

  @Column
  price: string;

  @Column
  bookImage: string;

  @HasMany(() => Cart)
  bookId
}
