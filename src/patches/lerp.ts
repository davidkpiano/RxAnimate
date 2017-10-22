import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { scan } from 'rxjs/operators/scan';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';

import { IMono } from '../interfaces';
import { Patch, ScalarObservableMap, ObservableMap } from '../types';
import { combineOperator } from '../animators/combine';
import { animationFrame } from '../observables/animationFrame';

function mapValues<T, R>(
  object: Record<string, T>,
  project: (value: T) => R
): Record<string, R> {
  const result: Record<string, R> = {};

  Object.keys(object).forEach(key => {
    result[key] = project(object[key]);
  });

  return result;
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

function interpolate(
  rate: number,
  precision?: number
): (value: number, targetValue: number) => number;
function interpolate(
  rate: number,
  precision?: number
): (
  value: Record<string, number>,
  targetValue: number
) => Record<string, number>;
function interpolate(rate: number, precision: number = 4) {
  return (
    value: number | Record<string, number>,
    targetValue: number
  ): number | Record<string, number> => {
    if (typeof value === 'object') {
      return mapValues(value, v =>
        linearInterpolate(v, targetValue, rate, precision)
      );
    }

    return linearInterpolate(value, targetValue, rate, precision);
  };
}

function isScalar(
  inputs: ScalarObservableMap<number> | ObservableMap<Record<string, number>>
): inputs is ScalarObservableMap<number> {
  return Object.keys(inputs).length === 1 && 'value$' in inputs;
}

export default function lerp(
  rate: number,
  precision?: number
): Patch<IMono<number>, IMono<number>> {
  return inputs => {
    return {
      value$: animationFrame().pipe(
        withLatestFrom(inputs.value$, (frame: number, input) => input),
        scan(interpolate(rate, precision)),
        distinctUntilChanged()
      )
    };
  };
}
