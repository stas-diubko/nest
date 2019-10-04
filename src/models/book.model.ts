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
    data: object;
}

export interface GetAllBooksModel {
    data: object;
}

export interface GetAllBooksForAdminModel {
    data: object;
    booksLength: number;
}