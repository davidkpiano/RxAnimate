import toObservable from '../utils/toObservable';
import Animatable from '../Animatable';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators/map';

import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Patch, SingleObservableMap, ObservableMap, Outputs } from '../types';
import { combineOperator } from '../animators/combine';
import { animationFrame } from '../sources/animationFrame';
import mapValues from '../utils/mapValues';

export type NumberMap = { [key: string]: number };

function objectsEqual<T>(a: T, b: T) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every(key => (a as any)[key] === (b as any)[key]);
}

function linearInterpolate(
  value: number,
  targetValue: number,
  rate: number,
  precision: number = 4
): number {
  if (isNaN(value) && !isNaN(targetValue)) return targetValue;
  if (isNaN(targetValue) && !isNaN(value)) return value;
  const delta = (targetValue - value) * rate;

  return Number((value + delta).toPrecision(precision));
}

function isNumericRecord(val: any): val is Record<string, number> {
  return typeof val === 'object';
}

function interpolate(rate: number, precision: number = 4) {
  return function<T extends number | NumberMap>(value: T, targetValue: T): T {
    if (isNumericRecord(value)) {
      return mapValues(value, (subValue, key) =>
        linearInterpolate(
          subValue,
          (targetValue as NumberMap)[key],
          rate,
          precision
        )
      ) as T;
    } else {
      return linearInterpolate(
        value as number,
        targetValue as number,
        rate,
        precision
      ) as T;
    }
  };
}

function isScalar(
  inputs: SingleObservableMap<number> | ObservableMap<Record<string, number>>
): inputs is SingleObservableMap<number> {
  return Object.keys(inputs).length === 1 && 'value$' in inputs;
}

export const patches = {
  lerp(rate: number, precision?: number) {
    return function<T extends number | NumberMap>(
      inputs: ObservableMap<Outputs<T>>
    ): ObservableMap<Outputs<T>> {
      return {
        value$: animationFrame().pipe(
          withLatestFrom(inputs.value$, (frame: number, input) => input),
          scan(interpolate(rate, precision)),
          distinctUntilChanged((a, b) => {
            if (typeof a === 'number') {
              return a === b;
            }

            return objectsEqual(a, b);
          })
        )
      };
    };
  }
};

export default function lerp(
  rate: number,
  precision?: number
): <T extends number | NumberMap>(
  observable: Observable<T>
) => Animatable<Outputs<T>, Outputs<T>> {
  const patch = patches.lerp(rate, precision);
  return observable => {
    return Animatable.create(patch, {
      value$: observable
    });
  };
}
