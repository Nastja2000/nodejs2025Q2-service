import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Track } from './entities/track.entity';
import { v4 as generateUUID, validate as validateUUID } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track-info.dto';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => AlbumService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService
  ) {}

  private tracks: Track[] = [];

  getAll(): Track[] {
    return this.tracks;
  }

  getById(id: string, isFavoritesCheck: boolean = false): Track {
    if (!validateUUID(id)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }
    const existingTrack: Track = this.tracks.find((track) => track.id === id);
    if (!existingTrack && !isFavoritesCheck) {
      throw new NotFoundException("Track with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Track with this Id isn't exist. Please, check the id that you enter",
      });
    }

    return existingTrack ?? null;
  }

  create(dto: CreateTrackDto): Track {
    if (!dto.name || !dto.duration) {
      throw new BadRequestException('Required fields are not entered', {
        cause: new Error(),
        description:
          'Required field(s) is(are) missing. Check if all data is entered and try again',
      });
    }

    const newTrack: Track = {
      id: generateUUID(),
      name: dto.name,
      duration: dto.duration,
      artistId: dto.artistId || null,
      albumId: dto.albumId || null,
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  updateTrack(trackId: string, dto: UpdateTrackDto): Track {
    if (!validateUUID(trackId)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }
    const existingTrack: Track = this.tracks.find(
      (track) => track.id === trackId,
    );
    if (!existingTrack) {
      throw new NotFoundException("Track with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Track with this Id isn't exist. Please, check the id that you enter",
      });
    }

    existingTrack.name = dto.name;
    existingTrack.duration = dto.duration;
    existingTrack.artistId = dto.artistId ?? null;
    existingTrack.albumId = dto.albumId ?? null;

    return existingTrack;
  }

  delete(trackId: string): void {
    if (!validateUUID(trackId)) {
      throw new BadRequestException('Track Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the Track's Id. It should be like UUID v4",
      });
    }
    const existingTrackIndex: number = this.tracks.findIndex(
      (track) => track.id === trackId,
    );
    if (existingTrackIndex === -1) {
      throw new NotFoundException("Track with this Id isn't exist", {
        cause: new Error(),
        description:
          "The Track with this Id isn't exist. Please, check the id that you enter",
      });
    }

    this.tracks.splice(existingTrackIndex, 1);

    this.favoritesService.deleteEntityItemFromFavorites('track', trackId);
  }

  deleteArtistReference(artistId: string): void {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  deleteAlbumReference(albumId: string): void {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
