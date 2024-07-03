import { Injectable } from '@nestjs/common';
import { FunctionsService } from 'src/functions/functions.service';
import { AnswerFunctionRoots } from './dto/answer-function-roots.dto';

const tolerance = 1e-9;
const minRelativeError = 1e-9;
const maxRelativeError = 5000;
const maxIteration = 10000;

const answerModel = (
    newAprox: number,
    counter: number,
    message: string,
    approximations: number[],
    resolved: boolean
) => {
    return {
        newAprox,
        counter,
        message,
        approximations,
        resolved
    }
}

@Injectable()
export class FunctionRootsService {
    constructor(
        private readonly functionsService: FunctionsService
    ) { }


    initialData(
        type: ("closed" | "open-secant" | "open-newtonraphson" | "open-fixedpoint"),
        latex: string,
        firstApproximation?: number) {
        switch (type) {
            case "closed":
                return {
                    f: this.functionsService.latexFunction(latex),
                    flag: true,
                    newAprox: undefined,
                    oldAprox: undefined,
                    counter: 0,
                    approximations: []
                }
            case 'open-secant':
                return {
                    f: this.functionsService.latexFunction(latex),
                    flag: true,
                    newAprox: undefined,
                    oldAprox: undefined,
                    counter: 0,
                    approximations: []
                }
            case 'open-newtonraphson':
                return {
                    f: this.functionsService.latexFunction(latex),
                    df: this.functionsService.derivateFunction(latex),
                    flag: true,
                    newAprox: undefined,
                    oldAprox: undefined,
                    counter: 0,
                    approximations: [firstApproximation]
                }
            case 'open-fixedpoint':
                return {
                    f: this.functionsService.latexFunction(latex),
                    flag: true,
                    newAprox: undefined,
                    oldAprox: undefined,
                    counter: 0,
                    approximations: [firstApproximation]
                }
        }
    }

    bisectionMethod(latex: string, leftNumber: number, rightNumber: number): AnswerFunctionRoots {
        let { f, flag, newAprox, oldAprox, counter, approximations } = this.initialData("closed", latex)
        if (Math.abs(f(leftNumber)) <= tolerance) {
            return answerModel(
                leftNumber,
                0,
                `La función evaluada en el extremo izquierdo del intervalo da: ${f(leftNumber)}`,
                [],
                true
            )
        }
        if (Math.abs(f(rightNumber)) <= tolerance) {
            return answerModel(
                rightNumber,
                0,
                `La función evaluada en el extremo derecho del intervalo da: ${f(rightNumber)}`,
                [],
                true
            )
        }

        if (f(leftNumber) * f(rightNumber) > 0) {
            return answerModel(
                0,
                0,
                "La función evaluada en los extremos del intervalo inicial dado debe ser de distinto signo.",
                [],
                false
            )
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
        return answerModel(
            newAprox,
            counter,
            `La función evaluada en la aproximación da: ${f(newAprox)}`,
            approximations,
            true
        )
    }

    regulaFalsiMethod(latex: string, leftNumber: number, rightNumber: number): AnswerFunctionRoots {
        let { f, flag, newAprox, oldAprox, counter, approximations } = this.initialData("closed", latex)
        if (Math.abs(f(leftNumber)) <= tolerance) {
            return answerModel(
                leftNumber,
                0,
                `La función evaluada en el extremo izquierdo del intervalo da: ${f(leftNumber)}`,
                [],
                true
            )
        }
        if (Math.abs(f(rightNumber)) <= tolerance) {
            return answerModel(
                rightNumber,
                0,
                `La función evaluada en el extremo derecho del intervalo da: ${f(rightNumber)}`,
                [],
                true
            )
        }

        if (f(leftNumber) * f(rightNumber) > 0) {
            return answerModel(
                0,
                0,
                "La función evaluada en ambos extremos del intervalo debe ser de distinto signo.",
                [],
                false
            )
        }

        while (flag && counter < maxIteration) {
            if (counter >= 1) {
                oldAprox = newAprox;
            }
            if (
                f(leftNumber) - f(rightNumber) === 0
                ||
                Math.abs(f(leftNumber)) === Infinity ||
                Math.abs(f(rightNumber)) === Infinity ||
                Number.isNaN(f(leftNumber)) ||
                Number.isNaN(f(rightNumber))) {
                flag = false;
                return answerModel(
                    newAprox,
                    counter,
                    `Ha ocurrido una división por cero y los cálculos se detuvieron. La función evaluada en la última aproximación obtenida da: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No se calcularon nuevas aproximaciones.'}`,
                    approximations,
                    false
                )
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
        return answerModel(
            newAprox,
            counter,
            `La función evaluada en la aproximación da: ${f(newAprox)}`,
            approximations,
            true
        )
    }

    secantMethod(latex: string, firstApproximation: number, secondApproximation: number): any {
        let { f, flag, newAprox, oldAprox, counter, approximations } = this.initialData("open-secant", latex)
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
        let { f, df, flag, newAprox, oldAprox, counter, approximations } = this.initialData("open-newtonraphson", latex, firstApproximation)
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
        let { f, flag, newAprox, oldAprox, counter, approximations } = this.initialData("open-fixedpoint", latex, firstApproximation)
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
