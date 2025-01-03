import { ANIMATION } from '../enums/animation';
import { DEPTH } from '../enums/depth';
import { OBJECT } from '../enums/object-type';
import { TEXTSTYLE } from '../enums/textstyle';
import { TEXTURE } from '../enums/texture';
import { PlayerInfoManager } from '../managers';
import { InGameScene } from '../scenes/ingame-scene';
import { addTextBackground, createSprite } from '../ui/ui';

export const TILE_SIZE = 32;
export const MAP_SCALE = 1.5;
export const PLAYER_SCALE = 3;

export class BaseObject {
  private scene: InGameScene;
  private tilePos!: Phaser.Math.Vector2;
  private sprite: Phaser.GameObjects.Sprite;
  private nickname: Phaser.GameObjects.Text;
  private type!: OBJECT;

  constructor(scene: InGameScene, texture: TEXTURE | string, x: number, y: number, nickname: string) {
    this.scene = scene;
    this.sprite = createSprite(scene, texture, 0, 0);

    this.sprite.setOrigin(0.5, 1);

    const offsetX = TILE_SIZE / 2;
    const offsetY = TILE_SIZE;

    this.tilePos = new Phaser.Math.Vector2(x, y);

    this.nickname = addTextBackground(scene, this.getPosition().x, this.getPosition().y, nickname, TEXTSTYLE.MESSAGE_WHITE);

    this.sprite.setPosition(this.tilePos.x * TILE_SIZE * MAP_SCALE + offsetX * MAP_SCALE, this.tilePos.y * TILE_SIZE * MAP_SCALE + offsetY * MAP_SCALE);
    this.nickname.setPosition(this.tilePos.x * TILE_SIZE * MAP_SCALE + offsetX * MAP_SCALE, this.tilePos.y * TILE_SIZE * MAP_SCALE + offsetY * MAP_SCALE - 100);
    this.nickname.setDepth(DEPTH.NICKNAME);
    this.setDepth(this.tilePos.y);
  }

  setType(type: OBJECT) {
    if (type) {
      this.type = type;
    }
  }

  getType() {
    return this.type;
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

  setSpriteFrame(frame: number) {
    const textureKey = this.sprite.texture.key;
    const frameKeys = this.sprite.scene.textures.get(textureKey).getFrameNames();
    this.sprite.setFrame(frameKeys[frame]);
  }

  startAnmation(animationKey: ANIMATION | string) {
    if (this.sprite.anims.isPlaying && this.sprite.anims.currentAnim?.key === animationKey) {
      return;
    }
    this.sprite.play(animationKey);
  }

  stopAnmation(frameNumber: number) {
    if (this.type === OBJECT.PET) return;
    const textureKey = this.sprite.texture.key;
    const frameKeys = this.sprite.scene.textures.get(textureKey).getFrameNames();
    this.sprite.stop();
    this.sprite.setFrame(frameKeys[frameNumber]);
  }

  getDepth() {
    return this.sprite.depth;
  }

  setDepth(depth: number) {
    this.sprite.setDepth(depth);
  }
}
