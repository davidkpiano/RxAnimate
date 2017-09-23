declare var Promise: any;
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators/map';
import { scan } from 'rxjs/operators/scan';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';

(window as any).Observable = Observable;
(window as any).fromEvent = fromEvent;
(window as any).from = from;

function mapValues<T, P>(
  o: Record<string, P>,
  f: (value: P, key: string, collection: Record<string, P>) => T
): Record<string, T> {
  const result: Record<string, any> = {};

  Object.keys(o).forEach(key => {
    result[key] = f(o[key], key, o);
  });

  return result;
}

export type ObservableMap<T> = { [key in keyof T]: Observable<T[key]> };

export interface IPatch<I, O> {
  name?: string;
  operator: (inputs: ObservableMap<I>) => ObservableMap<O>;
}

export type AnimatableInput = Record<string, Observable<any>>;
export type AnimatableOutput = Record<string, Observable<any>>;

export class Animatable<I, O> {
  public outputs: ObservableMap<O>;

  constructor(public patch: IPatch<I, O>, public inputs: ObservableMap<I>) {
    const observableInputs = (this.outputs = patch.operator(inputs));
  }
}

const input$ = fromEvent<Event>(
  document.querySelector('#input') as HTMLInputElement,
  'input'
).pipe(map(e => (e.target as HTMLInputElement).value));

const toNumber = new Animatable<{ value: string }, { value: number }>(
  {
    name: 'string to number',
    operator: ({ value }) => ({
      value: value.pipe(map(str => parseInt(str, 10)))
    })
  },
  { value: input$ }
);

const ftoc = new Animatable<{ f: number }, { c: number }>(
  {
    name: 'Fahrenheit to Celsius',
    operator: inputs => ({
      c: inputs.f.pipe(map(deg => (deg - 32) * 0.56))
    })
  },
  { f: toNumber.outputs.value }
);

ftoc.outputs.c.subscribe(cel => console.log(`${cel} celsius!`));
