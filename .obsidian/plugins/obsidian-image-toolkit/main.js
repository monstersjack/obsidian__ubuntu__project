'use strict';

var obsidian = require('obsidian');
var crypto = require('crypto');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// English
var en = {
    // >>>Common Settings:
    VIEW_MODE_NAME: 'Choose a mode to view images',
    VIEW_MODE_NORMAL: '🖼 Normal',
    VIEW_MODE_PIN: '📌 Pin',
    RESET: 'reset to default',
    // >>>View Trigger Settings:
    VIEW_TRIGGER_SETTINGS: 'View trigger',
    VIEW_IMAGE_GLOBAL_NAME: 'Click and view an image globally',
    VIEW_IMAGE_GLOBAL_DESC: 'You can zoom, rotate, drag, and invert it on the popup layer when clicking an image.',
    VIEW_IMAGE_IN_EDITOR_NAME: 'Click and view an image in the Editor Area',
    VIEW_IMAGE_IN_EDITOR_DESC: 'Turn on this option if you want to click and view an image in the Editor Area.',
    // CPB = COMMUNITY_PLUGINS_BROWSER
    VIEW_IMAGE_IN_CPB_NAME: 'Click and view an image in the Community Plugins browser',
    VIEW_IMAGE_IN_CPB_DESC: 'Turn on this option if you want to click and view an image in the Community Plugins browser.',
    VIEW_IMAGE_WITH_A_LINK_NAME: 'Click and view an image with a link',
    VIEW_IMAGE_WITH_A_LINK_DESC: 'Turn on this option if you want to click and view an image with a link. (NOTE: The browser will be opened for you to visit the link and the image will be popped up for being viewed at the same time when you click the image.)',
    VIEW_IMAGE_OTHER_NAME: 'Click and view in the other areas except the above',
    VIEW_IMAGE_OTHER_DESC: 'Except for the above mentioned, it also supports other areas, like some modal user interface components.',
    // >>> PIN_MODE_SETTINGS
    PIN_MODE_SETTINGS: "Pin mode",
    PIN_MODE_NAME: "📌 Pin an image",
    PIN_MODE_DESC: "You can pin an image onto the top of the screen. And have more options by right click. (press Esc to close the image where your mouse cursor is hovering)",
    PIN_MAXIMUM_NAME: "The maximum images you can pin",
    PIN_COVER_NAME: "Cover mode",
    PIN_COVER_DESC: "After those pinned images reach maximum, you can cover the earliest pinned image when you click an image once again.",
    PIN_MAXIMUM_NOTICE: "Exceeded maximum images you can pin (non cover mode)",
    // >>>View Detail Settings:
    VIEW_DETAILS_SETTINGS: 'View details',
    IMAGE_MOVE_SPEED_NAME: 'Set the moving speed of the image',
    IMAGE_MOVE_SPEED_DESC: 'When you move an image on the popup layer by keyboard (up, down, left, right), the moving speed of the image can be set here.',
    IMAGE_TIP_TOGGLE_NAME: "Display the image's zoom number",
    IMAGE_TIP_TOGGLE_DESC: "Turn on this option if you want to display the zoom number when you zoom the image.",
    IMG_FULL_SCREEN_MODE_NAME: 'Full-screen preview mode',
    // preview mode options:
    FIT: 'Fit',
    FILL: 'Fill',
    STRETCH: 'Stretch',
    IMG_VIEW_BACKGROUND_COLOR_NAME: "Background color of the previewed image (Only support the image with transparent background)",
    // >>>Image Border Settings:
    IMAGE_BORDER_SETTINGS: 'Image border',
    IMAGE_BORDER_TOGGLE_NAME: "Display the image's border",
    IMAGE_BORDER_TOGGLE_DESC: "The clicked image's border can be displayed after you exit previewing and close the popup layer.",
    IMAGE_BORDER_WIDTH_NAME: "Image border width",
    IMAGE_BORDER_STYLE_NAME: "Image border style",
    IMAGE_BORDER_COLOR_NAME: "Image border color",
    // IMG_BORDER_WIDTH options:
    THIN: 'thin',
    MEDIUM: 'medium',
    THICK: 'thick',
    // IMG_BORDER_STYLE options:
    //HIDDEN: 'hidden',
    DOTTED: 'dotted',
    DASHED: 'dashed',
    SOLID: 'solid',
    DOUBLE: 'double',
    GROOVE: 'groove',
    RIDGE: 'ridge',
    INSET: 'inset',
    OUTSET: 'outset',
    // IMAGE_BORDER_COLOR_NAME options:
    BLACK: 'black',
    BLUE: 'blue',
    DARK_GREEN: 'dark green',
    GREEN: 'green',
    LIME: 'lime',
    STEEL_BLUE: 'steel blue',
    INDIGO: 'indigo',
    PURPLE: 'purple',
    GRAY: 'gray',
    DARK_RED: 'dark red',
    LIGHT_GREEN: 'light green',
    BROWN: 'brown',
    LIGHT_BLUE: 'light blue',
    SILVER: 'silver',
    RED: 'red',
    PINK: 'pink',
    ORANGE: 'orange',
    GOLD: 'gold',
    YELLOW: 'yellow',
    // >>>Gallery Navbar Settings:
    GALLERY_NAVBAR_SETTINGS: 'Gallery navbar (experimental)',
    GALLERY_NAVBAR_TOGGLE_NAME: "Display gallery navbar",
    GALLERY_NAVBAR_TOGGLE_DESC: "All of the images in the current pane view can be displayed at the bottom of the popup layer.",
    GALLERY_NAVBAR_DEFAULT_COLOR_NAME: "Background color of the gallery navbar (default state)",
    GALLERY_NAVBAR_HOVER_COLOR_NAME: "Background color of the gallery navbar (hovering state)",
    GALLERY_IMG_BORDER_TOGGLE_NAME: "Display the selected image on the gallery navbar",
    GALLERY_IMG_BORDER_TOGGLE_DESC: "When you select an image, the image's border will be displayed, so you can know which image is currently active.",
    GALLERY_IMG_BORDER_ACTIVE_COLOR_NAME: 'Border color of the selected image',
    // >>>HOTKEYS_SETTINGS:
    HOTKEY_SETTINGS: "Hotkeys",
    HOTKEY_SETTINGS_DESC: "📢 You cannot set the same hotkey for 'Move the image' and 'Switch the image' at the same time. (NOT SUPPORT in Pin Mode)",
    MOVE_THE_IMAGE_NAME: "Hotkey for moving the image",
    MOVE_THE_IMAGE_DESC: "You can move the image on the popup layer by hotkey.",
    SWITCH_THE_IMAGE_NAME: "Hotkey for switching the image",
    SWITCH_THE_IMAGE_DESC: "You can switch to the previous/next image on the gallery navbar by hotkey. (NOTE: You need to turn on 'Display gallery navbar' first, if you wanna use this hotkey.)",
    DOUBLE_CLICK_TOOLBAR_NAME: "Double click",
    VIEW_TRIGGER_HOTKEY_NAME: "Hotkey for triggering viewing an image",
    VIEW_TRIGGER_HOTKEY_DESC: "When you set 'None', you can directly click and preview an image without holding any modifier keys; otherwise, you must hold the configured modifier keys to click and preview an image.",
    // MODIFIER_HOTKEYS
    NONE: "None",
    CTRL: "Ctrl",
    ALT: "Alt",
    SHIFT: "Shift",
    CTRL_ALT: "Ctrl+Alt",
    CTRL_SHIFT: "Ctrl+Shift",
    SHIFT_ALT: "Shift+Alt",
    CTRL_SHIFT_ALT: "Ctrl+Shift+Alt",
    // toolbar icon title
    ZOOM_TO_100: "zoom to 100%",
    ZOOM_IN: "zoom in",
    ZOOM_OUT: "zoom out",
    FULL_SCREEN: 'full screen',
    REFRESH: "refresh",
    ROTATE_LEFT: "rotate left",
    ROTATE_RIGHT: "rotate right",
    SCALE_X: 'flip along x-axis',
    SCALE_Y: 'flip along y-axis',
    INVERT_COLOR: 'invert color',
    COPY: 'copy',
    CLOSE: 'close',
    // tip:
    COPY_IMAGE_SUCCESS: 'Copy the image successfully!',
    COPY_IMAGE_ERROR: 'Fail to copy the image!'
};

// 简体中文
var zhCN = {
    VIEW_MODE_NAME: '选择查看模式',
    VIEW_MODE_NORMAL: '🖼 普通',
    VIEW_MODE_PIN: '📌 贴图',
    // >>> 预览触发配置：
    VIEW_TRIGGER_SETTINGS: '预览触发配置',
    VIEW_IMAGE_GLOBAL_NAME: '支持全局预览图片',
    VIEW_IMAGE_GLOBAL_DESC: '开启后，在任何地方点击图片都可以弹出预览界面，可对图片进行缩放、旋转、拖动、和反色等。',
    VIEW_IMAGE_IN_EDITOR_NAME: '支持在编辑区域预览图片',
    VIEW_IMAGE_IN_EDITOR_DESC: '开启后，支持在编辑区域，点击图片预览。',
    // CPB = COMMUNITY_PLUGINS_BROWSER
    VIEW_IMAGE_IN_CPB_NAME: '支持在社区插件页面预览图片',
    VIEW_IMAGE_IN_CPB_DESC: '开启后，支持在社区插件页面，点击图片预览。',
    VIEW_IMAGE_WITH_A_LINK_NAME: '支持预览带链接的图片',
    VIEW_IMAGE_WITH_A_LINK_DESC: '开启后，支持点击带链接的图片（注意：点击该图片，会同时打开浏览器访问指定地址和弹出预览图片）',
    VIEW_IMAGE_OTHER_NAME: '支持除上述其他地方来预览图片',
    VIEW_IMAGE_OTHER_DESC: '除上述支持范围外，还支持一些其他区域，如Modal用户界面组件。',
    // >>> PIN_MODE_SETTINGS
    PIN_MODE_SETTINGS: "贴图模式设置",
    PIN_MODE_NAME: "📌 将所点击的图片贴到屏幕上",
    PIN_MODE_DESC: "你可以将当前所点击的图片贴到屏幕上，并且可以通过右击图片选择更多操作（按 Esc 关闭已贴图片的展示）",
    PIN_MAXIMUM_NAME: "最大贴图数量",
    PIN_COVER_NAME: "覆盖模式",
    PIN_COVER_DESC: "当贴图数量达到最大值后，此时再次点击图片，该图片会覆盖最早弹出的那个贴图。",
    PIN_MAXIMUM_NOTICE: "超过最大Pin图设置（非覆盖模式）",
    // >>>查看细节设置：
    VIEW_DETAILS_SETTINGS: '查看细节设置',
    IMAGE_MOVE_SPEED_NAME: '图片移动速度设置',
    IMAGE_MOVE_SPEED_DESC: '当使用键盘（上、下、左、右）移动图片时，可对图片移动速度进行设置。',
    IMAGE_TIP_TOGGLE_NAME: "展示缩放比例提示",
    IMAGE_TIP_TOGGLE_DESC: "开启后，当你缩放图片时会展示当前缩放的比例。",
    IMG_FULL_SCREEN_MODE_NAME: '全屏预览模式',
    // 全屏预览模式 下拉：
    FIT: '自适应',
    FILL: '填充',
    STRETCH: '拉伸',
    IMG_VIEW_BACKGROUND_COLOR_NAME: "设置预览图片的背景色（仅对透明背景的图片生效）",
    // >>>图片边框设置：
    IMAGE_BORDER_SETTINGS: '图片边框设置',
    IMAGE_BORDER_TOGGLE_NAME: "展示被点击图片的边框",
    IMAGE_BORDER_TOGGLE_DESC: "当离开图片预览和关闭弹出层后，突出展示被点击图片的边框。",
    IMAGE_BORDER_WIDTH_NAME: "设置图片边框宽度",
    IMAGE_BORDER_STYLE_NAME: "设置图片边框样式",
    IMAGE_BORDER_COLOR_NAME: "设置图片边框颜色",
    // IMG_BORDER_WIDTH 下拉：
    THIN: '较细',
    MEDIUM: '正常',
    THICK: '较粗',
    // IMG_BORDER_STYLE  下拉：
    //HIDDEN: '隐藏',
    DOTTED: '点状',
    DASHED: '虚线',
    SOLID: '实线',
    DOUBLE: '双线',
    GROOVE: '凹槽',
    RIDGE: ' 垄状',
    INSET: '凹边',
    OUTSET: '凸边',
    // IMAGE_BORDER_COLOR_NAME  下拉：
    BLACK: '黑色',
    BLUE: '蓝色',
    DARK_GREEN: '深绿色',
    GREEN: '绿色',
    LIME: '淡黄绿色',
    STEEL_BLUE: '钢青色',
    INDIGO: '靛蓝色',
    PURPLE: '紫色',
    GRAY: '灰色',
    DARK_RED: '深红色',
    LIGHT_GREEN: '浅绿色',
    BROWN: '棕色',
    LIGHT_BLUE: '浅蓝色',
    SILVER: '银色',
    RED: '红色',
    PINK: '粉红色',
    ORANGE: '橘黄色',
    GOLD: '金色',
    YELLOW: '黄色',
    // >>>Gallery Navbar Settings:
    GALLERY_NAVBAR_SETTINGS: '图片导航设置 (体验版)',
    GALLERY_NAVBAR_TOGGLE_NAME: "展示图片导航",
    GALLERY_NAVBAR_TOGGLE_DESC: "当前文档的所有图片会展示在弹出层的底部，可随意切换展示不同图片。",
    GALLERY_NAVBAR_DEFAULT_COLOR_NAME: "设置图片导航底栏背景色（默认展示）",
    GALLERY_NAVBAR_HOVER_COLOR_NAME: "设置图片导航底栏背景色（鼠标悬浮时）",
    GALLERY_IMG_BORDER_TOGGLE_NAME: "展示图片导航上被选中的图片",
    GALLERY_IMG_BORDER_TOGGLE_DESC: "当你选中正查看某一图片，对应图片导航底栏上将突出显示该缩略图片的边框。",
    GALLERY_IMG_BORDER_ACTIVE_COLOR_NAME: '设置被选中图片的边框色',
    // >>>HOTKEYS_SETTINGS:
    HOTKEY_SETTINGS: "快捷键设置",
    HOTKEY_SETTINGS_DESC: "📢  你无法为'移动图片'和'切换图片'设置相同的快捷键。（不支持贴图模式）",
    MOVE_THE_IMAGE_NAME: "为移动图片设置快捷键",
    MOVE_THE_IMAGE_DESC: "你可以利用快捷键来移动弹出层上的图片。",
    SWITCH_THE_IMAGE_NAME: "为切换图片设置快捷键",
    SWITCH_THE_IMAGE_DESC: "你可以利用快捷键来切换在图片导航栏上的图片至上一张/下一张。(注意: 仅当开启“展示图片导航”后，才能使用该快捷键来控制切换图片。)",
    DOUBLE_CLICK_TOOLBAR_NAME: "双击",
    VIEW_TRIGGER_HOTKEY_NAME: "为触发弹出查看图片设置快捷键",
    VIEW_TRIGGER_HOTKEY_DESC: "当你设置为“无”，你可以直接点击预览图片；否则，须按住已配置的修改键（Ctrl、Alt、Shift）才能点击查看某个图片。",
    // MODIFIER_HOTKEYS
    NONE: "无",
    // toolbar icon title
    ZOOM_TO_100: "缩放至100%",
    ZOOM_IN: "放大",
    ZOOM_OUT: "缩小",
    FULL_SCREEN: "全屏",
    REFRESH: "刷新",
    ROTATE_LEFT: "左旋",
    ROTATE_RIGHT: "右旋",
    SCALE_X: 'x轴翻转',
    SCALE_Y: 'y轴翻转',
    INVERT_COLOR: '反色',
    COPY: '复制',
    CLOSE: '关闭',
    // tip:
    COPY_IMAGE_SUCCESS: '拷贝图片成功！',
    COPY_IMAGE_ERROR: '拷贝图片失败！'
};

// 繁體中文
var zhTW = {
    // toolbar icon title
    ZOOM_IN: "放大",
    ZOOM_OUT: "縮小",
    FULL_SCREEN: '全螢幕',
    REFRESH: "重整",
    ROTATE_LEFT: "向左旋轉",
    ROTATE_RIGHT: "向右旋轉",
    SCALE_X: 'x 軸縮放',
    SCALE_Y: 'y 軸縮放',
    INVERT_COLOR: '色彩反轉',
    COPY: '複製',
    COPY_IMAGE_SUCCESS: '成功複製圖片！'
};

const localeMap = {
    en,
    "zh-cn": zhCN,
    "zh-tw": zhTW,
};
const locale = localeMap[obsidian.moment.locale()];
function t(str) {
    if (!locale) {
        console.error("[oit] Image toolkit locale not found", obsidian.moment.locale());
    }
    return (locale && locale[str]) || en[str];
}

