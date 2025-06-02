import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavs() {
    return this.favoritesService.getAll();
  }

  @Post('/track/:id')
  addTrackToFavorites(@Param('id') id: string) {
    return this.favoritesService.addFavoriteTrack(id);
  }

  @Post('/artist/:id')
  addArtistToFavorites(@Param('id') id: string) {
    return this.favoritesService.addFavoriteArtist(id);
  }

  @Post('/album/:id')
  addAlbumToFavorites(@Param('id') id: string) {
    return this.favoritesService.addFavoriteAlbum(id);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  deleteTrackFromFavorites(@Param('id') id: string) {
    this.favoritesService.deleteFavoriteTrack(id);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  deleteArtistFromFavorites(@Param('id') id: string) {
    this.favoritesService.deleteFavoriteArtist(id);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  deleteAlbumFromFavorites(@Param('id') id: string) {
    this.favoritesService.deleteFavoriteAlbum(id);
  }
}
