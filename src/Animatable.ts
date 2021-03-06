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
import mapValues from './utils/mapValues';

(window as any).Observable = Observable;
(window as any).fromEvent = fromEvent;
(window as any).from = from;

export interface IAnimatable {
  single: boolean;
}

const animatables: Animatable<any, any>[] = [];
const observables = new Map<
  Observable<any>,
  {
    parent: Animatable<any, any>;
    parameter: string;
    edges: Set<Observable<any>>;
  }
>();
(window as any).animatables = animatables;
(window as any).os = observables;

export interface AnimatableConfig {
  name?: string;
}

export default class Animatable<
  I extends Inputs,
  O extends Outputs
> extends Observable<O['value$']> {
  public outputs: ObservableMap<O>;
  public name: string;

  constructor(
    public patch: Patch<I, O>,
    public inputs: ObservableMap<I>,
    config: AnimatableConfig = {}
  ) {
    super();
    this.name = config.name || patch.name;
    this.outputs = patch(inputs);
    this.source = this.outputs.value$;

    animatables.push(this);
    Object.keys(this.outputs).forEach(key => {
      observables.set(this.outputs[key], {
        parent: this,
        parameter: key,
        edges: new Set()
      });
    });
    Object.keys(this.inputs).forEach(key => {
      const input = this.inputs[key];
      observables.set(input, {
        parent: this,
        parameter: key,
        edges: new Set([(input as any).source])
      });
    });
  }

  //#region Animatable.single
  static single<I>(
    patch: Patch<ISingle<I>, ISingle<I>>,
    input$: Observable<I>,
    config: AnimatableConfig
  ): Animatable<ISingle<I>, ISingle<I>>;
  static single<I, O>(
    patch: Patch<ISingle<I>, ISingle<O>>,
    input$: Observable<I>,
    config: AnimatableConfig
  ): Animatable<ISingle<I>, ISingle<O>>;
  static single<I, O>(
    patch: Patch<ISingle<I>, ISingle<O>>,
    input$: Observable<I>,
    config: AnimatableConfig = {}
  ): Animatable<ISingle<I>, ISingle<O>> {
    return new Animatable(
      patch,
      {
        value$: input$
      },
      config
    );
  }
  //#endregion

  //#region Animatable.create
  static create<I extends Outputs>(
    patch: Patch<I, I>,
    inputs: ObservableMap<I>,
    config?: AnimatableConfig
  ): Animatable<I, I>;
  static create<I extends Inputs, O extends Outputs>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>,
    config?: AnimatableConfig
  ): Animatable<I, O>;
  static create<I extends Inputs, O extends Outputs>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>,
    config: AnimatableConfig = {}
  ): Animatable<I, O> {
    return new Animatable(patch, inputs, config);
  }
  //#endregion
}
