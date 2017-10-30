import { Observable } from 'rxjs/Observable';

export function animationFrame(): Observable<number> {
  return new Observable(observer => {
    let active = true;
    const start = performance.now();

    const tick = () => {
      observer.next(performance.now() - start);

      if (active) requestAnimationFrame(tick);
    };

    tick();

    return () => {
      active = false;
    };
  });
}
