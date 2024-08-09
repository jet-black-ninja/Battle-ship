import Ship from "../ships"

describe('creating ships', () => {
test ('create a carrier of length 5', () => {
    let ship = Ship('carrier')
    expect(ship.type).toBe('carrier');
    expect(ship.length).toBe(5);
});
test('create destroyer of length 5', ()=>{
    let ship = Ship('destroyer');
    expect(ship.type).toBe('destroyer');
    expect(ship.length).toBe(3);
});
});


describe('test ships taking hits', () => {
    test('register 2 hits',() =>{
        let ship = Ship('destroyer');
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(2);
    });
    test('register 3 hits', () => {
        let ship = Ship('carrier');
        expect(ship.hits).toBe(0);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(3);
    });
});

describe('if ship sunk', () => {
    test('3 hits to sink destroyer',() =>{
        let ship = Ship('destroyer');
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);

    });
    test('2 hits to sink patrol boat',() => {
        let ship = Ship('patrol');
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    })
})
