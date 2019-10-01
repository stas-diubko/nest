import { User } from '../documents/users.entity';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: User,
  },
];