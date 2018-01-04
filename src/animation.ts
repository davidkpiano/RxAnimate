import { Observable } from 'rxjs/Observable';
import { ObservableMap } from './types';
import { map } from 'rxjs/operators/map';
import { merge } from 'rxjs/observable/merge';
import { scan } from 'rxjs/operators/scan';
import { startWith } from 'rxjs/operators/startWith';

export interface Updater<TState> {
  (state: TState, action: {}): TState;
}

export interface Action<TActionType extends string> {
  type: TActionType;
  payload: any;
}

function mergeActions<TState, TActions>(actionMap: ObservableMap<TActions>) {
  const actions: Observable<any>[] = [];
  Object.keys(actionMap).forEach(key => {
    actions.push(
      actionMap[key as keyof TActions].pipe(
        map(payload => ({
          type: key,
          payload
        }))
      )
    );
  });

  return merge(...actions);
}

function createUpdater<TState, TActions>(
  updates: Record<keyof TActions, Updater<TState>>
) {
  return (state: TState, action: Action<keyof TActions>) => {
    const reducer = updates[action.type];
    if (!reducer) return state;
    return reducer(state, action.payload);
  };
}

export default function animation<TState, TActions>(
  actions: ObservableMap<TActions>,
  updates: Record<keyof TActions, Updater<TState>>,
  initialState: TState
): Observable<TState> {
  const action$ = mergeActions(actions);
  const updater = createUpdater(updates);
  return action$.pipe(scan(updater, initialState), startWith(initialState));
}
