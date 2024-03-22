const GAME_STATES = [
    'Initial',
    'Enter Name New',
    'Enter Name Existing',
    'Waiting',
    'Question Voting',
    'Question Display',
    'Perform Action',
    'Faker Voting',
    'Results'
] as const;

export type GameState = typeof GAME_STATES[number];