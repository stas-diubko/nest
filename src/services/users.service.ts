import { Injectable } from '@nestjs/common';
import { Role } from '../documents/users.entity';
import * as bcrypt from "bcrypt";
import * as jwtr from "jwt-then";
import { UserBaseModel, GetAvatarModel, UpdateUserModel, GetUsersModel } from '../models/user.model';
import { jwtConstants } from '../secrets/jwtSecretKey';
import { UsersRepository, UserRolesRepository } from '../repositories';
import { HttpException } from "@nestjs/common"

@Injectable()
export class UsersService {
  constructor(
    public usersRepository: UsersRepository,
    public userRolesRepository: UserRolesRepository
  ) { }

  async findAll(userBody): Promise<GetUsersModel> {
    
    const allUsers: any = await this.usersRepository.findAll(userBody);
    
    let offset = userBody.page * userBody.pageSize
    
    const users: any = await this.usersRepository.findAll({limit: userBody.pageSize, offset:offset});
            
    if (users.length !== 0) {
      return {
        data: users,
        usersLength: allUsers.length
      };
    } 
  }

  async updateUser(userBody, userId): Promise<UpdateUserModel> {
    
    const users: any = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (users) {
      
    await this.usersRepository.updateUser(userBody, { where: { id: userId } });
        
    const targetUser = await this.usersRepository.findOne({where: { id: userId } });
    
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
   
    const userChanged = {
      id: targetUser.dataValues.id,
      name:  targetUser.dataValues.name,
      email:  targetUser.dataValues.email,
      role: permissions[0],
    };

    const token = await jwtr.sign(userChanged, jwtConstants.secret)

      return { 
        success: true, 
        data: token 
      };
    } 
  }

   async updateUserPassword(body, userId): Promise<any> {
       
    let users: any = await this.usersRepository.findOne({ where: { id: userId } });
  
    let isPasswordValid = await bcrypt.compare(body.currentPassword, users.password)
  
    if (isPasswordValid) {
      let newPass = {
        password: await bcrypt.hash(body.newPassword, 10)
      }
      
      await this.usersRepository.updateUser(newPass, { where: { id: userId } });
      return { 
        success: true, 
        data: 'Password successfully updated!' 
      };
    } else {
        return { 
          success: false, 
          data: 'Data is not correct!' 
        };
    }

  }

  async findOne(userId): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (user) return user;
      else throw new HttpException('User not found', 404);
  } 

  async getAvatar(avatarId): Promise<GetAvatarModel> {
    const users: any = await this.usersRepository.findOne({ attributes: ['image'], where: { id: avatarId } });
    const avatar = users.dataValues.image
    return {
      data: avatar 
    };
  }

  async delete(userId): Promise<UserBaseModel> {
        const check = await this.usersRepository.findOne({ where: { id: userId } });
        if (check) {
          await this.userRolesRepository.destroyUserRoles({ where: { users_id: userId } });
          await this.usersRepository.delete({ where: { id: userId } });
          return { 
            success: true,  
            message: 'Delete is done' 
          };
        }
         else throw new HttpException('User not found', 404);
  }

  async register(userBody): Promise<UserBaseModel> {
      
    const newUser: any = {
      id: null,
      name: userBody.name,
      password: await bcrypt.hash(userBody.password, 10),
      email: userBody.email,
      image: userBody.image
    };
              
      const matchUser: any = await this.usersRepository.findOne({ where: { email: newUser.email } })
      
      if (!matchUser) {
        
        let user = await this.usersRepository.register(newUser);
        
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
      } else throw new HttpException('User already exists', 401);
  }
   
}