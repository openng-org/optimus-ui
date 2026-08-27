import { Injectable } from '@angular/core';

@Injectable()
export class PhotoService {
    getData() {
        return [
            {
                itemImageSrc: '/demo/galleria/galleria1.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria1s.jpg',
                alt: 'Description for Image 1',
                title: 'Title 1'
            },
            {
                itemImageSrc: '/demo/galleria/galleria2.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria2s.jpg',
                alt: 'Description for Image 2',
                title: 'Title 2'
            },
            {
                itemImageSrc: '/demo/galleria/galleria3.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria3s.jpg',
                alt: 'Description for Image 3',
                title: 'Title 3'
            },
            {
                itemImageSrc: '/demo/galleria/galleria4.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria4s.jpg',
                alt: 'Description for Image 4',
                title: 'Title 4'
            },
            {
                itemImageSrc: '/demo/galleria/galleria5.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria5s.jpg',
                alt: 'Description for Image 5',
                title: 'Title 5'
            },
            {
                itemImageSrc: '/demo/galleria/galleria6.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria6s.jpg',
                alt: 'Description for Image 6',
                title: 'Title 6'
            },
            {
                itemImageSrc: '/demo/galleria/galleria7.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria7s.jpg',
                alt: 'Description for Image 7',
                title: 'Title 7'
            },
            {
                itemImageSrc: '/demo/galleria/galleria8.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria8s.jpg',
                alt: 'Description for Image 8',
                title: 'Title 8'
            },
            {
                itemImageSrc: '/demo/galleria/galleria9.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria9s.jpg',
                alt: 'Description for Image 9',
                title: 'Title 9'
            },
            {
                itemImageSrc: '/demo/galleria/galleria10.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria10s.jpg',
                alt: 'Description for Image 10',
                title: 'Title 10'
            },
            {
                itemImageSrc: '/demo/galleria/galleria11.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria11s.jpg',
                alt: 'Description for Image 11',
                title: 'Title 11'
            },
            {
                itemImageSrc: '/demo/galleria/galleria12.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria12s.jpg',
                alt: 'Description for Image 12',
                title: 'Title 12'
            },
            {
                itemImageSrc: '/demo/galleria/galleria13.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria13s.jpg',
                alt: 'Description for Image 13',
                title: 'Title 13'
            },
            {
                itemImageSrc: '/demo/galleria/galleria14.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria14s.jpg',
                alt: 'Description for Image 14',
                title: 'Title 14'
            },
            {
                itemImageSrc: '/demo/galleria/galleria15.jpg',
                thumbnailImageSrc: '/demo/galleria/galleria15s.jpg',
                alt: 'Description for Image 15',
                title: 'Title 15'
            }
        ];
    }

    getImages() {
        return Promise.resolve(this.getData());
    }
}
