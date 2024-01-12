import { Pokemon } from "./Pokemon";
import { WildPokemonMovements } from "./WildPokemonMovements";
import { GameScene } from "./Main";
import { Player } from "./Player";
import { ImageManagement } from "./ImageManagement";
import { WildPokemon } from "./WildPokemon";

export const enum WILDPOKEMON_STATUS{
    TERMINATED = 0,
    MOVEMENT = 1,
    CAUGHT = 2,
    ESCAPE = 3,
}

export class WildPokemonBehavior{
    constructor(
        private player: Player,
        private imageManagement: ImageManagement,
        private wildPokemonList: Array<WildPokemon>,
        private phaserTime: Phaser.Time.Clock,
    ){}
    create(){
        this.generateWildPokemon();
    }
    update(){
        for(let i=0;i<GameScene.MAX_WILDPOKEMON;i++){
            if(this.wildPokemonList[i].getMovementFinish()){
                this.wildPokemonList[i].setRestTime();
            }
            this.wildPokemonList[i].updateMovement();
        }
    }
    private generateWildPokemon(){
        for(let i=0;i<GameScene.MAX_WILDPOKEMON;i++){
            const wildPokemonSprite = this.imageManagement.createPokemonSprite('003');
            this.imageManagement.createPokemonSpriteAnimation('003');
            const wildPokemon = new Pokemon(wildPokemonSprite,new Phaser.Math.Vector2(10,10));
            const wildPokemonMovement = new WildPokemonMovements(i,wildPokemon,this.wildPokemonList,this.imageManagement.map,this.player);
            this.wildPokemonList.push(new WildPokemon(
                wildPokemon,
                wildPokemonMovement,
                this.phaserTime.addEvent({ delay: Phaser.Math.Between(1000, 8000), callback: null,loop: true }),
                WILDPOKEMON_STATUS.MOVEMENT
            ));
        }
    }
}