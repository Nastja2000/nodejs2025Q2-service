import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { AlbumService } from "./album.service";
import { CreateAlbumDto } from "./dto/create-album.dto"; 
import { UpdateAlbumDto } from "./dto/update-album-info.dto";

@Controller('album')
export class AlbumController {
	constructor(private readonly albumService: AlbumService) {};

	@Get()
	getAllAlbums() {
		return this.albumService.getAll();
	}

	@Get(':id')
	getAlbumById(@Param('id') id: string) {
		return this.albumService.getById(id);
	}
  
	@Post()
	createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
		return this.albumService.create(createAlbumDto);
	}

	@Put(':id')
	updateAlbumInfo(@Param('id') id: string, @Body() UpdateAlbumDto: UpdateAlbumDto) {
		this.albumService.updateAlbumInfo(id, UpdateAlbumDto);
	}

	@Delete(':id')
	@HttpCode(204)
	deleteAlbum(@Param('id') id: string) {
		this.albumService.delete(id);
	}
};