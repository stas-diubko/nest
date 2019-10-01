import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Auth extends Model<Auth> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    field: '_id',
  })
  _id: number;

  @Column
  password: string;

  @Column
  email: string;
}