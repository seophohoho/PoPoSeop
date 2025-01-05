import Space from 'phaser3-rex-plugins/templates/ui/space/Space';
import { getOverworldInfo, getOverworlds, overworlds } from '../data/overworld';
import { DEPTH } from '../enums/depth';
import { KEY } from '../enums/key';
import { TEXTSTYLE } from '../enums/textstyle';
import { TEXTURE } from '../enums/texture';
import { KeyboardManager } from '../managers';
import { OverworldMode } from '../modes';
import { InGameScene } from '../scenes/ingame-scene';
import { addImage, addText, addWindow, Ui } from './ui';
import i18next from 'i18next';

export class OverworldTaxiListUi extends Ui {
  private mode: OverworldMode;
  private container!: Phaser.GameObjects.Container;
  private overworldsText: Phaser.GameObjects.Text[] = [];
  private dummys: Phaser.GameObjects.Image[] = [];
  private spawnTypesText: Phaser.GameObjects.Text[] = [];
  private windowSpawnType!: Phaser.GameObjects.NineSlice;
  private containerSpawnType!: Phaser.GameObjects.Container;
  private fixedTopY: number = -400;
  private overworldList!: string[];

  constructor(scene: InGameScene, mode: OverworldMode) {
    super(scene);
    this.mode = mode;
  }

  setup(): void {
    const width = this.getWidth();
    const height = this.getHeight();
    const contentHeight = 50;
    const spacing = 5;
    this.overworldList = getOverworlds();
    const totalContentsHeight = this.overworldList.length * (contentHeight + spacing) - spacing;
    const minWindowListHeight = 200;
    const windowListWidth = 400;
    const windowListHeight = Math.max(totalContentsHeight, minWindowListHeight);

    const windowList = addWindow(this.scene, TEXTURE.WINDOW_5, 0, this.fixedTopY + windowListHeight / 2, windowListWidth / 2, windowListHeight / 2, 16, 16, 16, 16).setScale(2);
    const windowPage = addWindow(this.scene, TEXTURE.WINDOW_5, +140, this.fixedTopY - contentHeight + 10, 60, contentHeight / 2 + 5, 16, 16, 16, 16).setScale(2);
    this.windowSpawnType = addWindow(this.scene, TEXTURE.WINDOW_5, +310, this.fixedTopY + contentHeight / 2, 100, contentHeight / 2, 16, 16, 16, 16).setScale(2);

    this.container = this.scene.add.container(width / 2, height / 2);

    this.overworldsText = [];
    this.dummys = [];

    this.overworldList.forEach((key, index) => {
      const overworldInfo = getOverworldInfo(key);
      if (overworldInfo) {
        const yPosition = this.fixedTopY + contentHeight / 2 + index * (contentHeight + spacing);
        const text = addText(this.scene, -160, yPosition, overworldInfo.name, TEXTSTYLE.OVERWORLD_LIST).setOrigin(0, 0.5);
        const dummy = addImage(this.scene, TEXTURE.BLANK, -180, yPosition).setScale(1.5);

        this.overworldsText.push(text);
        this.dummys.push(dummy);
      }
    });

    this.container.add(windowList);
    this.container.add(windowPage);
    this.container.add(this.windowSpawnType);
    this.container.add(this.overworldsText);
    this.container.add(this.dummys);

    this.container.setVisible(false);
    this.container.setDepth(DEPTH.OVERWORLD_UI + 1);
    this.container.setScrollFactor(0);
  }

  show(data?: any): void {
    this.container.setVisible(true);
    this.pause(false);
  }

  clean(data?: any): void {
    this.container.setVisible(false);
  }

  pause(onoff: boolean): void {
    onoff ? this.block() : this.unblock();
  }

  update(time: number, delta: number): void {}

  private block() {}

  private unblock() {
    const keys = [KEY.UP, KEY.DOWN, KEY.SELECT];
    const keyboardMananger = KeyboardManager.getInstance();

    let startIndex = 0;
    let endIndex = this.overworldsText.length - 1;
    let choice = startIndex;

    this.dummys[choice].setTexture(TEXTURE.ARROW_W_R);
    this.showSpawnTypes(this.overworldList[choice]);

    keyboardMananger.setAllowKey(keys);
    keyboardMananger.setKeyDownCallback((key) => {
      const prevChoice = choice;

      switch (key) {
        case KEY.UP:
          choice = Math.max(startIndex, choice - 1);
          break;
        case KEY.DOWN:
          choice = Math.min(endIndex, choice + 1);
          break;
      }

      if (choice !== prevChoice) {
        this.dummys[prevChoice].setTexture(TEXTURE.BLANK);
        this.dummys[choice].setTexture(TEXTURE.ARROW_W_R);
        this.showSpawnTypes(this.overworldList[choice]);
      }
    });
  }

  private showSpawnTypes(overworldIdx: string) {
    this.spawnTypesText.forEach((text) => {
      this.container.remove(text, true);
    });
    this.spawnTypesText = [];

    const overworldInfo = getOverworldInfo(overworldIdx);
    const contentHeight = 50;
    const spacing = 5;

    const totalContentsHeight = (overworldInfo!.spawnTypes.length + 1) * (contentHeight + spacing) - spacing;
    const minWindowHeight = 50 + spacing + spacing + spacing;
    const windowHeight = Math.max(totalContentsHeight, minWindowHeight);

    this.windowSpawnType.setSize(100, windowHeight / 2);
    this.windowSpawnType.setPosition(+310, windowHeight / 2 - this.fixedTopY - 800);

    const startY = this.fixedTopY + spacing + contentHeight / 2;

    const title = addText(this.scene, +235, startY, i18next.t(`menu:typeTitle`), TEXTSTYLE.OVERWORLD_LIST).setOrigin(0, 0.5);
    this.spawnTypesText.push(title);

    overworldInfo?.spawnTypes.forEach((key, index) => {
      const yPosition = this.fixedTopY + spacing + contentHeight / 2 + (index + 1) * contentHeight;
      const text = addText(this.scene, +305, yPosition, i18next.t(`menu:type${key.toString()}`), TEXTSTYLE.OVERWORLD_LIST);
      this.spawnTypesText.push(text);
    });
    this.container.add(this.spawnTypesText);
  }
}