var ViewMode;
(function (ViewMode) {
    ViewMode["Normal"] = "Normal";
    ViewMode["Pin"] = "Pin";
})(ViewMode || (ViewMode = {}));
const DEFAULT_VIEW_MODE = ViewMode.Normal;
const OIT_CLASS = {
    CONTAINER_ROOT: 'oit',
    CONTAINER_NORMAL: 'oit-normal',
    CONTAINER_PIN: 'oit-pin',
    // the place for storing images
    IMG_CONTAINER: 'oit-img-container',
    IMG_VIEW: 'oit-img-view',
    IMG_TTP: 'oit-img-tip',
    IMG_FOOTER: 'oit-img-footer',
    IMG_TITLE: 'oit-img-title',
    IMG_TITLE_NAME: 'oit-img-title-name',
    IMG_TITLE_INDEX: 'oit-img-title-index',
    IMG_TOOLBAR: 'oit-img-toolbar',
    IMG_PLAYER: 'img-player',
    IMG_FULLSCREEN: 'img-fullscreen',
};
const ZOOM_FACTOR = 0.8;
const IMG_VIEW_MIN = 30;
const ICONS = [{
        id: 'zoom-to-100',
        svg: `<g> <path id="svg_1" d="m42,6c-18.8,0 -34,15.2 -34,34s15.2,34 34,34c7.4,0 14.3,-2.4 19.9,-6.4l26.3,26.3l5.6,-5.6l-26,-26.1c5.1,-6 8.2,-13.7 8.2,-22.1c0,-18.9 -15.2,-34.1 -34,-34.1zm0,4c16.6,0 30,13.4 30,30s-13.4,30 -30,30s-30,-13.4 -30,-30s13.4,-30 30,-30z" stroke-width="2" stroke="currentColor" fill="currentColor"/> <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_2" y="48.5" x="24" stroke-width="0" stroke="#000" fill="#000000">1:1</text> </g>`
    }];
const SEPARATOR_SYMBOL = "---";
const TOOLBAR_CONF = [{
        title: "ZOOM_TO_100",
        class: 'toolbar_zoom_to_100',
        icon: 'zoom-to-100',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: "ZOOM_IN",
        class: 'toolbar_zoom_in',
        icon: 'zoom-in',
        enableToolbarIcon: true,
        enableMenu: false,
        enableHotKey: true
    }, {
        title: "ZOOM_OUT",
        class: 'toolbar_zoom_out',
        icon: 'zoom-out',
        enableToolbarIcon: true,
        enableMenu: false,
        enableHotKey: true
    }, {
        title: "FULL_SCREEN",
        class: 'toolbar_full_screen',
        icon: 'expand',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: "REFRESH",
        class: 'toolbar_refresh',
        icon: 'refresh-ccw',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: "ROTATE_LEFT",
        class: 'toolbar_rotate_left',
        icon: 'rotate-ccw',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: "ROTATE_RIGHT",
        class: 'toolbar_rotate_right',
        icon: 'rotate-cw',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: "SCALE_X",
        class: 'toolbar_scale_x',
        icon: 'move-horizontal',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: "SCALE_Y",
        class: 'toolbar_scale_y',
        icon: 'move-vertical',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: "INVERT_COLOR",
        class: 'toolbar_invert_color',
        icon: 'droplet',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: "COPY",
        class: 'toolbar_copy',
        icon: 'copy',
        enableToolbarIcon: true,
        enableMenu: true,
        enableHotKey: true
    }, {
        title: SEPARATOR_SYMBOL,
        enableToolbarIcon: false,
        enableMenu: true,
        enableHotKey: false
    }, {
        title: "CLOSE",
        class: 'toolbar_close',
        icon: 'trash',
        enableToolbarIcon: false,
        enableMenu: true,
        enableHotKey: true
    }];
const IMG_FULL_SCREEN_MODE = {
    FIT: 'FIT',
    FILL: 'FILL',
    STRETCH: 'STRETCH'
};
const VIEW_IMG_SELECTOR = {
    EDITOR_AREAS: `.workspace-leaf-content[data-type='markdown'] img,.workspace-leaf-content[data-type='image'] img`,
    EDITOR_AREAS_NO_LINK: `.workspace-leaf-content[data-type='markdown'] img:not(a img),.workspace-leaf-content[data-type='image'] img:not(a img)`,
    CPB: `.community-modal-details img`,
    CPB_NO_LINK: `.community-modal-details img:not(a img)`,
    OTHER: `.modal-content img`,
    OTHER_NO_LINK: `.modal-content img:not(a img)`,
};
const IMG_BORDER_WIDTH = {
    THIN: 'thin',
    MEDIUM: 'medium',
    THICK: 'thick'
};
const IMG_BORDER_STYLE = {
    // HIDDEN: 'hidden',
    DOTTED: 'dotted',
    DASHED: 'dashed',
    SOLID: 'solid',
    DOUBLE: 'double',
    GROOVE: 'groove',
    RIDGE: 'ridge',
    INSET: 'inset',
    OUTSET: 'outset'
};
// https://www.runoob.com/cssref/css-colorsfull.html
const IMG_BORDER_COLOR = {
    BLACK: 'black',
    BLUE: 'blue',
    DARK_GREEN: 'darkgreen',
    GREEN: 'green',
    LIME: 'lime',
    STEEL_BLUE: 'steelblue',
    INDIGO: 'indigo',
    PURPLE: 'purple',
    GRAY: 'gray',
    DARK_RED: 'darkred',
    LIGHT_GREEN: 'lightgreen',
    BROWN: 'brown',
    LIGHT_BLUE: 'lightblue',
    SILVER: 'silver',
    RED: 'red',
    PINK: 'pink',
    ORANGE: 'orange',
    GOLD: 'gold',
    YELLOW: 'yellow'
};
const GALLERY_NAVBAR_DEFAULT_COLOR = '#0000001A'; // rgba(0, 0, 0, 0.1)
const GALLERY_NAVBAR_HOVER_COLOR = '#0000004D'; // rgba(0, 0, 0, 0.3)
const GALLERY_IMG_BORDER_ACTIVE_COLOR = '#FF0000'; // red
const MODIFIER_HOTKEYS = {
    NONE: "NONE",
    CTRL: "CTRL",
    ALT: "ALT",
    SHIFT: "SHIFT",
    CTRL_ALT: "CTRL_ALT",
    CTRL_SHIFT: "CTRL_SHIFT",
    SHIFT_ALT: "SHIFT_ALT",
    CTRL_SHIFT_ALT: "CTRL_SHIFT_ALT"
};
const MOVE_THE_IMAGE = {
    CODE: "MOVE_THE_IMAGE",
    DEFAULT_HOTKEY: MODIFIER_HOTKEYS.NONE,
    SVG: `<svg width="56" height="37" xmlns="http://www.w3.org/2000/svg" class="icon"><path fill="none" d="M-1 -1H57V38H-1z"/><g><path stroke="null" fill="#707070" d="M19.001 16.067V1.928C19.001.864 19.865 0 20.93 0h14.142c1.064 0 1.928.864 1.928 1.928v14.14a1.929 1.929 0 01-1.928 1.927H20.929a1.929 1.929 0 01-1.928-1.928zm4.805-5.909l2.908-3.032v7.334c0 .535.43.964.965.964h.642c.535 0 .965-.43.965-.964V7.126l2.908 3.032a.965.965 0 001.378.017l.438-.442a.96.96 0 000-1.362l-5.327-5.33a.96.96 0 00-1.362 0l-5.335 5.33a.96.96 0 000 1.362l.438.441a.97.97 0 001.382-.016zM36.999 20.933v14.139A1.929 1.929 0 0135.07 37H20.929a1.929 1.929 0 01-1.928-1.928v-14.14c0-1.064.864-1.927 1.928-1.927h14.142c1.064 0 1.928.863 1.928 1.928zm-4.805 5.909l-2.908 3.032V22.54a.962.962 0 00-.965-.964h-.642a.962.962 0 00-.965.964v7.334l-2.908-3.032a.965.965 0 00-1.378-.016l-.438.441a.96.96 0 000 1.362l5.327 5.33a.96.96 0 001.362 0l5.335-5.33a.96.96 0 000-1.362l-.438-.441a.97.97 0 00-1.382.016zM16.068 37.001H1.93a1.929 1.929 0 01-1.928-1.928V20.932c0-1.065.864-1.928 1.928-1.928h14.14c1.064 0 1.927.863 1.927 1.928v14.14a1.929 1.929 0 01-1.928 1.93zm-5.908-4.804l-3.033-2.909h7.335c.534 0 .964-.43.964-.964v-.643a.962.962 0 00-.964-.964H7.127l3.033-2.909a.965.965 0 00.016-1.378l-.442-.438a.96.96 0 00-1.362 0l-5.33 5.327a.96.96 0 000 1.362l5.33 5.335a.96.96 0 001.362 0l.442-.438a.97.97 0 00-.016-1.381zM39.932 19.004H54.07c1.064 0 1.928.863 1.928 1.928v14.14a1.929 1.929 0 01-1.928 1.93H39.93a1.929 1.929 0 01-1.927-1.93v-14.14c0-1.065.863-1.928 1.928-1.928zm5.908 4.804l3.033 2.909h-7.335a.962.962 0 00-.964.964v.643c0 .534.43.964.964.964h7.335l-3.033 2.909a.965.965 0 00-.016 1.377l.442.438a.96.96 0 001.362 0l5.33-5.327a.96.96 0 000-1.362l-5.33-5.335a.96.96 0 00-1.362 0l-.442.438a.97.97 0 00.016 1.382z"/></g></svg>`
};
const SWITCH_THE_IMAGE = {
    CODE: "SWITCH_THE_IMAGE",
    DEFAULT_HOTKEY: MODIFIER_HOTKEYS.CTRL,
    SVG: `<svg width="37" height="18" xmlns="http://www.w3.org/2000/svg" class="icon"><path fill="none" d="M-1 -1H38V19H-1z"/><g><path stroke="null" fill="#707070" d="M16.068 17.999H1.93A1.929 1.929 0 01.001 16.07V1.929C.001.865.865.001 1.93.001h14.14c1.064 0 1.927.864 1.927 1.928v14.142a1.929 1.929 0 01-1.928 1.928zm-5.908-4.805l-3.033-2.908h7.335c.534 0 .964-.43.964-.965V8.68a.962.962 0 00-.964-.965H7.127l3.033-2.908a.965.965 0 00.016-1.378l-.442-.438a.96.96 0 00-1.362 0l-5.33 5.327a.96.96 0 000 1.362l5.33 5.335a.96.96 0 001.362 0l.442-.438a.97.97 0 00-.016-1.382zM20.932.001H35.07c1.064 0 1.928.864 1.928 1.928v14.142a1.929 1.929 0 01-1.928 1.928H20.93a1.929 1.929 0 01-1.927-1.928V1.929c0-1.064.863-1.928 1.928-1.928zm5.908 4.805l3.033 2.908h-7.335a.962.962 0 00-.964.965v.642c0 .535.43.965.964.965h7.335l-3.033 2.908a.965.965 0 00-.016 1.378l.442.438a.96.96 0 001.362 0l5.33-5.327a.96.96 0 000-1.362l-5.33-5.335a.96.96 0 00-1.362 0l-.442.438a.97.97 0 00.016 1.382z"/></g></svg>`
};
const IMG_DEFAULT_BACKGROUND_COLOR = '#00000000';

