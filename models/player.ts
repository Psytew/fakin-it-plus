import { GameType, Question } from "./questions";

export interface Player {
    name: string;
    room: string;
    isHost: boolean;
    questionBank: Record<GameType, Array<Question>>;
}