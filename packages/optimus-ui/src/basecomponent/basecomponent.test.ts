import { DOCUMENT } from '@angular/common';
import { Component, inject, Injectable, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Theme, updatePreset } from '@openng/optimus-ui-styled';
import { Base, BaseStyle } from '@openng/optimus-ui/base';
import { provideOptimus } from '@openng/optimus-ui/config';
import { UseStyle } from '@openng/optimus-ui/usestyle';
import { BaseComponent, PARENT_INSTANCE } from './basecomponent';

@Injectable()
class StyleTestStyle extends BaseStyle {
    name = 'styletest';

    css = `.p-styletest { color: dt('styletest.color'); }`;

    classes = {
        root: 'p-styletest'
    };
}

@Component({
    selector: 'p-styletest',
    standalone: true,
    template: '<ng-content />',
    providers: [StyleTestStyle, { provide: PARENT_INSTANCE, useExisting: StyleTest }],
    host: {
        '[class]': "cx('root')"
    }
})
class StyleTest extends BaseComponent {
    componentName = 'StyleTest';

    _componentStyle = inject(StyleTestStyle);
}

@Component({
    selector: 'p-styletest-part',
    standalone: true,
    template: ''
})
class StyleTestPart extends BaseComponent {
    componentName = 'StyleTestPart';
}

@Component({
    standalone: true,
    imports: [StyleTest, StyleTestPart],
    template: `
        <p-styletest>
            <p-styletest-part />
        </p-styletest>
    `
})
class TestHostComponent {}

const otherDocument = document.implementation.createHTMLDocument();

// Renders the component into another document, like another application in the same realm (e.g. SSR). Only the
// component's own style uses the provided `UseStyle`; the base styles come from root services and stay in `document`.
@Component({
    standalone: true,
    imports: [StyleTest],
    template: '<p-styletest />',
    providers: [{ provide: DOCUMENT, useValue: otherDocument }, UseStyle]
})
class OtherDocumentHostComponent {}

const styleText = (name: string, doc: Document = document) => doc.head.querySelector(`style[data-optimus-style-id="${name}"]`)?.textContent ?? '';

