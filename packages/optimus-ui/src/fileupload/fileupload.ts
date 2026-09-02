import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    InjectionToken,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    output,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    contentChild,
    viewChild,
    contentChildren
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { addClass, removeClass } from '@openng/optimus-ui-utils';
import { BlockableUI, PrimeTemplate, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { Badge } from '@openng/optimus-ui/badge';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { Button, ButtonProps } from '@openng/optimus-ui/button';
import { PlusIcon, TimesIcon, UploadIcon } from '@openng/optimus-ui/icons';
import { Message } from '@openng/optimus-ui/message';
import { ProgressBar } from '@openng/optimus-ui/progressbar';
import { VoidListener } from '@openng/optimus-ui/ts-helpers';
import type { BadgeSeverity } from '@openng/optimus-ui/types/badge';
import {
    FileBeforeUploadEvent,
    FileProgressEvent,
    FileRemoveEvent,
    FileSelectEvent,
    FileSendEvent,
    FileUploadContentTemplateContext,
    FileUploadErrorEvent,
    FileUploadEvent,
    FileUploadFileLabelTemplateContext,
    FileUploadHandlerEvent,
    FileUploadHeaderTemplateContext,
    FileUploadPassThrough,
    RemoveUploadedFileEvent
} from '@openng/optimus-ui/types/fileupload';
import { Subscription } from 'rxjs';
import { FileUploadStyle } from './style/fileuploadstyle';

const FILEUPLOAD_INSTANCE = new InjectionToken<FileUpload>('FILEUPLOAD_INSTANCE');

@Component({
    selector: '[pFileContent]',
    standalone: true,
    template: `@for (file of files(); track file?.name + '-' + $index; let index = $index) {
        <div [class]="cx('file')" [pBind]="$pcFileUpload.ptm('file')">
            <img role="presentation" [class]="cx('fileThumbnail')" [attr.alt]="file.name" [src]="file.objectURL" [width]="previewWidth()" [pBind]="$pcFileUpload.ptm('fileThumbnail')" />
            <div [class]="cx('fileInfo')" [pBind]="$pcFileUpload.ptm('fileInfo')">
                <div [class]="cx('fileName')" [pBind]="$pcFileUpload.ptm('fileName')">{{ file.name }}</div>
                <span [class]="cx('fileSize')" [pBind]="$pcFileUpload.ptm('fileSize')">{{ formatSize(file.size) }}</span>
            </div>
            <p-badge [value]="badgeValue()" [severity]="badgeSeverity()" [class]="cx('pcFileBadge')" [pt]="$pcFileUpload.ptm('pcFileBadge')" [unstyled]="unstyled()" />
            <div [class]="cx('fileActions')" [pBind]="$pcFileUpload.ptm('fileActions')">
                <p-button (onClick)="onRemoveClick($event, index)" [styleClass]="cx('pcFileRemoveButton')" text rounded severity="danger" [pt]="$pcFileUpload.ptm('pcFileRemoveButton')" [unstyled]="unstyled()">
                    <ng-template #icon let-iconClass="class">
                        @if (fileRemoveIconTemplate()) {
                            <ng-template *ngTemplateOutlet="fileRemoveIconTemplate(); context: { class: iconClass, file: file, index: index }"></ng-template>
                        } @else {
                            <svg data-p-icon="times" [class]="iconClass" [attr.aria-hidden]="true" />
                        }
                    </ng-template>
                </p-button>
            </div>
        </div>
    }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FileUploadStyle],
    imports: [CommonModule, Badge, Button, TimesIcon, Bind]
})
export class FileContent extends BaseComponent {
    _componentStyle = inject(FileUploadStyle);

    $pcFileUpload = inject(FILEUPLOAD_INSTANCE);

    files = input<any>();

    badgeSeverity = input<BadgeSeverity>('warn');

    badgeValue = input<string>();

    previewWidth = input<number>(50);

    fileRemoveIconTemplate = input<any>();

    onRemove = output<any>();

    onRemoveClick(event: any, index: number) {
        this.onRemove.emit({ event, index });
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.getTranslation(TranslationKeys.FILE_SIZE_TYPES);

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = (bytes / Math.pow(k, i)).toFixed(dm);

        return `${formattedSize} ${sizes[i]}`;
    }
}
/**
 * FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.
 * @group Components
 */
@Component({
    selector: 'p-fileupload, p-fileUpload',
    standalone: true,
    imports: [CommonModule, Button, ProgressBar, Message, PlusIcon, UploadIcon, TimesIcon, SharedModule, FileContent, Bind],
    template: `
        <div [class]="cn(cx('root'), styleClass())" [ngStyle]="style()" *ngIf="mode() === 'advanced'" [pBind]="ptm('root')">
            <input
                [attr.aria-label]="browseFilesLabel"
                #advancedfileinput
                type="file"
                (change)="onFileSelect($event)"
                [multiple]="multiple()"
                [accept]="accept()"
                [disabled]="disabled() || isChooseDisabled()"
                [attr.title]="''"
                [pBind]="ptm('input')"
            />
            <div [class]="cx('header')" [pBind]="ptm('header')">
                <ng-container *ngIf="!$headerTemplate()">
                    <p-button
                        [styleClass]="cn(cx('pcChooseButton'), chooseStyleClass())"
                        [disabled]="disabled() || isChooseDisabled()"
                        (focus)="onFocus()"
                        [label]="chooseButtonLabel"
                        (blur)="onBlur()"
                        (onClick)="choose()"
                        (keydown.enter)="choose()"
                        [buttonProps]="chooseButtonProps()"
                        [pt]="ptm('pcChooseButton')"
                        [unstyled]="unstyled()"
                    >
                        <input
                            [attr.aria-label]="browseFilesLabel"
                            #advancedfileinput
                            type="file"
                            (change)="onFileSelect($event)"
                            [multiple]="multiple()"
                            [accept]="accept()"
                            [disabled]="disabled() || isChooseDisabled()"
                            [attr.title]="''"
                            [pBind]="ptm('input')"
                        />
                        <ng-template #icon>
                            <span *ngIf="chooseIcon()" [class]="chooseIcon()" [attr.aria-label]="true" [pBind]="ptm('pcChooseButton')?.icon"></span>
                            <ng-container *ngIf="!chooseIcon()">
                                <svg data-p-icon="plus" *ngIf="!$chooseIconTemplate()" [attr.aria-label]="true" [pBind]="ptm('pcChooseButton')?.icon" />
                                <span *ngIf="$chooseIconTemplate()" [attr.aria-label]="true" [pBind]="ptm('pcChooseButton')?.icon">
                                    <ng-template *ngTemplateOutlet="$chooseIconTemplate()"></ng-template>
                                </span>
                            </ng-container>
                        </ng-template>
                    </p-button>

                    <p-button
                        *ngIf="!auto() && showUploadButton()"
                        [label]="uploadButtonLabel"
                        (onClick)="upload()"
                        [disabled]="!hasFiles() || isFileLimitExceeded()"
                        [styleClass]="cn(cx('pcUploadButton'), uploadStyleClass())"
                        [buttonProps]="uploadButtonProps()"
                        [pt]="ptm('pcUploadButton')"
                        [unstyled]="unstyled()"
                    >
                        <ng-template #icon>
                            <span *ngIf="uploadIcon()" [ngClass]="uploadIcon()" [attr.aria-hidden]="true" [pBind]="ptm('pcUploadButton')?.icon"></span>
                            <ng-container *ngIf="!uploadIcon()">
                                <svg data-p-icon="upload" *ngIf="!$uploadIconTemplate()" [pBind]="ptm('pcUploadButton')?.icon" />
                                <span *ngIf="$uploadIconTemplate()" [attr.aria-hidden]="true" [pBind]="ptm('pcUploadButton')?.icon">
                                    <ng-template *ngTemplateOutlet="$uploadIconTemplate()"></ng-template>
                                </span>
                            </ng-container>
                        </ng-template>
                    </p-button>
                    <p-button
                        *ngIf="!auto() && showCancelButton()"
                        [label]="cancelButtonLabel"
                        (onClick)="clear()"
                        [disabled]="!hasFiles() || uploading"
                        [styleClass]="cn(cx('pcCancelButton'), cancelStyleClass())"
                        [buttonProps]="cancelButtonProps()"
                        [pt]="ptm('pcCancelButton')"
                        [unstyled]="unstyled()"
                    >
                        <ng-template #icon>
                            <span *ngIf="cancelIcon()" [ngClass]="cancelIcon()"></span>
                            <ng-container *ngIf="!cancelIcon()">
                                <svg data-p-icon="times" *ngIf="!$cancelIconTemplate()" [attr.aria-hidden]="true" />
                                <span *ngIf="$cancelIconTemplate()" [attr.aria-hidden]="true">
                                    <ng-template *ngTemplateOutlet="$cancelIconTemplate()"></ng-template>
                                </span>
                            </ng-container>
                        </ng-template>
                    </p-button>
                </ng-container>
                <ng-container
                    *ngTemplateOutlet="
                        $headerTemplate();
                        context: {
                            $implicit: _files,
                            uploadedFiles: uploadedFiles,
                            chooseCallback: choose.bind(this),
                            clearCallback: clear.bind(this),
                            uploadCallback: upload.bind(this)
                        }
                    "
                ></ng-container>
                <ng-container *ngTemplateOutlet="$toolbarTemplate()"></ng-container>
            </div>
            <div #content [class]="cx('content')" (dragenter)="onDragEnter($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)" [pBind]="ptm('content')">
                @if ($contentTemplate()) {
                    <ng-container
                        *ngTemplateOutlet="
                            $contentTemplate();
                            context: {
                                $implicit: _files,
                                uploadedFiles: uploadedFiles,
                                chooseCallback: choose.bind(this),
                                clearCallback: clear.bind(this),
                                removeUploadedFileCallback: removeUploadedFile.bind(this),
                                removeFileCallback: remove.bind(this),
                                progress: progress,
                                messages: msgs
                            }
                        "
                    ></ng-container>
                } @else {
                    <p-progressbar [value]="progress" [showValue]="false" *ngIf="hasFiles()" [pt]="ptm('pcProgressBar')"></p-progressbar>
                    @for (message of msgs; track message) {
                        <p-message [severity]="message.severity" [text]="message.text" [pt]="ptm('pcMessage')" [unstyled]="unstyled()"></p-message>
                    }

                    @if (hasFiles()) {
                        <div [class]="cx('fileList')" [pBind]="ptm('fileList')">
                            <ng-template ngFor [ngForOf]="_files" [ngForTemplate]="$fileTemplate()"></ng-template>
                            @if (!$fileTemplate()) {
                                <div pFileContent [unstyled]="unstyled()" [files]="_files" (onRemove)="onRemoveClick($event)" [badgeValue]="pendingLabel" [previewWidth]="previewWidth()" [fileRemoveIconTemplate]="$cancelIconTemplate()"></div>
                            }
                        </div>
                    }
                    @if (hasUploadedFiles()) {
                        <div [class]="cx('fileList')" [pBind]="ptm('fileList')">
                            <ng-template ngFor [ngForOf]="uploadedFiles" [ngForTemplate]="$fileTemplate()"></ng-template>
                            @if (!$fileTemplate()) {
                                <div
                                    pFileContent
                                    [unstyled]="unstyled()"
                                    [files]="uploadedFiles"
                                    (onRemove)="onRemoveUploadedFileClick($event)"
                                    [badgeValue]="completedLabel()"
                                    badgeSeverity="success"
                                    [previewWidth]="previewWidth()"
                                    [fileRemoveIconTemplate]="$cancelIconTemplate()"
                                ></div>
                            }
                        </div>
                    }
                }
                @if ($emptyTemplate() && !hasFiles() && !hasUploadedFiles()) {
                    <ng-container *ngTemplateOutlet="$emptyTemplate()" [pBind]="ptm('empty')"></ng-container>
                }
            </div>
        </div>
        <div [class]="cn(cx('root'), styleClass())" *ngIf="mode() === 'basic'" [pBind]="ptm('root')">
            @for (message of msgs; track message) {
                <p-message [severity]="message.severity" [text]="message.text" [pt]="ptm('pcMessage')" [unstyled]="unstyled()"></p-message>
            }

            <div [class]="cx('basicContent')" [pBind]="ptm('basicContent')">
                <p-button
                    [styleClass]="cn(cx('pcChooseButton'), chooseStyleClass())"
                    [disabled]="disabled()"
                    [label]="chooseButtonLabel"
                    [style]="style()"
                    (onClick)="onBasicUploaderClick()"
                    (keydown)="onBasicKeydown($event)"
                    [buttonProps]="chooseButtonProps()"
                    [pt]="ptm('pcChooseButton')"
                    [unstyled]="unstyled()"
                >
                    <ng-template #icon>
                        @if (hasFiles() && !auto()) {
                            <span *ngIf="uploadIcon()" class="p-button-icon p-button-icon-left" [ngClass]="uploadIcon()" [pBind]="ptm('pcChooseButton')?.icon"></span>
                            <ng-container *ngIf="!uploadIcon()">
                                <svg data-p-icon="upload" *ngIf="!$uploadIconTemplate()" [class]="'p-button-icon p-button-icon-left'" [pBind]="ptm('pcChooseButton')?.icon" />
                                <span *ngIf="$uploadIconTemplate()" class="p-button-icon p-button-icon-left" [pBind]="ptm('pcChooseButton')?.icon">
                                    <ng-template *ngTemplateOutlet="$uploadIconTemplate()"></ng-template>
                                </span>
                            </ng-container>
                        } @else {
                            <span *ngIf="chooseIcon()" class="p-button-icon p-button-icon-left pi" [ngClass]="chooseIcon()" [pBind]="ptm('pcChooseButton')?.icon"></span>
                            <ng-container *ngIf="!chooseIcon()">
                                <svg data-p-icon="plus" *ngIf="!$chooseIconTemplate()" [pBind]="ptm('pcChooseButton')?.icon" />
                                <ng-template *ngTemplateOutlet="$chooseIconTemplate()"></ng-template>
                            </ng-container>
                        }
                    </ng-template>
                    <input
                        [attr.aria-label]="browseFilesLabel"
                        #basicfileinput
                        type="file"
                        [accept]="accept()"
                        [multiple]="multiple()"
                        [disabled]="disabled()"
                        (change)="onFileSelect($event)"
                        (focus)="onFocus()"
                        (blur)="onBlur()"
                        [pBind]="ptm('input')"
                    />
                </p-button>
                @if (!auto()) {
                    @if (!$fileLabelTemplate()) {
                        <span>
                            {{ basicFileChosenLabel() }}
                        </span>
                    } @else {
                        <ng-container *ngTemplateOutlet="$fileLabelTemplate(); context: { $implicit: _files }"></ng-container>
                    }
                }
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FileUploadStyle, { provide: FILEUPLOAD_INSTANCE, useExisting: FileUpload }, { provide: PARENT_INSTANCE, useExisting: FileUpload }],
    hostDirectives: [Bind]
})
export class FileUpload extends BaseComponent<FileUploadPassThrough> implements BlockableUI {
    bindDirectiveInstance = inject(Bind, { self: true });

