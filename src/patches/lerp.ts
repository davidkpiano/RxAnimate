import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { scan } from 'rxjs/operators/scan';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Animatable } from '../Animatable';
import { Observable } from 'rxjs/Observable';
import { IAnimatableScalar } from '../interfaces';
import { Patch } from '../types';

import { animationFrame } from '../observables/animationFrame';

function interpolate(rate: number, precision: number = 4) {
  return (value: number, targetValue: number): number => {
    if (isNaN(value) && !isNaN(targetValue)) return targetValue;
    if (isNaN(targetValue) && !isNaN(value)) return value;
    const delta = (targetValue - value) * rate;

    return Number((value + delta).toPrecision(precision));
  };
}

export function lerp(
  rate: number
): Patch<IAnimatableScalar<number>, IAnimatableScalar<number>> {
  return inputs => ({
    value$: animationFrame().pipe(
      withLatestFrom(inputs.value$, (frame: number, input) => input),
      scan(interpolate(rate)),
      distinctUntilChanged()
    )
  });
}
