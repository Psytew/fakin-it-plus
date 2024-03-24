import { FACE_VALUE_QUESTIONS, GameType, HANDS_OF_TRUTH_QUESTIONS, IMPERSIFACIONS_QUESTIONS, NUMBER_PRESSURE_QUESTIONS, Question, THIS_MUCH_QUESTIONS, YOU_GOTTA_POINT_QUESTIONS } from "/models/questions";

export function generateQuestionBank(){
    const questionBank = {} as Record<GameType, Question[]>;

    questionBank['Face Value'] = [...FACE_VALUE_QUESTIONS];
    questionBank['Hands of Truth'] = [...HANDS_OF_TRUTH_QUESTIONS];
    questionBank['Impersifacions'] = [...IMPERSIFACIONS_QUESTIONS];
    questionBank['Number Pressure'] = [...NUMBER_PRESSURE_QUESTIONS];
    questionBank['This Much'] = [...THIS_MUCH_QUESTIONS];
    questionBank['You Gotta Point'] = [...YOU_GOTTA_POINT_QUESTIONS];

    return questionBank;
}