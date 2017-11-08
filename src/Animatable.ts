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

import {
  ObservableMap,
  Patch,
  SingleObservableMap,
  ISingle,
  Outputs,
  Inputs
} from './types';
import { combineOperator } from './patches/combine';

(window as any).Observable = Observable;
(window as any).fromEvent = fromEvent;
(window as any).from = from;

export interface IAnimatable {
  single: boolean;
}

export default class Animatable<
  I extends Inputs,
  O extends Outputs
> extends Observable<O['value$']> {
  public outputs: ObservableMap<O>;

  constructor(public patch: Patch<I, O>, public inputs: ObservableMap<I>) {
    super();
    this.outputs = patch(inputs);
    this.source = this.outputs.value$;
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
  static create<I extends Outputs>(
    patch: Patch<I, I>,
    inputs: ObservableMap<I>
  ): Animatable<I, I>;
  static create<I extends Inputs, O extends Outputs>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>
  ): Animatable<I, O>;
  static create<I extends Inputs, O extends Outputs>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>
  ): Animatable<I, O> {
    return new Animatable(patch, inputs);
  }
  //#endregion
}
