import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map as mapOperator } from 'rxjs/operators/map';
import { scan } from 'rxjs/operators/scan';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { startWith } from 'rxjs/operators/startWith';
import { add, subtract, multiply, divide } from './animators/math';
import lerp from './animators/lerp';
import isObservable from './utils/isObservable';
import Animatable from './Animatable';
import { ObservableMap } from './types';
import combine from './animators/combine';
import { move, position } from './sources/mouse';
import toStyle from './sinks/toStyle';
import tween, { transition } from './animators/tween';
import timeline from './sources/timeline';
import { mapTo } from 'rxjs/operators/mapTo';
import { merge } from 'rxjs/observable/merge';

const input$ = fromEvent<Event>(
  document.querySelector('#input') as HTMLInputElement,
  'input'
).pipe(mapOperator(e => (e.target as HTMLInputElement).value));

const duration$ = fromEvent<Event>(
  document.querySelector('#duration') as HTMLInputElement,
  'input'
).pipe(
  mapOperator(e => +(e.target as HTMLInputElement).value),
  startWith(10000)
);

const smooth = lerp(0.1);
const move$ = smooth(position(document.body, 'mousemove'));
move$.subscribe(toStyle('#foo, #bar'));

console.log(move$);

const tl = timeline({
  action$: merge(
    fromEvent(
      document.getElementById('play') as HTMLButtonElement,
      'click'
    ).pipe(mapTo('play')),
    fromEvent(
      document.getElementById('pause') as HTMLButtonElement,
      'click'
    ).pipe(mapTo('pause')),
    fromEvent(
      document.getElementById('reset') as HTMLButtonElement,
      'click'
    ).pipe(mapTo('reset')),
    fromEvent(
      document.getElementById('reverse') as HTMLButtonElement,
      'click'
    ).pipe(mapTo('reverse'))
  )
});

// fromEvent(document.body, 'click')
//   .pipe(mapTo('play'))
//   .subscribe(e => console.log(e));

// tl.value$.subscribe(e => console.log(e));

(window as any).a = transition(100, 500, {
  duration: duration$,
  easing: t => 1 - Math.pow(1 - t, 3),
  progress: tl.value$
}).progress$.subscribe((e: number) => {
  console.log(e);
  (window as any).baz.style.setProperty(
    'transform',
    `translateX(
      calc(${e} * 1px)
    )`
  );
});

export { Animatable };
