import { Album } from "src/album/entities/album.entity";
import { Track } from "src/track/entities/track.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

   @Column()
  grammy: boolean;

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];
}
