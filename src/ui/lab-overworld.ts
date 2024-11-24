import { KEY } from '../enums/key';
import { TEXTURE } from '../enums/texture';
import { KeyboardManager } from '../managers';
import { OverworldMode } from '../modes';
import { MAP_SCALE, PLAYER_SCALE } from '../object/base-object';
import { PlayerObject } from '../object/player-object';
import { InGameScene } from '../scenes/ingame-scene';
import { OverworldUi } from './overworld-ui';
import { addMap } from './ui';

export class LabOverworld extends OverworldUi {
  private mode: OverworldMode;
  public map!: Phaser.Tilemaps.Tilemap;
  private player!: PlayerObject;
  private container!: Phaser.GameObjects.Container;
  private keyboardMananger!: KeyboardManager;
  private cursorKey: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: InGameScene, mode: OverworldMode) {
    super(scene);
    this.mode = mode;
    this.cursorKey = this.scene.input.keyboard!.createCursorKeys();
  }

  setup(): void {
    const width = this.getWidth();
    const height = this.getHeight();

    this.container = this.scene.add.container(width / 4, height / 4);

    this.map = addMap(this.scene, TEXTURE.MAP_TEST);
    this.map.addTilesetImage(TEXTURE.MAP_GROUND, TEXTURE.MAP_GROUND);

    this.container.add(this.map.createLayer(0, TEXTURE.MAP_GROUND)!.setScale(MAP_SCALE));
    this.container.add(this.map.createLayer(1, TEXTURE.MAP_GROUND)!.setScale(MAP_SCALE));
    this.container.add(this.map.createLayer(2, TEXTURE.MAP_GROUND)!.setScale(MAP_SCALE));
    this.container.setVisible(false);
  }

  show(): void {
    this.keyboardMananger = KeyboardManager.getInstance();
    const keys = [KEY.UP, KEY.DOWN, KEY.LEFT, KEY.RIGHT];
    this.keyboardMananger.setAllowKey(keys);

    this.container.setVisible(true);

    this.player = new PlayerObject(this.scene, TEXTURE.GIRL_3_MOVEMENT, 4, 2);
    const playerSprite = this.player.getSprite();
    playerSprite.setVisible(true);
    playerSprite.setScale(PLAYER_SCALE);
    this.scene.cameras.main.startFollow(playerSprite, true, 0.1, 0.1, 0, 0);
  }

  clean(): void {}

  update(time: number, delta: number) {
    if (this.cursorKey.up.isDown) {
      this.player.move(KEY.UP);
    }
    if (this.cursorKey.down.isDown) {
      this.player.move(KEY.DOWN);
    }
    if (this.cursorKey.left.isDown) {
      this.player.move(KEY.LEFT);
    }
    if (this.cursorKey.right.isDown) {
      this.player.move(KEY.RIGHT);
    }
    this.player.update(delta);
  }
}
