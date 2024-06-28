import { Injectable } from '@nestjs/common';
import { create, all } from 'mathjs';
import LatexToJs from 'src/latexToJs/latexToJs';

const math = create(all);

@Injectable()
export class FunctionsService {
    
    latexFunction(latex: string): any {
        let expression = math.parse(LatexToJs(latex));
        const fn = (): any => {
            try {
                const f = math.evaluate(`f(x) = ${expression}`)
                return f
            }
            catch (error) {
                throw Error('The expression cannot be evaluated.');
            }
        }
        return fn();
    }

    derivateFunction(latex: string): any {
        const expression = math.parse(LatexToJs(latex));
        const dfn = (): any => {
            try {
                const derivativeExpression = math.derivative(expression, 'x');
                const df = math.evaluate(`f(x) = ${derivativeExpression}`) 
                return df
            }
            catch(error) {
                throw Error('The derivative could not be calculated.')
            }
        }
        return dfn();
    }
}
