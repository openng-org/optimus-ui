import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    effect,
    forwardRef,
    inject,
    input,
    InputSignal,
    InputSignalWithTransform,
    model,
    ModelSignal,
    NgModule,
    signal,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';

import { MotionOptions } from '@openng/optimus-ui-motion';
import { find, findIndexInList, uuid } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { MotionModule } from '@openng/optimus-ui/motion';
import { StepItemPassThrough, StepListPassThrough, StepPanelPassThrough, StepPanelsPassThrough, StepPassThrough, StepperPassThrough, StepperSeparatorPassThrough } from '@openng/optimus-ui/types/stepper';
import { transformToBoolean } from '@openng/optimus-ui/utils';
import { StepItemStyle } from './style/stepitemstyle';
import { StepListStyle } from './style/stepliststyle';
import { StepPanelsStyle } from './style/steppanelsstyle';
import { StepPanelStyle } from './style/steppanelstyle';
import { StepperStyle } from './style/stepperstyle';
import { StepStyle } from './style/stepstyle';

/**
 * Context interface for the StepPanel content template.
 * @property {() => void} activateCallback - Callback function to activate a step.
 * @property {number} value - The value associated with the step.
 * @property {boolean} active - A flag indicating whether the step is active.
 * @group Interface
 */
export interface StepContentTemplateContext {
    activateCallback: () => void;
    value: number;
    active: boolean;
}

/**
 * Context interface for the StepPanel content template.
 * @property {(index: number) => void} activateCallback - Callback function to activate a step.
 * @property {number} value - The value associated with the step.
 * @property {boolean} active - A flag indicating whether the step is active.
 * @group Interface
 */
export interface StepPanelContentTemplateContext {
    activateCallback: (index: number) => void;
    value: number;
    active: boolean;
}

@Component({
    selector: 'p-step-list',
    standalone: true,
    imports: [BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")'
    },
    providers: [StepListStyle, { provide: PARENT_INSTANCE, useExisting: StepList }],
    hostDirectives: [Bind]
})
export class StepList extends BaseComponent<StepListPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(StepListStyle);

    steps = contentChildren(forwardRef(() => Step));

    componentName = 'StepList';

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }
}
/**
 * StepperSeparator is a helper component for Stepper component used in vertical orientation.
 * @group Components
 */
@Component({
    selector: 'p-stepper-separator',
    standalone: true,
    imports: [BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("separator")'
    },
    providers: [StepperStyle, { provide: PARENT_INSTANCE, useExisting: StepperSeparator }],
    hostDirectives: [Bind]
})
export class StepperSeparator extends BaseComponent<StepperSeparatorPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(StepperStyle);

    componentName = 'StepperSeparator';

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }
}

/**
 * StepItem is a helper component for Stepper component used in vertical orientation.
 * @group Components
 */
@Component({
    selector: 'p-step-item',
    standalone: true,
    imports: [BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")',
        '[attr.data-p-active]': 'isActive()'
    },
    providers: [StepItemStyle, { provide: PARENT_INSTANCE, useExisting: StepItem }],
    hostDirectives: [Bind]
})
export class StepItem extends BaseComponent<StepItemPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(StepItemStyle);

    pcStepper = inject(forwardRef(() => Stepper));

    /**
     * Value of step.
     * @type {<number | undefined>}
     * @defaultValue undefined
     * @group Props
     */
    value: ModelSignal<number | undefined> = model<number | undefined>();

    step = contentChild(forwardRef(() => Step));

    stepPanel = contentChild(forwardRef(() => StepPanel));

    componentName = 'StepItem';

    isActive = computed(() => this.pcStepper.value() === this.value());

    constructor() {
        super();
        effect(() => {
            this.step().value.set(this.value());
        });

        effect(() => {
            this.stepPanel().value.set(this.value());
        });

        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }
}

/**
 * Step is a helper component for Stepper component.
 * @group Components
 */
