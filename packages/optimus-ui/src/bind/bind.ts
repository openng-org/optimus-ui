import { computed, Directive, effect, ElementRef, input, NgModule, Renderer2, signal, inject } from '@angular/core';
import { cn, equals } from '@openng/optimus-ui-utils';

type EventHandler = (event: Event) => boolean | void;

/**
 * Placeholder for `on*` handlers when comparing attributes: a DOM listener is attached once per event name and
 * dispatches to the latest handler, so a new function reference is not a change worth re-applying.
 */
const FUNCTION_VALUE = Symbol('function');

function isEventHandler(key: string, value: unknown): value is EventHandler {
    return key.startsWith('on') && typeof value === 'function';
}

function toEventName(key: string): string {
    return key.slice(2).toLowerCase();
}

/**
 * Bind directive provides dynamic attribute, property, and event listener binding functionality.
 * @group Components
 */
@Directive({
    selector: '[pBind]',
    standalone: true,
    host: {
        '[style]': 'styles()',
        '[class]': 'classes()'
    }
})
export class Bind {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    /**
     * Dynamic attributes, properties, and event listeners to be applied to the host element.
     * @group Props
     */
    pBind = input<{ [key: string]: any } | undefined>(undefined);

    private _attrs = signal<{ [key: string]: any } | undefined>(undefined);
    private attrs = computed(() => this._attrs() || this.pBind());

    styles = computed(() => this.attrs()?.style);
    classes = computed(() => cn(this.attrs()?.class));

    /**
     * Copy of the attributes last set through `setAttrs` with the handlers masked, used to detect a change
     * without comparing function references.
     */
    private _attrsSignature: { [key: string]: any } | undefined;

    /**
     * One DOM listener per event name, attached once and removed when the event leaves the attributes.
     */
    private listeners = new Map<string, () => void>();

    /**
     * Latest handler per event name, called by the listener above. A plain Map on purpose: refreshing a
     * handler must not go through the signal graph, otherwise a function-form PassThrough (a new closure on
     * every evaluation) would schedule a render after every render.
     */
    private handlers = new Map<string, EventHandler>();

    constructor() {
        effect(() => {
            // the handlers of a `setAttrs` object are refreshed by `setAttrs` itself and may be newer than the
            // object held by the signal; only the `pBind` input refreshes them from here
            const fromInput = !this._attrs();
            const { style, class: className, ...rest } = this.attrs() || {};
            const eventNames = new Set<string>();

            for (const [key, value] of Object.entries(rest)) {
                if (isEventHandler(key, value)) {
                    const eventName = toEventName(key);

                    eventNames.add(eventName);
                    if (fromInput) this.handlers.set(eventName, value);
                    this.listen(eventName);
                } else if (value === null || value === undefined) {
                    // remove attr
                    this.renderer.removeAttribute(this.el.nativeElement, key);
                } else {
                    // attr & prop fallback
                    this.renderer.setAttribute(this.el.nativeElement, key, value.toString());
                    if (key in this.el.nativeElement) {
                        (this.el.nativeElement as any)[key] = value;
                    }
                }
            }

            // drop the listeners (and handlers) of the events that are no longer bound
            for (const eventName of [...this.handlers.keys()]) {
                if (!eventNames.has(eventName)) {
                    this.unlisten(eventName);
                }
            }
        });
    }

    ngOnDestroy() {
        this.clearListeners();
    }

    public setAttrs(attrs: { [key: string]: any } | undefined) {
        // Function identity of the handlers is ignored on purpose: a function-form PassThrough returns a new
        // closure on every evaluation and `setAttrs` runs after every render (NG0103 otherwise). The latest
        // handlers are kept outside the signal: a handler-only change schedules no render.
        const signature: { [key: string]: any } | undefined = attrs ? {} : attrs;

        for (const [key, value] of Object.entries(attrs || {})) {
            if (isEventHandler(key, value)) {
                this.handlers.set(toEventName(key), value);
                signature![key] = FUNCTION_VALUE;
            } else {
                signature![key] = value;
            }
        }

        if (!equals(this._attrsSignature, signature)) {
            this._attrsSignature = signature;
            this._attrs.set(attrs);
        }
    }

    private listen(eventName: string) {
        // the DOM listener is stable: the handler can change without re-attaching anything
        if (!this.listeners.has(eventName)) {
            const unlisten = this.renderer.listen(this.el.nativeElement, eventName, (event: Event) => this.handlers.get(eventName)?.(event));

            this.listeners.set(eventName, unlisten);
        }
    }

    private unlisten(eventName: string) {
        this.listeners.get(eventName)?.();
        this.listeners.delete(eventName);
        this.handlers.delete(eventName);
    }

    private clearListeners() {
        this.listeners.forEach((unlisten) => unlisten());
        this.listeners.clear();
        this.handlers.clear();
    }
}

@NgModule({
    imports: [Bind],
    exports: [Bind]
})
export class BindModule {}
