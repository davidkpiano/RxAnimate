import { map } from 'rxjs/operators/map';
import { takeWhile } from 'rxjs/operators/takeWhile';

import { ObservableMap, Outputs } from '../types';
import Animatable from '../Animatable';
import { animationFrame } from '../sources/animationFrame';
import identityPatch from '../patches/identity';
import { combineLatest } from 'rxjs/observable/combineLatest';
import toObservable, { toObservableMap } from '../utils/toObservable';
import { Observable } from 'rxjs/Observable';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { merge } from 'rxjs/observable/merge';

export type Keyframe = {
  [property: string]: string | number;
  offset: number;
  easing: string;
};

export type Keyframes = Keyframe[];

// export type Easing = ((offset: number) => number) | string;
export type Easing = (offset: number) => number;

export interface ITiming {
  duration: number;
  easing: Easing;
  progress: number;
}

export interface ITween extends Outputs {
  progress$: number;
  value$: number;
}

function transitionPatch(
  timing: ObservableMap<ITiming>
): ObservableMap<ITween> {
  const frame$ = timing.progress;
  // const frame$ = fromEventPattern((cb: (time: number) => void) => tl.onTick(cb));
  const duration$ = timing.duration;
  const easing$ = timing.easing;

  const progress$ = combineLatest(
    frame$,
    duration$,
    easing$,
    (frame: number, duration, easing) => {
      const offset = Math.max(0, Math.min(easing(frame / duration), 1));
      return offset;
    }
  );

  return { progress$, value$: progress$ };
}

export default function tween(
  timing: ObservableMap<ITiming>
): Animatable<ITiming, ITween> {
  return new Animatable(transitionPatch, timing);
}

export function transition(
  start: number,
  end: number,
  timing: {
    duration: number | Observable<number>;
    easing: Easing | Observable<Easing>;
    progress: number | Observable<number>;
  }
): ObservableMap<ITween> {
  const resolvedTiming = {
    duration: toObservable(timing.duration),
    easing: toObservable(timing.easing),
    progress: toObservable(timing.progress)
  };
  const tweenAnim = tween(resolvedTiming);

  const mappedProgress$ = tweenAnim.outputs.progress$.pipe(
    map(progress => {
      const delta = end - start;
      const deltaProgress = progress * delta;
      const mappedProgress = start + deltaProgress;
      return mappedProgress;
    })
  );

  return {
    progress$: mappedProgress$,
    value$: mappedProgress$
  };
}
