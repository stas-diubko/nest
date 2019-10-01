export interface AddBookModel {
    success: boolean;
    message: string;
}

export interface DeleteBookModel {
    success: boolean;
}

export interface UpdateBookModel {
    success: boolean;
}

export interface GetOneBookModel {
    success: boolean;
    data: object;
}

export interface GetAllBooksModel {
    success: boolean;
    data: object;
}

export interface GetAllBooksForAdminModel {
    success: boolean;
    data: object;
    booksLength: number;
}