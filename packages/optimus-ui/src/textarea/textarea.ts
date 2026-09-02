import { afterEveryRender, afterNextRender, booleanAttribute, computed, Directive, effect, HostListener, inject, input, NgModule, output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseModelHolder } from '@openng/optimus-ui/basemodelholder';
import { Bind } from '@openng/optimus-ui/bind';
import { Fluid } from '@openng/optimus-ui/fluid';
import { TextareaPassThrough } from '@openng/optimus-ui/types/textarea';
import { Subscription } from 'rxjs';
import { TextareaStyle } from './style/textareastyle';

/**
 * Textarea adds styling and autoResize functionality to standard textarea element.
 * @group Components
 */
@Directive({
    selector: '[pTextarea], [pInputTextarea]',
    standalone: true,
    host: {
        '[class]': "cx('root')"
    },
    providers: [TextareaStyle, { provide: PARENT_INSTANCE, useExisting: Textarea }],
    hostDirectives: [Bind]
})
export class Textarea extends BaseModelHolder<TextareaPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TextareaStyle);

    ngControl = inject(NgControl, { optional: true, self: true });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    /**
     * Used to pass attributes to DOM elements inside the Textarea component.
     * @defaultValue undefined
     * @group Props
     */
    pTextareaPT = input<TextareaPassThrough>();

    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pTextareaUnstyled = input<boolean | undefined>();

    /**
     * When present, textarea size changes as being typed.
     * @group Props
     */
    readonly autoResize = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Defines the size of the component.
     * @group Props
     */
    readonly pSize = input<'large' | 'small'>();

    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });

    /**
     * When present, it specifies that the component should have invalid state style.
     * @defaultValue false
     * @group Props
     */
    invalid = input(undefined, { transform: booleanAttribute });

    /**
     * Callback to invoke on textarea resize.
     * @param {(Event | {})} event - Custom resize event.
     * @group Emits
     */
    readonly onResize = output<Event | {}>();

    componentName = 'Textarea';

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    ngControlSubscription: Subscription | undefined;

    private lastResizedValue: string | undefined;

    readonly hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    constructor() {
        super();
        effect(() => {
            const pt = this.pTextareaPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pTextareaUnstyled() && this.directiveUnstyled.set(this.pTextareaUnstyled());
        });

        // Initial auto-resize once the element is rendered (replaces the former ngAfterViewInit hook).
        afterNextRender(() => {
            if (this.autoResize()) this.resize();

            this.cd.detectChanges();
        });

        // After each render: re-apply the host/root pass-through sections, keep the height in sync
        // when auto-resizing, and mirror the current control/element value into the model signal
        // (replaces the former ngAfterViewChecked hook). The resize is guarded by a value check:
        // resize() emits onResize, and emitting from an unconditional after-render hook would
        // schedule a new render for every template listener, looping change detection (NG0103).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
            if (this.autoResize() && this.el.nativeElement.value !== this.lastResizedValue) {
                this.lastResizedValue = this.el.nativeElement.value;
                this.resize();
            }
            this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
        });
    }

    onInit() {
        if (this.ngControl) {
            this.ngControlSubscription = (this.ngControl as any).valueChanges.subscribe(() => {
                this.updateState();
            });
        }
    }

    onDestroy() {
        if (this.ngControlSubscription) {
            this.ngControlSubscription.unsubscribe();
        }
    }

    @HostListener('input', ['$event'])
    onInput(e: Event) {
        this.writeModelValue((e.target as HTMLTextAreaElement)?.value);
        this.updateState();
    }

    resize(event?: Event) {
        this.el.nativeElement.style.height = 'auto';
        this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight + 'px';

        if (parseFloat(this.el.nativeElement.style.height) >= parseFloat(this.el.nativeElement.style.maxHeight)) {
            this.el.nativeElement.style.overflowY = 'scroll';
            this.el.nativeElement.style.height = this.el.nativeElement.style.maxHeight;
        } else {
            this.el.nativeElement.style.overflow = 'hidden';
        }

        this.onResize.emit(event || {});
    }

    updateState() {
        if (this.autoResize()) {
            this.resize();
        }
    }
}

@NgModule({
    imports: [Textarea],
    exports: [Textarea]
})
export class TextareaModule {}
