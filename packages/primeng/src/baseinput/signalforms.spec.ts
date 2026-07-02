import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { Checkbox } from 'primeng/checkbox';
import { InputMask } from 'primeng/inputmask';
import { InputText } from 'primeng/inputtext';
import { patternAttribute } from './baseinput';

describe('patternAttribute', () => {
    it('should return undefined for empty values', () => {
        expect(patternAttribute(null)).toBeUndefined();
        expect(patternAttribute(undefined)).toBeUndefined();
        expect(patternAttribute('')).toBeUndefined();
    });

    it('should convert a string into a RegExp array', () => {
        const result = patternAttribute('^[a-z]+$');
        expect(result?.length).toBe(1);
        expect(result?.[0] instanceof RegExp).toBe(true);
        expect(result?.[0].source).toBe('^[a-z]+$');
    });

    it('should keep RegExp instances as-is', () => {
        const rx = /^\d+$/;
        const result = patternAttribute(rx);
        expect(result?.[0]).toBe(rx);
    });

    it('should accept arrays of strings and RegExps as bound by signal forms', () => {
        const rx = /^\d+$/;
        const result = patternAttribute([rx, '^[a-z]+$']);
        expect(result?.length).toBe(2);
        expect(result?.[0]).toBe(rx);
        expect(result?.[1].source).toBe('^[a-z]+$');
    });

    it('should ignore invalid pattern sources', () => {
        expect(patternAttribute('[')).toBeUndefined();
    });
});

@Component({
    standalone: true,
    imports: [InputText, FormField],
    template: `<input pInputText [formField]="f.name" />`
})
class SignalFormsInputTextHost {
    model = signal({ name: 'John' });
    f = form(this.model, (p) => {
        required(p.name);
    });
}

@Component({
    standalone: true,
    imports: [Checkbox, FormField],
    template: `<p-checkbox [binary]="true" [formField]="f.accept" />`
})
class SignalFormsCheckboxHost {
    model = signal({ accept: false });
    f = form(this.model);
}

@Component({
    standalone: true,
    imports: [InputMask, FormField],
    template: `<p-inputmask [formField]="f.code" />`
})
class SignalFormsInputMaskHost {
    model = signal({ code: '' });
    f = form(this.model, (p) => {
        required(p.code);
        minLength(p.code, 2);
        maxLength(p.code, 5);
        pattern(p.code, /^\d+$/);
    });
}

@Component({
    standalone: true,
    imports: [InputMask],
    template: `<p-inputmask [pattern]="rx" />`
})
class ManualPatternHost {
    rx: string | RegExp = '^[a-z]+$';
}

describe('Signal Forms integration', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()]
        });
    });

    describe('native input host (pInputText)', () => {
        let fixture: ComponentFixture<SignalFormsInputTextHost>;
        let host: SignalFormsInputTextHost;
        let inputEl: HTMLInputElement;

        beforeEach(async () => {
            fixture = TestBed.createComponent(SignalFormsInputTextHost);
            host = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();
            inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
        });

        it('should render the field value', () => {
            expect(inputEl.value).toBe('John');
        });

        it('should update the view when the field value changes', async () => {
            host.f.name().value.set('Jane');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(inputEl.value).toBe('Jane');
        });

        it('should update the model when the user types', async () => {
            inputEl.value = 'typed';
            inputEl.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            expect(host.model().name).toBe('typed');
        });

        it('should bind the invalid state to the pInputText directive', async () => {
            const directive = fixture.debugElement.query(By.directive(InputText)).injector.get(InputText);
            host.f.name().value.set('');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(host.f.name().invalid()).toBe(true);
            expect(directive.invalid()).toBe(true);
        });
    });

    describe('checkbox host (FormCheckboxControl-style value via CVA)', () => {
        let fixture: ComponentFixture<SignalFormsCheckboxHost>;
        let host: SignalFormsCheckboxHost;

        beforeEach(async () => {
            fixture = TestBed.createComponent(SignalFormsCheckboxHost);
            host = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should update the model when the checkbox is toggled', async () => {
            const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
            inputEl.click();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(host.model().accept).toBe(true);
        });

        it('should reflect programmatic field value changes', async () => {
            host.f.accept().value.set(true);
            fixture.detectChanges();
            await fixture.whenStable();
            const checkbox = fixture.debugElement.query(By.directive(Checkbox)).componentInstance as Checkbox;
            expect(checkbox.checked()).toBe(true);
        });
    });

    describe('input mask host (schema constraints binding)', () => {
        let fixture: ComponentFixture<SignalFormsInputMaskHost>;
        let host: SignalFormsInputMaskHost;
        let mask: InputMask;

        beforeEach(async () => {
            fixture = TestBed.createComponent(SignalFormsInputMaskHost);
            host = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();
            mask = fixture.debugElement.query(By.directive(InputMask)).componentInstance;
        });

        it('should bind required from the schema', () => {
            expect(mask.required()).toBe(true);
        });

        it('should bind minLength/maxLength from the schema', () => {
            expect(mask.$minLength()).toBe(2);
            expect(mask.$maxLength()).toBe(5);
        });

        it('should bind pattern from the schema as a RegExp array', () => {
            const patterns = mask.pattern();
            expect(patterns?.length).toBe(1);
            expect(patterns?.[0] instanceof RegExp).toBe(true);
            expect(patterns?.[0].source).toBe('^\\d+$');
            expect(mask.$patternAttr()).toBe('^\\d+$');
        });

        it('should render the maxlength attribute on the native input', () => {
            const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
            expect(inputEl.getAttribute('maxlength')).toBe('5');
        });

        it('should bind the invalid and touched states', async () => {
            expect(mask.invalid()).toBe(true);
            expect(mask.touched()).toBeFalsy();

            const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
            inputEl.dispatchEvent(new Event('focus'));
            inputEl.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            await fixture.whenStable();

            expect(host.f.code().touched()).toBe(true);
            expect(mask.touched()).toBe(true);
        });

        it('should expose the field validation errors through the errors input', async () => {
            expect(mask.errors()?.some((error: any) => error.kind === 'required')).toBe(true);
        });
    });

    describe('manual pattern binding (types)', () => {
        it('should accept a string pattern', async () => {
            const fixture = TestBed.createComponent(ManualPatternHost);
            fixture.detectChanges();
            await fixture.whenStable();
            const mask = fixture.debugElement.query(By.directive(InputMask)).componentInstance as InputMask;
            expect(mask.pattern()?.[0].source).toBe('^[a-z]+$');
            expect(mask.$patternAttr()).toBe('^[a-z]+$');
        });

        it('should accept a RegExp pattern', async () => {
            const fixture = TestBed.createComponent(ManualPatternHost);
            fixture.componentInstance.rx = /^\d{3}$/;
            fixture.detectChanges();
            await fixture.whenStable();
            const mask = fixture.debugElement.query(By.directive(InputMask)).componentInstance as InputMask;
            expect(mask.pattern()?.[0].source).toBe('^\\d{3}$');
        });
    });
});
