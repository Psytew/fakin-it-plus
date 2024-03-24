import { Meteor } from 'meteor/meteor';
import { Games, Players } from '/imports/api/games';

Meteor.publish('Games', function gamesPublication() {
  return Games.find({}, {
    fields:{
      "code": 1,
      "players": 1,
      "lastUsed": 1,
      "availableQuestions": 1,
      "question": 1,
      "gameState": 1,
      "round": 1,
      "gameType": 1,
      "gameTypeVotes": 1,
      "fakerVotes": 1,
      "faker": 1,
      "correct": 1,
    }
  });
});

Meteor.publish('Players', function playersPublication() {
  return Players.find();
});