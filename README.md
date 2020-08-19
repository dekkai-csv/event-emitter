<div align="center">

![@dekkai/event-emitter](https://raw.githubusercontent.com/dekkai-csv/assets/master/svg/dekkai_event-emitter_banner_light.svg)  
![browser](https://github.com/dekkai-csv/event-emitter/workflows/browser/badge.svg)
![node](https://github.com/dekkai-csv/event-emitter/workflows/node/badge.svg)
![deno](https://github.com/dekkai-csv/event-emitter/workflows/deno/badge.svg)
![opinion](https://img.shields.io/badge/badges_are-meaningless-blue)

</div>

# @dekkai/event-emitter 

An event emitter class, supports omni-listeners and symbol events. Tested on browsers, node.js and deno.

Check out the full [API Documentation](https://dekkai-csv.github.io/event-emitter/)

## Installation

**Browser/NodeJS**
```shell script
$ yarn add @dekkai/event-emitter
```

**Deno**
```javascript
// import from directly from a CDN, like unpkg.com
import {EventEmitter} from 'https://unpkg.com/@dekkai/event-emitter';
```

## Usage

```javascript
// import EventEmitter
import {EventEmitter} from '@dekkai/event-emitter';

// can be extended
class MyEmitter extends EventEmitter {
    // ...
}

// instantiate the emitter
const emitter = new MyEmitter();

// create an event handler
const handler = (evt, num0, num1) => console.log(`Event [${evt.toString()}] result: ${num0 + num1}`);

// register the handler
emitter.on('add', handler);

// events can also be symbols
const symbolEvent = Symbol('add-symbol');
emitter.on(symbolEvent, handler);

// emit events
emitter.emit('add', 4, 6); // Event [add] result: 10
emitter.emit(symbolEvent, 12, 8); // Event [Symbol(add-symbol)] result: 20

// remove previously added listeners
emitter.off('add', handler);
emitter.off(symbolEvent, handler);

// use omni-listeners to catch all events, register them using the `omniEvent` static property
const omniHandler = evt => console.log(evt.toString());
emitter.on(MyEmitter.omniEvent, omniHandler);

// the omni-listener will catch all events
emitter.emit('hello'); // hello
emitter.emit(Symbol('random symbol')); // Symbol(random symbol)

// removing omni-listeners works the same way as with regular listeners, but using the `omniEvent`
emitter.off(MyEmitter.omniEvent, omniHandler);
```

Check out the full [API Documentation](https://dekkai-csv.github.io/workers/)