const DEFAULT_SETTINGS = {
    viewMode: ViewMode.Normal,
    viewImageInEditor: true,
    viewImageInCPB: true,
    viewImageWithLink: true,
    viewImageOther: true,
    // pinMode: false,
    pinMaximum: 3,
    pinCoverMode: true,
    imageMoveSpeed: 10,
    imgTipToggle: true,
    imgFullScreenMode: IMG_FULL_SCREEN_MODE.FIT,
    imgViewBackgroundColor: IMG_DEFAULT_BACKGROUND_COLOR,
    imageBorderToggle: false,
    imageBorderWidth: IMG_BORDER_WIDTH.MEDIUM,
    imageBorderStyle: IMG_BORDER_STYLE.SOLID,
    imageBorderColor: IMG_BORDER_COLOR.RED,
    galleryNavbarToggle: true,
    galleryNavbarDefaultColor: GALLERY_NAVBAR_DEFAULT_COLOR,
    galleryNavbarHoverColor: GALLERY_NAVBAR_HOVER_COLOR,
    galleryImgBorderActive: true,
    galleryImgBorderActiveColor: GALLERY_IMG_BORDER_ACTIVE_COLOR,
    // hotkeys conf
    moveTheImageHotkey: MOVE_THE_IMAGE.DEFAULT_HOTKEY,
    switchTheImageHotkey: SWITCH_THE_IMAGE.DEFAULT_HOTKEY,
    doubleClickToolbar: TOOLBAR_CONF[3].class,
    viewTriggerHotkey: MODIFIER_HOTKEYS.NONE
};
class ImageToolkitSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        // Common Settings:
        this.displayCommonSettings(containerEl);
        // View Trigger Settings:
        this.displayViewTriggerSettings(containerEl);
        // Pin Mode Settings:
        this.displayPinModeSettings(containerEl);
        //region >>> VIEW_DETAILS_SETTINGS
        new obsidian.Setting(containerEl).setName(t("VIEW_DETAILS_SETTINGS")).setHeading();
        let imgMoveSpeedScaleText;
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_MOVE_SPEED_NAME"))
            .setDesc(t("IMAGE_MOVE_SPEED_DESC"))
            .addSlider(slider => slider
            .setLimits(1, 30, 1)
            .setValue(this.plugin.settings.imageMoveSpeed)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            imgMoveSpeedScaleText.innerText = " " + value.toString();
            this.plugin.settings.imageMoveSpeed = value;
            this.plugin.saveSettings();
        })))
            .settingEl.createDiv('', (el) => {
            imgMoveSpeedScaleText = el;
            el.style.minWidth = "2.3em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.imageMoveSpeed.toString();
        });
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_TIP_TOGGLE_NAME"))
            .setDesc(t("IMAGE_TIP_TOGGLE_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.imgTipToggle)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.imgTipToggle = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("IMG_FULL_SCREEN_MODE_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in IMG_FULL_SCREEN_MODE) {
                // @ts-ignore
                dropdown.addOption(key, t(key));
            }
            dropdown.setValue(this.plugin.settings.imgFullScreenMode);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imgFullScreenMode = option;
                yield this.plugin.saveSettings();
            }));
        }));
        new obsidian.Setting(containerEl)
            .setName(t("IMG_VIEW_BACKGROUND_COLOR_NAME"))
            .addColorPicker(picker => {
            picker
                .setValue(this.plugin.settings.imgViewBackgroundColor || DEFAULT_SETTINGS.imgViewBackgroundColor)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imgViewBackgroundColor = value;
                yield this.plugin.saveSettings();
            }));
        })
            .addExtraButton(button => {
            button.setIcon('rotate-ccw')
                .setTooltip(t('RESET'))
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imgViewBackgroundColor = DEFAULT_SETTINGS.imgViewBackgroundColor;
                yield this.plugin.saveSettings();
                this.display();
            }));
        });
        //endregion
        //region >>> IMAGE_BORDER_SETTINGS
        new obsidian.Setting(containerEl).setName(t("IMAGE_BORDER_SETTINGS")).setHeading();
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_BORDER_TOGGLE_NAME"))
            .setDesc(t("IMAGE_BORDER_TOGGLE_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.imageBorderToggle)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.imageBorderToggle = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_BORDER_WIDTH_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in IMG_BORDER_WIDTH) {
                // @ts-ignore
                dropdown.addOption(IMG_BORDER_WIDTH[key], t(key));
            }
            dropdown.setValue(this.plugin.settings.imageBorderWidth);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imageBorderWidth = option;
                yield this.plugin.saveSettings();
            }));
        }));
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_BORDER_STYLE_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in IMG_BORDER_STYLE) {
                // @ts-ignore
                dropdown.addOption(IMG_BORDER_STYLE[key], t(key));
            }
            dropdown.setValue(this.plugin.settings.imageBorderStyle);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imageBorderStyle = option;
                yield this.plugin.saveSettings();
            }));
        }));
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_BORDER_COLOR_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in IMG_BORDER_COLOR) {
                // @ts-ignore
                dropdown.addOption(IMG_BORDER_COLOR[key], t(key));
            }
            dropdown.setValue(this.plugin.settings.imageBorderColor);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imageBorderColor = option;
                yield this.plugin.saveSettings();
            }));
        }));
        //endregion
        //region >>> GALLERY_NAVBAR_SETTINGS
        //let galleryNavbarDefaultColorSetting: Setting, galleryNavbarHoverColorSetting: Setting,
        // galleryImgBorderToggleSetting: Setting, galleryImgBorderActiveColorSetting: Setting;
        new obsidian.Setting(containerEl).setName(t("GALLERY_NAVBAR_SETTINGS")).setHeading();
        new obsidian.Setting(containerEl)
            .setName(t("GALLERY_NAVBAR_TOGGLE_NAME"))
            .setDesc(t("GALLERY_NAVBAR_TOGGLE_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.galleryNavbarToggle)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.galleryNavbarToggle = value;
            this.switchSettingsDisabled(!value, galleryNavbarDefaultColorSetting, galleryNavbarHoverColorSetting, galleryImgBorderToggleSetting, galleryImgBorderActiveColorSetting);
            yield this.plugin.saveSettings();
        })));
        const galleryNavbarDefaultColorSetting = new obsidian.Setting(containerEl)
            .setName(t("GALLERY_NAVBAR_DEFAULT_COLOR_NAME"))
            .addColorPicker(picker => {
            picker
                .setValue(this.plugin.settings.galleryNavbarDefaultColor || DEFAULT_SETTINGS.galleryNavbarDefaultColor)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.galleryNavbarDefaultColor = value;
                yield this.plugin.saveSettings();
            }));
        })
            .addExtraButton(button => {
            button.setIcon('rotate-ccw')
                .setTooltip(t('RESET'))
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.galleryNavbarDefaultColor = DEFAULT_SETTINGS.galleryNavbarDefaultColor;
                yield this.plugin.saveSettings();
                this.display();
            }));
        });
        const galleryNavbarHoverColorSetting = new obsidian.Setting(containerEl)
            .setName(t("GALLERY_NAVBAR_HOVER_COLOR_NAME"))
            .addColorPicker(picker => {
            picker
                .setValue(this.plugin.settings.galleryNavbarHoverColor || DEFAULT_SETTINGS.galleryNavbarHoverColor)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.galleryNavbarHoverColor = value;
                yield this.plugin.saveSettings();
            }));
        })
            .addExtraButton(button => {
            button.setIcon('rotate-ccw')
                .setTooltip(t('RESET'))
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.galleryNavbarHoverColor = DEFAULT_SETTINGS.galleryNavbarHoverColor;
                yield this.plugin.saveSettings();
                this.display();
            }));
        });
        const galleryImgBorderToggleSetting = new obsidian.Setting(containerEl)
            .setName(t("GALLERY_IMG_BORDER_TOGGLE_NAME"))
            .setDesc(t("GALLERY_IMG_BORDER_TOGGLE_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.galleryImgBorderActive)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.galleryImgBorderActive = value;
            yield this.plugin.saveSettings();
        })));
        const galleryImgBorderActiveColorSetting = new obsidian.Setting(containerEl)
            .setName(t("GALLERY_IMG_BORDER_ACTIVE_COLOR_NAME"))
            .addColorPicker(picker => {
            picker.setValue(this.plugin.settings.galleryImgBorderActiveColor || DEFAULT_SETTINGS.galleryImgBorderActiveColor)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.galleryImgBorderActiveColor = value;
                yield this.plugin.saveSettings();
            }));
        })
            .addExtraButton(button => {
            button.setIcon('rotate-ccw')
                .setTooltip(t('RESET'))
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imgViewBackgroundColor = DEFAULT_SETTINGS.galleryImgBorderActiveColor;
                yield this.plugin.saveSettings();
                this.display();
            }));
        });
        this.switchSettingsDisabled(!this.plugin.settings.galleryNavbarToggle, galleryNavbarDefaultColorSetting, galleryNavbarHoverColorSetting, galleryImgBorderToggleSetting, galleryImgBorderActiveColorSetting);
        //endregion
        //region >>> HOTKEYS_SETTINGS
        new obsidian.Setting(containerEl).setName(t("HOTKEY_SETTINGS")).setDesc(t("HOTKEY_SETTINGS_DESC")).setHeading();
        if (this.plugin.settings.moveTheImageHotkey === this.plugin.settings.switchTheImageHotkey) {
            this.plugin.settings.moveTheImageHotkey = MOVE_THE_IMAGE.DEFAULT_HOTKEY;
        }
        const moveTheImageSetting = new obsidian.Setting(containerEl)
            .setName(t("MOVE_THE_IMAGE_NAME"))
            .setDesc(t("MOVE_THE_IMAGE_DESC"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            dropdown.addOptions(this.getDropdownOptions());
            dropdown.setValue(this.plugin.settings.moveTheImageHotkey);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.moveTheImageHotkey = option;
                this.checkDropdownOptions(MOVE_THE_IMAGE.CODE, switchTheImageSetting);
                yield this.plugin.saveSettings();
            }));
        })).then((setting) => {
            setting.addExtraButton(button => {
                button.setIcon('plus').setDisabled(true);
            });
            setting.controlEl.appendChild(obsidian.sanitizeHTMLToDom(MOVE_THE_IMAGE.SVG));
        });
        if (this.plugin.settings.switchTheImageHotkey === this.plugin.settings.moveTheImageHotkey) {
            this.plugin.settings.switchTheImageHotkey = SWITCH_THE_IMAGE.DEFAULT_HOTKEY;
        }
        const switchTheImageSetting = new obsidian.Setting(containerEl)
            .setName(t("SWITCH_THE_IMAGE_NAME"))
            .setDesc(t("SWITCH_THE_IMAGE_DESC"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            dropdown.addOptions(this.getDropdownOptions());
            dropdown.setValue(this.plugin.settings.switchTheImageHotkey);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.switchTheImageHotkey = option;
                this.checkDropdownOptions(SWITCH_THE_IMAGE.CODE, moveTheImageSetting);
                yield this.plugin.saveSettings();
            }));
        })).then((setting) => {
            setting.addExtraButton(button => {
                button.setIcon('plus').setDisabled(true);
            });
            setting.controlEl.appendChild(obsidian.sanitizeHTMLToDom(SWITCH_THE_IMAGE.SVG));
        });
        if (switchTheImageSetting) {
            this.checkDropdownOptions(MOVE_THE_IMAGE.CODE, switchTheImageSetting);
        }
        if (moveTheImageSetting) {
            this.checkDropdownOptions(SWITCH_THE_IMAGE.CODE, moveTheImageSetting);
        }
        new obsidian.Setting(containerEl)
            .setName(t("DOUBLE_CLICK_TOOLBAR_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const conf of TOOLBAR_CONF) {
                if (!conf.enableHotKey)
                    continue;
                // @ts-ignore
                dropdown.addOption(conf.class, t(conf.title));
            }
            dropdown.setValue(this.plugin.settings.doubleClickToolbar);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.doubleClickToolbar = option;
                yield this.plugin.saveSettings();
            }));
        }));
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_TRIGGER_HOTKEY_NAME"))
            .setDesc(t("VIEW_TRIGGER_HOTKEY_DESC"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            dropdown.addOptions(this.getDropdownOptions());
            dropdown.setValue(this.plugin.settings.viewTriggerHotkey);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.viewTriggerHotkey = option;
                yield this.plugin.saveSettings();
            }));
        }));
        //endregion
    }
    displayCommonSettings(containerEl) {
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_MODE_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in ViewMode) {
                // @ts-ignore
                dropdown.addOption(key, t('VIEW_MODE_' + key.toUpperCase()));
            }
            dropdown.setValue(this.plugin.settings.viewMode);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                yield this.plugin.switchViewMode(option);
            }));
        }));
    }
    displayViewTriggerSettings(containerEl) {
        new obsidian.Setting(containerEl).setName(t("VIEW_TRIGGER_SETTINGS")).setHeading();
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_IMAGE_IN_EDITOR_NAME"))
            .setDesc(t("VIEW_IMAGE_IN_EDITOR_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.viewImageInEditor)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.viewImageInEditor = value;
            this.plugin.refreshViewTrigger();
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_IMAGE_IN_CPB_NAME"))
            .setDesc(t("VIEW_IMAGE_IN_CPB_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.viewImageInCPB)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.viewImageInCPB = value;
            this.plugin.refreshViewTrigger();
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_IMAGE_WITH_A_LINK_NAME"))
            .setDesc(t("VIEW_IMAGE_WITH_A_LINK_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.viewImageWithLink)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.viewImageWithLink = value;
            this.plugin.refreshViewTrigger();
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_IMAGE_OTHER_NAME"))
            .setDesc(t("VIEW_IMAGE_OTHER_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.viewImageOther)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.viewImageOther = value;
            this.plugin.refreshViewTrigger();
            yield this.plugin.saveSettings();
        })));
    }
    displayPinModeSettings(containerEl) {
        //region >>> PIN_MODE_SETTINGS
        let pinMaximumSetting;
        new obsidian.Setting(containerEl).setName(t("PIN_MODE_SETTINGS")).setHeading();
        /*new Setting(containerEl)
          .setName(t("PIN_MODE_NAME"))
          .setDesc(t("PIN_MODE_DESC"))
          .addToggle(toggle => toggle
            .setValue(this.plugin.settings.pinMode)
            .onChange(async (value) => {
              this.plugin.settings.pinMode = value;
              this.switchSettingsDisabled(!value, pinMaximumSetting, pinCoverSetting);
              //this.plugin.togglePinMode(value);
              await this.plugin.saveSettings();
            }));*/
        let pinMaximumScaleText;
        pinMaximumSetting = new obsidian.Setting(containerEl)
            .setName(t("PIN_MAXIMUM_NAME"))
            .addSlider(slider => slider
            .setLimits(1, 5, 1)
            .setValue(this.plugin.settings.pinMaximum)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            pinMaximumScaleText.innerText = " " + value.toString();
            this.plugin.settings.pinMaximum = value;
            // this.plugin.containerView?.setPinMaximum(value);
            this.plugin.saveSettings();
        })));
        pinMaximumSetting.settingEl.createDiv('', (el) => {
            pinMaximumScaleText = el;
            el.style.minWidth = "2.3em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.pinMaximum.toString();
        });
        new obsidian.Setting(containerEl)
            .setName(t("PIN_COVER_NAME"))
            .setDesc(t("PIN_COVER_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.pinCoverMode)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.pinCoverMode = value;
            yield this.plugin.saveSettings();
        })));
        //this.switchSettingsDisabled(!this.plugin.settings.pinMode, pinMaximumSetting, pinCoverSetting);
        //endregion
    }
    switchSettingsDisabled(disabled, ...settings) {
        for (const setting of settings) {
            setting === null || setting === void 0 ? void 0 : setting.setDisabled(disabled);
        }
    }
    getDropdownOptions() {
        let options = {};
        for (const key in MODIFIER_HOTKEYS) {
            //@ts-ignore
            options[key] = t(key);
        }
        return options;
    }
    checkDropdownOptions(code, setting) {
        if (!setting || !setting.controlEl)
            return;
        const optionElList = setting.controlEl.getElementsByClassName('dropdown')[0].getElementsByTagName('option');
        for (let i = 0, size = optionElList.length; i < size; i++) {
            if (code === MOVE_THE_IMAGE.CODE) {
                optionElList[i].disabled = optionElList[i].value === this.plugin.settings.moveTheImageHotkey;
            }
            else if (code === SWITCH_THE_IMAGE.CODE) {
                optionElList[i].disabled = optionElList[i].value === this.plugin.settings.switchTheImageHotkey;
            }
        }
    }
}

/**
 * ts class object: image operating status
 */
class ImgStatusCto {
    constructor() {
        // true: the popup layer of viewing image is displayed
        this.popup = false;
        // whether the image is being dragged
        this.dragging = false;
        // keybord pressing status
        this.arrowUp = false;
        this.arrowDown = false;
        this.arrowLeft = false;
        this.arrowRight = false;
        this.fullScreen = false;
        this.activeImgZIndex = 0; /*--layer-status-bar*/
        this.clickCount = 0;
    }
}
/**
 * ts class object: image information including all html elements
 */
class ImgInfoCto {
    constructor() {
        this.imgList = new Array();
        this.getPopupImgNum = () => {
            let num = 0;
            for (const imgCto of this.imgList) {
                if (imgCto.popup)
                    num++;
            }
            return num;
        };
    }
}
class ImgCto {
    constructor(index, mtime, imgViewEl) {
        this.popup = false;
        this.zIndex = 0;
        this.curWidth = 0; // image's current width
        this.curHeight = 0;
        this.realWidth = 0; // image's real width
        this.realHeight = 0;
        this.left = 0; // margin-left
        this.top = 0; // margin-top
        this.moveX = 0; // 鼠标相对于图片的位置
        this.moveY = 0;
        this.rotate = 0; // rotateDeg
        this.invertColor = false;
        this.scaleX = false; // scaleX(-1)
        this.scaleY = false; // scaleY(-1)
        this.fullScreen = false; // whether the image is being previewed in full-screen mode
        this.defaultImgStyle = {
            transform: 'none',
            filter: 'none',
            mixBlendMode: 'normal',
            borderWidth: '',
            borderStyle: '',
            borderColor: ''
        };
        this.index = index;
        this.mtime = mtime;
        this.imgViewEl = imgViewEl;
    }
}

/**
 * Image utility class
 */
class ImgUtil {
    static copyText(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
            //console.log('copyText:', copyText);
        })
            .catch(err => {
            console.error('copy text error', err);
        });
    }
    static copyImage(imgEle, width, height) {
        let image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = imgEle.src;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            try {
                canvas.toBlob((blob) => __awaiter(this, void 0, void 0, function* () {
                    yield navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
                        .then(() => {
                        new obsidian.Notice(t("COPY_IMAGE_SUCCESS"));
                    }, () => {
                        new obsidian.Notice(t("COPY_IMAGE_ERROR"));
                    });
                }));
            }
            catch (error) {
                new obsidian.Notice(t("COPY_IMAGE_ERROR"));
                console.error(error);
            }
        };
        image.onerror = () => {
            new obsidian.Notice(t("COPY_IMAGE_ERROR"));
        };
    }
}
ImgUtil.calculateImgZoomSize = (realImg, imgCto, windowWidth, windowHeight) => {
    if (!windowWidth) {
        windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
    }
    if (!windowHeight) {
        windowHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 100;
    }
    const windowZoomWidth = windowWidth * ZOOM_FACTOR;
    const windowZoomHeight = windowHeight * ZOOM_FACTOR;
    let tempWidth = realImg.width, tempHeight = realImg.height;
    if (realImg.height > windowZoomHeight) {
        tempHeight = windowZoomHeight;
        if ((tempWidth = tempHeight / realImg.height * realImg.width) > windowZoomWidth) {
            tempWidth = windowZoomWidth;
        }
    }
    else if (realImg.width > windowZoomWidth) {
        tempWidth = windowZoomWidth;
        tempHeight = tempWidth / realImg.width * realImg.height;
    }
    tempHeight = tempWidth * realImg.height / realImg.width;
    // cache image info: curWidth, curHeight, realWidth, realHeight, left, top
    imgCto.left = (windowWidth - tempWidth) / 2;
    imgCto.top = (windowHeight - tempHeight) / 2;
    imgCto.curWidth = tempWidth;
    imgCto.curHeight = tempHeight;
    imgCto.realWidth = realImg.width;
    imgCto.realHeight = realImg.height;
    /* console.log('calculateImgZoomSize', 'realImg: ' + realImg.width + ',' + realImg.height,
        'tempSize: ' + tempWidth + ',' + tempHeight,
        'windowZoomSize: ' + windowZoomWidth + ',' + windowZoomHeight,
        'windowSize: ' + windowWidth + ',' + windowHeight); */
    return imgCto;
};
/**
 * zoom an image
 * @param ratio
 * @param targetImgInfo
 * @param offsetSize
 * @param actualSize
 * @returns
 */
ImgUtil.zoom = (ratio, targetImgInfo, offsetSize, actualSize) => {
    let zoomRatio;
    if (!actualSize) {
        const zoomInFlag = ratio > 0;
        ratio = zoomInFlag ? 1 + ratio : 1 / (1 - ratio);
        zoomRatio = targetImgInfo.curWidth * ratio / targetImgInfo.realWidth;
    }
    // Snap to 100% zoom when we pass over it
    const curRatio = targetImgInfo.curWidth / targetImgInfo.realWidth;
    if (actualSize || (curRatio < 1 && zoomRatio > 1) || (curRatio > 1 && zoomRatio < 1)) {
        // set zoom ratio to 100%
        zoomRatio = 1;
        // reduce snap offset ratio accordingly
        ratio = 1 / curRatio;
    }
    let newWidth = targetImgInfo.realWidth * zoomRatio;
    let newHeight = targetImgInfo.realHeight * zoomRatio;
    if (IMG_VIEW_MIN >= newWidth || IMG_VIEW_MIN >= newHeight) {
        // set minimum width or height
        if (IMG_VIEW_MIN >= newWidth) {
            newWidth = IMG_VIEW_MIN;
            newHeight = (newWidth * targetImgInfo.realHeight) / targetImgInfo.realWidth;
        }
        else {
            newHeight = IMG_VIEW_MIN;
            newWidth = (newHeight * targetImgInfo.realWidth) / targetImgInfo.realHeight;
        }
        ratio = 1;
    }
    const left = targetImgInfo.left + offsetSize.offsetX * (1 - ratio);
    const top = targetImgInfo.top + offsetSize.offsetY * (1 - ratio);
    // cache image info: curWidth, curHeight, left, top
    targetImgInfo.curWidth = newWidth;
    targetImgInfo.curHeight = newHeight;
    targetImgInfo.left = left;
    targetImgInfo.top = top;
    // return { newWidth, left, top };
    return targetImgInfo;
};
ImgUtil.transform = (targetImgInfo) => {
    let transform = 'rotate(' + targetImgInfo.rotate + 'deg)';
    if (targetImgInfo.scaleX) {
        transform += ' scaleX(-1)';
    }
    if (targetImgInfo.scaleY) {
        transform += ' scaleY(-1)';
    }
    targetImgInfo.imgViewEl.style.setProperty('transform', transform);
};
ImgUtil.rotate = (degree, targetImgInfo) => {
    targetImgInfo.imgViewEl.style.setProperty('transform', 'rotate(' + (targetImgInfo.rotate += degree) + 'deg)');
};
ImgUtil.invertImgColor = (imgEle, open) => {
    if (open) {
        imgEle.style.setProperty('filter', 'invert(1) hue-rotate(180deg)');
        imgEle.style.setProperty('mix-blend-mode', 'screen');
    }
    else {
        imgEle.style.setProperty('filter', 'none');
        imgEle.style.setProperty('mix-blend-mode', 'normal');
    }
    // open ? imgEle.addClass('image-toolkit-img-invert') : imgEle.removeClass('image-toolkit-img-invert');
};

