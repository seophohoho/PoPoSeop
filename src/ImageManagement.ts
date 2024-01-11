import { Direction } from "./Direction";

export class ImageManagement{
    constructor(
        private phaser: Phaser.Scene
    ){}
    private readonly MAX_POKEMON = 50;
    private readonly DEFAULT_FRAMERATE = 6;
    private readonly DEFAULT_DELAY = 0;
    private readonly PLAYER_FRAME_MAX = 23;
    private readonly POKEMON_FRAME_MAX = 15;
    private playerPokemonIndex:string = '000';

    public map:Phaser.Tilemaps.Tilemap;
    public playerSprite: Phaser.GameObjects.Sprite;
    public petSprite: Phaser.GameObjects.Sprite;
    public throwPokeball: Phaser.GameObjects.Sprite;

    private playerFrames: Phaser.Types.Animations.AnimationFrame[];
    private playerCustomFrameWalkUp: Phaser.Types.Animations.AnimationFrame[][];
    private playerCustomFrameWalkDown: Phaser.Types.Animations.AnimationFrame[][];
    private playerCustomFrameWalkLeft: Phaser.Types.Animations.AnimationFrame[][];
    private playerCustomFrameWalkRight: Phaser.Types.Animations.AnimationFrame[][];
    private playerCustomFrameRunUp: Phaser.Types.Animations.AnimationFrame[][];
    private playerCustomFrameRunDown: Phaser.Types.Animations.AnimationFrame[][];
    private playerCustomFrameRunLeft: Phaser.Types.Animations.AnimationFrame[][];
    private playerCustomFrameRunRight: Phaser.Types.Animations.AnimationFrame[][];

    private pokemonFrames: Phaser.Types.Animations.AnimationFrame[];
    private pokemonCustomFrameMovementDown: Phaser.Types.Animations.AnimationFrame[][];
    private pokemonCustomFrameMovementLeft: Phaser.Types.Animations.AnimationFrame[][];
    private pokemonCustomFrameMovementRight: Phaser.Types.Animations.AnimationFrame[][];
    private pokemonCustomFrameMovementUp: Phaser.Types.Animations.AnimationFrame[][];

