import { MODE } from './enums/mode';
import { Account, Message } from './interface/sys';
import { MessageManager, ModeManager, OverworldManager, PlayerInfoManager, PlayerItemManager, PlayerPokemonManager } from './managers';
import { Mode } from './mode';
import { InGameScene } from './scenes/ingame-scene';
import { LoginUi } from './ui/login-ui';
import { NewGameUi } from './ui/newgame-ui';
import { RegisterUi } from './ui/register-ui';
import { TitleUi } from './ui/title-ui';
import { BagUi } from './ui/bag-ui';
import { BagModalUi } from './ui/bag-modal-ui';
import { BagRegisterUi } from './ui/bag-register-ui';
import { BoxUi } from './ui/box-ui';
import { BoxModalUi } from './ui/box-modal-ui';
import { BoxRegisterUi } from './ui/box-register-ui';
import { SeasonUi } from './ui/season-ui';
import { Overworld } from './ui/overworld';
import { OverworldUi } from './ui/overworld-ui';
import { OverworldTaxiListUi } from './ui/overworld-taxi-list-ui';
import { OverworldMenuUi } from './ui/overworld-menu-ui';
import { Overworld000 } from './ui/overworld-000';
import { OVERWORLD_TYPE } from './enums/overworld-type';
import { Overworld006 } from './ui/overworld-006';
import { getOverworldInfo } from './data/overworld';
import { OverworldShopListUi } from './ui/overworld-shop-list-ui';
import { OverworldShopChoiceUi } from './ui/overworld-shop-choice-ui';
import { OverworldBattleUi } from './ui/overworld-battle-ui';
import { OverworldBattlePokeballUi } from './ui/overworld-battle-pokeball-ui';

export class NoneMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {}

  enter(): void {
    //TODO: 분기점을 언젠가는 넣어야 한다. 로그인이 되어 있는 상태면, TITLE 모드로 변경되어야하고, 아니라면, LOGIN 모드로 변경되어야 한다.
    this.manager.changeMode(MODE.OVERWORLD);
  }
  exit(): void {}

  update(): void {}
}

export class LoginMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new LoginUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    this.ui.show();
  }
  exit(): void {
    this.ui.clean();
  }
  update(): void {}

  changeRegisterMode() {
    this.manager.changeMode(MODE.REGISTER);
  }

  submit(data: Account): void {
    console.log('login submit');
  }
}

export class RegisterMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new RegisterUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    this.ui.show();
  }

  exit(): void {
    this.ui.clean();
  }
  update(): void {}

  changeLoginMode() {
    this.manager.changeMode(MODE.LOGIN);
  }

  submit(data: Account): void {
    console.log('register submit');
  }
}

export class TitleMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new TitleUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    //user data load.

    this.ui.show();
  }

  exit(): void {
    this.ui.clean();
  }
  update(): void {}

  changeLoginMode() {
    this.manager.changeMode(MODE.LOGIN);
  }
}

export class NewGameMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new NewGameUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    this.ui.show();
  }
  update(): void {}

  exit(): void {}
}

export class OverworldMode extends Mode {
  private playerInfoManager!: PlayerInfoManager;
  private playerItemManager!: PlayerItemManager;
  private playerPokemonManager!: PlayerPokemonManager;
  private overworldManger!: OverworldManager;
  private currentOverworldUisIndex!: number;

  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.uis.push(new Overworld000(this.scene, this, OVERWORLD_TYPE.PLAZA));
    this.uis.push(new Overworld006(this.scene, this, OVERWORLD_TYPE.SAFARI));
    this.uis.push(new SeasonUi(this.scene, this));
    this.uis.push(new OverworldUi(this.scene, this));
    this.uis.push(new OverworldMenuUi(this.scene, this));
    this.uis.push(new OverworldTaxiListUi(this.scene, this));
    this.uis.push(new BagUi(this.scene, this));
    this.uis.push(new BagModalUi(this.scene, this));
    this.uis.push(new BagRegisterUi(this.scene, this));
    this.uis.push(new BoxUi(this.scene, this));
    this.uis.push(new BoxModalUi(this.scene, this));
    this.uis.push(new BoxRegisterUi(this.scene, this));
    this.uis.push(new OverworldShopListUi(this.scene, this));
    this.uis.push(new OverworldShopChoiceUi(this.scene, this));
    this.uis.push(new OverworldBattleUi(this.scene, this));
    this.uis.push(new OverworldBattlePokeballUi(this.scene, this));

