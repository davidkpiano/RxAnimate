import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { scan } from 'rxjs/operators/scan';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';

import { ISingle } from '../interfaces';
import { Patch, SingleObservableMap, ObservableMap } from '../types';
import { combineOperator } from '../animators/combine';
import { animationFrame } from '../sources/animationFrame';

export type NumberMap = { [key: string]: number };

function mapValues<T, R>(
  object: Record<string, T>,
  project: (value: T, index: string) => R
): Record<string, R> {
  const result: Record<string, R> = {};

  Object.keys(object).forEach(key => {
    result[key] = project(object[key], key);
  });

  return result;
}

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

export default function lerp(rate: number, precision?: number) {
  return function<T extends number | NumberMap>(
    inputs: ObservableMap<ISingle<T>>
  ): ObservableMap<ISingle<T>> {
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
