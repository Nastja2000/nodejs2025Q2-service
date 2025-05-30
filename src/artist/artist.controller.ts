import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistInfoDto } from "./dto/update-artist-info.dto"; 

@Controller('artist')
export class ArtistController {
	constructor(private readonly artistService: ArtistService) {};

	@Get()
	getAllUsers() {
		return this.artistService.getAll();
	}

	@Get(':id')
	getUserById(@Param('id') id: string) {
		return this.artistService.getArtistById(id);
	}
  
	@Post()
	createUser(@Body() createArtistDto: CreateArtistDto) {
		return this.artistService.create(createArtistDto);
	}

	@Put(':id')
	updateArtistInfo(@Param('id') id: string, @Body() UpdateArtistInfoDto: UpdateArtistInfoDto) {
		this.artistService.updateArtistInfo(id, UpdateArtistInfoDto);
	}

	@Delete(':id')
	@HttpCode(204)
	deleteUser(@Param('id') id: string) {
		this.artistService.delete(id);
	}
};