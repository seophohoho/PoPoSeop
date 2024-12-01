import { KEY } from '../enums/key';
import { PLAYER_STATUS } from '../enums/player-status';
import { KeyboardManager, PlayerManager } from '../managers';
import { PLAYER_SCALE } from '../object/base-object';
import { PlayerObject } from '../object/player-object';
import { InGameScene } from '../scenes/ingame-scene';
import { UI } from './ui';

export class Overworld extends UI {
  public map!: Phaser.Tilemaps.Tilemap;
  private players: PlayerObject[] = [];
  private cursorKey: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: PlayerObject;

  constructor(scene: InGameScene) {
    super(scene);
    this.cursorKey = this.scene.input.keyboard!.createCursorKeys();
  }

  setMap(map: Phaser.Tilemaps.Tilemap) {
    this.map = map;
  }

  setup(): void {}

  show(): void {
    const keyboardMananger = KeyboardManager.getInstance();
    const keys = [KEY.SELECT, KEY.RUNNING];
    keyboardMananger.setAllowKey(keys);

    const playerManager = PlayerManager.getInstance();

    this.player = new PlayerObject(this.scene, playerManager.getType(PLAYER_STATUS.MOVEMENT), 4, 3, this.map, playerManager.getNickname());

    const playerSprite = this.player.getSprite();
    playerSprite.setVisible(true);
    playerSprite.setScale(PLAYER_SCALE);
    this.scene.cameras.main.startFollow(playerSprite, true, 0.1, 0.1, 0, 0);

    keyboardMananger.setKeyDownCallback((key) => {
      switch (key) {
        case KEY.RUNNING:
          this.player.setRunning();
          break;
      }
    });
  }

  clean(): void {}

  pause(onoff: boolean): void {}

  update(time: number, delta: number) {
    this.movement();
    this.player.update(delta);
  }

  private movement() {
    if (this.cursorKey.up.isDown && this.player.isMovementFinish()) {
      this.player.move(KEY.UP);
    } else if (this.cursorKey.down.isDown && this.player.isMovementFinish()) {
      this.player.move(KEY.DOWN);
    } else if (this.cursorKey.left.isDown && this.player.isMovementFinish()) {
      this.player.move(KEY.LEFT);
    } else if (this.cursorKey.right.isDown && this.player.isMovementFinish()) {
      this.player.move(KEY.RIGHT);
    }
  }
}