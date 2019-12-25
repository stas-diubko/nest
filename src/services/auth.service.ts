import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt"
import { User } from '../documents/users.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from "@nestjs/common"
import { ConfigService } from './config.service';
import * as jwtr from "jwt-then";
import { jwtConstants } from '../secrets/jwtSecretKey';
import { AuthRepository, UsersRepository } from '../repositories';
import { templateEmail } from '../common/mail-template';

@Injectable()

export class AuthService{
    
  private test: any;
  public jwtService: JwtService;
 
  constructor(
    config: ConfigService,
    public authRepository : AuthRepository,
    public usersRepository: UsersRepository
  ) {
    this.test = config.get('APP');
  }

    validLogin = (email, password) =>{
    
      const errorObj = {
        logErrorEmail: '',
        logErrorPassword: ''
      }

      let stateValid = 0;

      const emailRegExpr = new RegExp(/^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.([a-z]{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/i);

      if (!emailRegExpr.test(email)) {
          // errorObj.logErrorEmail = 'Error: Email is not valid!';
          throw new HttpException('Error: Email is not valid!', 400);
      } else {++stateValid}

      if (password.length < 3) {
          // errorObj.logErrorPassword = 'Error: Password must be more than four characters';
          throw new HttpException('Error: Password must be more than four characters!', 400);

      } else {++stateValid}

      return {
        errorObj: errorObj,
        stateValid: stateValid
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    
    let loginValid = await this.validLogin(email, password)
    
    
    if(loginValid.stateValid !== 2 ){
      throw new HttpException(loginValid.errorObj, 404);
    }
    
    const user: any = await this.authRepository.findOne(email)
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const matchPasswords = await bcrypt.compare(password, user.dataValues.password);
    if (user && matchPasswords) {
      return user.dataValues;
    }else throw new HttpException('Email or password incorrect', 401);
  }
     
  async login(user){
      
    let permissions: string;
    permissions = await this.authRepository.findAll(user.user.id);
   
    const userLogin = {
      id: user.user.id,
      name: user.user.name,
      email: user.user.email,
      role: permissions
    };

    const token = await jwtr.sign(userLogin, jwtConstants.secret)
     return { success: true, data: token };
  }

  async resetUserPassword(body, userId):Promise<any> {

    let user: any = await this.usersRepository.findOne({ where: { id: userId } });
    if(user) {
      let newPass = {
        password: await bcrypt.hash(body.password, 10)
      }
      await this.usersRepository.updateUser(newPass, { where: { id: userId } });
      return { 
        success: true, 
        data: 'Password successfully updated!' 
      };
    } else {
      return { 
        success: false, 
        data: 'Data is not correct, try again!' 
      };
    }
  }

  async resetPassword(email): Promise<any> {
    
    const user = await this.usersRepository.findOne({ where: { email: email } });
    
    if (user) {

      const nodemailer = require('nodemailer');
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'stanislavdiubko@gmail.com', // generated ethereal user
            pass: 'stanislav92' // generated ethereal password
        }
      });

    const hashId = await jwtr.sign({id: user.id, name: user.name}, jwtConstants.secret)

      // send mail with defined transport object
      let info = await transporter.sendMail({
          from: '"Stas Diubko 👻" <stanislavdiubko@gmail.com>', // sender address
          to: email, // list of receivers
          subject: 'Reset password', // Subject line
          text: 'Reset password', // plain text body
          html: templateEmail(hashId)
          
      });

      console.log('Message sent: %s', info.messageId);
      return {
        success: true,
        data: 'Password reset link sent to your email!'
      }
    } else {
      return {
        success: false,
        data: 'User not found!'
      }
      
    }

  }
}