import { Injectable } from '@nestjs/common';
import { FunctionsService } from 'src/functions/functions.service';

const tolerance = 1e-9;
const minRelativeError = 1e-9;
const maxRelativeError = 5000;
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
            if (counter >= 1) {
                oldAprox = newAprox;
            }
            counter = counter + 1;
            newAprox = (leftNumber + rightNumber) / 2;
            approximations.push(newAprox);
            if (Math.abs(f(newAprox)) <= tolerance) {
                flag = false;
            }

            if (counter >= 1) {
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
            if (counter >= 1) {
                oldAprox = newAprox;
            }
            if (f(leftNumber) - f(rightNumber) === 0) {
                return {
                    newAprox,
                    counter,
                    message: `A division by zero occurred and the calculations stopped. The function evaluated in the last approximation obtained gives: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No new approximations were calculated'}`,
                    approximations
                }
            }
            if (
                Math.abs(f(leftNumber)) === Infinity ||
                Math.abs(f(rightNumber)) === Infinity ||
                Number.isNaN(f(leftNumber)) ||
                Number.isNaN(f(rightNumber))
            ) {
                flag = false;
                return {
                    newAprox,
                    counter,
                    message: `A division by zero occurred. The value of the function in the last approximation gives: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No new approximations were calculated'}`,
                    approximations
                }
            }
            counter = counter + 1;
            newAprox = rightNumber - (f(rightNumber) * (rightNumber - leftNumber)) / (f(rightNumber) - f(leftNumber));
            approximations.push(newAprox);
            if (Math.abs(f(newAprox)) <= tolerance) {
                flag = false;
            }

            if (counter >= 1) {
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

    secantMethod(latex: string, firstApproximation: number, secondApproximation: number): any {
        const f = this.functionsService.latexFunction(latex);
        let flag = true;
        let newAprox: number;
        let oldAprox: number;
        let counter = 0;
        let approximations = [];

        if (firstApproximation === secondApproximation) {
            return "The two approaches cannot be equal."
        }

        if (Math.abs(f(firstApproximation)) <= tolerance) {
            return firstApproximation
        }

        if (Math.abs(f(secondApproximation)) <= tolerance) {
            return secondApproximation
        }

        while (flag && counter < maxIteration) {
            if (counter >= 1) {
                oldAprox = newAprox;
            }
            if (f(firstApproximation) - f(secondApproximation) === 0) {
                return {
                    newAprox,
                    counter,
                    message: `A division by zero occurred and the calculations stopped. The function evaluated in the last approximation obtained gives: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No new approximations were calculated'}`,
                    approximations
                }
            }

            if (
                Math.abs(f(firstApproximation)) === Infinity ||
                Math.abs(f(secondApproximation)) === Infinity ||
                Number.isNaN(f(firstApproximation)) ||
                Number.isNaN(f(secondApproximation))
            ) {
                flag = false;
                return {
                    newAprox,
                    counter,
                    message: `A division by zero occurred. The value of the function in the last approximation gives: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No new approximations were calculated'}`,
                    approximations
                }
            }
            counter = counter + 1;
            newAprox = firstApproximation - (f(firstApproximation) * (secondApproximation - firstApproximation)) / (f(secondApproximation) - f(firstApproximation));
            approximations.push(newAprox);
            if (Math.abs(f(newAprox)) <= tolerance) {
                flag = false;
            }

            if (counter >= 1) {
                const relativeError = Math.abs((oldAprox - newAprox) / newAprox) * 100;
                if (relativeError <= minRelativeError) {
                    flag = false;
                }
                if (relativeError > maxRelativeError) {
                    flag = false;
                    return {
                        newAprox,
                        counter,
                        message: `The method diverges. The function evaluated in the last approximation obtained gives: ${f(newAprox)}`,
                        approximations
                    }
                }
            }
            firstApproximation = secondApproximation;
            secondApproximation = newAprox;
        }
        return {
            newAprox,
            counter,
            message: `The function evaluated in the approximation gives: ${f(newAprox)}`,
            approximations
        };
    }

    newtonRaphsonMethod(latex: string, firstApproximation: number) {
        const f = this.functionsService.latexFunction(latex);
        const df = this.functionsService.derivateFunction(latex);
        let flag = true;
        let newAprox: number;
        let oldAprox: number;
        let counter = 0;
        let approximations = [firstApproximation];
        if (Math.abs(f(firstApproximation)) <= tolerance) {
            return firstApproximation;
        }

        while (flag && counter < maxIteration) {
            if (
                Math.abs(f(firstApproximation)) === Infinity ||
                Math.abs(df(firstApproximation)) === Infinity ||
                Number.isNaN(f(firstApproximation)) ||
                Number.isNaN(df(firstApproximation))
            ) {
                flag = false;
                return {
                    newAprox,
                    counter,
                    message: `A division by zero occurred. The value of the function in the last approximation gives: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No new approximations were calculated'}`,
                    approximations
                }
            }
            counter = counter + 1;
            newAprox = firstApproximation - f(firstApproximation) / df(firstApproximation)
            approximations.push(newAprox);
            if (Math.abs(f(newAprox)) <= tolerance) {
                flag = false;
            }

            if (counter >= 1) {
                const relativeError = Math.abs((oldAprox - newAprox) / newAprox) * 100;
                if (relativeError <= minRelativeError) {
                    flag = false;
                }
                if (relativeError > maxRelativeError || isNaN(relativeError)) {
                    flag = false;
                    return {
                        newAprox,
                        counter,
                        message: `The method diverges. The function evaluated in the last approximation obtained gives: ${f(newAprox)}`,
                        approximations
                    }
                }
            }
            oldAprox = firstApproximation;
            firstApproximation = newAprox;
        }
        return {
            newAprox,
            counter,
            message: `The function evaluated in the approximation gives: ${f(newAprox)}`,
            approximations,
        };
    }

    fixedPointMethod(latex: string, firstApproximation: number) {
        const f = this.functionsService.latexFunction(latex);
        let flag = true;
        let newAprox: number;
        let oldAprox: number;
        let counter = 0;
        let approximations = [firstApproximation];
        if (Math.abs(f(firstApproximation)) <= tolerance) {
            return firstApproximation;
        }
        while (flag && counter < maxIteration) {
            if (
                Math.abs(f(firstApproximation)) === Infinity ||
                Number.isNaN(f(firstApproximation))
            ) {
                flag = false;
                return {
                    newAprox,
                    counter,
                    message: `A division by zero occurred. The value of the function in the last approximation gives: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No new approximations were calculated'}`,
                    approximations
                }
            }
            counter = counter + 1;
            newAprox = f(firstApproximation)
            approximations.push(newAprox);
            if (Math.abs(f(newAprox)) <= tolerance) {
                flag = false;
            }

            if (counter > 1) {
                const relativeError = Math.abs((oldAprox - newAprox) / newAprox) * 100;
                if (relativeError <= minRelativeError) {
                    flag = false;
                }
                if (relativeError > maxRelativeError || isNaN(relativeError)) {
                    flag = false;
                    return {
                        newAprox,
                        counter,
                        message: `The method diverges. The function evaluated in the last approximation obtained gives: ${f(newAprox)}`,
                        approximations
                    }
                }
            }
            oldAprox = firstApproximation;
            firstApproximation = newAprox;
        }
        return {
            newAprox,
            counter,
            message: `The function evaluated in the approximation gives: ${f(newAprox)}`,
            approximations,
        };
    }
}
