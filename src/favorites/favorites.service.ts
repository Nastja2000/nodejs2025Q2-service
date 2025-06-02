import { FavoritesResponse } from './entities/favorites.entity';
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { validate as validateUUID } from 'uuid';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}
  private favorites: FavoritesResponse = {
    tracks: [],
    albums: [],
    artists: [],
  };

  getAll(): FavoritesResponse {
    return this.favorites;
  }

  addFavoriteTrack(trackId: string): string {
    if (!validateUUID(trackId)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }

    const existingTrack: Track = this.trackService.getById(trackId, true);
    if (!existingTrack) {
      throw new UnprocessableEntityException(
        "Track with this Id doesn't exist",
        {
          cause: new Error(),
          description:
            "The Track with this Id doesn't exist and not able to be added to the favorites. Please, check the id that you entered",
        },
      );
    }

    this.favorites.tracks.push(existingTrack);

    return `Track "${existingTrack.name}" is added to the favorites`;
  }

  addFavoriteArtist(artistId: string): string {
    if (!validateUUID(artistId)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }

    const existingArtist: Artist = this.artistService.getById(artistId, true);
    if (!existingArtist) {
      throw new UnprocessableEntityException(
        "Artist with this Id doesn't exist",
        {
          cause: new Error(),
          description:
            "The Artist with this Id doesn't exist and not able to be added to the favorites. Please, check the id that you entered",
        },
      );
    }

    this.favorites.artists.push(existingArtist);

    return `Artist "${existingArtist.name}" is addeed to the favorites`;
  }

  addFavoriteAlbum(albumId: string): string {
    if (!validateUUID(albumId)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }

    const existingAlbum: Album = this.albumService.getById(albumId, true);

    if (!existingAlbum) {
      throw new UnprocessableEntityException(
        "Album with this Id doesn't exist",
        {
          cause: new Error(),
          description:
            "The Album with this Id doesn't exist and not able to be added to the favorites. Please, check the id that you entered",
        },
      );
    }

    this.favorites.albums.push(existingAlbum);

    return `Album "${existingAlbum.name}" is addeed to the favorites`;
  }

  deleteFavoriteTrack(trackId: string): void {
    if (!validateUUID(trackId)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }

    const existingInFavoritesTrackIndex: number =
      this.favorites.tracks.findIndex((track) => track.id === trackId);
    if (existingInFavoritesTrackIndex === -1) {
      throw new NotFoundException(
        "Track with this Id doesn't exist in Favorites",
        {
          cause: new Error(),
          description:
            "The Track with this Id doesn't exist in Favorites. Please, check the id that you entered",
        },
      );
    }

    this.favorites.tracks.splice(existingInFavoritesTrackIndex, 1);
  }

  deleteFavoriteArtist(artistId: string): void {
    if (!validateUUID(artistId)) {
      throw new BadRequestException('Artist Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Artist's Id. It should be like UUID v4",
      });
    }

    const existingInFavoritesArtistIndex: number =
      this.favorites.artists.findIndex((artist) => artist.id === artistId);
    if (existingInFavoritesArtistIndex === -1) {
      throw new NotFoundException(
        "Artist with this Id doesn't exist in Favorites",
        {
          cause: new Error(),
          description:
            "The Artist with this Id doesn't exist in Favorites. Please, check the id that you entered",
        },
      );
    }

    this.favorites.artists.splice(existingInFavoritesArtistIndex, 1);
  }

  deleteFavoriteAlbum(albumId: string): void {
    if (!validateUUID(albumId)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }

    const existingInFavoritesArtistIndex: number =
      this.favorites.albums.findIndex((album) => album.id === albumId);
    if (existingInFavoritesArtistIndex === -1) {
      throw new NotFoundException(
        "Album with this Id doesn't exist in Favorites",
        {
          cause: new Error(),
          description:
            "The Album with this Id doesn't exist in Favorites. Please, check the id that you entered",
        },
      );
    }

    this.favorites.albums.splice(existingInFavoritesArtistIndex, 1);
  }

  deleteEntityItemFromFavorites(
    entity: 'track' | 'artist' | 'album',
    itemId: string,
  ): void {
    switch (entity) {
      case 'track':
        this.deleteFavoriteTrack(itemId);
        break;
      case 'artist':
        this.deleteFavoriteArtist(itemId);
        break;
      case 'album':
        this.deleteFavoriteAlbum(itemId);
        break;
      default:
        break;
    }
  }
}
