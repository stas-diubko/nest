import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Cart extends Model<Cart> {

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  
  @Column
  userId: number;

  @Column
  bookId: number;
  
  @Column
  quantity: number;
}
