import { Module } from '@nestjs/common';
import { FunctionRootsController } from './function-roots.controller';
import { FunctionRootsService } from './function-roots.service';
import { FunctionsModule } from 'src/functions/functions.module';

@Module({
  imports: [FunctionsModule],
  controllers: [FunctionRootsController],
  providers: [FunctionRootsService]
})
export class FunctionRootsModule { }