describe('BaseComponent', () => {
    describe('$style', () => {
        let host: StyleTest;
        let part: StyleTestPart;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestHostComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(TestHostComponent);
            await fixture.whenStable();

            host = fixture.debugElement.query(By.directive(StyleTest)).componentInstance;
            part = fixture.debugElement.query(By.directive(StyleTestPart)).componentInstance;
        });

        it('should return the same object while its parts are unchanged', () => {
            const style = host.$style;

            expect(style.name).toBe('styletest');
            expect(style.classes).toBe(host._componentStyle.classes);
            expect(host.$style).toBe(style);

            expect(part.$style.classes).toBe(style.classes);
            expect(part.$style).toBe(part.$style);
        });

        it('should rebuild the merged object when the component style or the host style changes', () => {
            const style = host.$style;
            const partStyle = part.$style;
            const classes = { root: 'p-styletest-changed' };

            host._componentStyle = { ...host._componentStyle, classes } as StyleTestStyle;

            expect(host.$style).not.toBe(style);
            expect(host.$style.classes).toBe(classes);
            expect(part.$style).not.toBe(partStyle);
            expect(part.$style.classes).toBe(classes);
        });
    });

    describe('style loading', () => {
        const createStyleTest = async (): Promise<ComponentFixture<StyleTest>> => {
            const fixture = TestBed.createComponent(StyleTest);
            await fixture.whenStable();

            return fixture;
        };

        const setPrefix = (prefix: string) => Theme.setOptions({ ...Theme.getOptions(), prefix });

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [StyleTest],
                providers: [
                    provideZonelessChangeDetection(),
                    provideOptimus({
                        theme: {
                            preset: { components: { styletest: { color: 'red' } } },
                            options: { prefix: 'p' }
                        }
                    })
                ]
            }).compileComponents();
        });

        afterEach(() => {
            setPrefix('p');
        });

        it('should not reload the shared styles for every new instance', async () => {
            await createStyleTest();

            const clearLoadedStyleNames = vi.spyOn(Base, 'clearLoadedStyleNames');
            const clearLoadedThemeStyleNames = vi.spyOn(Theme, 'clearLoadedStyleNames');
            const use = vi.spyOn(TestBed.inject(UseStyle), 'use');

            await createStyleTest();
            await createStyleTest();

            const loadedNames = use.mock.calls.map(([, options]) => options?.name);

            expect(clearLoadedStyleNames).not.toHaveBeenCalled();
            expect(clearLoadedThemeStyleNames).not.toHaveBeenCalled();
            expect(loadedNames).not.toContain('base');
            expect(loadedNames).not.toContain('styletest');
            expect(loadedNames).not.toContain('styletest-variables');
            expect(Base.isStyleNameLoaded('base')).toBe(true);
            expect(Base.isStyleNameLoaded('styletest')).toBe(true);
        });

        it('should load the styles again for a component in another document', async () => {
            await createStyleTest();

            const fixture = TestBed.createComponent(OtherDocumentHostComponent);
            await fixture.whenStable();

            expect(styleText('styletest', otherDocument)).toContain('--p-styletest-color');
            expect(styleText('styletest-variables', otherDocument)).toContain('red');
        });

        it('should reload the styles of existing components when the theme changes', async () => {
            await createStyleTest();

            expect(styleText('base')).toContain('--p-scrollbar-width');
            expect(styleText('styletest')).toContain('--p-styletest-color');
            expect(styleText('styletest-variables')).toContain('red');

            setPrefix('x');

            expect(styleText('base')).toContain('--x-scrollbar-width');
            expect(styleText('styletest')).toContain('--x-styletest-color');
            expect(styleText('styletest-variables')).toContain('--x-styletest-color');

            updatePreset({ components: { styletest: { color: 'blue' } } });

            expect(styleText('styletest-variables')).toContain('blue');
            expect(styleText('styletest-variables')).not.toContain('red');
        });

        it('should load the current styles for components created after a theme change', async () => {
            const fixture = await createStyleTest();

            fixture.destroy();
            setPrefix('x');

            // no component listened to the change, so the styles are still the old ones
            expect(styleText('styletest')).toContain('--p-styletest-color');

            await createStyleTest();

            expect(styleText('base')).toContain('--x-scrollbar-width');
            expect(styleText('styletest')).toContain('--x-styletest-color');
            expect(styleText('styletest-variables')).toContain('--x-styletest-color');
        });

        it('should forget the loaded style names when the application is destroyed', async () => {
            await createStyleTest();

            expect(Base.isStyleNameLoaded('styletest')).toBe(true);

            TestBed.resetTestingModule();

            expect(Base.getLoadedStyleNames().size).toBe(0);
        });
    });

    describe('pass-through hooks', () => {
        it('should run the hooks of the component pass-through options', async () => {
            const hook = vi.fn();

            await TestBed.configureTestingModule({
                imports: [StyleTest],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const fixture = TestBed.createComponent(StyleTest);
            fixture.componentRef.setInput('pt', { hooks: { onAfterViewInit: hook } });
            await fixture.whenStable();

            expect(hook).toHaveBeenCalled();
        });

        it('should run the hooks of the global pass-through config', async () => {
            const hook = vi.fn();

            await TestBed.configureTestingModule({
                imports: [StyleTest],
                providers: [provideZonelessChangeDetection(), provideOptimus({ pt: { styletest: { hooks: { onAfterViewInit: hook } } } })]
            }).compileComponents();

            const fixture = TestBed.createComponent(StyleTest);
            await fixture.whenStable();

            expect(hook).toHaveBeenCalled();
        });
    });
});
