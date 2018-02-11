import toObservable from "../utils/toObservable"
import Animatable from "../Animatable"
import { Observable } from "rxjs/Observable"
import { combineLatest } from "rxjs/observable/combineLatest"
import { ObservableMap, Outputs } from "../types"

export function combinePatch<T>(o: ObservableMap<T>): ObservableMap<Outputs<T>> {
  const keys = Object.keys(o) as (keyof T)[]
  const os = keys.map(key => {
    return o[key]
  })

  const value$ = combineLatest<any, T>(os, (...values: Array<T[keyof T]>) => {
    const result: Partial<T> = {}

    values.forEach((value, i) => {
      result[keys[i] as keyof T] = value
    })

    return result as T
  })

  return { value$ }
}

export default function combine<T>(observableMap: ObservableMap<T>): Animatable<T, Outputs<T>> {
  return Animatable.create(combinePatch, observableMap)
}
