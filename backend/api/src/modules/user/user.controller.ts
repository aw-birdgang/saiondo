import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from "./user.services";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Post()
    create(@Body() body: { name: string; gender: string }) {
        return this.userService.createUser(body);
    }
}
