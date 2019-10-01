import { User, Role , Users_role} from '../documents/users.entity';

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: User,
  },
];

export const rolesProviders = [
  {
    provide: 'ROLES_REPOSITORY',
    useValue: Role,
  },
];

export const usersrolesProviders = [
  {
    provide: 'USER_ROLES_REPO',
    useValue: Users_role,
  },
];