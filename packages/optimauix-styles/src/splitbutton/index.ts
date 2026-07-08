export const style = /*css*/ `
    .p-splitbutton {
        display: inline-flex;
        position: relative;
        border-radius: dt('splitbutton.border.radius');
    }

    .p-splitbutton-button.p-button {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
        border-inline-end: 0 none;
    }

    .p-splitbutton-button.p-button:focus-visible,
    .p-splitbutton-dropdown.p-button:focus-visible {
        z-index: 1;
    }

    .p-splitbutton-button.p-button:not(:disabled):hover,
    .p-splitbutton-button.p-button:not(:disabled):active {
        border-inline-end: 0 none;
    }

    .p-splitbutton-dropdown.p-button {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    .p-splitbutton .p-menu {
        min-width: 100%;
    }

    .p-splitbutton-fluid {
        display: flex;
    }

    .p-splitbutton-rounded .p-splitbutton-dropdown.p-button {
        border-start-end-radius: dt('splitbutton.rounded.border.radius');
        border-end-end-radius: dt('splitbutton.rounded.border.radius');
    }

    .p-splitbutton-rounded .p-splitbutton-button.p-button {
        border-start-start-radius: dt('splitbutton.rounded.border.radius');
        border-end-start-radius: dt('splitbutton.rounded.border.radius');
    }

    .p-splitbutton-raised {
        box-shadow: dt('splitbutton.raised.shadow');
    }
`;
