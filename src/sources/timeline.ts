import { animationFrame } from './animationFrame';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { mapTo } from 'rxjs/operators/mapTo';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { scan } from 'rxjs/operators/scan';
import { of as just } from 'rxjs/observable/of';
import { ObservableMap } from '../types';
import { ISingle } from '../interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { pairwise } from 'rxjs/operators/pairwise';
import { map } from 'rxjs/operators/map';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

(window as any).cc = new BehaviorSubject('pause');

export default function timeline(inputs?: ObservableMap<{
  tick$?: number,
  rate$?: number,
  action$?: 'finish' | 'pause' | 'play' | 'reverse'
}>) {
  const internalAction$ = (window as any).cc;
  const tick$: Observable<number> = animationFrame()
  const rate$: Observable<number> = just(1)
  const action$: Observable<string> = internalAction$

  const delta$ = tick$.pipe(
    pairwise(),
    map(([prevTick, nextTick]) => nextTick - prevTick)
  );

  type AA = { rate: number, state: string };

  const state$ = merge(action$, rate$).pipe(scan<string | number, AA>((state, action) => {
    if (typeof action === 'number') {
      state.rate = action as number;
      return state;
    }

    switch (action) {
      case 'finish':
        state.state = 'finished';
        break;
      case 'pause':
        state.state = 'paused';
        break;
      case 'play':
        state.state = 'running';
        break;
      case 'reverse':
        state.state = 'play';
        state.rate = -1 * Math.abs(state.rate);
        break;
      default:
        state.state = state.state;
        break;
    }

    return state;
  }, { rate: 1, state: 'paused' } as AA));

  const timelineDelta$ = delta$.pipe(withLatestFrom(state$, (delta, state) => {
    return state.state === 'paused' || state.state === 'finished'
      ? 0
      : state.rate * delta;
  }), distinctUntilChanged());

  return {
    value$: timelineDelta$.pipe(scan((offset, delta) => offset + delta, 0)),
    state$
  }
}
