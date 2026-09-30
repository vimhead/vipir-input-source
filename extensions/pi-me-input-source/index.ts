import { spawnSync } from "node:child_process";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { definePiMeExtension, registerPiMeExtension, type PiMeFocusedModeEvent } from "pi-me/api";

type InputSourceCommand = {
	executable: string;
	currentArgs: string[];
	setArgs: (inputSource: string) => string[];
};

type InputSourceSwitcherOptions = {
	defaultInputSource: string;
	command: InputSourceCommand;
};

const MACOS_DEFAULT_INPUT_SOURCE = "com.apple.keylayout.ABC";
const MACISM_COMMAND: InputSourceCommand = {
	executable: "macism",
	currentArgs: [],
	setArgs: (inputSource) => [inputSource],
};

const registration = definePiMeExtension({
	extensionId: "pi-me-input-source",
	setup(api) {
		const switcher = createMacOsInputSourceSwitcher();
		if (!switcher) return;
		api.vim.onFocusedModeChange((event) => switcher.handleFocusedMode(event));
	},
});

export default function piMeInputSource(pi: ExtensionAPI) {
	registerPiMeExtension(pi, registration);
}

class InputSourceSwitcher {
	private previousInputSource: string | undefined;
	private isCommandFailureReported = false;

	constructor(private readonly options: InputSourceSwitcherOptions) {}

	handleFocusedMode(event: PiMeFocusedModeEvent): void {
		if (event.mode === "insert") this.restorePreviousInputSource(event.ctx);
		else this.switchToDefaultInputSource(event.ctx);
	}

	private switchToDefaultInputSource(ctx: ExtensionContext): void {
		const currentInputSource = this.readCurrentInputSource(ctx);
		if (!currentInputSource) return;
		this.previousInputSource = currentInputSource;
		if (currentInputSource !== this.options.defaultInputSource) this.setInputSource(this.options.defaultInputSource, ctx);
	}

	private restorePreviousInputSource(ctx: ExtensionContext): void {
		const previousInputSource = this.previousInputSource;
		if (!previousInputSource) return;
		const currentInputSource = this.readCurrentInputSource(ctx);
		if (currentInputSource && currentInputSource !== previousInputSource) this.setInputSource(previousInputSource, ctx);
	}

	private readCurrentInputSource(ctx: ExtensionContext): string | undefined {
		const result = spawnSync(this.options.command.executable, this.options.command.currentArgs, { encoding: "utf8" });
		if (result.status === 0) return result.stdout.trim();
		this.reportCommandFailure(ctx, result.error);
		return undefined;
	}

	private setInputSource(inputSource: string, ctx: ExtensionContext): void {
		const result = spawnSync(this.options.command.executable, this.options.command.setArgs(inputSource), { stdio: "ignore" });
		if (result.status !== 0) this.reportCommandFailure(ctx, result.error);
	}

	private reportCommandFailure(ctx: ExtensionContext, error: Error | undefined): void {
		if (this.isCommandFailureReported) return;
		this.isCommandFailureReported = true;
		ctx.ui.notify(`pi-me input source switching failed: ${error?.message ?? this.options.command.executable}`, "warning");
	}
}

function createMacOsInputSourceSwitcher(): InputSourceSwitcher | undefined {
	if (process.platform !== "darwin") return undefined;
	return new InputSourceSwitcher({
		command: MACISM_COMMAND,
		defaultInputSource: process.env.PI_ME_DEFAULT_INPUT_SOURCE ?? MACOS_DEFAULT_INPUT_SOURCE,
	});
}