    sanitizer: DomSanitizer = inject(DomSanitizer);

    zone: NgZone = inject(NgZone);

    http: HttpClient = inject(HttpClient);

    _componentStyle = inject(FileUploadStyle);

    /**
     * Name of the request parameter to identify the files at backend.
     * @group Props
     */
    readonly name = input<string>();

    /**
     * Remote url to upload the files.
     * @group Props
     */
    readonly url = input<string>();

    /**
     * HTTP method to send the files to the url such as "post" and "put".
     * @group Props
     */
    readonly method = input<'post' | 'put'>('post');

    /**
     * Used to select multiple files at once from file dialog.
     * @group Props
     */
    readonly multiple = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Comma-separated list of pattern to restrict the allowed file types. Can be any combination of either the MIME types (such as "image/*") or the file extensions (such as ".jpg").
     * @group Props
     */
    readonly accept = input<string>();

    /**
     * Disables the upload functionality.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When enabled, upload begins automatically after selection is completed.
     * @group Props
     */
    readonly auto = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates.
     * @group Props
     */
    readonly withCredentials = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Maximum file size allowed in bytes.
     * @group Props
     */
    readonly maxFileSize = input<number, unknown>(undefined, { transform: numberAttribute });

    /**
     * Summary message of the invalid file size.
     * @group Props
     */
    readonly invalidFileSizeMessageSummary = input<string>('{0}: Invalid file size, ');

