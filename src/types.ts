import { Observable } from 'rxjs/Observable';

export type ObservableMap<T> = { [key in keyof T]: Observable<T[key]> };

export type ScalarObservableMap<T> = { value$: Observable<T> };

export type Patch<I, O> = (inputs: ObservableMap<I>) => ObservableMap<O>;
