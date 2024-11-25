import { ANIMATION } from '../enums/animation';
import { DIRECTION } from '../enums/direction';
import { TEXTURE } from '../enums/texture';
import { InGameScene } from '../scenes/ingame-scene';
import { createSprite, createSpriteAnimation } from '../ui/ui';

export const TILE_SIZE = 32;
export const MAP_SCALE = 1.5;
export const PLAYER_SCALE = 3;

export class BaseObject {
  private scene: InGameScene;
  private tilePos!: Phaser.Math.Vector2;
  private sprite: Phaser.GameObjects.Sprite;

  constructor(scene: InGameScene, texture: TEXTURE, x: number, y: number) {
    this.scene = scene;
    this.sprite = createSprite(scene, texture, 0, 0);

    this.sprite.setOrigin(0.5, 1);
    const offsetX = TILE_SIZE / 2;
    const offsetY = TILE_SIZE;

    this.tilePos = new Phaser.Math.Vector2(x, y);

    this.sprite.setPosition(this.tilePos.x * TILE_SIZE * MAP_SCALE + offsetX * MAP_SCALE, this.tilePos.y * TILE_SIZE * MAP_SCALE + offsetY * MAP_SCALE);
  }

  getSprite() {
    return this.sprite;
  }

  getScene() {
    return this.scene;
  }

  getTilePos(): Phaser.Math.Vector2 {
    return this.tilePos.clone();
  }
  setTilePos(tilePosition: Phaser.Math.Vector2): void {
    this.tilePos = tilePosition.clone();
  }

  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }
  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }

  startAnmation(animationKey: ANIMATION) {
    this.sprite.play(animationKey);
  }

  stopAnmation(frameNumber: number) {
    const textureKey = this.sprite.texture.key;
    const frameKeys = this.sprite.scene.textures.get(textureKey).getFrameNames();

    this.sprite.stop();
    this.sprite.setFrame(frameKeys[frameNumber]);
  }
}
