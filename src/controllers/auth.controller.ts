import { Controller, Get, Request, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post()
    async login(@Req() user: Request){
        // console.log(user);
        
        return this.authService.login(user);
    }

    @Get('/test')
    async test() {
        var OnDemandClient = require('on-demand-client');

        var api = new OnDemandClient.DefaultApi();
        var authApi = new OnDemandClient.Auth.DefaultApi();

        var credentials = process.env.CREDENTIALS;

        authApi.tokenPost('Basic ' + credentials, function(error, fetched, response) {
            if (error) throw error;
            var defaultClient = OnDemandClient.ApiClient.instance;
            defaultClient.defaultHeaders['Authorization'] = 'Bearer ' + fetched.access_token;

            api.packagesGet(null, function(error, fetched, response) {
                if (error) throw error;
                console.log(fetched);
            });
        });

        
            // return authApi
        }

    @Get('/test2')
    async test2() {
        var OnDemandClient = require('on-demand-client');

        var apiInstance = new OnDemandClient.DefaultApi();

        var callback = function(error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully. Returned data: ' + data);
        }
        };
        apiInstance.billingCodesGet(callback);

        // return apiInstance
    }
}

 