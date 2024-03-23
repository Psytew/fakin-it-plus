import { Meteor } from 'meteor/meteor';
import { Games, Players } from '/imports/api/games';

Meteor.publish('Games', function gamesPublication() {
  return Games.find({gameState: "Waiting"}, {
    fields:{
      "code": 1,
      "players": 1,
    }
  });
});

Meteor.publish('MyGame', function myGamePublication(code: string) {
  return Games.find(
      {code}
  );
});

Meteor.publish('Players', function playersPublication() {
  return Players.find();
});