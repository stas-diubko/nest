import { ApiModelProperty } from "@nestjs/swagger";

export class UserModel {
    @ApiModelProperty()
    name: string;
  
    @ApiModelProperty()
    password: string;
  
    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    imgChange: string;
}

export class UserLoginModel {
    @ApiModelProperty()
    username: string;
  
    @ApiModelProperty()
    password: string;
}