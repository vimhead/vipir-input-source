# pi-me-input-source

Switch keyboard layouts with pi-me modes: use a predictable layout for vi commands and restore your typing layout in insert mode.

## Install

Requires **macOS** and `macism` on `PATH`.

```sh
brew install laishulu/homebrew/macism
pi install git:github.com/vimhead/pi-me
pi install git:github.com/vimhead/pi-me-input-source
```

Run **`/reload`**. Enabled by default in [Vipi](https://github.com/vimhead/vipi); does nothing on other platforms.

## Use

**Esc** switches to **ABC** for normal mode. **i** restores your typing layout. This also follows focused pi-me fields.

To choose another installed command layout:

```sh
PI_ME_DEFAULT_INPUT_SOURCE=com.apple.keylayout.US pi
```

Disable in `/vipi` and sync, or run `pi remove git:github.com/vimhead/pi-me-input-source` and reload.
