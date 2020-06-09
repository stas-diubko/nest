import { Table, Column, Model, DataType, ForeignKey, Default, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { User } from './users.entity';
import { Book } from './books.entity';

@Table
export class Cart extends Model<Cart> {

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    field: 'id',
  })
  id: number;
  
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Book)
  @Column
  bookId: number;
  
  @Column
  quantity: number;

  @Column
  cartPrice: number;

  @Column
  cartStatus: string;

  @BelongsTo(() => User)
  user: User[]

  @BelongsTo(() => Book)
  book: Book[]
}
