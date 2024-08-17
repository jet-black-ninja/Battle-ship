import shipTypes from '../shipTypes'
let player ;
let board;

//an object to hold the data for the drag method to use
const dragData = {
    shipObject : null,
    shipElement : null,
    offsetX : null,
    offsetY : null,
    rowDiff : null,
    colDiff : null, 
    shipHomeContainer : null,
    prevContainer : null,
    prevCell : null,
    currentCell : null
}


//draw the board
function drawSetupBoard(setupPlayer , setupBoard) {
    player = setupPlayer;
    board = setupBoard;
    const setupCells = board.querySelectorAll('.cell');
    setupCells.forEach(cell => {
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('dragenter', dragEnter);
        cell.addEventListener('dragleave', dragLeave);
        cell.addEventListener('drop', drop);
    })
    return setupBoard;
}

function dragStart(event) {
    if(event.type === 'touchstart') {
        dragData.shipElement = event.target.parentElement;
        console.log(dragData.shipElement)
        dragData.shipHomeContainer = document.querySelector(`#${event.target.parentElement.id}-home`);
        dragData.prevContainer = event.target.parentElement.parentElement;
    } else {
        dragData.shipElement = event.target ;
        dragData.shipHomeContainer = document.querySelector(`#${event.target.id}-home`);
        dragData.prevContainer = event.target.parentElement;
    }

    updateCellDiff(event);
    if(dragData.shipElement.dataset.alignment === 'vertical') dragData.shipElement.classList.add('setup-shipVertical');

    setTimeout(() => {
        dragData.shipElement.classList.add('setup-ship-hide');
        dragData.shipElement.classList.remove('setup-ship-dropped');
        dragData.shipElement.classList.remove('setup-ship-vertical');
        dragData.shipHomeContainer.appendChild(dragData.shipElement);

    },0);
    if(dragData.prevContainer.classList.contains('cell')){
        const cell = dragData.prevContainer;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        player.gameboard.removeShip([row,col]);
    }
}

function dragEnd(event){
    dragData.shipElement.classList.remove('setup-ship-hide');
}

function dragEnter(event) {
    dragLeave(event);
    event.preventDefault();
    const type = dragData.shipElement.id;
    let row;
    let col;
    if(event.type === 'touchmove'){
    row = parseInt(touchCell.dataset.row) - parseInt(dragData.rowDiff);
    col = parseInt(touchCell.dataset.col) - parseInt(dragData.colDiff);
    } else {
        row = parseInt(event.target.dataset.row) - parseInt(dragData.rowDiff);
        col = parseInt(event.target.dataset.col) - parseInt(dragData.colDiff);
    }

    const shipSquares = player.gameboard.checkPlacement(shipTypes[type].length , [row, col],  dragData.shipElement.dataset.alignment);
    shipSquares.squares = shipSquares.squares.filter(square => {
        return player.gameboard.checkSquare(square[0],square[1]) !== undefined;
    })

    shipSquares.squares.forEach(square => {
        const cell = board.querySelector(`[data-row='${square[0]}'][data-col='${square[1]}']`);
        const cellOverlay = document.createElement('div');
        cellOverlay.classList.add('cell','cell-drag-over');
        cell.appendChild(cellOverlay);
        if(shipSquares.isValid) cellOverlay.classList.add('cell-drag-valid');
        else cellOverlay.classList.add('cell-drag-invalid');
    })
}

function dragOver(event){
    event.preventDefault();
}

function dragLeave(event){
    const leftCells = document.querySelectorAll('.cell-drag-over');
    leftCells.forEach(cell=> {
        cell.remove();
    })
}

