import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, signal, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DataView } from './dataview';
import { SharedModule } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    standalone: true,
    imports: [DataView, PaginatorModule, SharedModule],
    template: `
        <p-dataview
            [value]="products"
            [paginator]="paginator"
            [rows]="rows"
            [totalRecords]="totalRecords"
            [pageLinks]="pageLinks"
            [rowsPerPageOptions]="rowsPerPageOptions"
            [paginatorPosition]="paginatorPosition"
            [paginatorStyleClass]="paginatorStyleClass"
            [alwaysShowPaginator]="alwaysShowPaginator"
            [paginatorDropdownAppendTo]="paginatorDropdownAppendTo"
            [paginatorDropdownScrollHeight]="paginatorDropdownScrollHeight"
            [currentPageReportTemplate]="currentPageReportTemplate"
            [showCurrentPageReport]="showCurrentPageReport"
            [showJumpToPageDropdown]="showJumpToPageDropdown"
            [showFirstLastIcon]="showFirstLastIcon"
            [showPageLinks]="showPageLinks"
            [lazy]="lazy"
            [lazyLoadOnInit]="lazyLoadOnInit"
            [emptyMessage]="emptyMessage"
            [gridStyleClass]="gridStyleClass"
            [trackBy]="trackBy"
            [filterBy]="filterBy"
            [filterLocale]="filterLocale"
            [loading]="loading"
            [loadingIcon]="loadingIcon"
            [first]="first"
            [sortField]="sortField"
            [sortOrder]="sortOrder"
            [layout]="layout"
            (onLazyLoad)="onLazyLoadEvent($event)"
            (onPage)="onPageEvent($event)"
            (onSort)="onSortEvent($event)"
            (onChangeLayout)="onChangeLayoutEvent($event)"
        >
            <ng-template #list let-items>
                <div class="list-container">
                    @for (item of items; track item) {
                        <div class="list-item">{{ item.name }} - {{ item.price }}</div>
                    }
                </div>
            </ng-template>
            <ng-template #grid let-items>
                <div class="grid-container">
                    @for (item of items; track item) {
                        <div class="grid-item">{{ item.name }} - {{ item.price }}</div>
                    }
                </div>
            </ng-template>
        </p-dataview>
    `
})
class TestBasicDataViewComponent {
    private _products = signal<any[]>([
        { id: 1, name: 'Product 1', price: 100, category: 'Category A', inventoryStatus: 'INSTOCK' },
        { id: 2, name: 'Product 2', price: 200, category: 'Category B', inventoryStatus: 'LOWSTOCK' },
        { id: 3, name: 'Product 3', price: 300, category: 'Category A', inventoryStatus: 'OUTOFSTOCK' },
        { id: 4, name: 'Product 4', price: 400, category: 'Category B', inventoryStatus: 'INSTOCK' },
        { id: 5, name: 'Product 5', price: 500, category: 'Category C', inventoryStatus: 'INSTOCK' }
    ]);
    get products() {
        return this._products();
    }
    set products(v: any[]) {
        this._products.set(v);
    }
    private _paginator = signal<boolean>(false);
    get paginator() {
        return this._paginator();
    }
    set paginator(v: boolean) {
        this._paginator.set(v);
    }
    private _rows = signal<number>(3);
    get rows() {
        return this._rows();
    }
    set rows(v: number) {
        this._rows.set(v);
    }
    private _totalRecords = signal<number | undefined>(undefined);
    get totalRecords() {
        return this._totalRecords();
    }
    set totalRecords(v: number | undefined) {
        this._totalRecords.set(v);
    }
    private _pageLinks = signal<number>(5);
    get pageLinks() {
        return this._pageLinks();
    }
    set pageLinks(v: number) {
        this._pageLinks.set(v);
    }
    private _rowsPerPageOptions = signal<any[]>([3, 5, 10]);
    get rowsPerPageOptions() {
        return this._rowsPerPageOptions();
    }
    set rowsPerPageOptions(v: any[]) {
        this._rowsPerPageOptions.set(v);
    }
    private _paginatorPosition = signal<'top' | 'bottom' | 'both'>('bottom');
    get paginatorPosition() {
        return this._paginatorPosition();
    }
    set paginatorPosition(v: 'top' | 'bottom' | 'both') {
        this._paginatorPosition.set(v);
    }
    private _paginatorStyleClass = signal<string | undefined>(undefined);
    get paginatorStyleClass() {
        return this._paginatorStyleClass();
    }
    set paginatorStyleClass(v: string | undefined) {
        this._paginatorStyleClass.set(v);
    }
    private _alwaysShowPaginator = signal<boolean>(true);
    get alwaysShowPaginator() {
        return this._alwaysShowPaginator();
    }
    set alwaysShowPaginator(v: boolean) {
        this._alwaysShowPaginator.set(v);
    }
    private _paginatorDropdownAppendTo = signal<any>(undefined);
    get paginatorDropdownAppendTo() {
        return this._paginatorDropdownAppendTo();
    }
    set paginatorDropdownAppendTo(v: any) {
        this._paginatorDropdownAppendTo.set(v);
    }
    private _paginatorDropdownScrollHeight = signal<string>('200px');
    get paginatorDropdownScrollHeight() {
        return this._paginatorDropdownScrollHeight();
    }
    set paginatorDropdownScrollHeight(v: string) {
        this._paginatorDropdownScrollHeight.set(v);
    }
    private _currentPageReportTemplate = signal<string>('{currentPage} of {totalPages}');
    get currentPageReportTemplate() {
        return this._currentPageReportTemplate();
    }
    set currentPageReportTemplate(v: string) {
        this._currentPageReportTemplate.set(v);
    }
    private _showCurrentPageReport = signal<boolean>(false);
    get showCurrentPageReport() {
        return this._showCurrentPageReport();
    }
    set showCurrentPageReport(v: boolean) {
        this._showCurrentPageReport.set(v);
    }
    private _showJumpToPageDropdown = signal<boolean>(false);
    get showJumpToPageDropdown() {
        return this._showJumpToPageDropdown();
    }
    set showJumpToPageDropdown(v: boolean) {
        this._showJumpToPageDropdown.set(v);
    }
    private _showFirstLastIcon = signal<boolean>(true);
    get showFirstLastIcon() {
        return this._showFirstLastIcon();
    }
    set showFirstLastIcon(v: boolean) {
        this._showFirstLastIcon.set(v);
    }
    private _showPageLinks = signal<boolean>(true);
    get showPageLinks() {
        return this._showPageLinks();
    }
    set showPageLinks(v: boolean) {
        this._showPageLinks.set(v);
    }
    private _lazy = signal<boolean>(false);
    get lazy() {
        return this._lazy();
    }
    set lazy(v: boolean) {
        this._lazy.set(v);
    }
    private _lazyLoadOnInit = signal<boolean>(true);
    get lazyLoadOnInit() {
        return this._lazyLoadOnInit();
    }
    set lazyLoadOnInit(v: boolean) {
        this._lazyLoadOnInit.set(v);
    }
    private _emptyMessage = signal<string>('No products found');
    get emptyMessage() {
        return this._emptyMessage();
    }
    set emptyMessage(v: string) {
        this._emptyMessage.set(v);
    }
    private _gridStyleClass = signal<string>('');
    get gridStyleClass() {
        return this._gridStyleClass();
    }
    set gridStyleClass(v: string) {
        this._gridStyleClass.set(v);
    }
    private _trackBy = signal<Function>((index: number, item: any) => item);
    get trackBy() {
        return this._trackBy();
    }
    set trackBy(v: Function) {
        this._trackBy.set(v);
    }
    private _filterBy = signal<string>('name,category');
    get filterBy() {
        return this._filterBy();
    }
    set filterBy(v: string) {
        this._filterBy.set(v);
    }
    private _filterLocale = signal<string | undefined>(undefined);
    get filterLocale() {
        return this._filterLocale();
    }
    set filterLocale(v: string | undefined) {
        this._filterLocale.set(v);
    }
    private _loading = signal<boolean>(false);
    get loading() {
        return this._loading();
    }
    set loading(v: boolean) {
        this._loading.set(v);
    }
    private _loadingIcon = signal<string | undefined>(undefined);
    get loadingIcon() {
        return this._loadingIcon();
    }
    set loadingIcon(v: string | undefined) {
        this._loadingIcon.set(v);
    }
    private _first = signal<number>(0);
    get first() {
        return this._first();
    }
    set first(v: number) {
        this._first.set(v);
    }
    private _sortField = signal<string | undefined>(undefined);
    get sortField() {
        return this._sortField();
    }
    set sortField(v: string | undefined) {
        this._sortField.set(v);
    }
    private _sortOrder = signal<number | undefined>(undefined);
    get sortOrder() {
        return this._sortOrder();
    }
    set sortOrder(v: number | undefined) {
        this._sortOrder.set(v);
    }
    private _layout = signal<'list' | 'grid'>('list');
    get layout() {
        return this._layout();
    }
    set layout(v: 'list' | 'grid') {
        this._layout.set(v);
    }

