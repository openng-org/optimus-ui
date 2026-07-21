# Icons

PrimeIcons is the default icon library of Optimus UI with over 250 open source icons.

## Basic-

PrimeIcons use the pi pi-&#123;icon&#125; syntax such as pi pi-check . A standalone icon can be displayed using an element such as i or span

## Color-

Icon color is defined with the color property which is inherited from parent by default.

## Constants-

Constants API is available to reference icons easily when used programmatically.

```typescript
import { Component } from '@angular/core';
import { OpenngIcons, MenuItem } from '@openng/optimus-ui/api';

@Component({
    selector: 'openng-icons-constants-demo',
    templateUrl: './openng-icons-constants-demo.html'
})
export class OpenngIconsConstantsDemo {
    items: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'New',
                icon: OpenngIcons.PLUS,
            },
            {
                label: 'Delete',
                icon: OpenngIcons.TRASH
            }
        ];
    }
}
```

## Download-

The icon library is available at npm, run the following command to download it to your project.

```bash
npm install @openng/icons
```

## Import-

CSS file of the icon library needs to be imported in styles.scss of your application.

## List-

Here is the full list of icons. More icons will be added periodically and you may also request new icons at the issue tracker.

## Size-

Size of an icon is controlled with the font-size property of the element.

## Spin-

Special pi-spin class applies infinite rotation to an icon.

