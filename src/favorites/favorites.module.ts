/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, TrackService, AlbumService, ArtistService]
})
export class FavoritesModule {}
