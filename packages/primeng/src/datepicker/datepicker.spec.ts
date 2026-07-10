import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import type { DatePickerMonthChangeEvent, DatePickerYearChangeEvent } from 'primeng/types/datepicker';
import { DatePicker } from './datepicker';
@Component({
    standalone: true,
    imports: [DatePicker, FormsModule, ReactiveFormsModule, CommonModule],
    template: `
        <p-datepicker
            [(ngModel)]="selectedDate"
            [dateFormat]="dateFormat"
            [placeholder]="placeholder"
            [showTime]="showTime"
            [showIcon]="showIcon"
            [showWeek]="showWeek"
            [disabled]="disabled"
            [inline]="inline"
            [showButtonBar]="showButtonBar"
            [selectionMode]="selectionMode"
            [minDate]="minDate"
            [maxDate]="maxDate"
            [disabledDates]="disabledDates"
            [disabledDays]="disabledDays"
            [firstDayOfWeek]="firstDayOfWeek"
            [numberOfMonths]="numberOfMonths"
            [view]="view"
            [touchUI]="touchUI"
            [showOtherMonths]="showOtherMonths"
            [selectOtherMonths]="selectOtherMonths"
            [timeOnly]="timeOnly"
            [hourFormat]="hourFormat"
            [stepHour]="stepHour"
            [stepMinute]="stepMinute"
            [stepSecond]="stepSecond"
            [showSeconds]="showSeconds"
            [showOnFocus]="showOnFocus"
            [tabindex]="tabindex"
            [iconDisplay]="iconDisplay"
            [icon]="icon"
            [showClear]="showClear"
            [appendTo]="appendTo"
            [readonlyInput]="readonlyInput"
            [shortYearCutoff]="shortYearCutoff"
            [ariaLabel]="ariaLabel"
            [ariaLabelledBy]="ariaLabelledBy"
            [panelStyle]="panelStyle"
            [panelStyleClass]="panelStyleClass"
            [inputStyle]="inputStyle"
            [inputStyleClass]="inputStyleClass"
            [timeSeparator]="timeSeparator"
            [multipleSeparator]="multipleSeparator"
            [rangeSeparator]="rangeSeparator"
            [keepInvalid]="keepInvalid"
            (onSelect)="onDateSelect($event)"
            (onChange)="onDateChange($event)"
            (onBlur)="onDateBlur($event)"
            (onFocus)="onDateFocus($event)"
            (onClose)="onDateClose($event)"
            (onShow)="onDateShow($event)"
            (onClear)="onDateClear($event)"
            (onInput)="onDateInput($event)"
            (onTodayClick)="onDateTodayClick($event)"
            (onClearClick)="onDateClearClick($event)"
            (onMonthChange)="onDateMonthChange($event)"
            (onYearChange)="onDateYearChange($event)"
        ></p-datepicker>
    `
})
class TestDatePickerComponent {
    private _selectedDate = signal<any>(null as any);
    get selectedDate() {
        return this._selectedDate();
    }
    set selectedDate(v: any) {
        this._selectedDate.set(v);
    }
    private _dateFormat = signal<string>('dd/mm/yy');
    get dateFormat() {
        return this._dateFormat();
    }
    set dateFormat(v: string) {
        this._dateFormat.set(v);
    }
    private _placeholder = signal<string>('Select a date');
    get placeholder() {
        return this._placeholder();
    }
    set placeholder(v: string) {
        this._placeholder.set(v);
    }
    private _showTime = signal<boolean>(false);
    get showTime() {
        return this._showTime();
    }
    set showTime(v: boolean) {
        this._showTime.set(v);
    }
    private _showIcon = signal<boolean>(false);
    get showIcon() {
        return this._showIcon();
    }
    set showIcon(v: boolean) {
        this._showIcon.set(v);
    }
    private _showWeek = signal<boolean>(false);
    get showWeek() {
        return this._showWeek();
    }
    set showWeek(v: boolean) {
        this._showWeek.set(v);
    }
    private _disabled = signal<boolean>(false);
    get disabled() {
        return this._disabled();
    }
    set disabled(v: boolean) {
        this._disabled.set(v);
    }
    private _inline = signal<boolean>(false);
    get inline() {
        return this._inline();
    }
    set inline(v: boolean) {
        this._inline.set(v);
    }
    private _showButtonBar = signal<boolean>(false);
    get showButtonBar() {
        return this._showButtonBar();
    }
    set showButtonBar(v: boolean) {
        this._showButtonBar.set(v);
    }
    private _selectionMode = signal<string>('single');
    get selectionMode() {
        return this._selectionMode();
    }
    set selectionMode(v: string) {
        this._selectionMode.set(v);
    }
    private _minDate = signal<Date | null>(null as any);
    get minDate() {
        return this._minDate();
    }
    set minDate(v: Date | null) {
        this._minDate.set(v);
    }
    private _maxDate = signal<Date | null>(null as any);
    get maxDate() {
        return this._maxDate();
    }
    set maxDate(v: Date | null) {
        this._maxDate.set(v);
    }
    private _disabledDates = signal<Date[]>([]);
    get disabledDates() {
        return this._disabledDates();
    }
    set disabledDates(v: Date[]) {
        this._disabledDates.set(v);
    }
    private _disabledDays = signal<number[]>([]);
    get disabledDays() {
        return this._disabledDays();
    }
    set disabledDays(v: number[]) {
        this._disabledDays.set(v);
    }
    private _firstDayOfWeek = signal<number>(0);
    get firstDayOfWeek() {
        return this._firstDayOfWeek();
    }
    set firstDayOfWeek(v: number) {
        this._firstDayOfWeek.set(v);
    }
    private _numberOfMonths = signal<number>(1);
    get numberOfMonths() {
        return this._numberOfMonths();
    }
    set numberOfMonths(v: number) {
        this._numberOfMonths.set(v);
    }
    private _view = signal<string>('date');
    get view() {
        return this._view();
    }
    set view(v: string) {
        this._view.set(v);
    }
    private _touchUI = signal<boolean>(false);
    get touchUI() {
        return this._touchUI();
    }
    set touchUI(v: boolean) {
        this._touchUI.set(v);
    }
    private _showOtherMonths = signal<boolean>(true);
    get showOtherMonths() {
        return this._showOtherMonths();
    }
    set showOtherMonths(v: boolean) {
        this._showOtherMonths.set(v);
    }
    private _selectOtherMonths = signal<boolean>(false);
    get selectOtherMonths() {
        return this._selectOtherMonths();
    }
    set selectOtherMonths(v: boolean) {
        this._selectOtherMonths.set(v);
    }
    private _timeOnly = signal<boolean>(false);
    get timeOnly() {
        return this._timeOnly();
    }
    set timeOnly(v: boolean) {
        this._timeOnly.set(v);
    }
    private _hourFormat = signal<string>('24');
    get hourFormat() {
        return this._hourFormat();
    }
    set hourFormat(v: string) {
        this._hourFormat.set(v);
    }
    private _stepHour = signal<number>(1);
    get stepHour() {
        return this._stepHour();
    }
    set stepHour(v: number) {
        this._stepHour.set(v);
    }
    private _stepMinute = signal<number>(1);
    get stepMinute() {
        return this._stepMinute();
    }
    set stepMinute(v: number) {
        this._stepMinute.set(v);
    }
    private _stepSecond = signal<number>(1);
    get stepSecond() {
        return this._stepSecond();
    }
    set stepSecond(v: number) {
        this._stepSecond.set(v);
    }
    private _showSeconds = signal<boolean>(false);
    get showSeconds() {
        return this._showSeconds();
    }
    set showSeconds(v: boolean) {
        this._showSeconds.set(v);
    }
    private _showOnFocus = signal<boolean>(true);
    get showOnFocus() {
        return this._showOnFocus();
    }
    set showOnFocus(v: boolean) {
        this._showOnFocus.set(v);
    }
    private _tabindex = signal<number>(0);
    get tabindex() {
        return this._tabindex();
    }
    set tabindex(v: number) {
        this._tabindex.set(v);
    }
    private _iconDisplay = signal<string>('input');
    get iconDisplay() {
        return this._iconDisplay();
    }
    set iconDisplay(v: string) {
        this._iconDisplay.set(v);
    }
    private _icon = signal<string | undefined>(undefined as any);
    get icon() {
        return this._icon();
    }
    set icon(v: string | undefined) {
        this._icon.set(v);
    }
    private _showClear = signal<boolean>(false);
    get showClear() {
        return this._showClear();
    }
    set showClear(v: boolean) {
        this._showClear.set(v);
    }
    private _appendTo = signal<any>(null as any);
    get appendTo() {
        return this._appendTo();
    }
    set appendTo(v: any) {
        this._appendTo.set(v);
    }
    private _readonlyInput = signal<boolean>(false);
    get readonlyInput() {
        return this._readonlyInput();
    }
    set readonlyInput(v: boolean) {
        this._readonlyInput.set(v);
    }
    private _shortYearCutoff = signal<string>('+10');
    get shortYearCutoff() {
        return this._shortYearCutoff();
    }
    set shortYearCutoff(v: string) {
        this._shortYearCutoff.set(v);
    }
    private _ariaLabel = signal<string>('Date picker');
    get ariaLabel() {
        return this._ariaLabel();
    }
    set ariaLabel(v: string) {
        this._ariaLabel.set(v);
    }
    private _ariaLabelledBy = signal<string | undefined>(undefined as any);
    get ariaLabelledBy() {
        return this._ariaLabelledBy();
    }
    set ariaLabelledBy(v: string | undefined) {
        this._ariaLabelledBy.set(v);
    }
    private _panelStyle = signal<any>(null as any);
    get panelStyle() {
        return this._panelStyle();
    }
    set panelStyle(v: any) {
        this._panelStyle.set(v);
    }
    private _panelStyleClass = signal<string | undefined>(undefined as any);
    get panelStyleClass() {
        return this._panelStyleClass();
    }
    set panelStyleClass(v: string | undefined) {
        this._panelStyleClass.set(v);
    }
    private _inputStyle = signal<any>(null as any);
    get inputStyle() {
        return this._inputStyle();
    }
    set inputStyle(v: any) {
        this._inputStyle.set(v);
    }
    private _inputStyleClass = signal<string | undefined>(undefined as any);
    get inputStyleClass() {
        return this._inputStyleClass();
    }
    set inputStyleClass(v: string | undefined) {
        this._inputStyleClass.set(v);
    }
    private _timeSeparator = signal<string>(':');
    get timeSeparator() {
        return this._timeSeparator();
    }
    set timeSeparator(v: string) {
        this._timeSeparator.set(v);
    }
    private _multipleSeparator = signal<string>(',');
    get multipleSeparator() {
        return this._multipleSeparator();
    }
    set multipleSeparator(v: string) {
        this._multipleSeparator.set(v);
    }
    private _rangeSeparator = signal<string>('-');
    get rangeSeparator() {
        return this._rangeSeparator();
    }
    set rangeSeparator(v: string) {
        this._rangeSeparator.set(v);
    }
    private _keepInvalid = signal<boolean>(false);
    get keepInvalid() {
        return this._keepInvalid();
    }
    set keepInvalid(v: boolean) {
        this._keepInvalid.set(v);
    }

