/**
 *
 * FileUpload Design Tokens
 *
 * @module fileupload
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace FileUploadTokenSections {
    interface Root {
        /**
         * Background of root
         *
         * @designToken fileupload.background
         */
        background?: string;
        /**
         * Border color of root
         *
         * @designToken fileupload.border.color
         */
        borderColor?: string;
        /**
         * Color of root
         *
         * @designToken fileupload.color
         */
        color?: string;
        /**
         * Border radius of root
         *
         * @designToken fileupload.border.radius
         */
        borderRadius?: string;
        /**
         * Transition duration of root
         *
         * @designToken fileupload.transition.duration
         */
        transitionDuration?: string;
    }

    interface Header {
        /**
         * Background of header
         *
         * @designToken fileupload.header.background
         */
        background?: string;
        /**
         * Color of header
         *
         * @designToken fileupload.header.color
         */
        color?: string;
        /**
         * Padding of header
         *
         * @designToken fileupload.header.padding
         */
        padding?: string;
        /**
         * Border color of header
         *
         * @designToken fileupload.header.border.color
         */
        borderColor?: string;
        /**
         * Border width of header
         *
         * @designToken fileupload.header.border.width
         */
        borderWidth?: string;
        /**
         * Border radius of header
         *
         * @designToken fileupload.header.border.radius
         */
        borderRadius?: string;
        /**
         * Gap of header
         *
         * @designToken fileupload.header.gap
         */
        gap?: string;
    }

    interface Content {
        /**
         * Highlight border color of content
         *
         * @designToken fileupload.content.highlight.border.color
         */
        highlightBorderColor?: string;
        /**
         * Padding of content
         *
         * @designToken fileupload.content.padding
         */
        padding?: string;
        /**
         * Gap of content
         *
         * @designToken fileupload.content.gap
         */
        gap?: string;
    }

    interface File {
        /**
         * Padding of file
         *
         * @designToken fileupload.file.padding
         */
        padding?: string;
        /**
         * Gap of file
         *
         * @designToken fileupload.file.gap
         */
        gap?: string;
        /**
         * Border color of file
         *
         * @designToken fileupload.file.border.color
         */
        borderColor?: string;
        /**
         * Info of file
         */
        info?: {
            /**
             * Info gap of file
             *
             * @designToken fileupload.file.info.gap
             */
            gap?: string;
        };
    }

    interface FileList {
        /**
         * Gap of file list
         *
         * @designToken fileupload.file.list.gap
         */
        gap?: string;
    }

    interface Progressbar {
        /**
         * Height of progressbar
         *
         * @designToken fileupload.progressbar.height
         */
        height?: string;
    }

    interface Basic {
        /**
         * Gap of basic
         *
         * @designToken fileupload.basic.gap
         */
        gap?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<FileUploadDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _FileUpload Design Tokens_
 *
 * @group components
 * @module fileupload
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface FileUploadDesignTokens extends DesignTokens<FileUploadDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: FileUploadTokenSections.Root;
    /**
     * Used to pass tokens of the header section
     */
    header?: FileUploadTokenSections.Header;
    /**
     * Used to pass tokens of the content section
     */
    content?: FileUploadTokenSections.Content;
    /**
     * Used to pass tokens of the file section
     */
    file?: FileUploadTokenSections.File;
    /**
     * Used to pass tokens of the file list section
     */
    fileList?: FileUploadTokenSections.FileList;
    /**
     * Used to pass tokens of the progressbar section
     */
    progressbar?: FileUploadTokenSections.Progressbar;
    /**
     * Used to pass tokens of the basic section
     */
    basic?: FileUploadTokenSections.Basic;
}
