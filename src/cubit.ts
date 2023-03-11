import { BlocBase } from './bloc-base';

export class Cubit<STATE> extends BlocBase<STATE> {
  public constructor(state: STATE) {
    super(state);
  }
}
