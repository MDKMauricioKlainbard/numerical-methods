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
        latex: string
    ) {
        const basicData = {
            f: this.functionsService.latexFunction(latex),
            df: undefined,
            flag: true,
            newAprox: undefined,
            oldAprox: undefined,
            counter: 0,
            approximations: []
        }
        switch (type) {
            case "closed":
                return basicData
            case 'open-secant':
                return basicData
            case 'open-newtonraphson':
                basicData.df = this.functionsService.derivateFunction(latex)
                return basicData
            case 'open-fixedpoint':
                return basicData
        }
    }

    bisectionMethod(latex: string, leftNumber: number, rightNumber: number): AnswerFunctionRoots {
        let { f, flag, newAprox, oldAprox, counter, approximations } = this.initialData("closed", latex)
        if (Math.abs(f(leftNumber)) <= tolerance) {
            return answerModel(
                leftNumber,
                counter,
                `La función evaluada en el extremo izquierdo del intervalo da: ${f(leftNumber)}`,
                [],
                true
            )
        }
        if (Math.abs(f(rightNumber)) <= tolerance) {
            return answerModel(
                rightNumber,
                counter,
                `La función evaluada en el extremo derecho del intervalo da: ${f(rightNumber)}`,
                [],
                true
            )
        }

        if (f(leftNumber) * f(rightNumber) > 0) {
            return answerModel(
                0,
                counter,
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
                counter,
                `La función evaluada en el extremo izquierdo del intervalo da: ${f(leftNumber)}`,
                [],
                true
            )
        }
        if (Math.abs(f(rightNumber)) <= tolerance) {
            return answerModel(
                rightNumber,
                counter,
                `La función evaluada en el extremo derecho del intervalo da: ${f(rightNumber)}`,
                [],
                true
            )
        }

        if (f(leftNumber) * f(rightNumber) > 0) {
            return answerModel(
                0,
                counter,
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

    secantMethod(latex: string, firstApproximation: number, secondApproximation: number): AnswerFunctionRoots {
        let { f, flag, newAprox, oldAprox, counter, approximations } = this.initialData("open-secant", latex)
        if (firstApproximation === secondApproximation) {
            return answerModel(
                0,
                counter,
                "Las dos aproximaciones iniciales no pueden ser iguales.",
                [],
                false,
            )
        }

        if (Math.abs(f(firstApproximation)) <= tolerance) {
            return answerModel(
                firstApproximation,
                counter,
                `La función evaluada en la primera aproximación dada es ${f(firstApproximation)}`,
                [],
                true
            )
        }

        if (Math.abs(f(secondApproximation)) <= tolerance) {
            return answerModel(
                secondApproximation,
                0,
                `La función evaluada en la primera aproximación dada es ${f(secondApproximation)}`,
                [],
                true
            )
        }

        while (flag && counter < maxIteration) {
            if (counter >= 1) {
                oldAprox = newAprox;
            }
            if (f(firstApproximation) - f(secondApproximation) === 0 ||
                Math.abs(f(firstApproximation)) === Infinity ||
                Math.abs(f(secondApproximation)) === Infinity ||
                Number.isNaN(f(firstApproximation)) ||
                Number.isNaN(f(secondApproximation))) {
                return answerModel(
                    newAprox,
                    counter,
                    `Ocurrió una división por cero y los cálculos se detuvieron. La función evaluada en la última aproximación obtenida da: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No se calcularon nuevas aproximaciones.'}`,
                    approximations,
                    false
                )
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
            }
            firstApproximation = secondApproximation;
            secondApproximation = newAprox;
        }
        return answerModel(
            newAprox,
            counter,
            `La función evaluada en la última aproximación da: ${f(newAprox)}`,
            approximations,
            true
        )
    }

    newtonRaphsonMethod(latex: string, firstApproximation: number): AnswerFunctionRoots {
        let { f, df, flag, newAprox, oldAprox, counter, approximations } = this.initialData("open-newtonraphson", latex)
        if (Math.abs(f(firstApproximation)) <= tolerance) {
            return answerModel(
                firstApproximation,
                counter,
                `La función evaluada en la aproximación inicial es: ${f(firstApproximation)}`,
                [],
                true
            )
        }

        while (flag && counter < maxIteration) {
            if (
                Math.abs(f(firstApproximation)) === Infinity ||
                Math.abs(df(firstApproximation)) === Infinity ||
                df(firstApproximation) === 0 ||
                Number.isNaN(f(firstApproximation)) ||
                Number.isNaN(df(firstApproximation))
            ) {
                return answerModel(
                    newAprox,
                    counter,
                    `Ocurrió una división por cero y los cálculos se detuvieron. La función evaluada en la última aproximación obtenida da: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No se calcularon nuevas aproximaciones.'}`,
                    approximations,
                    false
                )
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
            }
            oldAprox = firstApproximation;
            firstApproximation = newAprox;
        }
        return answerModel(
            newAprox,
            counter,
            `La función evaluada en la última aproximación obtenida da: ${f(newAprox)}`,
            approximations,
            true
        )
    }

    fixedPointMethod(latex: string, firstApproximation: number): AnswerFunctionRoots {
        let { f, flag, newAprox, oldAprox, counter, approximations } = this.initialData("open-fixedpoint", latex)
        if (Math.abs(f(firstApproximation)) <= tolerance) {
            return answerModel(
                firstApproximation,
                counter,
                `La función evaluada en la aproximación inicial da: ${f(firstApproximation)}`,
                [],
                true
            )
        }
        while (flag && counter < maxIteration) {
            if (
                Math.abs(f(firstApproximation)) === Infinity ||
                Number.isNaN(f(firstApproximation))
            ) {
                return answerModel(
                    newAprox,
                    counter,
                    `Ocurrió una división por cero y los cálculos se detuvieron. La función evaluada en la última aproximación obtenida da: ${typeof (newAprox) === 'number' ? f(newAprox) : 'No se calcularon nuevas aproximaciones.'}`,
                    approximations,
                    false
                )
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
            }
            oldAprox = firstApproximation;
            firstApproximation = newAprox;
        }
        return answerModel(
            newAprox,
            counter,
            `La función evaluada en la última aproximación obtenida da: ${f(newAprox)}`,
            approximations,
            true
        )
    }
}
