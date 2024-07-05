import { IsNumber, IsString } from "class-validator";

export class BisectionDto {
    @IsString()
    latex: string;

    @IsNumber()
    leftNumber: number;

    @IsNumber()
    rightNumber: number;
}

export class RegulaFalsiDto {
    @IsString()
    latex: string;

    @IsNumber()
    leftNumber: number;

    @IsNumber()
    rightNumber: number;
}

export class SecantDto {
    @IsString()
    latex: string;

    @IsNumber()
    firstApproximation: number;

    @IsNumber()
    secondApproximation: number;
}

export class NewtonRaphsonDto {
    @IsString()
    latex: string;

    @IsNumber()
    firstApproximation: number;
}

export class FixedPointDto {
    @IsString()
    latex: string;

    @IsNumber()
    firstApproximation: number;

    @IsNumber()
    parameter: number;
}