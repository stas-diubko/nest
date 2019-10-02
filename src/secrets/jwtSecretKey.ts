import config from "../config/config";


export const jwtConstants = {
    secret: config.JWT_ENCRYPTION,
  };