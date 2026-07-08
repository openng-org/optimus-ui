export const style = /*css*/ `
    .p-metergroup {
        display: flex;
        gap: dt('metergroup.gap');
    }

    .p-metergroup-meters {
        display: flex;
        background: dt('metergroup.meters.background');
        border-radius: dt('metergroup.border.radius');
    }

    .p-metergroup-label-list {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .p-metergroup-label {
        display: inline-flex;
        align-items: center;
        gap: dt('metergroup.label.gap');
    }

    .p-metergroup-label-marker {
        display: inline-flex;
        width: dt('metergroup.label.marker.size');
        height: dt('metergroup.label.marker.size');
        border-radius: 100%;
    }

    .p-metergroup-label-icon {
        font-size: dt('metergroup.label.icon.size');
        width: dt('metergroup.label.icon.size');
        height: dt('metergroup.label.icon.size');
    }

    .p-metergroup-horizontal {
        flex-direction: column;
    }

    .p-metergroup-label-list-horizontal {
        gap: dt('metergroup.label.list.horizontal.gap');
    }

    .p-metergroup-horizontal .p-metergroup-meters {
        height: dt('metergroup.meters.size');
    }

    .p-metergroup-horizontal .p-metergroup-meter:first-of-type {
        border-start-start-radius: dt('metergroup.border.radius');
        border-end-start-radius: dt('metergroup.border.radius');
    }

    .p-metergroup-horizontal .p-metergroup-meter:last-of-type {
        border-start-end-radius: dt('metergroup.border.radius');
        border-end-end-radius: dt('metergroup.border.radius');
    }

    .p-metergroup-vertical {
        flex-direction: row;
    }

    .p-metergroup-label-list-vertical {
        flex-direction: column;
        gap: dt('metergroup.label.list.vertical.gap');
    }

    .p-metergroup-vertical .p-metergroup-meters {
        flex-direction: column;
        width: dt('metergroup.meters.size');
        height: 100%;
    }

    .p-metergroup-vertical .p-metergroup-label-list {
        align-items: flex-start;
    }

    .p-metergroup-vertical .p-metergroup-meter:first-of-type {
        border-start-start-radius: dt('metergroup.border.radius');
        border-start-end-radius: dt('metergroup.border.radius');
    }

    .p-metergroup-vertical .p-metergroup-meter:last-of-type {
        border-end-start-radius: dt('metergroup.border.radius');
        border-end-end-radius: dt('metergroup.border.radius');
    }
`;
