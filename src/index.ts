import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map as mapOperator } from 'rxjs/operators/map';
import { scan } from 'rxjs/operators/scan';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { startWith } from 'rxjs/operators/startWith';
import { Animatable } from './Animatable';
import { map as mapPatch } from './patches/map';
import { add, subtract, multiply, divide } from './patches/math';
import { lerp } from './patches/lerp';

import { ObservableMap } from './types';

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

const added = Animatable.create(add, {
  a: of(5),
  b: toNumber.outputs.value$
});

console.log(added.outputs.value$.subscribe(v => console.log('here', v)));

// subtractPatch,
// dividePatch,
// multiplyPatch

// {
//   divide: {
//     $a: 5,
//     $b: 9
//   },
//   subtract: {
//     $b: 32
//   },
//   multiply: {
//     $a: ['divide', '$c'],
//     $b: ['subtract', '$b']
//   }
// }

function p(number$: Observable<number>) {
  const addP = Animatable.create(add, {
    a: of(459),
    b: number$
  });

  const subtractP = Animatable.create(subtract, {
    a: number$,
    b: of(32)
  });

  const divideP = Animatable.create(divide, {
    a: of(5),
    b: of(9)
  });
  const multiplyK = Animatable.create(multiply, {
    a: addP.outputs.value$,
    b: divideP.outputs.value$
  });

  const multiplyP = Animatable.create(multiply, {
    a: divideP.outputs.value$,
    b: subtractP.outputs.value$
  });

  // const smooth = Animatable.create(lerp(0.1), {
  //   value$: multiplyP.outputs.value$
  // });
  return combineLatest(
    multiplyP.outputs.value$,
    multiplyK.outputs.value$,
    (celsius, kelvin) => ({
      celsius,
      kelvin
    })
  );
}

p(toNumber.outputs.value$).subscribe(e => {
  console.log(e);
  const foo = document.getElementById('foo') as HTMLElement;

  foo.style.width = `${e.celsius}px`;
  foo.style.height = `${e.celsius}px`;
});

export { Animatable };
