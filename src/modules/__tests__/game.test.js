import Game from '../game'
let game ;
let player;
let AI;

describe('setting up players ', () => {
    beforeEach(() =>{
        game = Game();
        player = game.CreatePlayer('John',1);
        AI = game.CreatePlayer(false,2);
        game.newGame(player,AI);
    });

    test('create game with player and Computer',() =>{
        expect(game.player1.isAi).toBeFalsy();
        expect(game.player2.isAI).toBeTruthy();
    });
    test('both players are able to attack ', () => {
        expect(typeof player.attack(AI,0,0)[0]).toBe('string');
        expect(typeof AI.attack(player)[0]).toBe('string');
    })
})

