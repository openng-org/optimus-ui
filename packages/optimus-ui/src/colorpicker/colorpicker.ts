import { afterEveryRender, afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, forwardRef, inject, input, NgModule, signal, TemplateRef, ViewEncapsulation, viewChild, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@openng/optimus-ui-motion';
import { OverlayOptions, OverlayService, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { AutoFocusModule } from '@openng/optimus-ui/autofocus';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseEditableHolder } from '@openng/optimus-ui/baseeditableholder';
import { Bind } from '@openng/optimus-ui/bind';
import { MotionModule } from '@openng/optimus-ui/motion';
import { OverlayModule } from '@openng/optimus-ui/overlay';
import { VoidListener } from '@openng/optimus-ui/ts-helpers';
import type { ColorPickerChangeEvent } from '@openng/optimus-ui/types/colorpicker';
import { ColorPickerPassThrough } from '@openng/optimus-ui/types/colorpicker';
import { ZIndexUtils } from '@openng/optimus-ui/utils';
import { ColorPickerStyle } from './style/colorpickerstyle';

export const COLORPICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ColorPicker),
    multi: true
};

/**
 * ColorPicker groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'p-colorPicker, p-colorpicker, p-color-picker',
    standalone: true,
    imports: [AutoFocusModule, SharedModule, Bind, MotionModule, OverlayModule],
    hostDirectives: [Bind],
    template: `
        @if (!inline()) {
            <input
                #input
                type="text"
                [class]="cx('preview')"
                readonly
                [attr.tabindex]="tabindex()"
                [attr.disabled]="$disabled() ? '' : undefined"
                (click)="onInputClick()"
                (keydown)="onInputKeydown($event)"
                (focus)="onInputFocus()"
                [attr.id]="inputId()"
                [style.backgroundColor]="inputBgColor()"
                [attr.aria-label]="ariaLabel"
                [pAutoFocus]="autofocus()"
                [pBind]="ptm('preview')"
            />
        }

        <p-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="overlayVisible"
            [options]="overlayOptions()"
            [target]="'@parent'"
            [inline]="inline()"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter()"
            (onAfterLeave)="onOverlayAfterLeave()"
            (onHide)="hide()"
        >
            <ng-template #content>
                <div [class]="cx('panel')" [pBind]="ptm('panel')">
                    <div [class]="cx('content')" [pBind]="ptm('content')">
                        <div #colorSelector [class]="cx('colorSelector')" (touchstart)="onColorDragStart($event)" (touchmove)="onDrag($event)" (touchend)="onDragEnd()" (mousedown)="onColorMousedown($event)" [pBind]="ptm('colorSelector')">
                            <div [class]="cx('colorBackground')" [pBind]="ptm('colorBackground')">
                                <div #colorHandle [class]="cx('colorHandle')" [pBind]="ptm('colorHandle')"></div>
                            </div>
                        </div>
                        <div #hue [class]="cx('hue')" (mousedown)="onHueMousedown($event)" (touchstart)="onHueDragStart($event)" (touchmove)="onDrag($event)" (touchend)="onDragEnd()" [pBind]="ptm('hue')">
                            <div #hueHandle [class]="cx('hueHandle')" [pBind]="ptm('hueHandle')"></div>
                        </div>
                    </div>
                </div>
            </ng-template>
        </p-overlay>
    `,
    providers: [COLORPICKER_VALUE_ACCESSOR, ColorPickerStyle, { provide: PARENT_INSTANCE, useExisting: ColorPicker }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')"
    }
})
export class ColorPicker extends BaseEditableHolder<ColorPickerPassThrough> {
    overlayService = inject(OverlayService);

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ColorPickerStyle);

    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');

    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('.1s linear');

    /**
     * Whether to display as an overlay or not.
     * @group Props
     */
    readonly inline = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Format to use in value binding.
     * @group Props
     */
    readonly format = input<'hex' | 'rgb' | 'hsb'>('hex');

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<string>();

    /**
     * Identifier of the focus input to match a label defined for the dropdown.
     * @group Props
     */
    readonly inputId = input<string>();

    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    readonly autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Default color to display initially when model value is not present.
     * @group Props
     */
    readonly defaultColor = input<string | undefined>('ff0000');

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);

    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    overlayOptions = input<OverlayOptions | undefined>(undefined);

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    /**
     * Callback to invoke on value change.
     * @param {ColorPickerChangeEvent} event - Custom value change event.
     * @group Emits
     */
    readonly onChange = output<ColorPickerChangeEvent>();

    /**
     * Callback to invoke on panel is shown.
     * @group Emits
     */
    readonly onShow = output<any>();

    /**
     * Callback to invoke on panel is hidden.
     * @group Emits
     */
    readonly onHide = output<any>();

    readonly overlayViewChild = viewChild.required<ElementRef<HTMLDivElement>>('overlay');

    readonly colorSelectorViewChild = viewChild<ElementRef>('colorSelector');

    readonly colorHandleViewChild = viewChild<ElementRef>('colorHandle');

    readonly hueViewChild = viewChild<ElementRef>('hue');

    readonly hueHandleViewChild = viewChild<ElementRef>('hueHandle');

    componentName = 'ColorPicker';

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /** The current color as HSB. */
    readonly value = signal<any>({ h: 0, s: 100, b: 100 });

    /** Background color of the preview input, derived from the current value. */
    readonly inputBgColor = signal<string | undefined>(undefined);

    /** Whether the overlay panel is visible. */
    readonly overlayVisible = signal<boolean>(false);

    documentMousemoveListener: VoidListener;

    documentMouseupListener: VoidListener;

    colorDragging: boolean = false;

    hueDragging: boolean = false;

    get ariaLabel() {
        return this.config?.getTranslation(TranslationKeys.ARIA)[TranslationKeys.SELECT_COLOR];
    }

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
        // Initial paint of the inline picker (replaces the former ngAfterViewInit hook).
        afterNextRender(() => {
            if (this.inline()) {
                this.updateColorSelector();
                this.updateUI();
            }
        });
    }

    onDestroy() {
        if (this.autoZIndex()) {
            ZIndexUtils.clear(this.overlayViewChild().nativeElement);
        }
    }

    onHueMousedown(event: MouseEvent) {
        if (this.$disabled()) {
            return;
        }

        this.bindDocumentMousemoveListener();
        this.bindDocumentMouseupListener();

        this.hueDragging = true;
        this.pickHue(event);
    }

    onHueDragStart(event: TouchEvent) {
        if (this.$disabled()) {
            return;
        }

        this.hueDragging = true;
        this.pickHue(event, (event as TouchEvent).changedTouches[0]);
    }

    onColorDragStart(event: TouchEvent) {
        if (this.$disabled()) {
            return;
        }

        this.colorDragging = true;
        this.pickColor(event, (event as TouchEvent).changedTouches[0]);
        this.el.nativeElement.setAttribute('p-colorpicker-dragging', 'true');
    }

    pickHue(event: MouseEvent | TouchEvent, position?: any) {
        let pageY = position ? position.pageY : (event as MouseEvent).pageY;
        let top: number = this.hueViewChild()?.nativeElement.getBoundingClientRect().top + ((this.document as any).defaultView.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0);
        this.value.set(
            this.validateHSB({
                h: Math.floor((360 * (150 - Math.max(0, Math.min(150, pageY - top)))) / 150),
                s: this.value().s,
                b: this.value().b
            })
        );

        this.updateColorSelector();
        this.updateUI();
        this.updateModel();
        this.onChange.emit({ originalEvent: event, value: this.getValueToUpdate() });
    }

    onColorMousedown(event: MouseEvent) {
        if (this.$disabled()) {
            return;
        }

        this.bindDocumentMousemoveListener();
        this.bindDocumentMouseupListener();

        this.colorDragging = true;
        this.pickColor(event);
    }

    onDrag(event: TouchEvent) {
        if (this.colorDragging) {
            this.pickColor(event, event.changedTouches[0]);
            event.preventDefault();
        }

        if (this.hueDragging) {
            this.pickHue(event, event.changedTouches[0]);
            event.preventDefault();
        }
    }

    onDragEnd() {
        this.colorDragging = false;
        this.hueDragging = false;
        this.el.nativeElement.setAttribute('p-colorpicker-dragging', 'false');
        this.unbindDocumentMousemoveListener();
        this.unbindDocumentMouseupListener();
    }

    pickColor(event: MouseEvent | TouchEvent, position?: any) {
        let pageX = position ? position.pageX : (event as MouseEvent).pageX;
        let pageY = position ? position.pageY : (event as MouseEvent).pageY;
        let rect = this.colorSelectorViewChild()?.nativeElement.getBoundingClientRect();
        let top = rect.top + ((this.document as any).defaultView.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0);
        let left = rect.left + this.document.body.scrollLeft;
        let saturation = Math.floor((100 * Math.max(0, Math.min(150, pageX - left))) / 150);
        let brightness = Math.floor((100 * (150 - Math.max(0, Math.min(150, pageY - top)))) / 150);
        this.value.set(
            this.validateHSB({
                h: this.value().h,
                s: saturation,
                b: brightness
            })
        );

        this.updateUI();
        this.updateModel();
        this.onChange.emit({ originalEvent: event, value: this.getValueToUpdate() });
    }

    getValueToUpdate() {
        let val: any;
        switch (this.format()) {
            case 'hex':
                val = '#' + this.HSBtoHEX(this.value());
                break;

            case 'rgb':
                val = this.HSBtoRGB(this.value());
                break;

            case 'hsb':
                val = this.value();
                break;
        }

        return val;
    }

    updateModel(): void {
        this.onModelChange(this.getValueToUpdate());
        this.cd.markForCheck();
    }

    updateColorSelector() {
        const colorSelector = this.colorSelectorViewChild();
        if (colorSelector) {
            const hsb: any = {};
            hsb.s = 100;
            hsb.b = 100;
            hsb.h = this.value().h;

            colorSelector.nativeElement.style.backgroundColor = '#' + this.HSBtoHEX(hsb);
        }
    }

    updateUI() {
        const colorHandle = this.colorHandleViewChild();
        const hueHandle = this.hueHandleViewChild();
        if (colorHandle && hueHandle?.nativeElement) {
            colorHandle.nativeElement.style.left = Math.floor((150 * this.value().s) / 100) + 'px';
            colorHandle.nativeElement.style.top = Math.floor((150 * (100 - this.value().b)) / 100) + 'px';
            hueHandle.nativeElement.style.top = Math.floor(150 - (150 * this.value().h) / 360) + 'px';
        }

        this.inputBgColor.set('#' + this.HSBtoHEX(this.value()));
    }

    onInputFocus() {
        this.onModelTouched();
    }

    show() {
        this.overlayVisible.set(true);
    }

    onOverlayBeforeEnter() {
        if (!this.inline()) {
            this.updateColorSelector();
            this.updateUI();
            this.onShow.emit({});
        }
    }

    onOverlayAfterLeave() {
        if (!this.inline()) {
            this.onHide.emit({});
        }
    }

    hide() {
        this.overlayVisible.set(false);
    }

    onInputClick() {
        this.togglePanel();
    }

    togglePanel() {
        if (!this.overlayVisible()) this.show();
        else this.hide();
    }

    onInputKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Space':
                this.togglePanel();
                event.preventDefault();
                break;

            case 'Escape':
            case 'Tab':
                this.hide();
                break;

            default:
                //NoOp
                break;
        }
    }

    onOverlayClick(event: MouseEvent) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }

    bindDocumentMousemoveListener() {
        if (!this.documentMousemoveListener) {
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

            this.documentMousemoveListener = this.renderer.listen(documentTarget, 'mousemove', (event: MouseEvent) => {
                if (this.colorDragging) {
                    this.pickColor(event);
                }

                if (this.hueDragging) {
                    this.pickHue(event);
                }
            });
        }
    }

    unbindDocumentMousemoveListener() {
        if (this.documentMousemoveListener) {
            this.documentMousemoveListener();
            this.documentMousemoveListener = null;
        }
    }

    bindDocumentMouseupListener() {
        if (!this.documentMouseupListener) {
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

            this.documentMouseupListener = this.renderer.listen(documentTarget, 'mouseup', () => {
                this.colorDragging = false;
                this.hueDragging = false;
                this.unbindDocumentMousemoveListener();
                this.unbindDocumentMouseupListener();
            });
        }
    }

    unbindDocumentMouseupListener() {
        if (this.documentMouseupListener) {
            this.documentMouseupListener();
            this.documentMouseupListener = null;
        }
    }

    validateHSB(hsb: { h: number; s: number; b: number }) {
        return {
            h: Math.min(360, Math.max(0, hsb.h)),
            s: Math.min(100, Math.max(0, hsb.s)),
            b: Math.min(100, Math.max(0, hsb.b))
        };
    }

    validateRGB(rgb: { r: number; g: number; b: number }) {
        return {
            r: Math.min(255, Math.max(0, rgb.r)),
            g: Math.min(255, Math.max(0, rgb.g)),
            b: Math.min(255, Math.max(0, rgb.b))
        };
    }

    validateHEX(hex: string) {
        var len = 6 - hex.length;
        if (len > 0) {
            var o: any = [];
            for (var i = 0; i < len; i++) {
                o.push('0');
            }
            o.push(hex);
            hex = o.join('');
        }
        return hex;
    }

    HEXtoRGB(hex: string) {
        if (!hex || typeof hex !== 'string') {
            return { r: 0, g: 0, b: 0 };
        }
        let hexValue = parseInt(hex.indexOf('#') > -1 ? hex.substring(1) : hex, 16);
        return { r: hexValue >> 16, g: (hexValue & 0x00ff00) >> 8, b: hexValue & 0x0000ff };
    }

    HEXtoHSB(hex: string) {
        return this.RGBtoHSB(this.HEXtoRGB(hex));
    }

    RGBtoHSB(rgb: { r: number; g: number; b: number }) {
        var hsb = {
            h: 0,
            s: 0,
            b: 0
        };
        var min = Math.min(rgb.r, rgb.g, rgb.b);
        var max = Math.max(rgb.r, rgb.g, rgb.b);
        var delta = max - min;
        hsb.b = max;
        hsb.s = max != 0 ? (255 * delta) / max : 0;
        if (hsb.s != 0) {
            if (rgb.r == max) {
                hsb.h = (rgb.g - rgb.b) / delta;
            } else if (rgb.g == max) {
                hsb.h = 2 + (rgb.b - rgb.r) / delta;
            } else {
                hsb.h = 4 + (rgb.r - rgb.g) / delta;
            }
        } else {
            hsb.h = -1;
        }
        hsb.h *= 60;
        if (hsb.h < 0) {
            hsb.h += 360;
        }
        hsb.s *= 100 / 255;
        hsb.b *= 100 / 255;
        return hsb;
    }

    HSBtoRGB(hsb: { h: number; s: number; b: number }) {
        var rgb = {
            r: 0,
            g: 0,
            b: 0
        };
        let h: number = hsb.h;
        let s: number = (hsb.s * 255) / 100;
        let v: number = (hsb.b * 255) / 100;
        if (s == 0) {
            rgb = {
                r: v,
                g: v,
                b: v
            };
        } else {
            let t1: number = v;
            let t2: number = ((255 - s) * v) / 255;
            let t3: number = ((t1 - t2) * (h % 60)) / 60;
            if (h == 360) h = 0;
            if (h < 60) {
                rgb.r = t1;
                rgb.b = t2;
                rgb.g = t2 + t3;
            } else if (h < 120) {
                rgb.g = t1;
                rgb.b = t2;
                rgb.r = t1 - t3;
            } else if (h < 180) {
                rgb.g = t1;
                rgb.r = t2;
                rgb.b = t2 + t3;
            } else if (h < 240) {
                rgb.b = t1;
                rgb.r = t2;
                rgb.g = t1 - t3;
            } else if (h < 300) {
                rgb.b = t1;
                rgb.g = t2;
                rgb.r = t2 + t3;
            } else if (h < 360) {
                rgb.r = t1;
                rgb.g = t2;
                rgb.b = t1 - t3;
            } else {
                rgb.r = 0;
                rgb.g = 0;
                rgb.b = 0;
            }
        }
        return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
    }

    RGBtoHEX(rgb: { r: number; g: number; b: number }) {
        var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];

        for (var key in hex) {
            if (hex[key].length == 1) {
                hex[key] = '0' + hex[key];
            }
        }

        return hex.join('');
    }

    HSBtoHEX(hsb: { h: number; s: number; b: number }) {
        return this.RGBtoHEX(this.HSBtoRGB(hsb));
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any): void {
        if (value) {
            switch (this.format()) {
                case 'hex':
                    this.value.set(this.HEXtoHSB(value));
                    break;

                case 'rgb':
                    this.value.set(this.RGBtoHSB(value));
                    break;

                case 'hsb':
                    this.value.set(value);
                    break;
            }
        } else {
            this.value.set(this.HEXtoHSB(this.defaultColor() as string));
        }

        this.updateColorSelector();
        this.updateUI();
        this.cd.markForCheck();
    }
}

@NgModule({
    imports: [ColorPicker, SharedModule],
    exports: [ColorPicker, SharedModule]
})
export class ColorPickerModule {}
