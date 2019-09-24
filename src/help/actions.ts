import * as jwt from "jwt-then";


export const getToken = (token:string) =>{
    token = token.substr(7,);
    let parseToken:any = jwt.verify(token, 'secret');
    return parseToken
}