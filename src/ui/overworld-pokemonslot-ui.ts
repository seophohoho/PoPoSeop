import { TEXTSTYLE } from '../enums/textstyle';
import { TEXTURE } from '../enums/texture';
import { MAX_PARTY_SLOT } from '../managers';
import { OverworldMode } from '../modes';
import { InGameScene } from '../scenes/ingame-scene';
import { addImage, addText, addWindow, Ui } from './ui';

export class OverworldPokemonSlotUi extends Ui {
  private mode: OverworldMode;
  private container!: Phaser.GameObjects.Container;
  protected pokemonSlotBtns: Phaser.GameObjects.NineSlice[] = [];
  protected pokemonSlotIcons: Phaser.GameObjects.Image[] = [];

  constructor(scene: InGameScene, mode: OverworldMode) {
    super(scene);
    this.mode = mode;
  }

  setup(): void {
    const ui = this.getUi();
    const width = this.getWidth();
    const height = this.getHeight();

    const slotSize = 50;
    const slotSpacing = 5;
    const totalSlots = MAX_PARTY_SLOT;

    this.container = this.scene.add.container(width - 35, height / 3 + 50);

    for (let i = 0; i < totalSlots; i++) {
      const xPosition = 0;
      const yPosition = i * (slotSize + slotSpacing);

      const pokemonSlotWindow = addWindow(this.scene, TEXTURE.WINDOW_0, xPosition, yPosition, slotSize, slotSize, 8, 8, 8, 8);
      const pokemonIcon = addImage(this.scene, 'pokemon_icon000', xPosition, yPosition).setVisible(true);

      this.container.add(pokemonSlotWindow);
      this.container.add(pokemonIcon);

      this.pokemonSlotBtns.push(pokemonSlotWindow);
      this.pokemonSlotIcons.push(pokemonIcon);
    }
    this.container.setScale(1);

    this.container.setVisible(false);
    this.container.setDepth(10000);
    this.container.setScrollFactor(0);
  }

  show(data?: any): void {
    this.container.setVisible(true);

    for (const icon of this.pokemonSlotIcons) {
      icon.setScrollFactor(0);
      icon.setInteractive({ cursor: 'pointer' });
      icon.on('pointerover', () => {
        icon.setAlpha(0.7);
      });
      icon.on('pointerout', () => {
        icon.setAlpha(1);
      });
      icon.on('pointerdown', () => {
        console.log('나와라~~~' + icon);
      });
    }
  }

  clean(data?: any): void {
    this.container.setVisible(false);
  }
  pause(onoff: boolean, data?: any): void {}
  update(time: number, delta: number): void {}
}