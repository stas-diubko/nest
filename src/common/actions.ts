import * as jwt from "jwt-then";
import { jwtConstants } from "../secrets/jwtSecretKey";

export const getToken = (token:string) =>{
    token = token.substr(7,);
    let parseToken:any = jwt.verify(token, jwtConstants.secret);
    return parseToken
}