/**
 * Shared constants + the cursor application logic.
 * No imports from the other module files, so it can be imported anywhere
 * without creating a circular dependency.
 */

export const MODULE_ID = "cursor-modes";

/** The single object setting that stores the whole configuration. */
export const SETTING = "config";

/** Default configuration, pre-wired to the bundled starter cursors. */
export const DEFAULT_CONFIG = Object.freeze({
  /** @type {Record<string, string>} mode key -> cursor image path */
  map: {
    "tokens.target": `modules/${MODULE_ID}/cursors/target.svg`,
    "tokens.ruler":  `modules/${MODULE_ID}/cursors/ruler.svg`,
    "measure":       `modules/${MODULE_ID}/cursors/template.svg`,
    "drawings":      `modules/${MODULE_ID}/cursors/pen.svg`,
    "walls":         `modules/${MODULE_ID}/cursors/wall.svg`
  },
  /** cursor hotspot (click point) in px, applied to every custom cursor */
  hotspotX: 16,
  hotspotY: 16
});

/**
 * The modes shown in the settings menu, in display order.
 * `key` is matched against `${control}.${tool}` first, then `${control}` alone,
 * so a layer-wide cursor and a tool-specific override can both be set.
 *
 * Tool/control names can vary with installed modules — use the console
 * (`ui.controls.control?.name`, `ui.controls.tool?.name`) to discover others;
 * any key you add to the saved map is honoured even if it's not listed here.
 */
export const KNOWN_MODES = Object.freeze([
  { key: "tokens",         label: "CURSORMODES.Mode.tokens" },
  { key: "tokens.select",  label: "CURSORMODES.Mode.tokensSelect" },
  { key: "tokens.target",  label: "CURSORMODES.Mode.tokensTarget" },
  { key: "tokens.ruler",   label: "CURSORMODES.Mode.tokensRuler" },
  { key: "measure",        label: "CURSORMODES.Mode.measure" },
  { key: "tiles",          label: "CURSORMODES.Mode.tiles" },
  { key: "drawings",       label: "CURSORMODES.Mode.drawings" },
  { key: "walls",          label: "CURSORMODES.Mode.walls" },
  { key: "lighting",       label: "CURSORMODES.Mode.lighting" },
  { key: "sounds",         label: "CURSORMODES.Mode.sounds" },
  { key: "regions",        label: "CURSORMODES.Mode.regions" },
  { key: "notes",          label: "CURSORMODES.Mode.notes" }
]);

/**
 * Read the active control/tool and push the matching cursor onto the canvas.
 * Safe to call at any time; no-ops until settings are available.
 */
export function applyCursor() {
  if (!game?.settings) return;

  let cfg;
  try {
    cfg = game.settings.get(MODULE_ID, SETTING);
  } catch (_err) {
    return; // setting not registered yet
  }

  const control = ui.controls?.control?.name;
  const tool = ui.controls?.tool?.name;
  const map = cfg?.map ?? {};

  const url =
    (control && tool && map[`${control}.${tool}`]) ||
    (control && map[control]) ||
    null;

  const x = Number.isFinite(cfg?.hotspotX) ? cfg.hotspotX : 16;
  const y = Number.isFinite(cfg?.hotspotY) ? cfg.hotspotY : 16;

  const body = document.body;
  if (url) {
    // A relative url() inside a CSS custom property resolves against the
    // stylesheet that *uses* var(), not the document — which doubles the path.
    // Resolve to an absolute, route-prefixed URL up front to avoid that.
    const href = /^(https?:)?\/\//i.test(url) || url.startsWith("/")
      ? url
      : foundry.utils.getRoute(url);
    body.style.setProperty("--cm-cursor", `url("${href}") ${x} ${y}, auto`);
    body.classList.add("cm-active");
  } else {
    body.style.removeProperty("--cm-cursor");
    body.classList.remove("cm-active");
  }
}