    lazyLoadEvent: any;
    pageEvent: any;
    sortEvent: any;
    changeLayoutEvent: any;

    onLazyLoadEvent(event: any) {
        this.lazyLoadEvent = event;
    }

    onPageEvent(event: any) {
        this.pageEvent = event;
    }

    onSortEvent(event: any) {
        this.sortEvent = event;
    }

    onChangeLayoutEvent(event: any) {
        this.changeLayoutEvent = event;
    }
}

@Component({
    standalone: true,
    imports: [DataView, PaginatorModule, SharedModule],
    template: `
        <p-dataview [value]="products">
            <p-header>
                <div class="custom-header">Custom Header Content</div>
            </p-header>
            <ng-template #list let-items>
                <div class="list-container">
                    @for (item of items; track item) {
                        <div class="list-item">
                            {{ item.name }}
                        </div>
                    }
                </div>
            </ng-template>
            <p-footer>
                <div class="custom-footer">Custom Footer Content</div>
            </p-footer>
        </p-dataview>
    `
})
class TestHeaderFooterDataViewComponent {
    products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 }
    ];
}

@Component({
    standalone: true,
    imports: [DataView, PaginatorModule, SharedModule],
    template: `
        <p-dataview [value]="products" [paginator]="true" [rows]="2">
            <ng-template #list let-items>
                <div class="list-container">
                    @for (item of items; track item) {
                        <div class="list-item">
                            {{ item.name }}
                        </div>
                    }
                </div>
            </ng-template>
            <ng-template #header>
                <div class="template-header">Template Header</div>
            </ng-template>
            <ng-template #footer>
                <div class="template-footer">Template Footer</div>
            </ng-template>
            <ng-template #emptymessage>
                <div class="empty-template">No data available</div>
            </ng-template>
            <ng-template #paginatorleft>
                <span class="paginator-left">Left Content</span>
            </ng-template>
            <ng-template #paginatorright>
                <span class="paginator-right">Right Content</span>
            </ng-template>
        </p-dataview>
    `
})
class TestTemplatesDataViewComponent {
    products: any[] = [];
}

@Component({
    standalone: true,
    imports: [DataView, PaginatorModule, SharedModule],
    template: `
        <p-dataview [value]="products()" [layout]="layout">
            <ng-template #list let-items>
                <div class="list-container">
                    @for (item of items; track item) {
                        <div class="list-item">List: {{ item.name }}</div>
                    }
                </div>
            </ng-template>
            <ng-template #grid let-items>
                <div class="grid-container">
                    @for (item of items; track item) {
                        <div class="grid-item">Grid: {{ item.name }}</div>
                    }
                </div>
            </ng-template>
        </p-dataview>
    `
})
class TestLayoutDataViewComponent {
    products = signal([
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' }
    ]);
    private _layout = signal<'list' | 'grid'>('list');
    get layout() {
        return this._layout();
    }
    set layout(v: 'list' | 'grid') {
        this._layout.set(v);
    }
}

