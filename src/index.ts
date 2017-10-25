import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map as mapOperator } from 'rxjs/operators/map';
import { scan } from 'rxjs/operators/scan';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { startWith } from 'rxjs/operators/startWith';
import { map as mapPatch } from './patches/map';
import { add, subtract, multiply, divide } from './animators/math';
import lerp from './animators/lerp';
import isObservable from './utils/isObservable';
import Animatable from './Animatable';
import { ObservableMap } from './types';
import { ISingle } from './interfaces';
import combine from './animators/combine';
import { move, position } from './sources/mouse';
import toStyle from './sinks/toStyle';

const input$ = fromEvent<Event>(
  document.querySelector('#input') as HTMLInputElement,
  'input'
).pipe(mapOperator(e => (e.target as HTMLInputElement).value));

const toNumber = Animatable.create(
  mapPatch((str: string) => parseInt(str, 10)),
  { value$: input$ }
);

const smooth = lerp(0.1);
const move$ = smooth(position(document.body, 'mousemove'));
move$.subscribe(toStyle('#foo, #bar'));

export { Animatable };
