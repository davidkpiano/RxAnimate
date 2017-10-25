import { Observable } from 'rxjs/Observable';
import { ISingle } from './interfaces';
import { Patch } from './types';

export function fromOperator<I, O>(
  operator: (...args: any[]) => (source: Observable<I>) => Observable<O>,
  ...args: any[]
): Patch<ISingle<I>, ISingle<O>> {
  return inputs => ({
    value$: inputs.value$.pipe(operator(...args))
  });
}
