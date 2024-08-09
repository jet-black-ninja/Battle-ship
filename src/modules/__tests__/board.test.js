import Gameboard from "../board";
let gameboard;
beforeEach(() => {
    gameboard = Gameboard();
});

test('check gameboard boundaries', () => {
    expect(gameboard.checkSquare(3,1)).toBe(null);
    expect(gameboard.checkSquare(4,5)).toBe(null);
    expect(gameboard.checkSquare(0,11)).toBe(undefined);
    expect(gameboard.checkSquare(11,0)).toBe(undefined);
})

test('place a destroyer at origin horizontally', () =>  {
    const destroyer = gameboard.placeShip('destroyer',[0,0],'horizontal');
    expect(gameboard.checkSquare(0,0)).toBe(destroyer);
    expect(gameboard.checkSquare(0,1)).toBe(destroyer);
    expect(gameboard.checkSquare(0,2)).toBe(destroyer);
    expect(gameboard.checkSquare(0,3)).not.toBe(destroyer);
})

test('place a destroyer at center vertically', () => {
    const destroyer = gameboard.placeShip('destroyer',[2,4],'vertically');
    expect(gameboard.checkSquare(2,4)).toBe(destroyer);
    expect(gameboard.checkSquare(3,4)).toBe(destroyer);
    expect(gameboard.checkSquare(4,4)).toBe(destroyer);
    expect(gameboard.checkSquare(5,4)).not.toBe(destroyer);
})

test('attempt to place ship off grid',() => {
    const destroyer = gameboard.placeShip('destroyer',[2,8],'horizontal');
    expect(gameboard.checkSquare(2,8)).toBe(null);
    expect(gameboard.checkSquare(2,10)).toBe(undefined);
})

test('attempt to place ship on another ship',() => {
    const destroyer = gameboard.placeShip('destroyer',[0,0],'horizontal');
    expect(gameboard.checkSquare(0,1)).toBe(destroyer);
    const carrier =gameboard.placeShip('carrier',[0,0],'vertical');
    expect(gameboard.checkSquare(0,0)).toBe(destroyer);
    expect(gameboard.checkSquare(1,0)).toBe(null);
})

test('record a hit',() => {
    const destroyer = gameboard.placeShip('destroyer',[0,0],'horizontal');
    gameboard.receiveHit(0,1);
    expect(gameboard.checkSquare(0,1)).toBe('hit');
    expect(destroyer.hits).toBe(1);
})

test('record sunk ship', () => {
    const patrol = gameboard.placeShip('patrol',[0,0],'horizontal');
    gameboard.receiveHit(0,0);
    gameboard.receiveHit(0,1);
    expect(patrol.isSunk()).toBe(true);
})

test('record missed attack', () => {
    const patrol = gameboard.placeShip('patrol',[0,0],'horizontal');
    gameboard.receiveHit(3,4);
    expect(gameboard.checkSquare(3,4)).toBe('miss');
})
test('report all ships sunk (1/1)', () => {
    const patrol = gameboard.placeShip('patrol',[0,0],'horizontal');
    gameboard.receiveHit(0,0);
    expect(gameboard.checkAllShipsSunk()).toBe(false);
    gameboard.receiveHit(0,1);
    expect(gameboard.checkAllShipsSunk()).toBe(true);
})
test('place a random ship of length 4' , () => {
    const battleship = gameboard.placeShipRandomly('battleship');
    let shipSquare = 0;
    for(let row = 0 ; row < 10 ; row++){
        for(let col = 0 ; col < 10 ; col++){
            if(gameboard.checkSquare(row,col)=== battleship) shipSquare++;
        }    
    }
    expect(shipSquare).toBe(4);
})

test('can place all ships randomly', () => {
    gameboard.placeShipsRandomly();
    let shipSquares = 0;
    for (let row = 0; row < 10; row++){
        for (let col = 0; col < 10; col++){
            if (typeof gameboard.checkSquare(row, col) === 'object' && gameboard.checkSquare(row, col) !== null) shipSquares++;
        }
    }
    expect(gameboard.placedShips.length).toBe(5);
    expect(shipSquares).toBe(17)
})

test('place all ships randomly multiple times', () => {
    gameboard.placeShipsRandomly();
    gameboard.placeShipsRandomly();
    gameboard.placeShipsRandomly();
    let shipSquares = 0;
    for (let row = 0; row < 10; row++){
        for (let col = 0; col < 10; col++){
            if (typeof gameboard.checkSquare(row, col) === 'object' && gameboard.checkSquare(row, col) !== null) shipSquares++;
        }
    }
    expect(gameboard.placedShips.length).toBe(5);
    expect(shipSquares).toBe(17)
})