    /**
     * Detail message of the invalid file size.
     * @group Props
     */
    readonly invalidFileSizeMessageDetail = input<string>('maximum upload size is {0}.');

    /**
     * Summary message of the invalid file type.
     * @group Props
     */
    readonly invalidFileTypeMessageSummary = input<string>('{0}: Invalid file type, ');

    /**
     * Detail message of the invalid file type.
     * @group Props
     */
    readonly invalidFileTypeMessageDetail = input<string>('allowed file types: {0}.');

    /**
     * Detail message of the invalid file type.
     * @group Props
     */
    readonly invalidFileLimitMessageDetail = input<string>('limit is {0} at most.');

    /**
     * Summary message of the invalid file type.
     * @group Props
     */
    readonly invalidFileLimitMessageSummary = input<string>('Maximum number of files exceeded, ');

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();

    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Width of the image thumbnail in pixels.
     * @group Props
     */
    readonly previewWidth = input<number, unknown>(50, { transform: numberAttribute });

    /**
     * Label of the choose button. Defaults to Optimus Locale configuration.
     * @group Props
     */
    readonly chooseLabel = input<string>();

    /**
     * Label of the upload button. Defaults to Optimus Locale configuration.
     * @group Props
     */
    readonly uploadLabel = input<string>();

    /**
     * Label of the cancel button. Defaults to Optimus Locale configuration.
     * @group Props
     */
    readonly cancelLabel = input<string>();

