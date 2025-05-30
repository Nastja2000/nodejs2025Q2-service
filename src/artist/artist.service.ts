import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Artist } from "./entities/artist.entity";
import { v4 as generateUUID, validate as validateUUID } from "uuid";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistInfoDto } from "./dto/update-artist-info.dto";

@Injectable()
export class ArtistService {
	private artists: Artist[] = [];
	
	getAll(): Artist[] {
		return this.artists;
	}

	getById(artistId: string): Artist {
		if (!validateUUID(artistId)) {
			throw new BadRequestException('Artist Id is invalid', {
				cause: new Error(),
				description: "The wrong format of the Artist's Id. It should be like UUID v4",
			});
		}
		const existingArtist: Artist = this.artists.find((artist) => artist.id === artistId);
		if (!existingArtist){
			throw new NotFoundException("Artist with this Id isn't exist", {
				cause: new Error(),
				description: "The Artist with this Id isn't exist. Please, check the id that you enter",
			});
		}

		return existingArtist;
	}

	create(dto: CreateArtistDto): Artist {
		if (!dto.name || !dto.grammy) {
			throw new BadRequestException('Required fields are not entered', {
				cause: new Error(),
				description: "Required field(s) is(are) missing. Check if name and grammy information are entered and try again",
			});
		}

		const newArtist: Artist = {
			id: generateUUID(),
			name: dto.name,
			grammy: dto.grammy
		};

		this.artists.push(newArtist);

		return newArtist;
	}

	updateArtistInfo(artistId: string, dto: UpdateArtistInfoDto): Artist {
		if (!validateUUID(artistId)) {
			throw new BadRequestException('Artist Id is invalid', {
				cause: new Error(),
				description: "The wrong format of the Artist's Id. It should be like UUID v4",
			});
		}

		const existingArtist: Artist = this.artists.find((artist) => artist.id === artistId);

		if (!existingArtist){
			throw new NotFoundException("Artist with this Id isn't exist", {
				cause: new Error(),
				description: "The Artist with this Id isn't exist. Please, check the id that you enter",
			});
		}

		existingArtist.name = dto.name;
		existingArtist.grammy = dto.grammy;

		return existingArtist;
	}

	delete(artistId: string): void {
		if (!validateUUID(artistId)) {
			throw new BadRequestException('Artist Id is invalid', {
				cause: new Error(),
				description: "The wrong format of the Artist's Id. It should be like UUID v4",
			});
		}
		const existingUserIndex: number = this.artists.findIndex((artist) => artist.id === artistId);
		if (existingUserIndex === -1){
			throw new NotFoundException("Artist with this Id isn't exist", {
				cause: new Error(),
				description: "The Artist with this Id isn't exist. Please, check the id that you enter",
			});
		}

		this.artists.splice(existingUserIndex, 1);
	}
};