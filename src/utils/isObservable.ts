import { Observable } from 'rxjs/Observable';

export default function isObservable(value: any): value is Observable<any> {
  return value instanceof Observable;
  // return Boolean(obs && obs[symbolObservable]);
}
