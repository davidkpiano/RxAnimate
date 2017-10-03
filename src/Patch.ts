import { Observable } from 'rxjs/Observable';
import { IMono } from './interfaces';
import { Patch } from './types';

export function fromOperator<I, O>(
  operator: (...args: any[]) => (source: Observable<I>) => Observable<O>,
  ...args: any[]
): Patch<IMono<I>, IMono<O>> {
  return inputs => ({
    value$: inputs.value$.pipe(operator(...args))
  });
}
