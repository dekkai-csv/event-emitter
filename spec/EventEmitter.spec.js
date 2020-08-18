import {EventEmitter} from '../build/dist/mod.js';

async function run(env) {
    const {
        chai,
    } = env;

    describe('EventEmitter', function() {
        const sym = Symbol('event');
        const noOp = () => {};
        let instance;

        before(function () {
            instance = new EventEmitter();
        });

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
    });
}

export default run;
