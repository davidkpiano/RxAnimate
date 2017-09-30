import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators/map';
import { scan } from 'rxjs/operators/scan';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';

import { ObservableMap, Patch } from './types';
import { IAnimatableScalar } from './interfaces';
import isObservable from './utils/isObservable';

(window as any).Observable = Observable;
(window as any).fromEvent = fromEvent;
(window as any).from = from;

export class Animatable<I, O> {
  public outputs: ObservableMap<O>;
  public mono: boolean;

  constructor(public patch: Patch<I, O>, public inputs: ObservableMap<I>) {
    this.outputs = patch(inputs);

    // An Animatable is considered "mono" if it outputs only a single stream of values.
    if (Object.keys(this.outputs).length === 1 && 'value$' in this.outputs) {
      this.mono = true;
    }
  }

  static create<I, O>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>
  ): Animatable<I, O> {
    return new Animatable(patch, inputs);
  }
}