@Component({
    selector: 'p-step',
    standalone: true,
    imports: [CommonModule, StepperSeparator, SharedModule, BindModule],
    template: `
        @if (!$contentTemplate()) {
            <button
                [attr.id]="id()"
                [class]="cx('header')"
                [pBind]="ptm('header')"
                [attr.role]="'tab'"
                [tabindex]="isStepDisabled() ? -1 : undefined"
                [attr.aria-controls]="ariaControls()"
                [disabled]="isStepDisabled()"
                (click)="onStepClick()"
                type="button"
            >
                <span [class]="cx('number')" [pBind]="ptm('number')">{{ value() }}</span>
                <span [class]="cx('title')" [pBind]="ptm('title')">
                    <ng-content></ng-content>
                </span>
            </button>
            @if (isSeparatorVisible()) {
                <p-stepper-separator />
            }
        } @else {
            <ng-container *ngTemplateOutlet="$contentTemplate(); context: { activateCallback: onStepClick.bind(this), value: value(), active: active() }"></ng-container>
            @if (isSeparatorVisible()) {
                <p-stepper-separator />
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")',
        '[attr.aria-current]': 'active() ? "step" : undefined',
        '[attr.role]': '"presentation"',
        '[attr.data-p-active]': 'active()',
        '[attr.data-p-disabled]': 'isStepDisabled()'
    },
    providers: [StepStyle, { provide: PARENT_INSTANCE, useExisting: Step }],
    hostDirectives: [Bind]
})
export class Step extends BaseComponent<StepPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    pcStepper = inject(forwardRef(() => Stepper));

    _componentStyle = inject(StepStyle);

    /**
     * Active value of stepper.
     * @type {number}
     * @defaultValue undefined
     * @group Props
     */
    value: ModelSignal<number | undefined> = model<number | undefined>();

    /**
     * Whether the step is disabled.
     * @type {boolean}
     * @defaultValue false
     * @group Props
     */
    disabled: InputSignalWithTransform<any, boolean> = input(false, {
        transform: (v: any | boolean) => transformToBoolean(v)
    });

    /**
     * Content template.
     * @type {TemplateRef<StepContentTemplateContext>}
     * @group Templates
     */
    readonly content = contentChild<TemplateRef<StepContentTemplateContext>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'Step';

    active = computed(() => this.pcStepper.isStepActive(this.value()));

    isStepDisabled = computed(() => !this.active() && (this.pcStepper.linear() || this.disabled()));

    id = computed(() => `${this.pcStepper.id()}_step_${this.value()}`);

    ariaControls = computed(() => `${this.pcStepper.id()}_steppanel_${this.value()}`);

    isSeparatorVisible = computed(() => {
        if (this.pcStepper.stepList()) {
            const steps = this.pcStepper.stepList().steps();
            const index = steps.indexOf(this);
            const stepLen = steps.length;
            return index !== stepLen - 1;
        } else {
            return false;
        }
    });

    /** Effective content template: the `#content` content child, or a legacy `pTemplate="content"`. */
    readonly $contentTemplate = computed(() => this.content() ?? this.templates().find((item) => item.getType() === 'content')?.template);

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onStepClick() {
        this.pcStepper.updateValue(this.value());
    }
}

/**
 * StepPanel is a helper component for Stepper component.
 * @group Components
 */
@Component({
    selector: 'p-step-panel',
    standalone: true,
    imports: [CommonModule, StepperSeparator, SharedModule, BindModule, MotionModule],
    template: `
        <p-motion [visible]="active()" name="p-collapsible" [disabled]="!isVertical()" [options]="computedMotionOptions()">
            <div [class]="cx('contentWrapper')" [pBind]="ptm('contentWrapper')">
                @if (isSeparatorVisible()) {
                    <p-stepper-separator />
                }
                <div [class]="cx('content')" [pBind]="ptm('content')">
                    <ng-container *ngTemplateOutlet="$contentTemplate(); context: { activateCallback: updateValue.bind(this), value: value(), active: active() }"></ng-container>
                </div>
            </div>
        </p-motion>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")',
        '[attr.role]': '"tabpanel"',
        '[attr.aria-controls]': 'ariaControls()',
        '[attr.id]': 'id()',
        '[attr.data-p-active]': 'active()',
        '[attr.data-pc-name]': '"steppanel"'
    },
    providers: [StepPanelStyle, { provide: PARENT_INSTANCE, useExisting: StepPanel }],
    hostDirectives: [Bind]
})
export class StepPanel extends BaseComponent<StepPanelPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    pcStepper = inject(forwardRef(() => Stepper));

    _componentStyle = inject(StepPanelStyle);

    /**
     * Active value of stepper.
     * @type {number}
     * @defaultValue undefined
     * @group Props
     */
    value: ModelSignal<number | undefined> = model<number | undefined>(undefined);

    /**
     * Content template.
     * @param {StepPanelContentTemplateContext} context - Context of the template
     * @see {@link StepPanelContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<StepPanelContentTemplateContext>>('content');

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'StepPanel';

    active = computed(() => this.pcStepper.value() === this.value());

    ariaControls = computed(() => `${this.pcStepper.id()}_step_${this.value()}`);

    id = computed(() => `${this.pcStepper.id()}_steppanel_${this.value()}`);

    isVertical = computed(() => this.pcStepper.stepItems().length > 0);

    isSeparatorVisible = computed(() => {
        if (this.pcStepper.stepItems()) {
            const stepLen = this.pcStepper.stepItems().length;
            const stepPanelElements = find(this.pcStepper.el.nativeElement, '[data-pc-name="steppanel"]');
            const index = findIndexInList(this.el.nativeElement, stepPanelElements);

            return index !== stepLen - 1;
        }
    });

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.pcStepper.computedMotionOptions()
        };
    });

    /** Effective content template: the `#content` content child, or a legacy `pTemplate="content"`. */
    readonly $contentTemplate = computed(() => this.contentTemplate() ?? this.templates().find((item) => item.getType() === 'content')?.template);

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    updateValue(value: number) {
        this.pcStepper.updateValue(value);
    }
}

@Component({
    selector: 'p-step-panels',
    standalone: true,
    imports: [SharedModule, BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")'
    },
    providers: [StepPanelsStyle, { provide: PARENT_INSTANCE, useExisting: StepPanels }],
    hostDirectives: [Bind]
})
export class StepPanels extends BaseComponent<StepPanelsPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(StepPanelsStyle);

    componentName = 'StepPanels';

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }
}

