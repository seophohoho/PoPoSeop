import { MODE } from './enums/mode';
import { Mode } from './mode';
import { InGameScene } from './scenes/ingame-scene';

interface Modes {
  key: MODE;
  value: Mode;
}

export class GlobalManager {
  private static managers: Map<string, any> = new Map();

  static register<T>(name: string, manager: T): void {
    this.managers.set(name, manager);
  }

  static get<T>(name: string): T {
    return this.managers.get(name);
  }
}

export class ModeManager {
  private scene: InGameScene;
  private modes: Modes[];
  private modeCache: Map<MODE, Mode> = new Map();
  private currentMode!: Mode;

  constructor(scene: InGameScene) {
    this.scene = scene;

    this.modes = [];
  }

  registerModes() {
    for (const mode of this.modes) {
      mode.value.init();
      this.modeCache.set(mode.key, mode.value);
    }
  }

  changeMode(mode: MODE) {
    this.currentMode.exit();

    const targetMode = this.modeCache.get(mode);
    if (targetMode) {
      this.currentMode = targetMode;
      this.currentMode.enter();
    } else {
      console.error(`Mode ${name} not found`);
    }
  }
}