import { Artist } from "src/artist/entities/artist.entity";
import { Track } from "src/track/entities/track.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'SET NULL'})
  @JoinColumn({name: 'artistId'})
  artist: Artist

  @Column({nullable: true})
  artistId: string | null;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];
}
