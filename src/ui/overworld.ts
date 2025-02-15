import { KEY } from '../enums/key';
import { OBJECT } from '../enums/object-type';
import { KeyboardManager, PlayerInfoManager } from '../managers';
import { OverworldMode } from '../modes';
import { PLAYER_SCALE } from '../object/base-object';
import { PlayerObject } from '../object/player-object';
import { InGameScene } from '../scenes/ingame-scene';
import { addMap, delay, Ui } from './ui';
import { OVERWORLD_TYPE } from '../enums/overworld-type';
import { TEXTURE } from '../enums/texture';
import { NpcObject } from '../object/npc-object';
import { PLAYER_STATUS } from '../enums/player-status';
import { PokemonObject } from '../object/pokemon-object';

export interface InitPos {
  x: number;
  y: number;
}

export class Overworld extends Ui {
  private mode!: OverworldMode;
  private type!: OVERWORLD_TYPE;
  private key: string;
  protected map!: Phaser.Tilemaps.Tilemap;
  protected layerContainer!: Phaser.GameObjects.Container;
  protected foregroundContainer!: Phaser.GameObjects.Container;
  protected container: Phaser.GameObjects.Container[] = [];
  protected layers: Phaser.Tilemaps.TilemapLayer[] | null = [];
  protected npcs: NpcObject[] = [];
  protected player!: PlayerObject;
  private cursorKey: Phaser.Types.Input.Keyboard.CursorKeys;
  private sysBlock!: boolean;
  private isMessageActive: boolean = false;
  private isBattle: boolean = false;

  constructor(scene: InGameScene, mode: OverworldMode, type: OVERWORLD_TYPE, key: string) {
    super(scene);
    this.cursorKey = this.scene.input.keyboard!.createCursorKeys();
    this.mode = mode;
    this.type = type;
    this.key = key;
  }

  setup(): void {}

  show(data: InitPos): void {
    const playerPos = data;
    PlayerInfoManager.getInstance().setPosX(playerPos.x);
    PlayerInfoManager.getInstance().setPosY(playerPos.y);

    const playerInfo = PlayerInfoManager.getInstance().getInfo();
    this.player = new PlayerObject(this.scene, `${playerInfo.gender}_${playerInfo.avatarType}_movement`, playerPos.x, playerPos.y, this.map, playerInfo.nickname, OBJECT.PLAYER);

    const playerSprite = this.player.getSprite();
    playerSprite.setVisible(true);
    playerSprite.setScale(PLAYER_SCALE);
    this.scene.cameras.main.startFollow(playerSprite, true, 0.5, 0.5, 0, 0);

    this.pause(false);
  }

  clean(): void {
    this.map.destroy();
    this.player.destroy();
    this.player.getPet().destroy();
    this.scene.cameras.main.stopFollow();
    this.scene.cameras.main.setScroll(0, 0);

    if (this.layerContainer) {
      this.layerContainer.removeAll(true);
      this.layerContainer.destroy();
    }
    this.layerContainer = null!;

    if (this.foregroundContainer) {
      this.foregroundContainer.removeAll(true);
      this.foregroundContainer.destroy();
    }
    this.foregroundContainer = null!;

    if (this.layers) {
      for (const layer of this.layers) {
        if (layer) {
          layer.destroy();
        }
      }
    }
    this.layers = [];

    for (const npc of this.npcs) {
      npc.destroy();
    }
    this.npcs = [];

    this.container.forEach((cont) => {
      if (cont) {
        cont.removeAll(true);
        cont.destroy();
      }
    });
    this.container = [];
  }

  pause(onoff: boolean, isBattleFinish?: boolean): void {
    onoff ? this.block() : this.unblock(isBattleFinish!);
  }

  block() {
    this.sysBlock = true;
  }

