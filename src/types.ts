import { Observable } from 'rxjs/Observable';

export type ObservableMap<T> = { [key in keyof T]: Observable<T[key]> };

export type SingleObservableMap<T> = { value$: Observable<T> };

export interface Patch<I extends Inputs, O extends Outputs> {
  (inputs: ObservableMap<I>): ObservableMap<O>;
  patchName?: string;
}

export interface ISingle<T> {
  value$: T;
}

export interface Inputs {
  [key: string]: any;
}

export interface Outputs<T = any> extends Inputs {
  value$: T;
}

export interface SingleInput<T> {
  value$: T;
}
