import toObservable from '../utils/toObservable';
import Animatable from '../Animatable';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators/map';
import { IMono } from '../interfaces';
import { ObservableMap } from '../types';
import lerpPatch from '../patches/lerp';

export default function lerp(
  rate: number,
  precision?: number
): (
  observable: Observable<number>
) => Animatable<IMono<number>, IMono<number>> {
  const patch = lerpPatch(rate, precision);
  return (observable: Observable<number>) => {
    return Animatable.create<
      IMono<number>,
      IMono<number>
    >(patch, { value$: observable });
  };
}
