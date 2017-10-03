import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import isObservable from './isObservable';
import Animatable from '../Animatable';
import { IMono } from '../interfaces';

export default function toObservable<T>(
  val: T | Observable<T> | Animatable<any, IMono<T>>
): Observable<T> {
  if (isObservable(val)) {
    return val;
  }

  if (val instanceof Animatable) {
    return val.outputs.value$;
  }

  return of(val);
}
