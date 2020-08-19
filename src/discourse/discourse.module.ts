import { HttpModule, Module } from '@nestjs/common';
import { DiscourseService } from './discourse.service';
import { DiscourseController } from './discourse.controller';
import { DiscourseConfigModule } from 'src/config/discourse/config.module';

@Module({
  imports: [DiscourseConfigModule, HttpModule],
  providers: [DiscourseService],
  controllers: [DiscourseController],
  exports: [DiscourseService],
})
export class DiscourseModule {}
