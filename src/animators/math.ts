import toObservable from "../utils/toObservable"
import Animatable from "../Animatable"
import { Observable } from "rxjs/Observable"
import { combineLatest } from "rxjs/observable/combineLatest"
import { Outputs, Patch, Inputs, SingleInput } from "../types"

export interface IMathInputs {
  a: number
  b: number
}

function map2(mathOperator: (a: number, b: number) => number): Patch<IMathInputs, Outputs<number>> {
  return inputs => ({
    value: combineLatest(inputs.a, inputs.b, mathOperator)
  })
}

export const patches: Record<string, Patch<IMathInputs, Outputs<number>>> = {
  add: map2((a, b) => a + b),
  subtract: map2((a, b) => a - b),
  multiply: map2((a, b) => a * b),
  divide: map2((a, b) => a / b)
}

export function add(
  a: number | Observable<number> | Animatable<any, Outputs<number>>,
  b: number | Observable<number> | Animatable<any, Outputs<number>>
): Animatable<{ a: number; b: number }, Outputs<number>> {
  return Animatable.create(patches.add, {
    a: toObservable(a),
    b: toObservable(b)
  })
}

export function subtract(
  a: number | Observable<number> | Animatable<any, Outputs<number>>,
  b: number | Observable<number> | Animatable<any, Outputs<number>>
): Animatable<{ a: number; b: number }, Outputs<number>> {
  return Animatable.create(patches.subtract, {
    a: toObservable(a),
    b: toObservable(b)
  })
}

export function multiply(
  a: number | Observable<number> | Animatable<any, Outputs<number>>,
  b: number | Observable<number> | Animatable<any, Outputs<number>>
): Animatable<{ a: number; b: number }, Outputs<number>> {
  return Animatable.create(patches.multiply, {
    a: toObservable(a),
    b: toObservable(b)
  })
}

export function divide(
  a: number | Observable<number> | Animatable<any, Outputs<number>>,
  b: number | Observable<number> | Animatable<any, Outputs<number>>
): Animatable<{ a: number; b: number }, Outputs<number>> {
  return Animatable.create(patches.divide, {
    a: toObservable(a),
    b: toObservable(b)
  })
}
