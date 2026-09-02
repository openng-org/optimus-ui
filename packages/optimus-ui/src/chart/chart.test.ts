import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UIChart } from './chart';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [UIChart],
    template: `<p-chart type="bar" [data]="data" [options]="options" [width]="width" [height]="height" [ariaLabel]="ariaLabel"></p-chart>`
})
class TestBasicChartComponent {
    data: any = {
        labels: ['A', 'B', 'C'],
        datasets: [{ label: 'Test', data: [1, 2, 3] }]
    };
    options: any = { animation: false };
    width = '300';
    height = '150';
    ariaLabel = 'Test chart';
}

describe('UIChart', () => {
    let component: TestBasicChartComponent;
    let fixture: ComponentFixture<TestBasicChartComponent>;
    let chartInstance: UIChart;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestBasicChartComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicChartComponent);
        component = fixture.componentInstance;
        chartInstance = fixture.debugElement.query(By.directive(UIChart)).componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create and initialize the chart after the first render', () => {
        expect(chartInstance).toBeTruthy();
        expect(chartInstance.initialized).toBe(true);
        expect(chartInstance.chart).toBeTruthy();
    });

    it('should render the canvas with aria attributes and dimensions', () => {
        const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement as HTMLCanvasElement;
        expect(canvas.getAttribute('aria-label')).toBe('Test chart');
        expect(canvas.getAttribute('role')).toBe('img');
    });

    it('should expose the canvas through getCanvas', () => {
        const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
        expect(chartInstance.getCanvas()).toBe(canvas);
    });

    it('should recreate the chart when data changes', async () => {
        const firstChart = chartInstance.chart;

        component.data = {
            labels: ['X', 'Y'],
            datasets: [{ label: 'Changed', data: [5, 6] }]
        };
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();

        expect(chartInstance.chart).toBeTruthy();
        expect(chartInstance.chart).not.toBe(firstChart);
        expect(chartInstance.data().labels).toEqual(['X', 'Y']);
    });

    it('should recreate the chart when options change', async () => {
        const firstChart = chartInstance.chart;

        component.options = { animation: false, responsive: false };
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();

        expect(chartInstance.chart).toBeTruthy();
        expect(chartInstance.chart).not.toBe(firstChart);
    });

    it('should refresh without recreating the chart', () => {
        const firstChart = chartInstance.chart;
        chartInstance.refresh();
        expect(chartInstance.chart).toBe(firstChart);
    });

    it('should destroy the chart on component destroy', () => {
        expect(chartInstance.chart).toBeTruthy();
        fixture.destroy();
        expect(chartInstance.chart).toBeNull();
        expect(chartInstance.initialized).toBe(false);
    });
});
