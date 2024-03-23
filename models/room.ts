import { GameState } from "./gameState";
import { Player } from "./player";
import { GameType, Question } from "./questions";

export interface Room {
    code: string;
    players: Player[];
    lastUsed: Date;
    gameState: GameState;
    availableQuestions: Record<GameType, Set<Question>>;
    question: Question;
}