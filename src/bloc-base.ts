import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  Observable,
  pairwise,
  Subscription,
  tap,
} from 'rxjs';
import type { Change } from './change';

export class StateError extends Error {}

export abstract class BlocBase<STATE> {
  protected readonly _stateSubject: BehaviorSubject<STATE>;
  protected readonly _subscription: Subscription;

  protected constructor(state: STATE) {
    this._stateSubject = new BehaviorSubject<STATE>(state);
    this._subscription = this._stateSubject
      .pipe(
        pairwise(),
        map(
          ([currentState, nextState]): Change<STATE> => ({
            currentState,
            nextState,
          }),
        ),
        tap((change) => this.onChange(change)),
        catchError((error) => {
          this.onError(error);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public getStream(): Observable<STATE> {
    return this._stateSubject.asObservable();
  }

  public getState(): STATE {
    return this._stateSubject.value;
  }

  public isClosed(): boolean {
    return this._subscription.closed;
  }

  protected emit(state: STATE): void {
    try {
      if (this.isClosed()) {
        throw new StateError('Cannot emit new states after calling close');
      }
      this._stateSubject.next(state);
    } catch (e) {
      this.addError(e);
      throw e;
    }
  }

  public addError(error: unknown): void {
    this._stateSubject.error(error);
  }
  protected onChange(change: Change<STATE>): void;
  protected onChange(): void {
    return;
  }

  protected onError(error: unknown): void;
  protected onError(): void {
    return;
  }

  public close(): void {
    this._stateSubject.complete();
    this._subscription.unsubscribe();
  }
}
