export interface UserRegisterModel {
    success: boolean;
    message: string;
}

export interface UserDeleteModel {
    success: boolean;
    message: string;
}

export interface GetAvatarModel {
    data: string;
}

export interface GetUsersModel {
    data: string;
    usersLength: string;
}

export interface GetOneUserModel {
    data: string;
}

export interface UpdateUserModel {
    success: boolean;
    data: string;
}