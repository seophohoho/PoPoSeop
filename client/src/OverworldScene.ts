import * as Phaser from "phaser";
import { ImageManagement } from "./ImageManagement";
import { KeyControl } from "./KeyControl"
import { Player } from "./Player";
import { PlayerBehavior } from "./PlayerBehavior";
import { WildPokemonBehavior } from "./WildPokemonBehavior";
import { WildPokemon } from "./WildPokemon";
import {io} from 'socket.io-client';
import { Pokemon } from "./Pokemon";
import { OtherPlayerBehavior } from "./OtherPlayerBehavior";

export class OverworldScene extends Phaser.Scene {
  
  constructor(){ super({key: 'OverworldScene'}) }

  static readonly TILE_SIZE = 32;
  static readonly MAX_WILDPOKEMON = 0;

  private imageManagement: ImageManagement;
  private keyControl: KeyControl;

  private player: Player;
  private playerBehavior: PlayerBehavior;
  private wildPokemonBehavior: WildPokemonBehavior;
  private wildPokemonList: Array<WildPokemon>=[];

  private nickname: string = 'null';
  private lastTilePosX: number = null;
  private lastTilePosY: number = null;
  private petPokedex: string = '000';
  private spriteType: number = null;
  private socket:any = null;
  private socketId:string;

  private players:object={};
  
  public preload(){
    this.imageManagement = new ImageManagement(this);
    this.imageManagement.loadMapImage();
    this.imageManagement.loadPlayerImage();
    this.imageManagement.loadItemImage();
    this.imageManagement.loadPokemonImage();
    //axios로 사용자 정보 가져와야 함.
    this.nickname = 'seophohoho';
    this.lastTilePosX = Phaser.Math.Between(1,10);
    this.lastTilePosY = Phaser.Math.Between(1,10);
    this.petPokedex = '004';
    this.spriteType = 8;
    this.socket = io('/game');
  }
  private addPlayer(player: object,type:boolean){
    let playerSprite:Phaser.GameObjects.Sprite;
    if(type){
      playerSprite = this.imageManagement.createPlayerSprite(`player_${player['spriteType']}_movement`);
    }
    else{
      playerSprite = this.imageManagement.createOtherPlayerSprite(`player_${player['spriteType']}_movement`);
    }
    
    const petSprite = this.imageManagement.createPetSprite(player['petPokedex']);
    const playerObj = new Player(
      playerSprite,
      new Phaser.Math.Vector2(player['tilePosX'], player['tilePosY']),
      this.add.text(0,0,player['nickname'],{fontSize:13,color: '#fff',backgroundColor:'#000000'}),
      petSprite,
      new Pokemon(petSprite,new Phaser.Math.Vector2(player['tilePosX'], player['tilePosY']+1)),
      );
    if(type){
      this.players[player['socketId']] = {
        playerObj: playerObj,
      }
    }
    else{
      this.players[player['socketId']] = {
        playerObj: playerObj,
        behavior: new OtherPlayerBehavior(playerObj,this.imageManagement,this.wildPokemonList),
      }
    }

  }
  public async create(){
    this.imageManagement.createMap();
    const promise_1 = new Promise<void>((resolve)=>{
      this.socketId = this.socket.id;
      this.socket.emit('newPlayer',{
        socketId:this.socketId,
        nickname:this.nickname,
        tilePosX:this.lastTilePosX,
        tilePosY:this.lastTilePosY,
        petPokedex:this.petPokedex,
        spriteType:this.spriteType
      });
      this.socket.on('currentPlayers',(players:object)=>{
        this.players = players; 
        resolve();
      });
    });
    await promise_1;
    Object.keys(this.players).forEach((id)=>{
      if(this.players[id].socketId === this.socketId){
        this.addPlayer(this.players[id],true);
      }
      else{
        this.addPlayer(this.players[id],false);
        this.players[id].behavior.create();
      }
    });
    this.socket.on('newPlayer',(player:object)=>{
      this.addPlayer(player,false);
      this.players[player['socketId']].behavior.create();
    });
    this.socket.on('playerDisconnect',(socketId:string)=>{
      this.players[socketId].playerObj['sprite'].destroy();
      this.players[socketId].playerObj['petSprite'].destroy();
      delete this.players[socketId];
    });
    this.socket.on('playerBehavior',(data:string)=>{
      this.players[data['socketId']].behavior.setBehavior(data);
    });
    this.playerBehavior = new PlayerBehavior(this.socket,this.players[this.socketId].playerObj,this.imageManagement,this.wildPokemonList);
    this.playerBehavior.create();  
    this.keyControl = new KeyControl(this.input,this.playerBehavior);
    this.wildPokemonBehavior = new WildPokemonBehavior(this.players[this.socketId].playerObj,this.imageManagement,this.wildPokemonList,this.time);
    this.wildPokemonBehavior.create();
  }
  update(_time: number, delta: number) { //최적화할때, 키보드 값이 들어갈때만 업데이트가 진행되도록 한다.
    if(this.keyControl){this.keyControl.update();}
    if(this.playerBehavior){this.playerBehavior.update();}
    if(this.wildPokemonBehavior){this.wildPokemonBehavior.update();}
    Object.keys(this.players).forEach((id)=>{
      if(this.players[id].behavior){
        this.players[id].behavior.update();
      }
    });
  }
}