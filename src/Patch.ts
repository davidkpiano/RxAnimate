import { Observable } from 'rxjs/Observable';
import { IAnimatableScalar } from './interfaces';
import { Patch } from './types';

export function fromOperator<I, O>(
  operator: (...args: any[]) => (source: Observable<I>) => Observable<O>,
  ...args: any[]
): Patch<IAnimatableScalar<I>, IAnimatableScalar<O>> {
  return inputs => ({
    value$: inputs.value$.pipe(operator(...args))
  });
}
