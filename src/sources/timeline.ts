import { animationFrame } from './animationFrame';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { mapTo } from 'rxjs/operators/mapTo';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { scan } from 'rxjs/operators/scan';
import { of as just } from 'rxjs/observable/of';
import { ObservableMap, Outputs } from '../types';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { pairwise } from 'rxjs/operators/pairwise';
import { map } from 'rxjs/operators/map';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { tap } from 'rxjs/operators/tap';

(window as any).cc = new BehaviorSubject('pause');

export default function timeline(
  inputs: ObservableMap<{
    tick$?: number;
    rate$?: number;
    action$?: string; // 'finish' | 'pause' | 'play' | 'reverse';
  }> = {}
) {
  const internalAction$ = (window as any).cc;
  const tick$: Observable<number> = animationFrame();
  const rate$: Observable<number> = just(1);
  const action$: Observable<string> = inputs.action$
    ? inputs.action$
    : internalAction$;

  console.log(action$);
  action$.pipe(tap(e => console.log(e)));
  action$.subscribe(e => console.log(e));

  const delta$ = tick$.pipe(
    pairwise(),
    map(([prevTick, nextTick]) => nextTick - prevTick)
  );

  const rateAction$ = rate$.pipe(
    map(rate => ({
      type: 'RATE',
      value: rate
    }))
  );

  type AA = { rate: number; state: string; offset: number };

  const state$ = merge(delta$, action$, rate$).pipe(
    scan<string | number | {}, AA>(
      (state, action) => {
        if (typeof action === 'string') {
          switch (action) {
            case 'finish':
              state.state = 'finished';
              break;
            case 'pause':
              state.state = 'paused';
              break;
            case 'play':
              state.state = 'running';
              state.rate = Math.abs(state.rate);
              break;
            case 'reverse':
              state.state = 'running';
              state.rate = -1 * Math.abs(state.rate);
              break;
            case 'reset':
              state.state = 'paused';
              state.offset = 0;
              break;
            default:
              state.state = state.state;
              break;
          }
        } else if (typeof action === 'number') {
          if (state.state !== 'paused') {
            state.offset = Math.max(0, state.offset + state.rate * action);
          }
        }

        return state;
      },
      { rate: 1, state: 'paused', offset: 0 } as AA
    )
  );

  // const timelineDelta$ = delta$.pipe(
  //   withLatestFrom(state$, (delta, state) => {
  //     return state.state === 'paused' || state.state === 'finished'
  //       ? 0
  //       : state.rate * delta;
  //   }),
  //   distinctUntilChanged()
  // );

  return {
    value$: state$.pipe(map(state => state.offset), distinctUntilChanged()),
    state$
  };
}
