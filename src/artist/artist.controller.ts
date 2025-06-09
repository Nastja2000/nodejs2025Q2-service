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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistInfoDto } from './dto/update-artist-info.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists() {
    return this.artistService.getAll();
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string) {
    return this.artistService.getById(id);
  }

  @Post()
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  async updateArtistInfo(
    @Param('id') id: string,
    @Body() UpdateArtistInfoDto: UpdateArtistInfoDto,
  ) {
    return this.artistService.updateArtistInfo(id, UpdateArtistInfoDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteArtist(@Param('id') id: string) {
    this.artistService.delete(id);
  }
}
