import { map as mapOperator } from 'rxjs/operators/map';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { IMono } from '../interfaces';
import { Patch } from '../types';

export interface IMathInputs {
  a: number;
  b: number;
}

export function map2(
  mathOperator: (a: number, b: number) => number
): Patch<IMathInputs, IMono<number>> {
  return inputs => ({
    value$: combineLatest(inputs.a, inputs.b, mathOperator)
  });
}

export const add = map2((a, b) => a + b);
export const subtract = map2((a, b) => a - b);
export const multiply = map2((a, b) => a * b);
export const divide = map2((a, b) => a / b);
