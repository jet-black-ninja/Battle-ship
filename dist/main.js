/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/DOM/Controller.js":
/*!***************************************!*\
  !*** ./src/modules/DOM/Controller.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game */ "./src/modules/game.js");
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header */ "./src/modules/DOM/header.js");
/* harmony import */ var _footer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./footer */ "./src/modules/DOM/footer.js");
/* harmony import */ var _shipPlacer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shipPlacer */ "./src/modules/DOM/shipPlacer.js");




const app = document.createElement('div');
app.id = 'app';
document.body.appendChild(app);
const header = (0,_header__WEBPACK_IMPORTED_MODULE_1__["default"])();
const footer = (0,_footer__WEBPACK_IMPORTED_MODULE_2__["default"])();
const gameContainer = document.createElement('div');
gameContainer.id = 'game-container';
app.appendChild(header);
app.appendChild(gameContainer);
app.appendChild(footer);
const newGameButton = header.querySelector('.new-game-button');
newGameButton.addEventListener('click', newGame);
const game = (0,_game__WEBPACK_IMPORTED_MODULE_0__["default"])();
newGame();
function startGame(player1, player2) {
  game.newGame(player1, player2);
  drawGame();
}
function newGame() {
  const newPlayer1 = game.CreatePlayer('John', 1);
  const newPlayer2 = game.CreatePlayer(false, 2);
  newPlayer2.gameboard.placeShipsRandomly();
  drawSetup(newPlayer1);
  const startGameButton = document.querySelector('.setup-button-start');
  startGameButton.addEventListener('click', function (event) {
    if (newPlayer1.gameboard.placedShips.length === 5) {
      startGame(newPlayer1, newPlayer2);
    }
  });
}
function clearContainer(container) {
  while (container.firstChild) container.removeChild(container.firstChild);
}
function drawGame() {
  clearContainer(gameContainer);
  const player1BoardContainer = drawBoardContainer(game.player1);
  const player2BoardContainer = drawBoardContainer(game.player2);
  populateBoard(game.player1, player1BoardContainer.querySelector('.board'));
  gameContainer.append(player1BoardContainer, player2BoardContainer);
}
function drawSetup(player) {
  clearContainer(gameContainer);
  const setupBoard = _shipPlacer__WEBPACK_IMPORTED_MODULE_3__["default"].drawSetupBoard(player, drawBoardContainer(player));
  const setupShips = _shipPlacer__WEBPACK_IMPORTED_MODULE_3__["default"].drawSetupShips();
  const ships = setupShips.querySelectorAll('.setup-ship-box');
  gameContainer.append(setupBoard, setupShips);
}

// If the game container height if over 500px, we can see the flexbox is wrapped
// We then adjust the header to match the width of the game boards - instead of being 100% wide
const gameSizeObserver = new ResizeObserver(entry => {
  if (entry[0].contentRect.height > 500) header.style.width = '320px';else header.style.width = `${entry[0].contentRect.width}px`;
});
gameSizeObserver.observe(gameContainer);

//hold the information of the player's board - name , board and ships left

function drawBoardContainer(player) {
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container');
  const playerName = document.createElement('h3');
  if (player.isAI) playerName.textContent = `${player.name}'s fleet`;else playerName.textContent = `Your Fleet`;
  const playerBoard = drawBoard(player);
  boardContainer.append(playerName, playerBoard);
  return boardContainer;
}
function drawBoard(player) {
  const board = document.createElement('div');
  board.classList.add('board');
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.player = player ? player.number : 0;
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
      if (player.isAI && player) cell.addEventListener('click', listenForAttack, false);
    }
  }
  return board;
}
function populateBoard(player, board) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const square = player.gameboard.board[row][col];
      const cell = board.querySelector(`[data-row="${row}"][data-col="${col}]`);
      if (square !== null && typeof square === 'object') cell.classList.add('cell-ship');else cell.classList.remove('cell-ship');
    }
  }
}

// upon clicking a cell , attack the relevant square , if allowed 
// pass the information from the attack to the style attacked cell function  

function listenForAttack(event) {
  const cell = event.target;
  const defendingPlayerNumber = cell.dataset.player;
  const attackingPlayerNumber = defendingPlayerNumber === '1' ? '2' : '1';
  const attackingPlayer = game[`player${attackingPlayerNumber}`];
  const defendingPlayer = game[`player${defendingPlayerNumber}`];
  if (game.currentPlayer !== attackingPlayer) return;
  const row = cell.dataset.row;
  const col = cell.dataset.col;
  const [result, location, ship] = attackingPlayer.attack(defendingPlayer, row, col);
  styleAttackedCell(cell, defendingPlayerNumber, result, ship);
  cell.removeEventListener('click', listenForAttack, false);
  nextTurn();
}
function callAIAttack(AI) {
  if (AI !== game.currentPlayer) return;
  const defendingPlayerNumber = game.defendingPlayer === game.player1 ? '1' : '2';
  const [result, location, ship] = AI.attack(game.defendingPlayer);
  const cell = document.querySelector(`[data-player='${defendingPlayerNumber}][data-row='${location[0]}'][data-col='${location[1]}']`);
  styleAttackedCell(cell, defendingPlayerNumber, result, ship);
  nextTurn();
}

//Style attacked cell based on if it was hit or miss 
//If the ship is sunk , style each of the ship cells with the .cell-sunk class
function styleAttackedCell(cell, defendingPlayerNumber, result, ship) {
  if (result === 'hit') {
    cell.classList.add('cell-hit');
    if (ship.isSunk()) {
      ship.squares.forEach(square => {
        const cell = document.querySelector(`[data-player='${defendingPlayerNumber}'][data-row='${square[0]}'}][data-col='${square[1]}']`);
        cell.classList.add('cell-sunk');
      });
    }
  }
  if (result === 'miss') cell.classList.add('cell-miss');
}

// Handle next turn 
function nextTurn() {
  const winner = game.checkGameOver();
  if (winner) {
    return endGame(winner);
  }
  game.switchTurn();
  if (game.currentPlayer.isAI) {
    callAIAttack(game.currentPlayer);
  }
}
function endGame(winner) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => cell.removeEventListener('click', listenForAttack, false));
  gameContainer.appendChild(drawVictoryContainer(winner));
}

//draw a popup window with the winners name

function drawVictoryContainer(winner) {
  const loser = game.checkGameOver() === game.player1 ? game.player2 : game.player1;
  const victoryContainer = document.createElement('div');
  victoryContainer.classList.add('victory-container');
  const victoryTitle = document.createElement('h2');
  const winnerText = document.createElement('p');
  const loserText = document.createElement('p');
  if (winner.isAI) {
    victoryTitle.classList.add('victory-defeat');
    victoryTitle.textContent = 'Defeated';
    winnerText.textContent = `${winner.name} has claimed victory`;
    loserText.textContent = `Your Fleet Is Sunk`;
  } else {
    victoryTitle.classList.add('victory-victory');
    victoryTitle.textContent = "You Won";
    winnerText.textContent = `You Have Claimed Victory`;
    loserText.textContent = `${loser.name}'s fleet sunk`;
  }
  victoryContainer.append(victoryTitle, winnerText, loserText);
  return victoryContainer;
}

/***/ }),

/***/ "./src/modules/DOM/footer.js":
/*!***********************************!*\
  !*** ./src/modules/DOM/footer.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createFooter() {
  const footerBox = document.createElement('footer');
  const authorName = document.createElement('p');
  authorName.classList.add('footer-author');
  authorName.textContent = 'Sachin Kumar Singh';
  const footerLink = document.createElement('a');
  footerLink.id = 'footer-link';
  footerLink.setAttribute('href', "https://github.com/jet-black-ninja/Battle-ship/tree/main");
  const githubLogo = document.createElement('i');
  githubLogo.classList.add("fa-brands", "fa-github", "fa-xl", "footer-logo");
  footerLink.appendChild(githubLogo);
  function getTheme() {
    return localStorage.getItem("theme");
  }
  function toggleDarkTheme() {
    document.querySelector(':root').classList.toggle('dark');
    darkModeButton.classList.toggle("fa-moon");
    darkModeButton.classList.toggle("fa-sun");
  }
  function toggleDarkStorage() {
    if (getTheme() === 'dark') localStorage.setItem('theme', 'light');else localStorage.setItem('theme', 'dark');
  }
  function checkDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  const darkModeButton = document.createElement('i');
  darkModeButton.id = 'footer-dark-mode';
  darkModeButton.classList.add("fa-solid", "fa-moon", "fa-xl");
  darkModeButton.addEventListener('mousedown', function () {
    toggleDarkTheme();
    toggleDarkStorage();
  });
  if (getTheme() === 'dark' || !getTheme() && checkDarkMode()) {
    toggleDarkTheme();
  }
  footerBox.appendChild(authorName);
  footerBox.appendChild(footerLink);
  footerBox.appendChild(darkModeButton);
  return footerBox;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createFooter);

/***/ }),

/***/ "./src/modules/DOM/header.js":
/*!***********************************!*\
  !*** ./src/modules/DOM/header.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createHeader() {
  const header = document.createElement('header');
  header.id = 'header';
  const title = document.createElement('h1');
  title.textContent = 'Battleships';
  const newGameButton = document.createElement('button');
  newGameButton.classList.add('new-game-button');
  newGameButton.textContent = 'New Game';
  header.appendChild(title);
  header.appendChild(newGameButton);
  return header;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createHeader);

/***/ }),

/***/ "./src/modules/DOM/shipPlacer.js":
/*!***************************************!*\
  !*** ./src/modules/DOM/shipPlacer.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _shipTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shipTypes */ "./src/modules/shipTypes.js");

let player;
let board;

//an object to hold the data for the drag method to use
const dragData = {
  shipObject: null,
  shipElement: null,
  offsetX: null,
  offsetY: null,
  rowDiff: null,
  colDiff: null,
  shipHomeContainer: null,
  prevContainer: null,
  prevCell: null,
  currentCell: null
};

//draw the board
function drawSetupBoard(setupPlayer, setupBoard) {
  player = setupPlayer;
  board = setupBoard;
  const setupCells = board.querySelectorAll('.cell');
  setupCells.forEach(cell => {
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('dragenter', dragEnter);
    cell.addEventListener('dragleave', dragLeave);
    cell.addEventListener('drop', drop);
  });
  return setupBoard;
}
function dragStart(event) {
  if (event.type === 'touchstart') {
    dragData.shipElement = event.target.parentElement;
    dragData.shipHomeContainer = document.querySelector(`#${event.target.parentElement.id}-home`);
    dragData.prevContainer = event.target.parentElement.parentElement;
  } else {
    dragData.shipElement = event.target;
    dragData.shipHomeContainer = document.querySelector(`#${event.target.id}-home`);
    dragData.prevContainer = event.target.parentElement;
  }
  updateCellDiff(event);
  if (dragData.shipElement.dataset.alignment === 'vertical') dragData.shipElement.classList.add('setup-shipVertical');
  setTimeout(() => {
    dragData.shipElement.classList.add('setup-ship-hide');
    dragData.shipElement.classList.remove('setup-ship-dropped');
    dragData.shipElement.classList.remove('setup-ship-vertical');
    dragData.shipHomeContainer.appendChild(dragData.shipElement);
  }, 0);
  if (dragData.prevContainer.classList.contains('cell')) {
    const cell = dragData.prevContainer;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    player.gameBoard.removeShip([row, col]);
  }
}
function dragEnd(event) {
  dragData.shipElement.classList.remove('setup-ship-hide');
}
function dragEnter(event) {
  DragEvent(event);
  event.preventDefault();
  const type = dragData.shipElement.id;
  let row;
  let col;
  if (event.type === 'touchmove') {
    row = parseInt(touchCell.dataset.row) - parseInt(dragData.rowDiff);
    col = parseInt(touchCell.dataset.col) - parseInt(dragData.colDiff);
  } else {
    row = parseInt(event.target.dataset.row) - parseInt(dragData.rowDiff);
    col = parseInt(event.target.dataset.col) - parseInt(dragData.colDiff);
  }
  const shipSquares = player.gameBoard.checkPlacement(_shipTypes__WEBPACK_IMPORTED_MODULE_0__["default"][type].length, [row, col], dragData.shipElement.dataset.alignment);
  shipSquares.squares = shipSquares.squares.filter(square => {
    return player.gameBoard.checkSquare(square[0], square[1]) !== undefined;
  });
  shipSquares.squares.forEach(square => {
    const cell = board.querySelector(`[data-row='${square[0]}'][data-col'${square[1]}']`);
    const cellOverlay = document.createElement('div');
    cellOverlay.classList.add('cell', 'cell-drag-over');
    cell.appendChild(cellOverlay);
    if (shipSquares.isValid) cellOverlay.classList.add('cell-drag-valid');else cellOverlay.classList.add('cell-drag-invalid');
  });
}
function dragOver(event) {
  event.preventDefault();
}
function dragLeave(event) {
  const leftCells = document.querySelectorAll('.cell-drag-over');
  leftCells.forEach(cell => {
    cell.remove();
  });
}
function drop(event, touchCell) {
  dragLeave(event);
  let row;
  let col;
  const type = dragData.shipElement.id;
  if (event.type === touched) {
    row = parseInt(touchCell.dataset.row) - parseInt(dragData.rowDiff);
    col = parseInt(touchCell.dataset.col) - parseInt(dragData.colDiff);
  } else {
    row = parseInt(event.target.dataset.row) - parseInt(dragData.rowDiff);
    col = parseInt(event.target.dataset.col) - parseInt(dragData.colDiff);
  }
  const shipSquares = player.gameboard.checkPlacement(_shipTypes__WEBPACK_IMPORTED_MODULE_0__["default"][type].length, [row, col], dragData.shipElement.dataset.alignment);
  if (shipSquares.isValid) {
    const originCell = board.querySelector(`[data-row='${row}'][data-col='${col}']`);
    originCell.appendChild(dragData.shipElement);
    dragData.shipElement.classList.add('setup-ship-dropped');
    dragData.prevContainer = originCell;
    player.gameboard.placeShip(dragData.shipElement.id, [row, col], dragData.shipElement.dataset.alignment);
  } else {
    if (dragData.prevContainer.classList.contains('cell')) {
      dragData.shipElement.classList.add('setup-ship-dropped');
      const prevRow = dragData.prevContainer.dataset.row;
      const prevCol = dragData.prevContainer.dataset.col;
      player.gameboard.placeShip(dragData.shipElement.id, [prevRow, prevCol], dragData.shipElement.dataset.alignment);
    }
    dragData.previousContainer.appendChild(dragData.shipElement);
  }
  dragData.shipElement.classList.remove('setup-ship-hide');
  if (dragData.shipElement.dataset.alignment === 'vertical') dragData.shipElement.classList.add('setup-ship-vertical');else dragData.shipElement.classList.remove('setup-ship-vertical');
}

//draw setup ships
function drawSetupShips() {
  const setupShipContainer = document.createElement('div');
  setupShipContainer.classList.add('setup-ships-container');
  const setupShipHeader = document.createElement('div');
  setupShipHeader.classList.add('setup-ships-header');
  const setupShipTitle = document.createElement('h3');
  setupShipTitle.textContent = 'Place Your Ships';
  const setupShipInfo = document.createElement('p');
  setupShipInfo.textContent = 'Drag and drop ships onto the board. Double Click after placing Ship to rotate';
  const setupShipOptions = document.createElement('div');
  setupShipOptions.classList.add('setup-ships-options');
  const startGame = document.createElement('button');
  startGame.classList.add('start-game-button');
  startGame.textContent = 'Start Game';
  const randomShips = document.createElement('button');
  randomShips.classList.add('setup-button-random');
  randomShips.textContent = 'Randomize Ships';
  randomShips.addEventListener('click', randomizeFleet);
  setupShipOptions.append(startGame, randomShips);
  const shipList = document.createElement('div');
  for (let ship in _shipTypes__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    shipList.appendChild(drawShip(_shipTypes__WEBPACK_IMPORTED_MODULE_0__["default"][ship]));
  }
  setupShipHeader.append(setupShipTitle, setupShipInfo);
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
  for (let i = 0; i < ship.length; i++) {
    const shipCell = document.createElement('div');
    shipCell.classList.add('setup-ship-cell');
    shipBox.appendChild(shipCell);
  }
  shipBox.draggable = true;
  shipBox.dataset.alignment = 'horizontal';
  shipBox.addEventListener('dragstart', dragStart);
  shipBox.addEventListener('dragend', dragEnd);
  shipBox.addEventListener('dblclick', rotateShip);
  shipBox.addEventListener('touchmove', function (event) {
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;
    const elements = document.elementsFromPoint(x, y);
    const touchCell = elements.filter(element => element.classList.contains('cell'));
    if (touchCell.length > 0) {
      dragEnter(event, touchCell[0]);
    } else {
      dragLeave(event);
    }
    const app = document.querySelector('#app');
    const prevBox = document.querySelector('ghost-ship');
    if (prevBox) prevBox.remove();
    const newBox = shipBox.cloneNode(true);
    const touchLocation = event.targetTouches[0];
    if (dragData.shipElement.dataset.alignment === 'vertical') ;
    newBox.classList.add('setup-ship-vertical');
    newBox.classList.add('ghost-ship');
    newBox.style.left = `${touchLocation.pageX - dragData.offsetX}px`;
    newBox.style.top = `${touchLocation.pageY - dragData.offsetY}px`;
    app.appendChild(newBox);
  });
  shipBox.addEventListener('touchend', function (event) {
    const prevBox = document.querySelector('.ghost-ship');
    if (prevBox) prevBox.remove();
    dragEnd(event);
    const x = event.changedTouches[0].clientX;
    const y = event.changedTouches[0].clientY;
    const elements = document.elementsFromPoint(x, y);
    const touchCell = elements.filter(element => element.classList.contains('cell'));
    if (touchCell.length > 0) {
      drop(event.touchCell[0]);
    }
  });

  //ad mobile users cant double tap , we add timer into the touchstart event listener
  shipBox.addEventListener('touchstart', function (event) {
    event.preventDefault();
    let date = new Date();
    let time = date.getTime();
    const tapInterval = 200;
    if (time - shipBox.lastChild < tapInterval) {
      rotateShip(event);
      dragStart(event);
    } else {
      dragStart(event);
    }
    shipBox.lastClick = time;
  });
  const shipName = document.createElement('p');
  if (ship.name === 'patrol') shipName.textContent = 'Patrol Boat';else shipName.textContent = ship.name;
  shipContainer.append(shipName, shipBox);
  return shipContainer;
}

// Place ships randomly on the players board
function randomizeFleet() {
  player.gameboard.placeShipsRandomly();
  player.gameboard.placedShips.forEach(ship => {
    const type = ship.type;
    const origin = ship.squares[0];
    const alignment = ship.alignment;
    const shipElement = document.querySelector(`#${type}`);
    shipElement.dataset.alignment = alignment;
    shipElement.classList.add('setup-ship-dropped');
    if (alignment === 'vertical') shipElement.classList.add('setup-ship-vertical');else shipElement.classList.remove('setup-ship-vertical');
    const [row, col] = origin;
    const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.appendChild(shipElement);
  });
}
// When a user grabs a ship element, we track the user's cursor location for the dragEnter and drop events
// When the ship is grabbed from the center, the cursor does not match up with the ship's origin cell
// The cellDif difference between the origin cell to the cell where the user has grabbed the ship element
function updateCellDiff(event) {
  let x;
  let y;
  if (event.type === 'touchstart') {
    let bcr = event.target.parentElement.getBoundingClientRect();
    x = event.targetTouches[0].clientX - bcr.x;
    y = event.targetTouches[0].clientY - bcr.y;
    dragData.offsetX = x;
    dragData.offsetY = y;
  } else {
    x = event.offsetX;
    y = event.offsetY;
  }
  ;
  const cellSize = document.querySelector('.setup-ship-cell').offsetWidth;
  if (dragData.shipElement.dataset.alignment === 'horizontal') {
    dragData.rowDiff = 0;
    dragData.colDiff = Math.floor(x / (cellSize + 2));
  } else {
    dragData.rowDiff = Math.floor(y / (cellSize + 2));
    dragData.colDiff = 0;
  }
}
function rotateShip(event) {
  const shipElement = dragStart.shipElement;
  const shipLength = _shipTypes__WEBPACK_IMPORTED_MODULE_0__["default"][shipElement.id].length;
  const originCell = shipElement.parentElement;
  if (!originCell.classList.contains('cell')) return; // if the ship is not placed return ;

  const originRow = praseInt(originCell.dataset.row);
  const originCol = parseInt(originCell.dataset.col);
  console.log(originRow, originCol);
  player.gameBoard.removeShip([originRow, originCol]);
  let row = originRow;
  let col = originCol;
  let originAlignment = shipElement.dataset.alignment;
  let newAlignment;
  if (originAlignment === 'horizontal') {
    newAlignment = 'vertical';
    if (10 - row < shipLength) row = 10 - shipLength;
  } else {
    newAlignment = 'horizontal';
    if (10 - col < shipLength) col = 10 - shipLength;
  }
  let attempts = 0;
  let shipSquares = player.gameBoard.checkPlacement(shipLength, [row, col], newAlignment);
  while (shipSquares.isValid === false && attempts < 10) {
    if (newAlignment === 'horizontal') row = row < 9 ? row + 1 : 0;else col = col < 0 ? col + 1 : 0;
    shipSquares = player.gameboard.checkPlacement(shipLength, [row, col], newAlignment);
    attempts++;
  }
  if (shipSquares.isValid) {
    player.gameboard.placeShip(shipElement.id, [row, col], newAlignment);
    const newOriginCell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    newOriginCell.appendChild(shipElement);
    shipElement.dataSet.alignment = newAlignment;
    if (newAlignment === 'vertical') shipElement.classList.add('setup-ship-vertical');else shipElement.classList.remove('setup-ship-vertical');
  } else {
    player.gameboard.placeShip(shipElement.id, [originRow, originCol], originAlignment);
  }
}
const setup = {
  drawSetupBoard,
  drawSetupShips
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setup);

/***/ }),

/***/ "./src/modules/board.js":
/*!******************************!*\
  !*** ./src/modules/board.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ships__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ships */ "./src/modules/ships.js");
/* harmony import */ var _shipTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shipTypes */ "./src/modules/shipTypes.js");


