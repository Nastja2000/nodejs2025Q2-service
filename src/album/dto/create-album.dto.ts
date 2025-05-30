import { IsNumber, IsString } from "class-validator";
import { isStringObject } from "util/types";

export  class CreateAlbumDto {
	@IsString()
	name: string;
	@IsNumber()
	year: number;
	
	artistId: string | null;
};