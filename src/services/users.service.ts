import { Injectable } from '@nestjs/common';
import { Role } from '../documents/users.entity';
import * as bcrypt from "bcrypt";
import { getToken } from '../common/actions';
import * as jwtr from "jwt-then";
import {UserRegisterModel, UserDeleteModel, GetAvatarModel, UpdateUserModel, GetUsersModel, GetOneUserModel} from '../models/user.model';
import { jwtConstants } from '../secrets/jwtSecretKey';
import { UsersRepository, UserRolesRepository } from '../repositories';

@Injectable()
export class UsersService {
  constructor(
    public usersRepository: UsersRepository,
    public userRolesRepository: UserRolesRepository
  ) { }

  async findAll(user): Promise<GetUsersModel> {

    const allUsers: any = await this.usersRepository.findAll(user);
    
    let offset = user.body.page * user.body.pageSize
    
    const users: any = await this.usersRepository.findAll({limit: user.body.pageSize, offset:offset});
            
    if (users.length !== 0) {
      return {
        data: users,
        usersLength: allUsers.length
      };
    } 
  }

  async findOne(user): Promise<GetOneUserModel> {
    let role = await getToken(user.headers.authorization);
    if(role.isAdmin === 'admin'){
      const targetUser = await this.usersRepository.findOne({ attributes: ['id', 'name', 'email'], where: { id: user.params.id } });
      return { 
        data: targetUser 
      }
    }
  }

  async updateUser(user): Promise<UpdateUserModel> {
     
    const users: any = await this.usersRepository.findOne({ where: { id: user.params.id } });
    
    if (users) {
      
    await this.usersRepository.updateUser(user.body, { where: { id: user.params.id } });
    
    const targetUser = await this.usersRepository.findOne({where: { id: user.params.id } });
        
    let permissions: any[] = [];
        
    await this.usersRepository.findAll(
      {
      where: { id:  targetUser.dataValues.id },
      include: [{
        model: Role,
      }]
    }
    ).then((rolen: any) => rolen.forEach(el => {
      el.roleId.forEach(element => {
        permissions.push(element.dataValues.roleName);
      });
    }))
   
    let isAdmin = false;

    if(permissions[0] == 'admin') {
      isAdmin = true
    }

    const userChanged = {
      id: targetUser.dataValues.id,
      name:  targetUser.dataValues.name,
      email:  targetUser.dataValues.email,
      isAdmin: isAdmin,
    };

    const token = await jwtr.sign(userChanged, jwtConstants.secret)

      return { 
        success: true, 
        data: token 
      };
    } 
  }

  async getAvatar(user): Promise<GetAvatarModel> {
    const users: any = await this.usersRepository.findOne({ attributes: ['image'], where: { id: user.params.id } });
    const avatar = users.dataValues.image
    return {
      data: avatar 
    };
  }

  async delete(user): Promise<UserDeleteModel> {
    let token = await getToken(user.headers.authorization);
    
      if(token.isAdmin){
        const check = await this.usersRepository.findOne({ where: { id: user.params.id } });
        if (check) {
          await this.userRolesRepository.destroyUserRoles({ where: { users_id: user.params.id } });
          await this.usersRepository.delete({ where: { id: user.params.id } });
          return { 
            success: true,  
            message: 'Delete is done' 
          };
        } 
        }
  }

  async register(user): Promise<UserRegisterModel> {
      
    const newUser: any = {
      id: null,
      name: user.body.name,
      password: await bcrypt.hash(user.body.password, 10),
      email: user.body.email,
      image: user.body.imgChange 
    };
              
      const matchUser: any = await this.usersRepository.findOne({ where: { email: newUser.email } })
      
      if (!matchUser) {
        
        await this.usersRepository.register(newUser);
        
        const user: any = await this.usersRepository.findOne({ attributes: ['id'], where: { email: newUser.email } });
        const newId = user.dataValues.id
        const newRole = {
          users_id: newId,
          roles_id: 2
        }

        await this.userRolesRepository.create(newRole);
        
        return { 
          success: true,  
          message: "User successfully created" 
        };
      } 
  }
   
}
