import { Player } from "./player";
import { generateQuestionBank } from "/utils/generateQuestionBank";

export const DUMMY_PLAYERS = [
    {
        name: 'Kris',
        room: 'XXXX',
        isHost: false,
        questionBank: generateQuestionBank()
    },
    {
        name: 'Sydney',
        room: 'XXXX',
        isHost: false,
        questionBank: generateQuestionBank()
    },
] as Player[];