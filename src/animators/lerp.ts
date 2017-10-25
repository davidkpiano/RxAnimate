import toObservable from '../utils/toObservable';
import Animatable from '../Animatable';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators/map';
import { ISingle } from '../interfaces';
import { ObservableMap } from '../types';
import lerpPatch from '../patches/lerp';

export type NumberMap = Record<any, number>;

export default function lerp(
  rate: number,
  precision?: number
): <T extends number | NumberMap>(
  observable: Observable<T>
) => Animatable<ISingle<T>, ISingle<T>> {
  const patch = lerpPatch(rate, precision);
  return observable => {
    return Animatable.create(patch, {
      value$: observable
    });
  };
}
