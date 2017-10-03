import toObservable from '../utils/toObservable';
import Animatable from '../Animatable';
import { Observable } from 'rxjs/Observable';
import { IMono } from '../interfaces';
import * as mathPatches from '../patches/math';

export function add(
  a: number | Observable<number> | Animatable<any, IMono<number>>,
  b: number | Observable<number> | Animatable<any, IMono<number>>
): Animatable<{ a: number; b: number }, IMono<number>> {
  return Animatable.create(mathPatches.add, {
    a: toObservable(a),
    b: toObservable(b)
  });
}

export function subtract(
  a: number | Observable<number> | Animatable<any, IMono<number>>,
  b: number | Observable<number> | Animatable<any, IMono<number>>
): Animatable<{ a: number; b: number }, IMono<number>> {
  return Animatable.create(mathPatches.subtract, {
    a: toObservable(a),
    b: toObservable(b)
  });
}

export function multiply(
  a: number | Observable<number> | Animatable<any, IMono<number>>,
  b: number | Observable<number> | Animatable<any, IMono<number>>
): Animatable<{ a: number; b: number }, IMono<number>> {
  return Animatable.create(mathPatches.multiply, {
    a: toObservable(a),
    b: toObservable(b)
  });
}

export function divide(
  a: number | Observable<number> | Animatable<any, IMono<number>>,
  b: number | Observable<number> | Animatable<any, IMono<number>>
): Animatable<{ a: number; b: number }, IMono<number>> {
  return Animatable.create(mathPatches.divide, {
    a: toObservable(a),
    b: toObservable(b)
  });
}