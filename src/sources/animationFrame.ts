import { Observable } from 'rxjs/Observable';

export function animationFrame(): Observable<number> {
  return new Observable(observer => {
    let active = true;

    const tick = () => {
      observer.next(performance.now());

      if (active) requestAnimationFrame(tick);
    };

    tick();

    return () => {
      active = false;
    };
  });
}
