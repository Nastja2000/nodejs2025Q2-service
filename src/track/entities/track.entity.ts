import { Album } from "src/album/entities/album.entity";
import { Artist } from "src/artist/entities/artist.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export interface ITrack {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}


@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.tracks, { onDelete: 'SET NULL'})
  @JoinColumn({name: 'artistId'})
  artist: Artist

  @Column({nullable: true})
  artistId: string | null;

  @ManyToOne(() => Album, (album) => album.tracks, { onDelete: 'SET NULL'})
  @JoinColumn({name: 'albumId'})
  album: Artist

  @Column({nullable: true})
  albumId: string | null;

  @Column()
  duration: number;
}