    /**
     * Icon of the choose button.
     * @group Props
     */
    readonly chooseIcon = input<string>();

    /**
     * Icon of the upload button.
     * @group Props
     */
    readonly uploadIcon = input<string>();

    /**
     * Icon of the cancel button.
     * @group Props
     */
    readonly cancelIcon = input<string>();

    /**
     * Whether to show the upload button.
     * @group Props
     */
    readonly showUploadButton = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Whether to show the cancel button.
     * @group Props
     */
    readonly showCancelButton = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Defines the UI of the component.
     * @group Props
     */
    readonly mode = input<'advanced' | 'basic'>('advanced');

    /**
     * HttpHeaders class represents the header configuration options for an HTTP request.
     * @group Props
     */
    readonly headers = input<HttpHeaders>();

    /**
     * Whether to use the default upload or a manual implementation defined in uploadHandler callback. Defaults to Optimus Locale configuration.
     * @group Props
     */
    readonly customUpload = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Maximum number of files that can be uploaded.
     * @group Props
     */
    readonly fileLimit = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });

    /**
     * Style class of the upload button.
     * @group Props
     */
    readonly uploadStyleClass = input<string>();

    /**
     * Style class of the cancel button.
     * @group Props
     */
    readonly cancelStyleClass = input<string>();

    /**
     * Style class of the remove button.
     * @group Props
     */
    readonly removeStyleClass = input<string>();

    /**
     * Style class of the choose button.
     * @group Props
     */
    readonly chooseStyleClass = input<string>();

    /**
     * Used to pass all properties of the ButtonProps to the choose button inside the component.
     * @group Props
     */
    readonly chooseButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the upload button inside the component.
     * @group Props
     */
    readonly uploadButtonProps = input<ButtonProps>({ severity: 'secondary' });

    /**
     * Used to pass all properties of the ButtonProps to the cancel button inside the component.
     * @group Props
     */
    readonly cancelButtonProps = input<ButtonProps>({ severity: 'secondary' });

    /**
     * List of files.
     * @group Props
     */
    readonly files = input<File[]>();

    /**
     * Callback to invoke before file upload is initialized.
     * @param {FileBeforeUploadEvent} event - Custom upload event.
     * @group Emits
     */
    readonly onBeforeUpload = output<FileBeforeUploadEvent>();

    /**
     * An event indicating that the request was sent to the server. Useful when a request may be retried multiple times, to distinguish between retries on the final event stream.
     * @param {FileSendEvent} event - Custom send event.
     * @group Emits
     */
    readonly onSend = output<FileSendEvent>();

    /**
     * Callback to invoke when file upload is complete.
     * @param {FileUploadEvent} event - Custom upload event.
     * @group Emits
     */
    readonly onUpload = output<FileUploadEvent>();

    /**
     * Callback to invoke if file upload fails.
     * @param {FileUploadErrorEvent} event - Custom error event.
     * @group Emits
     */
    readonly onError = output<FileUploadErrorEvent>();

    /**
     * Callback to invoke when files in queue are removed without uploading using clear all button.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onClear = output<Event | undefined>();

    /**
     * Callback to invoke when a file is removed without uploading using clear button of a file.
     * @param {FileRemoveEvent} event - Remove event.
     * @group Emits
     */
    readonly onRemove = output<FileRemoveEvent>();

    /**
     * Callback to invoke when files are selected.
     * @param {FileSelectEvent} event - Select event.
     * @group Emits
     */
    readonly onSelect = output<FileSelectEvent>();

    /**
     * Callback to invoke when files are being uploaded.
     * @param {FileProgressEvent} event - Progress event.
     * @group Emits
     */
    readonly onProgress = output<FileProgressEvent>();

    /**
     * Callback to invoke in custom upload mode to upload the files manually.
     * @param {FileUploadHandlerEvent} event - Upload handler event.
     * @group Emits
     */
    readonly uploadHandler = output<FileUploadHandlerEvent>();

    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();

    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {RemoveUploadedFileEvent} event - Remove event.
     * @group Emits
     */
    readonly onRemoveUploadedFile = output<RemoveUploadedFileEvent>();

    readonly advancedFileInput = viewChild<ElementRef | any>('advancedfileinput');

    readonly basicFileInput = viewChild<ElementRef>('basicfileinput');

    readonly content = viewChild<ElementRef>('content');

    /**
     * Custom file template.
     * @group Templates
     */
    readonly fileTemplate = contentChild<TemplateRef<void>>('file', { descendants: false });

    /**
     * Custom header template.
     * @param {FileUploadHeaderTemplateContext} context - header template context.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<FileUploadHeaderTemplateContext>>('header', { descendants: false });

    /**
     * Custom content template.
     * @param {FileUploadContentTemplateContext} context - content template context.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<FileUploadContentTemplateContext>>('content', { descendants: false });

    /**
     * Custom toolbar template.
     * @group Templates
     */
    readonly toolbarTemplate = contentChild<TemplateRef<void>>('toolbar', { descendants: false });

    /**
     * Custom choose icon template.
     * @group Templates
     */
    readonly chooseIconTemplate = contentChild<TemplateRef<void>>('chooseicon', { descendants: false });

    /**
     * Custom file label template.
     * @param {FileUploadFileLabelTemplateContext} context - file label template context.
     * @group Templates
     */
    readonly fileLabelTemplate = contentChild<TemplateRef<FileUploadFileLabelTemplateContext>>('filelabel', { descendants: false });

    /**
     * Custom upload icon template.
     * @group Templates
     */
    readonly uploadIconTemplate = contentChild<TemplateRef<void>>('uploadicon', { descendants: false });

    /**
     * Custom cancel icon template.
     * @group Templates
     */
    readonly cancelIconTemplate = contentChild<TemplateRef<void>>('cancelicon', { descendants: false });

    /**
     * Custom empty state template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    componentName = 'FileUpload';

    /**
     * Reacts to later `files` changes (replaces the legacy setter): validates and stores the
     * files. The first run only registers the dependency — the initial value is assigned eagerly
     * in `onInit`, exactly like the legacy input setter.
     */
    private filesEffectRan = false;

    private readonly filesEffect = effect(() => {
        const files = this.files();

        if (!this.filesEffectRan) {
            this.filesEffectRan = true;
            return;
        }

        untracked(() => {
            if (files !== undefined) {
                this.assignFiles(files);
            }
        });
    });

    public get basicButtonLabel(): string {
        if (this.auto() || !this.hasFiles()) {
            return this.chooseLabel() as string;
        }

        return this.uploadLabel() ?? this._files[0].name;
    }

    public _files: File[] = [];

    public progress: number = 0;

    public dragHighlight: boolean | undefined;

    public msgs: any[] | undefined;

    public uploadedFileCount: number = 0;

    focus: boolean | undefined;

    uploading: boolean | undefined;

    duplicateIEEvent: boolean | undefined; // flag to recognize duplicate onchange event for file input

    translationSubscription: Subscription | undefined;

    dragOverListener: VoidListener;

    public uploadedFiles: File[] = [];

    /** Effective header template: the `#header` content child or the `pTemplate="header"`. */
    readonly $headerTemplate = computed(
        () =>
            (this.headerTemplate() ??
                this.templates()
                    .filter((item) => item.getType() === 'header')
                    .at(-1)?.template) as TemplateRef<FileUploadHeaderTemplateContext> | undefined
    );

    /** Effective content template: the `#content` content child or the `pTemplate="content"`. */
    readonly $contentTemplate = computed(
        () =>
            (this.contentTemplate() ??
                this.templates()
                    .filter((item) => item.getType() === 'content')
                    .at(-1)?.template) as TemplateRef<FileUploadContentTemplateContext> | undefined
    );

    /** Effective toolbar template: the `#toolbar` content child or the `pTemplate="toolbar"`. */
    readonly $toolbarTemplate = computed(
        () =>
            this.toolbarTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'toolbar')
                .at(-1)?.template
    );

    /** Effective choose icon template: the `#chooseicon` content child or the `pTemplate="chooseicon"`. */
    readonly $chooseIconTemplate = computed(
        () =>
            this.chooseIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'chooseicon')
                .at(-1)?.template
    );

    /** Effective upload icon template: the `#uploadicon` content child or the `pTemplate="uploadicon"`. */
    readonly $uploadIconTemplate = computed(
        () =>
            this.uploadIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'uploadicon')
                .at(-1)?.template
    );

    /** Effective cancel icon template: the `#cancelicon` content child or the `pTemplate="cancelicon"`. */
    readonly $cancelIconTemplate = computed(
        () =>
            this.cancelIconTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'cancelicon')
                .at(-1)?.template
    );

    /** Effective empty template: the `#empty` content child or the `pTemplate="empty"`. */
    readonly $emptyTemplate = computed(
        () =>
            this.emptyTemplate() ??
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    /** Effective file label template: the `#filelabel` content child or the `pTemplate="filelabel"`. */
    readonly $fileLabelTemplate = computed(
        () =>
            (this.fileLabelTemplate() ??
                this.templates()
                    .filter((item) => item.getType() === 'filelabel')
                    .at(-1)?.template) as TemplateRef<FileUploadFileLabelTemplateContext> | undefined
    );

    /**
     * Effective file template: the `#file` content child or (legacy behavior) the last projected
     * pTemplate of type `file` or of an unknown type.
     */
    readonly $fileTemplate = computed(
        () =>
            this.fileTemplate() ??
            this.templates()
                .filter((item) => !['header', 'content', 'toolbar', 'chooseicon', 'uploadicon', 'cancelicon', 'empty', 'filelabel'].includes(item.getType()))
                .at(-1)?.template
    );

    get chooseButtonLabel(): string {
        return this.chooseLabel() || this.config.getTranslation(TranslationKeys.CHOOSE);
    }

    get uploadButtonLabel(): string {
        return this.uploadLabel() || this.config.getTranslation(TranslationKeys.UPLOAD);
    }

    get cancelButtonLabel(): string {
        return this.cancelLabel() || this.config.getTranslation(TranslationKeys.CANCEL);
    }

    get browseFilesLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)[TranslationKeys.BROWSE_FILES];
    }

    get pendingLabel() {
        return this.config.getTranslation(TranslationKeys.PENDING);
    }

    constructor() {
        super();
        // Re-apply the host pass-through section after each render (replaces the former
        // ngAfterViewChecked hook).
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        });

        // Binds the dragover listener once the view exists (replaces the former ngAfterViewInit
        // hook).
        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                if (this.mode() === 'advanced') {
                    this.zone.runOutsideAngular(() => {
                        const content = this.content();
                        if (content) {
                            this.dragOverListener = this.renderer.listen(content.nativeElement, 'dragover', this.onDragOver.bind(this));
                        }
                    });
                }
            }
        });
    }

    onInit() {
        // The files effect only flushes after the first template pass, but the legacy setter had
        // already validated the initial value by then — assign it eagerly (the effect skips its
        // first run).
        const files = this.files();
        if (files !== undefined) {
            this.assignFiles(files);
        }

        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.cd.markForCheck();
        });
    }

    onDestroy() {
        const content = this.content();
        if (content && content.nativeElement) {
            if (this.dragOverListener) {
                this.dragOverListener();
                this.dragOverListener = null;
            }
        }

        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
    }

    /**
     * Validates the given files and stores the accepted ones (the legacy `files` setter body).
     * @group Method
     */
    assignFiles(files: File[] | FileList) {
        this._files = [];

        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            if (this.validate(file)) {
                if (this.isImage(file)) {
                    (<any>file).objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
                }

                this._files.push(files[i]);
            }
        }
    }

    basicFileChosenLabel() {
        if (this.auto()) return this.chooseButtonLabel;
        else if (this.hasFiles()) {
            if (this._files && this._files.length === 1) return this._files[0].name;

            return this.config.getTranslation('fileChosenMessage')?.replace('{0}', this._files.length);
        }

        return this.config.getTranslation('noFileChosenMessage') || '';
    }

    completedLabel() {
        return this.config.getTranslation('completed') || '';
    }

    getTranslation(option: string) {
        return this.config.getTranslation(option);
    }

    choose() {
        this.advancedFileInput()?.nativeElement.click();
    }

    onFileSelect(event: any) {
        if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
            this.duplicateIEEvent = false;
            return;
        }

        if (!this.multiple()) {
            this.assignFiles([]);
        }

        this.msgs = [];
        this._files = this._files || [];
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            if (!this.isFileSelected(file)) {
                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
                    }

                    this._files.push(files[i]);
                }
            }
        }

        this.onSelect.emit({ originalEvent: event, files: files, currentFiles: this._files });

        // this will check the fileLimit with the uploaded files
        this.checkFileLimit(files);

        if (this.hasFiles() && this.auto() && (this.mode() !== 'advanced' || !this.isFileLimitExceeded())) {
            this.upload();
        }

        if (event.type !== 'drop' && this.isIE11()) {
            this.clearIEInput();
        } else {
            this.clearInputElement();
        }
    }

    isFileSelected(file: File): boolean {
        for (let sFile of this._files) {
            if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) {
                return true;
            }
        }

        return false;
    }

    isIE11() {
        if (isPlatformBrowser(this.platformId)) {
            return !!(this.document.defaultView as any)['MSInputMethodContext'] && !!(this.document as any)['documentMode'];
        }
    }

    validate(file: File): boolean {
        this.msgs = this.msgs || [];
        if (this.accept() && !this.isFileTypeValid(file)) {
            const text = `${this.invalidFileTypeMessageSummary().replace('{0}', file.name)} ${this.invalidFileTypeMessageDetail().replace('{0}', this.accept()!)}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
            return false;
        }

        const maxFileSize = this.maxFileSize();
        if (maxFileSize && file.size > maxFileSize) {
            const text = `${this.invalidFileSizeMessageSummary().replace('{0}', file.name)} ${this.invalidFileSizeMessageDetail().replace('{0}', this.formatSize(maxFileSize))}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
            return false;
        }

        return true;
    }

    private isFileTypeValid(file: File): boolean {
        let acceptableTypes = this.accept()
            ?.split(',')
            .map((type) => type.trim());
        for (let type of acceptableTypes!) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type) : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

            if (acceptable) {
                return true;
            }
        }

        return false;
    }

    getTypeClass(fileType: string): string {
        return fileType.substring(0, fileType.indexOf('/'));
    }

    isWildcard(fileType: string): boolean {
        return fileType.indexOf('*') !== -1;
    }

    getFileExtension(file: File): string {
        return '.' + file.name.split('.').pop();
    }

    isImage(file: File): boolean {
        return /^image\//.test(file.type);
    }

    onImageLoad(img: any) {
        window.URL.revokeObjectURL(img.src);
    }

    /**
     * Uploads the selected files.
     * @group Method
     */
    uploader() {
        if (this.customUpload()) {
            if (this.fileLimit()) {
                this.uploadedFileCount += this._files.length;
            }

            this.uploadHandler.emit({
                files: this._files
            });

            this.cd.markForCheck();
        } else {
            this.uploading = true;
            this.msgs = [];
            let formData = new FormData();

            this.onBeforeUpload.emit({
                formData: formData
            });

            for (let i = 0; i < this._files.length; i++) {
                formData.append(this.name()!, this._files[i], this._files[i].name);
            }

            this.http
                .request(<string>this.method(), this.url() as string, {
                    body: formData,
                    headers: this.headers(),
                    reportProgress: true,
                    observe: 'events',
                    withCredentials: this.withCredentials()
                })
                .subscribe(
                    (event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Sent:
                                this.onSend.emit({
                                    originalEvent: event,
                                    formData: formData
                                });
                                break;
                            case HttpEventType.Response:
                                this.uploading = false;
                                this.progress = 0;

                                if (event['status'] >= 200 && event['status'] < 300) {
                                    if (this.fileLimit()) {
                                        this.uploadedFileCount += this._files.length;
                                    }

                                    this.onUpload.emit({ originalEvent: event, files: this._files });
                                } else {
                                    this.onError.emit({ files: this._files });
                                }
                                this.uploadedFiles = [...this.uploadedFiles, ...this._files];
                                this.clear();
                                break;
                            case HttpEventType.UploadProgress: {
                                if (event['loaded']) {
                                    this.progress = Math.round((event['loaded'] * 100) / event['total']!);
                                }

                                this.onProgress.emit({ originalEvent: event, progress: this.progress });
                                break;
                            }
                        }

                        this.cd.markForCheck();
                    },
                    (error: ErrorEvent) => {
                        this.uploading = false;
                        this.onError.emit({ files: this._files, error: error });
                    }
                );
        }
    }

    onRemoveClick(e: any) {
        const { event, index } = e;
        if (this.hasFiles()) {
            this.remove(event, index);
        }
    }

    onRemoveUploadedFileClick(e: any) {
        const { index } = e;
        if (this.hasUploadedFiles()) {
            this.removeUploadedFile(index);
        }
    }

    /**
     * Clears the files list.
     * @group Method
     */
    clear() {
        this.assignFiles([]);
        this.onClear.emit(undefined);
        this.clearInputElement();
        this.msgs = [];
        this.cd.markForCheck();
    }

    /**
     * Removes a single file.
     * @param {Event} event - Browser event.
     * @param {Number} index - Index of the file.
     * @group Method
     */
    remove(event: Event, index: number) {
        this.clearInputElement();
        this.onRemove.emit({ originalEvent: event, file: this._files[index] });
        this._files.splice(index, 1);
        this.checkFileLimit(this._files);
    }

    /**
     * Removes uploaded file.
     * @param {Number} index - Index of the file to be removed.
     * @group Method
     */
    removeUploadedFile(index: number) {
        let removedFile = this.uploadedFiles.splice(index, 1)[0];
        this.uploadedFiles = [...this.uploadedFiles];
        this.onRemoveUploadedFile.emit({ file: removedFile, files: this.uploadedFiles });
    }

    isFileLimitExceeded() {
        const isAutoMode = this.auto();
        const fileLimit = this.fileLimit();
        const totalFileCount = isAutoMode ? this._files.length : this._files.length + this.uploadedFileCount;

        if (fileLimit && fileLimit <= totalFileCount && this.focus) {
            this.focus = false;
        }

        return fileLimit && fileLimit < totalFileCount;
    }

    isChooseDisabled() {
        const fileLimit = this.fileLimit();
        if (this.auto()) {
            return fileLimit && fileLimit <= this._files.length;
        } else {
            return fileLimit && fileLimit <= this._files.length + this.uploadedFileCount;
        }
    }

    checkFileLimit(files: File[]) {
        this.msgs ??= [];
        const fileLimit = this.fileLimit();
        const hasExistingValidationMessages = this.msgs.length > 0 && fileLimit && fileLimit < files.length;

        if (this.isFileLimitExceeded() || hasExistingValidationMessages) {
            const text = `${this.invalidFileLimitMessageSummary().replace('{0}', (fileLimit as number).toString())} ${this.invalidFileLimitMessageDetail().replace('{0}', (fileLimit as number).toString())}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
        } else {
            this.msgs = this.msgs.filter((msg) => !msg.text.includes(this.invalidFileLimitMessageSummary()));
        }
    }

    clearInputElement() {
        const advancedFileInput = this.advancedFileInput();
        if (advancedFileInput && advancedFileInput.nativeElement) {
            advancedFileInput.nativeElement.value = '';
        }

        const basicFileInput = this.basicFileInput();
        if (basicFileInput && basicFileInput.nativeElement) {
            basicFileInput.nativeElement.value = '';
        }
    }

    clearIEInput() {
        const advancedFileInput = this.advancedFileInput();
        if (advancedFileInput && advancedFileInput.nativeElement) {
            this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again
            advancedFileInput.nativeElement.value = '';
        }
    }

    hasFiles(): boolean {
        return this._files && this._files.length > 0;
    }

    hasUploadedFiles() {
        return this.uploadedFiles && this.uploadedFiles.length > 0;
    }

    onDragEnter(e: DragEvent) {
        if (!this.disabled()) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragOver(e: DragEvent) {
        if (!this.disabled()) {
            !this.$unstyled() && addClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', true);
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragLeave(event: DragEvent) {
        if (!this.disabled()) {
            !this.$unstyled() && removeClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', false);
        }
    }

    onDrop(event: any) {
        if (!this.disabled()) {
            !this.$unstyled() && removeClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', false);
            event.stopPropagation();
            event.preventDefault();

            let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            let allowDrop = this.multiple() || (files && files.length === 1);

            if (allowDrop) {
                this.onFileSelect(event);
            }
        }
    }

    onFocus() {
        this.focus = true;
    }

    onBlur() {
        this.focus = false;
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.getTranslation(TranslationKeys.FILE_SIZE_TYPES);

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = (bytes / Math.pow(k, i)).toFixed(dm);

        return `${formattedSize} ${sizes[i]}`;
    }

    upload() {
        if (this.hasFiles()) this.uploader();
    }

    onBasicUploaderClick() {
        this.basicFileInput()?.nativeElement.click();
    }

    onBasicKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Space':
            case 'Enter':
                this.onBasicUploaderClick();

                event.preventDefault();
                break;
        }
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
}

@NgModule({
    imports: [FileUpload, SharedModule],
    exports: [FileUpload, SharedModule]
})
export class FileUploadModule {}