class ContainerView {
    constructor(plugin) {
        this.lastClickedImgDefaultStyle = {
            borderWidth: '',
            borderStyle: '',
            borderColor: ''
        };
        this.imgGlobalStatus = new ImgStatusCto();
        this.imgInfo = new ImgInfoCto();
        this.getViewMode = () => {
            return this.plugin.settings.viewMode;
        };
        this.isPinMode = () => {
            return ViewMode.Pin === this.getViewMode();
        };
        this.isNormalMode = () => {
            return ViewMode.Normal === this.getViewMode();
        };
        this.setMenuView = (menuView) => {
            this.menuView = menuView;
        };
        this.getPlugin = () => {
            return this.plugin;
        };
        this.getLastClickedImgEl = () => {
            return this.lastClickedImgEl;
        };
        this.getActiveImg = () => {
            return this.imgGlobalStatus.activeImg;
        };
        this.getDoc = () => {
            return this.doc;
        };
        /*public setPinMaximum = (val: number) => {
          this.pinMaximum = val;
        }*/
        this.getOitContainerViewEl = () => {
            return this.imgInfo.imgContainerEl;
        };
        this.getParentContainerEl = (targetEl) => {
            if (!targetEl) {
                return this.parentContainerEl;
            }
            if (!this.parentContainerEl) {
                this.parentContainerEl = targetEl.matchParent('body');
                this.doc = this.parentContainerEl.ownerDocument;
            }
            return this.parentContainerEl;
        };
        //region ================== Container View & Init ========================
        /**
         * Render when clicking an image (core step)
         * @param targetEl clicked image's element
         * @returns
         */
        this.renderContainer = (targetEl) => {
            if (!this.checkStatus())
                return;
            const matchedImg = this.initContainerView(targetEl, this.getParentContainerEl(targetEl));
            if (!matchedImg)
                return;
            this.openOitContainerView(matchedImg);
            this.renderGalleryNavbar();
            this.refreshImg(matchedImg, targetEl.src, targetEl.alt);
            matchedImg.mtime = new Date().getTime();
        };
        /**
         * initContainerDom ->
         * @param targetEl
         * @param parentContainerEl  targetEl's body
         */
        this.initContainerView = (targetEl, parentContainerEl) => {
            const matchedImg = this.initContainerDom(parentContainerEl);
            if (!matchedImg)
                return null;
            matchedImg.targetOriginalImgEl = targetEl;
            this.restoreBorderForLastClickedImg();
            this.initDefaultData(matchedImg, window.getComputedStyle(targetEl));
            this.addBorderForLastClickedImg(targetEl);
            this.addOrRemoveEvents(matchedImg, true); // add events
            return matchedImg;
        };
        this.removeOitContainerView = () => {
            var _a;
            this.restoreBorderForLastClickedImg();
            this.removeGalleryNavbar();
            (_a = this.imgInfo.oitContainerEl) === null || _a === void 0 ? void 0 : _a.remove();
            this.imgInfo.oitContainerEl = null;
            this.imgInfo.imgContainerEl = null;
            this.imgGlobalStatus.dragging = false;
            this.imgGlobalStatus.popup = false;
            this.imgGlobalStatus.activeImgZIndex = 0;
            this.imgGlobalStatus.fullScreen = false;
            this.imgGlobalStatus.activeImg = null;
            // clear imgList
            this.imgInfo.imgList.length = 0;
        };
        this.checkStatus = () => {
            const viewMode = this.plugin.getViewMode();
            if (!viewMode)
                return false;
            // none of popped-up-images
            if (!this.imgGlobalStatus.popup)
                return true;
            // Pin mode && Cover mode
            if (this.isPinMode() && this.plugin.settings.pinCoverMode)
                return true;
            // configured max images > current pop-up images
            if (this.getConfiguredPinMaximum() > this.imgInfo.getPopupImgNum())
                return true;
            new obsidian.Notice(t("PIN_MAXIMUM_NOTICE"));
            return false;
        };
        this.getConfiguredPinMaximum = () => {
            if (this.isPinMode())
                return this.plugin.settings.pinMaximum;
            return 1;
        };
        this.initDefaultData = (matchedImg, targetImgStyle) => {
            if (targetImgStyle) {
                matchedImg.defaultImgStyle.transform = 'none';
                matchedImg.defaultImgStyle.filter = targetImgStyle.filter;
                matchedImg.defaultImgStyle.mixBlendMode = targetImgStyle.mixBlendMode;
                matchedImg.defaultImgStyle.borderWidth = targetImgStyle.borderWidth;
                matchedImg.defaultImgStyle.borderStyle = targetImgStyle.borderStyle;
                matchedImg.defaultImgStyle.borderColor = targetImgStyle.borderColor;
                this.lastClickedImgDefaultStyle.borderWidth = targetImgStyle.borderWidth;
                this.lastClickedImgDefaultStyle.borderStyle = targetImgStyle.borderStyle;
                this.lastClickedImgDefaultStyle.borderColor = targetImgStyle.borderColor;
            }
            this.imgGlobalStatus.dragging = false;
            this.imgGlobalStatus.arrowUp = false;
            this.imgGlobalStatus.arrowDown = false;
            this.imgGlobalStatus.arrowLeft = false;
            this.imgGlobalStatus.arrowRight = false;
            matchedImg.invertColor = false;
            matchedImg.scaleX = false;
            matchedImg.scaleY = false;
            matchedImg.fullScreen = false;
            if (!this.imgGlobalStatus.popup) {
                this.resetClickTimer();
            }
        };
        /**
         * set 'data-oit-target' and lastClickedImgEl
         * @param targetEl
         */
        this.setLastClickedImg = (targetEl) => {
            if (!targetEl)
                return;
            // 'data-oit-target' is set for locating current image
            targetEl.setAttribute('data-oit-target', '1');
            this.lastClickedImgEl = targetEl;
        };
        //endregion
        //region ================== (Original) Image Border ========================
        this.addBorderForLastClickedImg = (targetEl) => {
            this.setLastClickedImg(targetEl);
            if (!targetEl || !this.plugin.settings.imageBorderToggle)
                return;
            const lastClickedImgStyle = targetEl === null || targetEl === void 0 ? void 0 : targetEl.style;
            if (!lastClickedImgStyle)
                return;
            lastClickedImgStyle.setProperty('border-width', this.plugin.settings.imageBorderWidth);
            lastClickedImgStyle.setProperty('border-style', this.plugin.settings.imageBorderStyle);
            lastClickedImgStyle.setProperty('border-color', this.plugin.settings.imageBorderColor);
        };
        /**
         * remove 'data-oit-target'
         * restore default border style
         */
        this.restoreBorderForLastClickedImg = () => {
            if (!this.lastClickedImgEl)
                return;
            this.lastClickedImgEl.removeAttribute('data-oit-target');
            const lastClickedImgStyle = this.lastClickedImgEl.style;
            if (lastClickedImgStyle) {
                lastClickedImgStyle.setProperty('border-width', this.lastClickedImgDefaultStyle.borderWidth);
                lastClickedImgStyle.setProperty('border-style', this.lastClickedImgDefaultStyle.borderStyle);
                lastClickedImgStyle.setProperty('border-color', this.lastClickedImgDefaultStyle.borderColor);
            }
        };
        //endregion
        //region ================== Image ========================
        this.updateImgViewElAndList = (imgInfo) => {
            if (!(imgInfo === null || imgInfo === void 0 ? void 0 : imgInfo.imgContainerEl))
                return;
            const pinMaximum = this.getConfiguredPinMaximum();
            const imgNum = this.imgInfo.imgList.length;
            if (pinMaximum < imgNum) {
                // remove all imgViewEl and imgList
                imgInfo.imgContainerEl.innerHTML = '';
                // clear imgList
                imgInfo.imgList.length = 0;
            }
            // let isUpdate: boolean = false;
            const curTime = new Date().getTime();
            for (let i = imgNum; i < pinMaximum; i++) {
                // <div class="oit-img-container"> `<img class='oit-img-view' data-index='0' src='' alt=''>` </div>
                let imgViewEl = createEl('img');
                imgViewEl.addClass(OIT_CLASS.IMG_VIEW);
                imgViewEl.hidden = true; // hide 'oit-img-view' for now
                imgViewEl.dataset.index = i + ''; // set data-index
                this.setImgViewDefaultBackground(imgViewEl);
                imgInfo.imgContainerEl.appendChild(imgViewEl);
                // cache imgList
                imgInfo.imgList.push(new ImgCto(i, curTime, imgViewEl));
                // isUpdate = true;
            }
        };
        this.getMatchedImg = () => {
            let earliestImg;
            for (const img of this.imgInfo.imgList) {
                if (!earliestImg || earliestImg.mtime > img.mtime)
                    earliestImg = img;
                if (img.popup)
                    continue;
                return img;
            }
            if (this.plugin.settings.pinCoverMode) {
                return earliestImg;
            }
            return null;
        };
        /**
         * it may from: renderContainerView(), switch GalleryNavbarView, click toolbar_refresh
         * @param imgCto
         * @param imgSrc
         * @param imgAlt
         * @param imgTitleIndex
         */
        this.refreshImg = (imgCto, imgSrc, imgAlt, imgTitleIndex) => {
            if (!imgSrc)
                imgSrc = imgCto.imgViewEl.src;
            if (!imgAlt)
                imgAlt = imgCto.imgViewEl.alt;
            this.renderImgTitle(imgAlt, imgTitleIndex);
            if (imgSrc) {
                if (imgCto.refreshImgInterval) {
                    clearInterval(imgCto.refreshImgInterval);
                    imgCto.refreshImgInterval = null;
                }
                let realImg = new Image();
                realImg.src = imgSrc;
                imgCto.refreshImgInterval = setInterval((realImg) => {
                    var _a, _b;
                    if (realImg.width > 0 || realImg.height > 0) {
                        clearInterval(imgCto.refreshImgInterval);
                        imgCto.refreshImgInterval = null;
                        this.setImgViewPosition(ImgUtil.calculateImgZoomSize(realImg, imgCto, (_a = this.parentContainerEl) === null || _a === void 0 ? void 0 : _a.clientWidth, (_b = this.parentContainerEl) === null || _b === void 0 ? void 0 : _b.clientHeight), 0);
                        this.renderImgView(imgCto.imgViewEl, imgSrc, imgAlt);
                        this.renderImgTip(imgCto);
                        imgCto.imgViewEl.style.setProperty('transform', imgCto.defaultImgStyle.transform);
                        imgCto.imgViewEl.style.setProperty('filter', imgCto.defaultImgStyle.filter);
                        imgCto.imgViewEl.style.setProperty('mix-blend-mode', imgCto.defaultImgStyle.mixBlendMode);
                    }
                }, 40, realImg);
            }
        };
        this.renderImgTitle = (name, index) => {
        };
        this.setImgViewPosition = (imgZoomSize, rotate) => {
            const imgViewEl = imgZoomSize.imgViewEl;
            if (!imgViewEl)
                return;
            if (imgZoomSize) {
                imgViewEl.setAttribute('width', imgZoomSize.curWidth + 'px');
                imgViewEl.style.setProperty('margin-top', imgZoomSize.top + 'px', 'important');
                imgViewEl.style.setProperty('margin-left', imgZoomSize.left + 'px', 'important');
            }
            const rotateDeg = rotate ? rotate : 0;
            imgViewEl.style.transform = 'rotate(' + rotateDeg + 'deg)';
            imgZoomSize.rotate = rotateDeg;
        };
        this.renderImgView = (imgViewEl, src, alt) => {
            if (!imgViewEl)
                return;
            imgViewEl.setAttribute('src', src);
            imgViewEl.setAttribute('alt', alt);
            imgViewEl.hidden = !src && !alt;
        };
        this.renderImgTip = (activeImg) => {
            if (!activeImg)
                activeImg = this.imgGlobalStatus.activeImg;
            if (activeImg && this.imgInfo.imgTipEl && activeImg.realWidth > 0 && activeImg.curWidth > 0) {
                if (this.imgInfo.imgTipTimeout) {
                    clearTimeout(this.imgInfo.imgTipTimeout);
                }
                if (this.plugin.settings.imgTipToggle) {
                    this.imgInfo.imgTipEl.hidden = false; // display 'oit-img-tip'
                    const ratio = activeImg.curWidth * 100 / activeImg.realWidth;
                    const isSingleDigit = 10 > ratio;
                    const width = isSingleDigit ? 20 : 40;
                    const left = activeImg.left + activeImg.curWidth / 2 - width / 2;
                    const top = activeImg.top + activeImg.curHeight / 2 - 10;
                    this.imgInfo.imgTipEl.style.setProperty("width", width + 'px');
                    this.imgInfo.imgTipEl.style.setProperty("font-size", isSingleDigit || 100 >= activeImg.curWidth ? 'xx-small' : 'x-small');
                    this.imgInfo.imgTipEl.style.setProperty("left", left + 'px');
                    this.imgInfo.imgTipEl.style.setProperty("top", top + 'px');
                    this.imgInfo.imgTipEl.style.setProperty("z-index", activeImg.zIndex + '');
                    this.imgInfo.imgTipEl.setText(parseInt(ratio + '') + '%');
                    this.imgInfo.imgTipTimeout = setTimeout(() => {
                        this.imgInfo.imgTipEl.hidden = true;
                    }, 1000);
                }
                else {
                    this.imgInfo.imgTipEl.hidden = true; // hide 'oit-img-tip'
                    this.imgInfo.imgTipTimeout = null;
                }
            }
        };
        this.setImgViewDefaultBackgroundForImgList = () => {
            for (const imgCto of this.imgInfo.imgList) {
                this.setImgViewDefaultBackground(imgCto.imgViewEl);
            }
        };
        this.setImgViewDefaultBackground = (imgViewEl) => {
            if (!imgViewEl)
                return;
            if (this.plugin.settings.imgViewBackgroundColor && IMG_DEFAULT_BACKGROUND_COLOR != this.plugin.settings.imgViewBackgroundColor) {
                imgViewEl.removeClass('img-default-background');
                imgViewEl.style.setProperty('background-color', this.plugin.settings.imgViewBackgroundColor);
            }
            else {
                imgViewEl.addClass('img-default-background');
                imgViewEl.style.removeProperty('background-color');
            }
        };
        this.setActiveImgZIndex = (activeImg) => {
        };
        //endregion
        //region ================== Gallery NavBar ========================
        this.switchImageOnGalleryNavBar = (event, next) => {
        };
        this.renderGalleryNavbar = () => {
        };
        this.removeGalleryNavbar = () => {
        };
        //endregion
        //region ================== full screen ========================
        /**
         * full-screen mode
         */
        this.showPlayerImg = (activeImg) => {
            if (!activeImg && !(activeImg = this.imgGlobalStatus.activeImg))
                return;
            this.imgGlobalStatus.fullScreen = true;
            activeImg.fullScreen = true;
            // activeImg.imgViewEl.style.setProperty('display', 'none', 'important'); // hide imgViewEl
            // this.imgInfoCto.imgFooterEl?.style.setProperty('display', 'none'); // hide 'oit-img-footer'
            // show the img-player
            this.imgInfo.imgPlayerEl.style.setProperty('display', 'block');
            this.imgInfo.imgPlayerEl.style.setProperty('z-index', (this.imgGlobalStatus.activeImgZIndex + 10) + '');
            this.imgInfo.imgPlayerEl.addEventListener('click', this.closePlayerImg);
            const windowWidth = this.doc.documentElement.clientWidth || this.doc.body.clientWidth;
            const windowHeight = this.doc.documentElement.clientHeight || this.doc.body.clientHeight;
            let newWidth, newHeight;
            let top = 0;
            if (IMG_FULL_SCREEN_MODE.STRETCH == this.plugin.settings.imgFullScreenMode) {
                newWidth = windowWidth + 'px';
                newHeight = windowHeight + 'px';
            }
            else if (IMG_FULL_SCREEN_MODE.FILL == this.plugin.settings.imgFullScreenMode) {
                newWidth = '100%';
                newHeight = '100%';
            }
            else {
                // fit
                const widthRatio = windowWidth / activeImg.realWidth;
                const heightRatio = windowHeight / activeImg.realHeight;
                if (widthRatio <= heightRatio) {
                    newWidth = windowWidth;
                    newHeight = widthRatio * activeImg.realHeight;
                }
                else {
                    newHeight = windowHeight;
                    newWidth = heightRatio * activeImg.realWidth;
                }
                top = (windowHeight - newHeight) / 2;
                newWidth = newWidth + 'px';
                newHeight = newHeight + 'px';
            }
            const imgPlayerImgViewEl = this.imgInfo.imgPlayerImgViewEl;
            if (imgPlayerImgViewEl) {
                imgPlayerImgViewEl.setAttribute('src', activeImg.imgViewEl.src);
                imgPlayerImgViewEl.setAttribute('alt', activeImg.imgViewEl.alt);
                imgPlayerImgViewEl.setAttribute('width', newWidth);
                imgPlayerImgViewEl.setAttribute('height', newHeight);
                imgPlayerImgViewEl.style.setProperty('margin-top', top + 'px');
                //this.imgInfo.imgPlayerImgViewEl.style.setProperty('margin-left', left + 'px');
                this.setImgViewDefaultBackground(imgPlayerImgViewEl);
            }
        };
        /**
         * close full screen
         */
        this.closePlayerImg = () => {
            for (const imgCto of this.imgInfo.imgList) {
                if (!imgCto.fullScreen)
                    continue;
                // show the popped up image
                // imgCto.imgViewEl?.style.setProperty('display', 'block', 'important');
                // this.imgInfoCto.imgFooterEl?.style.setProperty('display', 'block');
            }
            // hide full screen
            if (this.imgInfo.imgPlayerEl) {
                this.imgInfo.imgPlayerEl.style.setProperty('display', 'none'); // hide 'img-player'
                this.imgInfo.imgPlayerEl.removeEventListener('click', this.closePlayerImg);
            }
            if (this.imgInfo.imgPlayerImgViewEl) {
                this.imgInfo.imgPlayerImgViewEl.setAttribute('src', '');
                this.imgInfo.imgPlayerImgViewEl.setAttribute('alt', '');
            }
            this.imgGlobalStatus.fullScreen = false;
        };
        //endregion
        //region ================== events ========================
        this.addOrRemoveEvents = (matchedImg, isAdd) => {
            if (isAdd) {
                if (!this.imgGlobalStatus.popup) {
                    this.doc.addEventListener('keydown', this.triggerKeydown);
                    this.doc.addEventListener('keyup', this.triggerKeyup);
                }
                if (this.isNormalMode()) {
                    // click event: hide container view
                    this.imgInfo.oitContainerEl.addEventListener('click', this.closeContainerView);
                }
                matchedImg.imgViewEl.addEventListener('mouseenter', this.mouseenterImgView);
                matchedImg.imgViewEl.addEventListener('mouseleave', this.mouseleaveImgView);
                // drag the image via mouse
                matchedImg.imgViewEl.addEventListener('mousedown', this.mousedownImgView);
                matchedImg.imgViewEl.addEventListener('mouseup', this.mouseupImgView);
                // zoom the image via mouse wheel
                matchedImg.imgViewEl.addEventListener('mousewheel', this.mousewheelViewContainer, { passive: true });
            }
            else {
                if (!this.imgGlobalStatus.popup) {
                    this.doc.removeEventListener('keydown', this.triggerKeydown);
                    this.doc.removeEventListener('keyup', this.triggerKeyup);
                    if (this.imgGlobalStatus.clickTimer) {
                        clearTimeout(this.imgGlobalStatus.clickTimer);
                        this.imgGlobalStatus.clickTimer = null;
                        this.imgGlobalStatus.clickCount = 0;
                    }
                }
                if (!this.isPinMode()) {
                    this.imgInfo.oitContainerEl.removeEventListener('click', this.closeContainerView);
                }
                matchedImg.imgViewEl.removeEventListener('mouseenter', this.mouseenterImgView);
                matchedImg.imgViewEl.removeEventListener('mouseleave', this.mouseleaveImgView);
                matchedImg.imgViewEl.removeEventListener('mousedown', this.mousedownImgView);
                matchedImg.imgViewEl.removeEventListener('mouseup', this.mouseupImgView);
                matchedImg.imgViewEl.removeEventListener('mousewheel', this.mousewheelViewContainer);
                if (matchedImg.refreshImgInterval) {
                    clearInterval(matchedImg.refreshImgInterval);
                    matchedImg.refreshImgInterval = null;
                }
            }
        };
        this.triggerKeyup = (event) => {
            // console.log('keyup', event, event.key);
            const key = event.key;
            if (!key)
                return;
            if (!('Escape' === key)) {
                event.preventDefault();
                event.stopPropagation();
            }
            switch (key) {
                case 'Escape':
                    // close full screen, hide container view
                    this.imgGlobalStatus.fullScreen ? this.closePlayerImg() : this.closeContainerView();
                    break;
                case 'ArrowUp':
                    this.imgGlobalStatus.arrowUp = false;
                    break;
                case 'ArrowDown':
                    this.imgGlobalStatus.arrowDown = false;
                    break;
                case 'ArrowLeft':
                    this.imgGlobalStatus.arrowLeft = false;
                    // switch to the previous image on the gallery navBar
                    this.switchImageOnGalleryNavBar(event, false);
                    break;
                case 'ArrowRight':
                    this.imgGlobalStatus.arrowRight = false;
                    // switch to the next image on the gallery navBar
                    this.switchImageOnGalleryNavBar(event, true);
                    break;
            }
        };
        /**
         * move the image by keyboard
         * @param event
         */
        this.triggerKeydown = (event) => {
            //console.log('keydown', event, event.key, this.imgStatus);
            if (this.isPinMode())
                return;
            event.preventDefault();
            event.stopPropagation();
            if (this.imgGlobalStatus.arrowUp && this.imgGlobalStatus.arrowLeft) {
                this.moveImgViewByHotkey(event, 'UP_LEFT');
                return;
            }
            else if (this.imgGlobalStatus.arrowUp && this.imgGlobalStatus.arrowRight) {
                this.moveImgViewByHotkey(event, 'UP_RIGHT');
                return;
            }
            else if (this.imgGlobalStatus.arrowDown && this.imgGlobalStatus.arrowLeft) {
                this.moveImgViewByHotkey(event, 'DOWN_LEFT');
                return;
            }
            else if (this.imgGlobalStatus.arrowDown && this.imgGlobalStatus.arrowRight) {
                this.moveImgViewByHotkey(event, 'DOWN_RIGHT');
                return;
            }
            switch (event.key) {
                case 'ArrowUp':
                    this.imgGlobalStatus.arrowUp = true;
                    this.moveImgViewByHotkey(event, 'UP');
                    break;
                case 'ArrowDown':
                    this.imgGlobalStatus.arrowDown = true;
                    this.moveImgViewByHotkey(event, 'DOWN');
                    break;
                case 'ArrowLeft':
                    this.imgGlobalStatus.arrowLeft = true;
                    this.moveImgViewByHotkey(event, 'LEFT');
                    break;
                case 'ArrowRight':
                    this.imgGlobalStatus.arrowRight = true;
                    this.moveImgViewByHotkey(event, 'RIGHT');
                    break;
            }
        };
        this.moveImgViewByHotkey = (event, orientation) => {
            if (!orientation || !this.imgGlobalStatus.popup || !this.checkHotkeySettings(event, this.plugin.settings.moveTheImageHotkey))
                return;
            switch (orientation) {
                case 'UP':
                    this.mousemoveImgView(null, { offsetX: 0, offsetY: -this.plugin.settings.imageMoveSpeed });
                    break;
                case 'DOWN':
                    this.mousemoveImgView(null, { offsetX: 0, offsetY: this.plugin.settings.imageMoveSpeed });
                    break;
                case 'LEFT':
                    this.mousemoveImgView(null, { offsetX: -this.plugin.settings.imageMoveSpeed, offsetY: 0 });
                    break;
                case 'RIGHT':
                    this.mousemoveImgView(null, { offsetX: this.plugin.settings.imageMoveSpeed, offsetY: 0 });
                    break;
                case 'UP_LEFT':
                    this.mousemoveImgView(null, {
                        offsetX: -this.plugin.settings.imageMoveSpeed,
                        offsetY: -this.plugin.settings.imageMoveSpeed
                    });
                    break;
                case 'UP_RIGHT':
                    this.mousemoveImgView(null, {
                        offsetX: this.plugin.settings.imageMoveSpeed,
                        offsetY: -this.plugin.settings.imageMoveSpeed
                    });
                    break;
                case 'DOWN_LEFT':
                    this.mousemoveImgView(null, {
                        offsetX: -this.plugin.settings.imageMoveSpeed,
                        offsetY: this.plugin.settings.imageMoveSpeed
                    });
                    break;
                case 'DOWN_RIGHT':
                    this.mousemoveImgView(null, {
                        offsetX: this.plugin.settings.imageMoveSpeed,
                        offsetY: this.plugin.settings.imageMoveSpeed
                    });
                    break;
            }
        };
        this.checkHotkeySettings = (event, hotkey) => {
            // console.log("[oit] checkHotkeySettings: ", event.ctrlKey, event.altKey, event.shiftKey)
            switch (hotkey) {
                case "NONE":
                    return !event.ctrlKey && !event.altKey && !event.shiftKey;
                case "CTRL":
                    return event.ctrlKey && !event.altKey && !event.shiftKey;
                case "ALT":
                    return !event.ctrlKey && event.altKey && !event.shiftKey;
                case "SHIFT":
                    return !event.ctrlKey && !event.altKey && event.shiftKey;
                case "CTRL_ALT":
                    return event.ctrlKey && event.altKey && !event.shiftKey;
                case "CTRL_SHIFT":
                    return event.ctrlKey && !event.altKey && event.shiftKey;
                case "SHIFT_ALT":
                    return !event.ctrlKey && event.altKey && event.shiftKey;
                case "CTRL_SHIFT_ALT":
                    return event.ctrlKey && event.altKey && event.shiftKey;
            }
            return false;
        };
        this.mouseenterImgView = (event) => {
            this.resetClickTimer();
            event.stopPropagation();
            event.preventDefault();
            this.getAndUpdateActiveImg(event);
            // console.log('mouseenterImgView', event, this.imgGlobalStatus.activeImg);
        };
        this.mousedownImgView = (event) => {
            // console.log('mousedownImgView', event, this.imgGlobalStatus.activeImg, event.button);
            event.stopPropagation();
            event.preventDefault();
            const activeImg = this.getAndUpdateActiveImg(event);
            if (!activeImg)
                return;
            if (0 == event.button) { // left click
                this.setClickTimer(activeImg);
                this.setActiveImgZIndex(activeImg);
                this.imgGlobalStatus.dragging = true;
                // 鼠标相对于图片的位置
                activeImg.moveX = activeImg.imgViewEl.offsetLeft - event.clientX;
                activeImg.moveY = activeImg.imgViewEl.offsetTop - event.clientY;
                // 鼠标按下时持续触发/移动事件
                activeImg.imgViewEl.onmousemove = this.mousemoveImgView;
            }
        };
        /**
         * move the image by mouse or keyboard
         * @param event
         * @param offsetSize
         */
        this.mousemoveImgView = (event, offsetSize) => {
            // console.log('mousemoveImgView', event, this.imgGlobalStatus.activeImg);
            const activeImg = this.imgGlobalStatus.activeImg;
            if (!activeImg)
                return;
            if (event) {
                if (!this.imgGlobalStatus.dragging)
                    return;
                // drag via mouse cursor (Both Mode)
                activeImg.left = event.clientX + activeImg.moveX;
                activeImg.top = event.clientY + activeImg.moveY;
            }
            else if (offsetSize) {
                // move by arrow keys (Normal Mode)
                activeImg.left += offsetSize.offsetX;
                activeImg.top += offsetSize.offsetY;
            }
            else {
                return;
            }
            // move the image
            activeImg.imgViewEl.style.setProperty('margin-left', activeImg.left + 'px', 'important');
            activeImg.imgViewEl.style.setProperty('margin-top', activeImg.top + 'px', 'important');
        };
        this.mouseupImgView = (event) => {
            var _a;
            // console.log('mouseupImgView', event, this.imgGlobalStatus.activeImg);
            this.imgGlobalStatus.dragging = false;
            event.preventDefault();
            event.stopPropagation();
            const activeImg = this.imgGlobalStatus.activeImg;
            if (activeImg) {
                activeImg.imgViewEl.onmousemove = null;
                if (2 == event.button) { // right click
                    (_a = this.menuView) === null || _a === void 0 ? void 0 : _a.show(event, activeImg);
                }
            }
        };
        this.mouseleaveImgView = (event) => {
            // console.log('mouseleaveImgView', event, this.imgGlobalStatus.activeImg, '>>> set null');
            this.imgGlobalStatus.dragging = false;
            this.resetClickTimer();
            event.preventDefault();
            event.stopPropagation();
            const activeImg = this.imgGlobalStatus.activeImg;
            if (activeImg) {
                activeImg.imgViewEl.onmousemove = null;
                this.setActiveImgForMouseEvent(null); // for pin mode
            }
        };
        this.setClickTimer = (activeImg) => {
            ++this.imgGlobalStatus.clickCount;
            clearTimeout(this.imgGlobalStatus.clickTimer);
            this.imgGlobalStatus.clickTimer = setTimeout(() => {
                const clickCount = this.imgGlobalStatus.clickCount;
                this.resetClickTimer();
                if (2 === clickCount) { // double click
                    if (!activeImg)
                        activeImg = this.imgGlobalStatus.activeImg;
                    // console.log('mousedownImgView: double click...', activeImg.index);
                    this.clickImgToolbar(null, this.plugin.settings.doubleClickToolbar, activeImg);
                }
            }, 200);
        };
        this.resetClickTimer = () => {
            this.imgGlobalStatus.clickTimer = null;
            this.imgGlobalStatus.clickCount = 0;
        };
        this.getAndUpdateActiveImg = (event) => {
            const targetEl = event.target;
            let index;
            if (!targetEl || !(index = targetEl.dataset.index))
                return;
            const activeImg = this.imgInfo.imgList[parseInt(index)];
            if (activeImg && (!this.imgGlobalStatus.activeImg || activeImg.index !== this.imgGlobalStatus.activeImg.index)) {
                this.setActiveImgForMouseEvent(activeImg); // update activeImg
            }
            // console.log('getAndUpdateActiveImg: ', activeImg)
            return activeImg;
        };
        this.mousewheelViewContainer = (event) => {
            // event.preventDefault();
            event.stopPropagation();
            // @ts-ignore
            this.zoomAndRender(0 < event.wheelDelta ? 0.1 : -0.1, event);
        };
        this.zoomAndRender = (ratio, event, actualSize, activeImg) => {
            if (!activeImg) {
                activeImg = this.imgGlobalStatus.activeImg;
            }
            let activeImgViewEl;
            if (!activeImg || !(activeImgViewEl = activeImg.imgViewEl))
                return;
            let offsetSize = { offsetX: 0, offsetY: 0 };
            if (event) {
                offsetSize.offsetX = event.offsetX;
                offsetSize.offsetY = event.offsetY;
            }
            else {
                offsetSize.offsetX = activeImg.curWidth / 2;
                offsetSize.offsetY = activeImg.curHeight / 2;
            }
            const zoomData = ImgUtil.zoom(ratio, activeImg, offsetSize, actualSize);
            this.renderImgTip(activeImg);
            activeImgViewEl.setAttribute('width', zoomData.curWidth + 'px');
            activeImgViewEl.style.setProperty('margin-top', zoomData.top + 'px', 'important');
            activeImgViewEl.style.setProperty('margin-left', zoomData.left + 'px', 'important');
        };
        this.clickImgToolbar = (event, targetElClass, activeImg) => {
            if (!targetElClass && !activeImg) {
                if (!event)
                    return;
                // comes from clicking toolbar
                targetElClass = event.target.className;
                activeImg = this.imgGlobalStatus.activeImg;
            }
            switch (targetElClass) {
                case 'toolbar_zoom_to_100':
                    this.zoomAndRender(null, null, true, activeImg);
                    break;
                case 'toolbar_zoom_in':
                    this.zoomAndRender(0.1);
                    break;
                case 'toolbar_zoom_out':
                    this.zoomAndRender(-0.1);
                    break;
                case 'toolbar_full_screen':
                    this.showPlayerImg(activeImg);
                    break;
                case 'toolbar_refresh':
                    this.refreshImg(activeImg);
                    break;
                case 'toolbar_rotate_left':
                    activeImg.rotate -= 90;
                    ImgUtil.transform(activeImg);
                    break;
                case 'toolbar_rotate_right':
                    activeImg.rotate += 90;
                    ImgUtil.transform(activeImg);
                    break;
                case 'toolbar_scale_x':
                    activeImg.scaleX = !activeImg.scaleX;
                    ImgUtil.transform(activeImg);
                    break;
                case 'toolbar_scale_y':
                    activeImg.scaleY = !activeImg.scaleY;
                    ImgUtil.transform(activeImg);
                    break;
                case 'toolbar_invert_color':
                    activeImg.invertColor = !activeImg.invertColor;
                    ImgUtil.invertImgColor(activeImg.imgViewEl, activeImg.invertColor);
                    break;
                case 'toolbar_copy':
                    ImgUtil.copyImage(activeImg.imgViewEl, activeImg.curWidth, activeImg.curHeight);
                    break;
                case 'toolbar_close':
                    this.closeContainerView(event, activeImg);
                    break;
            }
        };
        this.plugin = plugin;
    }
}

