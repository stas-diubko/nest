import { Injectable, Inject } from '@nestjs/common';
import { User, Users_role, Role } from '../documents/users.entity';
import * as bcrypt from "bcrypt"
import * as jwt from "jwt-then";
import { IsEmail } from 'sequelize-typescript';
import { getToken } from '../common/actions';
import * as jwtr from "jwt-then";
import {UserRegisterModel, UserDeleteModel, GetAvatarModel, UpdateUserModel} from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(

    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof User,
    @Inject('USER_ROLES_REPO') private readonly USER_ROLES_REPO: typeof Users_role

  ) { }

  async findAll(req, res): Promise<User[]> {
    
      const allUsers: any = await this.USERS_REPOSITORY.findAll<User>();
     
      let offset = req.body.page * req.body.pageSize
      
      const users: any = await this.USERS_REPOSITORY.findAll<User>({limit: req.body.pageSize, offset:offset});
             
      if (users.length !== 0) {
        return res.status(200).send({
          success: true,
          data: users,
          usersLength: allUsers.length
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'Users not found',
          data: null
        });
      }
  }

  async findOne(req, res): Promise<User[]> {
    let role = await getToken(req.headers.authorization);
    
      if(role.isAdmin === 'admin'){
        const user = await this.USERS_REPOSITORY.findOne<User>({ attributes: ['id', 'name', 'email'], where: { id: req.params.id } });
        if (user) {
          return res.status(200).send({
            success: true,
            data: user
          });
        } else {
          return res.status(404).send({
            success: false,
            message: 'User not found',
            data: null
          });
        }
      }
  }

  async changeUserData(req, res): Promise<UpdateUserModel> {
   
      const users: any = await this.USERS_REPOSITORY.findOne<User>({ where: { id: req.params.id } });
      if (users) {
        
      await this.USERS_REPOSITORY.update<User>(req.body, { where: { id: req.params.id } });
      
      const user = await this.USERS_REPOSITORY.findOne<User>({where: { id: req.params.id } });

      let permissions: any[] = [];

      await this.USERS_REPOSITORY.findAll<User>({
        where: { id: user.id },
        include: [{
          model: Role,
        }]
  
      }).then((rolen: any) => rolen.forEach(el => {
        el.roleId.forEach(element => {
          permissions.push(element.dataValues.roleName);
        });
      }))
        
      let isAdmin = false;
  
      if(permissions[0] == 'admin') {
        isAdmin = true
      }
  
      const userChanged = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: isAdmin,
      };
  
      const token = await jwtr.sign(userChanged, 'secret')

        return res.status(200).send({
          success: true,
          data: token
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'Users not found',
          data: null
        });
      }
  }

  async getAvatar(req, res): Promise<GetAvatarModel> {
    console.log(2121651);
    
      const users: any = await this.USERS_REPOSITORY.findOne<User>({ attributes: ['image'], where: { id: req.params.id } });
      const avatar = users.dataValues.image
      return res.status(200).send({
          success: true,
          data: avatar
        });
  }

  async delete(req, res): Promise<UserDeleteModel> {
    let token = await getToken(req.headers.authorization);
    
      if(token.isAdmin){
        const check = await this.USERS_REPOSITORY.findOne<User>({ where: { id: req.params.id } });
        if (check) {
          await this.USER_ROLES_REPO.destroy({ where: { users_id: req.params.id } });
          await this.USERS_REPOSITORY.destroy({ where: { id: req.params.id } });
          return res.status(200).send({
            success: true,
            message: 'Delete is done'
          });
        } else {
          return res.status(404).send({
            success: false,
            message: 'User not found'
          });

        }
      }
  }

  async register(req, res): Promise<UserRegisterModel> {
      
      const newUser: any = {
        id: null,
        name: req.body.name,
        password: await bcrypt.hash(req.body.password, 10),
        email: req.body.email,
        image: req.body.imgChange 
      };
                
        const matchUser: any = await this.USERS_REPOSITORY.findOne({ where: { email: newUser.email } })
        
        if (!matchUser) {
          
          await this.USERS_REPOSITORY.create<User>(newUser);
          
          const user: any = await this.USERS_REPOSITORY.findOne<User>({ attributes: ['id'], where: { email: newUser.email } });
          const newId = user.dataValues.id
          const newRole = {
            users_id: newId,
            roles_id: 2
          }
          await this.USER_ROLES_REPO.create<Users_role>(newRole);
          res.status(200).send({
            success: true,
            message: "User Successfully created"
          });
        } else return res.status(401).send({
          success: false,
          errorValid: false,
          message: `User with E-mail:${matchUser.email} alredy exist!`
        });
  }
}