import i18next from 'i18next';
import { DIRECTION } from '../enums/direction';
import { OBJECT } from '../enums/object-type';
import { OVERWORLD_TYPE } from '../enums/overworld-type';
import { TEXTURE } from '../enums/texture';
import { Message } from '../interface/sys';
import { InGameScene } from '../scenes/ingame-scene';
import { BaseObject } from './base-object';
import { npcsInfo } from '../data/npc';

export let npcs: Map<string, NpcObject> = new Map();

export class NpcObject extends BaseObject {
  private location: OVERWORLD_TYPE;

  constructor(scene: InGameScene, texture: TEXTURE | string, x: number, y: number, map: Phaser.Tilemaps.Tilemap, nickname: string, type: OBJECT, location: OVERWORLD_TYPE) {
    super(scene, texture, x, y, nickname, type);

    this.getSprite().setScale(1.6);
    this.location = location;
    npcs.set(texture, this);
  }

  getLocation() {
    return this.location;
  }

  reaction(playerDirection: DIRECTION, key: string, type: string): Message[] {
    this.reactionDirection(playerDirection);

    return this.reactionScript(key, type);
  }

  private reactionDirection(playerDirection: DIRECTION) {
    switch (playerDirection) {
      case DIRECTION.LEFT:
        this.setSpriteFrame(8);
        break;
      case DIRECTION.RIGHT:
        this.setSpriteFrame(4);
        break;
      case DIRECTION.DOWN:
        this.setSpriteFrame(12);
        break;
      case DIRECTION.UP:
        this.setSpriteFrame(0);
        break;
    }
  }

  private reactionScript(key: string, type: string): Message[] {
    type = this.detailSetting(key);

    if (npcsInfo[key] && npcsInfo[key].scripts[type]) {
      return npcsInfo[key].scripts[type];
    }

    return [{ type: 'default', format: 'talk', content: i18next.t(`message:${key}_${this.location === OVERWORLD_TYPE.PLAZA ? 'talk' : 'question'}`) }];
  }

  private detailSetting(key: string) {
    switch (key) {
      case 'npc000':
        return this.location === OVERWORLD_TYPE.PLAZA ? 'talk' : 'question';
    }

    return 'talk';
  }
}
