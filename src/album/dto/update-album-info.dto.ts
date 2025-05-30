import { IsNumber, IsString } from "class-validator";

export  class UpdateAlbumDto {
	@IsString()
	name: string;
	@IsNumber()
	year: number;
	@IsString()
	artistId: string | null;
};