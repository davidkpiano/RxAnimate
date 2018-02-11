import { Observable } from "rxjs/Observable"

export type ObservableMap<T> = { [key in keyof T]: Observable<T[key]> }

export type SingleObservableMap<T> = { value$: Observable<T> }

export interface Patch<I extends Inputs, O extends Outputs> {
  (inputs: ObservableMap<I>): ObservableMap<O>
  readonly patchName?: string
}

export interface ISingle<T> {
  readonly value$: T
}

export interface Inputs {
  readonly [key: string]: any
}

export interface Outputs<T = any> extends Inputs {
  readonly value$: T
}

export interface SingleInput<T> {
  readonly value$: T
}

export interface Position2D {
  readonly x: number
  readonly y: number
}

export interface Position3D {
  readonly x: number
  readonly y: number
  readonly z: number
}
