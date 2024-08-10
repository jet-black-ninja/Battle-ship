import Player from '../player'

let player;
let AI;

beforeEach(() => {
    player= Player('John');
    AI= Player(false);
    player.gameboard.placeShip('battleship',[0,0],'horizontal');
    AI.gameboard.placeShip('destroyer', [2,4], 'vertical');
});

test('player has own gameboard', () => {
    expect(Array.isArray(player.gameboard.board)).toBe(true);
});
test('player attack and misses' , () => {
    expect(AI.gameboard.checkSquare(6,4)).toBe(null);
    const missSquare = player.attack(AI,6,4);
    expect(missSquare[0]).toBe('miss');
});
// this test is working
test('player attack lands on ship', () => {
    expect(typeof AI.gameboard.checkSquare(3,4)).toBe('object');
    const hitSquare = player.attack(AI,3,4);
    expect(hitSquare[0]).toBe('hit');
})

//maximum call stack exceeded on tests below
test('AI makes a random attack on player', () => {
    const attackedSquare = AI.attack(player);
    expect(typeof attackedSquare[0]).toBe('string');
})

test('AI doesnt attack the same square twice', () => {
    for(let i = 0 ; i< 100 ; i++){
        AI.attack(player);
    }
    for(let row = 0 ; row< 10 ;row++){
        for(let col = 0 ; col < 10 ; col++){
            expect(typeof player.gameboard.checkSquare(row,col)).toBe('string');
        }
    }
})

test('ai cannot attack more than 100 times', () => {
    for (let i = 0; i < 100; i++){
        AI.attack(player);
    }
    expect(AI.attack(player)).toBe('No squares to attack');
})