var Md5 = /** @class */ (function () {
    function Md5() {
    }
    Md5.AddUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (!!(lX4 & lY4)) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (!!(lX4 | lY4)) {
            if (!!(lResult & 0x40000000)) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            }
            else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        }
        else {
            return (lResult ^ lX8 ^ lY8);
        }
    };
    Md5.FF = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.F(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.GG = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.G(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.HH = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.H(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.II = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.I(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.ConvertToWordArray = function (string) {
        var lWordCount, lMessageLength = string.length, lNumberOfWords_temp1 = lMessageLength + 8, lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64, lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16, lWordArray = Array(lNumberOfWords - 1), lBytePosition = 0, lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    Md5.WordToHex = function (lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    Md5.Utf8Encode = function (string) {
        var utftext = "", c;
        string = string.replace(/\r\n/g, "\n");
        for (var n = 0; n < string.length; n++) {
            c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    Md5.init = function (string) {
        var temp;
        if (typeof string !== 'string')
            string = JSON.stringify(string);
        this._string = this.Utf8Encode(string);
        this.x = this.ConvertToWordArray(this._string);
        this.a = 0x67452301;
        this.b = 0xEFCDAB89;
        this.c = 0x98BADCFE;
        this.d = 0x10325476;
        for (this.k = 0; this.k < this.x.length; this.k += 16) {
            this.AA = this.a;
            this.BB = this.b;
            this.CC = this.c;
            this.DD = this.d;
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k], this.S11, 0xD76AA478);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 1], this.S12, 0xE8C7B756);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S13, 0x242070DB);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 3], this.S14, 0xC1BDCEEE);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S11, 0xF57C0FAF);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 5], this.S12, 0x4787C62A);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S13, 0xA8304613);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 7], this.S14, 0xFD469501);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S11, 0x698098D8);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 9], this.S12, 0x8B44F7AF);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S13, 0xFFFF5BB1);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 11], this.S14, 0x895CD7BE);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S11, 0x6B901122);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 13], this.S12, 0xFD987193);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S13, 0xA679438E);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 15], this.S14, 0x49B40821);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S21, 0xF61E2562);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 6], this.S22, 0xC040B340);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S23, 0x265E5A51);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k], this.S24, 0xE9B6C7AA);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S21, 0xD62F105D);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 10], this.S22, 0x2441453);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S23, 0xD8A1E681);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 4], this.S24, 0xE7D3FBC8);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S21, 0x21E1CDE6);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 14], this.S22, 0xC33707D6);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S23, 0xF4D50D87);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 8], this.S24, 0x455A14ED);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S21, 0xA9E3E905);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 2], this.S22, 0xFCEFA3F8);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S23, 0x676F02D9);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 12], this.S24, 0x8D2A4C8A);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S31, 0xFFFA3942);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 8], this.S32, 0x8771F681);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S33, 0x6D9D6122);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 14], this.S34, 0xFDE5380C);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S31, 0xA4BEEA44);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 4], this.S32, 0x4BDECFA9);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S33, 0xF6BB4B60);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 10], this.S34, 0xBEBFBC70);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S31, 0x289B7EC6);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k], this.S32, 0xEAA127FA);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S33, 0xD4EF3085);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 6], this.S34, 0x4881D05);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S31, 0xD9D4D039);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 12], this.S32, 0xE6DB99E5);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S33, 0x1FA27CF8);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 2], this.S34, 0xC4AC5665);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k], this.S41, 0xF4292244);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 7], this.S42, 0x432AFF97);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S43, 0xAB9423A7);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 5], this.S44, 0xFC93A039);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S41, 0x655B59C3);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 3], this.S42, 0x8F0CCC92);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S43, 0xFFEFF47D);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 1], this.S44, 0x85845DD1);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S41, 0x6FA87E4F);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 15], this.S42, 0xFE2CE6E0);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S43, 0xA3014314);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 13], this.S44, 0x4E0811A1);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S41, 0xF7537E82);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 11], this.S42, 0xBD3AF235);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S43, 0x2AD7D2BB);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 9], this.S44, 0xEB86D391);
            this.a = this.AddUnsigned(this.a, this.AA);
            this.b = this.AddUnsigned(this.b, this.BB);
            this.c = this.AddUnsigned(this.c, this.CC);
            this.d = this.AddUnsigned(this.d, this.DD);
        }
        temp = this.WordToHex(this.a) + this.WordToHex(this.b) + this.WordToHex(this.c) + this.WordToHex(this.d);
        return temp.toLowerCase();
    };
    Md5.x = Array();
    Md5.S11 = 7;
    Md5.S12 = 12;
    Md5.S13 = 17;
    Md5.S14 = 22;
    Md5.S21 = 5;
    Md5.S22 = 9;
    Md5.S23 = 14;
    Md5.S24 = 20;
    Md5.S31 = 4;
    Md5.S32 = 11;
    Md5.S33 = 16;
    Md5.S34 = 23;
    Md5.S41 = 6;
    Md5.S42 = 10;
    Md5.S43 = 15;
    Md5.S44 = 21;
    Md5.RotateLeft = function (lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); };
    Md5.F = function (x, y, z) { return (x & y) | ((~x) & z); };
    Md5.G = function (x, y, z) { return (x & z) | (y & (~z)); };
    Md5.H = function (x, y, z) { return (x ^ y ^ z); };
    Md5.I = function (x, y, z) { return (y ^ (x | (~z))); };
    return Md5;
}());

