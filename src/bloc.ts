import { map, Subject } from 'rxjs';
import { BlocBase } from './bloc-base';
import type { Class } from 'type-fest';

export class Bloc<EVENT extends Class<unknown>, STATE> extends BlocBase<STATE> {
  private readonly _event: Subject<InstanceType<EVENT>>;

  public constructor(state: STATE) {
    super(state);
    this._event = new Subject();
  }

  public add(event: InstanceType<EVENT>) {
    this._event.next(event);
  }

  protected on(fn: (event: InstanceType<EVENT>) => void | Promise<void>): void {
    this._subscription.add(
      this._event.pipe(map((event) => fn(event))).subscribe(),
    );
  }
}
