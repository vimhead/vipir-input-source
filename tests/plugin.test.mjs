import assert from "node:assert/strict";
import test from "node:test";
import { CURSOR_MARKER, visibleWidth } from "@earendil-works/pi-tui";
import { createFixture } from "./fixture.mjs";
import { InputSourceSwitcher } from "../extensions/pi-me-input-source/index.ts";

test("input-source switching preserves the insert layout across normal-mode focus transfers", context => {
  const fixture = createFixture(context);
  let current = "Russian";
  const changes = [];
  const switcher = new InputSourceSwitcher({
    defaultInputSource: "ABC", command: { executable: "fake", currentArgs: [], setArgs: value => [value] },
    runCommand: (_command, args) => {
      if (args.length) { current = args[0]; changes.push(current); }
      return { status: 0, stdout: current, error: undefined };
    },
  });
  fixture.api.vim.onFocusedModeChange(event => switcher.handleFocusedMode(event));
  const prompt = fixture.createPrompt();
  prompt.setMode("normal");
  const first = fixture.api.vim.createLineEditor({ tui: fixture.tui, mode: "normal", focused: true });
  assert.deepEqual(changes, ["ABC"]);
  first.setMode("insert");
  assert.equal(current, "Russian");
  first.setMode("normal");
  first.dispose();
  assert.equal(current, "ABC");
  switcher.dispose();
  switcher.dispose();
  assert.equal(current, "Russian");
  assert.deepEqual(changes, ["ABC", "Russian", "ABC", "Russian"]);
});

test("missing input-source helper is reported once without breaking Vim editing", context => {
  const fixture = createFixture(context);
  let calls = 0;
  const switcher = new InputSourceSwitcher({
    defaultInputSource: "ABC", command: { executable: "missing", currentArgs: [], setArgs: value => [value] },
    runCommand: () => { calls++; return { status: null, stdout: "", error: new Error("ENOENT") }; },
  });
  fixture.api.vim.onFocusedModeChange(event => switcher.handleFocusedMode(event));
  const field = fixture.fields.createInput(fixture.options);
  for (const key of ["\x1b", "i", "X", "\x1b"]) field.handleInput(key);
  assert.equal(field.getValue(), "alpha betXa");
  assert.equal(fixture.notifications.length, 1);
  assert.equal(calls, 1);
});

test("plugin registers with the shared vipi-editor runtime API", async () => {
  const { default: registerPlugin, registration } = await import("../extensions/pi-me-input-source/index.ts");
  const { VIPI_EDITOR_REGISTER } = await import("vipi-editor/api");
  const events = [];
  registerPlugin({ events: { emit: (channel, data) => events.push({ channel, data }), on: () => () => {} } });
  assert.equal(events[0].channel, VIPI_EDITOR_REGISTER);
  assert.equal(events[0].data, registration);
  assert.equal(registration.extensionId, "pi-me-input-source");
});
