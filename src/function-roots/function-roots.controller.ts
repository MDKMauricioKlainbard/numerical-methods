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
        try {
            return this.functionsRootsService.bisectionMethod(latex, leftNumber, rightNumber);
        }
        catch (error) {
            return error.message
        }
    }

    @Post('regula-falsi')
    regulaFalsiMethod
        (
            @Body('latex') latex: string,
            @Body('leftNumber') leftNumber: number,
            @Body('rightNumber') rightNumber: number
        ): any {
        try {
            return this.functionsRootsService.regulaFalsiMethod(latex, leftNumber, rightNumber);
        }
        catch (error) {
            return error.message
        }
    }

    @Post('secant')
    secantMethod(
        @Body('latex') latex: string,
        @Body('firstApproximation') firstApproximation: number,
        @Body('secondApproximation') secondApproximation: number
    ): any {
        try {
            return this.functionsRootsService.secantMethod(latex, firstApproximation, secondApproximation)
        }
        catch (error) {
            return error.message
        }
    }

    @Post('newton-raphson')
    newtonRaphsonMethod(
        @Body('latex') latex: string,
        @Body('firstApproximation') firstApproximation: number,
    ): any {
        try {
            return this.functionsRootsService.newtonRaphsonMethod(latex, firstApproximation)
        }
        catch (error) {
            return error.message
        }
    }

    @Post('fixed-point')
    fixedPointMethod(
        @Body('latex') latex: string,
        @Body('firstApproximation') firstApproximation: number
    ): any {
        try {
            return this.functionsRootsService.fixedPointMethod(latex, firstApproximation)
        }
        catch (error) {
            return error.message
        }
    }
}
