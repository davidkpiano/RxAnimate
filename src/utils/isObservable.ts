import { Observable } from 'rxjs/Observable';
import symbolObservable from 'symbol-observable';

export default function isObservable(obs: any): obs is Observable<any> {
  return Boolean(obs && obs[symbolObservable]);
}
