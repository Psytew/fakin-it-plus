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
        console.log(room);
        if (room) {
            if (room.players.length >= MAX_PLAYERS) {
                return "ERROR_ROOM_FULL";
            }
            if (room.gameState !== 'Waiting') {
                return "ERROR_NOT_WAITING";
            }
            const players = [...room.players, player];

            const gameTypeVotes = room.gameTypeVotes as Record<string, GameType>;
            const fakerVotes = room.fakerVotes as Record<string, string>;

            gameTypeVotes[player.name] = GAME_TYPES[0];
            fakerVotes[player.name] = room.players[0].name;

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
        } as Room;
        room.gameTypeVotes[player.name] = GAME_TYPES[0];
        room.fakerVotes[player.name] = player.name;

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

    "game.voteOnQuestion"(gameType: GameType, player: Player) {
        console.log(gameType);
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
        const randomPick = gameTypeVotes[Math.floor(Math.random() * gameTypeVotes.length)]

        console.log(gameTypeVotes);
        console.log(randomPick);

        const players = room.players;
        const fakerIndex = Math.floor(Math.random() * players.length);
        players[fakerIndex].isFaker = true;
        const faker = players[fakerIndex].name;

        let availableQuestions = room.availableQuestions[randomPick];
        const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        availableQuestions = availableQuestions.filter((q) => q !== question);
        

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
})