class GalleryImgCto {
    constructor(alt, src) {
        this.alt = alt;
        this.src = src;
    }
}
class GalleryImgCacheCto {
    constructor(file, galleryImgList, mtime) {
        this.file = file;
        this.galleryImgList = galleryImgList;
        this.mtime = mtime;
    }
}

class FileCto {
    constructor(path, ctime, mtime) {
        this.path = path;
        this.ctime = ctime;
        this.mtime = mtime;
    }
}

/* // const imgList: Array<GalleryImg> = parseMarkDown(plugin, activeView.sourceMode?.cmEditor, activeView.file.path);
export const parseMarkDown = (plugin: ImageToolkitPlugin, cm: CodeMirror.Editor, filePath: string) => {
    let line, lineText;
    for (let i = 0, lastLine = cm.lastLine(); i <= lastLine; i++) {
        if (!(line = cm.lineInfo(i))) continue;
        if (!(lineText = line.text)) continue;
        console.debug((i + 1) + ' line: ' + lineText);
    }
} */
const parseActiveViewData = (plugin, lines, file) => {
    if (!lines || 0 >= lines.length)
        return null;
    let lineText;
    let isCodeArea = false;
    let textArr;
    const imgList = new Array();
    for (let i = 0, len = lines.length; i < len; i++) {
        if (!(lineText = lines[i]))
            continue;
        // console.log((i + 1) + ' line: ' + lineText);
        if (lineText.startsWith('```')) {
            isCodeArea = !isCodeArea;
            continue;
        }
        if (isCodeArea)
            continue;
        if (textArr = getNonCodeAreaTexts(lineText)) {
            for (const text of textArr) {
                extractImage(text, imgList);
            }
        }
        else {
            extractImage(lineText, imgList);
        }
    }
    const filePath = file.path;
    for (let i = 0, len = imgList.length; i < len; i++) {
        const img = imgList[i];
        if (img.convert) {
            const imageFile = plugin.app.metadataCache.getFirstLinkpathDest(decodeURIComponent(img.src), filePath);
            img.src = imageFile ? plugin.app.vault.getResourcePath(imageFile) : '';
        }
        img.hash = md5Img(img.alt, img.src);
        img.match = null;
        img.name = null;
    }
    return new GalleryImgCacheCto(new FileCto(file.path, file.stat.ctime, file.stat.mtime), imgList, new Date().getTime());
};
const getNonCodeAreaTexts = (lineText) => {
    let textArr = [];
    const idx1 = lineText.indexOf('`');
    if (0 > idx1)
        return null;
    const idx2 = lineText.lastIndexOf('`');
    if (idx1 === idx2)
        return null;
    if (idx1 > 0)
        textArr.push(lineText.substring(0, idx1));
    if (lineText.length - 1 > idx2)
        textArr.push(lineText.substring(idx2 + 1));
    return textArr;
};
const IMAGE_LINK_REGEX1 = /\[\s*?(!\[(.*?)\]\((.*?)\))\s*?\]\(.*?\)/; // 1-link: [ ![alt1|alt2|...|altn|width](src) ](https://...)
// markdown: `![alt1|alt2|...|altn|width](src)` -> 1: alt (alt+width), 2: src
const RE_MARKDOWN_IMAGE = /!\[(.*?)\]\(\s*(.*?\.(jpe?g|png|svg|gif|bmp|webp))\s*\)/i; // 1: ![alt1|alt2|...|altn|width](src)
const IMAGE_LINK_REGEX2 = /\[\s*?(!\[\[(.*?[jpe?g|png|gif|svg|bmp].*?)\]\])\s*?\]\(.*?\)/i; // 2-link: [ ![[src|alt1|alt2|width]] ](https://...)
// RE_WIKILINK_IMAGE wikilink: `![[bird.png|alt1|alt2|2.1|50]]` -> 1: src+alt+width
const RE_WIKILINK_IMAGE = /!\[\[(.*?\.(jpe?g|png|svg|gif|bmp|webp).*?)\]\]/i; // 2: ![[src|alt1|alt2|width]]
const SRC_LINK_REGEX = /[a-z][a-z0-9+\-.]+:\/.*/i; // match link: http://, file://, app:// 
const SRC_IMG_REGREX = /.*?\.jpe?g|png|gif|svg|bmp/i; // match image ext: .jpg/.jpeg/.png/.gif/.svg/.bmp
const IMG_TAG_LINK_SRC_REGEX = /<a.*?(<img.*?src=[\'"](.*?)[\'"].*?\/?>).*?\/a>/i; // 3-a-img-src: <a> <img ... src=''/> </a>
const IMG_TAG_SRC_REGEX = /<img.*?src=[\'"](.*?)[\'"].*?\/?>/i; // 3-img-src: <img ... src='' />
const IMG_TAG_ALT_REGEX = /<img.*?alt=[\'"](.*?)[\'"].*?\/?>/i; // 3-img-alt: <img ... alt='' />
const FULL_PATH_REGEX = /^[a-z]\:.*?[jpe?g|png|gif|svg|bmp]/i;
const BLOCKQUOTE_PREFIX = `#^`;
const IMG_MATCH_MIN_LEN = 7;
const extractImage = (text, imgList) => {
    text = text.replace('\\|', '|');
    let img;
    if (!(img = matchImage1(text))) {
        if (!(img = matchImage2(text))) {
            if (!(img = matchImageTag(text))) {
                return;
            }
        }
    }
    imgList.push(img);
    if (img.match) {
        const idx = img.match.index + img.match[0].length;
        if (idx > text.length - IMG_MATCH_MIN_LEN)
            return;
        extractImage(text.substring(idx), imgList);
    }
};
/**
 * ![alt1|alt2|...|altn|width](src)
 * @param text
 * @returns
 */
const matchImage1 = (text) => {
    var _a;
    let match = text.match(IMAGE_LINK_REGEX1); // 1-link: [ ![alt1|alt2|...|altn|width](src) ](https://...)
    let link = false;
    let alt, src;
    if (match) {
        link = true;
        alt = match[2];
        src = match[3];
    }
    else {
        match = text.match(RE_MARKDOWN_IMAGE); // 1: ![alt1|alt2|...|altn|width](src)
        if (match) {
            if (alt = match[1]) {
                if (0 <= alt.indexOf('[') && 0 <= alt.indexOf(']'))
                    return;
            }
            src = match[2];
            if (src && src.startsWith(BLOCKQUOTE_PREFIX))
                return;
        }
    }
    if (!match)
        return null;
    const img = new GalleryImgCto();
    img.link = link;
    img.match = match;
    img.alt = alt;
    img.src = src;
    let width;
    if (img.src) {
        if (SRC_LINK_REGEX.test(img.src)) { // 1.2: match link: http://, file://, app://local/
            if (img.src.startsWith('file://')) {
                img.src = img.src.replace(/^file:\/+/, 'app://local/');
            }
        }
        else if (SRC_IMG_REGREX.test(img.src)) { // 1.3: match image ext: .jpg/.jpeg/.png/.gif/.svg/.bmp
            const srcArr = img.src.split('/');
            if (srcArr && 0 < srcArr.length) {
                img.name = srcArr[srcArr.length - 1];
            }
            img.convert = true;
        }
    }
    const altArr = (_a = img.alt) === null || _a === void 0 ? void 0 : _a.split('\|'); // match[1] = alt1|alt2|...|altn|width
    if (altArr && 1 < altArr.length) {
        if (/\d+/.test(width = altArr[altArr.length - 1])) {
            img.alt = img.alt.substring(0, img.alt.length - width.length - 1);
        }
    }
    return img;
};
/**
 * ![[src|alt1|alt2|width]]
 * @param text
 * @returns
 */
const matchImage2 = (text) => {
    let match = text.match(IMAGE_LINK_REGEX2); // 2-link: [ ![[src|alt1|alt2|width]] ](https://...)
    let link = false;
    let content;
    if (match) {
        link = true;
        content = match[2];
    }
    else {
        match = text.match(RE_WIKILINK_IMAGE); // 2: ![[src|alt1|alt2|width]]
        content = match ? match[1] : null;
        if (content && content.startsWith(BLOCKQUOTE_PREFIX))
            return;
    }
    if (!match)
        return null;
    const img = new GalleryImgCto();
    img.link = link;
    img.match = match;
    const contentArr = content === null || content === void 0 ? void 0 : content.split('|');
    if (contentArr && 0 < contentArr.length && (img.src = contentArr[0].trim())) {
        const srcArr = img.src.split('/');
        if (srcArr && 0 < srcArr.length) {
            img.name = srcArr[srcArr.length - 1];
        }
        if (1 == contentArr.length) {
            img.alt = img.src;
        }
        else {
            img.alt = '';
            for (let i = 1; i < contentArr.length; i++) {
                if (i == contentArr.length - 1 && /\d+/.test(contentArr[i]))
                    break;
                if (img.alt)
                    img.alt += '|';
                img.alt += contentArr[i];
            }
        }
        img.convert = true;
    }
    return img;
};
const matchImageTag = (text) => {
    let match = text.match(IMG_TAG_LINK_SRC_REGEX); // 3-a-img-src: <a> <img ... src=''/> </a>
    let link = false;
    if (match) {
        link = true;
    }
    else {
        match = text.match(IMG_TAG_SRC_REGEX); // 3-img-src: <img ... src='' />
    }
    if (!match)
        return null;
    const img = new GalleryImgCto();
    img.link = link;
    img.match = match;
    img.src = img.link ? match[2] : match[1];
    if (img.src) {
        if (img.src.startsWith('file://')) {
            img.src = img.src.replace(/^file:\/+/, 'app://local/');
        }
        else if (FULL_PATH_REGEX.test(img.src)) {
            img.src = 'app://local/' + img.src;
        }
    }
    const matchAlt = text.match(IMG_TAG_ALT_REGEX);
    img.alt = matchAlt ? matchAlt[1] : '';
    return img;
};
const md5Img = (alt, src) => {
    return Md5.init((alt ? alt : '') + '_' + src);
};

class GalleryNavbarView {
    constructor(mainContainerView, plugin) {
        // whether to display gallery navbar
        this.state = false;
        this.galleryNavbarEl = null;
        this.galleryListEl = null;
        this.galleryIsMousingDown = false;
        this.galleryMouseDownClientX = 0;
        this.galleryTranslateX = 0;
        this.CACHE_LIMIT = 10;
        this.CLICK_TIME = 150;
        this.renderGalleryImg = (imgFooterEl) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.state)
                return;
            // get all of images on the current editor
            const activeView = this.plugin.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (!activeView
                || 'markdown' !== activeView.getViewType()
                // modal-container: community plugin, flashcards (Space Repetition)
                || 0 < this.mainContainerView.getDoc().getElementsByClassName('modal-container').length) {
                if (this.galleryNavbarEl)
                    this.galleryNavbarEl.hidden = true;
                if (this.galleryListEl)
                    this.galleryListEl.innerHTML = '';
                return;
            }
            // <div class="gallery-navbar"> <ul class="gallery-list"> <li> <img src='' alt=''> </li> <li...> <ul> </div>
            this.initGalleryNavbar(imgFooterEl);
            const activeFile = activeView.file;
            let galleryImg = this.getGalleryImgCache(activeFile);
            // let hitCache: boolean = true;
            if (!galleryImg) {
                // hitCache = false;
                galleryImg = parseActiveViewData(this.plugin, (_a = activeView.data) === null || _a === void 0 ? void 0 : _a.split('\n'), activeFile);
                this.setGalleryImgCache(galleryImg);
            }
            // console.log('oit-gallery-navbar: ' + (hitCache ? 'hit cache' : 'miss cache') + '!', galleryImg);
            const imgList = galleryImg.galleryImgList;
            const imgContextHash = this.getTargetImgContextHash(this.mainContainerView.getLastClickedImgEl(), activeView.containerEl, this.plugin.imgSelector);
            let liEl, imgEl, liElActive;
            let imgListEl = new Array();
            let targetImageIdx = -1, targetRealIdx = 0;
            let isAddGalleryActive = false;
            let prevHash, nextHash;
            const viewImageWithLink = this.plugin.settings.viewImageWithLink;
            for (let i = 0, len = imgList.length; i < len; i++) {
                const img = imgList[i];
                if (!viewImageWithLink && img.link)
                    continue;
                // <li> <img class='gallery-img' src='' alt=''> </li>
                this.galleryListEl.append(liEl = createEl('li'));
                liEl.append(imgEl = createEl('img'));
                imgEl.addClass('gallery-img', 'oit-img');
                imgEl.setAttr('alt', img.alt);
                imgEl.setAttr('src', img.src);
                imgListEl.push(imgEl);
                this.mainContainerView.setImgViewDefaultBackground(imgEl);
                // find the target image (which image is just clicked)
                if (!imgContextHash || isAddGalleryActive)
                    continue;
                if (imgContextHash[1] == img.hash) {
                    if (0 > targetImageIdx) {
                        targetImageIdx = i;
                        liElActive = liEl;
                        targetRealIdx = imgListEl.length;
                    }
                    if (0 == i) {
                        prevHash = null;
                        nextHash = 1 < len ? imgList[i + 1].hash : null;
                    }
                    else if (len - 1 == i) {
                        prevHash = imgList[i - 1].hash;
                        nextHash = null;
                    }
                    else {
                        prevHash = imgList[i - 1].hash;
                        nextHash = imgList[i + 1].hash;
                    }
                    if (imgContextHash[0] == prevHash && imgContextHash[2] == nextHash) {
                        isAddGalleryActive = true;
                        liElActive = liEl;
                    }
                }
            }
            const realTotalNum = imgListEl.length;
            this.mainContainerView.renderImgTitle(null, '[' + targetRealIdx + '/' + realTotalNum + ']');
            imgListEl.forEach((value, index) => {
                value.dataset.index = '[' + (index + 1) + '/' + realTotalNum + ']';
            });
            if (0 <= targetImageIdx) {
                if (liElActive) {
                    liElActive.addClass('gallery-active');
                    if (this.settings.galleryImgBorderActive) {
                        liElActive.addClass('img-border-active');
                        liElActive.style.setProperty('border-color', this.settings.galleryImgBorderActiveColor);
                    }
                }
                this.galleryTranslateX = (this.mainContainerView.getDoc().documentElement.clientWidth || this.mainContainerView.getDoc().body.clientWidth) / 2.5 - targetImageIdx * 52;
                this.galleryListEl.style.transform = 'translateX(' + this.galleryTranslateX + 'px)';
            }
        });
        this.initDefaultData = () => {
            this.galleryMouseDownClientX = 0;
            this.galleryTranslateX = 0;
            if (this.galleryListEl) {
                this.galleryListEl.style.transform = 'translateX(0px)';
                // remove all childs (li) of gallery-list
                this.galleryListEl.innerHTML = '';
            }
        };
        this.initGalleryNavbar = (imgFooterEl) => {
            // <div class="gallery-navbar">
            if (!this.galleryNavbarEl) {
                // imgInfo.imgFooterEl.append(galleryNavbarEl = createDiv());
                imgFooterEl.append(this.galleryNavbarEl = createDiv());
                this.galleryNavbarEl.addClass('gallery-navbar');
                this.galleryNavbarEl.onmouseover = () => {
                    this.galleryNavbarEl.style.setProperty('background-color', this.settings.galleryNavbarHoverColor);
                };
                this.galleryNavbarEl.onmouseout = () => {
                    this.galleryNavbarEl.style.setProperty('background-color', this.settings.galleryNavbarDefaultColor);
                };
                // add events
                this.galleryNavbarEl.addEventListener('mousedown', this.mouseDownGallery);
                this.galleryNavbarEl.addEventListener('mousemove', this.mouseMoveGallery);
                this.galleryNavbarEl.addEventListener('mouseup', this.mouseUpGallery);
                this.galleryNavbarEl.addEventListener('mouseleave', this.mouseLeaveGallery);
            }
            this.galleryNavbarEl.style.setProperty('background-color', this.settings.galleryNavbarDefaultColor);
            if (!this.galleryListEl) {
                this.galleryNavbarEl.append(this.galleryListEl = createEl('ul')); // <ul class="gallery-list">
                this.galleryListEl.addClass('gallery-list');
            }
            this.initDefaultData();
            this.galleryNavbarEl.hidden = false; // display 'gallery-navbar'
            this.state = true;
        };
        this.closeGalleryNavbar = () => {
            if (!this.state)
                return;
            this.galleryNavbarEl.hidden = true; // hide 'gallery-navbar'
            this.state = false;
            this.initDefaultData();
        };
        this.remove = () => {
            var _a, _b;
            this.state = false;
            (_a = this.galleryNavbarEl) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = this.galleryListEl) === null || _b === void 0 ? void 0 : _b.remove();
            this.galleryNavbarEl = null;
            this.galleryListEl = null;
            this.galleryIsMousingDown = false;
            this.galleryMouseDownClientX = 0;
            this.galleryTranslateX = 0;
            this.mouseDownTime = null;
            GalleryNavbarView.GALLERY_IMG_CACHE = new Map();
            this.initDefaultData();
        };
        this.getTargetImgContextHash = (targetImgEl, containerEl, imageSelector) => {
            let imgEl;
            let targetImgHash = null;
            let targetIdx = -1;
            const imgs = containerEl.querySelectorAll(imageSelector);
            // console.log('IMAGE_SELECTOR>>', imageSelector, imgs);
            const len = imgs.length;
            for (let i = 0; i < len; i++) {
                if ((imgEl = imgs[i])) {
                    if ('1' == imgEl.getAttribute('data-oit-target')) {
                        targetIdx = i;
                        targetImgHash = md5Img(imgEl.alt, imgEl.src);
                        break;
                    }
                }
            }
            if (0 > targetIdx)
                targetImgHash = md5Img(targetImgEl.alt, targetImgEl.src);
            let prevHash, nextHash;
            if (0 == targetIdx) {
                prevHash = null;
                nextHash = 1 < len ? md5Img(imgs[1].alt, imgs[1].src) : null;
            }
            else if (len - 1 == targetIdx) {
                prevHash = md5Img(imgs[targetIdx - 1].alt, imgs[targetIdx - 1].src);
                nextHash = null;
            }
            else {
                prevHash = md5Img(imgs[targetIdx - 1].alt, imgs[targetIdx - 1].src);
                nextHash = md5Img(imgs[targetIdx + 1].alt, imgs[targetIdx + 1].src);
            }
            return [prevHash, targetImgHash, nextHash];
        };
        this.activateImage = (liEl, imgEL) => {
            if (!liEl || 'LI' !== liEl.tagName)
                return;
            if (!imgEL) {
                const imgELList = liEl.getElementsByTagName('img');
                if (imgELList && 0 < imgELList.length) {
                    imgEL = imgELList[0];
                }
            }
            if (imgEL) {
                const activeImg = this.mainContainerView.getActiveImg();
                this.mainContainerView.initDefaultData(activeImg, imgEL.style);
                this.mainContainerView.refreshImg(activeImg, imgEL.src, imgEL.alt || '', imgEL.dataset.index);
            }
            liEl.addClass('gallery-active');
            if (this.settings.galleryImgBorderActive) {
                liEl.addClass('img-border-active');
                liEl.style.setProperty('border-color', this.settings.galleryImgBorderActiveColor);
            }
        };
        this.deactivateImage = (liEl) => {
            if (!liEl)
                return;
            liEl.removeClass('gallery-active');
            if (liEl.hasClass('img-border-active')) {
                liEl.removeClass('img-border-active');
                liEl.style.removeProperty('border-color');
            }
        };
        this.clickGalleryImg = (event) => {
            const targetEl = event.target;
            if (!targetEl || 'IMG' !== targetEl.tagName)
                return;
            if (this.galleryListEl) {
                const liElList = this.galleryListEl.getElementsByClassName('gallery-active');
                for (let i = 0, len = liElList.length; i < len; i++) {
                    this.deactivateImage(liElList[i]);
                }
            }
            this.activateImage(targetEl.parentElement, targetEl);
        };
        /**
         * switch the image on the gallery navbar
         * @param next true: switch to the next image; false: switch to the previous image
         */
        this.switchImage = (next) => {
            if (!this.state || !this.galleryListEl)
                return;
            const liElList = this.galleryListEl.getElementsByTagName('li');
            if (!liElList || 0 >= liElList.length)
                return;
            let liEl;
            let toSwitchIdx = -1;
            for (let i = 0, len = liElList.length; i < len; i++) {
                if (!(liEl = liElList[i]))
                    continue;
                if (liEl.hasClass('gallery-active')) {
                    toSwitchIdx = next ? (len <= (i + 1) ? 0 : i + 1) : (0 == i ? len - 1 : i - 1);
                    this.deactivateImage(liEl);
                    break;
                }
            }
            if (0 >= toSwitchIdx) {
                toSwitchIdx = 0;
            }
            this.activateImage(liElList[toSwitchIdx]);
        };
        this.mouseDownGallery = (event) => {
            // console.log('mouse Down Gallery...');
            event.preventDefault();
            event.stopPropagation();
            this.mouseDownTime = new Date().getTime();
            this.galleryIsMousingDown = true;
            this.galleryMouseDownClientX = event.clientX;
        };
        this.mouseMoveGallery = (event) => {
            // console.log('mouse Move Gallery...');
            event.preventDefault();
            event.stopPropagation();
            if (!this.galleryIsMousingDown)
                return;
            let moveDistance = event.clientX - this.galleryMouseDownClientX;
            if (4 > Math.abs(moveDistance))
                return;
            this.galleryMouseDownClientX = event.clientX;
            this.galleryTranslateX += moveDistance;
            const windowWidth = this.mainContainerView.getDoc().documentElement.clientWidth || this.mainContainerView.getDoc().body.clientWidth;
            const imgLiWidth = (this.galleryListEl.childElementCount - 1) * 52;
            // console.log('move...', 'windowWidth=' + windowWidth, 'galleryTranslateX=' + galleryTranslateX, 'li count=' + imgInfo.galleryList.childElementCount);
            if (this.galleryTranslateX + 50 >= windowWidth)
                this.galleryTranslateX = windowWidth - 50;
            if (0 > this.galleryTranslateX + imgLiWidth)
                this.galleryTranslateX = -imgLiWidth;
            this.galleryListEl.style.transform = 'translateX(' + this.galleryTranslateX + 'px)';
        };
        this.mouseUpGallery = (event) => {
            // console.log('mouse Up Gallery>>>', event.target);
            event.preventDefault();
            event.stopPropagation();
            this.galleryIsMousingDown = false;
            if (!this.mouseDownTime || this.CLICK_TIME > new Date().getTime() - this.mouseDownTime) {
                this.clickGalleryImg(event);
            }
            this.mouseDownTime = null;
        };
        this.mouseLeaveGallery = (event) => {
            // console.log('mouse Leave Gallery>>>', event.target);
            event.preventDefault();
            event.stopPropagation();
            this.galleryIsMousingDown = false;
            this.mouseDownTime = null;
        };
        this.getGalleryImgCache = (file) => {
            if (!file)
                return null;
            const md5File = this.md5File(file.path, file.stat.ctime);
            if (!md5File)
                return null;
            const galleryImgCache = GalleryNavbarView.GALLERY_IMG_CACHE.get(md5File);
            if (galleryImgCache && file.stat.mtime !== galleryImgCache.file.mtime) {
                GalleryNavbarView.GALLERY_IMG_CACHE.delete(md5File);
                return null;
            }
            return galleryImgCache;
        };
        this.setGalleryImgCache = (galleryImg) => {
            const md5File = this.md5File(galleryImg.file.path, galleryImg.file.ctime);
            if (!md5File)
                return;
            this.trimGalleryImgCache();
            GalleryNavbarView.GALLERY_IMG_CACHE.set(md5File, galleryImg);
        };
        this.trimGalleryImgCache = () => {
            if (GalleryNavbarView.GALLERY_IMG_CACHE.size < this.CACHE_LIMIT)
                return;
            let earliestMtime, earliestKey;
            GalleryNavbarView.GALLERY_IMG_CACHE.forEach((value, key) => {
                if (!earliestMtime) {
                    earliestMtime = value.mtime;
                    earliestKey = key;
                }
                else {
                    if (earliestMtime > value.mtime) {
                        earliestMtime = value.mtime;
                        earliestKey = key;
                    }
                }
            });
            if (earliestKey) {
                GalleryNavbarView.GALLERY_IMG_CACHE.delete(earliestKey);
            }
        };
        this.md5File = (path, ctime) => {
            if (!path || !ctime)
                return;
            return Md5.init(path + '_' + ctime);
        };
        this.mainContainerView = mainContainerView;
        this.plugin = plugin;
        this.settings = plugin.settings;
    }
}
GalleryNavbarView.GALLERY_IMG_CACHE = new Map();

