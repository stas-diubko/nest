import { Injectable, Inject } from '@nestjs/common';
import { users, users_roles, roles } from './users.entity';
import * as bcrypt from "bcrypt"
import * as jwt from "jwt-then";
import { IsEmail } from 'sequelize-typescript';
import { walidRegister } from '../help/register.valid'
import { getToken } from '../help/actions';
import * as jwtr from "jwt-then";

@Injectable()
export class UsersService {
  constructor(

    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof users,
    @Inject('USER_ROLES_REPO') private readonly USER_ROLES_REPO: typeof users_roles

  ) { }

  async findAll(req, res): Promise<users[]> {
    
    try {
      const allUsers: any = await this.USERS_REPOSITORY.findAll<users>();
     
      let offset = req.body.page * req.body.pageSize
      
      const users: any = await this.USERS_REPOSITORY.findAll<users>({limit: 2, offset:offset});
             
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
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error
      });
    }
  }
  async findOne(req, res): Promise<users[]> {
    let role = await getToken(req.headers.authorization);
    try {
      if(role.isAdmin === 'admin'){
        const user = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['id', 'name', 'email'], where: { id: req.params.id } });
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
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async changeUserData(req, res): Promise<users[]> {
    try {
      const users: any = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });
      if (users) {
        
      await this.USERS_REPOSITORY.update<users>(req.body, { where: { id: req.params.id } });
      
      const user = await this.USERS_REPOSITORY.findOne<users>({where: { id: req.params.id } });

      let permissions: any[] = [];
      await this.USERS_REPOSITORY.findAll<users>({
        where: { id: user.id },
        include: [{
          model: roles,
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
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async getAvatar(req, res): Promise<any> {
    try {
      const users: any = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['image'], where: { id: req.params.id } });
      const avatar = users.dataValues.image
        res.status(200).send({
          success: true,
          data: avatar
        });
    }catch(err){
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async delete(req, res): Promise<any> {
    let token = await getToken(req.headers.authorization);
    
    try {
      if(token.isAdmin){
        const check = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });
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
            message: 'User not found',
            data: null
          });

        }
      }
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async register(req, res): Promise<any> {
     
        const newUser: any = {
          id: null,
          name: req.body.name,
          password: await bcrypt.hash(req.body.pass, 10),
          email: req.body.email,
          image: req.body.imgChange 
        };
        try {
                  
          const matchUser: any = await this.USERS_REPOSITORY.findOne({ where: { email: newUser.email } })

          if (!matchUser) {
            
            await this.USERS_REPOSITORY.create<users>(newUser);
            
            const user: any = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['id'], where: { email: newUser.email } });
            const newId = user.dataValues.id
            const newRole = {
              users_id: newId,
              roles_id: 2
            }
            await this.USER_ROLES_REPO.create<users_roles>(newRole);
            res.status(200).send({
              success: true,
              message: "User Successfully created"
            });
          } else return res.status(401).send({
            success: false,
            errorValid: false,
            message: `User with E-mail:${matchUser.email} alredy exist!`
          });
      } catch (err) {
        
        res.status(500).send({
          success: false,
          message: 'Register failed try again!'
        });
      }
  }
}