import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, Role } from '../documents';

@Injectable()
export class AuthRepository {
    @Inject('AUTH_REPOSITORY') public AUTH_REPOSITORY: typeof User

    async findOne(email: string) {
        const user = await this.AUTH_REPOSITORY.findOne<User>({ where: { email: email } })
        return user
    }

    async findAll(userId){
        const per = await this.AUTH_REPOSITORY.findAll<User>({
            where: { id: userId },
            include: [Role]
        })
        
        const role = per[0].dataValues.roleId[0].dataValues.roleName
            
        return role;
    }
}