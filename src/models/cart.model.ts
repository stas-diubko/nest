export interface AddProductModel {
    success: boolean;
    message: string;
}

export interface GetAllProductsModel {
    data: object;
}

export interface AddCartViewModel {
    userId: string;
    bookId: string;
}