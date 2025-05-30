import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {};

	@Get()
	getAllUsers() {
		return this.userService.getAll();
	}

	@Get(':id')
	getUserById(@Param('id') id: string) {
		return this.userService.getById(id);
	}
  
	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Put(':id')
	updatePassword(@Param('id') id: string, @Body() UpdatePasswordDto: UpdatePasswordDto) {
		this.userService.updatePassword(UpdatePasswordDto, id);
	}

	@Delete(':id')
	@HttpCode(204)
	deleteUser(@Param('id') id: string) {
		this.userService.delete(id);
	}
};