function Gameboard() {
  const board = createBoard();
  const placedShips = [];

  //create empty board array
  function createBoard() {
    let boardArray = [];
    for (let row = 0; row <= 9; row++) {
      let rowArray = [];
      for (let col = 0; col <= 9; col++) {
        rowArray[col] = null;
      }
      boardArray[row] = rowArray;
    }
    return boardArray;
  }

  //function to empty board array
  function clearBoard(board) {
    for (let row = 0; row <= 9; row++) {
      for (let col = 0; col <= 9; col++) {
        board[row][col] = null;
      }
    }
  }
  function placeShip(shipType, origin, alignment) {
    const shipLength = _shipTypes__WEBPACK_IMPORTED_MODULE_1__["default"][shipType].length;
    const shipSquares = this.checkPlacement(shipLength, origin, alignment);
    // If shipSquares is a valid array, place the ship on all of those squares
    if (shipSquares.isValid) {
      const ship = (0,_ships__WEBPACK_IMPORTED_MODULE_0__["default"])(shipType);
      ship.squares = shipSquares.squares;
      ship.alignment = alignment;
      shipSquares.squares.forEach(square => {
        let [row, col] = square;
        this.board[row][col] = ship;
      });
      placedShips.push(ship);
      return ship;
    } else return "Cannot place ship in that location";
  }
  function checkPlacement(shipLength, origin, alignment) {
    //create array of ship placement squares
    let [row, col] = origin;
    let shipSquares = [];
    for (let i = 0; i < shipLength; i++) {
      shipSquares.push([row, col]);
      alignment === 'horizontal' ? col++ : row++;
    }
    //if every every placement square is null, the validPlacement is an array of the valid squares
    const validPlacement = shipSquares.every(square => {
      let [row, col] = square;
      if (this.checkSquare(row, col) === undefined) return false;
      return this.board[row][col] === null;
    });
    //return an object containing the validPlacement and squares processed
    return {
      isValid: validPlacement,
      squares: shipSquares
    };
  }
  function checkSquare(row, col) {
    if (row < 0 || col < 0) return undefined;else if (row > 9 || col > 9) {
      return undefined;
    } else return this.board[row][col];
  }
  function clearFleet(placedShips) {
    while (placedShips.length > 0) placedShips.pop();
  }
  function removeShip(origin) {
    const [row, col] = origin;
    const ship = this.checkSquare(row, col);
    ship.squares.forEach(square => {
      const [row, col] = square;
      this.board[(row, col)] = null;
    });
    const shipsIndex = this.placedShips.indexOf(ship);
    this.placedShips.splice(shipsIndex, 1);
  }
  function placeShipsRandomly() {
    clearBoard(this.board);
    clearFleet(this.placedShips);
    for (let ship in _shipTypes__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      let result = this.placeShipRandomly(ship);
      while (typeof result !== 'object' || result === null) {
        result = this.placeShipRandomly(ship);
      }
    }
  }

  //Take a ship and place it at random square and random axis
  function placeShipRandomly(shipType) {
    const shipLength = _shipTypes__WEBPACK_IMPORTED_MODULE_1__["default"][shipType].length;
    function randomAlignment() {
      return Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }
    function getRandomSquare(alignment) {
      let rowDif = 0;
      let colDif = 0;
      if (alignment === 'horizontal') colDif = shipLength - 1;else rowDif = shipLength - 1;
      let row = Math.floor(Math.random() * (10 - rowDif));
      let col = Math.floor(Math.random() * (10 - colDif));
      return [row, col];
    }
    let alignment = randomAlignment();
    let origin = getRandomSquare(alignment);
    let shipSquares = this.checkPlacement(shipLength, origin, alignment);
    while (!shipSquares.isValid) {
      alignment = randomAlignment();
      origin = getRandomSquare(alignment);
      shipSquares = this.checkPlacement(shipLength, origin, alignment);
    }
    return this.placeShip(shipType, origin, alignment);
  }
  function receiveHit(row, col) {
    if (this.checkSquare(row, col) === undefined) return "Invalid Location";
    const attackedShip = this.board[row][col];
    if (attackedShip === null) this.board[row][col] = 'miss';else {
      attackedShip.hit();
      this.board[row][col] = 'hit';
    }
    return [this.board[row][col], [row, col], attackedShip];
  }
  function checkAllShipsSunk() {
    return placedShips.every(ship => ship.isSunk());
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
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/modules/enemyLogic.js":
/*!***********************************!*\
  !*** ./src/modules/enemyLogic.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function enemyLogic() {
  // 2D array containing all available attack coordinates
  const availableAttacks = createAttackArray();
  let lastShip;
  //array with all recent attacks in order
  const lastHitArray = [];
  const Directions = ['up', 'down', 'left', 'right'];
  let concurrentMisses = 0;
  function attack(enemy) {
    if (this.lastHitArray.length > 0) {
      this.checkIfShipIsSunk(enemy, this.lastHitArray[lastHitArray.length - 1]);
    }
    if (this.availableAttacks.length === 0) return 'No Squares to Attacks';
    //if the boat misses more than 5 time , then it gets a chance to cheat 
    if (this.lastHitArray.length === 0) {
      if (this.concurrentMisses > 5 && Math.random > 0.8) {
        const enemyBoard = enemy.gameboard.board;
        for (let row = 0; row < 10; row++) {
          for (let col = 0; col < 10; col++) {
            const cell = enemy.gameboard.checkSquare(row, col);
            if (typeof cell === 'object' && cell !== null) {
              console.log('cheating');
              return [row, col];
            }
          }
        }
      }
      let attackCoords = this.getRandomCell(enemy);
      return attackCoords;
    }
    //else we fire on the squares adjacent to the last hit square
    const lastHit = this.lastHitArray[lastHitArray.length - 1];
    const adjacentCells = this.getAllAdjacentCells(enemy, lastHit);
    const adjacentHits = adjacentCells.filter(cell => {
      return cell.cellResult === 'hit' && this.checkIfShipIsSunk(enemy, cell.adjacentCell) === false;
    });
    //if there is a hit (or multiple) adjacent , attack in the opposite direction
    if (adjacentHits.length > 0) {
      const randomAdjacentHit = adjacentHits[Math.floor(Math.random() * adjacentHits.length)];
      let nextCell = this.getNextAttackableCell(enemy, lastHit, this.flipDirection(randomAdjacentHit.direction));
      if (nextCell === false) {
        nextCell = this.getNextAttackableCell(enemy, lastHit, randomAdjacentHit.direction);
      }
      ;
      while (nextCell === false) {
        nextCell = this.getNextAttackableCell(enemy, lastHit, this.Directions[Math.floor(Math.random() * this.Directions.length)]);
      }
      ;
      return nextCell;
    }

    //go backwards through all other hit cells for adjacency to last hit cell and attack a cell in that direction
    for (let i = this.lastHitArray.length - 2; i >= 0; i--) {
      const cell = this.lastHitArray[i];
      const result = this.getAdjacency(lastHit, cell);
      if (result) {
        let nextCell = this.getNextAttackableCell(enemy, lastHit, result.direction);
        if (nextCell) return nextCell;
      }
    }
    const adjacentCellToAttack = adjacentCells.filter(cell => {
      return typeof cell.cellResult !== 'string' && cell.cellResult !== undefined;
    });
    const cell = adjacentCellToAttack[Math.floor(Math.random() * adjacentCellToAttack.length)];
    //console.log(cell.adjacentCell);
    return cell.adjacentCell;
  }
  function getRandomCell(enemy) {
    if (this.availableAttacks.length === 0) return "no Squares to attack";
    //get row and col for a random attack from the availableAttacks array
    let arrayRow = Math.floor(Math.random() * this.availableAttacks.length);
    let arrayCol = Math.floor(Math.random() * this.availableAttacks[arrayRow].length);
    let cell = this.availableAttacks[arrayRow][arrayCol];
    //if the selected cell has 0 adjacent attackable cells get a random cell
    const adjacentCells = this.getAllAdjacentCells(enemy, cell);
    if (adjacentCells.every(cell => typeof cell.cellResult !== 'object')) {
      return this.getRandomCell(enemy);
    }
    return cell;
  }
  //Remove a cell from the availableAttack array
  //gets called by player.js after attack 
  function removeCellFromAvailableAttacks(cell) {
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
  function getAllAdjacentCells(enemy, cell) {
    return Directions.map(direction => {
      const adjacentCell = this.getAdjacentCell(cell, direction);
      let cellResult = enemy.gameboard.checkSquare(adjacentCell[0], adjacentCell[1]);
      if (cellResult === 'hit') {
        if (this.checkIfShipIsSunk(enemy, adjacentCell)) cellResult = 'sunk';
      }
      return {
        cellResult,
        adjacentCell,
        direction
      };
    });
  }
  function getAdjacentCell(cell, direction) {
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
    }
    ;
    return [row, col];
  }
  function getAdjacency(cell, neighbourCell) {
    let direction;
    let oppositeDirection;
    let distance;
    if (cell[0] === neighbourCell[0]) {
      const diff = cell[1] - neighbourCell[1];
      direction = diff > 1 ? 'left' : 'right';
      oppositeDirection = diff > 1 ? 'right' : 'left';
      distance = Math.abs(diff);
    } else if (cell[1] === neighbourCell[1]) {
      const diff = cell[0] - neighbourCell[0];
      direction = diff > 1 ? 'down' : 'up';
      oppositeDirection = diff > 1 ? 'up' : 'down';
      distance = Math.abs(diff);
    } else {
      return false;
    }
    return {
      direction,
      oppositeDirection,
      distance
    };
  }

  //look for a possible cell to attack in a given direction(only 4 cells)
  function getNextAttackableCell(enemy, cell, direction) {
    let nextCell = getAdjacentCell(cell, direction);
    for (let i = 0; i < 4; i++) {
      let nextCellStatus = enemy.gameboard.checkSquare(nextCell[0], nextCell[1]);
      if (typeof nextCellStatus === 'object' || nextCellStatus === null) return nextCell;
      if (nextCellStatus === undefined) return false;
      if (nextCellStatus === 'miss') return false;
      if (nextCellStatus === 'hit') {
        if (this.checkIfShipIsSunk(enemy, nextCell)) return false;
      }
      nextCell = getAdjacentCell(nextCell, direction);
    }
    return false;
  }
  function flipDirection(direction) {
    switch (direction) {
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
  function checkIfShipIsSunk(enemy, cell) {
    const enemyShip = enemy.gameboard.placedShips;
    let hitShip;
    enemyShip.forEach(ship => {
      if (ship.squares.some(square => {
        return square[0] === cell[0] && square[1] === cell[1];
      })) hitShip = ship;
      ;
    });
    if (hitShip.isSunk()) {
      hitShip.squares.forEach(square => {
        const index = this.lastHitArray.findIndex(location => {
          return location[0] === square[0] && location[1] === square[1];
        });
        if (index > -1) this.lastHitArray.splice(index, 1);
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
    removeCellFromAvailableAttacks,
    getAdjacentCell,
    getAllAdjacentCells,
    getNextAttackableCell,
    getAdjacency,
    flipDirection,
    checkIfShipIsSunk
  };
}
function createAttackArray() {
  const attackArray = [];
  for (let row = 0; row < 10; row++) {
    let rowArray = [];
    for (let col = 0; col < 10; col++) {
      rowArray.push([row, col]);
    }
    attackArray.push(rowArray);
  }
  return attackArray;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (enemyLogic);

/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");

function Game() {
  let player1;
  let player2;
  let currentPlayer;
  let defendingPlayer;
  function CreatePlayer(name, number) {
    return (0,_player__WEBPACK_IMPORTED_MODULE_0__["default"])(name, number);
  }
  function newGame(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = this.player1;
    this.defendingPlayer = this.player2;
  }
  function switchTurn() {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    this.defendingPlayer = this.defendingPlayer === this.player2 ? this.player1 : this.player2;
  }
  function checkGameOver() {
    if (this.player1.gameboard.checkAllShipsSunk()) return this.player2;else if (this.player2.gameboard.checkAllShipsSunk()) return this.player1;else return false;
  }
  return {
    player1,
    player2,
    currentPlayer,
    defendingPlayer,
    CreatePlayer,
    newGame,
    switchTurn,
    checkGameOver
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/modules/board.js");
/* harmony import */ var _enemyLogic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enemyLogic */ "./src/modules/enemyLogic.js");


function Player(playerName, playerNum) {
  let name = typeof playerName === 'string' ? playerName : 'bot';
  const number = playerNum;
  const isAI = typeof playerName === 'string' ? false : true;
  const gameboard = (0,_board__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const enemy = (0,_enemyLogic__WEBPACK_IMPORTED_MODULE_1__["default"])();
  function attack(target, row, col) {
    if (this.isAI) {
      if (this.enemy.availableAttacks.length === 0) return "cannot attack further";
      [row, col] = this.enemy.attack(target);
    }
    //get the result of the attack
    const result = target.gameboard.receiveHit(row, col);
    if (this.isAI) {
      if (result[0] === 'hit') {
        this.enemy.lastHitArray.push(result[1]);
        this.enemy.concurrentMisses = 0;
      }
      if (result[0] === 'miss') this.enemy.concurrentMisses++;
      if (result[2] !== 'null') this.enemy.lastShip = result[2];
      this.enemy.removeCellFromAvailableAttacks(result[1]);
    }
    return result;
  }
  return {
    name,
    number,
    isAI,
    gameboard,
    enemy,
    attack
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/modules/shipTypes.js":
/*!**********************************!*\
  !*** ./src/modules/shipTypes.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const shipTypes = {
  carrier: {
    id: 1,
    name: 'carrier',
    length: 5
  },
  battleship: {
    id: 2,
    name: 'battleship',
    length: 4
  },
  destroyer: {
    id: 3,
    name: 'destroyer',
    length: 3
  },
  submarine: {
    id: 4,
    name: 'submarine',
    length: 3
  },
  patrol: {
    id: 5,
    name: 'patrol',
    length: 2
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shipTypes);

/***/ }),

/***/ "./src/modules/ships.js":
/*!******************************!*\
  !*** ./src/modules/ships.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _shipTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipTypes */ "./src/modules/shipTypes.js");

function Ship(shipType) {
  const type = shipType;
  const length = _shipTypes__WEBPACK_IMPORTED_MODULE_0__["default"][shipType].length;
  let hits = 0;
  let squares;
  let alignment;
  function hit() {
    this.hits++;
  }
  function isSunk() {
    if (this.hits >= this.length) return true;else return false;
  }
  return {
    type,
    length,
    hits,
    squares,
    alignment,
    hit,
    isSunk
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* setup */
:root{
    --header-height: 100px;
    --board-size: 318px;
    --cell-size: 30px;

    --background-color: rgb(240, 240, 240);
    --background-color-transparent: rgba(240, 240, 240, 0.7);
    --cell-color: rgb(230, 230, 230);
    --cell-hover-color: rgb(200, 200, 200);
    --cell-border-color: rgb(70, 70, 70);
    --ship-color: rgb(150, 150, 150);
    --hit-color: rgb(206, 169, 134);
    --miss-color: rgb(161, 216, 161);
    --sunk-color: rgb(206, 134, 134);
    --text-color-main: rgb(40, 40, 40);
    --text-color-grey: rgb(100, 100, 100);
    --button-color: rgb(210, 210, 210);
    --button-color-hover: rgb(230, 230, 230);
    --button-color-active: grey;
}
:root.dark {
    --background-color: rgb(30, 30, 30);
    --background-color-transparent: rgba(30, 30, 30, 0.7);
    --cell-color: rgb(40, 40, 40);
    --cell-hover-color: rgb(90, 90, 90);
    --cell-border-color: rgb(220, 220, 220);
    --ship-color: rgb(153, 153, 153);
    --hit-color: rgb(155, 99, 61);
    --miss-color: rgb(52, 109, 52);
    --sunk-color: rgb(155, 61, 61);
    --text-color-main: rgb(220, 220, 220);
    --text-color-grey: rgb(160, 160, 160);
    --button-color: rgb(50, 50, 50);
    --button-color-hover: rgb(20, 20, 20);
    --button-color-active: grey;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}
/* contents */
body {
    margin: 0;
    padding: 0;
    background-color:var(--background-color);
    font-family: 'Raleway', sans-serif;
    color:var(--text-color-main);
}

#app {
    padding: 0 5%;
    min-height: 100vh;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
h3{
    margin:0;
}
/* header */
header {
    display:flex;
    justify-content: space-between ;
    align-items:center;
    width:675px;
}

header button{
    height:32px;
    width: 120px;
    font-size:1rem;
    padding-bottom:2px;
}

button {
    font-family: 'Fira Code', monospace;
    color:var(--text-color-main);
    display:flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--text-color-main);
    border-radius: 3px;
    background-color: var(--button-color);
}
button:active{
    background-color: var(--button-color-active);
    scale:0.95;
}

@media (hover:hover){
    button:hover {
        cursor:pointer;
        border-width: 2px;
        background-color:var(--button-color-hover)
    }
}

/* game container */

#game-container {
    display:flex;
    justify-content: center;
    align-content: center;
    flex-wrap:wrap;
    gap:40px;
}
/* player setup */
.setup-ships-container {
    display:flex;
    flex-direction:column;
    justify-content: space-between;
    width: var(--board-size);
    height: calc(var(--board-size)+25px);
    text-align: right;

}
.setup-ships-header p {
    margin: 0;
    font-size: 0.8rem;
}
.setup-ship-shiplist {
    display: flex;
    flex-direction: column;
    justify-content:center;
}
.setup-ship{
    height: 40px;
    position: relative;
    display:flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
}

.setup-ship p{
    margin: 0;
    display:inline-block;
}

.setup-ship-box{
    cursor:grab;
    display:inline-flex;
    gap:2px;
    position: relative;
    z-index:20;
}
.setup-ship-vertical{
    flex-direction: column;
}
.setup-ship-hide div{
    background-color: rgba(0,0,0,0);
    opacity: 0.5;
}
.setup-ship-dropped{
    position: absolute;
    left: -1px;
    top: -1px;
}

.ghost-ship{
    position: absolute;
    z-index: 200;
    opacity: 0.8;
}
.ghost-ship> .setup-ship-cell{
    background-color: var(--cell-hover-color);
}

.setup-ship-cell {
    width: var(--cell-size);
    height:var(--cell-size);
    background-color: var(--cell-hover-color);
    border: 1px solid var(--cell-border-color);
}

.setup-ships-options{
    display:flex;
    justify-content: space-between;
}

.start-game-button,
.setup-button-random {
    width: 120px;
    height:36px;
}
.start-game-button{
    font-weight:600;
    font-size:1rem;
    background-color:var(--hit-color);
    transition: transform 0.1s ease;
}
.start-game-button-disabled{
    opacity: 0.5;
    pointer-events: none;
}
@media(hover: hover){
    .setup-button-start:hover{
        transform:scale(1.1);
        background-color:rgb(226,116,116);
    }
}

/* player sections */

.board-container {
    display:inline-block;
}

/* player board */
.board{
    display:grid;
    grid-template-columns: repeat(10,1fr);
    grid-template-rows: repeat(10,1fr);
    gap:2px;
}

.cell {
    position: relative;
    cursor: crosshair;
    height:var(--cell-size);
    width: var(--cell-size);
    display:flex;
    justify-content: center;
    align-content:center;
    background-color: var(--cell-color);
    border: 1px solid var(--cell-border-color);
}

.cell-setup{
    display:inline-block;
}
.cell-drag-over{
    pointer-events: none;
    position: absolute;
    display:inline-block;
    z-index:40;
}

.cell-drag-valid{
    background-color:var(--miss-color);
}
.cell-drag-invalid{
    background-color:var(--hit-color);
}

@media(hover: hover){
    .cell:not([data-player='1']):not(.cell-hit):not(.cell-miss):hover{
        background-color:var(--cell-hover-color);
    }
}

.cell-ship{
    background-color:var(--ship-color);
}

.cell-hit{
    background-color:var(--hit-color);
}
.cell-hit::after{
    content:'X';
    opacity:0.8;
    font-size: 1.3rem;
    padding-bottom: 1px;
}
.cell-miss{
    background-color:var(--miss-color);
}

.cell-miss::after{
    content:"O";
    opacity:0.6;
    padding-bottom: 4px;
}

.cell-sunk{
    background-color: var(--sunk-color);
    transition: background-color 0.2s ease;
}

/* footer */
footer{
    display:flex;
    align-items: center;
    justify-content: center;
    text-align:center;
    gap:16px;
    padding:0 32px;
}

#footer-link{
    text-decoration: none;
}
footer p{
    font-weight: 600;
    font-size: 1.1rem;
}
footer i{
    color:var(--text-color-main);
}
@media(hover: hover){
    #footer-link:hover{
        cursor:pointer;
        transform: scale(1.2);
        transition: transform 0.1s ease;
    }
}

/* Victory Container */
.victory-container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 318px;
    text-align: center;
    padding: 20px;
    border: 3px solid var(--text-color-main);
    background-color: var(--background-color-transparent);
    backdrop-filter: blur(4px);
}
.victory-container h2 {
    margin: 0;
    text-shadow: 0 0 2px black, 0 0 4px black, 0 0 6px black;
}

.victory-container p {
    margin: 6px;
}

.victory-victory {
    color: var(--miss-color);
}

.victory-defeat {
    color: var(--sunk-color);
}


