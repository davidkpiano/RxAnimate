import css from 'stylefire/css';

export default function toStyle(selector: HTMLElement | NodeList | string) {
  const element: HTMLElement | NodeList =
    typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : selector;

  return function styleSink<T extends { [key: string]: string | number }>(
    value: T
  ) {
    if (element instanceof NodeList) {
      for (let i = 0; i < element.length; i++) {
        css(element[i] as HTMLElement).set(value);
      }
    } else {
      css(element).set(value);
    }
  };
}
