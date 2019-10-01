import { Sequelize } from 'sequelize-typescript';
import { Book } from '../documents/books.entity';
import { User, Users_role, Role } from '../documents/users.entity';
import env from '../config/config'
 
export const databaseProviders = [

  {
    provide: 'SEQUELIZE',

    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',   
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        define: {
          timestamps: false
        }
      });

      sequelize.addModels([Book, User, Users_role, Role]);
      await sequelize.sync();
      return sequelize;
    },
  }
]; 