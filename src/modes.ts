import { MODE } from './enums/mode';
import { Account } from './interface/sys';
import { ModeManager } from './managers';
import { Mode } from './mode';
import { InGameScene } from './scenes/ingame-scene';
import { LoginUi } from './ui/login-ui';
import { NewGameUi } from './ui/newgame-ui';
import { RegisterUi } from './ui/register-ui';
import { LabOverworld } from './ui/lab-overworld';
import { TitleUi } from './ui/title-ui';
import { BagUi } from './ui/bag-ui';
import { Overworld } from './ui/overworld';
import { BagModalUi } from './ui/bag-modal-ui';
import { BagRegisterUi } from './ui/bag-register-ui';
import { getPokemon } from './data/pokemon';
import { BoxUi } from './ui/box-ui';
import { BoxModalUi } from './ui/box-modal-ui';
import { BoxRegisterUi } from './ui/box-register-ui';

export class NoneMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {}

  enter(): void {
    //TODO: 분기점을 언젠가는 넣어야 한다. 로그인이 되어 있는 상태면, TITLE 모드로 변경되어야하고, 아니라면, LOGIN 모드로 변경되어야 한다.
    this.manager.changeMode(MODE.BOX);
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
  private currentOverworld!: Overworld;

  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new LabOverworld(this.scene, this);
    // this.ui = new SeasonUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    this.ui.show();
  }

  exit(): void {
    this.ui.clean();
  }

  update(time: number, delta: number): void {
    this.ui.update(time, delta);
  }

  changeBagMode() {
    this.manager.changeMode(MODE.BAG);
  }

  changeBoxMode() {
    this.manager.changeMode(MODE.BOX);
  }
}

export class BagMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.uis.push(new BagUi(this.scene, this));
    this.uis.push(new BagModalUi(this.scene, this));
    this.uis.push(new BagRegisterUi(this.scene, this));

    for (const ui of this.uis) {
      ui.setup();
    }
  }

  enter(data?: any): void {
    this.addUiStack('BagUi', data);
  }

  exit(): void {
    this.getUiStackTop().clean();
  }

  update(time: number, delta: number): void {}

  changeOverworldMode() {
    this.manager.changeMode(MODE.OVERWORLD);
  }
}

export class BoxMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.uis.push(new BoxUi(this.scene, this));
    this.uis.push(new BoxModalUi(this.scene, this));
    this.uis.push(new BoxRegisterUi(this.scene, this));

    for (const ui of this.uis) {
      ui.setup();
    }
  }

  enter(data?: any): void {
    this.addUiStack('BoxUi', data);
  }

  exit(): void {
    this.getUiStackTop().clean();
  }

  update(time: number, delta: number): void {}

  changeOverworldMode() {
    this.manager.changeMode(MODE.OVERWORLD);
  }
}
