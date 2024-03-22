export const YOU_GOTTA_POINT_QUESTIONS = [
    "You Gotta Point 1",
    "You Gotta Point 2",
    "You Gotta Point 3",
] as const;

export const FACE_VALUE_QUESTIONS = [
    "Face Value 1",
    "Face Value 2",
    "Face Value 3",
] as const;

export const HANDS_OF_TRUTH_QUESTIONS = [
    "Hands of Truth Question 1",
    "Hands of Truth Question 2",
    "Hands of Truth Question 3",
] as const;

export const NUMBER_PRESSURE_QUESTIONS = [
    "Number Pressure Question 1",
    "Number Pressure Question 2",
    "Number Pressure Question 3",
] as const;

export const IMPERSIFACIONS_QUESTIONS = [
    "Impersifacions Question 1",
    "Impersifacions Question 2",
    "Impersifacions Question 3",
] as const;

export const THIS_MUCH_QUESTIONS = [
    "This Much Question 1",
    "This Much Question 2",
    "This Much Question 3",
] as const;

export type YouGottaPointQuestion = typeof YOU_GOTTA_POINT_QUESTIONS[number];
export type FaceValueQuestion = typeof FACE_VALUE_QUESTIONS[number];
export type HandsOfTruthQuestion = typeof HANDS_OF_TRUTH_QUESTIONS[number];
export type NumberPressureQuestion = typeof NUMBER_PRESSURE_QUESTIONS[number];
export type ImpersifacionsQuestion = typeof IMPERSIFACIONS_QUESTIONS[number];
export type ThisMuchQuestion = typeof THIS_MUCH_QUESTIONS[number];

export type Question = YouGottaPointQuestion | FaceValueQuestion | HandsOfTruthQuestion | NumberPressureQuestion | ImpersifacionsQuestion | ThisMuchQuestion | 'PLACEHOLDER';

export const GAME_TYPES = ['You Gotta Point', 'Face Value', 'Hands of Truth', 'Number Pressure', 'Impersifacions', 'This Much', 'None'] as const;

export type GameType = typeof GAME_TYPES[number];