# vipir-input-source

Switch keyboard layouts with vipir-editor modes: use a predictable layout for vi commands and restore your typing layout in insert mode.

## Install

Requires **macOS** and `macism` on `PATH`.

```sh
brew install laishulu/homebrew/macism
pi install git:github.com/vimhead/vipir-editor
pi install git:github.com/vimhead/vipir-input-source
```

Run **`/reload`**. Enabled by default in [Vipir](https://github.com/vimhead/vipir); does nothing on other platforms.

## Use

**Esc** switches to **ABC** for normal mode. **i** restores your typing layout. This also follows the focused prompt, input, or textarea through vipir-editor’s shared runtime.

To choose another installed command layout:

```sh
VIPIR_EDITOR_DEFAULT_INPUT_SOURCE=com.apple.keylayout.US pi
```

Disable in `/vipir` and sync, or run `pi remove git:github.com/vimhead/vipir-input-source` and reload.
