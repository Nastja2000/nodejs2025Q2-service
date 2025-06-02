import { IsBoolean, IsString } from 'class-validator';

export class UpdateArtistInfoDto {
  @IsString()
  name: string;
  @IsBoolean()
  grammy: boolean;
}
