/// <reference types="rxjs" />

import { Observable } from "rxjs/Observable"
import { fromEvent } from "rxjs/observable/fromEvent"
import { from } from "rxjs/observable/from"

import { ObservableMap, Patch, ISingle, Outputs, Inputs } from "./types"

;(window as any).Observable = Observable
;(window as any).fromEvent = fromEvent
;(window as any).from = from

export interface IAnimatable {
  single: boolean
}

export interface AnimatableConfig {
  name?: string
}

export default class Animatable<I extends Inputs, O extends Outputs> extends Observable<
  O["value$"]
> {
  public $: ObservableMap<O>
  public name: string

  constructor(
    public patch: Patch<I, O>,
    public inputs: ObservableMap<I>,
    config: AnimatableConfig = {}
  ) {
    super()
    this.name = config.name || patch.name
    this.$ = patch(inputs)
    this.source = this.$.value$
  }

  //#region Animatable.single
  static single<I>(
    patch: Patch<ISingle<I>, ISingle<I>>,
    input$: Observable<I>,
    config: AnimatableConfig
  ): Animatable<ISingle<I>, ISingle<I>>
  static single<I, O>(
    patch: Patch<ISingle<I>, ISingle<O>>,
    input$: Observable<I>,
    config: AnimatableConfig
  ): Animatable<ISingle<I>, ISingle<O>>
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
    )
  }
  //#endregion

  //#region Animatable.create
  static create<I extends Outputs>(
    patch: Patch<I, I>,
    inputs: ObservableMap<I>,
    config?: AnimatableConfig
  ): Animatable<I, I>
  static create<I extends Inputs, O extends Outputs>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>,
    config?: AnimatableConfig
  ): Animatable<I, O>
  static create<I extends Inputs, O extends Outputs>(
    patch: Patch<I, O>,
    inputs: ObservableMap<I>,
    config: AnimatableConfig = {}
  ): Animatable<I, O> {
    return new Animatable(patch, inputs, config)
  }
  //#endregion
}