    for (const ui of this.uis) {
      ui.setup();
    }
  }

  enter(data?: any): void {
    this.playerInfoManager = PlayerInfoManager.getInstance();
    this.playerItemManager = PlayerItemManager.getInstance();
    this.playerPokemonManager = PlayerPokemonManager.getInstance();
    this.overworldManger = OverworldManager.getInstance();

    this.addUiStackOverlap('OverworldUi', data);
    this.addUiStackOverlap('Overworld000', data);

    this.currentOverworldUisIndex = 1;
  }

  exit(): void {
    for (const ui of this.uiStack) {
      ui.clean();
    }
    this.cleanUiStack();
  }

  update(time: number, delta: number): void {
    const overworld = this.uiStack[this.currentOverworldUisIndex];
    overworld.update(time, delta);
  }

  changeFollowPokemon(pokedex: string) {
    const firstUi = this.getUiStackTop();
    if (firstUi instanceof Overworld) {
      firstUi.changeFollowPokemon(pokedex);
    }
  }

  chnageItemSlot() {
    const ui = this.getUiType('OverworldUi');
    if (ui instanceof OverworldUi) {
      ui.updateItemSlotUi();
    }
  }

  chnagePokemonSlot() {
    const ui = this.getUiType('OverworldUi');
    if (ui instanceof OverworldUi) {
      ui.updatePokemonSlotUi();
    }
  }

  changeOverworldInfo(overworld: string) {
    this.getPlayerInfoManager().setCurrentOverworld(overworld);
    const ui = this.getUiType('OverworldUi');
    if (ui instanceof OverworldUi) {
      ui.updateOverworldInfoUi();
    }
  }

  changeOverworld(overworldKey: string) {
    this.changeOverworldInfo(overworldKey);
    const overworld = getOverworldInfo(overworldKey);

    if (!overworld) return;

    this.getUiStackTop().clean();
    this.popUiStack();

    this.addUiStackOverlap(`Overworld${overworldKey}`, { x: overworld.entryPos.x, y: overworld.entryPos.y });
  }

  changeTitleMode() {
    this.manager.changeMode(MODE.TITLE);
  }

  moveToVillage() {
    this.getUiStackTop().clean();
    this.popUiStack();
    this.changeOverworldInfo('000');
    this.addUiStackOverlap(`Overworld000`, { x: 7, y: 8 });
  }

  getOverworldManager() {
    if (this.overworldManger) return this.overworldManger;

    throw new Error('OverworldManager 인스턴스가 존재하지 않습니다.');
  }

  getPlayerInfoManager() {
    if (this.playerInfoManager) return this.playerInfoManager;

    throw new Error('playerItemManager 인스턴스가 존재하지 않습니다.');
  }

  getPlayerItemManager() {
    if (this.playerItemManager) return this.playerItemManager;

    throw new Error('playerItemManager 인스턴스가 존재하지 않습니다.');
  }

  getPlayerPokemonManager() {
    if (this.playerPokemonManager) return this.playerPokemonManager;

    throw new Error('playerItemManager 인스턴스가 존재하지 않습니다.');
  }

  async startMessage(data: Message[]) {
    const overworld = this.getUiStackTop();

    this.pauseOverworldSystem(true);

    const message = MessageManager.getInstance();
    const ret = await message.show(overworld, data);

    this.pauseOverworldSystem(false);

    return ret;
  }

  pauseOverworldSystem(onoff: boolean) {
    const overworldUi = this.getUiType('OverworldUi');
    const overworld = this.getUiStackTop();

    if (overworldUi && overworld) {
      overworldUi.pause(onoff ? true : false);
      overworld.pause(onoff ? true : false);
    }
  }

  finishBattle() {
    const overworld = this.getUiStackTop() as Overworld;
    overworld.finishBattle();
  }
}
