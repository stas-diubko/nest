import { Module } from '@nestjs/common';
import { DatabaseModule } from './db.connection/db-module';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';
import { booksProviders } from './providers/books.providers';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { usersProviders, rolesProviders , usersrolesProviders} from './providers/users.providers';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { authProviders } from './providers/auth.providers';
import { LocalStrategy } from './common/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './secrets/jwtSecretKey';
import { JwtStrategy } from './common/jwt.strategy';
import { ConfigModule } from './config/config.module';
import { AuthRepository, BooksRepository, UsersRepository, UserRolesRepository, CartRepository } from './repositories';
import { RolesGuard } from './common/role.guard';
import { CartController } from './controllers/cart.controller';
import { cartProviders } from './providers/cart.providers';
import { CartService } from './services/cart.service';


@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),],
  controllers: [BooksController, UsersController, AuthController, CartController],
  providers: [
    CartRepository,
    AuthRepository,
    BooksRepository,
    UsersRepository,
    UserRolesRepository,
    LocalStrategy,
    JwtStrategy,
    BooksService,
    ...booksProviders,
    UsersService,
    ...usersProviders,
    AuthService,
    ...authProviders,
    ...rolesProviders,
    ...usersrolesProviders,
    CartService,
    ...cartProviders,
    RolesGuard
  ]
}
)
export class AppModule { }
