/// <reference types="rxjs" />
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map } from 'rxjs/operators/map';
import { Position2D } from '../types';
import { OperatorFunction } from 'rxjs/interfaces';

// source
export function position(
  element: EventTarget,
  eventName: string
): Observable<Position2D> {
  return fromEvent<MouseEvent>(element, eventName).pipe(
    map(event => ({
      x: event.clientX,
      y: event.clientY
    }))
  );
}

// operator
export function distanceFrom(
  element: Element,
  coordinates: Position2D = { x: 0, y: 0 }
): OperatorFunction<Position2D, number> {
  const { left, top } = element.getBoundingClientRect();
  const relativeLeft = left + coordinates.x;
  const relativeTop = top + coordinates.y;

  return (position$: Observable<Position2D>) => {
    return position$.pipe(
      map(position =>
        Math.hypot(position.x - relativeLeft, position.y - relativeTop)
      )
    );
  };
}
