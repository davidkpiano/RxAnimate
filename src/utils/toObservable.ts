import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import isObservable from './isObservable';
import Animatable from '../Animatable';
import { ObservableMap, Outputs } from '../types';

export default function toObservable<T>(
  val: T | Observable<T> | Animatable<any, Outputs<T>>
): Observable<T> {
  if (isObservable(val)) {
    return val;
  }

  if (val instanceof Animatable) {
    return val.outputs.value$ as Observable<T>;
  }

  return of(val);
}

export function toObservableMap<T extends {}>(map: T): ObservableMap<T> {
  let result: Partial<ObservableMap<T>> = {};

  Object.keys(map).forEach((key: keyof T) => {
    result[key] = toObservable(map[key]);
  });

  return result as ObservableMap<T>;
}
