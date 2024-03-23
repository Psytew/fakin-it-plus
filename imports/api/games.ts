import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Player } from '/models/player.js';
import { generateRoomCode } from './utils/generateRoomCode';
import { generateQuestionBank } from '/utils/generateQuestionBank';
import { Room } from '/models/room';
import { PlayerRoomLink } from '/models/playerRoomLink';

export const Games = new Mongo.Collection("games");
export const Players = new Mongo.Collection("players");

Meteor.methods({
    "games.join"(player: Player, code: string) {    
        const room = Games.findOne({code});
        if (room) {
            if (room.players.length >= 10) {
                return "ERROR_ROOM_FULL";
            }
            if (room.gameState !== 'Waiting') {
                return "ERROR_NOT_WAITING";
            }
            const players = [...room.players, player];
            Games.update(
                {code},
                {$set : {
                    "players": players
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

        const room = {
            code,
            players: [player],
            lastUsed: new Date(),
            gameState: 'Waiting',
            availableQuestions: generateQuestionBank()
        } as Room;
        Games.insert(room);
        Players.insert({
            userId: player.userId,
            room: code,
        } as PlayerRoomLink);

        return code;
    }
})