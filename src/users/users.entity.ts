import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';

@Table
export class users_roles extends Model<users_roles> {

  @ForeignKey(() => users)
  @Column
  users_id: number;

  @ForeignKey(() => roles)
  @Column
  roles_id: number;
}

@Table
export class users extends Model<users> {
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

  @BelongsToMany(() => roles, () => users_roles)
  roleId: users_roles[];
}

@Table
export class roles extends Model<roles> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id',
  })
  id: number;

  @Column
  roleName: string


  @BelongsToMany(() => users, () => users_roles)
  datarole: users[];
}

