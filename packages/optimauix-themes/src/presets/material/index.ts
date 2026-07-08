import type { Preset } from '@primeuix/themes/types';
import type { MaterialBaseDesignTokens } from './base/index.d';

import accordion from '@primeuix/themes/material/accordion';
import autocomplete from '@primeuix/themes/material/autocomplete';
import avatar from '@primeuix/themes/material/avatar';
import badge from '@primeuix/themes/material/badge';
import base from '@primeuix/themes/material/base';
import blockui from '@primeuix/themes/material/blockui';
import breadcrumb from '@primeuix/themes/material/breadcrumb';
import button from '@primeuix/themes/material/button';
import card from '@primeuix/themes/material/card';
import carousel from '@primeuix/themes/material/carousel';
import cascadeselect from '@primeuix/themes/material/cascadeselect';
import checkbox from '@primeuix/themes/material/checkbox';
import chip from '@primeuix/themes/material/chip';
import colorpicker from '@primeuix/themes/material/colorpicker';
import confirmdialog from '@primeuix/themes/material/confirmdialog';
import confirmpopup from '@primeuix/themes/material/confirmpopup';
import contextmenu from '@primeuix/themes/material/contextmenu';
import datatable from '@primeuix/themes/material/datatable';
import dataview from '@primeuix/themes/material/dataview';
import datepicker from '@primeuix/themes/material/datepicker';
import dialog from '@primeuix/themes/material/dialog';
import divider from '@primeuix/themes/material/divider';
import dock from '@primeuix/themes/material/dock';
import drawer from '@primeuix/themes/material/drawer';
import editor from '@primeuix/themes/material/editor';
import fieldset from '@primeuix/themes/material/fieldset';
import fileupload from '@primeuix/themes/material/fileupload';
import floatlabel from '@primeuix/themes/material/floatlabel';
import galleria from '@primeuix/themes/material/galleria';
import iconfield from '@primeuix/themes/material/iconfield';
import iftalabel from '@primeuix/themes/material/iftalabel';
import image from '@primeuix/themes/material/image';
import imagecompare from '@primeuix/themes/material/imagecompare';
import inlinemessage from '@primeuix/themes/material/inlinemessage';
import inplace from '@primeuix/themes/material/inplace';
import inputchips from '@primeuix/themes/material/inputchips';
import inputgroup from '@primeuix/themes/material/inputgroup';
import inputnumber from '@primeuix/themes/material/inputnumber';
import inputotp from '@primeuix/themes/material/inputotp';
import inputtext from '@primeuix/themes/material/inputtext';
import knob from '@primeuix/themes/material/knob';
import listbox from '@primeuix/themes/material/listbox';
import megamenu from '@primeuix/themes/material/megamenu';
import menu from '@primeuix/themes/material/menu';
import menubar from '@primeuix/themes/material/menubar';
import message from '@primeuix/themes/material/message';
import metergroup from '@primeuix/themes/material/metergroup';
import multiselect from '@primeuix/themes/material/multiselect';
import orderlist from '@primeuix/themes/material/orderlist';
import organizationchart from '@primeuix/themes/material/organizationchart';
import overlaybadge from '@primeuix/themes/material/overlaybadge';
import paginator from '@primeuix/themes/material/paginator';
import panel from '@primeuix/themes/material/panel';
import panelmenu from '@primeuix/themes/material/panelmenu';
import password from '@primeuix/themes/material/password';
import picklist from '@primeuix/themes/material/picklist';
import popover from '@primeuix/themes/material/popover';
import progressbar from '@primeuix/themes/material/progressbar';
import progressspinner from '@primeuix/themes/material/progressspinner';
import radiobutton from '@primeuix/themes/material/radiobutton';
import rating from '@primeuix/themes/material/rating';
import ripple from '@primeuix/themes/material/ripple';
import scrollpanel from '@primeuix/themes/material/scrollpanel';
import select from '@primeuix/themes/material/select';
import selectbutton from '@primeuix/themes/material/selectbutton';
import skeleton from '@primeuix/themes/material/skeleton';
import slider from '@primeuix/themes/material/slider';
import speeddial from '@primeuix/themes/material/speeddial';
import splitbutton from '@primeuix/themes/material/splitbutton';
import splitter from '@primeuix/themes/material/splitter';
import stepper from '@primeuix/themes/material/stepper';
import steps from '@primeuix/themes/material/steps';
import tabmenu from '@primeuix/themes/material/tabmenu';
import tabs from '@primeuix/themes/material/tabs';
import tabview from '@primeuix/themes/material/tabview';
import tag from '@primeuix/themes/material/tag';
import terminal from '@primeuix/themes/material/terminal';
import textarea from '@primeuix/themes/material/textarea';
import tieredmenu from '@primeuix/themes/material/tieredmenu';
import timeline from '@primeuix/themes/material/timeline';
import toast from '@primeuix/themes/material/toast';
import togglebutton from '@primeuix/themes/material/togglebutton';
import toggleswitch from '@primeuix/themes/material/toggleswitch';
import toolbar from '@primeuix/themes/material/toolbar';
import tooltip from '@primeuix/themes/material/tooltip';
import tree from '@primeuix/themes/material/tree';
import treeselect from '@primeuix/themes/material/treeselect';
import treetable from '@primeuix/themes/material/treetable';
import virtualscroller from '@primeuix/themes/material/virtualscroller';

export default {
    ...base,
    components: {
        accordion,
        autocomplete,
        avatar,
        badge,
        blockui,
        breadcrumb,
        button,
        datepicker,
        card,
        carousel,
        cascadeselect,
        checkbox,
        chip,
        colorpicker,
        confirmdialog,
        confirmpopup,
        contextmenu,
        dataview,
        datatable,
        dialog,
        divider,
        dock,
        drawer,
        editor,
        fieldset,
        fileupload,
        iftalabel,
        floatlabel,
        galleria,
        iconfield,
        image,
        imagecompare,
        inlinemessage,
        inplace,
        inputchips,
        inputgroup,
        inputnumber,
        inputotp,
        inputtext,
        knob,
        listbox,
        megamenu,
        menu,
        menubar,
        message,
        metergroup,
        multiselect,
        orderlist,
        organizationchart,
        overlaybadge,
        popover,
        paginator,
        password,
        panel,
        panelmenu,
        picklist,
        progressbar,
        progressspinner,
        radiobutton,
        rating,
        ripple,
        scrollpanel,
        select,
        selectbutton,
        skeleton,
        slider,
        speeddial,
        splitter,
        splitbutton,
        stepper,
        steps,
        tabmenu,
        tabs,
        tabview,
        textarea,
        tieredmenu,
        tag,
        terminal,
        timeline,
        togglebutton,
        toggleswitch,
        tree,
        treeselect,
        treetable,
        toast,
        toolbar,
        tooltip,
        virtualscroller
    }
} satisfies Preset<MaterialBaseDesignTokens>;
