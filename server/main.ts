import { Meteor } from 'meteor/meteor';
import { Games, Players } from '/imports/api/games';

Meteor.publish('Games', function gamesPublication() {
  return Games.find({gameState: "Waiting"}, {
    fields:{
      "code": 1,
      "players": 1,
      "lastUsed": 1,
      "gameState": 1,
      "availableQuestions": 1,
    }
  });
});

Meteor.publish('MyGame', function myGamePublication(code: string) {
  return Games.find(
      {code}, {
        fields:{
          "code": 1,
          "players": 1,
        }
      }
  );
});

Meteor.publish('Players', function playersPublication() {
  return Players.find();
});