function drop(event, touchCell){
    dragLeave(event);
    let row;
    let col;
    const type = dragData.shipElement.id;
    if(event.type === 'touchend'){
        row = parseInt(touchCell.dataset.row) - parseInt(dragData.rowDiff);
        col = parseInt(touchCell.dataset.col) - parseInt(dragData.colDiff);
    } else {
        row = parseInt(event.target.dataset.row) - parseInt(dragData.rowDiff);
        col = parseInt(event.target.dataset.col) - parseInt(dragData.colDiff);
    }

    const shipSquares = player.gameboard.checkPlacement(shipTypes[type].length, [row, col], dragData.shipElement.dataset.alignment)
    if (shipSquares.isValid) {
        const originCell = board.querySelector(`[data-row='${row}'][data-col='${col}']`);
        originCell.appendChild(dragData.shipElement);
        dragData.shipElement.classList.add('setup-ship-dropped');
        dragData.prevContainer = originCell;
        player.gameboard.placeShip(dragData.shipElement.id, [row, col], dragData.shipElement.dataset.alignment);
    }
    
    else {
        if (dragData.prevContainer.classList.contains('cell')) {
            dragData.shipElement.classList.add('setup-ship-dropped');
            const prevRow = dragData.prevContainer.dataset.row;
            const prevCol = dragData.prevContainer.dataset.col;
            player.gameboard.placeShip(dragData.shipElement.id, [prevRow, prevCol], dragData.shipElement.dataset.alignment)
        }
        dragData.previousContainer.appendChild(dragData.shipElement)
    }
    dragData.shipElement.classList.remove('setup-ship-hide');
    if (dragData.shipElement.dataset.alignment === 'vertical') dragData.shipElement.classList.add('setup-ship-vertical');
    else dragData.shipElement.classList.remove('setup-ship-vertical');
}


//draw setup ships
function drawSetupShips() {
    const setupShipContainer = document.createElement('div');
    setupShipContainer.classList.add('setup-ships-container');
    const setupShipHeader = document.createElement('div');
    setupShipHeader.classList.add('setup-ships-header');
    const setupShipTitle = document.createElement('h3');
    setupShipTitle.textContent='Place Your Ships';
    const setupShipInfo = document.createElement('p');
    setupShipInfo.textContent = 'Drag and drop ships onto the board. Double Click after placing Ship to rotate';
    const setupShipOptions = document.createElement('div');
    setupShipOptions.classList.add('setup-ships-options');
    const startGame = document.createElement('button');
    startGame.classList.add('start-game-button');
    startGame.textContent = 'Start Game';
    const randomShips = document.createElement('button');
    randomShips.classList.add('setup-button-random')
    randomShips.textContent = 'Randomize Ships';
    randomShips.addEventListener('click',randomizeFleet);
    setupShipOptions.append(startGame,randomShips);
    const shipList = document.createElement('div');
    for (let ship in shipTypes) {
        shipList.appendChild(drawShip(shipTypes[ship]));
    }
    setupShipHeader.append(setupShipTitle,setupShipInfo);
    setupShipContainer.append(setupShipHeader, shipList, setupShipOptions);
    return setupShipContainer;
}

//Draw a ship to be displayed based on The provided ID of the ship type 
function drawShip(ship) {
    const shipContainer = document.createElement('div');
    shipContainer.classList.add('setup-ship');
    shipContainer.id = `${ship.name}-home`;
    const shipBox = document.createElement('div');
    shipBox.id = ship.name;
    shipBox.dataset.length = ship.length;
    shipBox.classList.add('setup-ship-box');
    for(let i = 0 ; i < ship.length ; i++){
        const shipCell = document.createElement('div');
        shipCell.classList.add('setup-ship-cell');
        shipBox.appendChild(shipCell);
    }
    shipBox.draggable = true;
    shipBox.dataset.alignment = 'horizontal';
    shipBox.addEventListener('dragstart', dragStart);
    shipBox.addEventListener('dragend', dragEnd);
    shipBox.addEventListener('dblclick', rotateShip);

    shipBox.addEventListener('touchmove', function(event) {
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        const elements = document.elementsFromPoint(x, y);
        const touchCell = elements.filter( element => element.classList.contains('cell'));
        if(touchCell .length > 0){
            dragEnter(event, touchCell[0]);
        }else {
            dragLeave(event);
        }
        const app = document.querySelector('#app');
        const prevBox = document.querySelector('ghost-ship');
        if(prevBox) prevBox.remove();
        const newBox = shipBox.cloneNode(true);
        const touchLocation = event.targetTouches[0];
        if(dragData.shipElement.dataset.alignment === 'vertical');
            newBox.classList.add('setup-ship-vertical');
        newBox.classList.add('ghost-ship');
        newBox.style.left = `${touchLocation.pageX - dragData.offsetX}px`;
        newBox.style.top = `${touchLocation.pageY - dragData.offsetY}px`;
        app.appendChild(newBox);
    });

    shipBox.addEventListener('touchend', function (event){
        const prevBox = document.querySelector('.ghost-ship');
        if(prevBox) prevBox.remove();
        dragEnd(event);
        const x = event.changedTouches[0].clientX;
        const y = event.changedTouches[0].clientY;
        const elements = document.elementsFromPoint(x, y);
        const touchCell = elements.filter(element => element.classList.contains('cell'));
        if(touchCell.length > 0){
            drop(event. touchCell[0]);
        }
    });

    //ad mobile users cant double tap , we add timer into the touchstart event listener
    shipBox.addEventListener('touchstart', function (event) {
        event.preventDefault();
        let date = new Date();
        let time = date.getTime();
        const tapInterval = 200;
        if((time  - shipBox.lastChild) < tapInterval) {
            rotateShip(event);
            dragStart(event);
        } else  {
            dragStart(event);
        }
        shipBox.lastClick = time;
    });
    const shipName = document.createElement('p');
    if(ship.name === 'patrol') 
        shipName.textContent = 'Patrol Boat';
    else 
        shipName.textContent =ship.name;
    shipContainer.append(shipName, shipBox);
    return shipContainer;
}