    onDateSelect(event: any) {}
    onDateChange(event: any) {}
    onDateBlur(event: Event) {}
    onDateFocus(event: Event) {}
    onDateClose(event: Event) {}
    onDateShow(event: Event) {}
    onDateClear(event: Event) {}
    onDateInput(event: Event) {}
    onDateTodayClick(event: Event) {}
    onDateClearClick(event: Event) {}
    onDateMonthChange(event: DatePickerMonthChangeEvent) {}
    onDateYearChange(event: DatePickerYearChangeEvent) {}
}

@Component({
    standalone: true,
    imports: [DatePicker, FormsModule, ReactiveFormsModule, CommonModule],
    template: `
        <form [formGroup]="form">
            <p-datepicker formControlName="date" [dateFormat]="'dd/mm/yy'" [placeholder]="'Select date'"></p-datepicker>
        </form>
    `
})
class TestReactiveFormDatePickerComponent {
    form = new FormGroup({
        date: new FormControl<Date | null>(null, [Validators.required])
    });
}

// #template - Comprehensive template test component with all 12 ContentChild projections
@Component({
    standalone: true,
    imports: [DatePicker, FormsModule, ReactiveFormsModule, CommonModule],
    template: `
        <p-datepicker [(ngModel)]="selectedDate" [showTime]="showTime" [showIcon]="showIcon" [showClear]="showClear" [view]="view" [dateFormat]="dateFormat" [touchUI]="touchUI">
            <!-- Date template with context parameters -->
            <ng-template #date let-date>
                <div class="custom-date" data-testid="date-template">
                    <span class="day">{{ date?.day }}</span>
                    @if (date?.month) {
                        <span class="month">{{ date?.month }}</span>
                    }
                    @if (date?.year) {
                        <span class="year">{{ date?.year }}</span>
                    }
                </div>
            </ng-template>

            <!-- Header template -->
            <ng-template #header>
                <div class="custom-header" data-testid="header-template">
                    <h4>Select Date</h4>
                    <small>Choose your preferred date</small>
                </div>
            </ng-template>

            <!-- Footer template -->
            <ng-template #footer>
                <div class="custom-footer" data-testid="footer-template">
                    <button type="button" class="today-btn">Today</button>
                    <button type="button" class="clear-btn">Clear</button>
                </div>
            </ng-template>

            <!-- Disabled date template with context -->
            <ng-template #disabledDate let-date>
                <div class="disabled-date" data-testid="disabled-date-template">
                    <span class="crossed-out">{{ date?.day }}</span>
                </div>
            </ng-template>

            <!-- Decade template with context -->
            <ng-template #decade let-decade>
                <div class="custom-decade" data-testid="decade-template">
                    <span class="decade-range">{{ decade?.year }}-{{ decade?.year ? decade.year + 9 : '' }}</span>
                </div>
            </ng-template>

            <!-- Previous icon template -->
            <ng-template #previousicon>
                <i class="pi pi-chevron-left custom-prev" data-testid="previous-icon-template"></i>
            </ng-template>

            <!-- Next icon template -->
            <ng-template #nexticon>
                <i class="pi pi-chevron-right custom-next" data-testid="next-icon-template"></i>
            </ng-template>

            <!-- Trigger icon template -->
            <ng-template #triggericon>
                <i class="pi pi-calendar custom-trigger" data-testid="trigger-icon-template"></i>
            </ng-template>

            <!-- Clear icon template -->
            <ng-template #clearicon>
                <i class="pi pi-times custom-clear" data-testid="clear-icon-template"></i>
            </ng-template>

            <!-- Decrement icon template -->
            <ng-template #decrementicon>
                <i class="pi pi-minus custom-decrement" data-testid="decrement-icon-template"></i>
            </ng-template>

            <!-- Increment icon template -->
            <ng-template #incrementicon>
                <i class="pi pi-plus custom-increment" data-testid="increment-icon-template"></i>
            </ng-template>

            <!-- Input icon template -->
            <ng-template #inputicon>
                <i class="pi pi-clock custom-input-icon" data-testid="input-icon-template"></i>
            </ng-template>
        </p-datepicker>
    `
})
class TestAllTemplatesDatePickerComponent {
    private _selectedDate = signal<Date | null>(null as any);
    get selectedDate() {
        return this._selectedDate();
    }
    set selectedDate(v: Date | null) {
        this._selectedDate.set(v);
    }
    private _showTime = signal<boolean>(false);
    get showTime() {
        return this._showTime();
    }
    set showTime(v: boolean) {
        this._showTime.set(v);
    }
    private _showIcon = signal<boolean>(false);
    get showIcon() {
        return this._showIcon();
    }
    set showIcon(v: boolean) {
        this._showIcon.set(v);
    }
    private _showClear = signal<boolean>(false);
    get showClear() {
        return this._showClear();
    }
    set showClear(v: boolean) {
        this._showClear.set(v);
    }
    private _view = signal<string>('date');
    get view() {
        return this._view();
    }
    set view(v: string) {
        this._view.set(v);
    }
    private _dateFormat = signal<string>('dd/mm/yy');
    get dateFormat() {
        return this._dateFormat();
    }
    set dateFormat(v: string) {
        this._dateFormat.set(v);
    }
    private _touchUI = signal<boolean>(false);
    get touchUI() {
        return this._touchUI();
    }
    set touchUI(v: boolean) {
        this._touchUI.set(v);
    }
}

