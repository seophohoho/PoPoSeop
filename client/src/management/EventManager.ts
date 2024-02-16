import {io} from 'socket.io-client';

export const enum EVENTS {
    PLAYER_DATA = "player-data",
    MOVEMENT = "movement",
    THROW = "throw",
    RIDE = "ride"
}

export const enum SOCKET_EVENTS {
    CURRENT_PLAYERS = "current-players",
    NEW_PLAYER = "new-player",
    THROW = "throw",
    RIDE = "ride"
}

class EventManager extends Phaser.Events.EventEmitter {
    constructor() {
        super();
        this.socket = io('/game');
        this.registeredEvents = {
            [EVENTS.MOVEMENT]: new Phaser.Events.EventEmitter(),
            [EVENTS.THROW]: new Phaser.Events.EventEmitter(),
        };
        this.registeredSocketEvents = {
            [EVENTS.MOVEMENT]: new Phaser.Events.EventEmitter(),
            [EVENTS.THROW]: new Phaser.Events.EventEmitter(),
        };
    }

    private registeredEvents: Record<string, Phaser.Events.EventEmitter>;
    private registeredSocketEvents: Record<string, Phaser.Events.EventEmitter>;

    private socket:any = null;

    triggerEvent(eventName: string, ...args: any[]) {
        if (this.registeredEvents[eventName]) {
            this.registeredEvents[eventName].emit(eventName,...args);
        } else {
            console.error(`Event "${eventName}" is not registered.`);
        }
    }

    triggerSocketEvent(eventName: string, ...args: any[]){
        this.socket.emit('newPlayer',this.playerManagement.getPlayerInfo());
        this.socket.on('currentPlayers',(players:object)=>{this.playerManagement.setPlayers(players);});
    }
}

export default new EventManager();