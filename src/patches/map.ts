import { map as mapOperator } from 'rxjs/operators/map';
import { Animatable } from '../Animatable';
import { Observable } from 'rxjs/Observable';
import { IAnimatableScalar } from '../interfaces';

import { fromOperator } from '../Patch';

export function map<T, R>(iteratee: (value: T, index: number) => R) {
  return fromOperator<T, R>(mapOperator, iteratee);
}
