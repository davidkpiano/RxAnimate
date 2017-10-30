import { map } from 'rxjs/operators/map';
import { takeWhile } from 'rxjs/operators/takeWhile';

import { ObservableMap } from "../types";
import Animatable from "../Animatable";
import { ISingle } from '../interfaces';
import { animationFrame } from '../sources/animationFrame';
import identityPatch from '../patches/identity';
import { combineLatest } from 'rxjs/observable/combineLatest';
import toObservable from '../utils/toObservable';
import { Observable } from 'rxjs/Observable';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { merge } from 'rxjs/observable/merge';

export type Keyframe = {
  [property: string]: string | number;
  offset: number;
  easing: string;
};

export type Keyframes = Keyframe[];

export type Easing = ((offset: number) => number) | string;

export interface ITiming {
  duration: Observable<number> | number,
  easing: (offset: number) => number/* Easing */,
  offset?: number
}



// const tl = (window as any).tl = new Timeline();

export default function tween(
  from: number,
  to: number,
  timing: ITiming
): Animatable<ISingle<number>, ISingle<number>> {
  const frame$ = animationFrame();
  // const frame$ = fromEventPattern((cb: (time: number) => void) => tl.onTick(cb));
  const duration$ = toObservable(timing.duration);
  const animation$ = combineLatest(
    frame$,
    duration$,
    (frame: number, duration) => {
      const offset = Math.min(timing.easing(frame / duration), 1);
      const delta = to - from;
      return delta * offset;
    }
  );

  return new Animatable(identityPatch, {
    value$: animation$
  });
}