// Place ships randomly on the players board
function randomizeFleet(){
    player.gameboard.placeShipsRandomly();
    player.gameboard.placedShips.forEach( ship => {
        const type = ship.type; 
        const origin = ship.squares[0];
        const alignment = ship.alignment;
        const shipElement = document.querySelector(`#${type}`);
        shipElement.dataset.alignment = alignment;
        shipElement.classList.add('setup-ship-dropped');
        if(alignment === 'vertical') 
            shipElement.classList.add('setup-ship-vertical');
        else 
            shipElement.classList.remove('setup-ship-vertical');
        const [row, col] = origin ; 
        const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.appendChild(shipElement);
    });
}
// When a user grabs a ship element, we track the user's cursor location for the dragEnter and drop events
// When the ship is grabbed from the center, the cursor does not match up with the ship's origin cell
// The cellDif difference between the origin cell to the cell where the user has grabbed the ship element
function updateCellDiff(event){
    let x; 
    let y;
    if(event.type === 'touchstart'){
        let bcr = event.target.parentElement.getBoundingClientRect();
        x = event.targetTouches[0].clientX - bcr.x;
        y = event.targetTouches[0].clientY - bcr.y;
        dragData.offsetX = x;
        dragData.offsetY = y;
    }else {
        x = event.offsetX;
        y = event.offsetY;
    };
    const cellSize = document.querySelector('.setup-ship-cell').offsetWidth;
    if(dragData.shipElement.dataset.alignment ==='horizontal'){
        dragData.rowDiff = 0;
        dragData.colDiff = Math.floor(x / (cellSize + 2));
    } else {
        dragData.rowDiff = Math.floor(y / (cellSize + 2));
        dragData.colDiff = 0;
    }
}

function rotateShip(event){
    const shipElement = dragStart.shipElement;
    const shipLength = shipTypes[shipElement.id].length;
    const originCell = shipElement.parentElement;
    if(!originCell.classList.contains('cell')) return ; // if the ship is not placed return ;

    const originRow = praseInt(originCell.dataset.row);
    const originCol = parseInt(originCell.dataset.col);
    console.log(originRow,originCol);
    player.gameboard.removeShip([originRow, originCol]);
    let row = originRow;
    let col = originCol;
    let originAlignment = shipElement.dataset.alignment;
    let newAlignment;
    if(originAlignment === 'horizontal'){
        newAlignment= 'vertical';
        if((10 - row) < shipLength) row = 10 - shipLength;
    } else {
        newAlignment = 'horizontal';
        if((10 - col) < shipLength) col = 10 - shipLength;
    }

    let attempts = 0;
    let shipSquares = player.gameboard.checkPlacement(shipLength, [row,col], newAlignment);
    while(shipSquares.isValid === false && attempts < 10){
        if(newAlignment === 'horizontal')
            row = row < 9 ? row + 1 : 0;
        else 
            col = col < 0 ? col + 1 : 0;
        shipSquares = player.gameboard.checkPlacement(shipLength,[row, col], newAlignment);
        attempts++;
    }
    if(shipSquares.isValid){
        player.gameboard.placeShip(shipElement.id, [row, col] , newAlignment);
        const newOriginCell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        newOriginCell.appendChild(shipElement);
        shipElement.dataSet.alignment = newAlignment;
        if(newAlignment === 'vertical')  shipElement.classList.add('setup-ship-vertical');
        else shipElement.classList.remove('setup-ship-vertical');
    } else {
        player.gameboard.placeShip(shipElement.id , [originRow, originCol], originAlignment);
    }

}

const setup = {
    drawSetupBoard,
    drawSetupShips
}


export default setup;

