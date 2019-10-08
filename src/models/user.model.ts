export interface UserBaseModel {
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

export interface UpdateUserModel {
    success: boolean;
    data: string;
}