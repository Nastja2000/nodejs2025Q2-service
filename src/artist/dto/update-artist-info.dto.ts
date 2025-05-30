import { IsBoolean, IsString } from "class-validator";

export class UpdateArtistInfoDto {
	@IsString()
	newName: string;
	@IsBoolean()
	newGrammyInfo: boolean;
};