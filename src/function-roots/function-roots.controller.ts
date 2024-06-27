import { Controller, Body, Post } from '@nestjs/common';
import { FunctionsService } from 'src/functions/functions.service';
import { FunctionRootsService } from './function-roots.service';

@Controller('function-roots')
export class FunctionRootsController {
    constructor
        (
            private readonly functionsService: FunctionsService,
            private readonly functionsRootsService: FunctionRootsService
        ) { }

    @Post('bisection')
    bisectionMethod
        (
            @Body('latex') latex: string,
            @Body('leftNumber') leftNumber: number,
            @Body('rightNumber') rightNumber: number
        ): any {
            return this.functionsRootsService.bisectionMethod(latex, leftNumber, rightNumber);
    }

    @Post('regula-falsi')
    regulaFalsiMethod
        (
            @Body('latex') latex: string,
            @Body('leftNumber') leftNumber: number,
            @Body('rightNumber') rightNumber: number
        ): any {
            return this.functionsRootsService.regulaFalsiMethod(latex, leftNumber, rightNumber);
    }
}
