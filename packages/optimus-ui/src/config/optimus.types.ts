import type { ElementRef, TemplateRef } from '@angular/core';
import type { OverlayOptions, PassThroughOptions, Translation } from '@openng/optimus-ui/api';
import type { AccordionPassThrough } from '@openng/optimus-ui/types/accordion';
import type { AutoCompletePassThrough } from '@openng/optimus-ui/types/autocomplete';
import type { AvatarPassThrough } from '@openng/optimus-ui/types/avatar';
import type { AvatarGroupPassThrough } from '@openng/optimus-ui/types/avatargroup';
import type { BadgePassThrough } from '@openng/optimus-ui/types/badge';
import type { BlockUIPassThrough } from '@openng/optimus-ui/types/blockui';
import type { BreadcrumbPassThrough } from '@openng/optimus-ui/types/breadcrumb';
import type { ButtonPassThrough } from '@openng/optimus-ui/types/button';
import type { CardPassThrough } from '@openng/optimus-ui/types/card';
import type { CarouselPassThrough } from '@openng/optimus-ui/types/carousel';
import type { CascadeSelectPassThrough } from '@openng/optimus-ui/types/cascadeselect';
import type { CheckboxPassThrough } from '@openng/optimus-ui/types/checkbox';
import type { ChipPassThrough } from '@openng/optimus-ui/types/chip';
import type { ColorPickerPassThrough } from '@openng/optimus-ui/types/colorpicker';
import type { ConfirmDialogPassThrough } from '@openng/optimus-ui/types/confirmdialog';
import type { ConfirmPopupPassThrough } from '@openng/optimus-ui/types/confirmpopup';
import type { DialogPassThrough } from '@openng/optimus-ui/types/dialog';
import type { DividerPassThrough } from '@openng/optimus-ui/types/divider';
import type { DockPassThrough } from '@openng/optimus-ui/types/dock';
import type { DrawerPassThrough } from '@openng/optimus-ui/types/drawer';
import type { EditorPassThrough } from '@openng/optimus-ui/types/editor';
import type { FieldsetPassThrough } from '@openng/optimus-ui/types/fieldset';
import type { FileUploadPassThrough } from '@openng/optimus-ui/types/fileupload';
import type { FloatLabelPassThrough } from '@openng/optimus-ui/types/floatlabel';
import type { FluidPassThrough } from '@openng/optimus-ui/types/fluid';
import type { GalleriaPassThrough } from '@openng/optimus-ui/types/galleria';
import type { IconFieldPassThrough } from '@openng/optimus-ui/types/iconfield';
import type { IftaLabelPassThrough } from '@openng/optimus-ui/types/iftalabel';
import type { ImagePassThrough } from '@openng/optimus-ui/types/image';
import type { ImageComparePassThrough } from '@openng/optimus-ui/types/imagecompare';
import type { InplacePassThrough } from '@openng/optimus-ui/types/inplace';
import type { InputGroupPassThrough } from '@openng/optimus-ui/types/inputgroup';
import type { InputGroupAddonPassThrough } from '@openng/optimus-ui/types/inputgroupaddon';
import type { InputIconPassThrough } from '@openng/optimus-ui/types/inputicon';
import type { InputMaskPassThrough } from '@openng/optimus-ui/types/inputmask';
import type { InputNumberPassThrough } from '@openng/optimus-ui/types/inputnumber';
import type { InputOtpPassThrough } from '@openng/optimus-ui/types/inputotp';
import type { InputTextPassThrough } from '@openng/optimus-ui/types/inputtext';
import type { KnobPassThrough } from '@openng/optimus-ui/types/knob';
import type { MegaMenuPassThrough } from '@openng/optimus-ui/types/megamenu';
import type { MenuPassThrough } from '@openng/optimus-ui/types/menu';
import type { MenubarPassThrough } from '@openng/optimus-ui/types/menubar';
import type { MessagePassThrough } from '@openng/optimus-ui/types/message';
import type { MeterGroupPassThrough } from '@openng/optimus-ui/types/metergroup';
import type { OrderListPassThrough } from '@openng/optimus-ui/types/orderlist';
import type { OrganizationChartPassThrough } from '@openng/optimus-ui/types/organizationchart';
import type { OverlayBadgePassThrough } from '@openng/optimus-ui/types/overlaybadge';
import type { PanelPassThrough } from '@openng/optimus-ui/types/panel';
import type { PanelMenuPassThrough } from '@openng/optimus-ui/types/panelmenu';
import type { PopoverPassThrough } from '@openng/optimus-ui/types/popover';
import type { ProgressBarPassThrough } from '@openng/optimus-ui/types/progressbar';
import type { ProgressSpinnerPassThrough } from '@openng/optimus-ui/types/progressspinner';
import type { RadioButtonPassThrough } from '@openng/optimus-ui/types/radiobutton';
import type { RatingPassThrough } from '@openng/optimus-ui/types/rating';
import type { VirtualScrollerPassThrough } from '@openng/optimus-ui/types/scroller';
import type { ScrollPanelPassThrough } from '@openng/optimus-ui/types/scrollpanel';
import type { ScrollTopPassThrough } from '@openng/optimus-ui/types/scrolltop';
import type { SelectPassThrough } from '@openng/optimus-ui/types/select';
import type { SelectButtonPassThrough } from '@openng/optimus-ui/types/selectbutton';
import type { SkeletonPassThrough } from '@openng/optimus-ui/types/skeleton';
import type { SliderPassThrough } from '@openng/optimus-ui/types/slider';
import type { SpeedDialPassThrough } from '@openng/optimus-ui/types/speeddial';
import type { SplitButtonPassThrough } from '@openng/optimus-ui/types/splitbutton';
import type { SplitterPassThrough } from '@openng/optimus-ui/types/splitter';
import type { StepperPassThrough } from '@openng/optimus-ui/types/stepper';
import type { ColumnFilterPassThrough, TablePassThrough } from '@openng/optimus-ui/types/table';
import type { TabListPassThrough, TabPanelPassThrough, TabPanelsPassThrough, TabPassThrough, TabsPassThrough } from '@openng/optimus-ui/types/tabs';
import type { TagPassThrough } from '@openng/optimus-ui/types/tag';
import type { TerminalPassThrough } from '@openng/optimus-ui/types/terminal';
import type { TieredMenuPassThrough } from '@openng/optimus-ui/types/tieredmenu';
import type { TimelinePassThrough } from '@openng/optimus-ui/types/timeline';
import type { ToastPassThrough } from '@openng/optimus-ui/types/toast';
import type { ToggleButtonPassThrough } from '@openng/optimus-ui/types/togglebutton';
import type { ToggleSwitchPassThrough } from '@openng/optimus-ui/types/toggleswitch';
import type { ToolbarPassThrough } from '@openng/optimus-ui/types/toolbar';
import type { TreePassThrough } from '@openng/optimus-ui/types/tree';
import type { TreeSelectPassThrough } from '@openng/optimus-ui/types/treeselect';
import type { TreeTablePassThrough } from '@openng/optimus-ui/types/treetable';