  unblock(isBattleFinish: boolean) {
    const keyboardMananger = KeyboardManager.getInstance();
    const keys = [KEY.SELECT, KEY.RUNNING, KEY.MENU, KEY.USE_1, KEY.USE_2, KEY.USE_3, KEY.USE_4, KEY.USE_5, KEY.USE_6, KEY.USE_7, KEY.USE_8, KEY.USE_9];

    this.sysBlock = false;

    if (isBattleFinish) this.isBattle = false;

    keyboardMananger.setAllowKey(keys);
    keyboardMananger.setKeyDownCallback(async (key) => {
      if (this.isMessageActive) return;

      switch (key) {
        case KEY.SELECT:
          const obj = this.player.getObjectInFront(this.player.getLastDirection());
          if (obj && this.player.isMovementFinish() && !this.isMessageActive && !this.isBattle) {
            const objKey = obj.getSprite().texture.key;
            if (obj instanceof NpcObject) {
              this.isMessageActive = true;
              const messageResult = await this.mode.startMessage(obj.reaction(this.player.getLastDirection(), objKey, 'talk'));
              this.handleNpcPostScriptAction(objKey, obj.getLocation(), messageResult);
              this.isMessageActive = false;
            } else if (obj instanceof PokemonObject) {
              this.isBattle = true;
              obj.reaction(this.player.getLastDirection());
              await delay(this.scene, 500);
              this.mode.pauseOverworldSystem(true);
              this.mode.addUiStackOverlap('OverworldBattleUi', { overworld: this.key, pokedex: obj.getPokedex(), pokemon: obj });
            }
          }
          break;
        case KEY.MENU:
          if (this.player.isMovementFinish()) {
            this.mode.pauseOverworldSystem(true);
            this.mode.addUiStackOverlap('OverworldMenuUi');
          }
          break;
        case KEY.RUNNING:
          if (this.player.isMovementFinish()) {
            this.player.setStatus(PLAYER_STATUS.RUNNING);
          }
          break;
        case KEY.USE_1:
          this.useItem(0);
          break;
        case KEY.USE_2:
          this.useItem(1);
          break;
        case KEY.USE_3:
          this.useItem(2);
          break;
        case KEY.USE_4:
          this.useItem(3);
          break;
        case KEY.USE_5:
          this.useItem(4);
          break;
        case KEY.USE_6:
          this.useItem(5);
          break;
        case KEY.USE_7:
          this.useItem(6);
          break;
        case KEY.USE_8:
          this.useItem(7);
          break;
        case KEY.USE_9:
          this.useItem(8);
          break;
      }
    });
  }

  update(time: number, delta: number) {
    if (this.sysBlock) return;
    this.movement();
    this.player.update(delta);
    this.player.getPet().update();
  }

  changeFollowPokemon(pokedex: string) {
    const pet = this.player.getPet();

    pet.startAnmation(`pokemon_overworld${pokedex}_${pet.getLastDirection()}`);
    pet.setVisible(pokedex !== '000' ? true : false);
    this.player.getPet().getSprite().setTexture(`pokemon_overworld${pokedex}`);
  }

  getMode() {
    return this.mode;
  }

  getType() {
    return this.type;
  }

  setMap(mapTexture: TEXTURE) {
    this.map = addMap(this.scene, mapTexture);
  }

  getMap() {
    return this.map;
  }

  finishBattle() {
    this.isBattle = false;
  }

  private useItem(slotIdx: number) {
    this.player.readyItem(slotIdx);
    this.mode.chnageItemSlot();
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

  private handleNpcPostScriptAction(npcKey: string, location: OVERWORLD_TYPE, msgResult: boolean) {
    switch (npcKey) {
      case 'npc000':
        if (location === OVERWORLD_TYPE.PLAZA && !msgResult) {
          this.mode.pauseOverworldSystem(true);
          this.mode.addUiStackOverlap('OverworldTaxiListUi');
        }
        if (msgResult) {
          if (msgResult) this.mode.moveToVillage();
        }
        return;
      case 'npc001':
        this.mode.pauseOverworldSystem(true);
        this.mode.addUiStackOverlap('OverworldShopListUi');
        return;
    }
  }
}
