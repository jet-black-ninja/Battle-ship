import Ship from "./ships"
import shipTypes from "./shipTypes"
function Gameboard(){
    const board =  createBoard();
    const placedShips = [];

    //create empty board array
    function createBoard() {
        let boardArray = [];
        for(let row = 0 ; row <= 9 ;row++){
            let rowArray = [];
            for(let col  = 0 ; col<= 9  ; col++){
                rowArray[col]= null;
            }
            boardArray[row] = rowArray;
        }
        return boardArray;
    }

    //function to empty board array
    function clearBoard(board) {
        for(let row  = 0 ; row <= 9 ; row ++){
            for(let col = 0 ; col <= 9 ; col++){
                board[row][col]= null;
            }
        }
    }
    function placeShip(shipType, origin, alignment) {       
        const shipLength = shipTypes[shipType].length;
        const shipSquares = this.checkPlacement(shipLength, origin, alignment);
        // If shipSquares is a valid array, place the ship on all of those squares
        if (shipSquares.isValid) {
            const ship = Ship(shipType);
            ship.squares = shipSquares.squares;
            ship.alignment = alignment;
            shipSquares.squares.forEach(square => {
                let [row, col] = square;
                this.board[row][col] = ship;
            })
            placedShips.push(ship);
            return ship;
        } else return "Cannot place ship in that location";
    }

    function checkPlacement(shipLength, origin , alignment) {
        //create array of ship placement squares
        let [row, col]= origin;
        let shipSquares = [];
        for(let i = 0 ; i < shipLength; i++) {
            shipSquares.push([row,col]);
            alignment === 'horizontal'?col++: row++;
        }
        //if every every placement square is null, the validPlacement is an array of the valid squares
        const validPlacement = shipSquares.every(square =>{
            let [row, col]  = square;
            if(this.checkSquare(row,col) === undefined) 
                return false;
            return this.board[row][col] === null;

        })
        //return an object containing the validPlacement and squares processed
        return {
            isValid : validPlacement,
            squares : shipSquares
        }
    }

    function checkSquare(row, col) {
        if(row < 0 || col < 0 ) 
            return undefined;
        else if( row > 9 || col > 9){
            return undefined;
        }
        else 
            return this.board[row][col];
    }
    

    function clearFleet(placedShips) {
        while(placedShips.length > 0 )placedShips.pop();
    }

    function removeShip(origin) {
        const [row, col] = origin;
        const ship  = this.checkSquare(row,col);
        ship.squares.forEach(square =>{
            const [row, col] = square;
            this.board[row, col] = null;
        });
        const shipsIndex = this.placedShips.indexOf(ship);
        this.placedShips.splice(shipsIndex,1);
    }

    function placeShipsRandomly() {
        clearBoard(this.board);
        clearFleet(this.placedShips);
        for(let ship in shipTypes){
            let result = this.placeShipRandomly(ship);
            while(typeof result !== 'object' || result === null){
                result = this.placeShipRandomly(ship);
            }
        }
    }

    //Take a ship and place it at random square and random axis
    function placeShipRandomly(shipType) {
        const shipLength = shipTypes[shipType].length;
        function randomAlignment(){
            return Math.random() < 0.5 ? 'horizontal' : 'vertical';
        }
        function getRandomSquare(alignment){
            let rowDif = 0;
            let colDif = 0;
            if (alignment === 'horizontal') 
                colDif  = shipLength - 1;
            else 
                rowDif = shipLength - 1;
            let row = Math.floor(Math.random() * (10 - rowDif));
            let col = Math.floor(Math.random() * (10 - colDif));
            return [row,col];
        }
    
        let alignment = randomAlignment();
        let origin = getRandomSquare(alignment);
        let shipSquares = this.checkPlacement(shipLength,origin, alignment);
        while(!shipSquares.isValid){
            alignment = randomAlignment();
            origin = getRandomSquare(alignment);
            shipSquares = this.checkPlacement(shipLength,origin,alignment);
        }
        return this.placeShip(shipType, origin, alignment);
    }

    function receiveHit(row,col) {

        if(this.checkSquare(row,col) === undefined) return "Invalid Location";
        const attackedShip = this.board[row][col];
        if(attackedShip === null) this.board[row][col] = 'miss';
        else {
            attackedShip.hit();
            this.board[row][col] = 'hit';
        }
        return [this.board[row][col], [row, col], attackedShip];
    }

    function checkAllShipsSunk() {
        return placedShips.every(ship=>ship.isSunk());
    }

    return {
        board,
        placedShips,
        checkSquare,
        checkPlacement,
        placeShip,
        removeShip,
        placeShipsRandomly,
        placeShipRandomly,
        receiveHit,
        checkAllShipsSunk
    }
}

export default Gameboard;