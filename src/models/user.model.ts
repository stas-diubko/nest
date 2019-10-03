export interface UserRegisterModel {
    success: boolean;
    message: string;
}

export interface UserDeleteModel {
    success: boolean;
    message: string;
}

export interface GetAvatarModel {
    success: boolean;
    data: string;
}

export interface GetUSersModel {
    success: boolean;
    data: string;
    usersLength: string;
}

export interface UpdateUserModel {
    success: boolean;
    data: string;
}