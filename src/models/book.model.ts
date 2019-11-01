export interface AddBookModel {
    success: boolean;
    message: string;
}

export interface UpdateBookModel {
    success: boolean;
}

export interface GetAllBooksModel {
    data: object;
}

export interface GetAllBooksForAdminModel {
    data: object;
    booksLength: number;
}

export interface AddBooksViewModel {
    body: object;
}