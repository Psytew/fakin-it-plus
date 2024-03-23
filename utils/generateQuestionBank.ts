import { FACE_VALUE_QUESTIONS, GameType, HANDS_OF_TRUTH_QUESTIONS, IMPERSIFACIONS_QUESTIONS, NUMBER_PRESSURE_QUESTIONS, Question, THIS_MUCH_QUESTIONS, YOU_GOTTA_POINT_QUESTIONS } from "/models/questions";

export function generateQuestionBank(){
    const questionBank = {} as Record<GameType, Set<Question>>;

    questionBank['Face Value'] = new Set([...FACE_VALUE_QUESTIONS]);
    questionBank['Hands of Truth'] = new Set([...HANDS_OF_TRUTH_QUESTIONS]);
    questionBank['Impersifacions'] = new Set([...IMPERSIFACIONS_QUESTIONS]);
    questionBank['Number Pressure'] = new Set([...NUMBER_PRESSURE_QUESTIONS]);
    questionBank['This Much'] = new Set([...THIS_MUCH_QUESTIONS]);
    questionBank['You Gotta Point'] = new Set([...YOU_GOTTA_POINT_QUESTIONS]);

    return questionBank;
}