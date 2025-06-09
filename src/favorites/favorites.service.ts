import { Favorites, IFavoritesResponse } from './entities/favorites.entity';
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { validate as validateUUID } from 'uuid';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private favsRepo: Repository<Favorites>,

    @InjectRepository(Track)
    private trackRepo: Repository<Track>,

    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,

    @InjectRepository(Album)
    private albumRepo: Repository<Album>,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService
  ) {}
  private favorites: IFavoritesResponse = {
    tracks: [],
    albums: [],
    artists: [],
  };

  async getOrCreateFavorites(): Promise<Favorites> {
    let favorites = await this.favsRepo.findOne({
      relations: ['tracks', 'artists', 'albums']
    });
    
    if (!favorites) {
      favorites = this.favsRepo.create({
        tracks: [],
        artists: [],
        albums: []
      });
      await this.favsRepo.save(favorites);
    }
    
    return favorites;
  }

  async getAll(): Promise<{ tracks: Track[]; albums: Album[]; artists: Artist[] }> {
    const favorites = await this.getOrCreateFavorites();
    return {
      tracks: favorites.tracks,
      albums: favorites.albums,
      artists: favorites.artists
    };
  }

  async addFavoriteTrack(trackId: string): Promise<string> {
    if (!validateUUID(trackId)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }

    const existingTrack: Track = await this.trackService.getById(trackId, true);
    const favorites = await this.getOrCreateFavorites();

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
    if (!favorites.tracks.some(track => track.id === trackId)) {
      favorites.tracks.push(existingTrack);
      await this.favsRepo.save(favorites);
    }

    return `Track "${existingTrack.name}" is added to the favorites`;
  }

  async addFavoriteArtist(artistId: string): Promise<string> {
    if (!validateUUID(artistId)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }

    const existingArtist: Artist = await this.artistService.getById(artistId, true);
    const favorites = await this.getOrCreateFavorites();

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

    if (!favorites.artists.some(artist => artist.id === artistId)) {
      favorites.artists.push(existingArtist);
      await this.favsRepo.save(favorites);
    }

    return `Artist "${existingArtist.name}" is addeed to the favorites`;
  }

  async addFavoriteAlbum(albumId: string): Promise<string> {
    if (!validateUUID(albumId)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }

    const existingAlbum: Album = await this.albumService.getById(albumId, true);
    const favorites = await this.getOrCreateFavorites();

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

    if (!favorites.albums.some(album => album.id === albumId)) {
      favorites.albums.push(existingAlbum);
      await this.favsRepo.save(favorites);
    }

    return `Album "${existingAlbum.name}" is addeed to the favorites`;
  }

  async deleteFavoriteTrack(trackId: string): Promise<void> {
    if (!validateUUID(trackId)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }

    const favorites = await this.getOrCreateFavorites();
    const initialTracksArrayLength: number = favorites.tracks.length;

    favorites.tracks = favorites.tracks.filter(track => track.id !== trackId);

    if (favorites.tracks.length === initialTracksArrayLength) {
      throw new NotFoundException(
        "Track with this Id doesn't exist in Favorites",
        {
          cause: new Error(),
          description:
            "The Track with this Id doesn't exist in Favorites. Please, check the id that you entered",
        },
      );
    }

    await this.favsRepo.save(favorites);
  }

  async deleteFavoriteArtist(artistId: string): Promise<void> {
    if (!validateUUID(artistId)) {
      throw new BadRequestException('Artist Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Artist's Id. It should be like UUID v4",
      });
    }

    const favorites = await this.getOrCreateFavorites();
    const initialArtistsArrayLength: number = favorites.artists.length;

    favorites.artists = favorites.artists.filter(artist => artist.id !== artistId);

    if (favorites.artists.length === initialArtistsArrayLength) {
      throw new NotFoundException(
        "Artist with this Id doesn't exist in Favorites",
        {
          cause: new Error(),
          description:
            "The Artist with this Id doesn't exist in Favorites. Please, check the id that you entered",
        },
      );
    }

    await this.favsRepo.save(favorites);
  }

  async deleteFavoriteAlbum(albumId: string): Promise<void> {
    if (!validateUUID(albumId)) {
      throw new BadRequestException('Album Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Album's Id. It should be like UUID v4",
      });
    }

    const favorites = await this.getOrCreateFavorites();
    const initialAlbumsArrayLength: number = favorites.albums.length;

    favorites.albums = favorites.albums.filter(album => album.id !== albumId);

    if (favorites.albums.length === initialAlbumsArrayLength) {
      throw new NotFoundException(
        "Album with this Id doesn't exist in Favorites",
        {
          cause: new Error(),
          description:
            "The Album with this Id doesn't exist in Favorites. Please, check the id that you entered",
        },
      );
    }

    await this.favsRepo.save(favorites);
  }

  async deleteEntityItemFromFavorites(
    entity: 'track' | 'artist' | 'album',
    itemId: string,
  ): Promise<void> {
    try {
      switch (entity) {
        case 'track':
          await this.deleteFavoriteTrack(itemId);
          break;
        case 'artist':
          await this.deleteFavoriteArtist(itemId);
          break;
        case 'album':
          await this.deleteFavoriteAlbum(itemId);
          break;
        default:
          break;
      }
    } catch (e) {
      if (!(e instanceof NotFoundException)) {
        throw e;
      }
    }
  }
}
