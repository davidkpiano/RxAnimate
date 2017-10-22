import Animatable from '../src/Animatable';
import identityPatch from '../src/patches/identity';
import { IMono } from '../src/interfaces';
import { of as observableOf } from 'rxjs/observable/of';
import { assert } from 'chai';

describe('Animatable', () => {
  it('exists', () => {
    assert.exists(Animatable);
  });

  describe('constructor()', () => {
    it('creates a new Animatable instance with inputs and outputs', () => {
      const source$ = observableOf(1, 2, 3);

      const animatable = new Animatable<
        IMono<number>,
        IMono<number>
      >(identityPatch, {
        value$: source$
      });

      assert.instanceOf(animatable, Animatable);
      assert.equal(animatable.inputs.value$, source$);
      assert.equal(animatable.outputs.value$, source$);
    });
  });

  describe('mono()', () => {
    it('creates a new mono Animatable instance', () => {
      const source$ = observableOf(1, 2, 3);

      const animatable = Animatable.mono<number, number>(
        identityPatch,
        source$
      );

      assert.instanceOf(animatable, Animatable);
      assert.equal(animatable.inputs.value$, source$);
      assert.equal(animatable.outputs.value$, source$);
    });
  });
});
