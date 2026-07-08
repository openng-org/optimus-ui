import type { TreeTokenSections } from '@primeuix/themes/types/tree';

export * from '@primeuix/themes/types/tree';

declare const root: TreeTokenSections.Root;
declare const node: TreeTokenSections.Node;
declare const nodeIcon: TreeTokenSections.NodeIcon;
declare const nodeToggleButton: TreeTokenSections.NodeToggleButton;
declare const loadingIcon: TreeTokenSections.LoadingIcon;
declare const filter: TreeTokenSections.Filter;
declare const _default: {
    root: TreeTokenSections.Root;
    node: TreeTokenSections.Node;
    nodeIcon: TreeTokenSections.NodeIcon;
    nodeToggleButton: TreeTokenSections.NodeToggleButton;
    loadingIcon: TreeTokenSections.LoadingIcon;
    filter: TreeTokenSections.Filter;
};

export { _default as default, filter, loadingIcon, node, nodeIcon, nodeToggleButton, root };
