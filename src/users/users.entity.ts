import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';

@Table
export class Users_roles extends Model<Users_roles> {

  @ForeignKey(() => Users)
  @Column
  users_id: number;

  @ForeignKey(() => Roles)
  @Column
  roles_id: number;
}

@Table
export class Users extends Model<Users> {
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

  @BelongsToMany(() => Roles, () => Users_roles)
  roleId: Users_roles[];
}

@Table
export class Roles extends Model<Roles> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id',
  })
  id: number;

  @Column
  roleName: string

  @BelongsToMany(() => Users, () => Users_roles)
  datarole: Users[];
}

