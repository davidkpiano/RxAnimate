import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map } from 'rxjs/operators/map';

export type EventPosition = {
  x: number;
  y: number;
};

export function position(
  element: EventTarget,
  eventName: string
): Observable<EventPosition> {
  return fromEvent<MouseEvent>(element, eventName).pipe(
    map(event => ({
      x: event.clientX,
      y: event.clientY
    }))
  );
}

export function move(element: EventTarget): Observable<MouseEvent> {
  return fromEvent(element, 'mousemove');
}

export function down(element: EventTarget): Observable<MouseEvent> {
  return fromEvent(element, 'mousedown');
}