describe('DataView', () => {
    let fixture: ComponentFixture<TestBasicDataViewComponent>;
    let component: TestBasicDataViewComponent;
    let dataview: DataView;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataView, PaginatorModule, SharedModule, TestBasicDataViewComponent, TestHeaderFooterDataViewComponent, TestTemplatesDataViewComponent, TestLayoutDataViewComponent, TestDynamicDataViewComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
        fixture = TestBed.createComponent(TestBasicDataViewComponent);
        component = fixture.componentInstance;
        dataview = fixture.debugElement.query(By.directive(DataView)).componentInstance;
        await fixture.whenStable();
    });

    describe('Component Initialization', () => {
        it('should create the component', () => {
            expect(dataview).toBeTruthy();
        });

        it('should have default values', () => {
            expect(dataview.pageLinks()).toBe(5);
            expect(dataview.paginatorPosition()).toBe('bottom');
            expect(dataview.alwaysShowPaginator()).toBe(true);
            expect(dataview.paginatorDropdownScrollHeight()).toBe('200px');
            expect(dataview.currentPageReportTemplate()).toBe('{currentPage} of {totalPages}');
            expect(dataview.showFirstLastIcon()).toBe(true);
            expect(dataview.showPageLinks()).toBe(true);
            expect(dataview.lazyLoadOnInit()).toBe(true);
            expect(dataview.emptyMessage()).toBe('No products found');
            expect(dataview.gridStyleClass()).toBe('' as any);
            expect(dataview.first()).toBe(0);
            expect(dataview.layout()).toBe('list');
        });

        it('should accept custom values', async () => {
            component.paginator = true;
            component.rows = 5;
            component.pageLinks = 3;
            component.paginatorPosition = 'top';
            component.layout = 'grid';
            component.emptyMessage = 'Custom empty message';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.paginator()).toBe(true);
            expect(dataview.rows()).toBe(5);
            expect(dataview.pageLinks()).toBe(3);
            expect(dataview.paginatorPosition()).toBe('top');
            expect(dataview.layout()).toBe('grid');
            expect(dataview.emptyMessage()).toBe('Custom empty message');
        });

        it('should initialize with provided value', () => {
            expect(dataview.value()).toEqual(component.products);
            expect(dataview.value()?.length).toBe(5);
        });

        it('should update totalRecords based on value when not in lazy mode', () => {
            expect(dataview.totalRecords()).toBe(5);
        });
    });

    describe('Public Methods', () => {
        it('should paginate programmatically', async () => {
            component.paginator = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const paginatorState = {
                first: 3,
                rows: 2,
                page: 1,
                pageCount: 3
            };

            vi.spyOn(dataview.onPage, 'emit');
            dataview.paginate(paginatorState);

            expect(dataview.first()).toBe(3);
            expect(dataview.rows()).toBe(2);
            expect(dataview.onPage.emit).toHaveBeenCalledWith({
                first: 3,
                rows: 2
            });
        });

        it('should sort data', async () => {
            component.sortField = 'price';
            component.sortOrder = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(dataview.onSort, 'emit');
            dataview.sort();

            expect(dataview.first()).toBe(0);
            expect(dataview.onSort.emit).toHaveBeenCalledWith({
                sortField: 'price',
                sortOrder: 1
            });

            const sortedValues = dataview.value();
            expect(sortedValues![0].price).toBe(100);
            expect(sortedValues![4].price).toBe(500);
        });

        it('should sort data in descending order', async () => {
            component.sortField = 'price';
            component.sortOrder = -1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.sort();

            const sortedValues = dataview.value();
            expect(sortedValues![0].price).toBe(500);
            expect(sortedValues![4].price).toBe(100);
        });

        it('should handle null values in sorting', async () => {
            component.products = [
                { id: 1, name: 'Product 1', price: null, category: 'Category A', inventoryStatus: 'INSTOCK' },
                { id: 2, name: 'Product 2', price: 200, category: 'Category B', inventoryStatus: 'INSTOCK' },
                { id: 3, name: 'Product 3', price: null, category: 'Category C', inventoryStatus: 'INSTOCK' },
                { id: 4, name: 'Product 4', price: 100, category: 'Category D', inventoryStatus: 'INSTOCK' }
            ] as any;
            component.sortField = 'price';
            component.sortOrder = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.sort();

            const sortedValues = dataview.value();
            expect(sortedValues![0].price).toBe(null);
            expect(sortedValues![1].price).toBe(null);
            expect(sortedValues![2].price).toBe(100);
            expect(sortedValues![3].price).toBe(200);
        });

        it('should check if data is empty', async () => {
            expect(dataview.$isEmpty()).toBe(false);

            component.products = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.$isEmpty()).toBe(true);
        });

        it('should filter data', async () => {
            component.filterBy = 'name,category';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.filter('Product 1');

            expect(dataview.filteredValue()).toBeTruthy();
            expect(dataview.filteredValue()!.length).toBe(1);
            expect(dataview.filteredValue()![0].name).toBe('Product 1');
        });

        it('should filter with different match modes', async () => {
            component.filterBy = 'name';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.filter('Product', 'contains');

            expect(dataview.filteredValue()).toBe(null);
        });

        it('should reset filteredValue when filter matches all items', async () => {
            component.filterBy = 'category';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.filter('Category');

            expect(dataview.filteredValue()).toBe(null);
        });

        it('should check if filter is active', async () => {
            component.filterBy = 'name';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Test hasFilter with valid filter value
            dataview.filterValue.set('test');
            expect(dataview.hasFilter()).toBe(true);

            // Test hasFilter returns falsy for null/undefined
            dataview.filterValue.set(null);
            expect(dataview.hasFilter()).toBeFalsy();
        });

        it('should create lazy load metadata', async () => {
            component.sortField = 'name';
            component.sortOrder = -1;
            component.rows = 5;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Set first after sort effect has settled (sort resets first to 0)
            dataview.first.set(10);

            const metadata = dataview.createLazyLoadMetadata();

            expect(metadata).toEqual({
                first: 10,
                rows: 5,
                sortField: 'name',
                sortOrder: -1
            });
        });

        it('should get blockable element', () => {
            const element = dataview.getBlockableElement();
            expect(element).toBeTruthy();
            expect(element).toBe(dataview.el.nativeElement.children[0]);
        });

        it('should update totalRecords', async () => {
            component.products = [
                { id: 1, name: 'Product 1', price: 100, category: 'Category A', inventoryStatus: 'INSTOCK' },
                { id: 2, name: 'Product 2', price: 200, category: 'Category B', inventoryStatus: 'INSTOCK' }
            ];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.totalRecords()).toBe(2);
        });
    });

    describe('Event Handling', () => {
        it('should emit onLazyLoad on init when lazy and lazyLoadOnInit are true', async () => {
            const lazyFixture = TestBed.createComponent(TestBasicDataViewComponent);
            const lazyComponent = lazyFixture.componentInstance;
            lazyComponent.lazy = true;

            vi.spyOn(lazyComponent, 'onLazyLoadEvent');
            lazyFixture.changeDetectorRef.markForCheck();
            await lazyFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(lazyComponent.onLazyLoadEvent).toHaveBeenCalled();
        });

        it('should not emit onLazyLoad on init when lazyLoadOnInit is false', async () => {
            const lazyFixture = TestBed.createComponent(TestBasicDataViewComponent);
            const lazyComponent = lazyFixture.componentInstance;
            lazyComponent.lazy = true;
            lazyComponent.lazyLoadOnInit = false;

            vi.spyOn(lazyComponent, 'onLazyLoadEvent');
            lazyFixture.changeDetectorRef.markForCheck();
            await lazyFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(lazyComponent.onLazyLoadEvent).not.toHaveBeenCalled();
        });

        it('should emit onPage event when paginating', async () => {
            component.paginator = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(component, 'onPageEvent');

            dataview.paginate({ first: 3, rows: 2, page: 1, pageCount: 3 });

            expect(component.onPageEvent).toHaveBeenCalledWith({
                first: 3,
                rows: 2
            });
        });

        it('should emit onSort event when sorting', async () => {
            component.sortField = 'name';
            component.sortOrder = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(component, 'onSortEvent');

            dataview.sort();

            expect(component.onSortEvent).toHaveBeenCalledWith({
                sortField: 'name',
                sortOrder: 1
            });
        });

        it('should emit onChangeLayout event when layout changes', async () => {
            vi.spyOn(component, 'onChangeLayoutEvent');

            component.layout = 'grid';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(component.onChangeLayoutEvent).toHaveBeenCalledWith({
                layout: 'grid'
            });
        });

        it('should emit onLazyLoad when paginating in lazy mode', async () => {
            component.lazy = true;
            component.paginator = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(component, 'onLazyLoadEvent');

            dataview.paginate({ first: 3, rows: 2, page: 1, pageCount: 3 });

            expect(component.onLazyLoadEvent).toHaveBeenCalled();
        });

        it('should emit onLazyLoad when sorting in lazy mode', async () => {
            component.lazy = true;
            component.sortField = 'name';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            vi.spyOn(component, 'onLazyLoadEvent');

            dataview.sort();

            expect(component.onLazyLoadEvent).toHaveBeenCalled();
        });
    });

    describe('Template and Content Projection', () => {
        it('should render list template', () => {
            const listItems = fixture.debugElement.queryAll(By.css('.list-item'));
            expect(listItems.length).toBe(5);
            expect(listItems[0].nativeElement.textContent).toContain('Product 1 - 100');
        });

        it('should render grid template when layout is grid', async () => {
            component.layout = 'grid';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const gridItems = fixture.debugElement.queryAll(By.css('.grid-item'));
            expect(gridItems.length).toBe(5);
            expect(gridItems[0].nativeElement.textContent).toContain('Product 1 - 100');
        });

        it('should render header and footer content', async () => {
            const headerFooterFixture = TestBed.createComponent(TestHeaderFooterDataViewComponent);
            await headerFooterFixture.whenStable();

            const header = headerFooterFixture.debugElement.query(By.css('.custom-header'));
            const footer = headerFooterFixture.debugElement.query(By.css('.custom-footer'));

            expect(header).toBeTruthy();
            expect(header.nativeElement.textContent).toBe('Custom Header Content');
            expect(footer).toBeTruthy();
            expect(footer.nativeElement.textContent).toBe('Custom Footer Content');
        });

        it('should render template-based header and footer', async () => {
            const templateFixture = TestBed.createComponent(TestTemplatesDataViewComponent);
            await templateFixture.whenStable();

            const header = templateFixture.debugElement.query(By.css('.template-header'));
            const footer = templateFixture.debugElement.query(By.css('.template-footer'));

            expect(header).toBeTruthy();
            expect(header.nativeElement.textContent).toBe('Template Header');
            expect(footer).toBeTruthy();
            expect(footer.nativeElement.textContent).toBe('Template Footer');
        });

        it('should render empty message when no data', async () => {
            component.products = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const emptyMessage = fixture.debugElement.query(By.css('div'));
            const emptyMessageDiv = fixture.debugElement.queryAll(By.css('div')).find((div) => div.nativeElement.textContent && div.nativeElement.textContent.includes('No products found'));
            expect(emptyMessageDiv).toBeTruthy();
        });

        it('should render custom empty message template', async () => {
            const templateFixture = TestBed.createComponent(TestTemplatesDataViewComponent);
            await templateFixture.whenStable();

            const emptyTemplate = templateFixture.debugElement.query(By.css('.empty-template'));
            expect(emptyTemplate).toBeTruthy();
            expect(emptyTemplate.nativeElement.textContent).toBe('No data available');
        });

        it('should switch between list and grid layouts', async () => {
            const layoutFixture = TestBed.createComponent(TestLayoutDataViewComponent);
            const layoutComponent = layoutFixture.componentInstance;
            await layoutFixture.whenStable();

            let listItems = layoutFixture.debugElement.queryAll(By.css('.list-item'));
            expect(listItems.length).toBe(3);
            expect(listItems[0].nativeElement.textContent).toContain('List: Product 1');

            layoutComponent.layout = 'grid';
            layoutFixture.changeDetectorRef.markForCheck();
            await layoutFixture.whenStable();

            const gridItems = layoutFixture.debugElement.queryAll(By.css('.grid-item'));
            expect(gridItems.length).toBe(3);
            expect(gridItems[0].nativeElement.textContent).toContain('Grid: Product 1');
        });

        it('should work with signals for value', async () => {
            const layoutFixture = TestBed.createComponent(TestLayoutDataViewComponent);
            const layoutComponent = layoutFixture.componentInstance;
            await layoutFixture.whenStable();

            const items = layoutFixture.debugElement.queryAll(By.css('.list-item'));
            expect(items.length).toBe(3);

            layoutComponent.products.set([
                { id: 1, name: 'Updated Product 1' },
                { id: 2, name: 'Updated Product 2' }
            ]);
            layoutFixture.changeDetectorRef.markForCheck();
            await layoutFixture.whenStable();

            const updatedItems = layoutFixture.debugElement.queryAll(By.css('.list-item'));
            expect(updatedItems.length).toBe(2);
            expect(updatedItems[0].nativeElement.textContent).toContain('Updated Product 1');
        });
    });

    describe('Pagination', () => {
        beforeEach(async () => {
            component.paginator = true;
            component.rows = 2;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should render paginator when enabled', () => {
            const paginator = fixture.debugElement.query(By.css('p-paginator'));
            expect(paginator).toBeTruthy();
        });

        it('should render paginator at bottom by default', () => {
            const content = fixture.debugElement.query(By.css('[class*="content"]'));
            const paginator = content.nativeElement.nextElementSibling;
            expect(paginator.tagName.toLowerCase()).toBe('p-paginator');
        });

        it('should render paginator at top when position is top', async () => {
            component.paginatorPosition = 'top';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const content = fixture.debugElement.query(By.css('[class*="content"]'));
            const paginator = content.nativeElement.previousElementSibling;
            expect(paginator.tagName.toLowerCase()).toBe('p-paginator');
        });

        it('should render paginator at both positions when position is both', async () => {
            component.paginatorPosition = 'both';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const paginators = fixture.debugElement.queryAll(By.css('p-paginator'));
            expect(paginators.length).toBe(2);
        });

        it('should slice data based on pagination', () => {
            const items = fixture.debugElement.queryAll(By.css('.list-item'));
            expect(items.length).toBe(2);
            expect(items[0].nativeElement.textContent).toContain('Product 1');
            expect(items[1].nativeElement.textContent).toContain('Product 2');
        });

        it('should update displayed data when page changes', async () => {
            dataview.paginate({ first: 2, rows: 2, page: 1, pageCount: 3 });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const items = fixture.debugElement.queryAll(By.css('.list-item'));
            expect(items.length).toBe(2);
            expect(items[0].nativeElement.textContent).toContain('Product 3');
            expect(items[1].nativeElement.textContent).toContain('Product 4');
        });

        it('should pass correct props to paginator', async () => {
            component.rowsPerPageOptions = [2, 5, 10];
            component.showCurrentPageReport = true;
            component.currentPageReportTemplate = 'Page {currentPage} of {totalPages}';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const paginator = fixture.debugElement.query(By.css('p-paginator')).componentInstance;
            expect(paginator.rows()).toBe(2);
            expect(paginator.totalRecords()).toBe(5);
            expect(paginator.rowsPerPageOptions()).toEqual([2, 5, 10]);
            expect(paginator.showCurrentPageReport()).toBe(true);
        });

        it('should render custom paginator templates', async () => {
            const templateFixture = TestBed.createComponent(TestTemplatesDataViewComponent);
            templateFixture.componentInstance.products = [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
                { id: 3, name: 'Product 3' },
                { id: 4, name: 'Product 4' },
                { id: 5, name: 'Product 5' }
            ];
            templateFixture.changeDetectorRef.markForCheck();
            await templateFixture.whenStable();

            // Check if paginator templates are defined in component
            const templateDataView = templateFixture.debugElement.query(By.directive(DataView)).componentInstance;
            expect(templateDataView.paginatorleft()).toBeTruthy();
            expect(templateDataView.paginatorright()).toBeTruthy();
        });
    });

    describe('Sorting and Filtering', () => {
        it('should sort string fields correctly', async () => {
            component.sortField = 'name';
            component.sortOrder = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.sort();

            const sortedValues = dataview.value();
            expect(sortedValues![0].name).toBe('Product 1');
            expect(sortedValues![4].name).toBe('Product 5');
        });

        it('should sort number fields correctly', async () => {
            component.sortField = 'price';
            component.sortOrder = -1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.sort();

            const sortedValues = dataview.value();
            expect(sortedValues![0].price).toBe(500);
            expect(sortedValues![4].price).toBe(100);
        });

        it('should filter across multiple fields', async () => {
            component.filterBy = 'name,category';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.filter('Category A');

            expect(dataview.filteredValue()).toBeTruthy();
            expect(dataview.filteredValue()!.length).toBe(2);
        });

        it('should update totalRecords when filtering with pagination', async () => {
            component.paginator = true;
            component.filterBy = 'name';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.filter('Product 1');

            expect(dataview.totalRecords()).toBe(1);
            expect(dataview.first()).toBe(0);
        });

        it('should reset first index when sorting', async () => {
            component.first = 2;
            component.sortField = 'name';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.sort();

            expect(dataview.first()).toBe(0);
        });

        it('should apply filter after sorting', async () => {
            component.sortField = 'price';
            component.sortOrder = 1;
            component.filterBy = 'category';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.sort();
            dataview.filter('Category A');

            expect(dataview.filteredValue()).toBeTruthy();
            expect(dataview.filteredValue()!.length).toBe(2);
            expect(dataview.filteredValue()![0].price).toBe(100);
            expect(dataview.filteredValue()![1].price).toBe(300);
        });
    });

    describe('Loading State', () => {
        it('should show loading indicator when loading is true', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const loadingDiv = fixture.debugElement.query(By.css('[class*="loading"]'));
            expect(loadingDiv).toBeTruthy();
        });

        it('should show custom loading icon', async () => {
            component.loading = true;
            component.loadingIcon = ' pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const loadingIcon = fixture.debugElement.query(By.css('i'));
            expect(loadingIcon).toBeTruthy();
            expect(loadingIcon.nativeElement.className).toContain('pi-spinner');
        });

        it('should hide content when loading', async () => {
            component.loading = true;
            component.products = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const emptyMessage = fixture.debugElement.query(By.css('[class*="emptyMessage"]'));
            expect(emptyMessage).toBeFalsy();
        });

        it('should show default loading icon when no custom icon specified', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const svg = fixture.debugElement.query(By.css('svg')) || fixture.debugElement.query(By.css('[data-p-icon="spinner"]'));
            expect(svg).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined values gracefully', async () => {
            component.products = null as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.$isEmpty()).toBe(true);
            expect(async () => await fixture.whenStable()).not.toThrow();
        });

        it('should handle empty array', async () => {
            component.products = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.$isEmpty()).toBe(true);
            const emptyMessageDivs = fixture.debugElement.queryAll(By.css('div'));
            const emptyMessage = emptyMessageDivs.find((div) => div.nativeElement.textContent && div.nativeElement.textContent.includes('No products found'));
            expect(emptyMessage).toBeTruthy();
        });

        it('should handle rapid layout changes', async () => {
            let changeCount = 0;
            dataview.onChangeLayout.subscribe(() => changeCount++);

            component.layout = 'grid';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            component.layout = 'list';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            component.layout = 'grid';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(changeCount).toBe(3);
        });

        it('should handle filtering with empty filterBy', async () => {
            component.filterBy = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => dataview.filter('test')).not.toThrow();
        });

        it('should handle sorting without sortField', async () => {
            component.sortField = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => dataview.sort()).not.toThrow();
        });

        it('should handle large datasets efficiently', async () => {
            const largeData: any[] = [];
            for (let i = 0; i < 1000; i++) {
                largeData.push({
                    id: i,
                    name: `Product ${i}`,
                    price: Math.random() * 1000,
                    category: `Category ${i % 10}`
                });
            }

            const startTime = performance.now();
            component.products = largeData;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(1000);
            expect(dataview.value()?.length).toBe(1000);
        });

        it('should maintain filter when value changes', async () => {
            component.filterBy = 'name';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            dataview.filter('Product 1');
            expect(dataview.filteredValue()?.length).toBe(1);

            component.products = [...component.products, { id: 6, name: 'Product 10', price: 600, category: 'Category D', inventoryStatus: 'INSTOCK' }];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.filteredValue()).toBeTruthy();
        });

        it('should handle undefined in template context', async () => {
            component.products = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(async () => await fixture.whenStable()).not.toThrow();
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply correct root class', async () => {
            const dataviewElement = fixture.debugElement.query(By.css('p-dataview'));
            expect(dataviewElement.nativeElement.className).toContain('p-dataview');
        });

        it('should apply gridStyleClass', async () => {
            component.gridStyleClass = 'custom-grid-class';
            component.layout = 'grid';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.gridStyleClass()).toBe('custom-grid-class');
        });

        it('should apply correct classes for loading state', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const loadingDiv = fixture.debugElement.query(By.css('[class*="loading"]'));
            expect(loadingDiv).toBeTruthy();
        });

        it('should apply paginator style class', async () => {
            component.paginator = true;
            component.paginatorStyleClass = 'custom-paginator';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.paginatorStyleClass).toBe('custom-paginator');
        });
    });

    describe('Lifecycle and Cleanup', () => {
        it('should clean up on destroy without errors', () => {
            expect(() => fixture.destroy()).not.toThrow();
        });

        it('should handle onChanges for value', async () => {
            const newProducts = [{ id: 10, name: 'New Product', price: 1000, category: 'New Category', inventoryStatus: 'INSTOCK' }];

            component.products = newProducts;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dataview.value()).toEqual(newProducts);
            expect(dataview.totalRecords()).toBe(1);
        });

        it('should trigger lazy load correctly when initialized', async () => {
            const lazyFixture = TestBed.createComponent(TestBasicDataViewComponent);
            const lazyComponent = lazyFixture.componentInstance;

            lazyComponent.lazy = true;
            lazyFixture.changeDetectorRef.markForCheck();
            await lazyFixture.whenStable();

            const lazyDataview = lazyFixture.debugElement.query(By.directive(DataView)).componentInstance;

            vi.spyOn(lazyDataview.onLazyLoad, 'emit');

            lazyComponent.sortField = 'name';
            lazyFixture.changeDetectorRef.markForCheck();
            await lazyFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(lazyDataview.onLazyLoad.emit).toHaveBeenCalled();
        });
    });

    describe('TrackBy Function', () => {
        it('should use default trackBy function', () => {
            const item = { id: 1, name: 'Test' };
            const result = dataview.trackBy()(0, item);
            expect(result).toBe(item);
        });

        it('should use custom trackBy function', async () => {
            const customTrackBy = (index: number, item: any) => item.id;
            component.trackBy = customTrackBy;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const item = { id: 1, name: 'Test' };
            const result = dataview.trackBy()(0, item);
            expect(result).toBe(1);
        });
    });

    describe('Empty Message Label', () => {
        it('should return custom empty message when provided', () => {
            expect(dataview.emptyMessageLabel()).toBe('No products found');
        });

        it('should return translation when no custom message', async () => {
            component.emptyMessage = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.emptyMessageLabel()).toBeTruthy();
        });
    });

    describe('Input Properties Tests', () => {
        beforeEach(async () => {
            await fixture.whenStable();
        });

        it('should handle paginator property changes', async () => {
            expect(dataview.paginator()).toBe(false);

            component.paginator = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.paginator()).toBe(true);
        });

        it('should handle rows property changes', async () => {
            expect(dataview.rows()).toBe(3);

            component.rows = 5;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.rows()).toBe(5);
        });

        it('should handle totalRecords property', async () => {
            expect(dataview.totalRecords()).toBe(5); // auto-calculated from value

            component.totalRecords = 100;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.totalRecords()).toBe(100);
        });

        it('should handle pageLinks property', async () => {
            expect(dataview.pageLinks()).toBe(5);

            component.pageLinks = 7;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.pageLinks()).toBe(7);
        });

        it('should handle rowsPerPageOptions property', async () => {
            const options = [5, 10, 20, { showAll: 'All' }];
            component.rowsPerPageOptions = options;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.rowsPerPageOptions()).toEqual(options);
        });

        it('should handle paginatorPosition property', async () => {
            expect(dataview.paginatorPosition()).toBe('bottom');

            component.paginatorPosition = 'top';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.paginatorPosition()).toBe('top');
        });

        it('should handle paginatorStyleClass property', async () => {
            component.paginatorStyleClass = 'custom-paginator';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.paginatorStyleClass()).toBe('custom-paginator');
        });

        it('should handle alwaysShowPaginator property', async () => {
            expect(dataview.alwaysShowPaginator()).toBe(true);

            component.alwaysShowPaginator = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.alwaysShowPaginator()).toBe(false);
        });

        it('should handle paginatorDropdownAppendTo property', async () => {
            const element = document.createElement('div');
            component.paginatorDropdownAppendTo = element;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.paginatorDropdownAppendTo()).toBe(element);
        });

        it('should handle paginatorDropdownScrollHeight property', async () => {
            expect(dataview.paginatorDropdownScrollHeight()).toBe('200px');

            component.paginatorDropdownScrollHeight = '300px';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.paginatorDropdownScrollHeight()).toBe('300px');
        });

        it('should handle currentPageReportTemplate property', async () => {
            const template = 'Page {currentPage} of {totalPages}';
            component.currentPageReportTemplate = template;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.currentPageReportTemplate()).toBe(template);
        });

        it('should handle showCurrentPageReport property', async () => {
            expect(dataview.showCurrentPageReport()).toBe(false);

            component.showCurrentPageReport = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.showCurrentPageReport()).toBe(true);
        });

        it('should handle showJumpToPageDropdown property', async () => {
            expect(dataview.showJumpToPageDropdown()).toBe(false);

            component.showJumpToPageDropdown = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.showJumpToPageDropdown()).toBe(true);
        });

        it('should handle showFirstLastIcon property', async () => {
            expect(dataview.showFirstLastIcon()).toBe(true);

            component.showFirstLastIcon = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.showFirstLastIcon()).toBe(false);
        });

        it('should handle showPageLinks property', async () => {
            expect(dataview.showPageLinks()).toBe(true);

            component.showPageLinks = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.showPageLinks()).toBe(false);
        });

        it('should handle lazy property', async () => {
            expect(dataview.lazy()).toBe(false);

            component.lazy = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.lazy()).toBe(true);
        });

        it('should handle lazyLoadOnInit property', async () => {
            expect(dataview.lazyLoadOnInit()).toBe(true);

            component.lazyLoadOnInit = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.lazyLoadOnInit()).toBe(false);
        });

        it('should handle emptyMessage property', async () => {
            expect(dataview.emptyMessage()).toBe('No products found');

            component.emptyMessage = 'Custom empty message';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.emptyMessage()).toBe('Custom empty message');
        });

        it('should handle gridStyleClass property', async () => {
            expect(dataview.gridStyleClass()).toBe('' as any);

            component.gridStyleClass = 'custom-grid-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.gridStyleClass()).toBe('custom-grid-class');
        });

        it('should handle trackBy property', async () => {
            const customTrackBy = (index: number, item: any) => item.id;
            component.trackBy = customTrackBy;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.trackBy()).toBe(customTrackBy);
        });

        it('should handle filterBy property', async () => {
            expect(dataview.filterBy()).toBe('name,category');

            component.filterBy = 'price';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.filterBy()).toBe('price');
        });

        it('should handle filterLocale property', async () => {
            component.filterLocale = 'en-US';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.filterLocale()).toBe('en-US');
        });

        it('should handle loading property', async () => {
            expect(dataview.loading()).toBe(false);

            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.loading()).toBe(true);
        });

        it('should handle loadingIcon property', async () => {
            component.loadingIcon = 'pi pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.loadingIcon()).toBe('pi pi-spinner');
        });

        it('should handle first property', async () => {
            expect(dataview.first()).toBe(0);

            component.first = 5;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.first()).toBe(5);
        });

        it('should handle sortField property', async () => {
            component.sortField = 'name';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.sortField()).toBe('name');
        });

        it('should handle sortOrder property', async () => {
            component.sortOrder = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.sortOrder()).toBe(1);
        });

        it('should handle layout property', async () => {
            expect(dataview.layout()).toBe('list');

            component.layout = 'grid';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.layout()).toBe('grid');
        });

        it('should handle value property', async () => {
            expect(dataview.value()).toEqual(component.products);

            const newProducts = [{ id: 10, name: 'New Product', price: 1000, category: 'New Category', inventoryStatus: 'INSTOCK' }];
            component.products = newProducts;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.value()).toEqual(newProducts);
        });

        it('should handle boolean attributes transformation', async () => {
            // Test boolean transformation for paginator
            component.paginator = 'true' as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.paginator()).toBe(true);

            component.paginator = '' as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.paginator()).toBe(true); // empty string should be true
        });

        it('should handle number attributes transformation', async () => {
            // Test number transformation for pageLinks
            component.pageLinks = '10' as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.pageLinks()).toBe(10);
            expect(typeof dataview.pageLinks()).toBe('number');
        });

        it('should handle edge case values for numeric inputs', async () => {
            // Test zero values
            component.rows = 0;
            component.totalRecords = 0;
            component.pageLinks = 0;
            component.first = 0;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.rows()).toBe(0);
            expect(dataview.totalRecords()).toBe(0);
            expect(dataview.pageLinks()).toBe(0);
            expect(dataview.first()).toBe(0);
        });

        it('should handle negative values for numeric inputs', async () => {
            component.rows = -5;
            component.sortOrder = -1;
            component.first = -10;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dataview.rows()).toBe(-5);
            expect(dataview.sortOrder()).toBe(-1);
            // The first property might be validated to prevent negative values as it represents pagination index
            expect(dataview.first()).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Dynamic and Observable Input Values', () => {
        let dynamicComponent: TestDynamicDataViewComponent;
        let dynamicFixture: ComponentFixture<TestDynamicDataViewComponent>;
        let dynamicDataView: DataView;

        beforeEach(async () => {
            dynamicFixture = TestBed.createComponent(TestDynamicDataViewComponent);
            dynamicComponent = dynamicFixture.componentInstance;
            await dynamicFixture.whenStable();
            dynamicDataView = dynamicComponent.dataView;
        });

        it('should handle dynamic value changes', async () => {
            expect(dynamicDataView.value()?.length).toBe(5);

            // Change value dynamically
            dynamicComponent.updateValue([
                { id: 1, name: 'New Product 1', price: 150 },
                { id: 2, name: 'New Product 2', price: 250 }
            ]);
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.value()?.length).toBe(2);
            expect(dynamicDataView.totalRecords()).toBe(2);
        });

        it('should handle dynamic pagination settings', async () => {
            expect(dynamicDataView.paginator()).toBe(false);
            expect(dynamicDataView.rows()).toBe(3);

            // Change pagination settings dynamically
            dynamicComponent.updatePaginationSettings(true, 5);
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.paginator()).toBe(true);
            expect(dynamicDataView.rows()).toBe(5);
        });

        it('should handle dynamic layout changes', async () => {
            expect(dynamicDataView.layout()).toBe('list');

            // Toggle layout
            dynamicComponent.toggleLayout();
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.layout()).toBe('grid');

            dynamicComponent.toggleLayout();
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.layout()).toBe('list');
        });

        it('should handle dynamic loading state changes', async () => {
            expect(dynamicDataView.loading()).toBe(false);

            // Toggle loading state
            dynamicComponent.toggleLoading();
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.loading()).toBe(true);

            dynamicComponent.toggleLoading();
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.loading()).toBe(false);
        });

        it('should handle dynamic sorting changes', async () => {
            expect(dynamicDataView.sortField()).toBeUndefined();
            expect(dynamicDataView.sortOrder() || undefined).toBeUndefined();

            // Change sorting settings
            dynamicComponent.updateSorting('price', -1);
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.sortField()).toBe('price');
            expect(dynamicDataView.sortOrder()).toBe(-1);
        });

        it('should handle dynamic filtering changes', async () => {
            // Change filter settings
            dynamicComponent.updateFilter('name');
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.filterBy()).toBe('name');
        });

        it('should handle dynamic rowsPerPageOptions changes', async () => {
            // Initial options
            dynamicComponent.updateRowsPerPageOptions([5, 10, 15]);
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.rowsPerPageOptions()).toEqual([5, 10, 15]);

            // Update with showAll option
            dynamicComponent.updateRowsPerPageOptions([10, 20, 30, { showAll: 'All' }]);
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.rowsPerPageOptions()).toEqual([10, 20, 30, { showAll: 'All' }]);
        });

        it('should handle multiple simultaneous changes', async () => {
            // Change multiple properties at once
            dynamicComponent.updateMultipleProperties([{ id: 1, name: 'Updated Product', price: 999 }], true, 2, 'grid');
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.value()?.length).toBe(1);
            expect(dynamicDataView.paginator()).toBe(true);
            expect(dynamicDataView.rows()).toBe(2);
            expect(dynamicDataView.layout()).toBe('grid');
        });

        it('should handle observable values from services', async () => {
            // Simulate data from a service observable
            dynamicComponent.loadDataFromService();
            await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for async operation
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.value()?.length).toBe(10);
            expect(dynamicDataView.rows()).toBe(5);
        });

        it('should handle async property updates with delays', async () => {
            // Simulate delayed updates
            dynamicComponent.updateWithDelay(
                [
                    { id: 1, name: 'Delayed Product 1', price: 500 },
                    { id: 2, name: 'Delayed Product 2', price: 600 }
                ],
                10
            );
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for the delay
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.value()?.length).toBe(2);
            expect(dynamicDataView.rows()).toBe(10);
        });

        it('should maintain component state during rapid changes', async () => {
            const initialLayout = dynamicDataView.layout();

            // Perform rapid changes
            for (let i = 0; i < 5; i++) {
                dynamicComponent.updateValue([{ id: i, name: `Rapid Product ${i}`, price: 100 + i * 50 }]);
                await new Promise((resolve) => setTimeout(resolve, 10));
                dynamicFixture.changeDetectorRef.markForCheck();
                await dynamicFixture.whenStable();
            }

            expect(dynamicDataView.value()?.length).toBe(1);
            expect(dynamicDataView.layout()).toBe(initialLayout); // Should maintain layout
        });

        it('should handle edge case: empty value becomes populated', async () => {
            // Start with empty
            dynamicComponent.updateValue([]);
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.$isEmpty()).toBe(true);

            // Add data
            dynamicComponent.updateValue([{ id: 1, name: 'First Product', price: 100 }]);
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.$isEmpty()).toBe(false);
            expect(dynamicDataView.value()?.length).toBe(1);
        });

        it('should handle dynamic template property changes', async () => {
            // Change empty message
            dynamicComponent.updateEmptyMessage('Custom dynamic empty message');
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dynamicDataView.emptyMessage()).toBe('Custom dynamic empty message');
        });
    });
});

