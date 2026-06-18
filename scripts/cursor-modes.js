import { MODULE_ID, SETTING, DEFAULT_CONFIG, applyCursor } from "./modes.js";
import { CursorModesMenu } from "./settings-menu.js";

Hooks.once("init", () => {
  // Object setting holding the whole config; per-user (client scope).
  game.settings.register(MODULE_ID, SETTING, {
    scope: "client",
    config: false,
    type: Object,
    default: foundry.utils.deepClone(DEFAULT_CONFIG),
    onChange: () => applyCursor()
  });

  game.settings.registerMenu(MODULE_ID, "menu", {
    name: "CURSORMODES.MenuName",
    label: "CURSORMODES.MenuLabel",
    hint: "CURSORMODES.MenuHint",
    icon: "fa-solid fa-arrow-pointer",
    type: CursorModesMenu,
    restricted: false
  });
});

// v13.337+: fires on control-layer / tool / toggle changes.
Hooks.on("activateSceneControls", applyCursor);
// First render of the controls, and a belt-and-braces re-apply when the canvas loads.
Hooks.on("renderSceneControls", applyCursor);
Hooks.on("canvasReady", applyCursor);
Hooks.once("ready", applyCursor);
