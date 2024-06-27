import { Injectable } from '@nestjs/common';
import { create, all } from 'mathjs';
import LatexToJs from 'src/latexToJs/latexToJs';

const math = create(all);

@Injectable()
export class FunctionsService {
    latexFunction(latex: string): any {
        const expression = LatexToJs(latex)
        const fn = (): any => {
            try {
                const f = math.evaluate(`f(x) = ${expression}`)
                return f
            }
            catch (error) {
                return 'The expression cannot be evaluated.';
            }
        }
        return fn();
    }
}
