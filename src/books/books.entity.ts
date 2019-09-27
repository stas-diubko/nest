import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Books extends Model<Books> {

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
}
