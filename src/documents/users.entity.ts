import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';

@Table
export class Users_role extends Model<Users_role> {

  @ForeignKey(() => User)
  @Column
  users_id: number;

  @ForeignKey(() => Role)
  @Column
  roles_id: number;
}

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    field: 'id',
  })
  id: number;

  @Column
  name: string;
    
  @Column
  password: string;

  @Column
  email: string;

  @Column
  image: string;

  @BelongsToMany(() => Role, () => Users_role)
  roleId: Users_role[];
}

@Table
export class Role extends Model<Role> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id',
  })
  id: number;

  @Column
  roleName: string

  @BelongsToMany(() => User, () => Users_role)
  datarole: User[];
}

