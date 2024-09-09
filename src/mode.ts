import { KEYBOARD } from "./enums/keyboard";
import { InGameScene } from "./scenes/ingame-scene";

export abstract class Mode{
    private scene:InGameScene;
    public whitelistkeyboard:KEYBOARD[]=[];

    constructor(scene:InGameScene){
        this.scene = scene;
    }
    abstract enter():void;
    abstract exit(): void;
    abstract actionInput(key:KEYBOARD): void;

    getScene(){
        return this.scene;
    }

    disableInput(): void {
        this.scene.input.keyboard?.off("keydown");
        console.log(`${this.constructor.name} has disabled input.`);
    }

    enableInput(): void {
        console.log(`${this.constructor.name} has enabled input.`);
    }
}