import { Users } from '../users/users.entity';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: Users,
  },
];