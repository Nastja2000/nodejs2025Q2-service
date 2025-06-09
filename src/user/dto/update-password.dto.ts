import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string; // previous password
  @IsString()
  newPassword: string; // new password
}
