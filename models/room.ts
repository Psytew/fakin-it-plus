import { GameState } from "./gameState";
import { Player } from "./player";

export interface Room {
    code: string;
    players: Player[];
    lastUsed: Date;
    questionsUsed: string[];
    gameState: GameState;
}