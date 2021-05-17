import { Plugin_2 } from "obsidian";
import { CreateNewItemOperation } from "src/root/CreateNewItemOperation";
import { IFeature } from "../feature";
import { ListUtils } from "../list_utils";
import { Settings } from "../settings";

function isEnter(e: KeyboardEvent) {
  return (
    (e.keyCode === 13 || e.code === "Enter") &&
    e.shiftKey === false &&
    e.metaKey === false &&
    e.altKey === false &&
    e.ctrlKey === false
  );
}

export class EnterShouldCreateNewItemFeature implements IFeature {
  constructor(
    private plugin: Plugin_2,
    private settings: Settings,
    private listUtils: ListUtils
  ) {}

  async load() {
    this.plugin.registerCodeMirror((cm) => {
      cm.on("keydown", this.onKeyDown);
    });
  }

  async unload() {
    this.plugin.app.workspace.iterateCodeMirrors((cm) => {
      cm.off("keydown", this.onKeyDown);
    });
  }

  private onKeyDown = (cm: CodeMirror.Editor, e: KeyboardEvent) => {
    if (!this.settings.betterEnter || !isEnter(e)) {
      return;
    }

    const { shouldStopPropagation } = this.listUtils.performOperation(
      (root) => new CreateNewItemOperation(root),
      cm
    );

    if (shouldStopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
}
