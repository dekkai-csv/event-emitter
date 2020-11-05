import {EventEmitter} from '../build/dist/mod.js';

async function run(env) {
    const {
        chai,
    } = env;

    const sym = Symbol('event');
    const noOp = () => {};

    function eventTests(instance) {
        it('adds event listeners for string events', function() {
            instance.on('event', noOp);
            const listeners = instance.listeners.get('event');
            chai.expect(listeners.has(noOp)).to.equal(true);
        });

        it('removes event listeners for string events', function() {
            const listeners = instance.listeners.get('event');
            // make sure the listener is still on
            chai.expect(listeners.has(noOp)).to.equal(true);
            // remove the listener
            instance.off('event', noOp);
            chai.expect(listeners.has(noOp)).to.equal(false);
        });

        it('adds event listeners for symbol events', function() {
            instance.on(sym, noOp);
            const listeners = instance.listeners.get(sym);
            chai.expect(listeners.has(noOp)).to.equal(true);
        });

        it('removes event listeners for symbol events', function() {
            const listeners = instance.listeners.get(sym);
            // make sure the listener is still on
            chai.expect(listeners.has(noOp)).to.equal(true);
            // remove the listener
            instance.off(sym, noOp);
            chai.expect(listeners.has(noOp)).to.equal(false);
        });

        it('adds event omni-listeners', function() {
            instance.on(EventEmitter.omniEvent, noOp);
            const listeners = instance.listeners.get(EventEmitter.omniEvent);
            chai.expect(listeners.has(noOp)).to.equal(true);
        });

        it('removes event omni-listeners', function() {
            const listeners = instance.listeners.get(EventEmitter.omniEvent);
            // make sure the listener is still on
            chai.expect(listeners.has(noOp)).to.equal(true);
            // remove the listener
            instance.off(EventEmitter.omniEvent, noOp);
            chai.expect(listeners.has(noOp)).to.equal(false);
        });

        it('emits simple string events to specific listeners', function() {
            const evt = 'event::simple';

            let emitCount = 0;
            const callback = event => {
                if (event === evt) {
                    ++emitCount;
                }
            };

            instance.on(evt, callback);

            instance.emit(evt);
            chai.expect(emitCount).to.equal(1);

            instance.emit(evt);
            chai.expect(emitCount).to.equal(2);

            instance.emit(evt);
            chai.expect(emitCount).to.equal(3);

            instance.off(evt);
        });

        it('emits simple symbol events to specific listeners', function() {
            const evt = Symbol('event::simple');

            let emitCount = 0;
            const callback = event => {
                if (event === evt) {
                    ++emitCount;
                }
            };

            instance.on(evt, callback);

            instance.emit(evt);
            chai.expect(emitCount).to.equal(1);

            instance.emit(evt);
            chai.expect(emitCount).to.equal(2);

            instance.emit(evt);
            chai.expect(emitCount).to.equal(3);

            instance.off(evt);
        });

        it('emits simple string events to omni-listeners', function() {
            const evt1 = 'event::01';
            const evt2 = 'event::02';
            const evt3 = 'event::03';

            let evt1Count = 0;
            let evt2Count = 0;
            let evt3Count = 0;
            let unknownCount = 0;

            const callback = event => {
                switch (event) {
                    case evt1:
                        ++evt1Count;
                        break;

                    case evt2:
                        ++evt2Count;
                        break;

                    case evt3:
                        ++evt3Count;
                        break;

                    default:
                        ++unknownCount;
                        break;
                }
            };

            instance.on(EventEmitter.omniEvent, callback);

            for (let i = 0; i < 3; ++i) {
                instance.emit(evt1);
                instance.emit(evt2);
                instance.emit(evt3);
                instance.emit(`unknown_event_${i}`);

                chai.expect(evt1Count).to.equal(i + 1);
                chai.expect(evt2Count).to.equal(i + 1);
                chai.expect(evt3Count).to.equal(i + 1);
                chai.expect(unknownCount).to.equal(i + 1);
            }

            instance.off(EventEmitter.omniEvent, callback);
        });

        it('emits strings events with arguments to specific listeners', function() {
            const evt = 'argsStrEvent';

            const arg0 = Math.random();
            const arg1 = Math.random();
            const arg2 = Math.random();

            const result = [];

            const callback = (event, ...args) => result.push(...args);

            instance.on(evt, callback);
            instance.emit(evt, arg0, arg1, arg2);
            instance.off(evt, callback);

            chai.expect(result[0]).to.equal(arg0);
            chai.expect(result[1]).to.equal(arg1);
            chai.expect(result[2]).to.equal(arg2);
        });

        it('emits symbol events with arguments to specific listeners', function() {
            const evt = Symbol('argsSymbolEvent');

            const arg0 = Math.random();
            const arg1 = Math.random();
            const arg2 = Math.random();

            const result = [];

            const callback = (event, ...args) => result.push(...args);

            instance.on(evt, callback);
            instance.emit(evt, arg0, arg1, arg2);
            instance.off(evt, callback);

            chai.expect(result[0]).to.equal(arg0);
            chai.expect(result[1]).to.equal(arg1);
            chai.expect(result[2]).to.equal(arg2);
        });

        it('emits strings events with arguments to omni-listeners', function() {
            const evt = 'argsStrEventOmni';

            const arg0 = Math.random();
            const arg1 = Math.random();
            const arg2 = Math.random();

            const result = [];

            const callback = (event, ...args) => result.push(...args);

            instance.on(EventEmitter.omniEvent, callback);
            instance.emit(evt, arg0, arg1, arg2);
            instance.off(EventEmitter.omniEvent, callback);

            chai.expect(result[0]).to.equal(arg0);
            chai.expect(result[1]).to.equal(arg1);
            chai.expect(result[2]).to.equal(arg2);
        });

        it('emits symbol events with arguments to omni-listeners', function() {
            const evt = Symbol('argsSymbolEventOmni');

            const arg0 = Math.random();
            const arg1 = Math.random();
            const arg2 = Math.random();

            const result = [];

            const callback = (event, ...args) => result.push(...args);

            instance.on(EventEmitter.omniEvent, callback);
            instance.emit(evt, arg0, arg1, arg2);
            instance.off(EventEmitter.omniEvent, callback);

            chai.expect(result[0]).to.equal(arg0);
            chai.expect(result[1]).to.equal(arg1);
            chai.expect(result[2]).to.equal(arg2);
        });

        it('does NOT emit the omni-event', function() {
            let evtCount = 0;
            const callback = () => ++evtCount;

            instance.on(EventEmitter.omniEvent, callback);

            instance.emit('randomEvent');
            chai.expect(evtCount).to.equal(1);
            instance.emit(EventEmitter.omniEvent);
            chai.expect(evtCount).to.equal(1);

            instance.off(EventEmitter.omniEvent, callback);
        });
    }

    describe('EventEmitter', function() {
        describe('Standalone', function() {
            const instance = new EventEmitter();
            eventTests(instance);
        });

        describe('Extended', function() {
            class Simple extends EventEmitter {
                constructor() {
                    super();
                    this.name = 'EventEmitter';
                }
                sayHello() {
                    return `Hello ${this.name}!`;
                }
            }

            const instance = new Simple();
            eventTests(instance);

            it('can access inherited properties', function() {
                chai.expect(instance.name).to.equal('EventEmitter');
            });

            it('can access inherited functions', function() {
                chai.expect(instance.sayHello()).to.equal('Hello EventEmitter!');
            });

            it('correctly reports extended inheritance', function () {
                chai.expect(instance instanceof Simple).to.equal(true);
            });
        });

        describe('Mixed In', function() {
            class Simple {
                constructor() {
                    this.name = 'EventEmitter';
                }
                sayHello() {
                    return `Hello ${this.name}!`;
                }
            }
            const Mixed = EventEmitter.mixin(Simple);
            const instance = new Mixed();
            eventTests(instance);

            it('can access inherited properties', function() {
                chai.expect(instance.name).to.equal('EventEmitter');
            });

            it('can access inherited functions', function() {
                chai.expect(instance.sayHello()).to.equal('Hello EventEmitter!');
            });

            it('correctly reports ancestor inheritance', function () {
                chai.expect(instance instanceof Simple).to.equal(true);
            });
        });

        describe('Extended Mixed In', function() {
            class Simple {
                constructor() {
                    this.name = 'EventEmitter';
                }
                sayHello() {
                    return `Hello ${this.name}!`;
                }
            }

            class Complex extends EventEmitter.mixin(Simple) {
                constructor() {
                    super();
                    this.byeString = 'Good bye';
                }
                sayGoodBye() {
                    return `${this.byeString} ${this.name}!`;
                }
            }

            const instance = new Complex();
            eventTests(instance);

            it('can access inherited properties', function() {
                chai.expect(instance.name).to.equal('EventEmitter');
            });

            it('can access inherited functions', function() {
                chai.expect(instance.sayHello()).to.equal('Hello EventEmitter!');
            });

            it('can access defined properties', function() {
                chai.expect(instance.byeString).to.equal('Good bye');
            });

            it('can access defined functions', function() {
                chai.expect(instance.sayGoodBye()).to.equal('Good bye EventEmitter!');
            });

            it('correctly reports ancestor inheritance', function () {
                chai.expect(instance instanceof Simple).to.equal(true);
            });

            it('correctly reports extension inheritance', function () {
                chai.expect(instance instanceof Complex).to.equal(true);
            });
        });
    });
}

export default run;
