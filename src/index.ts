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
import { IMono } from './interfaces';
import combine from './animators/combine';

function ooo<T>(val: T | Observable<T>): Observable<T> {
  if (isObservable(val)) {
    return val;
  }

  return of(val);
}

const input$ = fromEvent<Event>(
  document.querySelector('#input') as HTMLInputElement,
  'input'
).pipe(mapOperator(e => (e.target as HTMLInputElement).value));

// const toNumber = new Animatable<{ value: string }, { value: number }>(
//   {
//     name: 'string to number',
//     operator: ({ value }) => ({
//       value: value.pipe(mapOperator(str => parseInt(str, 10)))
//     })
//   },
//   { value: input$ }
// );

const toNumber = Animatable.create(
  mapPatch((str: string) => parseInt(str, 10)),
  { value$: input$ }
);
const ftoc = Animatable.create(mapPatch((deg: number) => (deg - 32) * 0.56), {
  value$: toNumber.outputs.value$
});

// const ftoc = new Animatable<{ f: number }, { c: number }>(
//   {
//     name: 'Fahrenheit to Celsius',
//     operator: inputs => ({
//       c: inputs.f.pipe(mapOperator(deg => (deg - 32) * 0.56))
//     })
//   },
//   { f: toNumber.outputs.value }
// );

ftoc.outputs.value$.subscribe(cel => console.log(`${cel} celsius!`));

function p(number$: Observable<number>) {
  const multiplyK = multiply(add(459, number$), divide(5, 9));
  const multiplyP = multiply(divide(5, 9), subtract(number$, 32));

  // const smooth = Animatable.create(lerp(0.1), {
  //   value$: multiplyP.outputs.value$
  // });

  return lerp(0.1)(multiplyP.outputs.value$);

  // return combine({
  //   celsius: lerp(0.1)(multiplyP.outputs.value$),
  //   kelvin: multiplyK.outputs.value$
  // });

  // return combineLatest(
  //   multiplyP.outputs.value$,
  //   multiplyK.outputs.value$,
  //   (celsius, kelvin) => ({
  //     celsius,
  //     kelvin
  //   })
  // );
}

console.log(p(toNumber.outputs.value$));

p(toNumber.outputs.value$).outputs.value$.subscribe(e => {
  console.log(e);
  const foo = document.getElementById('foo') as HTMLElement;

  foo.style.width = `${e}px`;
  foo.style.height = `${e}px`;
});

export { Animatable };
