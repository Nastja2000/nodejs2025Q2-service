import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Artist } from './entities/artist.entity';
import { v4 as generateUUID, validate as validateUUID } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistInfoDto } from './dto/update-artist-info.dto';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService
  ) {}

  async getAll(): Promise<Artist[]> {
    return this.artistRepo.find();
  }

  async getById(id: string, isFavoritesCheck: boolean = false): Promise<Artist> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Artist Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Artist's Id. It should be like UUID v4",
      });
    }

    const existingArtist: Artist = await this.artistRepo.findOne({where: {id}});

    if (!existingArtist && !isFavoritesCheck) {
      throw new NotFoundException("Artist with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Artist with this Id isn't exist. Please, check the id that you enter",
      });
    }

    return existingArtist ?? null;
  }

  async create(dto: CreateArtistDto): Promise<Artist> {

    if (!dto.name || !dto.grammy) {
      throw new BadRequestException('Required fields are not entered', {
        cause: new Error(),
        description:
          'Required field(s) is(are) missing. Check if name and grammy information are entered and try again',
      });
    }

    const newArtist: Artist = this.artistRepo.create({
      ...dto
    });

    return this.artistRepo.save(newArtist);
  }

  async updateArtistInfo(id: string, dto: UpdateArtistInfoDto): Promise<Artist> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Artist Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Artist's Id. It should be like UUID v4",
      });
    }

    const existingArtist: Artist = await this.artistRepo.findOne({where: {id}});

    if (!existingArtist) {
      throw new NotFoundException("Artist with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Artist with this Id isn't exist. Please, check the id that you enter",
      });
    }

    Object.assign(existingArtist, dto);

    return this.artistRepo.save(existingArtist);
  }

  async delete(id: string): Promise<void> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Artist Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Artist's Id. It should be like UUID v4",
      });
    }

    const deletionResult = await this.artistRepo.delete(id);

    if (deletionResult.affected === 0) {
      throw new NotFoundException("Artist with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Artist with this Id isn't exist. Please, check the id that you enter",
      });
    }

    this.favoritesService.deleteEntityItemFromFavorites('artist', id);
    this.albumService.deleteArtistReference(id);
    this.trackService.deleteArtistReference(id);
  }
}