@media screen and (max-width: 800px) {
    :root {
        --header-height: 80px;
        --board-size: 278px;
        --cell-size: 26px;
    }
    header{
        width:400px;
    }

    header button {
        height: 28px;
        width: 100px;
        font-size: 0.9rem;
        padding-bottom: 2px;
    }

    #game-container {
        gap: 20px;
    }

    .start-game-button,
    .setup-button-random {
        width: 100px;
        height: 28px;
    }

    .setup-button-start {
        font-size: 0.9rem;
    }
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["/* setup */\r\n:root{\r\n    --header-height: 100px;\r\n    --board-size: 318px;\r\n    --cell-size: 30px;\r\n\r\n    --background-color: rgb(240, 240, 240);\r\n    --background-color-transparent: rgba(240, 240, 240, 0.7);\r\n    --cell-color: rgb(230, 230, 230);\r\n    --cell-hover-color: rgb(200, 200, 200);\r\n    --cell-border-color: rgb(70, 70, 70);\r\n    --ship-color: rgb(150, 150, 150);\r\n    --hit-color: rgb(206, 169, 134);\r\n    --miss-color: rgb(161, 216, 161);\r\n    --sunk-color: rgb(206, 134, 134);\r\n    --text-color-main: rgb(40, 40, 40);\r\n    --text-color-grey: rgb(100, 100, 100);\r\n    --button-color: rgb(210, 210, 210);\r\n    --button-color-hover: rgb(230, 230, 230);\r\n    --button-color-active: grey;\r\n}\r\n:root.dark {\r\n    --background-color: rgb(30, 30, 30);\r\n    --background-color-transparent: rgba(30, 30, 30, 0.7);\r\n    --cell-color: rgb(40, 40, 40);\r\n    --cell-hover-color: rgb(90, 90, 90);\r\n    --cell-border-color: rgb(220, 220, 220);\r\n    --ship-color: rgb(153, 153, 153);\r\n    --hit-color: rgb(155, 99, 61);\r\n    --miss-color: rgb(52, 109, 52);\r\n    --sunk-color: rgb(155, 61, 61);\r\n    --text-color-main: rgb(220, 220, 220);\r\n    --text-color-grey: rgb(160, 160, 160);\r\n    --button-color: rgb(50, 50, 50);\r\n    --button-color-hover: rgb(20, 20, 20);\r\n    --button-color-active: grey;\r\n}\r\n\r\n*,\r\n*::before,\r\n*::after {\r\n    box-sizing: border-box;\r\n}\r\n/* contents */\r\nbody {\r\n    margin: 0;\r\n    padding: 0;\r\n    background-color:var(--background-color);\r\n    font-family: 'Raleway', sans-serif;\r\n    color:var(--text-color-main);\r\n}\r\n\r\n#app {\r\n    padding: 0 5%;\r\n    min-height: 100vh;\r\n    display:flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n    overflow: hidden;\r\n}\r\nh3{\r\n    margin:0;\r\n}\r\n/* header */\r\nheader {\r\n    display:flex;\r\n    justify-content: space-between ;\r\n    align-items:center;\r\n    width:675px;\r\n}\r\n\r\nheader button{\r\n    height:32px;\r\n    width: 120px;\r\n    font-size:1rem;\r\n    padding-bottom:2px;\r\n}\r\n\r\nbutton {\r\n    font-family: 'Fira Code', monospace;\r\n    color:var(--text-color-main);\r\n    display:flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    border: 1px solid var(--text-color-main);\r\n    border-radius: 3px;\r\n    background-color: var(--button-color);\r\n}\r\nbutton:active{\r\n    background-color: var(--button-color-active);\r\n    scale:0.95;\r\n}\r\n\r\n@media (hover:hover){\r\n    button:hover {\r\n        cursor:pointer;\r\n        border-width: 2px;\r\n        background-color:var(--button-color-hover)\r\n    }\r\n}\r\n\r\n/* game container */\r\n\r\n#game-container {\r\n    display:flex;\r\n    justify-content: center;\r\n    align-content: center;\r\n    flex-wrap:wrap;\r\n    gap:40px;\r\n}\r\n/* player setup */\r\n.setup-ships-container {\r\n    display:flex;\r\n    flex-direction:column;\r\n    justify-content: space-between;\r\n    width: var(--board-size);\r\n    height: calc(var(--board-size)+25px);\r\n    text-align: right;\r\n\r\n}\r\n.setup-ships-header p {\r\n    margin: 0;\r\n    font-size: 0.8rem;\r\n}\r\n.setup-ship-shiplist {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content:center;\r\n}\r\n.setup-ship{\r\n    height: 40px;\r\n    position: relative;\r\n    display:flex;\r\n    flex-direction: row-reverse;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n.setup-ship p{\r\n    margin: 0;\r\n    display:inline-block;\r\n}\r\n\r\n.setup-ship-box{\r\n    cursor:grab;\r\n    display:inline-flex;\r\n    gap:2px;\r\n    position: relative;\r\n    z-index:20;\r\n}\r\n.setup-ship-vertical{\r\n    flex-direction: column;\r\n}\r\n.setup-ship-hide div{\r\n    background-color: rgba(0,0,0,0);\r\n    opacity: 0.5;\r\n}\r\n.setup-ship-dropped{\r\n    position: absolute;\r\n    left: -1px;\r\n    top: -1px;\r\n}\r\n\r\n.ghost-ship{\r\n    position: absolute;\r\n    z-index: 200;\r\n    opacity: 0.8;\r\n}\r\n.ghost-ship> .setup-ship-cell{\r\n    background-color: var(--cell-hover-color);\r\n}\r\n\r\n.setup-ship-cell {\r\n    width: var(--cell-size);\r\n    height:var(--cell-size);\r\n    background-color: var(--cell-hover-color);\r\n    border: 1px solid var(--cell-border-color);\r\n}\r\n\r\n.setup-ships-options{\r\n    display:flex;\r\n    justify-content: space-between;\r\n}\r\n\r\n.start-game-button,\r\n.setup-button-random {\r\n    width: 120px;\r\n    height:36px;\r\n}\r\n.start-game-button{\r\n    font-weight:600;\r\n    font-size:1rem;\r\n    background-color:var(--hit-color);\r\n    transition: transform 0.1s ease;\r\n}\r\n.start-game-button-disabled{\r\n    opacity: 0.5;\r\n    pointer-events: none;\r\n}\r\n@media(hover: hover){\r\n    .setup-button-start:hover{\r\n        transform:scale(1.1);\r\n        background-color:rgb(226,116,116);\r\n    }\r\n}\r\n\r\n/* player sections */\r\n\r\n.board-container {\r\n    display:inline-block;\r\n}\r\n\r\n/* player board */\r\n.board{\r\n    display:grid;\r\n    grid-template-columns: repeat(10,1fr);\r\n    grid-template-rows: repeat(10,1fr);\r\n    gap:2px;\r\n}\r\n\r\n.cell {\r\n    position: relative;\r\n    cursor: crosshair;\r\n    height:var(--cell-size);\r\n    width: var(--cell-size);\r\n    display:flex;\r\n    justify-content: center;\r\n    align-content:center;\r\n    background-color: var(--cell-color);\r\n    border: 1px solid var(--cell-border-color);\r\n}\r\n\r\n.cell-setup{\r\n    display:inline-block;\r\n}\r\n.cell-drag-over{\r\n    pointer-events: none;\r\n    position: absolute;\r\n    display:inline-block;\r\n    z-index:40;\r\n}\r\n\r\n.cell-drag-valid{\r\n    background-color:var(--miss-color);\r\n}\r\n.cell-drag-invalid{\r\n    background-color:var(--hit-color);\r\n}\r\n\r\n@media(hover: hover){\r\n    .cell:not([data-player='1']):not(.cell-hit):not(.cell-miss):hover{\r\n        background-color:var(--cell-hover-color);\r\n    }\r\n}\r\n\r\n.cell-ship{\r\n    background-color:var(--ship-color);\r\n}\r\n\r\n.cell-hit{\r\n    background-color:var(--hit-color);\r\n}\r\n.cell-hit::after{\r\n    content:'X';\r\n    opacity:0.8;\r\n    font-size: 1.3rem;\r\n    padding-bottom: 1px;\r\n}\r\n.cell-miss{\r\n    background-color:var(--miss-color);\r\n}\r\n\r\n.cell-miss::after{\r\n    content:\"O\";\r\n    opacity:0.6;\r\n    padding-bottom: 4px;\r\n}\r\n\r\n.cell-sunk{\r\n    background-color: var(--sunk-color);\r\n    transition: background-color 0.2s ease;\r\n}\r\n\r\n/* footer */\r\nfooter{\r\n    display:flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    text-align:center;\r\n    gap:16px;\r\n    padding:0 32px;\r\n}\r\n\r\n#footer-link{\r\n    text-decoration: none;\r\n}\r\nfooter p{\r\n    font-weight: 600;\r\n    font-size: 1.1rem;\r\n}\r\nfooter i{\r\n    color:var(--text-color-main);\r\n}\r\n@media(hover: hover){\r\n    #footer-link:hover{\r\n        cursor:pointer;\r\n        transform: scale(1.2);\r\n        transition: transform 0.1s ease;\r\n    }\r\n}\r\n\r\n/* Victory Container */\r\n.victory-container{\r\n    position: absolute;\r\n    left: 50%;\r\n    top: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 318px;\r\n    text-align: center;\r\n    padding: 20px;\r\n    border: 3px solid var(--text-color-main);\r\n    background-color: var(--background-color-transparent);\r\n    backdrop-filter: blur(4px);\r\n}\r\n.victory-container h2 {\r\n    margin: 0;\r\n    text-shadow: 0 0 2px black, 0 0 4px black, 0 0 6px black;\r\n}\r\n\r\n.victory-container p {\r\n    margin: 6px;\r\n}\r\n\r\n.victory-victory {\r\n    color: var(--miss-color);\r\n}\r\n\r\n.victory-defeat {\r\n    color: var(--sunk-color);\r\n}\r\n\r\n\r\n@media screen and (max-width: 800px) {\r\n    :root {\r\n        --header-height: 80px;\r\n        --board-size: 278px;\r\n        --cell-size: 26px;\r\n    }\r\n    header{\r\n        width:400px;\r\n    }\r\n\r\n    header button {\r\n        height: 28px;\r\n        width: 100px;\r\n        font-size: 0.9rem;\r\n        padding-bottom: 2px;\r\n    }\r\n\r\n    #game-container {\r\n        gap: 20px;\r\n    }\r\n\r\n    .start-game-button,\r\n    .setup-button-random {\r\n        width: 100px;\r\n        height: 28px;\r\n    }\r\n\r\n    .setup-button-start {\r\n        font-size: 0.9rem;\r\n    }\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _modules_DOM_Controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/DOM/Controller */ "./src/modules/DOM/Controller.js");


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsT0FBTyxxRkFBcUYsS0FBSyxZQUFZLGFBQWEsY0FBYyxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsTUFBTSxLQUFLLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLE9BQU8sWUFBWSxNQUFNLFVBQVUsS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsTUFBTSxLQUFLLFVBQVUsS0FBSyxVQUFVLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sS0FBSyxZQUFZLFdBQVcsTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLE1BQU0sS0FBSyxNQUFNLGFBQWEsTUFBTSxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsS0FBSyxZQUFZLE1BQU0sVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLGNBQWMsTUFBTSxLQUFLLFVBQVUsWUFBWSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsTUFBTSxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksV0FBVyxLQUFLLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxZQUFZLFdBQVcsVUFBVSxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLE1BQU0sVUFBVSxVQUFVLEtBQUssS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLE1BQU0sS0FBSyxVQUFVLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE1BQU0sTUFBTSxhQUFhLE1BQU0sWUFBWSxPQUFPLFlBQVksTUFBTSxVQUFVLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssS0FBSyxZQUFZLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxVQUFVLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsT0FBTyxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksYUFBYSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksYUFBYSxNQUFNLE1BQU0sWUFBWSxNQUFNLFlBQVksV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxRQUFRLEtB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7OztBQ0FvQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ET00vQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvRE9NL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvRE9NL2hlYWRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvRE9NL3NoaXBQbGFjZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2JvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9lbmVteUxvZ2ljLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXBUeXBlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdhbWUgZnJvbSAnLi4vZ2FtZSc7XHJcbmltcG9ydCBjcmVhdGVIZWFkZXIgZnJvbSAnLi9oZWFkZXInO1xyXG5pbXBvcnQgY3JlYXRlRm9vdGVyIGZyb20gJy4vZm9vdGVyJztcclxuaW1wb3J0IHNldHVwIGZyb20gJy4vc2hpcFBsYWNlcic7XHJcblxyXG5jb25zdCBhcHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuYXBwLmlkID0gJ2FwcCc7XHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYXBwKTtcclxuY29uc3QgaGVhZGVyID0gY3JlYXRlSGVhZGVyKCk7XHJcbmNvbnN0IGZvb3RlciA9IGNyZWF0ZUZvb3RlcigpO1xyXG5jb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbmdhbWVDb250YWluZXIuaWQgPSAnZ2FtZS1jb250YWluZXInO1xyXG5hcHAuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcclxuYXBwLmFwcGVuZENoaWxkKGdhbWVDb250YWluZXIpO1xyXG5hcHAuYXBwZW5kQ2hpbGQoZm9vdGVyKTtcclxuXHJcbmNvbnN0IG5ld0dhbWVCdXR0b24gPSBoZWFkZXIucXVlcnlTZWxlY3RvcignLm5ldy1nYW1lLWJ1dHRvbicpO1xyXG5uZXdHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxuZXdHYW1lKTtcclxuY29uc3QgZ2FtZSA9IEdhbWUoKTtcclxubmV3R2FtZSgpO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRHYW1lKHBsYXllcjEsIHBsYXllcjIpe1xyXG4gICAgZ2FtZS5uZXdHYW1lKHBsYXllcjEsIHBsYXllcjIpO1xyXG4gICAgZHJhd0dhbWUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV3R2FtZSgpe1xyXG4gICAgY29uc3QgbmV3UGxheWVyMSA9IGdhbWUuQ3JlYXRlUGxheWVyKCdKb2huJywgMSk7XHJcbiAgICBjb25zdCBuZXdQbGF5ZXIyID0gZ2FtZS5DcmVhdGVQbGF5ZXIoZmFsc2UsIDIpO1xyXG4gICAgbmV3UGxheWVyMi5nYW1lYm9hcmQucGxhY2VTaGlwc1JhbmRvbWx5KCk7XHJcbiAgICBkcmF3U2V0dXAobmV3UGxheWVyMSk7XHJcbiAgICBjb25zdCBzdGFydEdhbWVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dXAtYnV0dG9uLXN0YXJ0Jyk7XHJcbiAgICBzdGFydEdhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xyXG4gICAgICAgIGlmKG5ld1BsYXllcjEuZ2FtZWJvYXJkLnBsYWNlZFNoaXBzLmxlbmd0aCA9PT0gNSl7XHJcbiAgICAgICAgICAgIHN0YXJ0R2FtZShuZXdQbGF5ZXIxLCBuZXdQbGF5ZXIyKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJDb250YWluZXIoY29udGFpbmVyKXtcclxuICAgIHdoaWxlKGNvbnRhaW5lci5maXJzdENoaWxkKSBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xyXG59XHJcbmZ1bmN0aW9uIGRyYXdHYW1lKCl7XHJcbiAgICBjbGVhckNvbnRhaW5lcihnYW1lQ29udGFpbmVyKTtcclxuICAgIGNvbnN0IHBsYXllcjFCb2FyZENvbnRhaW5lciA9IGRyYXdCb2FyZENvbnRhaW5lcihnYW1lLnBsYXllcjEpO1xyXG4gICAgY29uc3QgcGxheWVyMkJvYXJkQ29udGFpbmVyID0gZHJhd0JvYXJkQ29udGFpbmVyKGdhbWUucGxheWVyMik7XHJcbiAgICBwb3B1bGF0ZUJvYXJkKGdhbWUucGxheWVyMSwgcGxheWVyMUJvYXJkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZCcpKTtcclxuICAgIGdhbWVDb250YWluZXIuYXBwZW5kKHBsYXllcjFCb2FyZENvbnRhaW5lciwgcGxheWVyMkJvYXJkQ29udGFpbmVyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1NldHVwKHBsYXllcil7XHJcbiAgICBjbGVhckNvbnRhaW5lcihnYW1lQ29udGFpbmVyKTtcclxuICAgIGNvbnN0IHNldHVwQm9hcmQgPSBzZXR1cC5kcmF3U2V0dXBCb2FyZChwbGF5ZXIsIGRyYXdCb2FyZENvbnRhaW5lcihwbGF5ZXIpKTtcclxuICAgIGNvbnN0IHNldHVwU2hpcHMgPSBzZXR1cC5kcmF3U2V0dXBTaGlwcygpO1xyXG4gICAgY29uc3Qgc2hpcHMgPSBzZXR1cFNoaXBzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXR1cC1zaGlwLWJveCcpO1xyXG4gICAgZ2FtZUNvbnRhaW5lci5hcHBlbmQoc2V0dXBCb2FyZCwgc2V0dXBTaGlwcyk7XHJcbn1cclxuXHJcbi8vIElmIHRoZSBnYW1lIGNvbnRhaW5lciBoZWlnaHQgaWYgb3ZlciA1MDBweCwgd2UgY2FuIHNlZSB0aGUgZmxleGJveCBpcyB3cmFwcGVkXHJcbi8vIFdlIHRoZW4gYWRqdXN0IHRoZSBoZWFkZXIgdG8gbWF0Y2ggdGhlIHdpZHRoIG9mIHRoZSBnYW1lIGJvYXJkcyAtIGluc3RlYWQgb2YgYmVpbmcgMTAwJSB3aWRlXHJcbmNvbnN0IGdhbWVTaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoZW50cnkgPT4ge1xyXG4gICAgaWYoZW50cnlbMF0uY29udGVudFJlY3QuaGVpZ2h0PjUwMCkgXHJcbiAgICAgICAgaGVhZGVyLnN0eWxlLndpZHRoID0gJzMyMHB4JztcclxuICAgIGVsc2UgXHJcbiAgICAgICAgaGVhZGVyLnN0eWxlLndpZHRoID0gYCR7ZW50cnlbMF0uY29udGVudFJlY3Qud2lkdGh9cHhgO1xyXG59KVxyXG5nYW1lU2l6ZU9ic2VydmVyLm9ic2VydmUoZ2FtZUNvbnRhaW5lcik7XHJcblxyXG4vL2hvbGQgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBwbGF5ZXIncyBib2FyZCAtIG5hbWUgLCBib2FyZCBhbmQgc2hpcHMgbGVmdFxyXG5cclxuZnVuY3Rpb24gZHJhd0JvYXJkQ29udGFpbmVyKHBsYXllcil7XHJcbiAgICBjb25zdCBib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgYm9hcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYm9hcmQtY29udGFpbmVyJyk7XHJcbiAgICBjb25zdCBwbGF5ZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcclxuICAgIGlmKHBsYXllci5pc0FJKSBwbGF5ZXJOYW1lLnRleHRDb250ZW50ID0gYCR7cGxheWVyLm5hbWV9J3MgZmxlZXRgO1xyXG4gICAgZWxzZSBwbGF5ZXJOYW1lLnRleHRDb250ZW50ID0gYFlvdXIgRmxlZXRgO1xyXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkcmF3Qm9hcmQocGxheWVyKTtcclxuICAgIGJvYXJkQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJOYW1lLCBwbGF5ZXJCb2FyZCk7XHJcbiAgICByZXR1cm4gYm9hcmRDb250YWluZXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdCb2FyZChwbGF5ZXIpe1xyXG4gICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGJvYXJkLmNsYXNzTGlzdC5hZGQoJ2JvYXJkJyk7XHJcbiAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IDEwIDsgcm93Kyspe1xyXG4gICAgICAgIGZvcihsZXQgY29sID0gMCA7IGNvbCA8IDEwIDsgY29sKyspe1xyXG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xyXG4gICAgICAgICAgICBjZWxsLmRhdGFzZXQucGxheWVyID0gcGxheWVyID8gcGxheWVyLm51bWJlcjogMDtcclxuICAgICAgICAgICAgY2VsbC5kYXRhc2V0LnJvdyA9IHJvdztcclxuICAgICAgICAgICAgY2VsbC5kYXRhc2V0LmNvbCA9IGNvbDtcclxuICAgICAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgICAgICAgICAgIGlmKHBsYXllci5pc0FJICYmIHBsYXllcikgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxpc3RlbkZvckF0dGFjaywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBib2FyZDtcclxufVxyXG5cclxuZnVuY3Rpb24gcG9wdWxhdGVCb2FyZChwbGF5ZXIsYm9hcmQpe1xyXG4gICAgZm9yKGxldCByb3cgPSAwIDsgcm93IDwgMTAgOyByb3crKyl7XHJcbiAgICAgICAgZm9yKGxldCBjb2wgPSAwIDsgY29sIDwgMTAgOyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IHBsYXllci5nYW1lYm9hcmQuYm9hcmRbcm93XVtjb2xdO1xyXG4gICAgICAgICAgICBjb25zdCBjZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihgW2RhdGEtcm93PVwiJHtyb3d9XCJdW2RhdGEtY29sPVwiJHtjb2x9XWApO1xyXG4gICAgICAgICAgICBpZihzcXVhcmUhPT0gbnVsbCAmJiB0eXBlb2Ygc3F1YXJlID09PSAnb2JqZWN0JylcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbC1zaGlwJyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnY2VsbC1zaGlwJyk7XHJcbiAgICAgICAgfSAgIFxyXG4gICAgfVxyXG59XHJcblxyXG4vLyB1cG9uIGNsaWNraW5nIGEgY2VsbCAsIGF0dGFjayB0aGUgcmVsZXZhbnQgc3F1YXJlICwgaWYgYWxsb3dlZCBcclxuLy8gcGFzcyB0aGUgaW5mb3JtYXRpb24gZnJvbSB0aGUgYXR0YWNrIHRvIHRoZSBzdHlsZSBhdHRhY2tlZCBjZWxsIGZ1bmN0aW9uICBcclxuXHJcbmZ1bmN0aW9uIGxpc3RlbkZvckF0dGFjayhldmVudCl7XHJcbiAgICBjb25zdCBjZWxsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgY29uc3QgZGVmZW5kaW5nUGxheWVyTnVtYmVyID1jZWxsLmRhdGFzZXQucGxheWVyO1xyXG4gICAgY29uc3QgYXR0YWNraW5nUGxheWVyTnVtYmVyID0gZGVmZW5kaW5nUGxheWVyTnVtYmVyID09PSAnMSc/ICcyJzogJzEnO1xyXG4gICAgY29uc3QgYXR0YWNraW5nUGxheWVyID0gZ2FtZVtgcGxheWVyJHthdHRhY2tpbmdQbGF5ZXJOdW1iZXJ9YF07XHJcbiAgICBjb25zdCBkZWZlbmRpbmdQbGF5ZXIgPSBnYW1lW2BwbGF5ZXIke2RlZmVuZGluZ1BsYXllck51bWJlcn1gXTtcclxuICAgIGlmKGdhbWUuY3VycmVudFBsYXllciAhPT0gYXR0YWNraW5nUGxheWVyKSByZXR1cm47XHJcbiAgICBjb25zdCByb3cgPSBjZWxsLmRhdGFzZXQucm93O1xyXG4gICAgY29uc3QgY29sID0gY2VsbC5kYXRhc2V0LmNvbDtcclxuICAgIGNvbnN0IFtyZXN1bHQsIGxvY2F0aW9uICwgc2hpcF0gPSBhdHRhY2tpbmdQbGF5ZXIuYXR0YWNrKGRlZmVuZGluZ1BsYXllciwgcm93LCBjb2wpO1xyXG4gICAgc3R5bGVBdHRhY2tlZENlbGwoY2VsbCwgZGVmZW5kaW5nUGxheWVyTnVtYmVyLCByZXN1bHQgLCBzaGlwKTtcclxuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snICwgbGlzdGVuRm9yQXR0YWNrLCBmYWxzZSk7XHJcbiAgICBuZXh0VHVybigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxsQUlBdHRhY2soQUkpe1xyXG5pZihBSSAhPT0gZ2FtZS5jdXJyZW50UGxheWVyKXJldHVybiA7XHJcbmNvbnN0IGRlZmVuZGluZ1BsYXllck51bWJlciA9IGdhbWUuZGVmZW5kaW5nUGxheWVyPT09IGdhbWUucGxheWVyMSA/JzEnOicyJztcclxuY29uc3QgW3Jlc3VsdCAsIGxvY2F0aW9uICwgc2hpcF09IEFJLmF0dGFjayhnYW1lLmRlZmVuZGluZ1BsYXllcik7XHJcbmNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1wbGF5ZXI9JyR7ZGVmZW5kaW5nUGxheWVyTnVtYmVyfV1bZGF0YS1yb3c9JyR7bG9jYXRpb25bMF19J11bZGF0YS1jb2w9JyR7bG9jYXRpb25bMV19J11gKVxyXG5zdHlsZUF0dGFja2VkQ2VsbChjZWxsLCBkZWZlbmRpbmdQbGF5ZXJOdW1iZXIsIHJlc3VsdCwgc2hpcCk7XHJcbm5leHRUdXJuKCk7XHJcbn1cclxuXHJcbi8vU3R5bGUgYXR0YWNrZWQgY2VsbCBiYXNlZCBvbiBpZiBpdCB3YXMgaGl0IG9yIG1pc3MgXHJcbi8vSWYgdGhlIHNoaXAgaXMgc3VuayAsIHN0eWxlIGVhY2ggb2YgdGhlIHNoaXAgY2VsbHMgd2l0aCB0aGUgLmNlbGwtc3VuayBjbGFzc1xyXG5mdW5jdGlvbiBzdHlsZUF0dGFja2VkQ2VsbChjZWxsLCBkZWZlbmRpbmdQbGF5ZXJOdW1iZXIsIHJlc3VsdCAsIHNoaXApIHtcclxuICAgIGlmKHJlc3VsdCA9PT0gJ2hpdCcpe1xyXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbC1oaXQnKTtcclxuICAgICAgICBpZihzaGlwLmlzU3VuaygpKXtcclxuICAgICAgICAgICAgc2hpcC5zcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1wbGF5ZXI9JyR7ZGVmZW5kaW5nUGxheWVyTnVtYmVyfSddW2RhdGEtcm93PScke3NxdWFyZVswXX0nfV1bZGF0YS1jb2w9JyR7c3F1YXJlWzFdfSddYClcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbC1zdW5rJylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihyZXN1bHQ9PT0nbWlzcycpIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbC1taXNzJyk7XHJcbn1cclxuXHJcbi8vIEhhbmRsZSBuZXh0IHR1cm4gXHJcbmZ1bmN0aW9uIG5leHRUdXJuKCkge1xyXG4gICAgY29uc3Qgd2lubmVyID0gZ2FtZS5jaGVja0dhbWVPdmVyKCk7XHJcbiAgICBpZih3aW5uZXIpe1xyXG4gICAgICAgIHJldHVybiBlbmRHYW1lKHdpbm5lcik7XHJcbiAgICB9XHJcbiAgICBnYW1lLnN3aXRjaFR1cm4oKTtcclxuICAgIGlmKGdhbWUuY3VycmVudFBsYXllci5pc0FJKXtcclxuICAgICAgICBjYWxsQUlBdHRhY2soZ2FtZS5jdXJyZW50UGxheWVyKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZW5kR2FtZSh3aW5uZXIpe1xyXG4gICAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbCcpO1xyXG4gICAgY2VsbHMuZm9yRWFjaChjZWxsID0+IGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5Gb3JBdHRhY2ssIGZhbHNlKSk7XHJcbiAgICBnYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGRyYXdWaWN0b3J5Q29udGFpbmVyKHdpbm5lcikpO1xyXG59XHJcblxyXG4vL2RyYXcgYSBwb3B1cCB3aW5kb3cgd2l0aCB0aGUgd2lubmVycyBuYW1lXHJcblxyXG5mdW5jdGlvbiBkcmF3VmljdG9yeUNvbnRhaW5lcih3aW5uZXIpe1xyXG4gICAgY29uc3QgbG9zZXIgPSBnYW1lLmNoZWNrR2FtZU92ZXIgKCkgPT09IGdhbWUucGxheWVyMSA/IGdhbWUucGxheWVyMiA6IGdhbWUucGxheWVyMTtcclxuICAgIGNvbnN0IHZpY3RvcnlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZpY3RvcnlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgndmljdG9yeS1jb250YWluZXInKTtcclxuICAgIGNvbnN0IHZpY3RvcnlUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XHJcbiAgICBjb25zdCB3aW5uZXJUZXh0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICBjb25zdCBsb3NlclRleHQgPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIGlmKHdpbm5lci5pc0FJKXtcclxuICAgICAgICB2aWN0b3J5VGl0bGUuY2xhc3NMaXN0LmFkZCgndmljdG9yeS1kZWZlYXQnKTtcclxuICAgICAgICB2aWN0b3J5VGl0bGUudGV4dENvbnRlbnQgPSAnRGVmZWF0ZWQnO1xyXG4gICAgICAgIHdpbm5lclRleHQudGV4dENvbnRlbnQgPSBgJHt3aW5uZXIubmFtZX0gaGFzIGNsYWltZWQgdmljdG9yeWA7XHJcbiAgICAgICAgbG9zZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdXIgRmxlZXQgSXMgU3Vua2A7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZpY3RvcnlUaXRsZS5jbGFzc0xpc3QuYWRkKCd2aWN0b3J5LXZpY3RvcnknKTtcclxuICAgICAgICB2aWN0b3J5VGl0bGUudGV4dENvbnRlbnQgPSBcIllvdSBXb25cIjtcclxuICAgICAgICB3aW5uZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdSBIYXZlIENsYWltZWQgVmljdG9yeWA7XHJcbiAgICAgICAgbG9zZXJUZXh0LnRleHRDb250ZW50ID0gYCR7bG9zZXIubmFtZX0ncyBmbGVldCBzdW5rYDtcclxuICAgIH1cclxuICAgIHZpY3RvcnlDb250YWluZXIuYXBwZW5kKHZpY3RvcnlUaXRsZSwgd2lubmVyVGV4dCwgbG9zZXJUZXh0KTtcclxuICAgIHJldHVybiB2aWN0b3J5Q29udGFpbmVyO1xyXG59XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZUZvb3RlcigpIHtcclxuICAgIGNvbnN0IGZvb3RlckJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpO1xyXG4gICAgY29uc3QgYXV0aG9yTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIGF1dGhvck5hbWUuY2xhc3NMaXN0LmFkZCgnZm9vdGVyLWF1dGhvcicpO1xyXG4gICAgYXV0aG9yTmFtZS50ZXh0Q29udGVudCA9ICdTYWNoaW4gS3VtYXIgU2luZ2gnO1xyXG4gICAgY29uc3QgZm9vdGVyTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGZvb3RlckxpbmsuaWQ9J2Zvb3Rlci1saW5rJztcclxuICAgIGZvb3Rlckxpbmsuc2V0QXR0cmlidXRlKCdocmVmJyxcImh0dHBzOi8vZ2l0aHViLmNvbS9qZXQtYmxhY2stbmluamEvQmF0dGxlLXNoaXAvdHJlZS9tYWluXCIpO1xyXG4gICAgY29uc3QgZ2l0aHViTG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgIGdpdGh1YkxvZ28uY2xhc3NMaXN0LmFkZChcImZhLWJyYW5kc1wiLFwiZmEtZ2l0aHViXCIsXCJmYS14bFwiLFwiZm9vdGVyLWxvZ29cIik7XHJcbiAgICBmb290ZXJMaW5rLmFwcGVuZENoaWxkKGdpdGh1YkxvZ28pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFRoZW1lKCl7XHJcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRGFya1RoZW1lKCl7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCc6cm9vdCcpLmNsYXNzTGlzdC50b2dnbGUoJ2RhcmsnKTtcclxuICAgIGRhcmtNb2RlQnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJmYS1tb29uXCIpO1xyXG4gICAgZGFya01vZGVCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImZhLXN1blwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVEYXJrU3RvcmFnZSgpIHtcclxuICAgICAgICBpZihnZXRUaGVtZSgpID09PSAnZGFyaycpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsJ2xpZ2h0Jyk7XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywnZGFyaycpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrRGFya01vZGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgd2luZG93Lm1hdGNoTWVkaWEgJiYgXHJcbiAgICAgICAgd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzXHJcbiAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBkYXJrTW9kZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgIGRhcmtNb2RlQnV0dG9uLmlkID0gJ2Zvb3Rlci1kYXJrLW1vZGUnO1xyXG4gICAgZGFya01vZGVCdXR0b24uY2xhc3NMaXN0LmFkZChcImZhLXNvbGlkXCIsXCJmYS1tb29uXCIsXCJmYS14bFwiKTtcclxuICAgIGRhcmtNb2RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdG9nZ2xlRGFya1RoZW1lKCk7XHJcbiAgICAgICAgdG9nZ2xlRGFya1N0b3JhZ2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmKGdldFRoZW1lKCkgPT09ICdkYXJrJyB8fCAoIWdldFRoZW1lKCkgJiYgY2hlY2tEYXJrTW9kZSgpKSkge1xyXG4gICAgICAgIHRvZ2dsZURhcmtUaGVtZSgpO1xyXG4gICAgfVxyXG4gICAgZm9vdGVyQm94LmFwcGVuZENoaWxkKGF1dGhvck5hbWUpO1xyXG4gICAgZm9vdGVyQm94LmFwcGVuZENoaWxkKGZvb3RlckxpbmspO1xyXG4gICAgZm9vdGVyQm94LmFwcGVuZENoaWxkKGRhcmtNb2RlQnV0dG9uKTtcclxuICAgIHJldHVybiBmb290ZXJCb3g7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZvb3RlciA7IiwiZnVuY3Rpb24gY3JlYXRlSGVhZGVyKCl7XHJcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoZWFkZXInKTtcclxuICAgIGhlYWRlci5pZCA9ICdoZWFkZXInO1xyXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xyXG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSAnQmF0dGxlc2hpcHMnO1xyXG4gICAgY29uc3QgbmV3R2FtZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgbmV3R2FtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCduZXctZ2FtZS1idXR0b24nKTtcclxuICAgIG5ld0dhbWVCdXR0b24udGV4dENvbnRlbnQgPSAnTmV3IEdhbWUnO1xyXG4gICAgaGVhZGVyLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuICAgIGhlYWRlci5hcHBlbmRDaGlsZChuZXdHYW1lQnV0dG9uKTtcclxuICAgIHJldHVybiBoZWFkZXI7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlSGVhZGVyOyIsImltcG9ydCBzaGlwVHlwZXMgZnJvbSAnLi4vc2hpcFR5cGVzJ1xyXG5sZXQgcGxheWVyIDtcclxubGV0IGJvYXJkO1xyXG5cclxuLy9hbiBvYmplY3QgdG8gaG9sZCB0aGUgZGF0YSBmb3IgdGhlIGRyYWcgbWV0aG9kIHRvIHVzZVxyXG5jb25zdCBkcmFnRGF0YSA9IHtcclxuICAgIHNoaXBPYmplY3QgOiBudWxsLFxyXG4gICAgc2hpcEVsZW1lbnQgOiBudWxsLFxyXG4gICAgb2Zmc2V0WCA6IG51bGwsXHJcbiAgICBvZmZzZXRZIDogbnVsbCxcclxuICAgIHJvd0RpZmYgOiBudWxsLFxyXG4gICAgY29sRGlmZiA6IG51bGwsIFxyXG4gICAgc2hpcEhvbWVDb250YWluZXIgOiBudWxsLFxyXG4gICAgcHJldkNvbnRhaW5lciA6IG51bGwsXHJcbiAgICBwcmV2Q2VsbCA6IG51bGwsXHJcbiAgICBjdXJyZW50Q2VsbCA6IG51bGxcclxufVxyXG5cclxuXHJcbi8vZHJhdyB0aGUgYm9hcmRcclxuZnVuY3Rpb24gZHJhd1NldHVwQm9hcmQoc2V0dXBQbGF5ZXIgLCBzZXR1cEJvYXJkKSB7XHJcbiAgICBwbGF5ZXIgPSBzZXR1cFBsYXllcjtcclxuICAgIGJvYXJkID0gc2V0dXBCb2FyZDtcclxuICAgIGNvbnN0IHNldHVwQ2VsbHMgPSBib2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbCcpO1xyXG4gICAgc2V0dXBDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xyXG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBkcmFnT3Zlcik7XHJcbiAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBkcmFnRW50ZXIpO1xyXG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZHJhZ0xlYXZlKTtcclxuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBkcm9wKTtcclxuICAgIH0pXHJcbiAgICByZXR1cm4gc2V0dXBCb2FyZDtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ1N0YXJ0KGV2ZW50KSB7XHJcbiAgICBpZihldmVudC50eXBlID09PSAndG91Y2hzdGFydCcpIHtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudCA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIGRyYWdEYXRhLnNoaXBIb21lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuaWR9LWhvbWVgKTtcclxuICAgICAgICBkcmFnRGF0YS5wcmV2Q29udGFpbmVyID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHJhZ0RhdGEuc2hpcEVsZW1lbnQgPSBldmVudC50YXJnZXQgO1xyXG4gICAgICAgIGRyYWdEYXRhLnNoaXBIb21lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZXZlbnQudGFyZ2V0LmlkfS1ob21lYCk7XHJcbiAgICAgICAgZHJhZ0RhdGEucHJldkNvbnRhaW5lciA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxEaWZmKGV2ZW50KTtcclxuICAgIGlmKGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50ID09PSAndmVydGljYWwnKSBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwVmVydGljYWwnKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwLWhpZGUnKTtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLWRyb3BwZWQnKTtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLXZlcnRpY2FsJyk7XHJcbiAgICAgICAgZHJhZ0RhdGEuc2hpcEhvbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZHJhZ0RhdGEuc2hpcEVsZW1lbnQpO1xyXG5cclxuICAgIH0sMCk7XHJcbiAgICBpZihkcmFnRGF0YS5wcmV2Q29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKXtcclxuICAgICAgICBjb25zdCBjZWxsID0gZHJhZ0RhdGEucHJldkNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCByb3cgPSBwYXJzZUludChjZWxsLmRhdGFzZXQucm93KTtcclxuICAgICAgICBjb25zdCBjb2wgPSBwYXJzZUludChjZWxsLmRhdGFzZXQuY29sKTtcclxuICAgICAgICBwbGF5ZXIuZ2FtZUJvYXJkLnJlbW92ZVNoaXAoW3Jvdyxjb2xdKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ0VuZChldmVudCl7XHJcbiAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLWhpZGUnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ0VudGVyKGV2ZW50KSB7XHJcbiAgICBEcmFnRXZlbnQoZXZlbnQpO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHR5cGUgPSBkcmFnRGF0YS5zaGlwRWxlbWVudC5pZDtcclxuICAgIGxldCByb3c7XHJcbiAgICBsZXQgY29sO1xyXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gJ3RvdWNobW92ZScpe1xyXG4gICAgcm93ID0gcGFyc2VJbnQodG91Y2hDZWxsLmRhdGFzZXQucm93KSAtIHBhcnNlSW50KGRyYWdEYXRhLnJvd0RpZmYpO1xyXG4gICAgY29sID0gcGFyc2VJbnQodG91Y2hDZWxsLmRhdGFzZXQuY29sKSAtIHBhcnNlSW50KGRyYWdEYXRhLmNvbERpZmYpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByb3cgPSBwYXJzZUludChldmVudC50YXJnZXQuZGF0YXNldC5yb3cpIC0gcGFyc2VJbnQoZHJhZ0RhdGEucm93RGlmZik7XHJcbiAgICAgICAgY29sID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmRhdGFzZXQuY29sKSAtIHBhcnNlSW50KGRyYWdEYXRhLmNvbERpZmYpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNoaXBTcXVhcmVzID0gcGxheWVyLmdhbWVCb2FyZC5jaGVja1BsYWNlbWVudChzaGlwVHlwZXNbdHlwZV0ubGVuZ3RoICwgW3JvdywgY29sXSwgIGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50KTtcclxuICAgIHNoaXBTcXVhcmVzLnNxdWFyZXMgPSBzaGlwU3F1YXJlcy5zcXVhcmVzLmZpbHRlcihzcXVhcmUgPT4ge1xyXG4gICAgICAgIHJldHVybiBwbGF5ZXIuZ2FtZUJvYXJkLmNoZWNrU3F1YXJlKHNxdWFyZVswXSxzcXVhcmVbMV0pICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9KVxyXG5cclxuICAgIHNoaXBTcXVhcmVzLnNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1yb3c9JyR7c3F1YXJlWzBdfSddW2RhdGEtY29sJyR7c3F1YXJlWzFdfSddYCk7XHJcbiAgICAgICAgY29uc3QgY2VsbE92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjZWxsT3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdjZWxsJywnY2VsbC1kcmFnLW92ZXInKTtcclxuICAgICAgICBjZWxsLmFwcGVuZENoaWxkKGNlbGxPdmVybGF5KTtcclxuICAgICAgICBpZihzaGlwU3F1YXJlcy5pc1ZhbGlkKSBjZWxsT3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdjZWxsLWRyYWctdmFsaWQnKTtcclxuICAgICAgICBlbHNlIGNlbGxPdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2NlbGwtZHJhZy1pbnZhbGlkJyk7XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmFnT3ZlcihldmVudCl7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmFnTGVhdmUoZXZlbnQpe1xyXG4gICAgY29uc3QgbGVmdENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNlbGwtZHJhZy1vdmVyJyk7XHJcbiAgICBsZWZ0Q2VsbHMuZm9yRWFjaChjZWxsPT4ge1xyXG4gICAgICAgIGNlbGwucmVtb3ZlKCk7XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcm9wKGV2ZW50LCB0b3VjaENlbGwpe1xyXG4gICAgZHJhZ0xlYXZlKGV2ZW50KTtcclxuICAgIGxldCByb3c7XHJcbiAgICBsZXQgY29sO1xyXG4gICAgY29uc3QgdHlwZSA9IGRyYWdEYXRhLnNoaXBFbGVtZW50LmlkO1xyXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gdG91Y2hlZCl7XHJcbiAgICAgICAgcm93ID0gcGFyc2VJbnQodG91Y2hDZWxsLmRhdGFzZXQucm93KSAtIHBhcnNlSW50KGRyYWdEYXRhLnJvd0RpZmYpO1xyXG4gICAgICAgIGNvbCA9IHBhcnNlSW50KHRvdWNoQ2VsbC5kYXRhc2V0LmNvbCkgLSBwYXJzZUludChkcmFnRGF0YS5jb2xEaWZmKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm93ID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmRhdGFzZXQucm93KSAtIHBhcnNlSW50KGRyYWdEYXRhLnJvd0RpZmYpO1xyXG4gICAgICAgIGNvbCA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5kYXRhc2V0LmNvbCkgLSBwYXJzZUludChkcmFnRGF0YS5jb2xEaWZmKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzaGlwU3F1YXJlcyA9IHBsYXllci5nYW1lYm9hcmQuY2hlY2tQbGFjZW1lbnQoc2hpcFR5cGVzW3R5cGVdLmxlbmd0aCwgW3JvdywgY29sXSwgZHJhZ0RhdGEuc2hpcEVsZW1lbnQuZGF0YXNldC5hbGlnbm1lbnQpXHJcbiAgICBpZiAoc2hpcFNxdWFyZXMuaXNWYWxpZCkge1xyXG4gICAgICAgIGNvbnN0IG9yaWdpbkNlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1yb3c9JyR7cm93fSddW2RhdGEtY29sPScke2NvbH0nXWApO1xyXG4gICAgICAgIG9yaWdpbkNlbGwuYXBwZW5kQ2hpbGQoZHJhZ0RhdGEuc2hpcEVsZW1lbnQpO1xyXG4gICAgICAgIGRyYWdEYXRhLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXAtZHJvcHBlZCcpO1xyXG4gICAgICAgIGRyYWdEYXRhLnByZXZDb250YWluZXIgPSBvcmlnaW5DZWxsO1xyXG4gICAgICAgIHBsYXllci5nYW1lYm9hcmQucGxhY2VTaGlwKGRyYWdEYXRhLnNoaXBFbGVtZW50LmlkLCBbcm93LCBjb2xdLCBkcmFnRGF0YS5zaGlwRWxlbWVudC5kYXRhc2V0LmFsaWdubWVudCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChkcmFnRGF0YS5wcmV2Q29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKSB7XHJcbiAgICAgICAgICAgIGRyYWdEYXRhLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXAtZHJvcHBlZCcpO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2Um93ID0gZHJhZ0RhdGEucHJldkNvbnRhaW5lci5kYXRhc2V0LnJvdztcclxuICAgICAgICAgICAgY29uc3QgcHJldkNvbCA9IGRyYWdEYXRhLnByZXZDb250YWluZXIuZGF0YXNldC5jb2w7XHJcbiAgICAgICAgICAgIHBsYXllci5nYW1lYm9hcmQucGxhY2VTaGlwKGRyYWdEYXRhLnNoaXBFbGVtZW50LmlkLCBbcHJldlJvdywgcHJldkNvbF0sIGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50KVxyXG4gICAgICAgIH1cclxuICAgICAgICBkcmFnRGF0YS5wcmV2aW91c0NvbnRhaW5lci5hcHBlbmRDaGlsZChkcmFnRGF0YS5zaGlwRWxlbWVudClcclxuICAgIH1cclxuICAgIGRyYWdEYXRhLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NldHVwLXNoaXAtaGlkZScpO1xyXG4gICAgaWYgKGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50ID09PSAndmVydGljYWwnKSBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwLXZlcnRpY2FsJyk7XHJcbiAgICBlbHNlIGRyYWdEYXRhLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NldHVwLXNoaXAtdmVydGljYWwnKTtcclxufVxyXG5cclxuXHJcbi8vZHJhdyBzZXR1cCBzaGlwc1xyXG5mdW5jdGlvbiBkcmF3U2V0dXBTaGlwcygpIHtcclxuICAgIGNvbnN0IHNldHVwU2hpcENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgc2V0dXBTaGlwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXBzLWNvbnRhaW5lcicpO1xyXG4gICAgY29uc3Qgc2V0dXBTaGlwSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBzZXR1cFNoaXBIZWFkZXIuY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcHMtaGVhZGVyJyk7XHJcbiAgICBjb25zdCBzZXR1cFNoaXBUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XHJcbiAgICBzZXR1cFNoaXBUaXRsZS50ZXh0Q29udGVudD0nUGxhY2UgWW91ciBTaGlwcyc7XHJcbiAgICBjb25zdCBzZXR1cFNoaXBJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgc2V0dXBTaGlwSW5mby50ZXh0Q29udGVudCA9ICdEcmFnIGFuZCBkcm9wIHNoaXBzIG9udG8gdGhlIGJvYXJkLiBEb3VibGUgQ2xpY2sgYWZ0ZXIgcGxhY2luZyBTaGlwIHRvIHJvdGF0ZSc7XHJcbiAgICBjb25zdCBzZXR1cFNoaXBPcHRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBzZXR1cFNoaXBPcHRpb25zLmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXBzLW9wdGlvbnMnKTtcclxuICAgIGNvbnN0IHN0YXJ0R2FtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgc3RhcnRHYW1lLmNsYXNzTGlzdC5hZGQoJ3N0YXJ0LWdhbWUtYnV0dG9uJyk7XHJcbiAgICBzdGFydEdhbWUudGV4dENvbnRlbnQgPSAnU3RhcnQgR2FtZSc7XHJcbiAgICBjb25zdCByYW5kb21TaGlwcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgcmFuZG9tU2hpcHMuY2xhc3NMaXN0LmFkZCgnc2V0dXAtYnV0dG9uLXJhbmRvbScpXHJcbiAgICByYW5kb21TaGlwcy50ZXh0Q29udGVudCA9ICdSYW5kb21pemUgU2hpcHMnO1xyXG4gICAgcmFuZG9tU2hpcHMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLHJhbmRvbWl6ZUZsZWV0KTtcclxuICAgIHNldHVwU2hpcE9wdGlvbnMuYXBwZW5kKHN0YXJ0R2FtZSxyYW5kb21TaGlwcyk7XHJcbiAgICBjb25zdCBzaGlwTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZm9yIChsZXQgc2hpcCBpbiBzaGlwVHlwZXMpIHtcclxuICAgICAgICBzaGlwTGlzdC5hcHBlbmRDaGlsZChkcmF3U2hpcChzaGlwVHlwZXNbc2hpcF0pKTtcclxuICAgIH1cclxuICAgIHNldHVwU2hpcEhlYWRlci5hcHBlbmQoc2V0dXBTaGlwVGl0bGUsc2V0dXBTaGlwSW5mbyk7XHJcbiAgICBzZXR1cFNoaXBDb250YWluZXIuYXBwZW5kKHNldHVwU2hpcEhlYWRlciwgc2hpcExpc3QsIHNldHVwU2hpcE9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIHNldHVwU2hpcENvbnRhaW5lcjtcclxufVxyXG5cclxuLy9EcmF3IGEgc2hpcCB0byBiZSBkaXNwbGF5ZWQgYmFzZWQgb24gVGhlIHByb3ZpZGVkIElEIG9mIHRoZSBzaGlwIHR5cGUgXHJcbmZ1bmN0aW9uIGRyYXdTaGlwKHNoaXApIHtcclxuICAgIGNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHNoaXBDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcCcpO1xyXG4gICAgc2hpcENvbnRhaW5lci5pZCA9IGAke3NoaXAubmFtZX0taG9tZWA7XHJcbiAgICBjb25zdCBzaGlwQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBzaGlwQm94LmlkID0gc2hpcC5uYW1lO1xyXG4gICAgc2hpcEJveC5kYXRhc2V0Lmxlbmd0aCA9IHNoaXAubGVuZ3RoO1xyXG4gICAgc2hpcEJveC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwLWJveCcpO1xyXG4gICAgZm9yKGxldCBpID0gMCA7IGkgPCBzaGlwLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgICAgY29uc3Qgc2hpcENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBzaGlwQ2VsbC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwLWNlbGwnKTtcclxuICAgICAgICBzaGlwQm94LmFwcGVuZENoaWxkKHNoaXBDZWxsKTtcclxuICAgIH1cclxuICAgIHNoaXBCb3guZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgIHNoaXBCb3guZGF0YXNldC5hbGlnbm1lbnQgPSAnaG9yaXpvbnRhbCc7XHJcbiAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGRyYWdTdGFydCk7XHJcbiAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCBkcmFnRW5kKTtcclxuICAgIHNoaXBCb3guYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCByb3RhdGVTaGlwKTtcclxuXHJcbiAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgICBjb25zdCB5ID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoeCwgeSk7XHJcbiAgICAgICAgY29uc3QgdG91Y2hDZWxsID0gZWxlbWVudHMuZmlsdGVyKCBlbGVtZW50ID0+IGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykpO1xyXG4gICAgICAgIGlmKHRvdWNoQ2VsbCAubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIGRyYWdFbnRlcihldmVudCwgdG91Y2hDZWxsWzBdKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGRyYWdMZWF2ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKTtcclxuICAgICAgICBjb25zdCBwcmV2Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZ2hvc3Qtc2hpcCcpO1xyXG4gICAgICAgIGlmKHByZXZCb3gpIHByZXZCb3gucmVtb3ZlKCk7XHJcbiAgICAgICAgY29uc3QgbmV3Qm94ID0gc2hpcEJveC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgY29uc3QgdG91Y2hMb2NhdGlvbiA9IGV2ZW50LnRhcmdldFRvdWNoZXNbMF07XHJcbiAgICAgICAgaWYoZHJhZ0RhdGEuc2hpcEVsZW1lbnQuZGF0YXNldC5hbGlnbm1lbnQgPT09ICd2ZXJ0aWNhbCcpO1xyXG4gICAgICAgICAgICBuZXdCb3guY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcC12ZXJ0aWNhbCcpO1xyXG4gICAgICAgIG5ld0JveC5jbGFzc0xpc3QuYWRkKCdnaG9zdC1zaGlwJyk7XHJcbiAgICAgICAgbmV3Qm94LnN0eWxlLmxlZnQgPSBgJHt0b3VjaExvY2F0aW9uLnBhZ2VYIC0gZHJhZ0RhdGEub2Zmc2V0WH1weGA7XHJcbiAgICAgICAgbmV3Qm94LnN0eWxlLnRvcCA9IGAke3RvdWNoTG9jYXRpb24ucGFnZVkgLSBkcmFnRGF0YS5vZmZzZXRZfXB4YDtcclxuICAgICAgICBhcHAuYXBwZW5kQ2hpbGQobmV3Qm94KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNoaXBCb3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoZXZlbnQpe1xyXG4gICAgICAgIGNvbnN0IHByZXZCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2hvc3Qtc2hpcCcpO1xyXG4gICAgICAgIGlmKHByZXZCb3gpIHByZXZCb3gucmVtb3ZlKCk7XHJcbiAgICAgICAgZHJhZ0VuZChldmVudCk7XHJcbiAgICAgICAgY29uc3QgeCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgICAgY29uc3QgeSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludCh4LCB5KTtcclxuICAgICAgICBjb25zdCB0b3VjaENlbGwgPSBlbGVtZW50cy5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKTtcclxuICAgICAgICBpZih0b3VjaENlbGwubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIGRyb3AoZXZlbnQuIHRvdWNoQ2VsbFswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy9hZCBtb2JpbGUgdXNlcnMgY2FudCBkb3VibGUgdGFwICwgd2UgYWRkIHRpbWVyIGludG8gdGhlIHRvdWNoc3RhcnQgZXZlbnQgbGlzdGVuZXJcclxuICAgIHNoaXBCb3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGxldCB0aW1lID0gZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICAgICAgY29uc3QgdGFwSW50ZXJ2YWwgPSAyMDA7XHJcbiAgICAgICAgaWYoKHRpbWUgIC0gc2hpcEJveC5sYXN0Q2hpbGQpIDwgdGFwSW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgcm90YXRlU2hpcChldmVudCk7XHJcbiAgICAgICAgICAgIGRyYWdTdGFydChldmVudCk7XHJcbiAgICAgICAgfSBlbHNlICB7XHJcbiAgICAgICAgICAgIGRyYWdTdGFydChldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoaXBCb3gubGFzdENsaWNrID0gdGltZTtcclxuICAgIH0pO1xyXG4gICAgY29uc3Qgc2hpcE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICBpZihzaGlwLm5hbWUgPT09ICdwYXRyb2wnKSBcclxuICAgICAgICBzaGlwTmFtZS50ZXh0Q29udGVudCA9ICdQYXRyb2wgQm9hdCc7XHJcbiAgICBlbHNlIFxyXG4gICAgICAgIHNoaXBOYW1lLnRleHRDb250ZW50ID1zaGlwLm5hbWU7XHJcbiAgICBzaGlwQ29udGFpbmVyLmFwcGVuZChzaGlwTmFtZSwgc2hpcEJveCk7XHJcbiAgICByZXR1cm4gc2hpcENvbnRhaW5lcjtcclxufVxyXG5cclxuLy8gUGxhY2Ugc2hpcHMgcmFuZG9tbHkgb24gdGhlIHBsYXllcnMgYm9hcmRcclxuZnVuY3Rpb24gcmFuZG9taXplRmxlZXQoKXtcclxuICAgIHBsYXllci5nYW1lYm9hcmQucGxhY2VTaGlwc1JhbmRvbWx5KCk7XHJcbiAgICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlZFNoaXBzLmZvckVhY2goIHNoaXAgPT4ge1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBzaGlwLnR5cGU7IFxyXG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IHNoaXAuc3F1YXJlc1swXTtcclxuICAgICAgICBjb25zdCBhbGlnbm1lbnQgPSBzaGlwLmFsaWdubWVudDtcclxuICAgICAgICBjb25zdCBzaGlwRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3R5cGV9YCk7XHJcbiAgICAgICAgc2hpcEVsZW1lbnQuZGF0YXNldC5hbGlnbm1lbnQgPSBhbGlnbm1lbnQ7XHJcbiAgICAgICAgc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcC1kcm9wcGVkJyk7XHJcbiAgICAgICAgaWYoYWxpZ25tZW50ID09PSAndmVydGljYWwnKSBcclxuICAgICAgICAgICAgc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcC12ZXJ0aWNhbCcpO1xyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHNoaXBFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NldHVwLXNoaXAtdmVydGljYWwnKTtcclxuICAgICAgICBjb25zdCBbcm93LCBjb2xdID0gb3JpZ2luIDsgXHJcbiAgICAgICAgY29uc3QgY2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXJvdz1cIiR7cm93fVwiXVtkYXRhLWNvbD1cIiR7Y29sfVwiXWApO1xyXG4gICAgICAgIGNlbGwuYXBwZW5kQ2hpbGQoc2hpcEVsZW1lbnQpO1xyXG4gICAgfSk7XHJcbn1cclxuLy8gV2hlbiBhIHVzZXIgZ3JhYnMgYSBzaGlwIGVsZW1lbnQsIHdlIHRyYWNrIHRoZSB1c2VyJ3MgY3Vyc29yIGxvY2F0aW9uIGZvciB0aGUgZHJhZ0VudGVyIGFuZCBkcm9wIGV2ZW50c1xyXG4vLyBXaGVuIHRoZSBzaGlwIGlzIGdyYWJiZWQgZnJvbSB0aGUgY2VudGVyLCB0aGUgY3Vyc29yIGRvZXMgbm90IG1hdGNoIHVwIHdpdGggdGhlIHNoaXAncyBvcmlnaW4gY2VsbFxyXG4vLyBUaGUgY2VsbERpZiBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIG9yaWdpbiBjZWxsIHRvIHRoZSBjZWxsIHdoZXJlIHRoZSB1c2VyIGhhcyBncmFiYmVkIHRoZSBzaGlwIGVsZW1lbnRcclxuZnVuY3Rpb24gdXBkYXRlQ2VsbERpZmYoZXZlbnQpe1xyXG4gICAgbGV0IHg7IFxyXG4gICAgbGV0IHk7XHJcbiAgICBpZihldmVudC50eXBlID09PSAndG91Y2hzdGFydCcpe1xyXG4gICAgICAgIGxldCBiY3IgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB4ID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYIC0gYmNyLng7XHJcbiAgICAgICAgeSA9IGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSAtIGJjci55O1xyXG4gICAgICAgIGRyYWdEYXRhLm9mZnNldFggPSB4O1xyXG4gICAgICAgIGRyYWdEYXRhLm9mZnNldFkgPSB5O1xyXG4gICAgfWVsc2Uge1xyXG4gICAgICAgIHggPSBldmVudC5vZmZzZXRYO1xyXG4gICAgICAgIHkgPSBldmVudC5vZmZzZXRZO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGNlbGxTaXplID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNldHVwLXNoaXAtY2VsbCcpLm9mZnNldFdpZHRoO1xyXG4gICAgaWYoZHJhZ0RhdGEuc2hpcEVsZW1lbnQuZGF0YXNldC5hbGlnbm1lbnQgPT09J2hvcml6b250YWwnKXtcclxuICAgICAgICBkcmFnRGF0YS5yb3dEaWZmID0gMDtcclxuICAgICAgICBkcmFnRGF0YS5jb2xEaWZmID0gTWF0aC5mbG9vcih4IC8gKGNlbGxTaXplICsgMikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkcmFnRGF0YS5yb3dEaWZmID0gTWF0aC5mbG9vcih5IC8gKGNlbGxTaXplICsgMikpO1xyXG4gICAgICAgIGRyYWdEYXRhLmNvbERpZmYgPSAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByb3RhdGVTaGlwKGV2ZW50KXtcclxuICAgIGNvbnN0IHNoaXBFbGVtZW50ID0gZHJhZ1N0YXJ0LnNoaXBFbGVtZW50O1xyXG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXBUeXBlc1tzaGlwRWxlbWVudC5pZF0ubGVuZ3RoO1xyXG4gICAgY29uc3Qgb3JpZ2luQ2VsbCA9IHNoaXBFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICBpZighb3JpZ2luQ2VsbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSkgcmV0dXJuIDsgLy8gaWYgdGhlIHNoaXAgaXMgbm90IHBsYWNlZCByZXR1cm4gO1xyXG5cclxuICAgIGNvbnN0IG9yaWdpblJvdyA9IHByYXNlSW50KG9yaWdpbkNlbGwuZGF0YXNldC5yb3cpO1xyXG4gICAgY29uc3Qgb3JpZ2luQ29sID0gcGFyc2VJbnQob3JpZ2luQ2VsbC5kYXRhc2V0LmNvbCk7XHJcbiAgICBjb25zb2xlLmxvZyhvcmlnaW5Sb3csb3JpZ2luQ29sKTtcclxuICAgIHBsYXllci5nYW1lQm9hcmQucmVtb3ZlU2hpcChbb3JpZ2luUm93LCBvcmlnaW5Db2xdKTtcclxuICAgIGxldCByb3cgPSBvcmlnaW5Sb3c7XHJcbiAgICBsZXQgY29sID0gb3JpZ2luQ29sO1xyXG4gICAgbGV0IG9yaWdpbkFsaWdubWVudCA9IHNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50O1xyXG4gICAgbGV0IG5ld0FsaWdubWVudDtcclxuICAgIGlmKG9yaWdpbkFsaWdubWVudCA9PT0gJ2hvcml6b250YWwnKXtcclxuICAgICAgICBuZXdBbGlnbm1lbnQ9ICd2ZXJ0aWNhbCc7XHJcbiAgICAgICAgaWYoKDEwIC0gcm93KSA8IHNoaXBMZW5ndGgpIHJvdyA9IDEwIC0gc2hpcExlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3QWxpZ25tZW50ID0gJ2hvcml6b250YWwnO1xyXG4gICAgICAgIGlmKCgxMCAtIGNvbCkgPCBzaGlwTGVuZ3RoKSBjb2wgPSAxMCAtIHNoaXBMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGF0dGVtcHRzID0gMDtcclxuICAgIGxldCBzaGlwU3F1YXJlcyA9IHBsYXllci5nYW1lQm9hcmQuY2hlY2tQbGFjZW1lbnQoc2hpcExlbmd0aCwgW3Jvdyxjb2xdLCBuZXdBbGlnbm1lbnQpO1xyXG4gICAgd2hpbGUoc2hpcFNxdWFyZXMuaXNWYWxpZCA9PT0gZmFsc2UgJiYgYXR0ZW1wdHMgPCAxMCl7XHJcbiAgICAgICAgaWYobmV3QWxpZ25tZW50ID09PSAnaG9yaXpvbnRhbCcpXHJcbiAgICAgICAgICAgIHJvdyA9IHJvdyA8IDkgPyByb3cgKyAxIDogMDtcclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICBjb2wgPSBjb2wgPCAwID8gY29sICsgMSA6IDA7XHJcbiAgICAgICAgc2hpcFNxdWFyZXMgPSBwbGF5ZXIuZ2FtZWJvYXJkLmNoZWNrUGxhY2VtZW50KHNoaXBMZW5ndGgsW3JvdywgY29sXSwgbmV3QWxpZ25tZW50KTtcclxuICAgICAgICBhdHRlbXB0cysrO1xyXG4gICAgfVxyXG4gICAgaWYoc2hpcFNxdWFyZXMuaXNWYWxpZCl7XHJcbiAgICAgICAgcGxheWVyLmdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcEVsZW1lbnQuaWQsIFtyb3csIGNvbF0gLCBuZXdBbGlnbm1lbnQpO1xyXG4gICAgICAgIGNvbnN0IG5ld09yaWdpbkNlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1yb3c9XCIke3Jvd31cIl1bZGF0YS1jb2w9XCIke2NvbH1cIl1gKTtcclxuICAgICAgICBuZXdPcmlnaW5DZWxsLmFwcGVuZENoaWxkKHNoaXBFbGVtZW50KTtcclxuICAgICAgICBzaGlwRWxlbWVudC5kYXRhU2V0LmFsaWdubWVudCA9IG5ld0FsaWdubWVudDtcclxuICAgICAgICBpZihuZXdBbGlnbm1lbnQgPT09ICd2ZXJ0aWNhbCcpICBzaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwLXZlcnRpY2FsJyk7XHJcbiAgICAgICAgZWxzZSBzaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLXZlcnRpY2FsJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBsYXllci5nYW1lYm9hcmQucGxhY2VTaGlwKHNoaXBFbGVtZW50LmlkICwgW29yaWdpblJvdywgb3JpZ2luQ29sXSwgb3JpZ2luQWxpZ25tZW50KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNvbnN0IHNldHVwID0ge1xyXG4gICAgZHJhd1NldHVwQm9hcmQsXHJcbiAgICBkcmF3U2V0dXBTaGlwc1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2V0dXA7XHJcblxyXG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwc1wiXHJcbmltcG9ydCBzaGlwVHlwZXMgZnJvbSBcIi4vc2hpcFR5cGVzXCJcclxuZnVuY3Rpb24gR2FtZWJvYXJkKCl7XHJcbiAgICBjb25zdCBib2FyZCA9ICBjcmVhdGVCb2FyZCgpO1xyXG4gICAgY29uc3QgcGxhY2VkU2hpcHMgPSBbXTtcclxuXHJcbiAgICAvL2NyZWF0ZSBlbXB0eSBib2FyZCBhcnJheVxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQm9hcmQoKSB7XHJcbiAgICAgICAgbGV0IGJvYXJkQXJyYXkgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHJvdyA9IDAgOyByb3cgPD0gOSA7cm93Kyspe1xyXG4gICAgICAgICAgICBsZXQgcm93QXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yKGxldCBjb2wgID0gMCA7IGNvbDw9IDkgIDsgY29sKyspe1xyXG4gICAgICAgICAgICAgICAgcm93QXJyYXlbY29sXT0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBib2FyZEFycmF5W3Jvd10gPSByb3dBcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJvYXJkQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9mdW5jdGlvbiB0byBlbXB0eSBib2FyZCBhcnJheVxyXG4gICAgZnVuY3Rpb24gY2xlYXJCb2FyZChib2FyZCkge1xyXG4gICAgICAgIGZvcihsZXQgcm93ICA9IDAgOyByb3cgPD0gOSA7IHJvdyArKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY29sID0gMCA7IGNvbCA8PSA5IDsgY29sKyspe1xyXG4gICAgICAgICAgICAgICAgYm9hcmRbcm93XVtjb2xdPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXBUeXBlLCBvcmlnaW4sIGFsaWdubWVudCkgeyAgICAgICBcclxuICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcFR5cGVzW3NoaXBUeXBlXS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3Qgc2hpcFNxdWFyZXMgPSB0aGlzLmNoZWNrUGxhY2VtZW50KHNoaXBMZW5ndGgsIG9yaWdpbiwgYWxpZ25tZW50KTtcclxuICAgICAgICAvLyBJZiBzaGlwU3F1YXJlcyBpcyBhIHZhbGlkIGFycmF5LCBwbGFjZSB0aGUgc2hpcCBvbiBhbGwgb2YgdGhvc2Ugc3F1YXJlc1xyXG4gICAgICAgIGlmIChzaGlwU3F1YXJlcy5pc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXAgPSBTaGlwKHNoaXBUeXBlKTtcclxuICAgICAgICAgICAgc2hpcC5zcXVhcmVzID0gc2hpcFNxdWFyZXMuc3F1YXJlcztcclxuICAgICAgICAgICAgc2hpcC5hbGlnbm1lbnQgPSBhbGlnbm1lbnQ7XHJcbiAgICAgICAgICAgIHNoaXBTcXVhcmVzLnNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IFtyb3csIGNvbF0gPSBzcXVhcmU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXSA9IHNoaXA7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHBsYWNlZFNoaXBzLnB1c2goc2hpcCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGlwO1xyXG4gICAgICAgIH0gZWxzZSByZXR1cm4gXCJDYW5ub3QgcGxhY2Ugc2hpcCBpbiB0aGF0IGxvY2F0aW9uXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tQbGFjZW1lbnQoc2hpcExlbmd0aCwgb3JpZ2luICwgYWxpZ25tZW50KSB7XHJcbiAgICAgICAgLy9jcmVhdGUgYXJyYXkgb2Ygc2hpcCBwbGFjZW1lbnQgc3F1YXJlc1xyXG4gICAgICAgIGxldCBbcm93LCBjb2xdPSBvcmlnaW47XHJcbiAgICAgICAgbGV0IHNoaXBTcXVhcmVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc2hpcFNxdWFyZXMucHVzaChbcm93LGNvbF0pO1xyXG4gICAgICAgICAgICBhbGlnbm1lbnQgPT09ICdob3Jpem9udGFsJz9jb2wrKzogcm93Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vaWYgZXZlcnkgZXZlcnkgcGxhY2VtZW50IHNxdWFyZSBpcyBudWxsLCB0aGUgdmFsaWRQbGFjZW1lbnQgaXMgYW4gYXJyYXkgb2YgdGhlIHZhbGlkIHNxdWFyZXNcclxuICAgICAgICBjb25zdCB2YWxpZFBsYWNlbWVudCA9IHNoaXBTcXVhcmVzLmV2ZXJ5KHNxdWFyZSA9PntcclxuICAgICAgICAgICAgbGV0IFtyb3csIGNvbF0gID0gc3F1YXJlO1xyXG4gICAgICAgICAgICBpZih0aGlzLmNoZWNrU3F1YXJlKHJvdyxjb2wpID09PSB1bmRlZmluZWQpIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib2FyZFtyb3ddW2NvbF0gPT09IG51bGw7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy9yZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhbGlkUGxhY2VtZW50IGFuZCBzcXVhcmVzIHByb2Nlc3NlZFxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlzVmFsaWQgOiB2YWxpZFBsYWNlbWVudCxcclxuICAgICAgICAgICAgc3F1YXJlcyA6IHNoaXBTcXVhcmVzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrU3F1YXJlKHJvdywgY29sKSB7XHJcbiAgICAgICAgaWYocm93IDwgMCB8fCBjb2wgPCAwICkgXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgZWxzZSBpZiggcm93ID4gOSB8fCBjb2wgPiA5KXtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93XVtjb2xdO1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXJGbGVldChwbGFjZWRTaGlwcykge1xyXG4gICAgICAgIHdoaWxlKHBsYWNlZFNoaXBzLmxlbmd0aCA+IDAgKXBsYWNlZFNoaXBzLnBvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbW92ZVNoaXAob3JpZ2luKSB7XHJcbiAgICAgICAgY29uc3QgW3JvdywgY29sXSA9IG9yaWdpbjtcclxuICAgICAgICBjb25zdCBzaGlwICA9IHRoaXMuY2hlY2tTcXVhcmUocm93LGNvbCk7XHJcbiAgICAgICAgc2hpcC5zcXVhcmVzLmZvckVhY2goc3F1YXJlID0+e1xyXG4gICAgICAgICAgICBjb25zdCBbcm93LCBjb2xdID0gc3F1YXJlO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkW3JvdywgY29sXSA9IG51bGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3Qgc2hpcHNJbmRleCA9IHRoaXMucGxhY2VkU2hpcHMuaW5kZXhPZihzaGlwKTtcclxuICAgICAgICB0aGlzLnBsYWNlZFNoaXBzLnNwbGljZShzaGlwc0luZGV4LDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBsYWNlU2hpcHNSYW5kb21seSgpIHtcclxuICAgICAgICBjbGVhckJvYXJkKHRoaXMuYm9hcmQpO1xyXG4gICAgICAgIGNsZWFyRmxlZXQodGhpcy5wbGFjZWRTaGlwcyk7XHJcbiAgICAgICAgZm9yKGxldCBzaGlwIGluIHNoaXBUeXBlcyl7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB0aGlzLnBsYWNlU2hpcFJhbmRvbWx5KHNoaXApO1xyXG4gICAgICAgICAgICB3aGlsZSh0eXBlb2YgcmVzdWx0ICE9PSAnb2JqZWN0JyB8fCByZXN1bHQgPT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5wbGFjZVNoaXBSYW5kb21seShzaGlwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL1Rha2UgYSBzaGlwIGFuZCBwbGFjZSBpdCBhdCByYW5kb20gc3F1YXJlIGFuZCByYW5kb20gYXhpc1xyXG4gICAgZnVuY3Rpb24gcGxhY2VTaGlwUmFuZG9tbHkoc2hpcFR5cGUpIHtcclxuICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcFR5cGVzW3NoaXBUeXBlXS5sZW5ndGg7XHJcbiAgICAgICAgZnVuY3Rpb24gcmFuZG9tQWxpZ25tZW50KCl7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIDwgMC41ID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuZG9tU3F1YXJlKGFsaWdubWVudCl7XHJcbiAgICAgICAgICAgIGxldCByb3dEaWYgPSAwO1xyXG4gICAgICAgICAgICBsZXQgY29sRGlmID0gMDtcclxuICAgICAgICAgICAgaWYgKGFsaWdubWVudCA9PT0gJ2hvcml6b250YWwnKSBcclxuICAgICAgICAgICAgICAgIGNvbERpZiAgPSBzaGlwTGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIHJvd0RpZiA9IHNoaXBMZW5ndGggLSAxO1xyXG4gICAgICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwIC0gcm93RGlmKSk7XHJcbiAgICAgICAgICAgIGxldCBjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTAgLSBjb2xEaWYpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFtyb3csY29sXTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBsZXQgYWxpZ25tZW50ID0gcmFuZG9tQWxpZ25tZW50KCk7XHJcbiAgICAgICAgbGV0IG9yaWdpbiA9IGdldFJhbmRvbVNxdWFyZShhbGlnbm1lbnQpO1xyXG4gICAgICAgIGxldCBzaGlwU3F1YXJlcyA9IHRoaXMuY2hlY2tQbGFjZW1lbnQoc2hpcExlbmd0aCxvcmlnaW4sIGFsaWdubWVudCk7XHJcbiAgICAgICAgd2hpbGUoIXNoaXBTcXVhcmVzLmlzVmFsaWQpe1xyXG4gICAgICAgICAgICBhbGlnbm1lbnQgPSByYW5kb21BbGlnbm1lbnQoKTtcclxuICAgICAgICAgICAgb3JpZ2luID0gZ2V0UmFuZG9tU3F1YXJlKGFsaWdubWVudCk7XHJcbiAgICAgICAgICAgIHNoaXBTcXVhcmVzID0gdGhpcy5jaGVja1BsYWNlbWVudChzaGlwTGVuZ3RoLG9yaWdpbixhbGlnbm1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wbGFjZVNoaXAoc2hpcFR5cGUsIG9yaWdpbiwgYWxpZ25tZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWNlaXZlSGl0KHJvdyxjb2wpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jaGVja1NxdWFyZShyb3csY29sKSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJJbnZhbGlkIExvY2F0aW9uXCI7XHJcbiAgICAgICAgY29uc3QgYXR0YWNrZWRTaGlwID0gdGhpcy5ib2FyZFtyb3ddW2NvbF07XHJcbiAgICAgICAgaWYoYXR0YWNrZWRTaGlwID09PSBudWxsKSB0aGlzLmJvYXJkW3Jvd11bY29sXSA9ICdtaXNzJztcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYXR0YWNrZWRTaGlwLmhpdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXSA9ICdoaXQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXMuYm9hcmRbcm93XVtjb2xdLCBbcm93LCBjb2xdLCBhdHRhY2tlZFNoaXBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrQWxsU2hpcHNTdW5rKCkge1xyXG4gICAgICAgIHJldHVybiBwbGFjZWRTaGlwcy5ldmVyeShzaGlwPT5zaGlwLmlzU3VuaygpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGJvYXJkLFxyXG4gICAgICAgIHBsYWNlZFNoaXBzLFxyXG4gICAgICAgIGNoZWNrU3F1YXJlLFxyXG4gICAgICAgIGNoZWNrUGxhY2VtZW50LFxyXG4gICAgICAgIHBsYWNlU2hpcCxcclxuICAgICAgICByZW1vdmVTaGlwLFxyXG4gICAgICAgIHBsYWNlU2hpcHNSYW5kb21seSxcclxuICAgICAgICBwbGFjZVNoaXBSYW5kb21seSxcclxuICAgICAgICByZWNlaXZlSGl0LFxyXG4gICAgICAgIGNoZWNrQWxsU2hpcHNTdW5rXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDsiLCJmdW5jdGlvbiBlbmVteUxvZ2ljKCl7XHJcbiAgICAvLyAyRCBhcnJheSBjb250YWluaW5nIGFsbCBhdmFpbGFibGUgYXR0YWNrIGNvb3JkaW5hdGVzXHJcbiAgICBjb25zdCBhdmFpbGFibGVBdHRhY2tzID0gY3JlYXRlQXR0YWNrQXJyYXkoKTtcclxuICAgIGxldCBsYXN0U2hpcDtcclxuICAgIC8vYXJyYXkgd2l0aCBhbGwgcmVjZW50IGF0dGFja3MgaW4gb3JkZXJcclxuICAgIGNvbnN0IGxhc3RIaXRBcnJheT1bXTtcclxuICAgIGNvbnN0IERpcmVjdGlvbnMgPSBbJ3VwJywnZG93bicsJ2xlZnQnLCdyaWdodCddO1xyXG4gICAgbGV0IGNvbmN1cnJlbnRNaXNzZXMgPSAwO1xyXG4gICAgZnVuY3Rpb24gYXR0YWNrKGVuZW15KXtcclxuICAgICAgICBpZih0aGlzLmxhc3RIaXRBcnJheS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdGhpcy5jaGVja0lmU2hpcElzU3VuayhlbmVteSwgdGhpcy5sYXN0SGl0QXJyYXlbbGFzdEhpdEFycmF5Lmxlbmd0aC0xXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuYXZhaWxhYmxlQXR0YWNrcy5sZW5ndGggPT09IDApIHJldHVybiAnTm8gU3F1YXJlcyB0byBBdHRhY2tzJztcclxuICAgICAgICAvL2lmIHRoZSBib2F0IG1pc3NlcyBtb3JlIHRoYW4gNSB0aW1lICwgdGhlbiBpdCBnZXRzIGEgY2hhbmNlIHRvIGNoZWF0IFxyXG4gICAgICAgIGlmKHRoaXMubGFzdEhpdEFycmF5Lmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY29uY3VycmVudE1pc3Nlcz41ICYmIE1hdGgucmFuZG9tPjAuOCl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbmVteUJvYXJkID0gZW5lbXkuZ2FtZWJvYXJkLmJvYXJkO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3c8MTAgOyByb3crKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBjb2wgPSAwOyBjb2w8MTAgO2NvbCsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGVuZW15LmdhbWVib2FyZC5jaGVja1NxdWFyZShyb3csY29sKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGNlbGwgPT09ICdvYmplY3QnICYmIGNlbGwgIT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoZWF0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Jvdyxjb2xdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBhdHRhY2tDb29yZHMgPSB0aGlzLmdldFJhbmRvbUNlbGwoZW5lbXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXR0YWNrQ29vcmRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2Vsc2Ugd2UgZmlyZSBvbiB0aGUgc3F1YXJlcyBhZGphY2VudCB0byB0aGUgbGFzdCBoaXQgc3F1YXJlXHJcbiAgICAgICAgY29uc3QgbGFzdEhpdCA9IHRoaXMubGFzdEhpdEFycmF5W2xhc3RIaXRBcnJheS5sZW5ndGggLTFdO1xyXG4gICAgICAgIGNvbnN0IGFkamFjZW50Q2VsbHMgPSB0aGlzLmdldEFsbEFkamFjZW50Q2VsbHMoZW5lbXksbGFzdEhpdCk7XHJcbiAgICAgICAgY29uc3QgYWRqYWNlbnRIaXRzID0gYWRqYWNlbnRDZWxscy5maWx0ZXIoY2VsbCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoY2VsbC5jZWxsUmVzdWx0ID09PSAnaGl0JyAmJiB0aGlzLmNoZWNrSWZTaGlwSXNTdW5rKGVuZW15LCBjZWxsLmFkamFjZW50Q2VsbCkgPT09IGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL2lmIHRoZXJlIGlzIGEgaGl0IChvciBtdWx0aXBsZSkgYWRqYWNlbnQgLCBhdHRhY2sgaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvblxyXG4gICAgICAgIGlmKGFkamFjZW50SGl0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgY29uc3QgcmFuZG9tQWRqYWNlbnRIaXQ9YWRqYWNlbnRIaXRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFkamFjZW50SGl0cy5sZW5ndGgpXTtcclxuICAgICAgICAgICAgbGV0IG5leHRDZWxsID0gdGhpcy5nZXROZXh0QXR0YWNrYWJsZUNlbGwoZW5lbXksbGFzdEhpdCx0aGlzLmZsaXBEaXJlY3Rpb24ocmFuZG9tQWRqYWNlbnRIaXQuZGlyZWN0aW9uKSk7XHJcbiAgICAgICAgICAgIGlmKG5leHRDZWxsPT09ZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgbmV4dENlbGw9IHRoaXMuZ2V0TmV4dEF0dGFja2FibGVDZWxsKGVuZW15LGxhc3RIaXQscmFuZG9tQWRqYWNlbnRIaXQuZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2hpbGUobmV4dENlbGw9PT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgbmV4dENlbGwgPSB0aGlzLmdldE5leHRBdHRhY2thYmxlQ2VsbChlbmVteSxsYXN0SGl0LHRoaXMuRGlyZWN0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqIHRoaXMuRGlyZWN0aW9ucy5sZW5ndGgpXSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0Q2VsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vZ28gYmFja3dhcmRzIHRocm91Z2ggYWxsIG90aGVyIGhpdCBjZWxscyBmb3IgYWRqYWNlbmN5IHRvIGxhc3QgaGl0IGNlbGwgYW5kIGF0dGFjayBhIGNlbGwgaW4gdGhhdCBkaXJlY3Rpb25cclxuICAgICAgICBmb3IobGV0IGkgPSB0aGlzLmxhc3RIaXRBcnJheS5sZW5ndGggLSAyOyBpPj0gMCA7IGktLSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSB0aGlzLmxhc3RIaXRBcnJheVtpXTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXRBZGphY2VuY3kobGFzdEhpdCxjZWxsKTtcclxuICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgIGxldCBuZXh0Q2VsbCA9IHRoaXMuZ2V0TmV4dEF0dGFja2FibGVDZWxsKGVuZW15LCBsYXN0SGl0LCByZXN1bHQuZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIGlmKG5leHRDZWxsKSByZXR1cm4gbmV4dENlbGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYWRqYWNlbnRDZWxsVG9BdHRhY2sgPSBhZGphY2VudENlbGxzLmZpbHRlcihjZWxsID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBjZWxsLmNlbGxSZXN1bHQgIT09ICdzdHJpbmcnICYmIGNlbGwuY2VsbFJlc3VsdCAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IGNlbGwgPSBhZGphY2VudENlbGxUb0F0dGFja1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhZGphY2VudENlbGxUb0F0dGFjay5sZW5ndGgpXTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNlbGwuYWRqYWNlbnRDZWxsKTtcclxuICAgICAgICByZXR1cm4gY2VsbC5hZGphY2VudENlbGw7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbUNlbGwoZW5lbXkpIHtcclxuICAgICAgICBpZih0aGlzLmF2YWlsYWJsZUF0dGFja3MubGVuZ3RoPT09IDApIHJldHVybiBcIm5vIFNxdWFyZXMgdG8gYXR0YWNrXCI7XHJcbiAgICAgICAgLy9nZXQgcm93IGFuZCBjb2wgZm9yIGEgcmFuZG9tIGF0dGFjayBmcm9tIHRoZSBhdmFpbGFibGVBdHRhY2tzIGFycmF5XHJcbiAgICAgICAgbGV0IGFycmF5Um93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5hdmFpbGFibGVBdHRhY2tzLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IGFycmF5Q29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5hdmFpbGFibGVBdHRhY2tzW2FycmF5Um93XS5sZW5ndGgpO1xyXG4gICAgICAgIGxldCBjZWxsID0gdGhpcy5hdmFpbGFibGVBdHRhY2tzW2FycmF5Um93XVthcnJheUNvbF07XHJcbiAgICAgICAgLy9pZiB0aGUgc2VsZWN0ZWQgY2VsbCBoYXMgMCBhZGphY2VudCBhdHRhY2thYmxlIGNlbGxzIGdldCBhIHJhbmRvbSBjZWxsXHJcbiAgICAgICAgY29uc3QgYWRqYWNlbnRDZWxscyA9IHRoaXMuZ2V0QWxsQWRqYWNlbnRDZWxscyhlbmVteSwgY2VsbCk7XHJcbiAgICAgICAgaWYoYWRqYWNlbnRDZWxscy5ldmVyeShjZWxsID0+IHR5cGVvZiBjZWxsLmNlbGxSZXN1bHQgIT09ICdvYmplY3QnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSYW5kb21DZWxsKGVuZW15KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNlbGw7XHJcbiAgICB9XHJcbiAgICAvL1JlbW92ZSBhIGNlbGwgZnJvbSB0aGUgYXZhaWxhYmxlQXR0YWNrIGFycmF5XHJcbiAgICAvL2dldHMgY2FsbGVkIGJ5IHBsYXllci5qcyBhZnRlciBhdHRhY2sgXHJcbiAgICBmdW5jdGlvbiByZW1vdmVDZWxsRnJvbUF2YWlsYWJsZUF0dGFja3MoY2VsbCkge1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuYXZhaWxhYmxlQXR0YWNrcy5sZW5ndGg7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuYXZhaWxhYmxlQXR0YWNrc1tyb3ddLmxlbmd0aDsgY29sKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IHRoaXMuYXZhaWxhYmxlQXR0YWNrc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbFswXSA9PT0gc3F1YXJlWzBdICYmIGNlbGxbMV0gPT09IHNxdWFyZVsxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQXR0YWNrc1tyb3ddLnNwbGljZShjb2wsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZUF0dGFja3Nbcm93XS5sZW5ndGggPT09IDApIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUF0dGFja3Muc3BsaWNlKHJvdywgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZ2V0QWxsQWRqYWNlbnRDZWxscyhlbmVteSAsIGNlbGwpIHtcclxuICAgICAgICByZXR1cm4gRGlyZWN0aW9ucy5tYXAoZGlyZWN0aW9uID0+e1xyXG4gICAgICAgICAgICBjb25zdCBhZGphY2VudENlbGwgPSB0aGlzLmdldEFkamFjZW50Q2VsbChjZWxsLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBsZXQgY2VsbFJlc3VsdCA9IGVuZW15LmdhbWVib2FyZC5jaGVja1NxdWFyZShhZGphY2VudENlbGxbMF0sYWRqYWNlbnRDZWxsWzFdKTtcclxuICAgICAgICAgICAgaWYoY2VsbFJlc3VsdCA9PT0gJ2hpdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hlY2tJZlNoaXBJc1N1bmsoZW5lbXksYWRqYWNlbnRDZWxsKSkgY2VsbFJlc3VsdCA9ICdzdW5rJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY2VsbFJlc3VsdCxcclxuICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbCxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBZGphY2VudENlbGwoY2VsbCAsIGRpcmVjdGlvbil7XHJcbiAgICBsZXQgW3JvdywgY29sXSA9IGNlbGw7XHJcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgIGNhc2UgJ3VwJzpcclxuICAgICAgICAgICAgcm93LS07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2Rvd24nOlxyXG4gICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbGVmdCc6XHJcbiAgICAgICAgICAgIGNvbC0tO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdyaWdodCc6XHJcbiAgICAgICAgICAgIGNvbCsrO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH07XHJcbiAgICByZXR1cm4gW3JvdywgY29sXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBZGphY2VuY3koY2VsbCwgbmVpZ2hib3VyQ2VsbCl7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbjtcclxuICAgICAgICBsZXQgb3Bwb3NpdGVEaXJlY3Rpb247XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlO1xyXG4gICAgICAgIGlmKGNlbGxbMF0gPT09IG5laWdoYm91ckNlbGxbMF0pe1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmID0gY2VsbFsxXS0gbmVpZ2hib3VyQ2VsbFsxXTtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gZGlmZiA+MSA/ICdsZWZ0JyA6ICdyaWdodCcgO1xyXG4gICAgICAgICAgICBvcHBvc2l0ZURpcmVjdGlvbiAgPWRpZmY+MSA/ICdyaWdodCcgOiAnbGVmdCc7XHJcbiAgICAgICAgICAgIGRpc3RhbmNlID0gTWF0aC5hYnMoZGlmZik7XHJcbiAgICAgICAgfWVsc2UgaWYoY2VsbFsxXT09PSBuZWlnaGJvdXJDZWxsWzFdKXtcclxuICAgICAgICAgICAgY29uc3QgZGlmZiA9IGNlbGxbMF0tbmVpZ2hib3VyQ2VsbFswXTtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gZGlmZiA+IDEgPyAnZG93bicgOiAndXAnO1xyXG4gICAgICAgICAgICBvcHBvc2l0ZURpcmVjdGlvbiA9IGRpZmYgPiAxID8gJ3VwJyA6ICdkb3duJztcclxuICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhkaWZmKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIG9wcG9zaXRlRGlyZWN0aW9uLFxyXG4gICAgICAgICAgICBkaXN0YW5jZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL2xvb2sgZm9yIGEgcG9zc2libGUgY2VsbCB0byBhdHRhY2sgaW4gYSBnaXZlbiBkaXJlY3Rpb24ob25seSA0IGNlbGxzKVxyXG4gICAgZnVuY3Rpb24gZ2V0TmV4dEF0dGFja2FibGVDZWxsKGVuZW15LCBjZWxsICxkaXJlY3Rpb24pe1xyXG4gICAgICAgIGxldCBuZXh0Q2VsbCA9IGdldEFkamFjZW50Q2VsbChjZWxsLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAgOyBpPCA0IDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IG5leHRDZWxsU3RhdHVzPSBlbmVteS5nYW1lYm9hcmQuY2hlY2tTcXVhcmUobmV4dENlbGxbMF0sbmV4dENlbGxbMV0pO1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgbmV4dENlbGxTdGF0dXMgPT09ICdvYmplY3QnIHx8IG5leHRDZWxsU3RhdHVzID09PSBudWxsICkgcmV0dXJuIG5leHRDZWxsO1xyXG4gICAgICAgICAgICBpZihuZXh0Q2VsbFN0YXR1cyA9PT0gdW5kZWZpbmVkICkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZihuZXh0Q2VsbFN0YXR1cyA9PT0gJ21pc3MnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmKG5leHRDZWxsU3RhdHVzID09PSAnaGl0Jyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmNoZWNrSWZTaGlwSXNTdW5rKGVuZW15LCBuZXh0Q2VsbCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXh0Q2VsbCA9IGdldEFkamFjZW50Q2VsbChuZXh0Q2VsbCxkaXJlY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmxpcERpcmVjdGlvbihkaXJlY3Rpb24pe1xyXG4gICAgICAgIHN3aXRjaChkaXJlY3Rpb24pe1xyXG4gICAgICAgICAgICBjYXNlICd1cCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Rvd24nO1xyXG4gICAgICAgICAgICBjYXNlICdkb3duJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAndXAnO1xyXG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2xlZnQnO1xyXG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAncmlnaHQnO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL2ZpbmQgc2hpcCBhdCBnaXZlbiBjZWxsIGFuZCBjaGVjayBpZiBzdW5rIG9yIG5vdCBcclxuICAgIC8vaWYgc3VuayByZW1vdmUgdGhlIHNxdWFyZXMgZnJvbSB0aGUgbGFzdEhpdEFycmF5XHJcbiAgICBmdW5jdGlvbiBjaGVja0lmU2hpcElzU3VuayhlbmVteSxjZWxsKXtcclxuICAgICAgICBjb25zdCBlbmVteVNoaXAgPSBlbmVteS5nYW1lYm9hcmQucGxhY2VkU2hpcHM7XHJcbiAgICAgICAgbGV0IGhpdFNoaXA7XHJcbiAgICAgICAgZW5lbXlTaGlwLmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgICAgIGlmKHNoaXAuc3F1YXJlcy5zb21lKHNxdWFyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHNxdWFyZVswXSA9PT0gY2VsbFswXSAmJiBzcXVhcmVbMV0gID09PSBjZWxsWzFdKVxyXG4gICAgICAgICAgICB9KSkgaGl0U2hpcCA9IHNoaXA7O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYoaGl0U2hpcC5pc1N1bmsoKSl7XHJcbiAgICAgICAgICAgIGhpdFNoaXAuc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubGFzdEhpdEFycmF5LmZpbmRJbmRleChsb2NhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChsb2NhdGlvblswXSA9PT0gc3F1YXJlWzBdICYmIGxvY2F0aW9uWzFdID09PSBzcXVhcmVbMV0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmKGluZGV4ID4gLTEpIHRoaXMubGFzdEhpdEFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBhdmFpbGFibGVBdHRhY2tzLFxyXG4gICAgICAgIGxhc3RTaGlwLFxyXG4gICAgICAgIGxhc3RIaXRBcnJheSxcclxuICAgICAgICBEaXJlY3Rpb25zLFxyXG4gICAgICAgIGNvbmN1cnJlbnRNaXNzZXMsXHJcbiAgICAgICAgYXR0YWNrLFxyXG4gICAgICAgIGdldFJhbmRvbUNlbGwsXHJcbiAgICAgICAgcmVtb3ZlQ2VsbEZyb21BdmFpbGFibGVBdHRhY2tzLFxyXG4gICAgICAgIGdldEFkamFjZW50Q2VsbCxcclxuICAgICAgICBnZXRBbGxBZGphY2VudENlbGxzLFxyXG4gICAgICAgIGdldE5leHRBdHRhY2thYmxlQ2VsbCxcclxuICAgICAgICBnZXRBZGphY2VuY3ksXHJcbiAgICAgICAgZmxpcERpcmVjdGlvbixcclxuICAgICAgICBjaGVja0lmU2hpcElzU3Vua1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBdHRhY2tBcnJheSgpe1xyXG4gICAgY29uc3QgYXR0YWNrQXJyYXkgPSBbXTtcclxuICAgIGZvcihsZXQgcm93ID0gMCA7IHJvdzwgMTAgOyByb3crKyl7XHJcbiAgICAgICAgbGV0IHJvd0FycmF5ID0gW107XHJcbiAgICAgICAgZm9yKGxldCBjb2wgPSAwIDsgY29sIDwgMTAgOyBjb2wrKyl7XHJcbiAgICAgICAgICAgIHJvd0FycmF5LnB1c2goW3Jvdyxjb2xdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXR0YWNrQXJyYXkucHVzaChyb3dBcnJheSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXR0YWNrQXJyYXk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGVuZW15TG9naWM7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcclxuXHJcbmZ1bmN0aW9uIEdhbWUoKXtcclxuICAgIGxldCBwbGF5ZXIxO1xyXG4gICAgbGV0IHBsYXllcjI7XHJcbiAgICBsZXQgY3VycmVudFBsYXllcjtcclxuICAgIGxldCBkZWZlbmRpbmdQbGF5ZXI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3JlYXRlUGxheWVyKG5hbWUsIG51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIFBsYXllcihuYW1lLCBudW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5ld0dhbWUocGxheWVyMSwgcGxheWVyMil7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIxID0gcGxheWVyMTtcclxuICAgICAgICB0aGlzLnBsYXllcjIgPSBwbGF5ZXIyO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllciAgPSB0aGlzLnBsYXllcjE7XHJcbiAgICAgICAgdGhpcy5kZWZlbmRpbmdQbGF5ZXIgPSB0aGlzLnBsYXllcjI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3dpdGNoVHVybigpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuY3VycmVudFBsYXllciA9PT0gdGhpcy5wbGF5ZXIxIFxyXG4gICAgICAgICAgICA/IHRoaXMucGxheWVyMiAgXHJcbiAgICAgICAgICAgIDogdGhpcy5wbGF5ZXIxO1xyXG4gICAgICAgIHRoaXMuZGVmZW5kaW5nUGxheWVyID0gdGhpcy5kZWZlbmRpbmdQbGF5ZXIgPT09IHRoaXMucGxheWVyMiBcclxuICAgICAgICAgICAgPyB0aGlzLnBsYXllcjEgXHJcbiAgICAgICAgICAgIDogdGhpcy5wbGF5ZXIyO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2hlY2tHYW1lT3Zlcigpe1xyXG4gICAgICAgIGlmKHRoaXMucGxheWVyMS5nYW1lYm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKSkgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcjI7XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLnBsYXllcjIuZ2FtZWJvYXJkLmNoZWNrQWxsU2hpcHNTdW5rKCkpIFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXIxO1xyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZSA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBsYXllcjEsXHJcbiAgICAgICAgcGxheWVyMixcclxuICAgICAgICBjdXJyZW50UGxheWVyLFxyXG4gICAgICAgIGRlZmVuZGluZ1BsYXllcixcclxuICAgICAgICBDcmVhdGVQbGF5ZXIsXHJcbiAgICAgICAgbmV3R2FtZSxcclxuICAgICAgICBzd2l0Y2hUdXJuLFxyXG4gICAgICAgIGNoZWNrR2FtZU92ZXJcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBHYW1lOyIsImltcG9ydCBHYW1lYm9hcmQgIGZyb20gXCIuL2JvYXJkXCI7XHJcbmltcG9ydCBlbmVteUxvZ2ljIGZyb20gJy4vZW5lbXlMb2dpYydcclxuXHJcbmZ1bmN0aW9uIFBsYXllcihwbGF5ZXJOYW1lLCBwbGF5ZXJOdW0pe1xyXG4gICAgbGV0IG5hbWUgPSB0eXBlb2YgcGxheWVyTmFtZSA9PT0gJ3N0cmluZycgPyBwbGF5ZXJOYW1lIDogJ2JvdCc7XHJcbiAgICBjb25zdCBudW1iZXIgPSBwbGF5ZXJOdW07XHJcbiAgICBjb25zdCBpc0FJID0gdHlwZW9mIHBsYXllck5hbWUgPT09ICdzdHJpbmcnID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgY29uc3QgZ2FtZWJvYXJkID0gR2FtZWJvYXJkKCk7XHJcbiAgICBjb25zdCBlbmVteSA9IGVuZW15TG9naWMoKTtcclxuICAgIGZ1bmN0aW9uIGF0dGFjayh0YXJnZXQsIHJvdyAsIGNvbCl7XHJcbiAgICAgICAgaWYodGhpcy5pc0FJKXtcclxuICAgICAgICAgICAgaWYodGhpcy5lbmVteS5hdmFpbGFibGVBdHRhY2tzLmxlbmd0aCA9PT0gMCkgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjYW5ub3QgYXR0YWNrIGZ1cnRoZXJcIjtcclxuICAgICAgICAgICAgW3Jvdyxjb2xdPSB0aGlzLmVuZW15LmF0dGFjayh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2dldCB0aGUgcmVzdWx0IG9mIHRoZSBhdHRhY2tcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0YXJnZXQuZ2FtZWJvYXJkLnJlY2VpdmVIaXQocm93LGNvbCk7XHJcbiAgICAgICAgaWYodGhpcy5pc0FJKXtcclxuICAgICAgICAgICAgaWYocmVzdWx0WzBdID09PSAnaGl0Jyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW15Lmxhc3RIaXRBcnJheS5wdXNoKHJlc3VsdFsxXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW15LmNvbmN1cnJlbnRNaXNzZXMgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdFswXSA9PT0gJ21pc3MnKSB0aGlzLmVuZW15LmNvbmN1cnJlbnRNaXNzZXMrKztcclxuICAgICAgICAgICAgaWYocmVzdWx0WzJdICE9PSAnbnVsbCcpIHRoaXMuZW5lbXkubGFzdFNoaXAgPSByZXN1bHRbMl07XHJcbiAgICAgICAgICAgIHRoaXMuZW5lbXkucmVtb3ZlQ2VsbEZyb21BdmFpbGFibGVBdHRhY2tzKHJlc3VsdFsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm57XHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBudW1iZXIsXHJcbiAgICAgICAgaXNBSSxcclxuICAgICAgICBnYW1lYm9hcmQsXHJcbiAgICAgICAgZW5lbXksXHJcbiAgICAgICAgYXR0YWNrXHJcbiAgICB9IFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XHJcbiIsImNvbnN0IHNoaXBUeXBlcyA9IHtcclxuICAgIGNhcnJpZXI6e1xyXG4gICAgICAgIGlkOiAxLFxyXG4gICAgICAgIG5hbWUgOiAnY2FycmllcicsXHJcbiAgICAgICAgbGVuZ3RoOjVcclxuICAgIH0sXHJcbiAgICBiYXR0bGVzaGlwOntcclxuICAgICAgICBpZDoyLFxyXG4gICAgICAgIG5hbWU6ICdiYXR0bGVzaGlwJyxcclxuICAgICAgICBsZW5ndGg6NFxyXG4gICAgfSxcclxuICAgIGRlc3Ryb3llcjp7XHJcbiAgICAgICAgaWQ6MyxcclxuICAgICAgICBuYW1lOidkZXN0cm95ZXInLFxyXG4gICAgICAgIGxlbmd0aDozXHJcbiAgICB9LFxyXG4gICAgc3VibWFyaW5lOntcclxuICAgICAgICBpZDo0LFxyXG4gICAgICAgIG5hbWU6J3N1Ym1hcmluZScsXHJcbiAgICAgICAgbGVuZ3RoOjNcclxuICAgIH0sXHJcbiAgICBwYXRyb2w6e1xyXG4gICAgICAgIGlkOjUsXHJcbiAgICAgICAgbmFtZToncGF0cm9sJyxcclxuICAgICAgICBsZW5ndGg6MlxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHNoaXBUeXBlczsiLCJpbXBvcnQgc2hpcFR5cGVzIGZyb20gXCIuL3NoaXBUeXBlc1wiXHJcbmZ1bmN0aW9uIFNoaXAoc2hpcFR5cGUpe1xyXG4gICAgY29uc3QgdHlwZSA9IHNoaXBUeXBlO1xyXG4gICAgY29uc3QgbGVuZ3RoID0gc2hpcFR5cGVzW3NoaXBUeXBlXS5sZW5ndGg7XHJcbiAgICBsZXQgaGl0cyA9IDA7XHJcbiAgICBsZXQgc3F1YXJlczsgXHJcbiAgICBsZXQgYWxpZ25tZW50IDtcclxuICAgIGZ1bmN0aW9uIGhpdCgpe1xyXG4gICAgICAgIHRoaXMuaGl0cysrO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaXNTdW5rKCl7XHJcbiAgICAgICAgaWYodGhpcy5oaXRzID49IHRoaXMubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZSAsXHJcbiAgICAgICAgbGVuZ3RoLFxyXG4gICAgICAgIGhpdHMsIFxyXG4gICAgICAgIHNxdWFyZXMsXHJcbiAgICAgICAgYWxpZ25tZW50LFxyXG4gICAgICAgIGhpdCwgXHJcbiAgICAgICAgaXNTdW5rXHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgU2hpcDsiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyogc2V0dXAgKi9cclxuOnJvb3R7XHJcbiAgICAtLWhlYWRlci1oZWlnaHQ6IDEwMHB4O1xyXG4gICAgLS1ib2FyZC1zaXplOiAzMThweDtcclxuICAgIC0tY2VsbC1zaXplOiAzMHB4O1xyXG5cclxuICAgIC0tYmFja2dyb3VuZC1jb2xvcjogcmdiKDI0MCwgMjQwLCAyNDApO1xyXG4gICAgLS1iYWNrZ3JvdW5kLWNvbG9yLXRyYW5zcGFyZW50OiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuNyk7XHJcbiAgICAtLWNlbGwtY29sb3I6IHJnYigyMzAsIDIzMCwgMjMwKTtcclxuICAgIC0tY2VsbC1ob3Zlci1jb2xvcjogcmdiKDIwMCwgMjAwLCAyMDApO1xyXG4gICAgLS1jZWxsLWJvcmRlci1jb2xvcjogcmdiKDcwLCA3MCwgNzApO1xyXG4gICAgLS1zaGlwLWNvbG9yOiByZ2IoMTUwLCAxNTAsIDE1MCk7XHJcbiAgICAtLWhpdC1jb2xvcjogcmdiKDIwNiwgMTY5LCAxMzQpO1xyXG4gICAgLS1taXNzLWNvbG9yOiByZ2IoMTYxLCAyMTYsIDE2MSk7XHJcbiAgICAtLXN1bmstY29sb3I6IHJnYigyMDYsIDEzNCwgMTM0KTtcclxuICAgIC0tdGV4dC1jb2xvci1tYWluOiByZ2IoNDAsIDQwLCA0MCk7XHJcbiAgICAtLXRleHQtY29sb3ItZ3JleTogcmdiKDEwMCwgMTAwLCAxMDApO1xyXG4gICAgLS1idXR0b24tY29sb3I6IHJnYigyMTAsIDIxMCwgMjEwKTtcclxuICAgIC0tYnV0dG9uLWNvbG9yLWhvdmVyOiByZ2IoMjMwLCAyMzAsIDIzMCk7XHJcbiAgICAtLWJ1dHRvbi1jb2xvci1hY3RpdmU6IGdyZXk7XHJcbn1cclxuOnJvb3QuZGFyayB7XHJcbiAgICAtLWJhY2tncm91bmQtY29sb3I6IHJnYigzMCwgMzAsIDMwKTtcclxuICAgIC0tYmFja2dyb3VuZC1jb2xvci10cmFuc3BhcmVudDogcmdiYSgzMCwgMzAsIDMwLCAwLjcpO1xyXG4gICAgLS1jZWxsLWNvbG9yOiByZ2IoNDAsIDQwLCA0MCk7XHJcbiAgICAtLWNlbGwtaG92ZXItY29sb3I6IHJnYig5MCwgOTAsIDkwKTtcclxuICAgIC0tY2VsbC1ib3JkZXItY29sb3I6IHJnYigyMjAsIDIyMCwgMjIwKTtcclxuICAgIC0tc2hpcC1jb2xvcjogcmdiKDE1MywgMTUzLCAxNTMpO1xyXG4gICAgLS1oaXQtY29sb3I6IHJnYigxNTUsIDk5LCA2MSk7XHJcbiAgICAtLW1pc3MtY29sb3I6IHJnYig1MiwgMTA5LCA1Mik7XHJcbiAgICAtLXN1bmstY29sb3I6IHJnYigxNTUsIDYxLCA2MSk7XHJcbiAgICAtLXRleHQtY29sb3ItbWFpbjogcmdiKDIyMCwgMjIwLCAyMjApO1xyXG4gICAgLS10ZXh0LWNvbG9yLWdyZXk6IHJnYigxNjAsIDE2MCwgMTYwKTtcclxuICAgIC0tYnV0dG9uLWNvbG9yOiByZ2IoNTAsIDUwLCA1MCk7XHJcbiAgICAtLWJ1dHRvbi1jb2xvci1ob3ZlcjogcmdiKDIwLCAyMCwgMjApO1xyXG4gICAgLS1idXR0b24tY29sb3ItYWN0aXZlOiBncmV5O1xyXG59XHJcblxyXG4qLFxyXG4qOjpiZWZvcmUsXHJcbio6OmFmdGVyIHtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuLyogY29udGVudHMgKi9cclxuYm9keSB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1iYWNrZ3JvdW5kLWNvbG9yKTtcclxuICAgIGZvbnQtZmFtaWx5OiAnUmFsZXdheScsIHNhbnMtc2VyaWY7XHJcbiAgICBjb2xvcjp2YXIoLS10ZXh0LWNvbG9yLW1haW4pO1xyXG59XHJcblxyXG4jYXBwIHtcclxuICAgIHBhZGRpbmc6IDAgNSU7XHJcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG59XHJcbmgze1xyXG4gICAgbWFyZ2luOjA7XHJcbn1cclxuLyogaGVhZGVyICovXHJcbmhlYWRlciB7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW4gO1xyXG4gICAgYWxpZ24taXRlbXM6Y2VudGVyO1xyXG4gICAgd2lkdGg6Njc1cHg7XHJcbn1cclxuXHJcbmhlYWRlciBidXR0b257XHJcbiAgICBoZWlnaHQ6MzJweDtcclxuICAgIHdpZHRoOiAxMjBweDtcclxuICAgIGZvbnQtc2l6ZToxcmVtO1xyXG4gICAgcGFkZGluZy1ib3R0b206MnB4O1xyXG59XHJcblxyXG5idXR0b24ge1xyXG4gICAgZm9udC1mYW1pbHk6ICdGaXJhIENvZGUnLCBtb25vc3BhY2U7XHJcbiAgICBjb2xvcjp2YXIoLS10ZXh0LWNvbG9yLW1haW4pO1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tdGV4dC1jb2xvci1tYWluKTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJ1dHRvbi1jb2xvcik7XHJcbn1cclxuYnV0dG9uOmFjdGl2ZXtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJ1dHRvbi1jb2xvci1hY3RpdmUpO1xyXG4gICAgc2NhbGU6MC45NTtcclxufVxyXG5cclxuQG1lZGlhIChob3Zlcjpob3Zlcil7XHJcbiAgICBidXR0b246aG92ZXIge1xyXG4gICAgICAgIGN1cnNvcjpwb2ludGVyO1xyXG4gICAgICAgIGJvcmRlci13aWR0aDogMnB4O1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tYnV0dG9uLWNvbG9yLWhvdmVyKVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiBnYW1lIGNvbnRhaW5lciAqL1xyXG5cclxuI2dhbWUtY29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xyXG4gICAgZmxleC13cmFwOndyYXA7XHJcbiAgICBnYXA6NDBweDtcclxufVxyXG4vKiBwbGF5ZXIgc2V0dXAgKi9cclxuLnNldHVwLXNoaXBzLWNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjpjb2x1bW47XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICB3aWR0aDogdmFyKC0tYm9hcmQtc2l6ZSk7XHJcbiAgICBoZWlnaHQ6IGNhbGModmFyKC0tYm9hcmQtc2l6ZSkrMjVweCk7XHJcbiAgICB0ZXh0LWFsaWduOiByaWdodDtcclxuXHJcbn1cclxuLnNldHVwLXNoaXBzLWhlYWRlciBwIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGZvbnQtc2l6ZTogMC44cmVtO1xyXG59XHJcbi5zZXR1cC1zaGlwLXNoaXBsaXN0IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAganVzdGlmeS1jb250ZW50OmNlbnRlcjtcclxufVxyXG4uc2V0dXAtc2hpcHtcclxuICAgIGhlaWdodDogNDBweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5zZXR1cC1zaGlwIHB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcclxufVxyXG5cclxuLnNldHVwLXNoaXAtYm94e1xyXG4gICAgY3Vyc29yOmdyYWI7XHJcbiAgICBkaXNwbGF5OmlubGluZS1mbGV4O1xyXG4gICAgZ2FwOjJweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHotaW5kZXg6MjA7XHJcbn1cclxuLnNldHVwLXNoaXAtdmVydGljYWx7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG59XHJcbi5zZXR1cC1zaGlwLWhpZGUgZGl2e1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwwKTtcclxuICAgIG9wYWNpdHk6IDAuNTtcclxufVxyXG4uc2V0dXAtc2hpcC1kcm9wcGVke1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogLTFweDtcclxuICAgIHRvcDogLTFweDtcclxufVxyXG5cclxuLmdob3N0LXNoaXB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB6LWluZGV4OiAyMDA7XHJcbiAgICBvcGFjaXR5OiAwLjg7XHJcbn1cclxuLmdob3N0LXNoaXA+IC5zZXR1cC1zaGlwLWNlbGx7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jZWxsLWhvdmVyLWNvbG9yKTtcclxufVxyXG5cclxuLnNldHVwLXNoaXAtY2VsbCB7XHJcbiAgICB3aWR0aDogdmFyKC0tY2VsbC1zaXplKTtcclxuICAgIGhlaWdodDp2YXIoLS1jZWxsLXNpemUpO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2VsbC1ob3Zlci1jb2xvcik7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jZWxsLWJvcmRlci1jb2xvcik7XHJcbn1cclxuXHJcbi5zZXR1cC1zaGlwcy1vcHRpb25ze1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG59XHJcblxyXG4uc3RhcnQtZ2FtZS1idXR0b24sXHJcbi5zZXR1cC1idXR0b24tcmFuZG9tIHtcclxuICAgIHdpZHRoOiAxMjBweDtcclxuICAgIGhlaWdodDozNnB4O1xyXG59XHJcbi5zdGFydC1nYW1lLWJ1dHRvbntcclxuICAgIGZvbnQtd2VpZ2h0OjYwMDtcclxuICAgIGZvbnQtc2l6ZToxcmVtO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1oaXQtY29sb3IpO1xyXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMXMgZWFzZTtcclxufVxyXG4uc3RhcnQtZ2FtZS1idXR0b24tZGlzYWJsZWR7XHJcbiAgICBvcGFjaXR5OiAwLjU7XHJcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxufVxyXG5AbWVkaWEoaG92ZXI6IGhvdmVyKXtcclxuICAgIC5zZXR1cC1idXR0b24tc3RhcnQ6aG92ZXJ7XHJcbiAgICAgICAgdHJhbnNmb3JtOnNjYWxlKDEuMSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjpyZ2IoMjI2LDExNiwxMTYpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKiBwbGF5ZXIgc2VjdGlvbnMgKi9cclxuXHJcbi5ib2FyZC1jb250YWluZXIge1xyXG4gICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbn1cclxuXHJcbi8qIHBsYXllciBib2FyZCAqL1xyXG4uYm9hcmR7XHJcbiAgICBkaXNwbGF5OmdyaWQ7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwxZnIpO1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsMWZyKTtcclxuICAgIGdhcDoycHg7XHJcbn1cclxuXHJcbi5jZWxsIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGN1cnNvcjogY3Jvc3NoYWlyO1xyXG4gICAgaGVpZ2h0OnZhcigtLWNlbGwtc2l6ZSk7XHJcbiAgICB3aWR0aDogdmFyKC0tY2VsbC1zaXplKTtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgYWxpZ24tY29udGVudDpjZW50ZXI7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jZWxsLWNvbG9yKTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNlbGwtYm9yZGVyLWNvbG9yKTtcclxufVxyXG5cclxuLmNlbGwtc2V0dXB7XHJcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcclxufVxyXG4uY2VsbC1kcmFnLW92ZXJ7XHJcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xyXG4gICAgei1pbmRleDo0MDtcclxufVxyXG5cclxuLmNlbGwtZHJhZy12YWxpZHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tbWlzcy1jb2xvcik7XHJcbn1cclxuLmNlbGwtZHJhZy1pbnZhbGlke1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1oaXQtY29sb3IpO1xyXG59XHJcblxyXG5AbWVkaWEoaG92ZXI6IGhvdmVyKXtcclxuICAgIC5jZWxsOm5vdChbZGF0YS1wbGF5ZXI9JzEnXSk6bm90KC5jZWxsLWhpdCk6bm90KC5jZWxsLW1pc3MpOmhvdmVye1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tY2VsbC1ob3Zlci1jb2xvcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi5jZWxsLXNoaXB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLXNoaXAtY29sb3IpO1xyXG59XHJcblxyXG4uY2VsbC1oaXR7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWhpdC1jb2xvcik7XHJcbn1cclxuLmNlbGwtaGl0OjphZnRlcntcclxuICAgIGNvbnRlbnQ6J1gnO1xyXG4gICAgb3BhY2l0eTowLjg7XHJcbiAgICBmb250LXNpemU6IDEuM3JlbTtcclxuICAgIHBhZGRpbmctYm90dG9tOiAxcHg7XHJcbn1cclxuLmNlbGwtbWlzc3tcclxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tbWlzcy1jb2xvcik7XHJcbn1cclxuXHJcbi5jZWxsLW1pc3M6OmFmdGVye1xyXG4gICAgY29udGVudDpcIk9cIjtcclxuICAgIG9wYWNpdHk6MC42O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDRweDtcclxufVxyXG5cclxuLmNlbGwtc3Vua3tcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXN1bmstY29sb3IpO1xyXG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XHJcbn1cclxuXHJcbi8qIGZvb3RlciAqL1xyXG5mb290ZXJ7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICB0ZXh0LWFsaWduOmNlbnRlcjtcclxuICAgIGdhcDoxNnB4O1xyXG4gICAgcGFkZGluZzowIDMycHg7XHJcbn1cclxuXHJcbiNmb290ZXItbGlua3tcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxufVxyXG5mb290ZXIgcHtcclxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICBmb250LXNpemU6IDEuMXJlbTtcclxufVxyXG5mb290ZXIgaXtcclxuICAgIGNvbG9yOnZhcigtLXRleHQtY29sb3ItbWFpbik7XHJcbn1cclxuQG1lZGlhKGhvdmVyOiBob3Zlcil7XHJcbiAgICAjZm9vdGVyLWxpbms6aG92ZXJ7XHJcbiAgICAgICAgY3Vyc29yOnBvaW50ZXI7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjIpO1xyXG4gICAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzIGVhc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIFZpY3RvcnkgQ29udGFpbmVyICovXHJcbi52aWN0b3J5LWNvbnRhaW5lcntcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIHRvcDogNTAlO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XHJcbiAgICB3aWR0aDogMzE4cHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tdGV4dC1jb2xvci1tYWluKTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhY2tncm91bmQtY29sb3ItdHJhbnNwYXJlbnQpO1xyXG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XHJcbn1cclxuLnZpY3RvcnktY29udGFpbmVyIGgyIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHRleHQtc2hhZG93OiAwIDAgMnB4IGJsYWNrLCAwIDAgNHB4IGJsYWNrLCAwIDAgNnB4IGJsYWNrO1xyXG59XHJcblxyXG4udmljdG9yeS1jb250YWluZXIgcCB7XHJcbiAgICBtYXJnaW46IDZweDtcclxufVxyXG5cclxuLnZpY3RvcnktdmljdG9yeSB7XHJcbiAgICBjb2xvcjogdmFyKC0tbWlzcy1jb2xvcik7XHJcbn1cclxuXHJcbi52aWN0b3J5LWRlZmVhdCB7XHJcbiAgICBjb2xvcjogdmFyKC0tc3Vuay1jb2xvcik7XHJcbn1cclxuXHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA4MDBweCkge1xyXG4gICAgOnJvb3Qge1xyXG4gICAgICAgIC0taGVhZGVyLWhlaWdodDogODBweDtcclxuICAgICAgICAtLWJvYXJkLXNpemU6IDI3OHB4O1xyXG4gICAgICAgIC0tY2VsbC1zaXplOiAyNnB4O1xyXG4gICAgfVxyXG4gICAgaGVhZGVye1xyXG4gICAgICAgIHdpZHRoOjQwMHB4O1xyXG4gICAgfVxyXG5cclxuICAgIGhlYWRlciBidXR0b24ge1xyXG4gICAgICAgIGhlaWdodDogMjhweDtcclxuICAgICAgICB3aWR0aDogMTAwcHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAwLjlyZW07XHJcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDJweDtcclxuICAgIH1cclxuXHJcbiAgICAjZ2FtZS1jb250YWluZXIge1xyXG4gICAgICAgIGdhcDogMjBweDtcclxuICAgIH1cclxuXHJcbiAgICAuc3RhcnQtZ2FtZS1idXR0b24sXHJcbiAgICAuc2V0dXAtYnV0dG9uLXJhbmRvbSB7XHJcbiAgICAgICAgd2lkdGg6IDEwMHB4O1xyXG4gICAgICAgIGhlaWdodDogMjhweDtcclxuICAgIH1cclxuXHJcbiAgICAuc2V0dXAtYnV0dG9uLXN0YXJ0IHtcclxuICAgICAgICBmb250LXNpemU6IDAuOXJlbTtcclxuICAgIH1cclxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxVQUFVO0FBQ1Y7SUFDSSxzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLGlCQUFpQjs7SUFFakIsc0NBQXNDO0lBQ3RDLHdEQUF3RDtJQUN4RCxnQ0FBZ0M7SUFDaEMsc0NBQXNDO0lBQ3RDLG9DQUFvQztJQUNwQyxnQ0FBZ0M7SUFDaEMsK0JBQStCO0lBQy9CLGdDQUFnQztJQUNoQyxnQ0FBZ0M7SUFDaEMsa0NBQWtDO0lBQ2xDLHFDQUFxQztJQUNyQyxrQ0FBa0M7SUFDbEMsd0NBQXdDO0lBQ3hDLDJCQUEyQjtBQUMvQjtBQUNBO0lBQ0ksbUNBQW1DO0lBQ25DLHFEQUFxRDtJQUNyRCw2QkFBNkI7SUFDN0IsbUNBQW1DO0lBQ25DLHVDQUF1QztJQUN2QyxnQ0FBZ0M7SUFDaEMsNkJBQTZCO0lBQzdCLDhCQUE4QjtJQUM5Qiw4QkFBOEI7SUFDOUIscUNBQXFDO0lBQ3JDLHFDQUFxQztJQUNyQywrQkFBK0I7SUFDL0IscUNBQXFDO0lBQ3JDLDJCQUEyQjtBQUMvQjs7QUFFQTs7O0lBR0ksc0JBQXNCO0FBQzFCO0FBQ0EsYUFBYTtBQUNiO0lBQ0ksU0FBUztJQUNULFVBQVU7SUFDVix3Q0FBd0M7SUFDeEMsa0NBQWtDO0lBQ2xDLDRCQUE0QjtBQUNoQzs7QUFFQTtJQUNJLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsWUFBWTtJQUNaLHNCQUFzQjtJQUN0Qix1QkFBdUI7SUFDdkIsbUJBQW1CO0lBQ25CLGdCQUFnQjtBQUNwQjtBQUNBO0lBQ0ksUUFBUTtBQUNaO0FBQ0EsV0FBVztBQUNYO0lBQ0ksWUFBWTtJQUNaLCtCQUErQjtJQUMvQixrQkFBa0I7SUFDbEIsV0FBVztBQUNmOztBQUVBO0lBQ0ksV0FBVztJQUNYLFlBQVk7SUFDWixjQUFjO0lBQ2Qsa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksbUNBQW1DO0lBQ25DLDRCQUE0QjtJQUM1QixZQUFZO0lBQ1osdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQix3Q0FBd0M7SUFDeEMsa0JBQWtCO0lBQ2xCLHFDQUFxQztBQUN6QztBQUNBO0lBQ0ksNENBQTRDO0lBQzVDLFVBQVU7QUFDZDs7QUFFQTtJQUNJO1FBQ0ksY0FBYztRQUNkLGlCQUFpQjtRQUNqQjtJQUNKO0FBQ0o7O0FBRUEsbUJBQW1COztBQUVuQjtJQUNJLFlBQVk7SUFDWix1QkFBdUI7SUFDdkIscUJBQXFCO0lBQ3JCLGNBQWM7SUFDZCxRQUFRO0FBQ1o7QUFDQSxpQkFBaUI7QUFDakI7SUFDSSxZQUFZO0lBQ1oscUJBQXFCO0lBQ3JCLDhCQUE4QjtJQUM5Qix3QkFBd0I7SUFDeEIsb0NBQW9DO0lBQ3BDLGlCQUFpQjs7QUFFckI7QUFDQTtJQUNJLFNBQVM7SUFDVCxpQkFBaUI7QUFDckI7QUFDQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsc0JBQXNCO0FBQzFCO0FBQ0E7SUFDSSxZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWiwyQkFBMkI7SUFDM0IsOEJBQThCO0lBQzlCLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLFNBQVM7SUFDVCxvQkFBb0I7QUFDeEI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsbUJBQW1CO0lBQ25CLE9BQU87SUFDUCxrQkFBa0I7SUFDbEIsVUFBVTtBQUNkO0FBQ0E7SUFDSSxzQkFBc0I7QUFDMUI7QUFDQTtJQUNJLCtCQUErQjtJQUMvQixZQUFZO0FBQ2hCO0FBQ0E7SUFDSSxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLFNBQVM7QUFDYjs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osWUFBWTtBQUNoQjtBQUNBO0lBQ0kseUNBQXlDO0FBQzdDOztBQUVBO0lBQ0ksdUJBQXVCO0lBQ3ZCLHVCQUF1QjtJQUN2Qix5Q0FBeUM7SUFDekMsMENBQTBDO0FBQzlDOztBQUVBO0lBQ0ksWUFBWTtJQUNaLDhCQUE4QjtBQUNsQzs7QUFFQTs7SUFFSSxZQUFZO0lBQ1osV0FBVztBQUNmO0FBQ0E7SUFDSSxlQUFlO0lBQ2YsY0FBYztJQUNkLGlDQUFpQztJQUNqQywrQkFBK0I7QUFDbkM7QUFDQTtJQUNJLFlBQVk7SUFDWixvQkFBb0I7QUFDeEI7QUFDQTtJQUNJO1FBQ0ksb0JBQW9CO1FBQ3BCLGlDQUFpQztJQUNyQztBQUNKOztBQUVBLG9CQUFvQjs7QUFFcEI7SUFDSSxvQkFBb0I7QUFDeEI7O0FBRUEsaUJBQWlCO0FBQ2pCO0lBQ0ksWUFBWTtJQUNaLHFDQUFxQztJQUNyQyxrQ0FBa0M7SUFDbEMsT0FBTztBQUNYOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLGlCQUFpQjtJQUNqQix1QkFBdUI7SUFDdkIsdUJBQXVCO0lBQ3ZCLFlBQVk7SUFDWix1QkFBdUI7SUFDdkIsb0JBQW9CO0lBQ3BCLG1DQUFtQztJQUNuQywwQ0FBMEM7QUFDOUM7O0FBRUE7SUFDSSxvQkFBb0I7QUFDeEI7QUFDQTtJQUNJLG9CQUFvQjtJQUNwQixrQkFBa0I7SUFDbEIsb0JBQW9CO0lBQ3BCLFVBQVU7QUFDZDs7QUFFQTtJQUNJLGtDQUFrQztBQUN0QztBQUNBO0lBQ0ksaUNBQWlDO0FBQ3JDOztBQUVBO0lBQ0k7UUFDSSx3Q0FBd0M7SUFDNUM7QUFDSjs7QUFFQTtJQUNJLGtDQUFrQztBQUN0Qzs7QUFFQTtJQUNJLGlDQUFpQztBQUNyQztBQUNBO0lBQ0ksV0FBVztJQUNYLFdBQVc7SUFDWCxpQkFBaUI7SUFDakIsbUJBQW1CO0FBQ3ZCO0FBQ0E7SUFDSSxrQ0FBa0M7QUFDdEM7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsV0FBVztJQUNYLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLG1DQUFtQztJQUNuQyxzQ0FBc0M7QUFDMUM7O0FBRUEsV0FBVztBQUNYO0lBQ0ksWUFBWTtJQUNaLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsaUJBQWlCO0lBQ2pCLFFBQVE7SUFDUixjQUFjO0FBQ2xCOztBQUVBO0lBQ0kscUJBQXFCO0FBQ3pCO0FBQ0E7SUFDSSxnQkFBZ0I7SUFDaEIsaUJBQWlCO0FBQ3JCO0FBQ0E7SUFDSSw0QkFBNEI7QUFDaEM7QUFDQTtJQUNJO1FBQ0ksY0FBYztRQUNkLHFCQUFxQjtRQUNyQiwrQkFBK0I7SUFDbkM7QUFDSjs7QUFFQSxzQkFBc0I7QUFDdEI7SUFDSSxrQkFBa0I7SUFDbEIsU0FBUztJQUNULFFBQVE7SUFDUixnQ0FBZ0M7SUFDaEMsWUFBWTtJQUNaLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2Isd0NBQXdDO0lBQ3hDLHFEQUFxRDtJQUNyRCwwQkFBMEI7QUFDOUI7QUFDQTtJQUNJLFNBQVM7SUFDVCx3REFBd0Q7QUFDNUQ7O0FBRUE7SUFDSSxXQUFXO0FBQ2Y7O0FBRUE7SUFDSSx3QkFBd0I7QUFDNUI7O0FBRUE7SUFDSSx3QkFBd0I7QUFDNUI7OztBQUdBO0lBQ0k7UUFDSSxxQkFBcUI7UUFDckIsbUJBQW1CO1FBQ25CLGlCQUFpQjtJQUNyQjtJQUNBO1FBQ0ksV0FBVztJQUNmOztJQUVBO1FBQ0ksWUFBWTtRQUNaLFlBQVk7UUFDWixpQkFBaUI7UUFDakIsbUJBQW1CO0lBQ3ZCOztJQUVBO1FBQ0ksU0FBUztJQUNiOztJQUVBOztRQUVJLFlBQVk7UUFDWixZQUFZO0lBQ2hCOztJQUVBO1FBQ0ksaUJBQWlCO0lBQ3JCO0FBQ0pcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogc2V0dXAgKi9cXHJcXG46cm9vdHtcXHJcXG4gICAgLS1oZWFkZXItaGVpZ2h0OiAxMDBweDtcXHJcXG4gICAgLS1ib2FyZC1zaXplOiAzMThweDtcXHJcXG4gICAgLS1jZWxsLXNpemU6IDMwcHg7XFxyXFxuXFxyXFxuICAgIC0tYmFja2dyb3VuZC1jb2xvcjogcmdiKDI0MCwgMjQwLCAyNDApO1xcclxcbiAgICAtLWJhY2tncm91bmQtY29sb3ItdHJhbnNwYXJlbnQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC43KTtcXHJcXG4gICAgLS1jZWxsLWNvbG9yOiByZ2IoMjMwLCAyMzAsIDIzMCk7XFxyXFxuICAgIC0tY2VsbC1ob3Zlci1jb2xvcjogcmdiKDIwMCwgMjAwLCAyMDApO1xcclxcbiAgICAtLWNlbGwtYm9yZGVyLWNvbG9yOiByZ2IoNzAsIDcwLCA3MCk7XFxyXFxuICAgIC0tc2hpcC1jb2xvcjogcmdiKDE1MCwgMTUwLCAxNTApO1xcclxcbiAgICAtLWhpdC1jb2xvcjogcmdiKDIwNiwgMTY5LCAxMzQpO1xcclxcbiAgICAtLW1pc3MtY29sb3I6IHJnYigxNjEsIDIxNiwgMTYxKTtcXHJcXG4gICAgLS1zdW5rLWNvbG9yOiByZ2IoMjA2LCAxMzQsIDEzNCk7XFxyXFxuICAgIC0tdGV4dC1jb2xvci1tYWluOiByZ2IoNDAsIDQwLCA0MCk7XFxyXFxuICAgIC0tdGV4dC1jb2xvci1ncmV5OiByZ2IoMTAwLCAxMDAsIDEwMCk7XFxyXFxuICAgIC0tYnV0dG9uLWNvbG9yOiByZ2IoMjEwLCAyMTAsIDIxMCk7XFxyXFxuICAgIC0tYnV0dG9uLWNvbG9yLWhvdmVyOiByZ2IoMjMwLCAyMzAsIDIzMCk7XFxyXFxuICAgIC0tYnV0dG9uLWNvbG9yLWFjdGl2ZTogZ3JleTtcXHJcXG59XFxyXFxuOnJvb3QuZGFyayB7XFxyXFxuICAgIC0tYmFja2dyb3VuZC1jb2xvcjogcmdiKDMwLCAzMCwgMzApO1xcclxcbiAgICAtLWJhY2tncm91bmQtY29sb3ItdHJhbnNwYXJlbnQ6IHJnYmEoMzAsIDMwLCAzMCwgMC43KTtcXHJcXG4gICAgLS1jZWxsLWNvbG9yOiByZ2IoNDAsIDQwLCA0MCk7XFxyXFxuICAgIC0tY2VsbC1ob3Zlci1jb2xvcjogcmdiKDkwLCA5MCwgOTApO1xcclxcbiAgICAtLWNlbGwtYm9yZGVyLWNvbG9yOiByZ2IoMjIwLCAyMjAsIDIyMCk7XFxyXFxuICAgIC0tc2hpcC1jb2xvcjogcmdiKDE1MywgMTUzLCAxNTMpO1xcclxcbiAgICAtLWhpdC1jb2xvcjogcmdiKDE1NSwgOTksIDYxKTtcXHJcXG4gICAgLS1taXNzLWNvbG9yOiByZ2IoNTIsIDEwOSwgNTIpO1xcclxcbiAgICAtLXN1bmstY29sb3I6IHJnYigxNTUsIDYxLCA2MSk7XFxyXFxuICAgIC0tdGV4dC1jb2xvci1tYWluOiByZ2IoMjIwLCAyMjAsIDIyMCk7XFxyXFxuICAgIC0tdGV4dC1jb2xvci1ncmV5OiByZ2IoMTYwLCAxNjAsIDE2MCk7XFxyXFxuICAgIC0tYnV0dG9uLWNvbG9yOiByZ2IoNTAsIDUwLCA1MCk7XFxyXFxuICAgIC0tYnV0dG9uLWNvbG9yLWhvdmVyOiByZ2IoMjAsIDIwLCAyMCk7XFxyXFxuICAgIC0tYnV0dG9uLWNvbG9yLWFjdGl2ZTogZ3JleTtcXHJcXG59XFxyXFxuXFxyXFxuKixcXHJcXG4qOjpiZWZvcmUsXFxyXFxuKjo6YWZ0ZXIge1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG4vKiBjb250ZW50cyAqL1xcclxcbmJvZHkge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tYmFja2dyb3VuZC1jb2xvcik7XFxyXFxuICAgIGZvbnQtZmFtaWx5OiAnUmFsZXdheScsIHNhbnMtc2VyaWY7XFxyXFxuICAgIGNvbG9yOnZhcigtLXRleHQtY29sb3ItbWFpbik7XFxyXFxufVxcclxcblxcclxcbiNhcHAge1xcclxcbiAgICBwYWRkaW5nOiAwIDUlO1xcclxcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgZGlzcGxheTpmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG59XFxyXFxuaDN7XFxyXFxuICAgIG1hcmdpbjowO1xcclxcbn1cXHJcXG4vKiBoZWFkZXIgKi9cXHJcXG5oZWFkZXIge1xcclxcbiAgICBkaXNwbGF5OmZsZXg7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbiA7XFxyXFxuICAgIGFsaWduLWl0ZW1zOmNlbnRlcjtcXHJcXG4gICAgd2lkdGg6Njc1cHg7XFxyXFxufVxcclxcblxcclxcbmhlYWRlciBidXR0b257XFxyXFxuICAgIGhlaWdodDozMnB4O1xcclxcbiAgICB3aWR0aDogMTIwcHg7XFxyXFxuICAgIGZvbnQtc2l6ZToxcmVtO1xcclxcbiAgICBwYWRkaW5nLWJvdHRvbToycHg7XFxyXFxufVxcclxcblxcclxcbmJ1dHRvbiB7XFxyXFxuICAgIGZvbnQtZmFtaWx5OiAnRmlyYSBDb2RlJywgbW9ub3NwYWNlO1xcclxcbiAgICBjb2xvcjp2YXIoLS10ZXh0LWNvbG9yLW1haW4pO1xcclxcbiAgICBkaXNwbGF5OmZsZXg7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS10ZXh0LWNvbG9yLW1haW4pO1xcclxcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJ1dHRvbi1jb2xvcik7XFxyXFxufVxcclxcbmJ1dHRvbjphY3RpdmV7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJ1dHRvbi1jb2xvci1hY3RpdmUpO1xcclxcbiAgICBzY2FsZTowLjk1O1xcclxcbn1cXHJcXG5cXHJcXG5AbWVkaWEgKGhvdmVyOmhvdmVyKXtcXHJcXG4gICAgYnV0dG9uOmhvdmVyIHtcXHJcXG4gICAgICAgIGN1cnNvcjpwb2ludGVyO1xcclxcbiAgICAgICAgYm9yZGVyLXdpZHRoOiAycHg7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWJ1dHRvbi1jb2xvci1ob3ZlcilcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG4vKiBnYW1lIGNvbnRhaW5lciAqL1xcclxcblxcclxcbiNnYW1lLWNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6ZmxleDtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgZmxleC13cmFwOndyYXA7XFxyXFxuICAgIGdhcDo0MHB4O1xcclxcbn1cXHJcXG4vKiBwbGF5ZXIgc2V0dXAgKi9cXHJcXG4uc2V0dXAtc2hpcHMtY29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTpmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjpjb2x1bW47XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgd2lkdGg6IHZhcigtLWJvYXJkLXNpemUpO1xcclxcbiAgICBoZWlnaHQ6IGNhbGModmFyKC0tYm9hcmQtc2l6ZSkrMjVweCk7XFxyXFxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xcclxcblxcclxcbn1cXHJcXG4uc2V0dXAtc2hpcHMtaGVhZGVyIHAge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGZvbnQtc2l6ZTogMC44cmVtO1xcclxcbn1cXHJcXG4uc2V0dXAtc2hpcC1zaGlwbGlzdCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGp1c3RpZnktY29udGVudDpjZW50ZXI7XFxyXFxufVxcclxcbi5zZXR1cC1zaGlwe1xcclxcbiAgICBoZWlnaHQ6IDQwcHg7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgZGlzcGxheTpmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93LXJldmVyc2U7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLnNldHVwLXNoaXAgcHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG59XFxyXFxuXFxyXFxuLnNldHVwLXNoaXAtYm94e1xcclxcbiAgICBjdXJzb3I6Z3JhYjtcXHJcXG4gICAgZGlzcGxheTppbmxpbmUtZmxleDtcXHJcXG4gICAgZ2FwOjJweDtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICB6LWluZGV4OjIwO1xcclxcbn1cXHJcXG4uc2V0dXAtc2hpcC12ZXJ0aWNhbHtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG59XFxyXFxuLnNldHVwLXNoaXAtaGlkZSBkaXZ7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMCk7XFxyXFxuICAgIG9wYWNpdHk6IDAuNTtcXHJcXG59XFxyXFxuLnNldHVwLXNoaXAtZHJvcHBlZHtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICBsZWZ0OiAtMXB4O1xcclxcbiAgICB0b3A6IC0xcHg7XFxyXFxufVxcclxcblxcclxcbi5naG9zdC1zaGlwe1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIHotaW5kZXg6IDIwMDtcXHJcXG4gICAgb3BhY2l0eTogMC44O1xcclxcbn1cXHJcXG4uZ2hvc3Qtc2hpcD4gLnNldHVwLXNoaXAtY2VsbHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2VsbC1ob3Zlci1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5zZXR1cC1zaGlwLWNlbGwge1xcclxcbiAgICB3aWR0aDogdmFyKC0tY2VsbC1zaXplKTtcXHJcXG4gICAgaGVpZ2h0OnZhcigtLWNlbGwtc2l6ZSk7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNlbGwtaG92ZXItY29sb3IpO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jZWxsLWJvcmRlci1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5zZXR1cC1zaGlwcy1vcHRpb25ze1xcclxcbiAgICBkaXNwbGF5OmZsZXg7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG59XFxyXFxuXFxyXFxuLnN0YXJ0LWdhbWUtYnV0dG9uLFxcclxcbi5zZXR1cC1idXR0b24tcmFuZG9tIHtcXHJcXG4gICAgd2lkdGg6IDEyMHB4O1xcclxcbiAgICBoZWlnaHQ6MzZweDtcXHJcXG59XFxyXFxuLnN0YXJ0LWdhbWUtYnV0dG9ue1xcclxcbiAgICBmb250LXdlaWdodDo2MDA7XFxyXFxuICAgIGZvbnQtc2l6ZToxcmVtO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWhpdC1jb2xvcik7XFxyXFxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzIGVhc2U7XFxyXFxufVxcclxcbi5zdGFydC1nYW1lLWJ1dHRvbi1kaXNhYmxlZHtcXHJcXG4gICAgb3BhY2l0eTogMC41O1xcclxcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXHJcXG59XFxyXFxuQG1lZGlhKGhvdmVyOiBob3Zlcil7XFxyXFxuICAgIC5zZXR1cC1idXR0b24tc3RhcnQ6aG92ZXJ7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06c2NhbGUoMS4xKTtcXHJcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6cmdiKDIyNiwxMTYsMTE2KTtcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG4vKiBwbGF5ZXIgc2VjdGlvbnMgKi9cXHJcXG5cXHJcXG4uYm9hcmQtY29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XFxyXFxufVxcclxcblxcclxcbi8qIHBsYXllciBib2FyZCAqL1xcclxcbi5ib2FyZHtcXHJcXG4gICAgZGlzcGxheTpncmlkO1xcclxcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwxZnIpO1xcclxcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwxZnIpO1xcclxcbiAgICBnYXA6MnB4O1xcclxcbn1cXHJcXG5cXHJcXG4uY2VsbCB7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgY3Vyc29yOiBjcm9zc2hhaXI7XFxyXFxuICAgIGhlaWdodDp2YXIoLS1jZWxsLXNpemUpO1xcclxcbiAgICB3aWR0aDogdmFyKC0tY2VsbC1zaXplKTtcXHJcXG4gICAgZGlzcGxheTpmbGV4O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYWxpZ24tY29udGVudDpjZW50ZXI7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNlbGwtY29sb3IpO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jZWxsLWJvcmRlci1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5jZWxsLXNldHVwe1xcclxcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG59XFxyXFxuLmNlbGwtZHJhZy1vdmVye1xcclxcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG4gICAgei1pbmRleDo0MDtcXHJcXG59XFxyXFxuXFxyXFxuLmNlbGwtZHJhZy12YWxpZHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1taXNzLWNvbG9yKTtcXHJcXG59XFxyXFxuLmNlbGwtZHJhZy1pbnZhbGlke1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWhpdC1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbkBtZWRpYShob3ZlcjogaG92ZXIpe1xcclxcbiAgICAuY2VsbDpub3QoW2RhdGEtcGxheWVyPScxJ10pOm5vdCguY2VsbC1oaXQpOm5vdCguY2VsbC1taXNzKTpob3ZlcntcXHJcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tY2VsbC1ob3Zlci1jb2xvcik7XFxyXFxuICAgIH1cXHJcXG59XFxyXFxuXFxyXFxuLmNlbGwtc2hpcHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1zaGlwLWNvbG9yKTtcXHJcXG59XFxyXFxuXFxyXFxuLmNlbGwtaGl0e1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWhpdC1jb2xvcik7XFxyXFxufVxcclxcbi5jZWxsLWhpdDo6YWZ0ZXJ7XFxyXFxuICAgIGNvbnRlbnQ6J1gnO1xcclxcbiAgICBvcGFjaXR5OjAuODtcXHJcXG4gICAgZm9udC1zaXplOiAxLjNyZW07XFxyXFxuICAgIHBhZGRpbmctYm90dG9tOiAxcHg7XFxyXFxufVxcclxcbi5jZWxsLW1pc3N7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tbWlzcy1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5jZWxsLW1pc3M6OmFmdGVye1xcclxcbiAgICBjb250ZW50OlxcXCJPXFxcIjtcXHJcXG4gICAgb3BhY2l0eTowLjY7XFxyXFxuICAgIHBhZGRpbmctYm90dG9tOiA0cHg7XFxyXFxufVxcclxcblxcclxcbi5jZWxsLXN1bmt7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXN1bmstY29sb3IpO1xcclxcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgZWFzZTtcXHJcXG59XFxyXFxuXFxyXFxuLyogZm9vdGVyICovXFxyXFxuZm9vdGVye1xcclxcbiAgICBkaXNwbGF5OmZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICB0ZXh0LWFsaWduOmNlbnRlcjtcXHJcXG4gICAgZ2FwOjE2cHg7XFxyXFxuICAgIHBhZGRpbmc6MCAzMnB4O1xcclxcbn1cXHJcXG5cXHJcXG4jZm9vdGVyLWxpbmt7XFxyXFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG59XFxyXFxuZm9vdGVyIHB7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XFxyXFxuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xcclxcbn1cXHJcXG5mb290ZXIgaXtcXHJcXG4gICAgY29sb3I6dmFyKC0tdGV4dC1jb2xvci1tYWluKTtcXHJcXG59XFxyXFxuQG1lZGlhKGhvdmVyOiBob3Zlcil7XFxyXFxuICAgICNmb290ZXItbGluazpob3ZlcntcXHJcXG4gICAgICAgIGN1cnNvcjpwb2ludGVyO1xcclxcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjIpO1xcclxcbiAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMXMgZWFzZTtcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG4vKiBWaWN0b3J5IENvbnRhaW5lciAqL1xcclxcbi52aWN0b3J5LWNvbnRhaW5lcntcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICBsZWZ0OiA1MCU7XFxyXFxuICAgIHRvcDogNTAlO1xcclxcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXHJcXG4gICAgd2lkdGg6IDMxOHB4O1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICAgIHBhZGRpbmc6IDIwcHg7XFxyXFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLXRleHQtY29sb3ItbWFpbik7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhY2tncm91bmQtY29sb3ItdHJhbnNwYXJlbnQpO1xcclxcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcXHJcXG59XFxyXFxuLnZpY3RvcnktY29udGFpbmVyIGgyIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICB0ZXh0LXNoYWRvdzogMCAwIDJweCBibGFjaywgMCAwIDRweCBibGFjaywgMCAwIDZweCBibGFjaztcXHJcXG59XFxyXFxuXFxyXFxuLnZpY3RvcnktY29udGFpbmVyIHAge1xcclxcbiAgICBtYXJnaW46IDZweDtcXHJcXG59XFxyXFxuXFxyXFxuLnZpY3RvcnktdmljdG9yeSB7XFxyXFxuICAgIGNvbG9yOiB2YXIoLS1taXNzLWNvbG9yKTtcXHJcXG59XFxyXFxuXFxyXFxuLnZpY3RvcnktZGVmZWF0IHtcXHJcXG4gICAgY29sb3I6IHZhcigtLXN1bmstY29sb3IpO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA4MDBweCkge1xcclxcbiAgICA6cm9vdCB7XFxyXFxuICAgICAgICAtLWhlYWRlci1oZWlnaHQ6IDgwcHg7XFxyXFxuICAgICAgICAtLWJvYXJkLXNpemU6IDI3OHB4O1xcclxcbiAgICAgICAgLS1jZWxsLXNpemU6IDI2cHg7XFxyXFxuICAgIH1cXHJcXG4gICAgaGVhZGVye1xcclxcbiAgICAgICAgd2lkdGg6NDAwcHg7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgaGVhZGVyIGJ1dHRvbiB7XFxyXFxuICAgICAgICBoZWlnaHQ6IDI4cHg7XFxyXFxuICAgICAgICB3aWR0aDogMTAwcHg7XFxyXFxuICAgICAgICBmb250LXNpemU6IDAuOXJlbTtcXHJcXG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAycHg7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgI2dhbWUtY29udGFpbmVyIHtcXHJcXG4gICAgICAgIGdhcDogMjBweDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuc3RhcnQtZ2FtZS1idXR0b24sXFxyXFxuICAgIC5zZXR1cC1idXR0b24tcmFuZG9tIHtcXHJcXG4gICAgICAgIHdpZHRoOiAxMDBweDtcXHJcXG4gICAgICAgIGhlaWdodDogMjhweDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuc2V0dXAtYnV0dG9uLXN0YXJ0IHtcXHJcXG4gICAgICAgIGZvbnQtc2l6ZTogMC45cmVtO1xcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJ1xyXG5pbXBvcnQgJy4vbW9kdWxlcy9ET00vQ29udHJvbGxlcidcclxuXHJcbiJdLCJuYW1lcyI6WyJHYW1lIiwiY3JlYXRlSGVhZGVyIiwiY3JlYXRlRm9vdGVyIiwic2V0dXAiLCJhcHAiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImhlYWRlciIsImZvb3RlciIsImdhbWVDb250YWluZXIiLCJuZXdHYW1lQnV0dG9uIiwicXVlcnlTZWxlY3RvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJuZXdHYW1lIiwiZ2FtZSIsInN0YXJ0R2FtZSIsInBsYXllcjEiLCJwbGF5ZXIyIiwiZHJhd0dhbWUiLCJuZXdQbGF5ZXIxIiwiQ3JlYXRlUGxheWVyIiwibmV3UGxheWVyMiIsImdhbWVib2FyZCIsInBsYWNlU2hpcHNSYW5kb21seSIsImRyYXdTZXR1cCIsInN0YXJ0R2FtZUJ1dHRvbiIsImV2ZW50IiwicGxhY2VkU2hpcHMiLCJsZW5ndGgiLCJjbGVhckNvbnRhaW5lciIsImNvbnRhaW5lciIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsInBsYXllcjFCb2FyZENvbnRhaW5lciIsImRyYXdCb2FyZENvbnRhaW5lciIsInBsYXllcjJCb2FyZENvbnRhaW5lciIsInBvcHVsYXRlQm9hcmQiLCJhcHBlbmQiLCJwbGF5ZXIiLCJzZXR1cEJvYXJkIiwiZHJhd1NldHVwQm9hcmQiLCJzZXR1cFNoaXBzIiwiZHJhd1NldHVwU2hpcHMiLCJzaGlwcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJnYW1lU2l6ZU9ic2VydmVyIiwiUmVzaXplT2JzZXJ2ZXIiLCJlbnRyeSIsImNvbnRlbnRSZWN0IiwiaGVpZ2h0Iiwic3R5bGUiLCJ3aWR0aCIsIm9ic2VydmUiLCJib2FyZENvbnRhaW5lciIsImNsYXNzTGlzdCIsImFkZCIsInBsYXllck5hbWUiLCJpc0FJIiwidGV4dENvbnRlbnQiLCJuYW1lIiwicGxheWVyQm9hcmQiLCJkcmF3Qm9hcmQiLCJib2FyZCIsInJvdyIsImNvbCIsImNlbGwiLCJkYXRhc2V0IiwibnVtYmVyIiwibGlzdGVuRm9yQXR0YWNrIiwic3F1YXJlIiwicmVtb3ZlIiwidGFyZ2V0IiwiZGVmZW5kaW5nUGxheWVyTnVtYmVyIiwiYXR0YWNraW5nUGxheWVyTnVtYmVyIiwiYXR0YWNraW5nUGxheWVyIiwiZGVmZW5kaW5nUGxheWVyIiwiY3VycmVudFBsYXllciIsInJlc3VsdCIsImxvY2F0aW9uIiwic2hpcCIsImF0dGFjayIsInN0eWxlQXR0YWNrZWRDZWxsIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5leHRUdXJuIiwiY2FsbEFJQXR0YWNrIiwiQUkiLCJpc1N1bmsiLCJzcXVhcmVzIiwiZm9yRWFjaCIsIndpbm5lciIsImNoZWNrR2FtZU92ZXIiLCJlbmRHYW1lIiwic3dpdGNoVHVybiIsImNlbGxzIiwiZHJhd1ZpY3RvcnlDb250YWluZXIiLCJsb3NlciIsInZpY3RvcnlDb250YWluZXIiLCJ2aWN0b3J5VGl0bGUiLCJ3aW5uZXJUZXh0IiwibG9zZXJUZXh0IiwiZm9vdGVyQm94IiwiYXV0aG9yTmFtZSIsImZvb3RlckxpbmsiLCJzZXRBdHRyaWJ1dGUiLCJnaXRodWJMb2dvIiwiZ2V0VGhlbWUiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwidG9nZ2xlRGFya1RoZW1lIiwidG9nZ2xlIiwiZGFya01vZGVCdXR0b24iLCJ0b2dnbGVEYXJrU3RvcmFnZSIsInNldEl0ZW0iLCJjaGVja0RhcmtNb2RlIiwid2luZG93IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJ0aXRsZSIsInNoaXBUeXBlcyIsImRyYWdEYXRhIiwic2hpcE9iamVjdCIsInNoaXBFbGVtZW50Iiwib2Zmc2V0WCIsIm9mZnNldFkiLCJyb3dEaWZmIiwiY29sRGlmZiIsInNoaXBIb21lQ29udGFpbmVyIiwicHJldkNvbnRhaW5lciIsInByZXZDZWxsIiwiY3VycmVudENlbGwiLCJzZXR1cFBsYXllciIsInNldHVwQ2VsbHMiLCJkcmFnT3ZlciIsImRyYWdFbnRlciIsImRyYWdMZWF2ZSIsImRyb3AiLCJkcmFnU3RhcnQiLCJ0eXBlIiwicGFyZW50RWxlbWVudCIsInVwZGF0ZUNlbGxEaWZmIiwiYWxpZ25tZW50Iiwic2V0VGltZW91dCIsImNvbnRhaW5zIiwicGFyc2VJbnQiLCJnYW1lQm9hcmQiLCJyZW1vdmVTaGlwIiwiZHJhZ0VuZCIsIkRyYWdFdmVudCIsInByZXZlbnREZWZhdWx0IiwidG91Y2hDZWxsIiwic2hpcFNxdWFyZXMiLCJjaGVja1BsYWNlbWVudCIsImZpbHRlciIsImNoZWNrU3F1YXJlIiwidW5kZWZpbmVkIiwiY2VsbE92ZXJsYXkiLCJpc1ZhbGlkIiwibGVmdENlbGxzIiwidG91Y2hlZCIsIm9yaWdpbkNlbGwiLCJwbGFjZVNoaXAiLCJwcmV2Um93IiwicHJldkNvbCIsInByZXZpb3VzQ29udGFpbmVyIiwic2V0dXBTaGlwQ29udGFpbmVyIiwic2V0dXBTaGlwSGVhZGVyIiwic2V0dXBTaGlwVGl0bGUiLCJzZXR1cFNoaXBJbmZvIiwic2V0dXBTaGlwT3B0aW9ucyIsInJhbmRvbVNoaXBzIiwicmFuZG9taXplRmxlZXQiLCJzaGlwTGlzdCIsImRyYXdTaGlwIiwic2hpcENvbnRhaW5lciIsInNoaXBCb3giLCJpIiwic2hpcENlbGwiLCJkcmFnZ2FibGUiLCJyb3RhdGVTaGlwIiwieCIsInRvdWNoZXMiLCJjbGllbnRYIiwieSIsImNsaWVudFkiLCJlbGVtZW50cyIsImVsZW1lbnRzRnJvbVBvaW50IiwiZWxlbWVudCIsInByZXZCb3giLCJuZXdCb3giLCJjbG9uZU5vZGUiLCJ0b3VjaExvY2F0aW9uIiwidGFyZ2V0VG91Y2hlcyIsImxlZnQiLCJwYWdlWCIsInRvcCIsInBhZ2VZIiwiY2hhbmdlZFRvdWNoZXMiLCJkYXRlIiwiRGF0ZSIsInRpbWUiLCJnZXRUaW1lIiwidGFwSW50ZXJ2YWwiLCJsYXN0Q2hpbGQiLCJsYXN0Q2xpY2siLCJzaGlwTmFtZSIsIm9yaWdpbiIsImJjciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNlbGxTaXplIiwib2Zmc2V0V2lkdGgiLCJNYXRoIiwiZmxvb3IiLCJzaGlwTGVuZ3RoIiwib3JpZ2luUm93IiwicHJhc2VJbnQiLCJvcmlnaW5Db2wiLCJjb25zb2xlIiwibG9nIiwib3JpZ2luQWxpZ25tZW50IiwibmV3QWxpZ25tZW50IiwiYXR0ZW1wdHMiLCJuZXdPcmlnaW5DZWxsIiwiZGF0YVNldCIsIlNoaXAiLCJHYW1lYm9hcmQiLCJjcmVhdGVCb2FyZCIsImJvYXJkQXJyYXkiLCJyb3dBcnJheSIsImNsZWFyQm9hcmQiLCJzaGlwVHlwZSIsInB1c2giLCJ2YWxpZFBsYWNlbWVudCIsImV2ZXJ5IiwiY2xlYXJGbGVldCIsInBvcCIsInNoaXBzSW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwicGxhY2VTaGlwUmFuZG9tbHkiLCJyYW5kb21BbGlnbm1lbnQiLCJyYW5kb20iLCJnZXRSYW5kb21TcXVhcmUiLCJyb3dEaWYiLCJjb2xEaWYiLCJyZWNlaXZlSGl0IiwiYXR0YWNrZWRTaGlwIiwiaGl0IiwiY2hlY2tBbGxTaGlwc1N1bmsiLCJlbmVteUxvZ2ljIiwiYXZhaWxhYmxlQXR0YWNrcyIsImNyZWF0ZUF0dGFja0FycmF5IiwibGFzdFNoaXAiLCJsYXN0SGl0QXJyYXkiLCJEaXJlY3Rpb25zIiwiY29uY3VycmVudE1pc3NlcyIsImVuZW15IiwiY2hlY2tJZlNoaXBJc1N1bmsiLCJlbmVteUJvYXJkIiwiYXR0YWNrQ29vcmRzIiwiZ2V0UmFuZG9tQ2VsbCIsImxhc3RIaXQiLCJhZGphY2VudENlbGxzIiwiZ2V0QWxsQWRqYWNlbnRDZWxscyIsImFkamFjZW50SGl0cyIsImNlbGxSZXN1bHQiLCJhZGphY2VudENlbGwiLCJyYW5kb21BZGphY2VudEhpdCIsIm5leHRDZWxsIiwiZ2V0TmV4dEF0dGFja2FibGVDZWxsIiwiZmxpcERpcmVjdGlvbiIsImRpcmVjdGlvbiIsImdldEFkamFjZW5jeSIsImFkamFjZW50Q2VsbFRvQXR0YWNrIiwiYXJyYXlSb3ciLCJhcnJheUNvbCIsInJlbW92ZUNlbGxGcm9tQXZhaWxhYmxlQXR0YWNrcyIsIm1hcCIsImdldEFkamFjZW50Q2VsbCIsIm5laWdoYm91ckNlbGwiLCJvcHBvc2l0ZURpcmVjdGlvbiIsImRpc3RhbmNlIiwiZGlmZiIsImFicyIsIm5leHRDZWxsU3RhdHVzIiwiZW5lbXlTaGlwIiwiaGl0U2hpcCIsInNvbWUiLCJpbmRleCIsImZpbmRJbmRleCIsImF0dGFja0FycmF5IiwiUGxheWVyIiwicGxheWVyTnVtIiwiY2FycmllciIsImJhdHRsZXNoaXAiLCJkZXN0cm95ZXIiLCJzdWJtYXJpbmUiLCJwYXRyb2wiLCJoaXRzIl0sInNvdXJjZVJvb3QiOiIifQ==