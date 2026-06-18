import { MODULE_ID, SETTING, KNOWN_MODES, applyCursor } from "./modes.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Per-user configuration UI: a row per known mode with a path + file picker,
 * plus a global cursor hotspot.
 */
export class CursorModesMenu extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "cursor-modes-menu",
    tag: "form",
    classes: ["cursor-modes", "standard-form"],
    window: {
      title: "CURSORMODES.MenuTitle",
      icon: "fa-solid fa-arrow-pointer",
      resizable: true
    },
    position: { width: 600, height: "auto" },
    form: {
      // Arrow thunk avoids any static-initialization ordering pitfalls.
      handler: (event, form, formData) =>
        CursorModesMenu.onSubmit(event, form, formData),
      closeOnSubmit: true
    }
  };

  static PARTS = {
    body: { template: `modules/${MODULE_ID}/templates/settings-menu.hbs` },
    footer: { template: "templates/generic/form-footer.hbs" }
  };

  /** @override */
  async _prepareContext(_options) {
    const cfg = game.settings.get(MODULE_ID, SETTING) ?? {};
    const map = cfg.map ?? {};
    const rows = KNOWN_MODES.map((m) => ({
      key: m.key,
      label: game.i18n.localize(m.label),
      value: map[m.key] ?? ""
    }));
    return {
      rows,
      hotspotX: Number.isFinite(cfg.hotspotX) ? cfg.hotspotX : 16,
      hotspotY: Number.isFinite(cfg.hotspotY) ? cfg.hotspotY : 16,
      buttons: [
        { type: "submit", icon: "fa-solid fa-floppy-disk", label: "CURSORMODES.Save" }
      ]
    };
  }

  /** @override */
  _onRender(_context, _options) {
    for (const btn of this.element.querySelectorAll("[data-action='browse']")) {
      btn.addEventListener("click", this.#onBrowse.bind(this));
    }
  }

  /** Open a FilePicker for a single mode row and write the chosen path back. */
  async #onBrowse(event) {
    const key = event.currentTarget.dataset.key;
    const input = this.element.querySelector(`input[name="mode:${key}"]`);
    const FP =
      foundry.applications?.apps?.FilePicker?.implementation ??
      globalThis.FilePicker;
    const fp = new FP({
      type: "image",
      current: input?.value || "",
      callback: (path) => {
        if (input) input.value = path;
      }
    });
    return fp.render(true);
  }

  /** Persist the form. Map keys contain dots, so we parse manually rather than expandObject. */
  static async onSubmit(_event, _form, formData) {
    const obj = formData.object;
    const map = {};
    for (const [name, val] of Object.entries(obj)) {
      if (!name.startsWith("mode:")) continue;
      const key = name.slice(5);
      if (val) map[key] = String(val).trim();
    }
    const cfg = {
      map,
      hotspotX: Number(obj.hotspotX) || 0,
      hotspotY: Number(obj.hotspotY) || 0
    };
    await game.settings.set(MODULE_ID, SETTING, cfg);
    applyCursor();
  }
}
