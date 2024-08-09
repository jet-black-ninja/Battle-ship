function enemyLogic(){
    // 2D array containing all available attack coordinates
    const availableAttacks = createAttackArray();
    let lastShip;
    //array with all recent attacks in order
    const lastHitArray=[];
    const Directions = ['up','down','left','right'];
    let concurrentMisses = 0;
    function attack(enemy){
        if(this.lastHitArray.length > 0){
            this.checkIfShipIsSunk(enemy,this.lastHitArray[lastHitArray.length-1]);
        }
        if(this.availableAttacks.length === 0) return 'No Squares to Attacks';
        //if the boat misses more than 5 time , then it gets a chance to cheat 
        if(this.lastHitArray.length===0){
            if(this.concurrentMisses>5 && Math.random>0.8){
                const enemyBoard = enemy.gameboard.board;
                for(let row = 0; row<10 ; row++){
                    for(let col = 0; col<10 ;col++){
                        const cell = enemy.gameboard.checkSquare(row,col);
                        if(typeof cell ==='object' && cell !== null){
                            console.log('cheating');
                            return [row,col];
                        }
                    }
                }
            }
            let attackCoords = this.getRandomCell(enemy);
            return attackCoords;
        }
        //else we fire on the squares adjacent to the last hit square
        const lastHit = this.lastHitArray[lastHitArray.length -1];
        const adjacentCells = this.getAllAdjacentCells(enemy,lastHit);
        const adjacentHits = adjacentCells.filter(cell => {
            return (cell.cellResult === 'hit' && this.checkIfShipIsSunk(enemy,cell.adjacentCell) == false);
        });
        //if there is a hit (or multiple) adjacent , attack in the opposite direction
        if(adjacentHits.length > 0){
            const randomAdjacentHit=adjacentHits[Math.floor(Math.random() * adjacentHits.length)];
            let nextCell = this.getNextAttackableCell(enemy,lastHit,this.flipDirection(randomAdjacentHit.direction));
            if(nextCell===false){
                nextCell= this.getNextAttackableCell(enemy,lastHit,randomAdjacentHit.direction);
            };
            while(nextCell=== false){
                nextCell = this.getNextAttackableCell(enemy,lastHit,this.Directions[Math.floor(Math.random()* this.Directions.length)]);
            };
            return nextCell;
        }

        //go backwards through all other hit cells for adjacency to last hit cell and attack a cell in that direction
        for(let i = this.lastHitArray.length - 2;i>= 0 ;i--){
            const cell = this.lastHitArray[i];
            const result = this.getAdjacency(lastHit,cell);
            if(result){
                let nextCell = this.getNextAttackableCell(enemy,lastHit,result.direction);
                if(nextCell) return nextCell;
            }
        }
        const adjacentCellToAttack = adjacentCells.filter(cell => {
            return typeof cell.cellResult !== 'string' && cell.cellResult !== undefined;
        });
        const cell = adjacentCellToAttack[Math.floor(Math.random()* adjacentCellToAttack.length)];
        console.log(cell.adjacentCell);
        return cell.adjacentCell;

    }
    
    function getRandomCell(enemy) {
        if(this.availableAttacks.length=== 0) return "no Squares to attack";
        //get row and col for a random attack from the availableAttacks array
        let arrayRow = Math.floor(Math.random() * this.availableAttacks.length);
        let arrayCol = Math.floor(Math.random() * this.availableAttacks[arrayRow].length);
        let cell = this.availableAttacks[arrayRow][arrayCol];
        //if the selected cell has 0 adjacent attackable cells get a random cell
        const adjacentCells = this.getAllAdjacentCells(enemy, cell);
        if(adjacentCells.every(cell => typeof cell.cellResult !== 'object')) {
            return this.getRandomCell(enemy);
        }
        return cell;
    }
    //Remove a cell from the availableAttack array
    //gets called by player.js after attack 
    function makeCellUnavailable(cell) {
        for (let row = 0; row < this.availableAttacks.length; row++) {
            for (let col = 0; col < this.availableAttacks[row].length; col++) {
                const square = this.availableAttacks[row][col];
                if (cell[0] === square[0] && cell[1] === square[1]) {
                    this.availableAttacks[row].splice(col, 1);
                    if (this.availableAttacks[row].length === 0) this.availableAttacks.splice(row, 1);
                    return;
                }
            }
        }
    }
    function getAllAdjacentCells(enemy , cell) {
        return Directions.map(direction =>{
            const adjacentCell = this.getAdjacentCell(cell, direction);
            let cellResult = enemy.gameboard.checkSquare(adjacentCell[0],adjacentCell[1]);
            if(cellResult === 'hit') {
                if(this.checkIfShipIsSunk(enemy,adjacentCell)) cellResult = 'sunk';
            }
            return {
                cellResult,
                adjacentCell,
                direction
            }
        })
    }

    function getAdjacentCell(cell , direction){
    let [row, col] = cell;
    switch (direction) {
        case 'up':
            row--;
            break;
        case 'down':
            row++;
            break;
        case 'left':
            col--;
            break;
        case 'right':
            col++;
            break;
        default:
            break;
    };
    return [row, col];
    }

    function getAdjacency(cell, neighbourCell){
        let direction;
        let oppositeDirection;
        let distance;
        if(cell[0] === neighbourCell[0]){
            const diff = cell[1]- neighbourCell[1];
            direction = diff >1 ? 'left' : 'right' ;
            oppositeDirection  =diff>1 ? 'right' : 'left';
            distance = Math.abs(diff);
        }else if(cell[1]=== neighbourCell[1]){
            const diff = cell[0]-neighbourCell[0];
            direction = diff > 1 ? 'down' : 'up';
            oppositeDirection = diff > 1 ? 'up' : 'down';
            distance = Math.abs(diff);
        }else{
            return false;
        }
        return {
            direction,
            oppositeDirection,
            distance
        }
    }

    //look for a possible cell to attack in a given direction(only 4 cells)
    function getNextAttackableCell(enemy, cell ,direction){
        let nextCell = getAdjacentCell(cell, direction);
        for(let i = 0 ; i< 4 ; i++){
            let nextCellStatus= enemy.gameboard.checkSquare(nextCell[0],nextCell[1]);
            if(typeof nextCellStatus === 'object' || nextCellStatus === null ) return nextCell;
            if(nextCellStatus === undefined ) return false;
            if(nextCellStatus === 'miss') return false;
            if(nextCellStatus === 'hit'){
                if(this.checkIfShipIsSunk(enemy, nextCell)) return false;
            }
            nextCell = getAdjacentCell(nextCell,direction);
        }
        return false;
    }

    function flipDirection(direction){
        switch(direction){
            case 'up':
                return 'down';
            case 'down':
                return 'up';
            case 'right':
                return 'left';
            case 'left':
                return 'right';
            default:
                return false;
        }
    }

    //find ship at given cell and check if sunk or not 
    //if sunk remove the squares from the lastHitArray
    function checkIfShipIsSunk(enemy,cell){
        const enemyShip = enemy.gameboard.placedShips;
        let hitShip;
        enemyShip.forEach(ship => {
            if(ship.squares.some(square => {
                return (square[0] === cell[0] && square[1]  === cell[1])
            })) hitShip = ship;;
        })
        if(hitShip.isSunk()){
            hitShip.squares.forEach(square => {
                const index = this.lastHitArray.findIndex(location => {
                    return (location[0] === square[0] && location[1] === square[1])
                });
                if(index > -1) this.lastHitArray.splice(index, 1);
            });
            return true;
        } else return false;
    }
    return {
        availableAttacks,
        lastShip,
        lastHitArray,
        Directions,
        concurrentMisses,
        attack,
        getRandomCell,
        makeCellUnavailable,
        getAdjacentCell,
        getAllAdjacentCells,
        getNextAttackableCell,
        getAdjacency,
        flipDirection,
        checkIfShipIsSunk
    }
}

function createAttackArray(){
    const attackArray = [];
    for(let row = 0 ; row< 10 ; row++){
        let rowArray = [];
        for(let col = 0 ; col < 10 ; col++){
            rowArray.push([row,col]);
        }
        attackArray.push(rowArray);
    }
    return attackArray;
}

export default enemyLogic;