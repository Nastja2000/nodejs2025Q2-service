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

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService
  ) {}

  private albums: Album[] = [];

  getAll(): Album[] {
    return this.albums;
  }

  getById(albumId: string, isFavoritesCheck: boolean = false): Album {
    if (!validateUUID(albumId)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }
    const existingAlbum: Album = this.albums.find(
      (album) => album.id === albumId,
    );
    if (!existingAlbum && !isFavoritesCheck) {
      throw new NotFoundException("Album with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Album with this Id isn't exist. Please, check the id that you enter",
      });
    }

    return existingAlbum ?? null;
  }

  create(dto: CreateAlbumDto): Album {
    if (!dto.name || !dto.year || dto.artistId) {
      throw new BadRequestException('Required fields are not entered', {
        cause: new Error(),
        description:
          'Required field(s) is(are) missing. Check if all necessary information is entered and try again',
      });
    }

    const newAlbum: Album = {
      id: generateUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  updateAlbumInfo(albumId: string, dto: UpdateAlbumDto): Album {
    if (!validateUUID(albumId)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }

    const existingAlbum: Album = this.albums.find(
      (album) => album.id === albumId,
    );

    if (!existingAlbum) {
      throw new NotFoundException("Album with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Album with this Id isn't exist. Please, check the id that you enter",
      });
    }

    existingAlbum.name = dto.name;
    existingAlbum.year = dto.year;
    existingAlbum.artistId = dto.artistId ?? null;

    return existingAlbum;
  }

  delete(albumId: string): void {
    if (!validateUUID(albumId)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }
    const existingUserIndex: number = this.albums.findIndex(
      (album) => album.id === albumId,
    );
    if (existingUserIndex === -1) {
      throw new NotFoundException("Album with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Album with this Id isn't exist. Please, check the id that you enter",
      });
    }

    this.albums.splice(existingUserIndex, 1);

    this.favoritesService.deleteEntityItemFromFavorites('album', albumId);
    this.trackService.deleteArtistReference(albumId);
  }

  deleteArtistReference(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
