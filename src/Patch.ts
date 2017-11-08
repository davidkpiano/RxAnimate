import { Observable } from 'rxjs/Observable';
import { Patch, Outputs } from './types';

export function fromOperator<I, O>(
  operator: (...args: any[]) => (source: Observable<I>) => Observable<O>,
  ...args: any[]
): Patch<Outputs<I>, Outputs<O>> {
  return inputs => ({
    value$: inputs.value$.pipe(operator(...args))
  });
}
