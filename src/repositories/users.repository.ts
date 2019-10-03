import { Injectable, Inject } from '@nestjs/common';
import { Users_role, User } from '../documents';

@Injectable()
export class UsersRepository {
    @Inject('USERS_REPOSITORY') public USERS_REPOSITORY: typeof User
    
    async findAll(parametrs: any){
        return this.USERS_REPOSITORY.findAll<User>(parametrs);
    }
    async findOne(parametrs: any){
        return this.USERS_REPOSITORY.findOne<User>(parametrs);
    }
    async updateUser(body: User, id: any){
        return this.USERS_REPOSITORY.update<User>(body, id);
    }
    async delete(parametrs: any){
        return this.USERS_REPOSITORY.destroy(parametrs)
    }
    async register(newUser: User){
        return this.USERS_REPOSITORY.create<User>(newUser);
    }
    async getAvatar(parametrs: any){
        return this.USERS_REPOSITORY.findOne<User>(parametrs);
    }
}

@Injectable()
export class UserRolesRepository {
    @Inject('USER_ROLES_REPO') public USER_ROLES_REPO: typeof Users_role
    
    async destroyUserRoles(parametrs: any){
        return this.USER_ROLES_REPO.destroy(parametrs)
    }
    async create(newRole: any){
        return this.USER_ROLES_REPO.create<Users_role>(newRole);
    }
}