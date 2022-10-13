import * as mdc from 'material-components-web';

var list;
if ($('.mdc-list').length != 0) {
    list = new mdc.list.MDCList(document.querySelector('.mdc-list'));
}

var buttonripple;
if ($('.mdc-button').length != 0) {
    buttonripple = new mdc.ripple.MDCRipple(document.querySelector('.mdc-button'));
}

var textfield;
if ($('.mdc-text-field').length != 0) {
    textfield = new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));
}

var lineripple;
if ($('.mdc-line-ripple').length != 0) {
    lineripple = new mdc.lineRipple.MDCLineRipple(document.querySelector('.mdc-line-ripple'));
}

var icon;
if ($('.mdc-text-field-icon').length != 0) {
    icon = new mdc.textField.MDCTextFieldIcon(document.querySelector('.mdc-text-field-icon'));
}

var label;
if ($('.mdc-floating-label').length != 0) {
    label = new mdc.floatingLabel.MDCFloatingLabel(document.querySelector('.mdc-floating-label'));
}

var notched;
if ($('.mdc-notched-outline').length != 0) {
    notched = new mdc.notchedOutline.MDCNotchedOutline(document.querySelector('.mdc-notched-outline'));
}

var drawer;
if ($('.mdc-drawer').length != 0) {
    drawer = new mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
}

var topappbar;
if ($('.app-bar').length != 0) {
    topappbar = mdc.topAppBar.MDCTopAppBar.attachTo(document.querySelector('.app-bar'));
    topappbar.setScrollTarget(document.querySelector('.main-content'));
    topappbar.listen('MDCTopAppBar:nav', () => { drawer.open = !drawer.open; });
}

mdc.autoInit();