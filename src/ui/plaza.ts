import { OVERWORLD_TYPE } from '../enums/overworld-type';
import { OverworldMode } from '../modes';
import { InGameScene } from '../scenes/ingame-scene';
import { InitPos, Overworld } from './overworld';

export class Plaza extends Overworld {
  constructor(scene: InGameScene, mode: OverworldMode, type: OVERWORLD_TYPE, key: string) {
    super(scene, mode, type, key);
  }

  setup(): void {
    super.setup();
  }

  show(data: InitPos): void {
    super.show(data);
  }

  clean(): void {
    super.clean();
  }
}
