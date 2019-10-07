
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { getToken } from './actions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  
  
 async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    
    let token = await getToken(request.headers.authorization)
    
    if(token.role == roles[0]) {
      return true
    }
    
  }
}