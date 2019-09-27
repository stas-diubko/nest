import { Sequelize } from 'sequelize-typescript';
import { Books } from '../books/books.entity';
import { Users, Users_roles, Roles } from '../users/users.entity';
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

      sequelize.addModels([Books, Users, Users_roles, Roles]);
      await sequelize.sync();
      return sequelize;
    },
  }
]; 