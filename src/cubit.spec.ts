import { lastValueFrom, toArray } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { StateError } from './bloc-base.js';
import { Cubit } from './cubit.js';

class TestCubit extends Cubit<number> {
  public override emit(
    ...args: Parameters<Cubit<number>['emit']>
  ): ReturnType<Cubit<number>['emit']> {
    return super.emit(...args);
  }

  public override onChange(
    ...args: Parameters<Cubit<number>['onChange']>
  ): ReturnType<Cubit<number>['onChange']> {
    return super.onChange(...args);
  }

  public override onError(
    ...args: Parameters<Cubit<number>['onError']>
  ): ReturnType<Cubit<number>['onError']> {
    return super.onError(...args);
  }
}

describe('Cubit', function () {
  let cubit: TestCubit;

  beforeEach(() => {
    cubit = new TestCubit(0);
  });

  afterEach(() => {
    cubit.close();
  });

  it('should have a state', () => {
    expect(cubit.getState()).toBe(0);
  });

  it('should emit a new state', () => {
    cubit.emit(1);

    expect(cubit.getState()).toBe(1);
  });

  it('should throw an error if the cubit is closed', () => {
    cubit.close();
    const onError = vi.spyOn(cubit, 'onError');

    expect(() => cubit.emit(1)).toThrowError(
      new StateError('Cannot emit new states after calling close'),
    );
    expect(onError).not.toHaveBeenCalled();
  });

  it('should trigger onChange when a new state is emitted', async () => {
    const onChange = vi.spyOn(cubit, 'onChange');

    cubit.emit(1);

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith({ currentState: 0, nextState: 1 });
  });

  it('should trigger onError when an error is added', () => {
    const onError = vi.spyOn(cubit, 'onError');
    const error = new Error('Test error');

    cubit.addError(error);

    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should emit values in the stream', async () => {
    const promise = lastValueFrom(cubit.getStream().pipe(toArray()));

    cubit.emit(1);
    cubit.emit(2);
    cubit.close();

    await expect(promise).resolves.toEqual([0, 1, 2]);
  });
});
