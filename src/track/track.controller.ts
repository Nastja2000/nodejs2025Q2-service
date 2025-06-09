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
import { TrackService } from './track.service';
import { UpdateTrackDto } from './dto/update-track-info.dto';
import { CreateTrackDto } from './dto/create-track.dto';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAllUsers() {
    return this.trackService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.trackService.getById(id);
  }

  @Post()
  async createUser(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  async updateTrack(@Param('id') id: string, @Body() UpdateTrackDto: UpdateTrackDto) {
    return this.trackService.updateTrack(id, UpdateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    this.trackService.delete(id);
  }
}