/** ZIndex configuration */
export type ZIndex = {
    modal: number;
    overlay: number;
    menu: number;
    tooltip: number;
};

/** Theme configuration */
export type ThemeType = { preset?: any; options?: any } | 'none' | boolean | undefined;

export type ThemeConfigType = {
    theme?: ThemeType;
    csp?: {
        nonce: string | undefined;
    };
};

export interface GlobalPassThrough {
    accordion?: AccordionPassThrough;
    autoComplete?: AutoCompletePassThrough;
    avatar?: AvatarPassThrough;
    avatarGroup?: AvatarGroupPassThrough;
    blockUI?: BlockUIPassThrough;
    breadcrumb?: BreadcrumbPassThrough;
    card?: CardPassThrough;
    carousel?: CarouselPassThrough;
    cascadeSelect?: CascadeSelectPassThrough;
    checkbox?: CheckboxPassThrough;
    chip?: ChipPassThrough;
    colorPicker?: ColorPickerPassThrough;
    columnFilter?: ColumnFilterPassThrough;
    confirmDialog?: ConfirmDialogPassThrough;
    confirmPopup?: ConfirmPopupPassThrough;
    dialog?: DialogPassThrough;
    divider?: DividerPassThrough;
    dock?: DockPassThrough;
    megaMenu?: MegaMenuPassThrough;
    drawer?: DrawerPassThrough;
    editor?: EditorPassThrough;
    fileUpload?: FileUploadPassThrough;
    floatLabel?: FloatLabelPassThrough;
    menu?: MenuPassThrough;
    menubar?: MenubarPassThrough;
    fluid?: FluidPassThrough;
    galleria?: GalleriaPassThrough;
    iconField?: IconFieldPassThrough;
    iftaLabel?: IftaLabelPassThrough;
    inputIcon?: InputIconPassThrough;
    image?: ImagePassThrough;
    imageCompare?: ImageComparePassThrough;
    inplace?: InplacePassThrough;
    inputText?: InputTextPassThrough;
    inputGroup?: InputGroupPassThrough;
    inputGroupAddon?: InputGroupAddonPassThrough;
    inputMask?: InputMaskPassThrough;
    inputNumber?: InputNumberPassThrough;
    inputOtp?: InputOtpPassThrough;
    knob?: KnobPassThrough;
    popover?: PopoverPassThrough;
    message?: MessagePassThrough;
    meterGroup?: MeterGroupPassThrough;
    orderList?: OrderListPassThrough;
    organizationChart?: OrganizationChartPassThrough;
    overlayBadge?: OverlayBadgePassThrough;
    progressBar?: ProgressBarPassThrough;
    progressSpinner?: ProgressSpinnerPassThrough;
    radioButton?: RadioButtonPassThrough;
    rating?: RatingPassThrough;
    virtualScroller?: VirtualScrollerPassThrough;
    scrollPanel?: ScrollPanelPassThrough;
    scrollTop?: ScrollTopPassThrough;
    select?: SelectPassThrough;
    selectButton?: SelectButtonPassThrough;
    skeleton?: SkeletonPassThrough;
    slider?: SliderPassThrough;
    speedDial?: SpeedDialPassThrough;
    splitButton?: SplitButtonPassThrough;
    splitter?: SplitterPassThrough;
    stepper?: StepperPassThrough;
    tabs?: TabsPassThrough;
    tab?: TabPassThrough;
    tabList?: TabListPassThrough;
    tabPanel?: TabPanelPassThrough;
    tabPanels?: TabPanelsPassThrough;
    table?: TablePassThrough;
    tieredMenu?: TieredMenuPassThrough;
    timeline?: TimelinePassThrough;
    tag?: TagPassThrough;
    terminal?: TerminalPassThrough;
    toast?: ToastPassThrough;
    toggleButton?: ToggleButtonPassThrough;
    toggleSwitch?: ToggleSwitchPassThrough;
    toolbar?: ToolbarPassThrough;
    tree?: TreePassThrough;
    treeSelect?: TreeSelectPassThrough;
    treeTable?: TreeTablePassThrough;
    panel?: PanelPassThrough;
    panelMenu?: PanelMenuPassThrough;
    button?: ButtonPassThrough;
    badge?: BadgePassThrough;
    fieldset?: FieldsetPassThrough;
    global?: {
        css?: string;
    };
    [key: string]: any;
}

export type OptimusConfigType = {
    ripple?: boolean;
    overlayAppendTo?: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * @deprecated Since v20. Use `inputVariant` instead.
     */
    inputStyle?: 'outlined' | 'filled';
    inputVariant?: 'outlined' | 'filled';
    overlayOptions?: OverlayOptions;
    translation?: Translation;
    /**
     * @experimental
     * This property is not yet implemented. It will be available in a future release.
     */
    unstyled?: boolean;
    zIndex?: ZIndex | null | undefined;
    pt?: GlobalPassThrough | null | undefined;
    ptOptions?: PassThroughOptions | null | undefined;
    filterMatchModeOptions?: any;
} & ThemeConfigType;
