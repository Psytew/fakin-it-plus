import { GameState } from "./gameState";
import { Player } from "./player";
import { GameType, Question } from "./questions";
import { TimingConfiguration } from "./timingConfiguration";

export interface Room {
    code: string;
    players: Player[];
    lastUsed: Date;
    gameState: GameState;
    availableQuestions: Record<GameType, Question[]>;
    question: Question;
    round: number;
    gameType: GameType;
    gameTypeVotes: Record<string, GameType | 'Random'>;
    fakerVotes: Record<string, string>;
    faker: string;
    correct: boolean;
    timingConfiguration: TimingConfiguration;
}