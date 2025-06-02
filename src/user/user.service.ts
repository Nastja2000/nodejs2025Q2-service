import { BadRequestException, NotFoundException, ForbiddenException, Injectable } from "@nestjs/common";
import { User, UserResponse } from "./entities/user.entity";
import { v4 as generateUUID, validate as validateUUID } from "uuid";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class UserService {
	private users: User[] = [];

	getAll(): UserResponse[] {
		return this.users.map(({ password, ...restFields }) => restFields);
	}

	getById(id: string): UserResponse {
		if (!validateUUID(id)) {
			throw new BadRequestException('User Id is invalid', {
				cause: new Error(),
				description: "The wrong format of the User's Id. It should be like UUID v4",
			});
		}
		const existingUser: User = this.users.find((user) => user.id === id);
		if (!existingUser){
			throw new NotFoundException("User with this Id isn't exist", {
				cause: new Error(),
				description: "The User with this Id isn't exist. Please, check the id that you enter",
			});
		}
		const {password, ...restFields} = existingUser;

		return restFields;
	}

	create(dto: CreateUserDto): UserResponse {
		if (!dto.login || !dto.password) {
			throw new BadRequestException('Required fields are not entered', {
				cause: new Error(),
				description: "Required field(s) is(are) missing. Check if login and password are entered and try again",
			});
		}

		const newUser: User = {
			id: generateUUID(),
			login: dto.login,
			password: dto.password,
			version: 1,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};

		this.users.push(newUser);

		const {password, ...restFields} = newUser;

		return restFields;
	}

	updatePassword(dto: UpdatePasswordDto, userId: string): UserResponse {
		if (!validateUUID(userId)) {
			throw new BadRequestException('User Id is invalid', {
				cause: new Error(),
				description: "The wrong format of the User's Id. It should be like UUID v4",
			});
		}
		const existingUser: User = this.users.find((user) => user.id === userId);
		if (!existingUser){
			throw new NotFoundException("User with this Id isn't exist", {
				cause: new Error(),
				description: "The User with this Id isn't exist. Please, check the id that you enter",
			});
		}

		if (dto.oldPassword !== existingUser.password) {
			throw new ForbiddenException("The old password is wrong", {
				cause: new Error(),
				description: "The old password is wrong. Please, try again.",
			});
		}

		existingUser.password = dto.newPassword;
		existingUser.updatedAt = Date.now();
		existingUser.version++;

		const {password, ...restFields} = existingUser;

		return restFields;
	}
	
	delete(userId: string): void {
		if (!validateUUID(userId)) {
			throw new BadRequestException('User Id is invalid', {
				cause: new Error(),
				description: "The wrong format of the User's Id. It should be like UUID v4",
			});
		}
		const existingUserIndex: number = this.users.findIndex((user) => user.id === userId);
		if (existingUserIndex === -1){
			throw new NotFoundException("User with this Id isn't exist", {
				cause: new Error(),
				description: "The User with this Id isn't exist. Please, check the id that you enter",
			});
		}

		this.users.splice(existingUserIndex, 1);
	}
}