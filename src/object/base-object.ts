import { ANIMATION } from '../enums/animation';
import { TEXTSTYLE } from '../enums/textstyle';
import { TEXTURE } from '../enums/texture';
import { InGameScene } from '../scenes/ingame-scene';
import { addText, addTextBackground, createSprite } from '../ui/ui';

export const TILE_SIZE = 32;
export const MAP_SCALE = 1.5;
export const PLAYER_SCALE = 3;

export class BaseObject {
  private scene: InGameScene;
  private tilePos!: Phaser.Math.Vector2;
  private sprite: Phaser.GameObjects.Sprite;
  private nickname: Phaser.GameObjects.Text;

  constructor(scene: InGameScene, texture: TEXTURE, x: number, y: number, nickname: string) {
    this.scene = scene;
    this.sprite = createSprite(scene, texture, 0, 0);

    this.sprite.setOrigin(0.5, 1);
    const offsetX = TILE_SIZE / 2;
    const offsetY = TILE_SIZE;

    this.tilePos = new Phaser.Math.Vector2(x, y);

    this.sprite.setPosition(this.tilePos.x * TILE_SIZE * MAP_SCALE + offsetX * MAP_SCALE, this.tilePos.y * TILE_SIZE * MAP_SCALE + offsetY * MAP_SCALE);
    this.nickname = addTextBackground(scene, this.getPosition().x, this.getPosition().y - 100, nickname, TEXTSTYLE.MESSAGE_WHITE);
  }

  destroy() {
    if (this.sprite) {
      this.scene.children.remove(this.sprite);
      this.sprite.destroy();
      this.sprite = null!;
    }

    if (this.nickname) {
      this.scene.children.remove(this.nickname);
      this.nickname.destroy();
      this.nickname = null!;
    }
  }

  getSprite() {
    return this.sprite;
  }

  getNickname() {
    return this.nickname;
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
    this.nickname.setPosition(position.x, position.y - 100);
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

  getDepth() {
    return this.sprite.depth;
  }
}