    loadMapImage(){
        this.phaser.load.image("nature_1","assets/map/nature_1.png");
        this.phaser.load.tilemapTiledJSON("test-town-map","assets/map/test_map_grid.json");
    }
    loadPlayerImage(){
        this.phaser.load.atlas('player','assets/character/player_girl_0.png','assets/character/player_girl_0.json');
    }
    loadItemImage(){
        this.phaser.load.image("pokeball","assets/item/ball.png");
        this.phaser.load.image("groundPokeball","assets/item/monsterball.png");
    }
    loadPokemonImage(){
        for(let i=0;i<=this.MAX_POKEMON;i++){
            const index = this.addZeroPadding(i,3);
            console.log(index);
            //this.phaser.load.atlas(`${index}`,`assets/pokemon/${index}.png`,`assets/pokemon/${index}.json`);
            //this.phaser.load.atlas(`${index}s`,`assets/pokemon/${index}s.png`,`assets/pokemon/${index}s.json`);
            this.phaser.load.atlas(`${index}`,`assets/pokemon/${index}.png`,`assets/pokemon/001.json`);
            this.phaser.load.atlas(`${index}s`,`assets/pokemon/${index}s.png`,`assets/pokemon/001.json`);
        }
    }
    createMap(){
        this.map = this.phaser.make.tilemap({ key: "test-town-map" })
        this.map.addTilesetImage("nature_1", "nature_1");
        this.map.createLayer(0,"nature_1",0,0);
        this.map.createLayer(1,"nature_1",0,0);
    }
    createPlayerSprite(){
        this.playerSprite = this.createSprite(0,0,'player');
        this.playerSprite.setDepth(0);

        this.phaser.cameras.main.startFollow(this.playerSprite);
        this.phaser.cameras.main.roundPixels = true;
        this.createPlayerSpriteAnimation();

        this.petSprite = this.createSprite(0,1,this.playerPokemonIndex);
        this.petSprite.setDepth(1);
        this.petSprite.visible = true;
    }
    private createPlayerSpriteAnimation(){
        this.playerFrames = this.phaser.anims.generateFrameNames('player',{
            prefix:'player_girl_0-',
            suffix:"",
            start:0,
            end:this.PLAYER_FRAME_MAX,
        });
        this.playerCustomFrameWalkUp = [
            [this.playerFrames[1],this.playerFrames[0]],
            [this.playerFrames[2],this.playerFrames[0]]
        ];
        this.playerCustomFrameWalkDown = [
            [this.playerFrames[4],this.playerFrames[3]],
            [this.playerFrames[5],this.playerFrames[3]]
        ];
        this.playerCustomFrameWalkLeft = [
            [this.playerFrames[7],this.playerFrames[6]],
            [this.playerFrames[8],this.playerFrames[6]]
        ];
        this.playerCustomFrameWalkRight = [
            [this.playerFrames[10],this.playerFrames[9]],
            [this.playerFrames[11],this.playerFrames[9]]
        ];
    
        this.playerCustomFrameRunUp = [
            [this.playerFrames[14],this.playerFrames[12]],
            [this.playerFrames[13],this.playerFrames[12]],
            [this.playerFrames[12],this.playerFrames[12]]
        ];
        this.playerCustomFrameRunDown = [
            [this.playerFrames[16],this.playerFrames[15]],
            [this.playerFrames[17],this.playerFrames[15]],
            [this.playerFrames[15],this.playerFrames[15]]
        ];
        this.playerCustomFrameRunLeft = [
            [this.playerFrames[19],this.playerFrames[18]],
            [this.playerFrames[20],this.playerFrames[18]],
            [this.playerFrames[18],this.playerFrames[18]]
        ];
        this.playerCustomFrameRunRight = [
            [this.playerFrames[22],this.playerFrames[21]],
            [this.playerFrames[23],this.playerFrames[21]],
            [this.playerFrames[21],this.playerFrames[21]]
        ];

        this.createAnimation(
            Direction.PLAYER_WALK_UP_1, 
            this.playerCustomFrameWalkUp[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_WALK_UP_2, 
            this.playerCustomFrameWalkUp[1],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_WALK_DOWN_1, 
            this.playerCustomFrameWalkDown[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_WALK_DOWN_2, 
            this.playerCustomFrameWalkDown[1],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_WALK_LEFT_1, 
            this.playerCustomFrameWalkLeft[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_WALK_LEFT_2, 
            this.playerCustomFrameWalkLeft[1],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_WALK_RIGHT_1, 
            this.playerCustomFrameWalkRight[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_WALK_RIGHT_2, 
            this.playerCustomFrameWalkRight[1],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
  
      //sprite(player) run frames.
          this.createAnimation(
            Direction.PLAYER_RUN_UP_1, 
            this.playerCustomFrameRunUp[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_RUN_UP_2, 
            this.playerCustomFrameRunUp[1],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_RUN_UP_3, 
            this.playerCustomFrameRunUp[2],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
      
          this.createAnimation(
            Direction.PLAYER_RUN_DOWN_1, 
            this.playerCustomFrameRunDown[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_RUN_DOWN_2, 
            this.playerCustomFrameRunDown[1],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_RUN_DOWN_3, 
            this.playerCustomFrameRunDown[2],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
  
          this.createAnimation(
            Direction.PLAYER_RUN_LEFT_1, 
            this.playerCustomFrameRunLeft[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_RUN_LEFT_2, 
            this.playerCustomFrameRunLeft[1],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_RUN_LEFT_3, 
            this.playerCustomFrameRunLeft[2],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
      
          this.createAnimation(
            Direction.PLAYER_RUN_RIGHT_1, 
            this.playerCustomFrameRunRight[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_RUN_RIGHT_2, 
            this.playerCustomFrameRunRight[1],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.PLAYER_RUN_RIGHT_3, 
            this.playerCustomFrameRunRight[2],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
  
    }
    createPokemonSpriteAnimation(index:string){
        this.pokemonFrames = this.phaser.anims.generateFrameNames(index,{
            prefix:`001-`,
            suffix:"",
            start:0,
            end:this.POKEMON_FRAME_MAX,
        });
        this.pokemonCustomFrameMovementDown = [
            [this.pokemonFrames[0],this.pokemonFrames[1],this.pokemonFrames[2],this.pokemonFrames[3]],
        ];
        this.pokemonCustomFrameMovementLeft = [
            [this.pokemonFrames[4],this.pokemonFrames[5],this.pokemonFrames[6],this.pokemonFrames[7]],
        ];
        this.pokemonCustomFrameMovementRight = [
            [this.pokemonFrames[8],this.pokemonFrames[9],this.pokemonFrames[10],this.pokemonFrames[11]],
        ];
        this.pokemonCustomFrameMovementUp = [
            [this.pokemonFrames[12],this.pokemonFrames[13],this.pokemonFrames[14],this.pokemonFrames[15]],
        ];
        this.createAnimation(
            Direction.POKEMON_DOWN, 
            this.pokemonCustomFrameMovementDown[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.POKEMON_LEFT, 
            this.pokemonCustomFrameMovementLeft[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.POKEMON_RIGHT, 
            this.pokemonCustomFrameMovementRight[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
          this.createAnimation(
            Direction.POKEMON_UP, 
            this.pokemonCustomFrameMovementUp[0],
            this.DEFAULT_FRAMERATE,
            this.DEFAULT_DELAY
          );
    }
    private createAnimation(
        name: string,
        frames: Phaser.Types.Animations.AnimationFrame[],
        frameRate: number,
        delay: number
      ) {
        this.phaser.anims.create({
          key: name,
          frames: frames,
          frameRate: frameRate,
          repeat: -1,
          delay:delay,
          yoyo:false
      });
    }
    getPlayerPokemonIndex(){
        return this.playerPokemonIndex;
    }
    setPlayerPokemonIndex(index: string){
        this.playerPokemonIndex = index;
        this.createPokemonSpriteAnimation(index);
    }
    createSprite(posX:number,posY:number,key:string){
        return this.phaser.add.sprite(posX,posY,key);
    }
    private addZeroPadding(index: number, zeroSize: number): string {
        const paddedIndex = index.toString().padStart(zeroSize, '0');
        console.log(paddedIndex);
        return paddedIndex;
    }
}