import { forwardRef, Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { ArtistModule } from 'src/artist/artist.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { AlbumModule } from 'src/album/album.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    forwardRef(() => ArtistModule), 
    forwardRef(() => FavoritesModule), 
    forwardRef(() => AlbumModule)],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
