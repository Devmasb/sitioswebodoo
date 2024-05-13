/** @odoo-module **/

import { isIosApp, isMobileOS, isMacOS } from "@web/core/browser/feature_detection";
import { useHotkey } from "@web/core/hotkeys/hotkey_hook";
import { useService } from "@web/core/utils/hooks";


import {
    Component,
    useExternalListener,
    onMounted,
    onPatched,
    onWillUpdateProps,
    useState,
    useRef,
} from "@odoo/owl";

class FooterComponent extends Component {
    setup() {
        this.controlKey = isMacOS() ? "COMMAND" : "CONTROL";
    }
}
FooterComponent.template = "web_enterprise.HomeMenu.CommandPalette.Footer";
/**
 * Home menu
 *
 * This component handles the display and navigation between the different
 * available applications and menus.
 * @extends Component
 */
export class HomeMenu extends Component {
    /**
     * @param {Object} props
     * @param {Object[]} props.apps application icons
     * @param {number} props.apps[].actionID
     * @param {number} props.apps[].id
     * @param {string} props.apps[].label
     * @param {string} props.apps[].parents
     * @param {(boolean|string|Object)} props.apps[].webIcon either:
     *      - boolean: false (no webIcon)
     *      - string: path to Odoo icon file
     *      - Object: customized icon (background, class and color)
     * @param {string} [props.apps[].webIconData]
     * @param {string} props.apps[].xmlid
     */
    setup() {
        this.command = useService("command");
        this.menus = useService("menu");
        this.homeMenuService = useService("home_menu");
        this.ui = useService("ui");
        this.state = useState({
            focusedIndex: null,
            isIosApp: isIosApp(),
        });
        this.inputRef = useRef("input");

        if (!this.env.isSmall) {
            this._registerHotkeys();
        }

        onWillUpdateProps(() => {
            // State is reset on each remount
            this.state.focusedIndex = null;
        });

        onMounted(() => {
            if (!isMobileOS()) {
                this._focusInput();
            }
        });

        onPatched(() => {
            if (this.state.focusedIndex !== null && !this.env.isSmall) {
                const selectedItem = document.querySelector(".o_home_menu .o_menuitem.o_focused");
                // When TAB is managed externally the class o_focused disappears.
                if (selectedItem) {
                    // Center window on the focused item
                    selectedItem.scrollIntoView({ block: "center" });
                }
            }
        });
    }

    //--------------------------------------------------------------------------
    // Getters
    //--------------------------------------------------------------------------

    /**
     * @returns {Object[]}
     */
    get displayedApps() {
        return this.props.apps;
    }

    /**
     * @returns {number}
     */
    get maxIconNumber() {
        const w = window.innerWidth;
        if (w < 576) {
            return 3;
        } else if (w < 768) {
            return 4;
        } else {
            return 6;
        }
    }

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param {Object} menu
     * @returns {Promise}
     */
    _openMenu(menu) {
        return this.menus.selectMenu(menu);
    }

