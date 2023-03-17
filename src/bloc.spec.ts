import { lastValueFrom, toArray } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { StateError } from './bloc-base.js';
import { Bloc } from './bloc.js';

class Event {}

class TestBloc extends Bloc<typeof Event, number> {
  public override on(
    ...args: Parameters<Bloc<typeof Event, number>['on']>
  ): ReturnType<Bloc<typeof Event, number>['on']> {
    return super.on(...args);
  }

  public override emit(
    ...args: Parameters<Bloc<typeof Event, number>['emit']>
  ): ReturnType<Bloc<typeof Event, number>['emit']> {
    return super.emit(...args);
  }

  public override onChange(
    ...args: Parameters<Bloc<typeof Event, number>['onChange']>
  ): ReturnType<Bloc<typeof Event, number>['onChange']> {
    return super.onChange(...args);
  }

  public override onError(
    ...args: Parameters<Bloc<typeof Event, number>['onError']>
  ): ReturnType<Bloc<typeof Event, number>['onError']> {
    return super.onError(...args);
  }
}

describe('Bloc', function () {
  let bloc: TestBloc;

  beforeEach(() => {
    bloc = new TestBloc(0);
  });

  afterEach(() => {
    bloc.close();
  });

  it('should have a state', () => {
    expect(bloc.getState()).toBe(0);
  });

  it('should emit a new state', () => {
    bloc.emit(1);

    expect(bloc.getState()).toBe(1);
  });

  it('should call functions given to on when a new event is added', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    bloc.on(fn1);
    bloc.on(fn2);

    const event = new Event();
    bloc.add(event);

    expect(fn1).toHaveBeenCalledOnce();
    expect(fn1).toHaveBeenCalledWith(event);
    expect(fn2).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledWith(event);
  });

  it('should throw an error if the bloc is closed', () => {
    bloc.close();
    const onError = vi.spyOn(bloc, 'onError');

    expect(() => bloc.emit(1)).toThrowError(
      new StateError('Cannot emit new states after calling close'),
    );
    expect(onError).not.toHaveBeenCalled();
  });

  it('should trigger onChange when a new state is emitted', async () => {
    const onChange = vi.spyOn(bloc, 'onChange');

    bloc.emit(1);

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith({ currentState: 0, nextState: 1 });
  });

  it('should trigger onError when an error is added', () => {
    const onError = vi.spyOn(bloc, 'onError');
    const error = new Error('Test error');

    bloc.addError(error);

    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should emit values in the stream', async () => {
    const promise = lastValueFrom(bloc.getStream().pipe(toArray()));

    bloc.emit(1);
    bloc.emit(2);
    bloc.close();

    await expect(promise).resolves.toEqual([0, 1, 2]);
  });
});
