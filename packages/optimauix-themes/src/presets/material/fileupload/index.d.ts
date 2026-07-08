import type { FileUploadTokenSections } from '@primeuix/themes/types/fileupload';

export * from '@primeuix/themes/types/fileupload';

declare const root: FileUploadTokenSections.Root;
declare const header: FileUploadTokenSections.Header;
declare const content: FileUploadTokenSections.Content;
declare const file: FileUploadTokenSections.File;
declare const fileList: FileUploadTokenSections.FileList;
declare const progressbar: FileUploadTokenSections.Progressbar;
declare const basic: FileUploadTokenSections.Basic;
declare const css: FileUploadTokenSections.CSS;
declare const _default: {
    root: FileUploadTokenSections.Root;
    header: FileUploadTokenSections.Header;
    content: FileUploadTokenSections.Content;
    file: FileUploadTokenSections.File;
    fileList: FileUploadTokenSections.FileList;
    progressbar: FileUploadTokenSections.Progressbar;
    basic: FileUploadTokenSections.Basic;
    css: string;
};

export { basic, content, css, _default as default, file, fileList, header, progressbar, root };
