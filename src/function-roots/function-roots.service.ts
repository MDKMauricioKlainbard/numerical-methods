import { Injectable } from '@nestjs/common';
import { FunctionsService } from 'src/functions/functions.service';

const tolerance = 1e-9;
const minRelativeError = 1e-9;
const maxIteration = 10000;

@Injectable()
export class FunctionRootsService {
    constructor(
        private readonly functionsService: FunctionsService
    ) { }

    bisectionMethod(latex: string, leftNumber: number, rightNumber: number): any {
        const f = this.functionsService.latexFunction(latex);
        let flag = true;
        let newAprox: number;
        let oldAprox: number;
        let counter = 0;
        let approximations = [];

        if (Math.abs(f(leftNumber)) <= tolerance) {
            return leftNumber;
        }
        if (Math.abs(f(rightNumber)) <= tolerance) {
            return rightNumber;
        }

        if (f(leftNumber) * f(rightNumber) > 0) {
            return "The function evaluated at both ends of the interval must have a different sign.";
        }

        while (flag && counter < maxIteration) {
            if (counter > 1) {
                oldAprox = newAprox;
            }
            counter = counter + 1;
            newAprox = (leftNumber + rightNumber) / 2;
            approximations.push(newAprox);
            if (Math.abs(f(newAprox)) <= tolerance) {
                flag = false;
            }

            if (counter > 1) {
                const relativeError = Math.abs((oldAprox - newAprox) / newAprox) * 100;
                if (relativeError <= minRelativeError) {
                    flag = false;
                }
            }

            if (f(newAprox) * f(leftNumber) > 0) {
                leftNumber = newAprox;
            }
            if (f(newAprox) * f(rightNumber) > 0) {
                rightNumber = newAprox;
            }
        }
        return {
            newAprox,
            counter,
            message: `The function evaluated in the approximation gives: ${f(newAprox)}`,
            approximations
        };
    }

    regulaFalsiMethod(latex: string, leftNumber: number, rightNumber: number): any {
        const f = this.functionsService.latexFunction(latex);
        let flag = true;
        let newAprox: number;
        let oldAprox: number;
        let counter = 0;
        let approximations = [];

        if (Math.abs(f(leftNumber)) <= tolerance) {
            return leftNumber;
        }
        if (Math.abs(f(rightNumber)) <= tolerance) {
            return rightNumber;
        }

        if (f(leftNumber) * f(rightNumber) > 0) {
            return "The function evaluated at both ends of the interval must have a different sign.";
        }

        while (flag && counter < maxIteration) {
            if (counter > 1) {
                oldAprox = newAprox;
            }
            counter = counter + 1;
            newAprox = rightNumber-(f(rightNumber)*(rightNumber-leftNumber))/(f(rightNumber)-f(leftNumber));
            approximations.push(newAprox);
            if (Math.abs(f(newAprox)) <= tolerance) {
                flag = false;
            }

            if (counter > 1) {
                const relativeError = Math.abs((oldAprox - newAprox) / newAprox) * 100;
                if (relativeError <= minRelativeError) {
                    flag = false;
                }
            }

            if (f(newAprox) * f(leftNumber) > 0) {
                leftNumber = newAprox;
            }
            if (f(newAprox) * f(rightNumber) > 0) {
                rightNumber = newAprox;
            }
        }
        return {
            newAprox,
            counter,
            message: `The function evaluated in the approximation gives: ${f(newAprox)}`,
            approximations
        };
    }
}