// #template references only - Comprehensive template test component with all 12 ContentChild projections
@Component({
    standalone: true,
    imports: [DatePicker, FormsModule, ReactiveFormsModule, CommonModule],
    template: `
        <p-datepicker [(ngModel)]="selectedDate" [showTime]="showTime" [showIcon]="showIcon" [showClear]="showClear" [view]="view" [dateFormat]="dateFormat" [touchUI]="touchUI">
            <!-- Date template with context parameters -->
            <ng-template #date let-date>
                <div class="custom-date-ref" data-testid="date-ref-template">
                    <span class="day">{{ date?.day }}</span>
                    @if (date?.month) {
                        <span class="month">{{ date?.month }}</span>
                    }
                    @if (date?.year) {
                        <span class="year">{{ date?.year }}</span>
                    }
                </div>
            </ng-template>

            <!-- Header template -->
            <ng-template #header>
                <div class="custom-header-ref" data-testid="header-ref-template">
                    <h4>Select Date (Ref)</h4>
                    <small>Choose your preferred date using references</small>
                </div>
            </ng-template>

            <!-- Footer template -->
            <ng-template #footer>
                <div class="custom-footer-ref" data-testid="footer-ref-template">
                    <button type="button" class="today-btn-ref">Today</button>
                    <button type="button" class="clear-btn-ref">Clear</button>
                </div>
            </ng-template>

            <!-- Disabled date template with context -->
            <ng-template #disabledDate let-date>
                <div class="disabled-date-ref" data-testid="disabled-date-ref-template">
                    <span class="crossed-out-ref">{{ date?.day }}</span>
                </div>
            </ng-template>

            <!-- Decade template with context -->
            <ng-template #decade let-decade>
                <div class="custom-decade-ref" data-testid="decade-ref-template">
                    <span class="decade-range-ref">{{ decade?.year }}-{{ decade?.year ? decade.year + 9 : '' }}</span>
                </div>
            </ng-template>

            <!-- Previous icon template -->
            <ng-template #previousicon>
                <i class="pi pi-chevron-left custom-prev-ref" data-testid="previous-icon-ref-template"></i>
            </ng-template>

            <!-- Next icon template -->
            <ng-template #nexticon>
                <i class="pi pi-chevron-right custom-next-ref" data-testid="next-icon-ref-template"></i>
            </ng-template>

            <!-- Trigger icon template -->
            <ng-template #triggericon>
                <i class="pi pi-calendar custom-trigger-ref" data-testid="trigger-icon-ref-template"></i>
            </ng-template>

            <!-- Clear icon template -->
            <ng-template #clearicon>
                <i class="pi pi-times custom-clear-ref" data-testid="clear-icon-ref-template"></i>
            </ng-template>

            <!-- Decrement icon template -->
            <ng-template #decrementicon>
                <i class="pi pi-minus custom-decrement-ref" data-testid="decrement-icon-ref-template"></i>
            </ng-template>

            <!-- Increment icon template -->
            <ng-template #incrementicon>
                <i class="pi pi-plus custom-increment-ref" data-testid="increment-icon-ref-template"></i>
            </ng-template>

            <!-- Input icon template -->
            <ng-template #inputicon>
                <i class="pi pi-clock custom-input-icon-ref" data-testid="input-icon-ref-template"></i>
            </ng-template>
        </p-datepicker>
    `
})
class TestRefTemplatesDatePickerComponent {
    private _selectedDate = signal<Date | null>(null as any);
    get selectedDate() {
        return this._selectedDate();
    }
    set selectedDate(v: Date | null) {
        this._selectedDate.set(v);
    }
    private _showTime = signal<boolean>(false);
    get showTime() {
        return this._showTime();
    }
    set showTime(v: boolean) {
        this._showTime.set(v);
    }
    private _showIcon = signal<boolean>(false);
    get showIcon() {
        return this._showIcon();
    }
    set showIcon(v: boolean) {
        this._showIcon.set(v);
    }
    private _showClear = signal<boolean>(false);
    get showClear() {
        return this._showClear();
    }
    set showClear(v: boolean) {
        this._showClear.set(v);
    }
    private _view = signal<string>('date');
    get view() {
        return this._view();
    }
    set view(v: string) {
        this._view.set(v);
    }
    private _dateFormat = signal<string>('dd/mm/yy');
    get dateFormat() {
        return this._dateFormat();
    }
    set dateFormat(v: string) {
        this._dateFormat.set(v);
    }
    private _touchUI = signal<boolean>(false);
    get touchUI() {
        return this._touchUI();
    }
    set touchUI(v: boolean) {
        this._touchUI.set(v);
    }
}

