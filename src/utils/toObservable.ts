import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import isObservable from './isObservable';
import Animatable from '../Animatable';
import { ISingle } from '../interfaces';

export default function toObservable<T>(
  val: T | Observable<T> | Animatable<any, ISingle<T>>
): Observable<T> {
  if (isObservable(val)) {
    return val;
  }

  if (val instanceof Animatable) {
    return val.outputs.value$ as Observable<T>;
  }

  return of(val);
}
