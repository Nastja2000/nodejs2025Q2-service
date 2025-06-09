import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Track } from './entities/track.entity';
import { validate as validateUUID } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track-info.dto';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepo: Repository<Track>,

    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService
  ) {}

  async getAll(): Promise<Track[]> {
    return this.trackRepo.find();
  }

  async getById(id: string, isFavoritesCheck: boolean = false): Promise<Track> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }
    const existingTrack: Track = await this.trackRepo.findOne({where: {id}});

    if (!existingTrack && !isFavoritesCheck) {
      throw new NotFoundException("Track with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Track with this Id isn't exist. Please, check the id that you enter",
      });
    }

    return existingTrack ?? null;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    if (!dto.name || !dto.duration) {
      throw new BadRequestException('Required fields are not entered', {
        cause: new Error(),
        description:
          'Required field(s) is(are) missing. Check if all data is entered and try again',
      });
    }

    const newTrack: Track = this.trackRepo.create({
      ...dto,
      artistId: dto.artistId || null,
      albumId: dto.albumId || null
    });

    return this.trackRepo.save(newTrack);
  }

  async updateTrack(id: string, dto: UpdateTrackDto): Promise<Track> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }
    const existingTrack: Track = await this.trackRepo.findOne({where: {id}});

    if (!existingTrack) {
      throw new NotFoundException("Track with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Track with this Id isn't exist. Please, check the id that you enter",
      });
    }

    if(dto.albumId) {
      await this.albumService.getById(dto.albumId);
    }

    if(dto.artistId) {
      await this.artistService.getById(dto.artistId);
    }

    Object.assign(existingTrack, dto);

    return this.trackRepo.save(existingTrack);
  }

  async delete(id: string): Promise<void> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }

    const deletionResult = await this.trackRepo.delete(id);
   
    if (deletionResult.affected === 0) {
      throw new NotFoundException("Track with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Track with this Id isn't exist. Please, check the id that you enter",
      });
    }

    this.favoritesService.deleteEntityItemFromFavorites('track', id);
  }

  async deleteArtistReference(artistId: string): Promise<void> {
    await this.trackRepo.update({ artistId }, { artistId: null});
  }

  async deleteAlbumReference(albumId: string): Promise<void> {
    await this.trackRepo.update({ albumId }, { albumId: null});
  }
}
