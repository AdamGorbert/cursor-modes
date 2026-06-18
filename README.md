# Cursor Modes

A [Foundry VTT](https://foundryvtt.com/) module that shows a different mouse
cursor on the canvas depending on the active scene-control layer and tool —
token select, target, ruler, measurement templates, drawings, walls, and more.
Cursors are **configured per-user**, so every player can pick the look they like.

![Foundry v13–v14](https://img.shields.io/badge/Foundry-v13%E2%80%93v14-informational)

<img width="800" height="450" alt="2026-06-1816-32-56-ezgif com-optimize" src="https://github.com/user-attachments/assets/13b1f800-9b24-436b-9cf2-7a2c48a5bf52" />

## Features

- Per-mode cursor images, matched against `${control}.${tool}` first, then the
  layer (`${control}`) alone — so you can set a layer-wide cursor and override it
  for specific tools.
- Configurable cursor **hotspot** (the click point within the image).
- **Per-user** settings — each player configures their own cursors.
- Ships with starter cursors for target, ruler, measurement templates, drawings,
  and walls.
- Recognises the standard layers (tokens, tiles, drawings, walls, lighting,
  sounds, regions, notes) and any custom `control.tool` key you add by hand.

## Installation

### From the Foundry package browser (once published)

1. In Foundry, go to **Add-on Modules → Install Module**.
2. Search for **Cursor Modes** and click **Install**.

### Manual install

1. In Foundry, go to **Add-on Modules → Install Module**.
2. Paste the manifest URL into the **Manifest URL** field:
   ```
   https://github.com/AdamGorbert/cursor-modes/releases/latest/download/module.json
   ```
3. Click **Install**.

## Usage

1. Enable **Cursor Modes** for your world (**Game Settings → Manage Modules**).
2. Open **Game Settings → Configure Settings → Cursor Modes → Configure Cursors**.
3. Pick a cursor image for each mode you care about. A mode with no image keeps
   Foundry's default cursor.
4. Set the **hotspot** (in pixels from the top-left). For a 32×32 reticle,
   `16, 16` centres it.

### Adding your own cursors

Drop images into `cursors/` (or anywhere in your Foundry `Data/` directory) and
point a mode at them in the settings menu.

- Use a non-animated image (`.png`, `.avif`, `.webp`, `.svg`, or `.cur`).
- Keep it small: max 128×128, **32×32 recommended**.

## Compatibility

- **Minimum:** Foundry VTT v13
- **Verified:** Foundry VTT v14

## License

Released under the [MIT License](LICENSE).
