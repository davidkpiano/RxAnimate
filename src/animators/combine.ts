import toObservable from '../utils/toObservable';
import Animatable from '../Animatable';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators/map';
import { ObservableMap, Outputs } from '../types';
import { patches } from '../animators/math';

export function combineOperator<T>(o: ObservableMap<T>) {
  const keys = Object.keys(o);
  const os = keys.map((key: keyof T) => {
    return o[key];
  });

  return combineLatest<any, T>(os, (...values: Array<T[keyof T]>) => {
    const result: Partial<T> = {};

    values.forEach((value, i) => {
      result[keys[i] as keyof T] = value;
    });

    return result as T;
  });
}

export default function combine<T>(
  observableMap: ObservableMap<T>
): Animatable<T, Outputs<T>> {
  const patch = (o: ObservableMap<T>): ObservableMap<Outputs<T>> => {
    return {
      value$: combineOperator(o)
    };
  };
  return Animatable.create(patch, observableMap);
}
