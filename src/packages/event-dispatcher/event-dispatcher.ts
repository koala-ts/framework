/**
 * An event is a message produced by an emitter.
 *
 * @typeParam Payload - The payload carried by the event.
 * @typeParam Name - The event name.
 */
export type Event<Payload = unknown, Name extends string = string> = {
  /** Identifies the event type. */
  name: Name;
  /** Carries the event-specific data. */
  payload: Payload;
};

/**
 * A callback that receives an {@link Event}.
 * It may be synchronous or asynchronous.
 *
 * @typeParam E - The event received by the listener.
 */
export type EventListener<E extends Event = Event> = (event: E) => void | Promise<void>;

/**
 * Dispatches an event to its listeners.
 *
 * @typeParam E - The event this emitter can dispatch.
 */
export type EventEmitter<E extends Event = Event> = (event: E) => Promise<void>;
