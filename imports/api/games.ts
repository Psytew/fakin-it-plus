import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Player } from '/models/player.js';
import { generateRoomCode } from '../../utils/generateRoomCode';
import { generateQuestionBank } from '/utils/generateQuestionBank';
import { Room } from '/models/room';
import { PlayerRoomLink } from '/models/playerRoomLink';
import { GameState } from '/models/gameState';
import { GAME_TYPES, GameType } from '/models/questions';
import { MAX_PLAYERS } from '/models/constants';

export const Games = new Mongo.Collection("games");
export const Players = new Mongo.Collection("players");

Meteor.methods({
    "games.join"(player: Player, code: string) {    
        const room = Games.findOne({code});
        if (room) {
            if (room.players.length >= MAX_PLAYERS) {
                return "ERROR_ROOM_FULL";
            }
            if (room.gameState !== 'Waiting') {
                return "ERROR_NOT_WAITING";
            }
            const players = [...room.players, player];

            const gameTypeVotes = room.gameTypeVotes as Record<string, GameType | 'Random'>;
            const fakerVotes = room.fakerVotes as Record<string, string>;

            gameTypeVotes[player.name] = 'Random';
            fakerVotes[player.name] = '';

            Games.update(
                {code},
                {$set : {
                    "players": players,
                    "gameTypeVotes": gameTypeVotes,
                    "fakerVotes": fakerVotes,
                }
            });
            Players.insert({
                userId: player.userId,
                room: code,
            } as PlayerRoomLink);

            return code;
        } else {
            return "ERROR_ROOM_CODE";
        }
    },

    "games.new"(player: Player) {
        let code = generateRoomCode();
        while (Games.findOne({code})) {
            code = generateRoomCode();
        }

        player.room = code;

        const room = {
            code,
            players: [player],
            lastUsed: new Date(),
            gameState: 'Waiting',
            availableQuestions: generateQuestionBank(),
            gameType: 'None',
            gameTypeVotes: {},
            fakerVotes: {},
            round: 1,
        } as Room;
        room.gameTypeVotes[player.name] = 'Random';
        room.fakerVotes[player.name] = '';

        Games.insert(room);
        Players.insert({
            userId: player.userId,
            room: code,
        } as PlayerRoomLink);

        return code;
    },

    "game.changeGameState"(code: string, gameState: GameState) {
        Games.update(
            {code},
            {$set : {
                "gameState": gameState
            }
        });
    },

    "game.voteOnQuestion"(gameType: GameType | 'Random', player: Player) {
        const room = Games.findOne({code: player.room})! as Room;
        const gameTypeVotes = room.gameTypeVotes;
        gameTypeVotes[player.name] = gameType;


        Games.update(
            {code: player.room},
            {$set : {
                "gameTypeVotes": gameTypeVotes
            }
        });
    },

    "game.moveToQuestionDisplay"(code: string) {
        const room = Games.findOne({code})! as Room;

        const gameTypeVotes = Object.entries(room.gameTypeVotes).map(([_name, vote]) => {
            return vote;
        });
        let randomPick = gameTypeVotes[Math.floor(Math.random() * gameTypeVotes.length)]
        if (randomPick === 'Random') {
            randomPick = GAME_TYPES[Math.floor(Math.random() * 6)];
        }

        const players = room.players;
        const fakerIndex = Math.floor(Math.random() * players.length);
        players[fakerIndex].isFaker = true;
        const faker = players[fakerIndex].name;

        const availableQuestions = room.availableQuestions;
        let availableQuestionsForCategory = availableQuestions[randomPick];
        const question = availableQuestionsForCategory[Math.floor(Math.random() * availableQuestionsForCategory.length)];
        availableQuestionsForCategory = availableQuestionsForCategory.filter((q) => q !== question);
        availableQuestions[randomPick] = availableQuestionsForCategory;
        

        Games.update(
            {code},
            {$set : {
                "gameState": 'Question Display',
                "gameType": randomPick,
                "players": players,
                "question": question,
                "availableQuestions": availableQuestions,
                "faker": faker,
            }
        });
    },

    "game.voteOnFaker"(vote: string, player: Player) {
        const room = Games.findOne({code: player.room})! as Room;
        const fakerVotes = room.fakerVotes;
        fakerVotes[player.name] = vote;


        Games.update(
            {code: player.room},
            {$set : {
                "fakerVotes": fakerVotes
            }
        });
    },

    "game.moveToResults"(code: string) {
        const room = Games.findOne({code})! as Room;
        const { players, fakerVotes, faker } = room;
        let correctGuesses = 0;
        let correct = false;

        for (const player of players) {
            if (fakerVotes[player.name] === faker && player.name !== faker) {
                player.points = player.points + 1;
                correctGuesses += 1;
            }
        }

        if (correctGuesses >= players.length - 1) {
            correct = true;
        } else {
            for (const player of players) {
                if (player.name === faker) {
                    player.points = player.points + 1;
                }
            }
        }

        Games.update(
            {code},
            {$set : {
                "gameState": 'Results',
                "players": players,
                "correct": correct,
            }
        });
    },

    "game.continueWithRound"(code: string) {
        const room = Games.findOne({code})! as Room;
        const { players, fakerVotes, gameType, round } = room;
        
        for (const player of players) {
            fakerVotes[player.name] = '';
        }

        const availableQuestions = room.availableQuestions;
        let availableQuestionsForCategory = availableQuestions[gameType];
        const question = availableQuestionsForCategory[Math.floor(Math.random() * availableQuestionsForCategory.length)];
        availableQuestionsForCategory = availableQuestionsForCategory.filter((q) => q !== question);
        availableQuestions[gameType] = availableQuestionsForCategory;

        Games.update(
            {code},
            {$set : {
                "gameState": 'Question Display',
                "fakerVotes": fakerVotes,
                "question": question,
                "availableQuestions": availableQuestions,
                "round": round + 1,
            }
        });
    },

    "game.returnToWaitingRoom"(code: string) {
        const room = Games.findOne({code})! as Room;
        const { fakerVotes, gameTypeVotes, players } = room;

        for (const player of players) {
            fakerVotes[player.name] = '';
            gameTypeVotes[player.name] = 'Random';
        }

        Games.update(
            {code},
            {$set : {
                "gameState": 'Waiting',
                "fakerVotes": fakerVotes,
                "question": 'PLACEHOLDER',
                "gameTypeVotes": gameTypeVotes,
                "gameType": 'None',
                "faker": '',
                "correct": false,
                "round": 1,
            }
        });
    },

    "game.disconnect"(id: string, code: string) {
        const room = Games.findOne({code})! as Room;
        const players = room.players.filter((player: Player) => player.userId !== id);

        if (players.length === 0) {
            Games.remove({code});
            return;
        }

        if (players[0].isHost !== true) {
            players[0].isHost = true;
        }

        const { fakerVotes, gameTypeVotes } = room;

        for (const player of players) {
            fakerVotes[player.name] = '';
            gameTypeVotes[player.name] = 'Random';
        }

        Games.update(
            {code},
            {$set : {
                "players": players,
                "gameState": 'Waiting',
                "fakerVotes": fakerVotes,
                "question": 'PLACEHOLDER',
                "gameTypeVotes": gameTypeVotes,
                "gameType": 'None',
                "faker": '',
                "correct": false,
                "round": 1,
            }}
        )
    },
})