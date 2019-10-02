import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt"
import { User, Role } from '../documents/users.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from "@nestjs/common"
import { ConfigService } from './config.service';
import * as jwtr from "jwt-then";
import { jwtConstants } from '../secrets/jwtSecretKey';
// import { validLogin } from '../help/login.valid';

const validLogin = (email, password) =>{
 
    const errorObj = {
      logErrorEmail: '',
      logErrorPassword: ''
    }

    let stateValid = 0;

    const emailRegExpr = new RegExp(/^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.([a-z]{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/i);

    if (!emailRegExpr.test(email)) {
        errorObj.logErrorEmail = 'Error: Email is not valid!';
        
    } else {++stateValid}

    if (password.length < 5) {
        errorObj.logErrorPassword = 'Error: Password must be more than four characters';
    } else {++stateValid}

    return {
      errorObj: errorObj,
      stateValid: stateValid
  }
}

@Injectable()

export class AuthService{
  private test: any;
  public jwtService: JwtService;
  @Inject('AUTH_REPOSITORY') private readonly AUTH_REPOSITORY: typeof User

  constructor(config: ConfigService) {
    this.test = config.get('APP');
  }

  async validateUser(email: string, password: string): Promise<any> {
    
    let loginValid = await validLogin(email, password)
    
    if(loginValid.stateValid !== 2 ){
      throw new HttpException(loginValid.errorObj, 404);
    }
    
    const user: any = await this.AUTH_REPOSITORY.findOne<User>({ where: { email: email } })
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const matchPasswords = await bcrypt.compare(password, user.dataValues.password);
    if (user && matchPasswords) {
      return user.dataValues;
    }else throw new HttpException('Email or password incorrect', 401);
  }
     
  async login(user, res){   
        
    let permissions: any[] = [];
    await this.AUTH_REPOSITORY.findAll<User>({
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

    const userLogin = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: isAdmin
    };

    const token = await jwtr.sign(userLogin, jwtConstants.secret)
     return res.status(200).send({
      success: true,
      data: token
    });
  }
}