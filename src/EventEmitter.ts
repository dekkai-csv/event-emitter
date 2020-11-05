/**
 * Callbacks registered with this event emitter must follow this signature.
 */
export type EventCallback = (type: string | symbol, ...args: any[]) => void;

/**
 * A symbol that used to register omni-listeners.
 * @internal
 */
const kOmniEvent = Symbol('EventEmitter::omni::event');

/**
 * @internal
 */
class EventEmitterMixin {
    /**
     * Mixin method that holds the EventEmitter implementation, this function is exposed through `EventEmitter.mixin`.
     * @param Parent - The parent class into which the EventEmitter implementation will be mixed in.
     */
    public static mixin<T>(Parent: T) { // eslint-disable-line @typescript-eslint/explicit-function-return-type
        const ParentConstructor = Parent as unknown as T & (new (...args: any[]) => {}); // eslint-disable-line @typescript-eslint/ban-types

        class EventEmitter extends ParentConstructor {
            /**
             * Returns a symbol that can be used to register an omni-listener.
             */
            public static get omniEvent(): symbol {
                return kOmniEvent;
            }

            /**
             * Map of registered event listeners with this instance.
             * @private
             */
            public listeners: Map<string | symbol, Set<EventCallback>> = new Map();

            /**
             * Register an event listener callback for the specified event.
             *
             * NOTE: Pass `*` as the event type to listen to all event emitted by this instance.
             * @param type - The event to listen for
             * @param callback - Called when the event is emitted by this instance
             */
            public on(type: string | symbol, callback: EventCallback): void {
                const queue = this.listeners.get(type);
                if (queue) {
                    queue.add(callback);
                } else {
                    this.listeners.set(type, new Set([callback]));
                }
            }

            /**
             * Unregister an event listener callback.
             * @param type - The event to unregister from
             * @param callback - Callback function to remove
             */
            public off(type: string | symbol, callback: EventCallback): void {
                const queue = this.listeners.get(type);
                if (queue) {
                    queue.delete(callback);
                }
            }

            /**
             * Emit an event to all event listeners register for that specific event and omni-listeners (listeners registered
             * wising `*` as the event type).
             * @param type - The event to emit, cannot be `*`
             * @param args - Parameters to pass to the callback functions registered for this event
             */
            public emit(type: string | symbol, ...args: any[]): void {
                if (type === kOmniEvent) {
                    return;
                }

                if (this.listeners.has(type)) {
                    const stack = new Set(this.listeners.get(type));
                    for (const callback of stack) {
                        callback.call(this, type, ...args);
                    }
                }

                if (this.listeners.has(kOmniEvent)) {
                    const omni = new Set(this.listeners.get(kOmniEvent));
                    for (const callback of omni) {
                        callback.call(this, type, ...args);
                    }
                }
            }
        }

        return EventEmitter as typeof EventEmitter & T;
    }
}

/**
 * Simple event emitter class.
 *
 * Supports "omni-listeners" through its `omniEvent` static property. An omni-listener is added/removed as any other
 * listener but it will be triggered with ANY event rather than with a specific one.
 *
 * Events can be strings or symbols. Internally, uses Map and Set instances to deal with events and listeners so in
 * theory anything that can be used as a Map key can be used as an event, only strings and symbols are guaranteed to
 * work however.
 */
class EventEmitter extends EventEmitterMixin.mixin(EventEmitterMixin) {}
export {EventEmitter};
