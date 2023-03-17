import { BlocBase } from './bloc-base.js';

export class Cubit<STATE> extends BlocBase<STATE> {
  public constructor(state: STATE) {
    super(state);
  }
}