// Test component for dynamic values
@Component({
    standalone: true,
    imports: [DataView, PaginatorModule, SharedModule],
    template: `
        <p-dataview
            #dataView
            [value]="value"
            [paginator]="paginator"
            [rows]="rows"
            [totalRecords]="totalRecords"
            [layout]="layout"
            [loading]="loading"
            [loadingIcon]="loadingIcon"
            [sortField]="sortField"
            [sortOrder]="sortOrder"
            [filterBy]="filterBy"
            [rowsPerPageOptions]="rowsPerPageOptions"
            [emptyMessage]="emptyMessage"
        >
            <ng-template #list let-items>
                <div class="dynamic-list-container">
                    @for (item of items; track item) {
                        <div class="dynamic-list-item">{{ item.name }} - {{ item.price }}</div>
                    }
                </div>
            </ng-template>
            <ng-template #grid let-items>
                <div class="dynamic-grid-container">
                    @for (item of items; track item) {
                        <div class="dynamic-grid-item">{{ item.name }} - {{ item.price }}</div>
                    }
                </div>
            </ng-template>
        </p-dataview>
    `
})
class TestDynamicDataViewComponent {
    @ViewChild('dataView') dataView!: DataView;

    private _value = signal<any[]>([
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        { id: 3, name: 'Product 3', price: 300 },
        { id: 4, name: 'Product 4', price: 400 },
        { id: 5, name: 'Product 5', price: 500 }
    ]);
    get value() {
        return this._value();
    }
    set value(v: any[]) {
        this._value.set(v);
    }
    private _paginator = signal<boolean>(false);
    get paginator() {
        return this._paginator();
    }
    set paginator(v: boolean) {
        this._paginator.set(v);
    }
    private _rows = signal<number>(3);
    get rows() {
        return this._rows();
    }
    set rows(v: number) {
        this._rows.set(v);
    }
    private _totalRecords = signal<number | undefined>(undefined);
    get totalRecords() {
        return this._totalRecords();
    }
    set totalRecords(v: number | undefined) {
        this._totalRecords.set(v);
    }
    private _layout = signal<'list' | 'grid'>('list');
    get layout() {
        return this._layout();
    }
    set layout(v: 'list' | 'grid') {
        this._layout.set(v);
    }
    private _loading = signal<boolean>(false);
    get loading() {
        return this._loading();
    }
    set loading(v: boolean) {
        this._loading.set(v);
    }
    private _loadingIcon = signal<string | undefined>(undefined);
    get loadingIcon() {
        return this._loadingIcon();
    }
    set loadingIcon(v: string | undefined) {
        this._loadingIcon.set(v);
    }
    private _sortField = signal<string | undefined>(undefined);
    get sortField() {
        return this._sortField();
    }
    set sortField(v: string | undefined) {
        this._sortField.set(v);
    }
    private _sortOrder = signal<number | undefined>(undefined);
    get sortOrder() {
        return this._sortOrder();
    }
    set sortOrder(v: number | undefined) {
        this._sortOrder.set(v);
    }
    private _filterBy = signal<string | undefined>(undefined);
    get filterBy() {
        return this._filterBy();
    }
    set filterBy(v: string | undefined) {
        this._filterBy.set(v);
    }
    private _rowsPerPageOptions = signal<any[] | undefined>(undefined);
    get rowsPerPageOptions() {
        return this._rowsPerPageOptions();
    }
    set rowsPerPageOptions(v: any[] | undefined) {
        this._rowsPerPageOptions.set(v);
    }
    private _emptyMessage = signal<string>('No data available');
    get emptyMessage() {
        return this._emptyMessage();
    }
    set emptyMessage(v: string) {
        this._emptyMessage.set(v);
    }

