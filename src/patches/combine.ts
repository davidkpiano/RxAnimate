import { Observable } from 'rxjs/Observable';
import { ObservableMap } from '../types';
import { combineLatest } from 'rxjs/observable/combineLatest';

export function combineOperator<T>(
  observableMap: ObservableMap<T>
): Observable<T> {
  const keys = Object.keys(observableMap);
  const observables = keys.map((key: keyof T) => {
    return observableMap[key];
  });

  return combineLatest<any, T>(observables, (...values: Array<T[keyof T]>) => {
    const result: Partial<T> = {};

    values.forEach((value, i) => {
      result[keys[i] as keyof T] = value;
    });

    return result as T;
  });
}
