import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({isGlobal: true}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				url: configService.get('DB_URL'),
				autoLoadEntities: true,
				synchronize: false,
				migrations: ['dist/src/migrations/*{.ts,.js}']
			}),
		}),
	]
})
export class DatabaseModule {}
