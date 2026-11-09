// Template members are signal queries (`contentChild<TemplateRef<Ctx>>('name')`), so TypeDoc reports them as
// `Signal<TemplateRef<Ctx>>`, sometimes through the `Nullable<>` alias. The API docs describe the TemplateRef a
// consumer provides, so these wrappers come off before the type is published or its context is extracted.
const WRAPPER = /^(?:Signal|Nullable)<(.+?)(?:\s*\|\s*(?:undefined|null))*>$/;

export function templateRefType(type) {
    if (!type) return type;
    let unwrapped = type;
    for (let match = unwrapped.match(WRAPPER); match; match = unwrapped.match(WRAPPER)) unwrapped = match[1];
    return unwrapped;
}

export function templateContextType(type) {
    return templateRefType(type)?.match(/^TemplateRef<(.+)>$/)?.[1] ?? 'unknown';
}
