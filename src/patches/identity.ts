import { Patch, ScalarObservableMap, ObservableMap } from '../types';

export default function identity<T>(
  inputs: ObservableMap<T>
): ObservableMap<T> {
  return inputs;
}
