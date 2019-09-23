import { Module } from '@nestjs/common';
import { DatabaseModule } from './db.connection/db-module';

import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { booksProviders } from './books/books.providers';

import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { usersProviders, rolesProviders , usersrolesProviders} from './users/users.providers';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { authProviders } from './auth/auth.providers';
import { LocalStrategy } from './auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './users/jwt.strategy';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),],
  controllers: [BooksController, UsersController, AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    BooksService,
    ...booksProviders,
    UsersService,
    ...usersProviders,
    AuthService,
    ...authProviders,
    ...rolesProviders,
    ...usersrolesProviders
  ]
}
)
export class AppModule { }
