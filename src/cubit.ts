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

export class Cubit<STATE> {
  private _state: BehaviorSubject<STATE>;
  private _subscription: Subscription;

  public constructor(state: STATE) {
    this._state = new BehaviorSubject<STATE>(state);

    this._subscription = this._state
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

  public addError(error: unknown) {
    this._state.error(error);
  }

  protected emit(state: STATE): void {
    this._state.next(state);
  }

  public state(): STATE {
    return this._state.value;
  }

  public close(): void {
    this._state.complete();
    this._subscription.unsubscribe();
  }

  public stream(): Observable<STATE> {
    return this._state.asObservable();
  }

  protected onChange(change: Change<STATE>): void;
  protected onChange(): void {
    return;
  }

  protected onError(error: unknown): void;
  protected onError(): void {
    return;
  }
}
