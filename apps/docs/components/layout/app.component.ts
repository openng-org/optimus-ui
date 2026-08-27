import { AppConfigService } from '@/service/appconfigservice';
import { CarService } from '@/service/carservice';
import { CountryService } from '@/service/countryservice';
import { CustomerService } from '@/service/customerservice';
import { EventService } from '@/service/eventservice';
import { NodeService } from '@/service/nodeservice';
import { PhotoService } from '@/service/photoservice';
import { ProductService } from '@/service/productservice';
import { SeoService } from '@/service/seoservice';
import { IMAGE_CONFIG } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    standalone: true,
    imports: [RouterOutlet, FormsModule, ReactiveFormsModule, HttpClientModule],
    providers: [
        CarService,
        CountryService,
        EventService,
        NodeService,
        CustomerService,
        PhotoService,
        AppConfigService,
        ProductService,
        {
            provide: IMAGE_CONFIG,
            useValue: {
                disableImageSizeWarning: true,
                disableImageLazyLoadWarning: true
            }
        }
    ]
})
export class AppComponent {
    private seoService = inject(SeoService);

    constructor() {
        this.seoService.init();
    }
}
