import { describe, it, expect } from 'vitest';
import { Cubit } from './cubit';

describe('Cubit', function () {
  it('initializes with a value', () => {
    const symbol = Symbol();
    const cubit = new Cubit(symbol);

    expect(cubit.state()).toBe(symbol);
  });
});
