import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Album } from './entities/album.entity';
import { v4 as generateUUID, validate as validateUUID } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album-info.dto';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ArtistService } from 'src/artist/artist.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepo: Repository<Album>,

    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService
  ) {}

  private albums: Album[] = [];

  async getAll(): Promise<Album[]> {
    return this.albumRepo.find();
  }

  async getById(id: string, isFavoritesCheck: boolean = false): Promise<Album> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }
    const existingAlbum: Album = await this.albumRepo.findOne({where: {id}});
    if (!existingAlbum && !isFavoritesCheck) {
      throw new NotFoundException("Album with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Album with this Id isn't exist. Please, check the id that you enter",
      });
    }

    return existingAlbum ?? null;
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    if (!dto.name || !dto.year || dto.artistId) {
      throw new BadRequestException('Required fields are not entered', {
        cause: new Error(),
        description:
          'Required field(s) is(are) missing. Check if all necessary information is entered and try again',
      });
    }

    const newAlbum: Album = this.albumRepo.create({
      ...dto,
      artistId: dto.artistId ?? null
    });

    return this.albumRepo.save(newAlbum);
  }

  async updateAlbumInfo(id: string, dto: UpdateAlbumDto): Promise<Album> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }

    const existingAlbum: Album = await this.albumRepo.findOne({where: {id}});

    if (!existingAlbum) {
      throw new NotFoundException("Album with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Album with this Id isn't exist. Please, check the id that you enter",
      });
    }

    if(dto.artistId) {
      await this.artistService.getById(dto.artistId);
    }

    Object.assign(existingAlbum, dto);

    return this.albumRepo.save(existingAlbum);
  }

  async delete(id: string): Promise<void> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }

    const deletionResult = await this.albumRepo.delete(id);

    if (deletionResult.affected === 0) {
      throw new NotFoundException("Album with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Album with this Id isn't exist. Please, check the id that you enter",
      });
    }

    this.favoritesService.deleteEntityItemFromFavorites('album', id);
    this.trackService.deleteArtistReference(id);
  }

  async deleteArtistReference(artistId: string): Promise<void> {
    await this.albumRepo.update({ artistId }, { artistId: null});
  }
}
