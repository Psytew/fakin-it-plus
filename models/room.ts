import { GameState } from "./gameState";
import { Player } from "./player";
import { Question } from "./questions";

export interface Room {
    code: string;
    players: Player[];
    lastUsed: Date;
    gameState: GameState;
    usedQuestions: Set<Question>;
}