/**
 * Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multistep process.
 * @group Components
 */
@Component({
    selector: 'p-stepper',
    standalone: true,
    imports: [SharedModule, BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [StepperStyle, { provide: PARENT_INSTANCE, useExisting: Stepper }],
    host: {
        '[class]': 'cx("root")',
        '[attr.role]': '"tablist"',
        '[attr.id]': 'id()'
    },
    hostDirectives: [Bind]
})
export class Stepper extends BaseComponent<StepperPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(StepperStyle);

    /**
     * A model that can hold a numeric value or be undefined.
     * @defaultValue undefined
     * @type {ModelSignal<number | undefined>}
     * @group Props
     */
    value: ModelSignal<number | undefined> = model<number | undefined>(undefined);

    /**
     * A boolean variable that captures user input.
     * @defaultValue false
     * @type {InputSignalWithTransform<any, boolean >}
     * @group Props
     */
    linear: InputSignalWithTransform<any, boolean> = input(false, {
        transform: (v: any | boolean) => transformToBoolean(v)
    });

    /**
     * Transition options of the animation.
     * @defaultValue 400ms cubic-bezier(0.86, 0, 0.07, 1)
     * @type {InputSignal<string >}
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    transitionOptions: InputSignal<string> = input<string>('400ms cubic-bezier(0.86, 0, 0.07, 1)');

    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    stepList = contentChild(StepList);

    stepItems = contentChildren(StepItem);

    steps = contentChildren(Step);

    componentName = 'Stepper';

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });

    id = signal<string>(uuid('pn_id_'));

    constructor() {
        super();
        // Re-apply the host/root pass-through sections after each render (replaces the former
        // ngAfterViewChecked hook). Bind.setAttrs writes into a signal behind an equality check,
        // so unchanged PT resolutions are no-ops.
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    updateValue(value: number) {
        this.value.set(value);
    }

    isStepActive(value: number) {
        return this.value() === value;
    }
}

@NgModule({
    imports: [Stepper, StepList, StepPanels, StepPanel, StepItem, Step, StepperSeparator, SharedModule, BindModule],
    exports: [Stepper, StepList, StepPanels, StepPanel, StepItem, Step, StepperSeparator, SharedModule, BindModule]
})
export class StepperModule {}