class NormalContainerView extends ContainerView {
    constructor(plugin) {
        super(plugin);
        //region ================== Container View ========================
        this.initContainerDom = (parentContainerEl) => {
            let imgCto;
            if (!this.imgInfo.oitContainerEl) {
                // init `oit-normal` dom at first time
                // <div class="oit oit-normal"> ... <div>
                (this.imgInfo.oitContainerEl = createDiv()).addClass(OIT_CLASS.CONTAINER_ROOT, OIT_CLASS.CONTAINER_NORMAL);
                parentContainerEl.appendChild(this.imgInfo.oitContainerEl);
                // 1. <div class="oit-img-container">...</div>
                this.imgInfo.oitContainerEl.append(this.imgInfo.imgContainerEl = createDiv(OIT_CLASS.IMG_CONTAINER));
                // 1.1. <div class="oit-img-container"> `<img class="oit-img-view" src="" alt="">` </div>
                this.updateImgViewElAndList(this.imgInfo);
                // 2. <div class="oit-img-tip"></div>
                this.imgInfo.oitContainerEl.appendChild(this.imgInfo.imgTipEl = createDiv(OIT_CLASS.IMG_TTP));
                this.imgInfo.imgTipEl.hidden = true;
                // 3. <div class="oit-img-footer"> ... <div>
                this.imgInfo.oitContainerEl.appendChild(this.imgInfo.imgFooterEl = createDiv(OIT_CLASS.IMG_FOOTER));
                // 3.1. <div class="oit-img-title"></div>
                this.imgInfo.imgFooterEl.appendChild(this.imgInfo.imgTitleEl = createDiv(OIT_CLASS.IMG_TITLE));
                // <span class="oit-img-title-name"></span>
                this.imgInfo.imgTitleEl.appendChild(this.imgInfo.imgTitleNameEl = createSpan(OIT_CLASS.IMG_TITLE_NAME));
                // <span class="oit-img-title-index"></span>
                this.imgInfo.imgTitleEl.appendChild(this.imgInfo.imgTitleIndexEl = createSpan(OIT_CLASS.IMG_TITLE_INDEX));
                // 3.2. <ul class="oit-img-toolbar">
                const imgToolbarUlEL = createEl('ul');
                imgToolbarUlEL.addClass(OIT_CLASS.IMG_TOOLBAR);
                this.imgInfo.imgFooterEl.appendChild(imgToolbarUlEL);
                let toolbarLi;
                for (const toolbar of TOOLBAR_CONF) {
                    if (!toolbar.enableToolbarIcon)
                        continue;
                    imgToolbarUlEL.appendChild(toolbarLi = createEl('li'));
                    toolbarLi.addClass(toolbar.class);
                    toolbarLi.setAttribute('alt', toolbar.title);
                    // @ts-ignore
                    toolbarLi.setAttribute('title', t(toolbar.title));
                }
                // add event: for oit-img-toolbar ul
                imgToolbarUlEL.addEventListener('click', this.clickImgToolbar);
                // <div class="img-player"> <img class='img-fullscreen' src=''> </div>
                this.imgInfo.oitContainerEl.appendChild(this.imgInfo.imgPlayerEl = createDiv(OIT_CLASS.IMG_PLAYER)); // img-player for full screen mode
                this.imgInfo.imgPlayerEl.appendChild(this.imgInfo.imgPlayerImgViewEl = createEl('img'));
                this.imgInfo.imgPlayerImgViewEl.addClass(OIT_CLASS.IMG_FULLSCREEN);
            }
            imgCto = this.imgInfo.imgList[0];
            this.imgGlobalStatus.activeImg = imgCto;
            return imgCto;
        };
        this.openOitContainerView = (matchedImg) => {
            if (!this.imgInfo.oitContainerEl) {
                console.error('obsidian-image-toolkit: oit-*-container-view has not been initialized!');
                return;
            }
            matchedImg.popup = true;
            this.imgGlobalStatus.popup = true;
            // display 'oit-normal'
            this.imgInfo.oitContainerEl.style.setProperty('display', 'block');
        };
        this.closeContainerView = (event, activeImg) => {
            if (event) {
                const target = event.target;
                if (!target || !(target.hasClass(OIT_CLASS.CONTAINER_ROOT) || target.hasClass(OIT_CLASS.IMG_CONTAINER)))
                    return;
            }
            if (!activeImg && !(activeImg = this.imgGlobalStatus.activeImg))
                return;
            if (this.imgInfo.oitContainerEl) {
                this.imgInfo.oitContainerEl.style.setProperty('display', 'none'); // hide 'oit-normal'
                this.renderImgTitle('', '');
                this.renderImgView(activeImg.imgViewEl, '', '');
                // remove events
                this.imgGlobalStatus.popup = false;
                activeImg.popup = false;
                activeImg.mtime = 0;
                this.addOrRemoveEvents(activeImg, false);
            }
            if (this.plugin.settings.galleryNavbarToggle && this.galleryNavbarView) {
                this.galleryNavbarView.closeGalleryNavbar();
            }
        };
        //endregion
        //region ================== Gallery Navbar ========================
        this.renderGalleryNavbar = () => {
            // <div class="gallery-navbar"> <ul class="gallery-list"> <li> <img src='' alt=''> </li> <li...> <ul> </div>
            if (!this.plugin.settings.galleryNavbarToggle)
                return;
            if (!this.galleryNavbarView) {
                this.galleryNavbarView = new GalleryNavbarView(this, this.plugin);
            }
            this.galleryNavbarView.renderGalleryImg(this.imgInfo.imgFooterEl);
        };
        this.removeGalleryNavbar = () => {
            if (!this.galleryNavbarView)
                return;
            this.galleryNavbarView.remove();
            this.galleryNavbarView = null;
        };
        //endregion
        this.renderImgTitle = (name, index) => {
            var _a, _b;
            if (undefined !== name && null !== name)
                (_a = this.imgInfo.imgTitleNameEl) === null || _a === void 0 ? void 0 : _a.setText(name);
            if (undefined !== index && null !== index)
                (_b = this.imgInfo.imgTitleIndexEl) === null || _b === void 0 ? void 0 : _b.setText(' ' + index);
        };
        this.switchImageOnGalleryNavBar = (event, next) => {
            var _a;
            if (!this.checkHotkeySettings(event, this.plugin.settings.switchTheImageHotkey))
                return;
            (_a = this.galleryNavbarView) === null || _a === void 0 ? void 0 : _a.switchImage(next);
        };
    }
    setActiveImgForMouseEvent(imgCto) {
    }
}

/**
 * Right click menu
 */