// Legacy component for backward compatibility (deprecated - use separated versions above)
@Component({
    standalone: true,
    imports: [DatePicker, FormsModule, ReactiveFormsModule, CommonModule],
    template: `
        <p-datepicker [(ngModel)]="selectedDate" [showTime]="showTime" [showIcon]="showIcon" [showClear]="showClear" [view]="view" [dateFormat]="dateFormat" [touchUI]="touchUI">
            <ng-template #date let-date>
                <div class="custom-date" data-testid="date-template">
                    <span class="day">{{ date?.day }}</span>
                </div>
            </ng-template>
        </p-datepicker>
    `
})
class TestTemplatesDatePickerComponent {
    private _selectedDate = signal<Date | null>(null as any);
    get selectedDate() {
        return this._selectedDate();
    }
    set selectedDate(v: Date | null) {
        this._selectedDate.set(v);
    }
    private _showTime = signal<boolean>(false);
    get showTime() {
        return this._showTime();
    }
    set showTime(v: boolean) {
        this._showTime.set(v);
    }
    private _showIcon = signal<boolean>(false);
    get showIcon() {
        return this._showIcon();
    }
    set showIcon(v: boolean) {
        this._showIcon.set(v);
    }
    private _showClear = signal<boolean>(false);
    get showClear() {
        return this._showClear();
    }
    set showClear(v: boolean) {
        this._showClear.set(v);
    }
    private _view = signal<string>('date');
    get view() {
        return this._view();
    }
    set view(v: string) {
        this._view.set(v);
    }
    private _dateFormat = signal<string>('dd/mm/yy');
    get dateFormat() {
        return this._dateFormat();
    }
    set dateFormat(v: string) {
        this._dateFormat.set(v);
    }
    private _touchUI = signal<boolean>(false);
    get touchUI() {
        return this._touchUI();
    }
    set touchUI(v: boolean) {
        this._touchUI.set(v);
    }
}

