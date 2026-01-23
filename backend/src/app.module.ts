import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './controller/task.controller';
import { ScheduleController } from './controller/schedule.controller';
import { SnakeNamingStrategy } from './config/naming-strategy';
import { TaskService } from './service/task.service';
import { Task } from './entities/task.entity';
import { ScheduleService } from 'src/service/schedule.service';
import { Schedule } from './entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('TYPEORM_SYNCHRONIZE') === 'true',
        logging: configService.get('TYPEORM_LOGGING') === 'true',
        namingStrategy: new SnakeNamingStrategy(),
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Task, Schedule]),
  ],
  controllers: [TaskController, ScheduleController],
  providers: [TaskService, ScheduleService],
})
export class AppModule {}
