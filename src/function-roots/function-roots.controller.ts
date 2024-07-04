import { Controller, Body, Post, ValidationPipe } from '@nestjs/common';
import { FunctionsService } from 'src/functions/functions.service';
import { FunctionRootsService } from './function-roots.service';
import { BisectionDto, FixedPointDto, NewtonRaphsonDto, RegulaFalsiDto, SecantDto } from './dto/function-roots.dto';

@Controller('function-roots')
export class FunctionRootsController {
    constructor
        (
            private readonly functionsService: FunctionsService,
            private readonly functionsRootsService: FunctionRootsService
        ) { }

    @Post('bisection')
    bisectionMethod
        (@Body(new ValidationPipe()) bisectionDto: BisectionDto): any {
        const { latex, leftNumber, rightNumber } = bisectionDto
        try {
            return this.functionsRootsService.bisectionMethod(latex.toString(), leftNumber, rightNumber);
        }
        catch (error) {
            return error.message
        }
    }

    @Post('regula-falsi')
    regulaFalsiMethod
        (@Body(new ValidationPipe()) regulaFalsiDto: RegulaFalsiDto): any {
        const { latex, leftNumber, rightNumber } = regulaFalsiDto;
        try {
            return this.functionsRootsService.regulaFalsiMethod(latex, leftNumber, rightNumber);
        }
        catch (error) {
            return error.message
        }
    }

    @Post('secant')
    secantMethod(@Body(new ValidationPipe()) secantDto: SecantDto): any {
        const { latex, firstApproximation, secondApproximation } = secantDto;
        try {
            return this.functionsRootsService.secantMethod(latex, firstApproximation, secondApproximation)
        }
        catch (error) {
            return error.message
        }
    }

    @Post('newton-raphson')
    newtonRaphsonMethod(@Body(new ValidationPipe()) newtonRaphsonDto: NewtonRaphsonDto): any {
        const { latex, firstApproximation } = newtonRaphsonDto;
        try {
            return this.functionsRootsService.newtonRaphsonMethod(latex, firstApproximation)
        }
        catch (error) {
            return error.message
        }
    }

    @Post('fixed-point')
    fixedPointMethod(@Body(new ValidationPipe()) fixedPointDto: FixedPointDto): any {
        const { latex, firstApproximation } = fixedPointDto;
        try {
            return this.functionsRootsService.fixedPointMethod(latex, firstApproximation)
        }
        catch (error) {
            return error.message
        }
    }
}
