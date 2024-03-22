import { GameType, Question } from "./questions";

export interface Player {
    name: string;
    room: string;
    isHost: boolean;
    isFaker: boolean;
    questionBank: Record<GameType, Array<Question>>;
}