import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album-info.dto';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAllAlbums() {
    return this.albumService.getAll();
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    return this.albumService.getById(id);
  }

  @Post()
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  async updateAlbumInfo(
    @Param('id') id: string,
    @Body() UpdateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.updateAlbumInfo(id, UpdateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(@Param('id') id: string) {
    this.albumService.delete(id);
  }
}