    updateValue(newValue: any[]) {
        this.value = newValue;
    }

    updatePaginationSettings(paginator: boolean, rows: number) {
        this.paginator = paginator;
        this.rows = rows;
    }

    toggleLayout() {
        this.layout = this.layout === 'list' ? 'grid' : 'list';
    }

    toggleLoading() {
        this.loading = !this.loading;
    }

    updateSorting(sortField: string, sortOrder: number) {
        this.sortField = sortField;
        this.sortOrder = sortOrder;
    }

    updateFilter(filterBy: string) {
        this.filterBy = filterBy;
    }

    updateRowsPerPageOptions(options: any[]) {
        this.rowsPerPageOptions = options;
    }

    updateEmptyMessage(message: string) {
        this.emptyMessage = message;
    }

    updateMultipleProperties(value: any[], paginator: boolean, rows: number, layout: 'list' | 'grid') {
        this.value = value;
        this.paginator = paginator;
        this.rows = rows;
        this.layout = layout;
    }

    loadDataFromService() {
        // Simulate async data loading
        setTimeout(() => {
            this.value = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                name: `Service Product ${i + 1}`,
                price: (i + 1) * 100
            }));
            this.rows = 5;
        }, 100);
    }

    updateWithDelay(value: any[], rows: number) {
        setTimeout(() => {
            this.value = value;
            this.rows = rows;
        }, 500);
    }
}