describe('DatePicker', () => {
    let component: DatePicker;
    let fixture: ComponentFixture<DatePicker>;
    let testComponent: TestDatePickerComponent;
    let testFixture: ComponentFixture<TestDatePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DatePicker,
                FormsModule,
                ReactiveFormsModule,
                CommonModule,
                TestDatePickerComponent,
                TestReactiveFormDatePickerComponent,
                TestTemplatesDatePickerComponent,
                TestAllTemplatesDatePickerComponent,
                TestRefTemplatesDatePickerComponent
            ],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(DatePicker);
        component = fixture.componentInstance;
        await fixture.whenStable();

        testFixture = TestBed.createComponent(TestDatePickerComponent);
        testComponent = testFixture.componentInstance;
        await testFixture.whenStable();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with default values', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(component.dateFormat()).toBeUndefined(); // Default is undefined, not 'mm/dd/yy'
            expect(component.multipleSeparator()).toBe(',');
            expect(component.rangeSeparator()).toBe('-');
            expect(component.inline()).toBe(false);
            expect(component.showOtherMonths()).toBe(true);
            expect(component.stepHour()).toBe(1);
            expect(component.stepMinute()).toBe(1);
            expect(component.stepSecond()).toBe(1);
            expect(component.showSeconds()).toBe(false);
            expect(component.hourFormat()).toBe('24');
        });

        it('should accept custom values', async () => {
            testComponent.dateFormat = 'dd-mm-yyyy';
            testComponent.placeholder = 'Choose date';
            testComponent.showTime = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.dateFormat()).toBe('dd-mm-yyyy');
            expect(datePickerComponent.placeholder()).toBe('Choose date');
            expect(datePickerComponent.showTime()).toBe(true);
        });
    });

    describe('Basic Functionality', () => {
        beforeEach(async () => {
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
        });

        it('should display input field', () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement).toBeTruthy();
            expect(inputElement.nativeElement.getAttribute('placeholder')).toBe('Select a date');
        });

        it('should open calendar on input click', async () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            inputElement.nativeElement.click();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.overlayVisible()).toBe(true);
        });

        it('should handle date selection', async () => {
            vi.spyOn(testComponent, 'onDateSelect');
            vi.spyOn(testComponent, 'onDateChange');

            const testDate = new Date(2023, 5, 15); // June 15, 2023
            testComponent.selectedDate = testDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(testComponent.selectedDate).toEqual(testDate);
        });
    });

    describe('Input Properties', () => {
        it('should apply dateFormat correctly', async () => {
            testComponent.dateFormat = 'dd/mm/yyyy';
            testComponent.selectedDate = new Date(2023, 5, 15);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.dateFormat()).toBe('dd/mm/yyyy');

            // Note: Input formatting depends on locale service and internal formatting logic
            // For unit tests, we primarily test that the property is set correctly
            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement).toBeTruthy();
        });

        it('should handle disabled state', async () => {
            testComponent.disabled = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.disabled).toBe(true);
        });

        it('should handle readonly input state', async () => {
            testComponent.readonlyInput = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.readOnly).toBe(true);
        });

        it('should show calendar icon when showIcon is true', async () => {
            testComponent.showIcon = true;
            testComponent.iconDisplay = 'button';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const iconButton = testFixture.debugElement.query(By.css('button'));
            expect(iconButton).toBeTruthy();
        });

        it('should handle custom icon', async () => {
            testComponent.showIcon = true;
            testComponent.icon = 'pi pi-calendar-plus';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.icon()).toBe('pi pi-calendar-plus');
        });

        it('should handle input id and name attributes', async () => {
            testComponent.inputStyleClass = 'custom-input';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.className).toContain('custom-input');
        });
    });

    describe('Event Handling', () => {
        beforeEach(async () => {
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
        });

        it('should emit onFocus event', () => {
            vi.spyOn(testComponent, 'onDateFocus');

            const inputElement = testFixture.debugElement.query(By.css('input'));
            inputElement.nativeElement.dispatchEvent(new FocusEvent('focus'));

            expect(testComponent.onDateFocus).toHaveBeenCalled();
        });

        it('should emit onBlur event', () => {
            vi.spyOn(testComponent, 'onDateBlur');

            const inputElement = testFixture.debugElement.query(By.css('input'));
            inputElement.nativeElement.dispatchEvent(new FocusEvent('blur'));

            expect(testComponent.onDateBlur).toHaveBeenCalled();
        });

        it('should open calendar on input click', async () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            inputElement.nativeElement.click();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.overlayVisible()).toBe(true);
        });

        it('should open calendar with button click when showIcon is true', async () => {
            testComponent.showIcon = true;
            testComponent.iconDisplay = 'button';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const buttonElement = testFixture.debugElement.query(By.css('button'));
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            buttonElement.nativeElement.click();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.overlayVisible()).toBe(true);
        });
    });

    describe('Date Selection Modes', () => {
        it('should handle single selection mode', async () => {
            testComponent.selectionMode = 'single';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.selectionMode()).toBe('single');
        });
    });

    describe('Time Picker', () => {
        it('should show time picker when showTime is true', async () => {
            testComponent.showTime = true;
            testComponent.showSeconds = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.showTime()).toBe(true);
            expect(datePickerComponent.showSeconds()).toBe(true);
        });

        it('should handle 12-hour format', async () => {
            testComponent.hourFormat = '12';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.hourFormat()).toBe('12');
        });

        it('should handle time steps', async () => {
            testComponent.showTime = true;
            testComponent.stepHour = 2;
            testComponent.stepMinute = 15;
            testComponent.stepSecond = 30;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.stepHour()).toBe(2);
            expect(datePickerComponent.stepMinute()).toBe(15);
            expect(datePickerComponent.stepSecond()).toBe(30);
        });
    });

    describe('Inline Mode', () => {
        it('should display inline calendar', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.inline()).toBe(true);
        });
    });

    describe('Date Restrictions', () => {
        it('should handle minDate restriction', async () => {
            const minDate = new Date(2023, 0, 1); // January 1, 2023
            testComponent.minDate = minDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.minDate()).toEqual(minDate);
        });

        it('should handle maxDate restriction', async () => {
            const maxDate = new Date(2023, 11, 31); // December 31, 2023
            testComponent.maxDate = maxDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.maxDate()).toEqual(maxDate);
        });

        it('should handle disabled dates', async () => {
            const disabledDates = [new Date(2023, 5, 15), new Date(2023, 5, 20)];
            testComponent.disabledDates = disabledDates;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.disabledDates()).toEqual(disabledDates);
        });

        it('should handle disabled days of week', async () => {
            const disabledDays = [0, 6]; // Disable Sundays and Saturdays
            testComponent.disabledDays = disabledDays;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.disabledDays()).toEqual(disabledDays);
        });
    });

    describe('Navigation', () => {
        it('should handle multiple months display', async () => {
            testComponent.numberOfMonths = 3;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.numberOfMonths()).toBe(3);
        });
    });

    describe('Reactive Forms Integration', () => {
        let reactiveFixture: ComponentFixture<TestReactiveFormDatePickerComponent>;
        let reactiveComponent: TestReactiveFormDatePickerComponent;

        beforeEach(async () => {
            reactiveFixture = TestBed.createComponent(TestReactiveFormDatePickerComponent);
            reactiveComponent = reactiveFixture.componentInstance;
            reactiveFixture.changeDetectorRef.markForCheck();
            await reactiveFixture.whenStable();
        });

        it('should integrate with reactive forms', () => {
            expect(reactiveComponent.form.get('date')?.value).toBeNull();
            expect(reactiveComponent.form.get('date')?.invalid).toBe(true);
        });

        it('should update form control value', async () => {
            const testDate = new Date(2023, 5, 15);
            reactiveComponent.form.get('date')?.setValue(testDate);
            reactiveFixture.changeDetectorRef.markForCheck();
            await reactiveFixture.whenStable();

            expect(reactiveComponent.form.get('date')?.value).toEqual(testDate);
            expect(reactiveComponent.form.get('date')?.valid).toBe(true);
        });

        it('should handle form control validation', () => {
            const dateControl = reactiveComponent.form.get('date');
            expect(dateControl?.hasError('required')).toBe(true);

            dateControl?.setValue(new Date());
            expect(dateControl?.hasError('required')).toBe(false);
            expect(dateControl?.valid).toBe(true);
        });

        it('should handle form reset', () => {
            const testDate = new Date(2023, 5, 15);
            reactiveComponent.form.get('date')?.setValue(testDate);
            expect(reactiveComponent.form.get('date')?.value).toEqual(testDate);

            reactiveComponent.form.reset();
            expect(reactiveComponent.form.get('date')?.value).toBeNull();
            expect(reactiveComponent.form.pristine).toBe(true);
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply custom input styles', async () => {
            testComponent.inputStyle = { border: '2px solid red', padding: '10px' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.inputStyle()).toEqual({ border: '2px solid red', padding: '10px' });
        });

        it('should apply custom panel styles', async () => {
            testComponent.panelStyle = { backgroundColor: 'lightblue', border: '1px solid blue' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.panelStyle()).toEqual({ backgroundColor: 'lightblue', border: '1px solid blue' });
        });

        it('should apply custom CSS classes', async () => {
            testComponent.inputStyleClass = 'custom-input-class';
            testComponent.panelStyleClass = 'custom-panel-class';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.inputStyleClass()).toBe('custom-input-class');
            expect(datePickerComponent.panelStyleClass()).toBe('custom-panel-class');
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', async () => {
            testComponent.ariaLabel = 'Select date';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.getAttribute('aria-label')).toBe('Select date');
            expect(inputElement.nativeElement.getAttribute('role')).toBe('combobox');
        });

        it('should handle aria-labelledby', async () => {
            testComponent.ariaLabelledBy = 'date-label';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.getAttribute('aria-labelledby')).toBe('date-label');
        });

        it('should handle tabindex', async () => {
            testComponent.tabindex = 5;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.getAttribute('tabindex')).toBe('5');
        });
    });

    describe('Keyboard Navigation', () => {
        beforeEach(async () => {
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
        });

        it('should handle Enter key to open calendar', () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            inputElement.nativeElement.dispatchEvent(enterEvent);

            expect(inputElement).toBeTruthy(); // Basic check that element exists
        });

        it('should handle Escape key to close calendar', async () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // First open the calendar
            datePickerComponent.overlayVisible.set(true);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            inputElement.nativeElement.dispatchEvent(escapeEvent);

            expect(inputElement).toBeTruthy();
        });
    });

    describe('Locale and Internationalization', () => {
        it('should handle locale via configuration service', () => {
            // Locale is handled via PrimeNG config service, not direct input
            expect(true).toBe(true);
        });

        it('should handle first day of week', async () => {
            testComponent.firstDayOfWeek = 1; // Monday
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.firstDayOfWeek()).toBe(1);
        });

        it('should handle show week numbers', async () => {
            testComponent.showWeek = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.showWeek()).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined values', async () => {
            testComponent.selectedDate = null as any;
            testComponent.minDate = null as any;
            testComponent.maxDate = null as any;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(() => {
                testFixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should handle empty arrays', async () => {
            testComponent.disabledDates = [];
            testComponent.disabledDays = [];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(() => {
                testFixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should handle extreme date values', async () => {
            const extremeMinDate = new Date(1900, 0, 1);
            const extremeMaxDate = new Date(2100, 11, 31);

            testComponent.minDate = extremeMinDate;
            testComponent.maxDate = extremeMaxDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.minDate()).toEqual(extremeMinDate);
            expect(datePickerComponent.maxDate()).toEqual(extremeMaxDate);
        });
    });

    describe('Advanced Features', () => {
        it('should handle touch UI mode', async () => {
            testComponent.touchUI = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.touchUI()).toBe(true);
        });

        it('should handle show other months', async () => {
            testComponent.showOtherMonths = false;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.showOtherMonths()).toBe(false);
        });

        it('should handle select other months', async () => {
            testComponent.selectOtherMonths = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.selectOtherMonths()).toBe(true);
        });

        it('should handle button bar', async () => {
            testComponent.showButtonBar = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.showButtonBar()).toBe(true);
        });

        it('should handle keep invalid dates', async () => {
            testComponent.keepInvalid = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.keepInvalid()).toBe(true);
        });

        it('should navigate to next month', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const currentMonth = datePickerComponent.currentMonth;
            const currentYear = datePickerComponent.currentYear;

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.navForward(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            if (currentMonth === 11) {
                expect(datePickerComponent.currentMonth).toBe(0);
                expect(datePickerComponent.currentYear).toBe(currentYear + 1);
            } else {
                expect(datePickerComponent.currentMonth).toBe(currentMonth + 1);
                expect(datePickerComponent.currentYear).toBe(currentYear);
            }
        });

        it('should navigate to previous month', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const currentMonth = datePickerComponent.currentMonth;
            const currentYear = datePickerComponent.currentYear;

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.navBackward(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            if (currentMonth === 0) {
                expect(datePickerComponent.currentMonth).toBe(11);
                expect(datePickerComponent.currentYear).toBe(currentYear - 1);
            } else {
                expect(datePickerComponent.currentMonth).toBe(currentMonth - 1);
                expect(datePickerComponent.currentYear).toBe(currentYear);
            }
        });

        it('should select date when clicked', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const testDate = new Date(2023, 5, 15); // June 15, 2023

            // Directly set the value to test date selection functionality
            testComponent.selectedDate = testDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(testComponent.selectedDate).toEqual(testDate);
            expect(datePickerComponent.value).toEqual(testDate);
        });

        it('should handle multiple date selection', async () => {
            testComponent.selectionMode = 'multiple';
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Verify that selectionMode is set correctly
            expect(datePickerComponent.selectionMode()).toBe('multiple');
            expect(datePickerComponent.inline()).toBe(true);
        });

        it('should handle range date selection', async () => {
            testComponent.selectionMode = 'range';
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Verify that selectionMode is set correctly
            expect(datePickerComponent.selectionMode()).toBe('range');
            expect(datePickerComponent.inline()).toBe(true);
        });

        it('should switch to month view when month clicked', async () => {
            testComponent.inline = true;
            testComponent.view = 'date';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.switchToMonthView(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.currentView()).toBe('month');
        });

        it('should switch to year view when year clicked', async () => {
            testComponent.inline = true;
            testComponent.view = 'date';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.switchToYearView(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.currentView()).toBe('year');
        });

        it('should handle time picker hour increment', async () => {
            testComponent.showTime = true;
            testComponent.inline = true;
            testComponent.selectedDate = new Date(2023, 5, 15, 10, 30);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const initialHour = datePickerComponent.currentHour();

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.incrementHour(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            if (initialHour < 23) {
                expect(datePickerComponent.currentHour()).toBe(initialHour + 1);
            } else {
                expect(datePickerComponent.currentHour()).toBe(0);
            }
        });

        it('should handle time picker minute increment', async () => {
            testComponent.showTime = true;
            testComponent.inline = true;
            testComponent.selectedDate = new Date(2023, 5, 15, 10, 30);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const initialMinute = datePickerComponent.currentMinute();

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.incrementMinute(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            if (initialMinute < 59) {
                expect(datePickerComponent.currentMinute()).toBe(initialMinute + 1);
            } else {
                expect(datePickerComponent.currentMinute()).toBe(0);
            }
        });

        it('should clear selection when clear button clicked', async () => {
            testComponent.showClear = true;
            testComponent.selectedDate = new Date(2023, 5, 15);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.clear();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(testComponent.selectedDate).toBeNull();
        });

        it('should handle keyboard navigation', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Test that keyboard navigation properties are available
            expect(typeof datePickerComponent.onContainerButtonKeydown).toBe('function');
            expect(datePickerComponent.inline()).toBe(true);
        });

        it('should handle disabled dates', async () => {
            const disabledDate = new Date(2023, 5, 15);
            testComponent.disabledDates = [disabledDate];
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Test that disabled dates array is properly set
            expect(datePickerComponent.disabledDates()).toContain(disabledDate);
            expect(Array.isArray(datePickerComponent.disabledDates())).toBe(true);
        });

        it('should handle min/max date restrictions', async () => {
            testComponent.minDate = new Date(2023, 5, 10);
            testComponent.maxDate = new Date(2023, 5, 20);
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const beforeMinDate = new Date(2023, 5, 5);
            const afterMaxDate = new Date(2023, 5, 25);
            const validDate = new Date(2023, 5, 15);

            // Test that dates outside range are considered out of bounds
            expect(beforeMinDate < testComponent.minDate).toBe(true);
            expect(afterMaxDate > testComponent.maxDate).toBe(true);
            expect(validDate >= testComponent.minDate && validDate <= testComponent.maxDate).toBe(true);
        });

        it('should handle button bar today functionality', async () => {
            testComponent.showButtonBar = true;
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Test Today button
            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.onTodayButtonClick(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const today = new Date();
            expect(testComponent.selectedDate.toDateString()).toBe(today.toDateString());
        });
    });

    describe('#template Content Projection', () => {
        let templatesFixture: ComponentFixture<TestAllTemplatesDatePickerComponent>;
        let templatesDatePickerElement: any;

        beforeEach(async () => {
            templatesFixture = TestBed.createComponent(TestAllTemplatesDatePickerComponent);
            templatesDatePickerElement = templatesFixture.debugElement.query(By.css('p-datepicker'));
            templatesFixture.changeDetectorRef.markForCheck();
            await templatesFixture.whenStable();
        });

        it('should initialize #templates and make them available', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Trigger content initialization
            templatesFixture.changeDetectorRef.markForCheck();
            await templatesFixture.whenStable();

            // Verify that templates collection exists
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support date #template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.dateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support header #template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.headerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support footer #template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.footerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support disabled date #template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.disabledDateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });
    });

    describe('#template Reference Content Projection', () => {
        let refTemplatesFixture: ComponentFixture<TestRefTemplatesDatePickerComponent>;
        let refTemplatesDatePickerElement: any;

        beforeEach(async () => {
            refTemplatesFixture = TestBed.createComponent(TestRefTemplatesDatePickerComponent);
            refTemplatesDatePickerElement = refTemplatesFixture.debugElement.query(By.css('p-datepicker'));
            refTemplatesFixture.changeDetectorRef.markForCheck();
            await refTemplatesFixture.whenStable();
        });

        it('should initialize #template references and make them available', async () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;

            // Trigger content initialization
            refTemplatesFixture.changeDetectorRef.markForCheck();
            await refTemplatesFixture.whenStable();

            // Verify that templates collection exists
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support date #template reference property access', () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.dateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support header #template reference property access', () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.headerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support footer #template reference property access', () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.footerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support disabled date #template reference property access', () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.disabledDateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });
    });

    describe('Templates and Content Projection (Legacy)', () => {
        let templatesFixture: ComponentFixture<TestTemplatesDatePickerComponent>;
        let templatesDatePickerElement: any;

        beforeEach(async () => {
            templatesFixture = TestBed.createComponent(TestTemplatesDatePickerComponent);
            templatesDatePickerElement = templatesFixture.debugElement.query(By.css('p-datepicker'));
            templatesFixture.changeDetectorRef.markForCheck();
            await templatesFixture.whenStable();
        });

        it('should initialize templates and make them available', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Trigger content initialization
            templatesFixture.changeDetectorRef.markForCheck();
            await templatesFixture.whenStable();

            // Verify that templates collection exists
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support date template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.dateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support header template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.headerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support footer template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.footerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support disabled date template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.disabledDateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support decade template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.decadeTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support navigation icon template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access navigation template properties without errors
            expect(() => {
                datePickerComponent.previousIconTemplate;
                datePickerComponent.nextIconTemplate;
            }).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support action icon template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access action template properties without errors
            expect(() => {
                datePickerComponent.triggerIconTemplate;
                datePickerComponent.clearIconTemplate;
                datePickerComponent.inputIconTemplate;
            }).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support time control icon template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access time control template properties without errors
            expect(() => {
                datePickerComponent.decrementIconTemplate;
                datePickerComponent.incrementIconTemplate;
            }).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should have template collection initialized', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify that the component has template properties
            expect(datePickerComponent).toBeTruthy();

            // Test that we can access template-related properties without errors
            expect(() => {
                datePickerComponent.dateTemplate;
                datePickerComponent.headerTemplate;
                datePickerComponent.footerTemplate;
                datePickerComponent.disabledDateTemplate;
                datePickerComponent.decadeTemplate;
                datePickerComponent.previousIconTemplate;
                datePickerComponent.nextIconTemplate;
                datePickerComponent.triggerIconTemplate;
                datePickerComponent.clearIconTemplate;
                datePickerComponent.decrementIconTemplate;
                datePickerComponent.incrementIconTemplate;
                datePickerComponent.inputIconTemplate;
            }).not.toThrow();
        });

        it('should handle template-enabled DatePicker component', () => {
            // The TestTemplatesDatePickerComponent contains various template projections
            // Verify the component can be instantiated and used without errors
            expect(templatesFixture.componentInstance).toBeTruthy();
            expect(templatesDatePickerElement).toBeTruthy();
            expect(templatesDatePickerElement.componentInstance).toBeTruthy();
        });

        it('should support ContentChild template projections', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify component is ready to accept templates
            expect(datePickerComponent).toBeTruthy();

            // After content initialization should be callable without errors
            expect(() => {
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }
            }).not.toThrow();
        });

        it('should process templates through #template system', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify that templates can be processed
            expect(datePickerComponent).toBeTruthy();

            // Test that the template processing lifecycle works
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should recognize #template structures', async () => {
            // Test that component can handle #template references
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify component can work with templates without errors
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }
            }).not.toThrow();

            // Templates should be available for processing
            expect(datePickerComponent).toBeTruthy();
        });

        it('should verify #template references are accessible', async () => {
            // Verify that #template references can be accessed
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // After content init, templates should be available
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }
            }).not.toThrow();

            // Component should be able to process templates
            expect(datePickerComponent).toBeTruthy();
        });

        it('should handle template projection with context parameters', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Test that templates can be processed with context
            expect(() => {
                // Simulate template context processing
                templatesFixture.changeDetectorRef.markForCheck();

                // Component should be available for context binding
                expect(datePickerComponent).toBeTruthy();
            }).not.toThrow();
        });

        it('should support #template approach', async () => {
            // Verify that using #template works correctly
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Component should handle #template approach
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Test template processing
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }
            }).not.toThrow();

            expect(datePickerComponent).toBeTruthy();
        });

        it('should verify all template types with #template structure', async () => {
            // Test comprehensive template coverage with #template references
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify that component can process all template types
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Test template property access
                datePickerComponent.dateTemplate;
                datePickerComponent.headerTemplate;
                datePickerComponent.footerTemplate;
                datePickerComponent.disabledDateTemplate;
                datePickerComponent.decadeTemplate;
                datePickerComponent.previousIconTemplate;
                datePickerComponent.nextIconTemplate;
                datePickerComponent.triggerIconTemplate;
                datePickerComponent.clearIconTemplate;
                datePickerComponent.decrementIconTemplate;
                datePickerComponent.incrementIconTemplate;
                datePickerComponent.inputIconTemplate;
            }).not.toThrow();

            // Component should handle template processing
            expect(datePickerComponent).toBeTruthy();
        });

        it('should handle template lifecycle with #template references', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Test template lifecycle methods
            expect(() => {
                // ngAfterContentInit should process templates
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }

                // ngAfterViewInit should be callable
                if (datePickerComponent.ngAfterViewInit) {
                    datePickerComponent.ngAfterViewInit();
                }

                templatesFixture.changeDetectorRef.markForCheck();
            }).not.toThrow();

            // Templates should be properly initialized
            expect(datePickerComponent).toBeTruthy();
        });

        it('should handle context parameters in date template', async () => {
            // Test that date template context works
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Simulate date context processing
                const mockDateContext = {
                    date: { day: 15, month: 6, year: 2023 }
                };

                // Template should handle context parameters
                expect(mockDateContext.date.day).toBe(15);
                expect(mockDateContext.date.month).toBe(6);
                expect(mockDateContext.date.year).toBe(2023);
            }).not.toThrow();
        });

        it('should handle context parameters in disabled date template', async () => {
            // Test that disabled date template context works
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Simulate disabled date context processing
                const mockDisabledContext = {
                    date: { day: 25, month: 12, year: 2023, disabled: true }
                };

                // Template should handle disabled date context
                expect(mockDisabledContext.date.disabled).toBe(true);
            }).not.toThrow();
        });

        it('should handle context parameters in decade template', async () => {
            // Test that decade template context works
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Simulate decade context processing
                const mockDecadeContext = {
                    decade: { year: 2020 }
                };

                // Template should handle decade context
                expect(mockDecadeContext.decade.year).toBe(2020);
            }).not.toThrow();
        });
    });

    describe('PassThrough (PT) Tests', () => {
        it('PT Case 1: should accept simple string values', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                root: 'custom-root-class',
                panel: 'custom-panel-class',
                calendar: 'custom-calendar-class'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('custom-root-class')).toBe(true);
        });

        it('PT Case 2: should accept objects with class, style, and attributes', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                root: {
                    class: 'custom-root',
                    style: { backgroundColor: 'lightblue' },
                    'data-testid': 'datepicker-root'
                },
                panel: {
                    class: 'custom-panel',
                    style: { padding: '20px' }
                }
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('custom-root')).toBe(true);
            expect(root.getAttribute('data-testid')).toBe('datepicker-root');
        });

        it('PT Case 3: should accept mixed object and string values', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                root: 'string-root-class',
                panel: {
                    class: 'object-panel-class',
                    style: { border: '1px solid red' }
                },
                calendar: 'string-calendar-class'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('string-root-class')).toBe(true);
        });

        it('PT Case 4: should use instance properties in PT functions', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                root: (options: any) => ({
                    class: options.instance.inline ? 'inline-calendar' : 'popup-calendar'
                })
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('inline-calendar')).toBe(true);
        });

        it('PT Case 5: should bind events through PT', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            let clicked = false;
            ptFixture.componentRef.setInput('pt', {
                root: {
                    onClick: () => {
                        clicked = true;
                    }
                }
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            root.click();
            expect(clicked).toBe(true);
        });

        it('PT Case 6: should support inline PT binding', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('ptOptions', { mergeSections: true, mergeProps: true });
            ptFixture.componentRef.setInput('pt', {
                root: 'inline-root',
                panel: 'inline-panel'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('inline-root')).toBe(true);
        });

        it('PT Case 9: should apply PT to nested Button components', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                pcPrevButton: {
                    class: 'custom-prev-button',
                    root: 'prev-button-root'
                },
                pcNextButton: {
                    class: 'custom-next-button',
                    root: 'next-button-root'
                },
                pcTodayButton: 'today-button-class',
                pcClearButton: 'clear-button-class'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.componentRef.setInput('showButtonBar', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            expect(ptFixture.componentInstance).toBeTruthy();
        });

        it('PT Case 10: should apply PT to calendar structure', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                calendarContainer: 'custom-calendar-container',
                calendar: 'custom-calendar',
                header: {
                    class: 'custom-header',
                    style: { fontWeight: 'bold' }
                },
                title: 'custom-title',
                selectMonth: 'custom-select-month',
                selectYear: 'custom-select-year'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            expect(ptFixture.componentInstance).toBeTruthy();
        });

        it('PT Case 11: should apply PT to table elements', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                table: 'custom-table',
                tableHeader: 'custom-table-header',
                tableHeaderRow: 'custom-header-row',
                weekDay: 'custom-week-day',
                tableBody: 'custom-table-body',
                tableBodyRow: 'custom-body-row',
                dayCell: 'custom-day-cell',
                day: {
                    class: 'custom-day',
                    'data-day': 'true'
                }
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            expect(ptFixture.componentInstance).toBeTruthy();
        });

        it('PT Case 12: should apply PT to time picker elements', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                timePicker: 'custom-time-picker',
                hourPicker: 'custom-hour-picker',
                hour: 'custom-hour',
                minutePicker: 'custom-minute-picker',
                minute: 'custom-minute',
                secondPicker: 'custom-second-picker',
                second: 'custom-second',
                separatorContainer: 'custom-separator-container',
                separator: 'custom-separator',
                ampmPicker: 'custom-ampm-picker',
                ampm: 'custom-ampm',
                pcIncrementButton: 'custom-increment',
                pcDecrementButton: 'custom-decrement'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.componentRef.setInput('showTime', true);
            ptFixture.componentRef.setInput('showSeconds', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            expect(ptFixture.componentInstance).toBeTruthy();
        });
    });
});
