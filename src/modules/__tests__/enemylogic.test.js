import Game from "../game"
import enemyLogic from "../enemyLogic"

let game ;
let player;
let AI;
let aiModule;

beforeEach(() => {
    game = Game();
    player = game.CreatePlayer('John',1);
    AI = game.CreatePlayer(false,2);
    aiModule = enemyLogic();
})

test('can find all adjacent cells ', () => {
    const cell = [2,4];
    const upCell = aiModule.getAdjacentCell(cell,'up');
    const downCell = aiModule.getAdjacentCell(cell,'down');
    const leftCell = aiModule.getAdjacentCell(cell,'left');
    const rightCell = aiModule.getAdjacentCell(cell,'right');
    expect(upCell).toEqual([1,4]);
    expect(downCell).toEqual([3,4]);
    expect(leftCell).toEqual([2,3]);
    expect(rightCell).toEqual([2,5]);
})

test('cannot find attackable cells when searching when looking off grid)', () => {
    const cell = aiModule.getNextAttackableCell(player, [4,9], 'right');
    expect(cell).toBe(false);
})

test('after confirmed hit , AI finds adjacent cells to attack' , () => {
    player.gameboard.placeShip('battleship', [2,4],'horizontal');
    player.gameboard.receiveHit(2,4);
    const cell = aiModule.getNextAttackableCell(player, [2,4], 'right');
    expect(cell).toEqual([2,5]);
})

test('after hit, finds attackable cell with a hit in the way ', () => {
    player.gameboard.placeShip('battleship', [2,4],'horizontal');
    player.gameboard.receiveHit(2,4);
    player.gameboard.receiveHit(2,5);
    const cell = aiModule.getNextAttackableCell(player, [2,4], 'right');
    expect(cell).toEqual([2,6]);
})

test('AI hits and cannot does not find attackable cell with a miss in the way ' ,() => {
    player.gameboard.placeShip('battleship', [2,4],'horizontal');
    player.gameboard.receiveHit(2,4);
    player.gameboard.receiveHit(2,3);
    const cell = aiModule.getNextAttackableCell(player, [2,4], 'left');
    expect(cell).toBe(false);
})

test('AI hits and does not find attackable cell with a sunken ship in the way ' , () => {
    player.gameboard.placeShip('patrol', [1,3] , 'vertical');
    player.gameboard.receiveHit(1,3);
    player.gameboard.receiveHit(2,3);
    player.gameboard.placeShip('battleship', [2,4], 'horizontal' ) ;
    player.gameboard.receiveHit(2,4);
    const cell  = aiModule.getNextAttackableCell(player,[2,4], 'left');
    expect(cell).toBeFalsy();
})

test('remove ship from listHitArray after sinking',() => {
    player.gameboard.placeShip('patrol', [1,3] , 'vertical');
    player.gameboard.placeShip('battleship',[2,4],'horizontal');
    player.gameboard.receiveHit(2,4);
    aiModule.lastHitArray.push([2,4]);
    player.gameboard.receiveHit(1,3);
    aiModule.lastHitArray.push([1,3]);
    player.gameboard.receiveHit(2,3);
    aiModule.lastHitArray.push([2,3]);
    expect(aiModule.lastHitArray.length).toBe(3);
    const result = aiModule.checkIfShipIsSunk(player,[2,3]);
    expect(result).toBe(true);
    expect(aiModule.lastHitArray.length).toBe(1);
})

test('check adjacency within row', () => {
    const adjacency = aiModule.getAdjacency([2,4],[2,6]);
    expect(adjacency.direction).toBe('right');
    expect(adjacency.oppositeDirection).toBe('left');
    expect(adjacency.distance).toBe(2);
})

test('after hit, if there is a hit adjacent , attack opposite cell', () =>{
    player.gameboard.placeShip('battleship', [2,4],'horizontal');
    player.gameboard.receiveHit(2,4);
    aiModule.lastHitArray.push([2,4]);
    player.gameboard.receiveHit(2,5);
    aiModule.lastHitArray.push([2,5]);
    const result = aiModule.attack(player);
    expect(result).toEqual([2,6]);
})

test('after hit , if there is a hit adjacent , look for next hit if no hits available opposite', () => {
    player.gameboard.placeShip('battleship',[2,4],'horizontal');
    player.gameboard.receiveHit(2,3);
    player.gameboard.receiveHit(2,5);
    aiModule.lastHitArray.push([2,5]);
    player.gameboard.receiveHit(2,4);
    aiModule.lastHitArray.push([2,4]);
    const result = aiModule.attack(player);
    expect(result).toEqual([2,6]);
})

test('after hit , attack a cell that could possibly be part of the same ship', () => {
    player.gameboard.placeShip('battleship',[2,4],'horizontal');
    player.gameboard.receiveHit(2,7);
    aiModule.lastHitArray.push([2,7]);
    player.gameboard.receiveHit(2,5);
    aiModule.lastHitArray.push([2,5]);

})

test('after hit , if there are no other hits, get a random adjacent cell ', () => {
    player.gameboard.placeShip('battleship',[2,4],'horizontal');
    player.gameboard.receiveHit(2,4);
    aiModule.lastHitArray.push( [2,4]);
    const result = aiModule.attack(player);
    expect(Math.abs(result[0]-2)).toBeLessThanOrEqual(1);
    expect(Math.abs(result[1]-4)).toBeLessThanOrEqual(1);
})