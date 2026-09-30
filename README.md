# pi-me-input-source

Switch keyboard layouts with vipi-editor modes: use a predictable layout for vi commands and restore your typing layout in insert mode.

## Install

Requires **macOS** and `macism` on `PATH`.

```sh
brew install laishulu/homebrew/macism
pi install git:github.com/vimhead/vipi-editor
pi install git:github.com/vimhead/pi-me-input-source
```

Run **`/reload`**. Enabled by default in [Vipi](https://github.com/vimhead/vipi); does nothing on other platforms.

## Use

**Esc** switches to **ABC** for normal mode. **i** restores your typing layout. This also follows the focused prompt, input, or textarea through vipi-editor’s shared runtime.

To choose another installed command layout:

```sh
VIPI_EDITOR_DEFAULT_INPUT_SOURCE=com.apple.keylayout.US pi
```

Disable in `/vipi` and sync, or run `pi remove git:github.com/vimhead/pi-me-input-source` and reload.
