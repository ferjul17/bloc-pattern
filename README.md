# bloc-pattern

`bloc-pattern` is an npm package that makes it easier to implement the BLoC (Business Logic Components) pattern in your applications. It provides a clear architecture for managing state and updating data in your applications.

⚠️ Please note that this package is not intended for actual use in production applications. It is simply a means for me to practice publishing a package to npm.

### Installation

You can install this package using npm:

```
npm install bloc-pattern
```

### Usage

This package provides two classes: `Bloc` and `Cubit`

#### `Bloc<EVENT, STATE>`

The `Bloc` class provides a way to handle events and state changes. It takes two type parameters: `EVENT` and `STATE`.

```typescript
import { Bloc } from 'bloc-pattern';

class CounterEvent {
  constructor(public readonly value: number) {}
}
class IncreaseEvent extends CounterEvent {}
class DecreaseEvent extends CounterEvent {}

class CounterBloc extends Bloc<typeof CounterEvent, number> {
  public constructor(state: number) {
    super(state);

    this.on((event: CounterEvent) => {
      if (event instanceof IncreaseEvent)
        return this.emit(this.getState() + event.value);
      if (event instanceof DecreaseEvent)
        return this.emit(this.getState() - event.value);
    });
  }
}

const bloc = new CounterBloc(0);

bloc.getStream().forEach(console.log); // 0

bloc.add(new IncreaseEvent(10)); // 10
bloc.add(new DecreaseEvent(7)); // 3

bloc.close();
```

#### `Cubit<STATE>`

The `Cubit` class provides a simpler way to handle state changes. It takes a single type parameter: `STATE`.

```typescript
import { Cubit } from 'bloc-pattern';

class Counter extends Cubit<number> {
  public increase(value: number) {
    this.emit(this.getState() + value);
  }
  public decrease(value: number) {
    this.emit(this.getState() - value);
  }
}

const cubit = new Counter(0);

cubit.getStream().forEach(console.log); // 0

cubit.increase(10); // 10
cubit.decrease(7); // 3

cubit.close();
```