    /**
     * Update this.state.focusedIndex if not null.
     * @private
     * @param {string} cmd
     */
    _updateFocusedIndex(cmd) {
        const nbrApps = this.displayedApps.length;
        const lastIndex = nbrApps - 1;
        const focusedIndex = this.state.focusedIndex;
        if (lastIndex < 0) {
            return;
        }
        if (focusedIndex === null) {
            this.state.focusedIndex = 0;
            return;
        }
        const lineNumber = Math.ceil(nbrApps / this.maxIconNumber);
        const currentLine = Math.ceil((focusedIndex + 1) / this.maxIconNumber);
        let newIndex;
        switch (cmd) {
            case "previousElem":
                newIndex = focusedIndex - 1;
                break;
            case "nextElem":
                newIndex = focusedIndex + 1;
                break;
            case "previousColumn":
                if (focusedIndex % this.maxIconNumber) {
                    // app is not the first one on its line
                    newIndex = focusedIndex - 1;
                } else {
                    newIndex =
                        focusedIndex + Math.min(lastIndex - focusedIndex, this.maxIconNumber - 1);
                }
                break;
            case "nextColumn":
                if (focusedIndex === lastIndex || (focusedIndex + 1) % this.maxIconNumber === 0) {
                    // app is the last one on its line
                    newIndex = (currentLine - 1) * this.maxIconNumber;
                } else {
                    newIndex = focusedIndex + 1;
                }
                break;
            case "previousLine":
                if (currentLine === 1) {
                    newIndex = focusedIndex + (lineNumber - 1) * this.maxIconNumber;
                    if (newIndex > lastIndex) {
                        newIndex = lastIndex;
                    }
                } else {
                    // we go to the previous line on same column
                    newIndex = focusedIndex - this.maxIconNumber;
                }
                break;
            case "nextLine":
                if (currentLine === lineNumber) {
                    newIndex = focusedIndex % this.maxIconNumber;
                } else {
                    // we go to the next line on the closest column
                    newIndex =
                        focusedIndex + Math.min(this.maxIconNumber, lastIndex - focusedIndex);
                }
                break;
        }
        // if newIndex is out of bounds -> normalize it
        if (newIndex < 0) {
            newIndex = lastIndex;
        } else if (newIndex > lastIndex) {
            newIndex = 0;
        }
        this.state.focusedIndex = newIndex;
    }

    _focusInput() {
        if (!this.env.isSmall && this.inputRef.el) {
            this.inputRef.el.focus();
        }
    }

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param {Object} app
     */
    _onAppClick(app) {
        this._openMenu(app);
    }

    /**
     * @private
     */
    _registerHotkeys() {
        const hotkeys = [
            ["ArrowDown", () => this._updateFocusedIndex("nextLine")],
            ["ArrowRight", () => this._updateFocusedIndex("nextColumn")],
            ["ArrowUp", () => this._updateFocusedIndex("previousLine")],
            ["ArrowLeft", () => this._updateFocusedIndex("previousColumn")],
            ["Tab", () => this._updateFocusedIndex("nextElem")],
            ["shift+Tab", () => this._updateFocusedIndex("previousElem")],
            [
                "Enter",
                () => {
                    const menu = this.displayedApps[this.state.focusedIndex];
                    if (menu) {
                        this._openMenu(menu);
                    }
                },
            ],
            ["Escape", () => this.homeMenuService.toggle(false)],
        ];
        hotkeys.forEach((hotkey) => {
            useHotkey(...hotkey, {
                allowRepeat: true,
            });
        });
        useExternalListener(window, "keydown", this._onKeydownFocusInput);
    }

    _onKeydownFocusInput() {
        if (
            document.activeElement !== this.inputRef.el &&
            this.ui.activeElement === document &&
            !["TEXTAREA", "INPUT"].includes(document.activeElement.tagName)
        ) {
            this._focusInput();
        }
    }

    _onInputSearch() {
        const onClose = () => {
            this._focusInput();
            this.inputRef.el.value = "";
        };
        const searchValue = this.compositionStart ? "/" : `/${this.inputRef.el.value.trim()}`;
        this.compositionStart = false;
        this.command.openMainPalette({ searchValue, FooterComponent }, onClose);
    }

    _onInputBlur() {
        if (isMobileOS()) {
            return;
        }
        // if we blur search input to focus on body (eg. click on any
        // non-interactive element) restore focus to avoid IME input issue
        setTimeout(() => {
            if (document.activeElement === document.body && this.ui.activeElement === document) {
                this._focusInput();
            }
        }, 0);
    }

    _onCompositionStart() {
        this.compositionStart = true;
    }
}

HomeMenu.props = {
    apps: {
        type: Array,
        element: {
            type: Object,
            shape: {
                actionID: Number,
                appID: Number,
                id: Number,
                label: String,
                parents: String,
                webIcon: {
                    type: [
                        Boolean,
                        String,
                        {
                            type: Object,
                            optional: 1,
                            shape: {
                                iconClass: String,
                                color: String,
                                backgroundColor: String,
                            },
                        },
                    ],
                    optional: true,
                },
                webIconData: { type: String, optional: 1 },
                xmlid: String,
            },
        },
    },
};
HomeMenu.template = "web_enterprise.HomeMenu";
