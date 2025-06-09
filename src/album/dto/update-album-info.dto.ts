import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  name: string;
  @IsNumber()
  year: number;
  @IsOptional()
  @IsUUID()
  artistId: string | null;
}
