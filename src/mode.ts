import { ModeManager } from './managers';
import { InGameScene } from './scenes/ingame-scene';
import { Ui } from './ui/ui';

export abstract class Mode {
  protected scene: InGameScene;
  protected manager: ModeManager;
  protected ui!: Ui;

  constructor(scene: InGameScene, manager: ModeManager) {
    this.scene = scene;
    this.manager = manager;
  }

  abstract init(): void;
  abstract enter(): void;
  abstract exit(): void;
  abstract update(time: number, delta: number): void;
}
