import { getItem, Item, items } from '../data/items';
import { KEY } from '../enums/key';
import { TEXTSTYLE } from '../enums/textstyle';
import { TEXTURE } from '../enums/texture';
import { KeyboardManager, PlayerManager } from '../managers';
import { BagMode } from '../modes';
import { InGameScene } from '../scenes/ingame-scene';
import { addBackground, addImage, addText, Ui } from './ui';

export class BagUi extends Ui {
  private mode: BagMode;
  private bg!: Phaser.GameObjects.Image;
  private xboxContainer!: Phaser.GameObjects.Container;
  private xboxBtn!: Phaser.GameObjects.Image;
  private itemBoxBtn: Phaser.GameObjects.Image[] = [];
  private itemIcons: Phaser.GameObjects.Image[] = [];
  private itemStocks: Phaser.GameObjects.Text[] = [];
  private itemTexts: Phaser.GameObjects.Text[] = [];
  private playerManager!: PlayerManager;
  private lastChoice: number = 0;

  constructor(scene: InGameScene, mode: BagMode) {
    super(scene);
    this.mode = mode;
  }

  setup(): void {
    const ui = this.getUi();
    const width = this.getWidth();
    const height = this.getHeight();

    this.bg = addBackground(this.scene, TEXTURE.BG_BAG, width, height);
    this.bg.setVisible(false);

    this.xboxContainer = this.scene.add.container(width / 4, height / 4);
    this.xboxBtn = addImage(this.scene, TEXTURE.XBOX, 453, -245);
    this.xboxContainer.add(this.xboxBtn);
    this.xboxContainer.setVisible(false);

    ui.add(this.bg);
    ui.add(this.xboxContainer);
  }

  show(): void {
    this.playerManager = PlayerManager.getInstance();

    this.bg.setAlpha(0);
    this.bg.setVisible(true);
    this.xboxContainer.setVisible(true);

    this.scene.tweens.add({
      targets: this.bg,
      alpha: { from: 0, to: 1 },
      ease: 'Sine.Linear',
      duration: 200,
    });

    this.xboxBtn.setInteractive({ cursor: 'pointer' });
    this.xboxBtn.on('pointerdown', () => {
      this.mode.changeOverworldMode();
    });
    this.xboxBtn.on('pointerover', () => {
      this.xboxBtn.setAlpha(0.7);
    });
    this.xboxBtn.on('pointerout', () => {
      this.xboxBtn.setAlpha(1);
    });

    let index = 0;
    const itemSpacing = 50;
    const startX = 320;
    const startY = -204;

    for (const key of Object.keys(items)) {
      const bagItem = this.playerManager.getBagItem(key);
      const itemDetail = getItem(key);
      if (bagItem && bagItem.idx !== '000') {
        const posY = startY + index * itemSpacing;
        this.createItemBox(key, bagItem.stock, itemDetail!, startX, posY);
        index++;
      }
    }

    this.pause(false);
  }

  clean(): void {
    this.bg.setAlpha(1);
    this.bg.setVisible(false);
    this.xboxContainer.setVisible(false);

    this.itemBoxBtn.forEach((btn) => {
      btn.destroy();
    });
    this.itemBoxBtn = [];

    this.itemIcons.forEach((btn) => {
      btn.destroy();
    });
    this.itemIcons = [];

    this.itemStocks.forEach((btn) => {
      btn.destroy();
    });
    this.itemStocks = [];

    this.itemTexts.forEach((btn) => {
      btn.destroy();
    });
    this.itemTexts = [];

    this.xboxBtn.off('pointerover');
    this.xboxBtn.off('pointerout');
    this.xboxBtn.off('pointerdown');

    this.scene.tweens.add({
      targets: this.bg,
      alpha: { from: 1, to: 0 },
      ease: 'Sine.Linear',
      duration: 200,
    });
  }

  pause(onoff: boolean): void {
    onoff ? this.block() : this.unblock();
  }

  block() {
    this.xboxBtn.off('pointerover');
    this.xboxBtn.off('pointerout');
    this.xboxBtn.off('pointerdown');
  }

  unblock() {
    const keyboardMananger = KeyboardManager.getInstance();

    this.xboxBtn.setInteractive({ cursor: 'pointer' });
    this.xboxBtn.on('pointerdown', () => {
      this.mode.changeOverworldMode();
    });
    this.xboxBtn.on('pointerover', () => {
      this.xboxBtn.setAlpha(0.7);
    });
    this.xboxBtn.on('pointerout', () => {
      this.xboxBtn.setAlpha(1);
    });

    let startIndex = 0;
    let endIndex = this.playerManager.getItemCount() - 2;

    const keys = [KEY.UP, KEY.DOWN, KEY.SELECT];
    keyboardMananger.setAllowKey(keys);

    keyboardMananger.setKeyDownCallback((key) => {
      if (key === KEY.UP) {
        this.lastChoice = Math.max(startIndex, this.lastChoice - 1);
      } else if (key === KEY.DOWN) {
        this.lastChoice = Math.min(endIndex, this.lastChoice + 1);
      } else if (key === KEY.SELECT) {
        const targetItem = this.itemIcons[this.lastChoice].texture.key;
        this.mode.addUiStack('BagModalUi', targetItem.split('item')[1]);
      }

      for (let i = 0; i < this.itemBoxBtn.length; i++) {
        this.itemIcons[i].setVisible(false);
        this.itemTexts[i].setVisible(false);
        this.itemBoxBtn[i].setTexture(TEXTURE.ITEM_BOX);
      }

      this.itemBoxBtn[this.lastChoice].setTexture(TEXTURE.ITEM_BOX_S);
      this.itemIcons[this.lastChoice].setVisible(true);
      this.itemTexts[this.lastChoice].setVisible(true);
    });

    for (let i = 0; i < this.itemBoxBtn.length; i++) {
      this.itemIcons[i].setVisible(false);
      this.itemTexts[i].setVisible(false);
      this.itemBoxBtn[i].setTexture(TEXTURE.ITEM_BOX);
    }

    this.itemBoxBtn[this.lastChoice].setTexture(TEXTURE.ITEM_BOX_S);
    this.itemIcons[this.lastChoice].setVisible(true);
    this.itemTexts[this.lastChoice].setVisible(true);
  }

  update(time: number, delta: number): void {}

  private createItemBox(key: string, stock: number, itemInfo: Item, x: number, y: number): void {
    const boxContainer = this.scene.add.container(0, 0);
    const box = addImage(this.scene, TEXTURE.ITEM_BOX, x, y);
    const text = addText(this.scene, x - 95, y - 8, itemInfo.name, TEXTSTYLE.ITEM_TITLE).setOrigin(0, 0);
    const icon = addImage(this.scene, `item${key}`, -410, 235).setVisible(false);
    const iconText = addText(this.scene, -350, 220, itemInfo.description, TEXTSTYLE.ITEM_TITLE).setOrigin(0, 0).setVisible(false);
    const iconStock = addText(this.scene, x + 75, y - 8, 'x' + stock.toString(), TEXTSTYLE.ITEM_TITLE).setOrigin(0, 0);
    this.itemBoxBtn.push(box);
    this.itemIcons.push(icon);
    this.itemTexts.push(iconText);
    this.itemStocks.push(iconStock);
    boxContainer.add(box);
    boxContainer.add(text);
    boxContainer.add(icon);
    boxContainer.add(iconText);
    boxContainer.add(iconStock);
    this.xboxContainer.add(boxContainer);
  }
}
