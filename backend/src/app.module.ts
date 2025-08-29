import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ThreatsModule } from './modules/threats/threats.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SearchModule } from './modules/search/search.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './common/services/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    ThreatsModule,
    IncidentsModule,
    ReportsModule,
    SearchModule,
  ],
})
export class AppModule {}