class MenuView {
    constructor(pinContainerView) {
        this.init = () => {
            if (this.menu)
                return;
            this.menu = new obsidian.Menu();
            for (const itemConf of TOOLBAR_CONF) {
                if (!itemConf.enableMenu)
                    continue;
                if (SEPARATOR_SYMBOL === itemConf.title) {
                    this.menu.addSeparator();
                    continue;
                }
                this.menu.addItem(item => {
                    if (itemConf.icon)
                        item.setIcon(itemConf.icon);
                    // @ts-ignore
                    item.setTitle(t(itemConf.title))
                        .onClick(() => {
                        this.pinContainerView.clickImgToolbar(null, itemConf.class, MenuView.activeImg);
                    });
                });
            }
        };
        this.show = (event, activeImg) => {
            MenuView.activeImg = activeImg;
            this.init();
            this.menu.showAtPosition({ x: event.clientX, y: event.clientY });
        };
        this.pinContainerView = pinContainerView;
    }
}

/**
 * PinContainerView: Pin an image on the top
 * @Support: move an image by mouse; close an image by Esc
 * @Nonsupport: move an image by keyboard; display gallery navbar
 */
class PinContainerView extends ContainerView {
    constructor(plugin /*, viewMode: ViewMode*/) {
        super(plugin /*, viewMode, plugin.settings.pinMaximum*/);
        //region ================== Container View ========================
        this.initContainerDom = (parentContainerEl) => {
            /*
            <div class="oit-pin-container-view">
              <div class="oit-img-container">
                <img class="oit-img-view" data-index='0' src="" alt="">
                <img class="oit-img-view" data-index='1' src="" alt="">
                ...
              </div>
            </div>
             */
            if (!this.imgInfo.oitContainerEl) { // init at first time
                // create: <div class="oit oit-pin">
                (this.imgInfo.oitContainerEl = createDiv()).addClass(OIT_CLASS.CONTAINER_ROOT, OIT_CLASS.CONTAINER_PIN);
                parentContainerEl.appendChild(this.imgInfo.oitContainerEl);
                // <div class="oit oit-pin"> <div class="oit-img-container"/> </div>
                this.imgInfo.oitContainerEl.append(this.imgInfo.imgContainerEl = createDiv(OIT_CLASS.IMG_CONTAINER));
                // <div class="oit-img-tip"></div>
                this.imgInfo.oitContainerEl.appendChild(this.imgInfo.imgTipEl = createDiv(OIT_CLASS.IMG_TTP)); // oit-img-tip
                this.imgInfo.imgTipEl.hidden = true; // hide 'oit-img-tip'
                // <div class="img-player"> <img class='img-fullscreen' src=''> </div>
                this.imgInfo.oitContainerEl.appendChild(this.imgInfo.imgPlayerEl = createDiv(OIT_CLASS.IMG_PLAYER)); // img-player for full screen mode
                this.imgInfo.imgPlayerEl.appendChild(this.imgInfo.imgPlayerImgViewEl = createEl('img'));
                this.imgInfo.imgPlayerImgViewEl.addClass(OIT_CLASS.IMG_FULLSCREEN);
            }
            // <div class="oit-img-container"> <img class="oit-img-view" src="" alt=""> </div>
            this.updateImgViewElAndList(this.imgInfo);
            return this.getMatchedImg();
        };
        this.openOitContainerView = (matchedImg) => {
            if (!this.imgInfo.oitContainerEl) {
                console.error('obsidian-image-toolkit: oit-*-container-view has not been initialized!');
                return;
            }
            matchedImg.popup = true;
            if (!this.imgGlobalStatus.popup) {
                this.imgGlobalStatus.popup = true;
                this.imgGlobalStatus.activeImgZIndex = 0;
                this.imgInfo.imgList.forEach(value => {
                    value.zIndex = 0;
                });
            }
            else {
                matchedImg.zIndex = (++this.imgGlobalStatus.activeImgZIndex);
            }
            matchedImg.imgViewEl.style.setProperty('z-index', matchedImg.zIndex + '');
            // display 'oit-pin-container-view'
            this.imgInfo.oitContainerEl.style.setProperty('display', 'block');
        };
        /**
         * hide container view
         * @param event not null: click event; null: keyboard event (Esc)
         * @param activeImg
         */
        this.closeContainerView = (event, activeImg) => {
            if (event && !activeImg) {
                // PinContainerView doesn't need click event to hide container for now
                return;
            }
            if (!this.imgInfo.oitContainerEl)
                return;
            if (!activeImg && !(activeImg = this.imgGlobalStatus.activeImg))
                return;
            // console.log('closeContainerView', event, activeImg)
            this.renderImgView(activeImg.imgViewEl, '', '');
            activeImg.popup = false;
            activeImg.mtime = 0;
            let globalPopupFlag = false;
            for (const imgCto of this.imgInfo.imgList) {
                if (imgCto.popup) {
                    globalPopupFlag = true;
                    break;
                }
            }
            if (!globalPopupFlag) {
                this.imgInfo.oitContainerEl.style.setProperty('display', 'none'); // hide 'oit-pin-container-view'
                this.imgGlobalStatus.activeImgZIndex = 0;
                this.imgInfo.imgList.forEach(value => {
                    value.zIndex = 0;
                });
            }
            this.imgGlobalStatus.popup = globalPopupFlag;
            this.addOrRemoveEvents(activeImg, false);
        };
        //endregion
        this.setActiveImgZIndex = (activeImg) => {
            var _a;
            let isUpdate = false;
            for (const imgCto of this.imgInfo.imgList) {
                if (activeImg.index !== imgCto.index && activeImg.zIndex <= imgCto.zIndex) {
                    isUpdate = true;
                    break;
                }
            }
            if (isUpdate) {
                activeImg.zIndex = (++this.imgGlobalStatus.activeImgZIndex);
                (_a = activeImg.imgViewEl) === null || _a === void 0 ? void 0 : _a.style.setProperty("z-index", activeImg.zIndex + '');
            }
        };
        this.setMenuView(new MenuView(this));
    }
    setActiveImgForMouseEvent(imgCto) {
        this.imgGlobalStatus.activeImg = imgCto;
    }
}

class ContainerFactory {
    constructor() {
        // popout window containers: hash -> ContainerView
        this.popoutContainers = new Map();
        this.setMainContainer = (container) => {
            this.mainContainer = container;
        };
        this.getMainContainer = () => {
            return this.mainContainer;
        };
        this.setPopoutContainer = (key, container) => {
            this.popoutContainers.set(key, container);
        };
        this.getPopoutContainer = (key) => {
            return this.popoutContainers.get(key);
        };
        this.getPopoutContainers = () => {
            return this.popoutContainers;
        };
        this.getContainer = (targetEl) => {
            const bodyEl = targetEl === null || targetEl === void 0 ? void 0 : targetEl.matchParent('body');
            if (!bodyEl)
                return null;
            const oitEventKey = bodyEl.getAttribute('data-oit-event');
            if (oitEventKey) {
                //popout window
                return this.getPopoutContainer(oitEventKey);
            }
            return this.mainContainer;
        };
        this.getAllContainers = () => {
            let allContainerViews = [this.mainContainer];
            for (let value of this.popoutContainers.values()) {
                allContainerViews.push(value);
            }
            return allContainerViews;
        };
        this.clearAll = () => {
            this.mainContainer = null;
            this.popoutContainers.clear();
        };
    }
}

class ImageToolkitPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.containerFactory = new ContainerFactory();
        this.imgSelector = ``;
        this.addIcons = () => __awaiter(this, void 0, void 0, function* () {
            for (const icon of ICONS) {
                obsidian.addIcon(icon.id, icon.svg);
            }
        });
        this.getViewMode = () => {
            return this.settings.viewMode;
        };
        this.setViewMode = (viewMode) => {
            return this.settings.viewMode = viewMode;
        };
        this.checkViewMode = (viewMode) => __awaiter(this, void 0, void 0, function* () {
            for (const key in ViewMode) {
                if (key == viewMode) {
                    return;
                }
            }
            this.setViewMode(DEFAULT_VIEW_MODE);
            console.log('[oit] Reset view mode: %s', DEFAULT_VIEW_MODE);
            yield this.saveSettings();
        });
        this.getAllContainerViews = () => {
            return this.containerFactory.getAllContainers();
        };
        this.initContainer = (viewMode, popoutWindowEventId) => __awaiter(this, void 0, void 0, function* () {
            const container = yield this.initContainerByViewMode(viewMode);
            if (!container) {
                console.error('[oit] Cannot init container');
                return;
            }
            if (popoutWindowEventId) {
                // popoutWindowEventId will be recorded into data-oit-event'of body tag
                this.containerFactory.setPopoutContainer(popoutWindowEventId, container);
            }
            else {
                this.containerFactory.setMainContainer(container);
            }
        });
        this.initContainerByViewMode = (viewMode, fromDefault) => __awaiter(this, void 0, void 0, function* () {
            switch (viewMode) {
                case ViewMode.Normal:
                    return new NormalContainerView(this);
                case ViewMode.Pin:
                    return new PinContainerView(this);
                default:
                    if (fromDefault) {
                        return null;
                    }
                    this.setViewMode(viewMode = DEFAULT_VIEW_MODE);
                    yield this.saveSettings();
                    console.log('[oit] Reset view mode to: %s', viewMode);
                    return this.initContainerByViewMode(viewMode, true);
            }
        });
        this.isImageElement = (imgEl) => {
            return imgEl && 'IMG' === imgEl.tagName;
        };
        this.isClickable = (targetEl, event) => {
            let container;
            if (this.isImageElement(targetEl)
                && (container = this.containerFactory.getContainer(targetEl))
                && container.checkHotkeySettings(event, this.settings.viewTriggerHotkey)) {
                return container;
            }
            return null;
        };
        this.switchViewMode = (viewMode) => __awaiter(this, void 0, void 0, function* () {
            this.settings.viewMode = viewMode;
            yield this.saveSettings();
            this.getAllContainerViews().forEach(container => {
                var _a;
                container.removeOitContainerView();
                this.initContainer(viewMode, (_a = container.getParentContainerEl()) === null || _a === void 0 ? void 0 : _a.getAttribute('data-oit-event'));
            });
        });
        /**
         * refresh events for main container
         */
        this.refreshViewTrigger = (doc) => {
            // .workspace-leaf-content[data-type='markdown'] img,.workspace-leaf-content[data-type='image'] img
            const viewImageInEditor = this.settings.viewImageInEditor;
            // .community-modal-details img
            const viewImageInCPB = this.settings.viewImageInCPB;
            // false: ... img:not(a img)
            const viewImageWithLink = this.settings.viewImageWithLink;
            // #sr-flashcard-view img
            const viewImageOther = this.settings.viewImageOther;
            if (!doc) {
                doc = document;
            }
            if (this.imgSelector) {
                doc.off('click', this.imgSelector, this.clickImage);
                doc.off('mouseover', this.imgSelector, this.mouseoverImg);
                doc.off('mouseout', this.imgSelector, this.mouseoutImg);
            }
            if (!viewImageOther && !viewImageInEditor && !viewImageInCPB && !viewImageWithLink) {
                return;
            }
            let selector = ``;
            if (viewImageInEditor) {
                selector += (viewImageWithLink ? VIEW_IMG_SELECTOR.EDITOR_AREAS : VIEW_IMG_SELECTOR.EDITOR_AREAS_NO_LINK);
            }
            if (viewImageInCPB) {
                selector += (1 < selector.length ? `,` : ``) + (viewImageWithLink ? VIEW_IMG_SELECTOR.CPB : VIEW_IMG_SELECTOR.CPB_NO_LINK);
            }
            if (viewImageOther) {
                selector += (1 < selector.length ? `,` : ``) + (viewImageWithLink ? VIEW_IMG_SELECTOR.OTHER : VIEW_IMG_SELECTOR.OTHER_NO_LINK);
            }
            if (selector) {
                this.imgSelector = selector;
                // doc.onclick = (event: MouseEvent) =>{
                //     console.log(event.target);
                // }
                doc.on('click', this.imgSelector, this.clickImage);
                doc.on('mouseover', this.imgSelector, this.mouseoverImg);
                doc.on('mouseout', this.imgSelector, this.mouseoutImg);
            }
        };
        this.clickImage = (event) => {
            const targetEl = event.target;
            let container = this.isClickable(targetEl, event);
            if (container) {
                container.renderContainer(targetEl);
            }
        };
        this.mouseoverImg = (event) => {
            const targetEl = event.target;
            if (!this.isClickable(targetEl, event)) {
                return;
            }
            if (null == targetEl.getAttribute(ImageToolkitPlugin.IMG_ORIGIN_CURSOR)) {
                targetEl.setAttribute(ImageToolkitPlugin.IMG_ORIGIN_CURSOR, targetEl.style.cursor || '');
            }
            targetEl.style.cursor = 'zoom-in';
        };
        this.mouseoutImg = (event) => {
            const targetEl = event.target;
            if (!this.isClickable(targetEl, event)) {
                return;
            }
            targetEl.style.cursor = targetEl.getAttribute(ImageToolkitPlugin.IMG_ORIGIN_CURSOR);
        };
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('loading %s plugin v%s ...', this.manifest.id, this.manifest.version);
            yield this.loadSettings();
            this.addSettingTab(new ImageToolkitSettingTab(this.app, this));
            // this.registerCommands();
            yield this.initContainer(this.settings.viewMode);
            this.refreshViewTrigger();
            // addEventListener for opened new windows
            this.app.workspace.on('layout-change', () => {
                this.app.workspace.iterateAllLeaves((leaf) => {
                    var _a;
                    if (['markdown', 'image'].includes((_a = leaf.getViewState()) === null || _a === void 0 ? void 0 : _a.type)) {
                        const bodyEl = leaf.view.containerEl.matchParent('body');
                        if (bodyEl === null || bodyEl === void 0 ? void 0 : bodyEl.hasClass('is-popout-window')) {
                            if (!bodyEl.hasAttribute(ImageToolkitPlugin.POPOUT_WINDOW_EVENT)) {
                                console.log('popout leaf:', leaf, leaf.getDisplayText());
                                const eventId = crypto.randomUUID();
                                this.initContainer(this.settings.viewMode, eventId);
                                bodyEl.setAttr(ImageToolkitPlugin.POPOUT_WINDOW_EVENT, eventId);
                                this.refreshViewTrigger(bodyEl.ownerDocument);
                            }
                        }
                    }
                });
            });
        });
    }
    onunload() {
        console.log('unloading ' + this.manifest.id + ' plugin...');
        this.getAllContainerViews().forEach(container => {
            container.removeOitContainerView();
        });
        this.containerFactory.clearAll();
        document.off('click', this.imgSelector, this.clickImage);
        document.off('mouseover', this.imgSelector, this.mouseoverImg);
        document.off('mouseout', this.imgSelector, this.mouseoutImg);
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
            yield this.checkViewMode(this.getViewMode());
            yield this.addIcons();
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    registerCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            /* this.addCommand({
                "id": "oit-move-up-image",
                "name": "move up the image",
                hotkeys: [{ modifiers: ["Ctrl"], key: "ArrowUp" }],
                checkCallback: (checking: boolean) => {
                    if (checking) return false;
                    this.containerView.moveImgViewByHotkey('UP');
                },
            }); */
        });
    }
}
ImageToolkitPlugin.IMG_ORIGIN_CURSOR = 'data-oit-origin-cursor';
// data-oit-event: 标识new window是否已addEventListener for click
ImageToolkitPlugin.POPOUT_WINDOW_EVENT = 'data-oit-event';

module.exports = ImageToolkitPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9sYW5nL2xvY2FsZS9lbi50cyIsInNyYy9sYW5nL2xvY2FsZS96aC1jbi50cyIsInNyYy9sYW5nL2xvY2FsZS96aC10dy50cyIsInNyYy9sYW5nL2hlbHBlcnMudHMiLCJzcmMvY29uZi9jb25zdGFudHMudHMiLCJzcmMvY29uZi9zZXR0aW5ncy50cyIsInNyYy9tb2RlbC9pbWdUby50cyIsInNyYy91dGlsL2ltZ1V0aWwudHMiLCJzcmMvdWkvY29udGFpbmVyL2NvbnRhaW5lci52aWV3LnRzIiwibm9kZV9tb2R1bGVzL21kNS10eXBlc2NyaXB0L2Rpc3QvaW5kZXguanMiLCJzcmMvbW9kZWwvZ2FsbGVyeU5hdmJhclRvLnRzIiwic3JjL21vZGVsL2NvbW1vblRvLnRzIiwic3JjL3V0aWwvbWFya2Rvd1BhcnNlLnRzIiwic3JjL3VpL2dhbGxlcnlOYXZiYXJWaWV3LnRzIiwic3JjL3VpL2NvbnRhaW5lci9ub3JtYWxDb250YWluZXIudmlldy50cyIsInNyYy91aS9tZW51Vmlldy50cyIsInNyYy91aS9jb250YWluZXIvcGluQ29udGFpbmVyLnZpZXcudHMiLCJzcmMvZmFjdG9yeS9jb250YWluZXJGYWN0b3J5LnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIm1vbWVudCIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwic2FuaXRpemVIVE1MVG9Eb20iLCJOb3RpY2UiLCJNYXJrZG93blZpZXciLCJNZW51IiwiUGx1Z2luIiwiYWRkSWNvbiIsInJhbmRvbVVVSUQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW9HQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxD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LElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUYsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsS0FBSyxDQUFDO0FBQ04sSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0FBQzdDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1RixRQUFRLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRCxLQUFLLENBQUM7QUFDTixJQUFJLEdBQUcsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7QUFDN0MsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FB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Q0FBQyxJQUFJLEVBQUUsRUFBRTtBQUMvRCxZQUFZLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFZLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFZLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFZLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDbkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ25HLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNuRyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDbkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJ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
