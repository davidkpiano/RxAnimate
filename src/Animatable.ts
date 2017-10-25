/// <reference types="rxjs" />

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators/map';
import { scan } from 'rxjs/operators/scan';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ObservableMap, Patch, SingleObservableMap } from './types';
import { ISingle } from './interfaces';
import { combineOperator } from './patches/combine';

(window as any).Observable = Observable;
(window as any).fromEvent = fromEvent;
(window as any).from = from;

export interface IAnimatable {
  single: boolean;
}

export default class Animatable<I, O> {
  public outputs: ObservableMap<O> | SingleObservableMap<O>;
  public single: boolean;

  constructor(public patch: Patch<I, O>, public inputs: ObservableMap<I>) {
    this.outputs = patch(inputs);

    // An Animatable is considered "single" if it outputs only a single stream of values.
    if (Object.keys(this.outputs).length === 1 && 'value$' in this.outputs) {
      this.single = true;
    }
  }

  //#region Animatable.single
  static single<I>(
    patch: Patch<ISingle<I>, ISingle<I>>,
    input$: Observable<I>
  ): Animatable<ISingle<I>, ISingle<I>>;
  static single<I, O>(
    patch: Patch<ISingle<I>, ISingle<O>>,
    input$: Observable<I>
  ): Animatable<ISingle<I>, ISingle<O>>;
  static single<I, O>(
    patch: Patch<ISingle<I>, ISingle<O>>,
    input$: Observable<I>
  ): Animatable<ISingle<I>, ISingle<O>> {
    return new Animatable(patch, { value$: input$ });
  }
  //#endregion

  //#region Animatable.create
  static create<I>(
    patch: Patch<I, I>,
    inputs: ObservableMap<I>
  ): Animatable<I, I>;
  static create<I, O>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>
  ): Animatable<I, O>;
  static create<I, O>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>
  ): Animatable<I, O> {
    return new Animatable(patch, inputs);
  }
  //#endregion

  public subscribe(...args: any[]): Subscription {
    if (this.single) {
      return (this.outputs as SingleObservableMap<O>).value$.subscribe(...args);
    }

    return combineOperator(this.outputs as ObservableMap<O>).subscribe(...args);
  }
}
