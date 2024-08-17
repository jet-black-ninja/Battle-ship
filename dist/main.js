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
  const startGameButton = document.querySelector('.start-game-button');
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
      if (player && player.isAI) cell.addEventListener('click', listenForAttack, false);
    }
  }
  return board;
}
function populateBoard(player, board) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const square = player.gameboard.board[row][col];
      const cell = board.querySelector(`[data-row='${row}'][data-col='${col}']`);
      if (square !== null && typeof square === 'object') {
        cell.classList.add('cell-ship');
      } else cell.classList.remove('cell-ship');
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
  const cell = document.querySelector(`[data-player='${defendingPlayerNumber}'][data-row='${location[0]}'][data-col='${location[1]}']`);
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
        const cell = document.querySelector(`[data-player='${defendingPlayerNumber}'][data-row='${square[0]}'][data-col='${square[1]}']`);
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
    console.log(dragData.shipElement);
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
    player.gameboard.removeShip([row, col]);
  }
}
function dragEnd(event) {
  dragData.shipElement.classList.remove('setup-ship-hide');
}
function dragEnter(event) {
  dragLeave(event);
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
  const shipSquares = player.gameboard.checkPlacement(_shipTypes__WEBPACK_IMPORTED_MODULE_0__["default"][type].length, [row, col], dragData.shipElement.dataset.alignment);
  shipSquares.squares = shipSquares.squares.filter(square => {
    return player.gameboard.checkSquare(square[0], square[1]) !== undefined;
  });
  shipSquares.squares.forEach(square => {
    const cell = board.querySelector(`[data-row='${square[0]}'][data-col='${square[1]}']`);
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
  if (event.type === 'touchend') {
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
  player.gameboard.removeShip([originRow, originCol]);
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
  let shipSquares = player.gameboard.checkPlacement(shipLength, [row, col], newAlignment);
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
    if (row < 0 || col < 0) return undefined;
    if (row > 9 || col > 9) return undefined;else return this.board[row][col];
  }
  function clearFleet(fleet) {
    while (fleet.length > 0) fleet.pop();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBMkI7QUFDUztBQUNBO0FBQ0g7QUFFakMsTUFBTUksR0FBRyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7QUFDekNGLEdBQUcsQ0FBQ0csRUFBRSxHQUFHLEtBQUs7QUFDZEYsUUFBUSxDQUFDRyxJQUFJLENBQUNDLFdBQVcsQ0FBQ0wsR0FBRyxDQUFDO0FBQzlCLE1BQU1NLE1BQU0sR0FBR1QsbURBQVksQ0FBQyxDQUFDO0FBQzdCLE1BQU1VLE1BQU0sR0FBR1QsbURBQVksQ0FBQyxDQUFDO0FBQzdCLE1BQU1VLGFBQWEsR0FBR1AsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0FBQ25ETSxhQUFhLENBQUNMLEVBQUUsR0FBRyxnQkFBZ0I7QUFDbkNILEdBQUcsQ0FBQ0ssV0FBVyxDQUFDQyxNQUFNLENBQUM7QUFDdkJOLEdBQUcsQ0FBQ0ssV0FBVyxDQUFDRyxhQUFhLENBQUM7QUFDOUJSLEdBQUcsQ0FBQ0ssV0FBVyxDQUFDRSxNQUFNLENBQUM7QUFFdkIsTUFBTUUsYUFBYSxHQUFHSCxNQUFNLENBQUNJLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztBQUM5REQsYUFBYSxDQUFDRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUNDLE9BQU8sQ0FBQztBQUMvQyxNQUFNQyxJQUFJLEdBQUdqQixpREFBSSxDQUFDLENBQUM7QUFDbkJnQixPQUFPLENBQUMsQ0FBQztBQUVULFNBQVNFLFNBQVNBLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxFQUFDO0VBQ2hDSCxJQUFJLENBQUNELE9BQU8sQ0FBQ0csT0FBTyxFQUFFQyxPQUFPLENBQUM7RUFDOUJDLFFBQVEsQ0FBQyxDQUFDO0FBQ2Q7QUFFQSxTQUFTTCxPQUFPQSxDQUFBLEVBQUU7RUFDZCxNQUFNTSxVQUFVLEdBQUdMLElBQUksQ0FBQ00sWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7RUFDL0MsTUFBTUMsVUFBVSxHQUFHUCxJQUFJLENBQUNNLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0VBQzlDQyxVQUFVLENBQUNDLFNBQVMsQ0FBQ0Msa0JBQWtCLENBQUMsQ0FBQztFQUN6Q0MsU0FBUyxDQUFDTCxVQUFVLENBQUM7RUFDckIsTUFBTU0sZUFBZSxHQUFHdkIsUUFBUSxDQUFDUyxhQUFhLENBQUMsb0JBQW9CLENBQUM7RUFDcEVjLGVBQWUsQ0FBQ2IsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVVjLEtBQUssRUFBQztJQUN0RCxJQUFHUCxVQUFVLENBQUNHLFNBQVMsQ0FBQ0ssV0FBVyxDQUFDQyxNQUFNLEtBQUssQ0FBQyxFQUFDO01BQzdDYixTQUFTLENBQUNJLFVBQVUsRUFBRUUsVUFBVSxDQUFDO0lBQ3JDO0VBQ0osQ0FBQyxDQUFDO0FBQ047QUFFQSxTQUFTUSxjQUFjQSxDQUFDQyxTQUFTLEVBQUM7RUFDOUIsT0FBTUEsU0FBUyxDQUFDQyxVQUFVLEVBQUVELFNBQVMsQ0FBQ0UsV0FBVyxDQUFDRixTQUFTLENBQUNDLFVBQVUsQ0FBQztBQUMzRTtBQUNBLFNBQVNiLFFBQVFBLENBQUEsRUFBRTtFQUNmVyxjQUFjLENBQUNwQixhQUFhLENBQUM7RUFDN0IsTUFBTXdCLHFCQUFxQixHQUFHQyxrQkFBa0IsQ0FBQ3BCLElBQUksQ0FBQ0UsT0FBTyxDQUFDO0VBQzlELE1BQU1tQixxQkFBcUIsR0FBR0Qsa0JBQWtCLENBQUNwQixJQUFJLENBQUNHLE9BQU8sQ0FBQztFQUM5RG1CLGFBQWEsQ0FBQ3RCLElBQUksQ0FBQ0UsT0FBTyxFQUFFaUIscUJBQXFCLENBQUN0QixhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDMUVGLGFBQWEsQ0FBQzRCLE1BQU0sQ0FBQ0oscUJBQXFCLEVBQUVFLHFCQUFxQixDQUFDO0FBQ3RFO0FBRUEsU0FBU1gsU0FBU0EsQ0FBQ2MsTUFBTSxFQUFDO0VBQ3RCVCxjQUFjLENBQUNwQixhQUFhLENBQUM7RUFDN0IsTUFBTThCLFVBQVUsR0FBR3ZDLG1EQUFLLENBQUN3QyxjQUFjLENBQUNGLE1BQU0sRUFBRUosa0JBQWtCLENBQUNJLE1BQU0sQ0FBQyxDQUFDO0VBQzNFLE1BQU1HLFVBQVUsR0FBR3pDLG1EQUFLLENBQUMwQyxjQUFjLENBQUMsQ0FBQztFQUN6QyxNQUFNQyxLQUFLLEdBQUdGLFVBQVUsQ0FBQ0csZ0JBQWdCLENBQUMsaUJBQWlCLENBQUM7RUFDNURuQyxhQUFhLENBQUM0QixNQUFNLENBQUNFLFVBQVUsRUFBRUUsVUFBVSxDQUFDO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQSxNQUFNSSxnQkFBZ0IsR0FBRyxJQUFJQyxjQUFjLENBQUNDLEtBQUssSUFBSTtFQUNqRCxJQUFHQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNDLFdBQVcsQ0FBQ0MsTUFBTSxHQUFDLEdBQUcsRUFDOUIxQyxNQUFNLENBQUMyQyxLQUFLLENBQUNDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FFN0I1QyxNQUFNLENBQUMyQyxLQUFLLENBQUNDLEtBQUssR0FBRyxHQUFHSixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNDLFdBQVcsQ0FBQ0csS0FBSyxJQUFJO0FBQzlELENBQUMsQ0FBQztBQUNGTixnQkFBZ0IsQ0FBQ08sT0FBTyxDQUFDM0MsYUFBYSxDQUFDOztBQUV2Qzs7QUFFQSxTQUFTeUIsa0JBQWtCQSxDQUFDSSxNQUFNLEVBQUM7RUFDL0IsTUFBTWUsY0FBYyxHQUFHbkQsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3BEa0QsY0FBYyxDQUFDQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztFQUMvQyxNQUFNQyxVQUFVLEdBQUd0RCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDL0MsSUFBR21DLE1BQU0sQ0FBQ21CLElBQUksRUFBRUQsVUFBVSxDQUFDRSxXQUFXLEdBQUcsR0FBR3BCLE1BQU0sQ0FBQ3FCLElBQUksVUFBVSxDQUFDLEtBQzdESCxVQUFVLENBQUNFLFdBQVcsR0FBRyxZQUFZO0VBQzFDLE1BQU1FLFdBQVcsR0FBR0MsU0FBUyxDQUFDdkIsTUFBTSxDQUFDO0VBQ3JDZSxjQUFjLENBQUNoQixNQUFNLENBQUNtQixVQUFVLEVBQUVJLFdBQVcsQ0FBQztFQUM5QyxPQUFPUCxjQUFjO0FBQ3pCO0FBRUEsU0FBU1EsU0FBU0EsQ0FBQ3ZCLE1BQU0sRUFBQztFQUN0QixNQUFNd0IsS0FBSyxHQUFHNUQsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzNDMkQsS0FBSyxDQUFDUixTQUFTLENBQUNDLEdBQUcsQ0FBQyxPQUFPLENBQUM7RUFDNUIsS0FBSSxJQUFJUSxHQUFHLEdBQUcsQ0FBQyxFQUFFQSxHQUFHLEdBQUcsRUFBRSxFQUFHQSxHQUFHLEVBQUUsRUFBQztJQUM5QixLQUFJLElBQUlDLEdBQUcsR0FBRyxDQUFDLEVBQUdBLEdBQUcsR0FBRyxFQUFFLEVBQUdBLEdBQUcsRUFBRSxFQUFDO01BQy9CLE1BQU1DLElBQUksR0FBRy9ELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztNQUMxQzhELElBQUksQ0FBQ1gsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO01BQzFCVSxJQUFJLENBQUNDLE9BQU8sQ0FBQzVCLE1BQU0sR0FBR0EsTUFBTSxHQUFHQSxNQUFNLENBQUM2QixNQUFNLEdBQUcsQ0FBQztNQUNoREYsSUFBSSxDQUFDQyxPQUFPLENBQUNILEdBQUcsR0FBR0EsR0FBRztNQUN0QkUsSUFBSSxDQUFDQyxPQUFPLENBQUNGLEdBQUcsR0FBR0EsR0FBRztNQUN0QkYsS0FBSyxDQUFDeEQsV0FBVyxDQUFDMkQsSUFBSSxDQUFDO01BQ3ZCLElBQUczQixNQUFNLElBQUlBLE1BQU0sQ0FBQ21CLElBQUksRUFBRVEsSUFBSSxDQUFDckQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFd0QsZUFBZSxFQUFFLEtBQUssQ0FBQztJQUNwRjtFQUNKO0VBQ0EsT0FBT04sS0FBSztBQUNoQjtBQUVBLFNBQVMxQixhQUFhQSxDQUFDRSxNQUFNLEVBQUN3QixLQUFLLEVBQUM7RUFDaEMsS0FBSSxJQUFJQyxHQUFHLEdBQUcsQ0FBQyxFQUFHQSxHQUFHLEdBQUcsRUFBRSxFQUFHQSxHQUFHLEVBQUUsRUFBQztJQUMvQixLQUFJLElBQUlDLEdBQUcsR0FBRyxDQUFDLEVBQUdBLEdBQUcsR0FBRyxFQUFFLEVBQUdBLEdBQUcsRUFBRSxFQUFDO01BQy9CLE1BQU1LLE1BQU0sR0FBRy9CLE1BQU0sQ0FBQ2hCLFNBQVMsQ0FBQ3dDLEtBQUssQ0FBQ0MsR0FBRyxDQUFDLENBQUNDLEdBQUcsQ0FBQztNQUMvQyxNQUFNQyxJQUFJLEdBQUdILEtBQUssQ0FBQ25ELGFBQWEsQ0FBQyxjQUFjb0QsR0FBRyxnQkFBZ0JDLEdBQUcsSUFBSSxDQUFDO01BQzFFLElBQUdLLE1BQU0sS0FBSyxJQUFJLElBQUksT0FBT0EsTUFBTSxLQUFLLFFBQVEsRUFBQztRQUM3Q0osSUFBSSxDQUFDWCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxXQUFXLENBQUM7TUFDbkMsQ0FBQyxNQUVHVSxJQUFJLENBQUNYLFNBQVMsQ0FBQ2dCLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDMUM7RUFDSjtBQUNKOztBQUVBO0FBQ0E7O0FBRUEsU0FBU0YsZUFBZUEsQ0FBQzFDLEtBQUssRUFBQztFQUMzQixNQUFNdUMsSUFBSSxHQUFHdkMsS0FBSyxDQUFDNkMsTUFBTTtFQUN6QixNQUFNQyxxQkFBcUIsR0FBRVAsSUFBSSxDQUFDQyxPQUFPLENBQUM1QixNQUFNO0VBQ2hELE1BQU1tQyxxQkFBcUIsR0FBR0QscUJBQXFCLEtBQUssR0FBRyxHQUFFLEdBQUcsR0FBRSxHQUFHO0VBQ3JFLE1BQU1FLGVBQWUsR0FBRzVELElBQUksQ0FBQyxTQUFTMkQscUJBQXFCLEVBQUUsQ0FBQztFQUM5RCxNQUFNRSxlQUFlLEdBQUc3RCxJQUFJLENBQUMsU0FBUzBELHFCQUFxQixFQUFFLENBQUM7RUFDOUQsSUFBRzFELElBQUksQ0FBQzhELGFBQWEsS0FBS0YsZUFBZSxFQUFFO0VBQzNDLE1BQU1YLEdBQUcsR0FBR0UsSUFBSSxDQUFDQyxPQUFPLENBQUNILEdBQUc7RUFDNUIsTUFBTUMsR0FBRyxHQUFHQyxJQUFJLENBQUNDLE9BQU8sQ0FBQ0YsR0FBRztFQUM1QixNQUFNLENBQUNhLE1BQU0sRUFBRUMsUUFBUSxFQUFHQyxJQUFJLENBQUMsR0FBR0wsZUFBZSxDQUFDTSxNQUFNLENBQUNMLGVBQWUsRUFBRVosR0FBRyxFQUFFQyxHQUFHLENBQUM7RUFDbkZpQixpQkFBaUIsQ0FBQ2hCLElBQUksRUFBRU8scUJBQXFCLEVBQUVLLE1BQU0sRUFBR0UsSUFBSSxDQUFDO0VBQzdEZCxJQUFJLENBQUNpQixtQkFBbUIsQ0FBQyxPQUFPLEVBQUdkLGVBQWUsRUFBRSxLQUFLLENBQUM7RUFDMURlLFFBQVEsQ0FBQyxDQUFDO0FBQ2Q7QUFFQSxTQUFTQyxZQUFZQSxDQUFDQyxFQUFFLEVBQUM7RUFDekIsSUFBR0EsRUFBRSxLQUFLdkUsSUFBSSxDQUFDOEQsYUFBYSxFQUFDO0VBQzdCLE1BQU1KLHFCQUFxQixHQUFHMUQsSUFBSSxDQUFDNkQsZUFBZSxLQUFJN0QsSUFBSSxDQUFDRSxPQUFPLEdBQUUsR0FBRyxHQUFDLEdBQUc7RUFDM0UsTUFBTSxDQUFDNkQsTUFBTSxFQUFHQyxRQUFRLEVBQUdDLElBQUksQ0FBQyxHQUFFTSxFQUFFLENBQUNMLE1BQU0sQ0FBQ2xFLElBQUksQ0FBQzZELGVBQWUsQ0FBQztFQUNqRSxNQUFNVixJQUFJLEdBQUcvRCxRQUFRLENBQUNTLGFBQWEsQ0FBQyxpQkFBaUI2RCxxQkFBcUIsZ0JBQWdCTSxRQUFRLENBQUMsQ0FBQyxDQUFDLGdCQUFnQkEsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDcklHLGlCQUFpQixDQUFDaEIsSUFBSSxFQUFFTyxxQkFBcUIsRUFBRUssTUFBTSxFQUFFRSxJQUFJLENBQUM7RUFDNURJLFFBQVEsQ0FBQyxDQUFDO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBLFNBQVNGLGlCQUFpQkEsQ0FBQ2hCLElBQUksRUFBRU8scUJBQXFCLEVBQUVLLE1BQU0sRUFBR0UsSUFBSSxFQUFFO0VBQ25FLElBQUdGLE1BQU0sS0FBSyxLQUFLLEVBQUM7SUFDaEJaLElBQUksQ0FBQ1gsU0FBUyxDQUFDQyxHQUFHLENBQUMsVUFBVSxDQUFDO0lBQzlCLElBQUd3QixJQUFJLENBQUNPLE1BQU0sQ0FBQyxDQUFDLEVBQUM7TUFDYlAsSUFBSSxDQUFDUSxPQUFPLENBQUNDLE9BQU8sQ0FBQ25CLE1BQU0sSUFBSTtRQUMzQixNQUFNSixJQUFJLEdBQUcvRCxRQUFRLENBQUNTLGFBQWEsQ0FBQyxpQkFBaUI2RCxxQkFBcUIsZ0JBQWdCSCxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFnQkEsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDaklKLElBQUksQ0FBQ1gsU0FBUyxDQUFDQyxHQUFHLENBQUMsV0FBVyxDQUFDO01BQ25DLENBQUMsQ0FBQztJQUNOO0VBQ0o7RUFDQSxJQUFHc0IsTUFBTSxLQUFHLE1BQU0sRUFBRVosSUFBSSxDQUFDWCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDdkQ7O0FBRUE7QUFDQSxTQUFTNEIsUUFBUUEsQ0FBQSxFQUFHO0VBQ2hCLE1BQU1NLE1BQU0sR0FBRzNFLElBQUksQ0FBQzRFLGFBQWEsQ0FBQyxDQUFDO0VBQ25DLElBQUdELE1BQU0sRUFBQztJQUNOLE9BQU9FLE9BQU8sQ0FBQ0YsTUFBTSxDQUFDO0VBQzFCO0VBQ0EzRSxJQUFJLENBQUM4RSxVQUFVLENBQUMsQ0FBQztFQUNqQixJQUFHOUUsSUFBSSxDQUFDOEQsYUFBYSxDQUFDbkIsSUFBSSxFQUFDO0lBQ3ZCMkIsWUFBWSxDQUFDdEUsSUFBSSxDQUFDOEQsYUFBYSxDQUFDO0VBQ3BDO0FBQ0o7QUFFQSxTQUFTZSxPQUFPQSxDQUFDRixNQUFNLEVBQUM7RUFDcEIsTUFBTUksS0FBSyxHQUFHM0YsUUFBUSxDQUFDMEMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO0VBQ2hEaUQsS0FBSyxDQUFDTCxPQUFPLENBQUN2QixJQUFJLElBQUlBLElBQUksQ0FBQ2lCLG1CQUFtQixDQUFDLE9BQU8sRUFBRWQsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQ2hGM0QsYUFBYSxDQUFDSCxXQUFXLENBQUN3RixvQkFBb0IsQ0FBQ0wsTUFBTSxDQUFDLENBQUM7QUFDM0Q7O0FBRUE7O0FBRUEsU0FBU0ssb0JBQW9CQSxDQUFDTCxNQUFNLEVBQUM7RUFDakMsTUFBTU0sS0FBSyxHQUFHakYsSUFBSSxDQUFDNEUsYUFBYSxDQUFFLENBQUMsS0FBSzVFLElBQUksQ0FBQ0UsT0FBTyxHQUFHRixJQUFJLENBQUNHLE9BQU8sR0FBR0gsSUFBSSxDQUFDRSxPQUFPO0VBQ2xGLE1BQU1nRixnQkFBZ0IsR0FBRzlGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUN0RDZGLGdCQUFnQixDQUFDMUMsU0FBUyxDQUFDQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7RUFDbkQsTUFBTTBDLFlBQVksR0FBRy9GLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLElBQUksQ0FBQztFQUNqRCxNQUFNK0YsVUFBVSxHQUFFaEcsUUFBUSxDQUFDQyxhQUFhLENBQUMsR0FBRyxDQUFDO0VBQzdDLE1BQU1nRyxTQUFTLEdBQUVqRyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxHQUFHLENBQUM7RUFDNUMsSUFBR3NGLE1BQU0sQ0FBQ2hDLElBQUksRUFBQztJQUNYd0MsWUFBWSxDQUFDM0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7SUFDNUMwQyxZQUFZLENBQUN2QyxXQUFXLEdBQUcsVUFBVTtJQUNyQ3dDLFVBQVUsQ0FBQ3hDLFdBQVcsR0FBRyxHQUFHK0IsTUFBTSxDQUFDOUIsSUFBSSxzQkFBc0I7SUFDN0R3QyxTQUFTLENBQUN6QyxXQUFXLEdBQUcsb0JBQW9CO0VBQ2hELENBQUMsTUFBTTtJQUNIdUMsWUFBWSxDQUFDM0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7SUFDN0MwQyxZQUFZLENBQUN2QyxXQUFXLEdBQUcsU0FBUztJQUNwQ3dDLFVBQVUsQ0FBQ3hDLFdBQVcsR0FBRywwQkFBMEI7SUFDbkR5QyxTQUFTLENBQUN6QyxXQUFXLEdBQUcsR0FBR3FDLEtBQUssQ0FBQ3BDLElBQUksZUFBZTtFQUN4RDtFQUNBcUMsZ0JBQWdCLENBQUMzRCxNQUFNLENBQUM0RCxZQUFZLEVBQUVDLFVBQVUsRUFBRUMsU0FBUyxDQUFDO0VBQzVELE9BQU9ILGdCQUFnQjtBQUMzQjs7Ozs7Ozs7Ozs7Ozs7QUNsTUEsU0FBU2pHLFlBQVlBLENBQUEsRUFBRztFQUNwQixNQUFNcUcsU0FBUyxHQUFHbEcsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0VBQ2xELE1BQU1rRyxVQUFVLEdBQUduRyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxHQUFHLENBQUM7RUFDOUNrRyxVQUFVLENBQUMvQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxlQUFlLENBQUM7RUFDekM4QyxVQUFVLENBQUMzQyxXQUFXLEdBQUcsb0JBQW9CO0VBQzdDLE1BQU00QyxVQUFVLEdBQUdwRyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxHQUFHLENBQUM7RUFDOUNtRyxVQUFVLENBQUNsRyxFQUFFLEdBQUMsYUFBYTtFQUMzQmtHLFVBQVUsQ0FBQ0MsWUFBWSxDQUFDLE1BQU0sRUFBQywwREFBMEQsQ0FBQztFQUMxRixNQUFNQyxVQUFVLEdBQUd0RyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxHQUFHLENBQUM7RUFDOUNxRyxVQUFVLENBQUNsRCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxXQUFXLEVBQUMsV0FBVyxFQUFDLE9BQU8sRUFBQyxhQUFhLENBQUM7RUFDdkUrQyxVQUFVLENBQUNoRyxXQUFXLENBQUNrRyxVQUFVLENBQUM7RUFFbEMsU0FBU0MsUUFBUUEsQ0FBQSxFQUFFO0lBQ2YsT0FBT0MsWUFBWSxDQUFDQyxPQUFPLENBQUMsT0FBTyxDQUFDO0VBQ3hDO0VBRUEsU0FBU0MsZUFBZUEsQ0FBQSxFQUFFO0lBQzFCMUcsUUFBUSxDQUFDUyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMyQyxTQUFTLENBQUN1RCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ3hEQyxjQUFjLENBQUN4RCxTQUFTLENBQUN1RCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQzFDQyxjQUFjLENBQUN4RCxTQUFTLENBQUN1RCxNQUFNLENBQUMsUUFBUSxDQUFDO0VBQ3pDO0VBRUEsU0FBU0UsaUJBQWlCQSxDQUFBLEVBQUc7SUFDekIsSUFBR04sUUFBUSxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQ3BCQyxZQUFZLENBQUNNLE9BQU8sQ0FBQyxPQUFPLEVBQUMsT0FBTyxDQUFDLENBQUMsS0FFdENOLFlBQVksQ0FBQ00sT0FBTyxDQUFDLE9BQU8sRUFBQyxNQUFNLENBQUM7RUFDNUM7RUFFQSxTQUFTQyxhQUFhQSxDQUFBLEVBQUc7SUFDckIsT0FDSUMsTUFBTSxDQUFDQyxVQUFVLElBQ3JCRCxNQUFNLENBQUNDLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDQyxPQUFPO0VBRTdEO0VBRUEsTUFBTU4sY0FBYyxHQUFHNUcsUUFBUSxDQUFDQyxhQUFhLENBQUMsR0FBRyxDQUFDO0VBQ2xEMkcsY0FBYyxDQUFDMUcsRUFBRSxHQUFHLGtCQUFrQjtFQUN0QzBHLGNBQWMsQ0FBQ3hELFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFVBQVUsRUFBQyxTQUFTLEVBQUMsT0FBTyxDQUFDO0VBQzFEdUQsY0FBYyxDQUFDbEcsZ0JBQWdCLENBQUMsV0FBVyxFQUFDLFlBQVc7SUFDbkRnRyxlQUFlLENBQUMsQ0FBQztJQUNqQkcsaUJBQWlCLENBQUMsQ0FBQztFQUN2QixDQUFDLENBQUM7RUFFRixJQUFHTixRQUFRLENBQUMsQ0FBQyxLQUFLLE1BQU0sSUFBSyxDQUFDQSxRQUFRLENBQUMsQ0FBQyxJQUFJUSxhQUFhLENBQUMsQ0FBRSxFQUFFO0lBQzFETCxlQUFlLENBQUMsQ0FBQztFQUNyQjtFQUNBUixTQUFTLENBQUM5RixXQUFXLENBQUMrRixVQUFVLENBQUM7RUFDakNELFNBQVMsQ0FBQzlGLFdBQVcsQ0FBQ2dHLFVBQVUsQ0FBQztFQUNqQ0YsU0FBUyxDQUFDOUYsV0FBVyxDQUFDd0csY0FBYyxDQUFDO0VBQ3JDLE9BQU9WLFNBQVM7QUFDcEI7QUFFQSxpRUFBZXJHLFlBQVk7Ozs7Ozs7Ozs7Ozs7O0FDckQzQixTQUFTRCxZQUFZQSxDQUFBLEVBQUU7RUFDbkIsTUFBTVMsTUFBTSxHQUFHTCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7RUFDL0NJLE1BQU0sQ0FBQ0gsRUFBRSxHQUFHLFFBQVE7RUFDcEIsTUFBTWlILEtBQUssR0FBR25ILFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLElBQUksQ0FBQztFQUMxQ2tILEtBQUssQ0FBQzNELFdBQVcsR0FBRyxhQUFhO0VBQ2pDLE1BQU1oRCxhQUFhLEdBQUdSLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztFQUN0RE8sYUFBYSxDQUFDNEMsU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7RUFDOUM3QyxhQUFhLENBQUNnRCxXQUFXLEdBQUcsVUFBVTtFQUN0Q25ELE1BQU0sQ0FBQ0QsV0FBVyxDQUFDK0csS0FBSyxDQUFDO0VBQ3pCOUcsTUFBTSxDQUFDRCxXQUFXLENBQUNJLGFBQWEsQ0FBQztFQUNqQyxPQUFPSCxNQUFNO0FBQ2pCO0FBQ0EsaUVBQWVULFlBQVk7Ozs7Ozs7Ozs7Ozs7OztBQ1pTO0FBQ3BDLElBQUl3QyxNQUFNO0FBQ1YsSUFBSXdCLEtBQUs7O0FBRVQ7QUFDQSxNQUFNeUQsUUFBUSxHQUFHO0VBQ2JDLFVBQVUsRUFBRyxJQUFJO0VBQ2pCQyxXQUFXLEVBQUcsSUFBSTtFQUNsQkMsT0FBTyxFQUFHLElBQUk7RUFDZEMsT0FBTyxFQUFHLElBQUk7RUFDZEMsT0FBTyxFQUFHLElBQUk7RUFDZEMsT0FBTyxFQUFHLElBQUk7RUFDZEMsaUJBQWlCLEVBQUcsSUFBSTtFQUN4QkMsYUFBYSxFQUFHLElBQUk7RUFDcEJDLFFBQVEsRUFBRyxJQUFJO0VBQ2ZDLFdBQVcsRUFBRztBQUNsQixDQUFDOztBQUdEO0FBQ0EsU0FBU3pGLGNBQWNBLENBQUMwRixXQUFXLEVBQUczRixVQUFVLEVBQUU7RUFDOUNELE1BQU0sR0FBRzRGLFdBQVc7RUFDcEJwRSxLQUFLLEdBQUd2QixVQUFVO0VBQ2xCLE1BQU00RixVQUFVLEdBQUdyRSxLQUFLLENBQUNsQixnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7RUFDbER1RixVQUFVLENBQUMzQyxPQUFPLENBQUN2QixJQUFJLElBQUk7SUFDdkJBLElBQUksQ0FBQ3JELGdCQUFnQixDQUFDLFVBQVUsRUFBRXdILFFBQVEsQ0FBQztJQUMzQ25FLElBQUksQ0FBQ3JELGdCQUFnQixDQUFDLFdBQVcsRUFBRXlILFNBQVMsQ0FBQztJQUM3Q3BFLElBQUksQ0FBQ3JELGdCQUFnQixDQUFDLFdBQVcsRUFBRTBILFNBQVMsQ0FBQztJQUM3Q3JFLElBQUksQ0FBQ3JELGdCQUFnQixDQUFDLE1BQU0sRUFBRTJILElBQUksQ0FBQztFQUN2QyxDQUFDLENBQUM7RUFDRixPQUFPaEcsVUFBVTtBQUNyQjtBQUVBLFNBQVNpRyxTQUFTQSxDQUFDOUcsS0FBSyxFQUFFO0VBQ3RCLElBQUdBLEtBQUssQ0FBQytHLElBQUksS0FBSyxZQUFZLEVBQUU7SUFDNUJsQixRQUFRLENBQUNFLFdBQVcsR0FBRy9GLEtBQUssQ0FBQzZDLE1BQU0sQ0FBQ21FLGFBQWE7SUFDakRDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDckIsUUFBUSxDQUFDRSxXQUFXLENBQUM7SUFDakNGLFFBQVEsQ0FBQ08saUJBQWlCLEdBQUc1SCxRQUFRLENBQUNTLGFBQWEsQ0FBQyxJQUFJZSxLQUFLLENBQUM2QyxNQUFNLENBQUNtRSxhQUFhLENBQUN0SSxFQUFFLE9BQU8sQ0FBQztJQUM3Rm1ILFFBQVEsQ0FBQ1EsYUFBYSxHQUFHckcsS0FBSyxDQUFDNkMsTUFBTSxDQUFDbUUsYUFBYSxDQUFDQSxhQUFhO0VBQ3JFLENBQUMsTUFBTTtJQUNIbkIsUUFBUSxDQUFDRSxXQUFXLEdBQUcvRixLQUFLLENBQUM2QyxNQUFNO0lBQ25DZ0QsUUFBUSxDQUFDTyxpQkFBaUIsR0FBRzVILFFBQVEsQ0FBQ1MsYUFBYSxDQUFDLElBQUllLEtBQUssQ0FBQzZDLE1BQU0sQ0FBQ25FLEVBQUUsT0FBTyxDQUFDO0lBQy9FbUgsUUFBUSxDQUFDUSxhQUFhLEdBQUdyRyxLQUFLLENBQUM2QyxNQUFNLENBQUNtRSxhQUFhO0VBQ3ZEO0VBRUFHLGNBQWMsQ0FBQ25ILEtBQUssQ0FBQztFQUNyQixJQUFHNkYsUUFBUSxDQUFDRSxXQUFXLENBQUN2RCxPQUFPLENBQUM0RSxTQUFTLEtBQUssVUFBVSxFQUFFdkIsUUFBUSxDQUFDRSxXQUFXLENBQUNuRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztFQUVsSHdGLFVBQVUsQ0FBQyxNQUFNO0lBQ2J4QixRQUFRLENBQUNFLFdBQVcsQ0FBQ25FLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDO0lBQ3JEZ0UsUUFBUSxDQUFDRSxXQUFXLENBQUNuRSxTQUFTLENBQUNnQixNQUFNLENBQUMsb0JBQW9CLENBQUM7SUFDM0RpRCxRQUFRLENBQUNFLFdBQVcsQ0FBQ25FLFNBQVMsQ0FBQ2dCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztJQUM1RGlELFFBQVEsQ0FBQ08saUJBQWlCLENBQUN4SCxXQUFXLENBQUNpSCxRQUFRLENBQUNFLFdBQVcsQ0FBQztFQUVoRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0VBQ0osSUFBR0YsUUFBUSxDQUFDUSxhQUFhLENBQUN6RSxTQUFTLENBQUMwRixRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUM7SUFDakQsTUFBTS9FLElBQUksR0FBR3NELFFBQVEsQ0FBQ1EsYUFBYTtJQUNuQyxNQUFNaEUsR0FBRyxHQUFHa0YsUUFBUSxDQUFDaEYsSUFBSSxDQUFDQyxPQUFPLENBQUNILEdBQUcsQ0FBQztJQUN0QyxNQUFNQyxHQUFHLEdBQUdpRixRQUFRLENBQUNoRixJQUFJLENBQUNDLE9BQU8sQ0FBQ0YsR0FBRyxDQUFDO0lBQ3RDMUIsTUFBTSxDQUFDaEIsU0FBUyxDQUFDNEgsVUFBVSxDQUFDLENBQUNuRixHQUFHLEVBQUNDLEdBQUcsQ0FBQyxDQUFDO0VBQzFDO0FBQ0o7QUFFQSxTQUFTbUYsT0FBT0EsQ0FBQ3pILEtBQUssRUFBQztFQUNuQjZGLFFBQVEsQ0FBQ0UsV0FBVyxDQUFDbkUsU0FBUyxDQUFDZ0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0FBQzVEO0FBRUEsU0FBUytELFNBQVNBLENBQUMzRyxLQUFLLEVBQUU7RUFDdEI0RyxTQUFTLENBQUM1RyxLQUFLLENBQUM7RUFDaEJBLEtBQUssQ0FBQzBILGNBQWMsQ0FBQyxDQUFDO0VBQ3RCLE1BQU1YLElBQUksR0FBR2xCLFFBQVEsQ0FBQ0UsV0FBVyxDQUFDckgsRUFBRTtFQUNwQyxJQUFJMkQsR0FBRztFQUNQLElBQUlDLEdBQUc7RUFDUCxJQUFHdEMsS0FBSyxDQUFDK0csSUFBSSxLQUFLLFdBQVcsRUFBQztJQUM5QjFFLEdBQUcsR0FBR2tGLFFBQVEsQ0FBQ0ksU0FBUyxDQUFDbkYsT0FBTyxDQUFDSCxHQUFHLENBQUMsR0FBR2tGLFFBQVEsQ0FBQzFCLFFBQVEsQ0FBQ0ssT0FBTyxDQUFDO0lBQ2xFNUQsR0FBRyxHQUFHaUYsUUFBUSxDQUFDSSxTQUFTLENBQUNuRixPQUFPLENBQUNGLEdBQUcsQ0FBQyxHQUFHaUYsUUFBUSxDQUFDMUIsUUFBUSxDQUFDTSxPQUFPLENBQUM7RUFDbEUsQ0FBQyxNQUFNO0lBQ0g5RCxHQUFHLEdBQUdrRixRQUFRLENBQUN2SCxLQUFLLENBQUM2QyxNQUFNLENBQUNMLE9BQU8sQ0FBQ0gsR0FBRyxDQUFDLEdBQUdrRixRQUFRLENBQUMxQixRQUFRLENBQUNLLE9BQU8sQ0FBQztJQUNyRTVELEdBQUcsR0FBR2lGLFFBQVEsQ0FBQ3ZILEtBQUssQ0FBQzZDLE1BQU0sQ0FBQ0wsT0FBTyxDQUFDRixHQUFHLENBQUMsR0FBR2lGLFFBQVEsQ0FBQzFCLFFBQVEsQ0FBQ00sT0FBTyxDQUFDO0VBQ3pFO0VBRUEsTUFBTXlCLFdBQVcsR0FBR2hILE1BQU0sQ0FBQ2hCLFNBQVMsQ0FBQ2lJLGNBQWMsQ0FBQ2pDLGtEQUFTLENBQUNtQixJQUFJLENBQUMsQ0FBQzdHLE1BQU0sRUFBRyxDQUFDbUMsR0FBRyxFQUFFQyxHQUFHLENBQUMsRUFBR3VELFFBQVEsQ0FBQ0UsV0FBVyxDQUFDdkQsT0FBTyxDQUFDNEUsU0FBUyxDQUFDO0VBQ2pJUSxXQUFXLENBQUMvRCxPQUFPLEdBQUcrRCxXQUFXLENBQUMvRCxPQUFPLENBQUNpRSxNQUFNLENBQUNuRixNQUFNLElBQUk7SUFDdkQsT0FBTy9CLE1BQU0sQ0FBQ2hCLFNBQVMsQ0FBQ21JLFdBQVcsQ0FBQ3BGLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQ0EsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtxRixTQUFTO0VBQzFFLENBQUMsQ0FBQztFQUVGSixXQUFXLENBQUMvRCxPQUFPLENBQUNDLE9BQU8sQ0FBQ25CLE1BQU0sSUFBSTtJQUNsQyxNQUFNSixJQUFJLEdBQUdILEtBQUssQ0FBQ25ELGFBQWEsQ0FBQyxjQUFjMEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0JBLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3RGLE1BQU1zRixXQUFXLEdBQUd6SixRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDakR3SixXQUFXLENBQUNyRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsZ0JBQWdCLENBQUM7SUFDbERVLElBQUksQ0FBQzNELFdBQVcsQ0FBQ3FKLFdBQVcsQ0FBQztJQUM3QixJQUFHTCxXQUFXLENBQUNNLE9BQU8sRUFBRUQsV0FBVyxDQUFDckcsU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUNoRW9HLFdBQVcsQ0FBQ3JHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLG1CQUFtQixDQUFDO0VBQ3ZELENBQUMsQ0FBQztBQUNOO0FBRUEsU0FBUzZFLFFBQVFBLENBQUMxRyxLQUFLLEVBQUM7RUFDcEJBLEtBQUssQ0FBQzBILGNBQWMsQ0FBQyxDQUFDO0FBQzFCO0FBRUEsU0FBU2QsU0FBU0EsQ0FBQzVHLEtBQUssRUFBQztFQUNyQixNQUFNbUksU0FBUyxHQUFHM0osUUFBUSxDQUFDMEMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUM7RUFDOURpSCxTQUFTLENBQUNyRSxPQUFPLENBQUN2QixJQUFJLElBQUc7SUFDckJBLElBQUksQ0FBQ0ssTUFBTSxDQUFDLENBQUM7RUFDakIsQ0FBQyxDQUFDO0FBQ047QUFFQSxTQUFTaUUsSUFBSUEsQ0FBQzdHLEtBQUssRUFBRTJILFNBQVMsRUFBQztFQUMzQmYsU0FBUyxDQUFDNUcsS0FBSyxDQUFDO0VBQ2hCLElBQUlxQyxHQUFHO0VBQ1AsSUFBSUMsR0FBRztFQUNQLE1BQU15RSxJQUFJLEdBQUdsQixRQUFRLENBQUNFLFdBQVcsQ0FBQ3JILEVBQUU7RUFDcEMsSUFBR3NCLEtBQUssQ0FBQytHLElBQUksS0FBSyxVQUFVLEVBQUM7SUFDekIxRSxHQUFHLEdBQUdrRixRQUFRLENBQUNJLFNBQVMsQ0FBQ25GLE9BQU8sQ0FBQ0gsR0FBRyxDQUFDLEdBQUdrRixRQUFRLENBQUMxQixRQUFRLENBQUNLLE9BQU8sQ0FBQztJQUNsRTVELEdBQUcsR0FBR2lGLFFBQVEsQ0FBQ0ksU0FBUyxDQUFDbkYsT0FBTyxDQUFDRixHQUFHLENBQUMsR0FBR2lGLFFBQVEsQ0FBQzFCLFFBQVEsQ0FBQ00sT0FBTyxDQUFDO0VBQ3RFLENBQUMsTUFBTTtJQUNIOUQsR0FBRyxHQUFHa0YsUUFBUSxDQUFDdkgsS0FBSyxDQUFDNkMsTUFBTSxDQUFDTCxPQUFPLENBQUNILEdBQUcsQ0FBQyxHQUFHa0YsUUFBUSxDQUFDMUIsUUFBUSxDQUFDSyxPQUFPLENBQUM7SUFDckU1RCxHQUFHLEdBQUdpRixRQUFRLENBQUN2SCxLQUFLLENBQUM2QyxNQUFNLENBQUNMLE9BQU8sQ0FBQ0YsR0FBRyxDQUFDLEdBQUdpRixRQUFRLENBQUMxQixRQUFRLENBQUNNLE9BQU8sQ0FBQztFQUN6RTtFQUVBLE1BQU15QixXQUFXLEdBQUdoSCxNQUFNLENBQUNoQixTQUFTLENBQUNpSSxjQUFjLENBQUNqQyxrREFBUyxDQUFDbUIsSUFBSSxDQUFDLENBQUM3RyxNQUFNLEVBQUUsQ0FBQ21DLEdBQUcsRUFBRUMsR0FBRyxDQUFDLEVBQUV1RCxRQUFRLENBQUNFLFdBQVcsQ0FBQ3ZELE9BQU8sQ0FBQzRFLFNBQVMsQ0FBQztFQUMvSCxJQUFJUSxXQUFXLENBQUNNLE9BQU8sRUFBRTtJQUNyQixNQUFNRSxVQUFVLEdBQUdoRyxLQUFLLENBQUNuRCxhQUFhLENBQUMsY0FBY29ELEdBQUcsZ0JBQWdCQyxHQUFHLElBQUksQ0FBQztJQUNoRjhGLFVBQVUsQ0FBQ3hKLFdBQVcsQ0FBQ2lILFFBQVEsQ0FBQ0UsV0FBVyxDQUFDO0lBQzVDRixRQUFRLENBQUNFLFdBQVcsQ0FBQ25FLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLG9CQUFvQixDQUFDO0lBQ3hEZ0UsUUFBUSxDQUFDUSxhQUFhLEdBQUcrQixVQUFVO0lBQ25DeEgsTUFBTSxDQUFDaEIsU0FBUyxDQUFDeUksU0FBUyxDQUFDeEMsUUFBUSxDQUFDRSxXQUFXLENBQUNySCxFQUFFLEVBQUUsQ0FBQzJELEdBQUcsRUFBRUMsR0FBRyxDQUFDLEVBQUV1RCxRQUFRLENBQUNFLFdBQVcsQ0FBQ3ZELE9BQU8sQ0FBQzRFLFNBQVMsQ0FBQztFQUMzRyxDQUFDLE1BRUk7SUFDRCxJQUFJdkIsUUFBUSxDQUFDUSxhQUFhLENBQUN6RSxTQUFTLENBQUMwRixRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDbkR6QixRQUFRLENBQUNFLFdBQVcsQ0FBQ25FLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLG9CQUFvQixDQUFDO01BQ3hELE1BQU15RyxPQUFPLEdBQUd6QyxRQUFRLENBQUNRLGFBQWEsQ0FBQzdELE9BQU8sQ0FBQ0gsR0FBRztNQUNsRCxNQUFNa0csT0FBTyxHQUFHMUMsUUFBUSxDQUFDUSxhQUFhLENBQUM3RCxPQUFPLENBQUNGLEdBQUc7TUFDbEQxQixNQUFNLENBQUNoQixTQUFTLENBQUN5SSxTQUFTLENBQUN4QyxRQUFRLENBQUNFLFdBQVcsQ0FBQ3JILEVBQUUsRUFBRSxDQUFDNEosT0FBTyxFQUFFQyxPQUFPLENBQUMsRUFBRTFDLFFBQVEsQ0FBQ0UsV0FBVyxDQUFDdkQsT0FBTyxDQUFDNEUsU0FBUyxDQUFDO0lBQ25IO0lBQ0F2QixRQUFRLENBQUMyQyxpQkFBaUIsQ0FBQzVKLFdBQVcsQ0FBQ2lILFFBQVEsQ0FBQ0UsV0FBVyxDQUFDO0VBQ2hFO0VBQ0FGLFFBQVEsQ0FBQ0UsV0FBVyxDQUFDbkUsU0FBUyxDQUFDZ0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0VBQ3hELElBQUlpRCxRQUFRLENBQUNFLFdBQVcsQ0FBQ3ZELE9BQU8sQ0FBQzRFLFNBQVMsS0FBSyxVQUFVLEVBQUV2QixRQUFRLENBQUNFLFdBQVcsQ0FBQ25FLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FDaEhnRSxRQUFRLENBQUNFLFdBQVcsQ0FBQ25FLFNBQVMsQ0FBQ2dCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztBQUNyRTs7QUFHQTtBQUNBLFNBQVM1QixjQUFjQSxDQUFBLEVBQUc7RUFDdEIsTUFBTXlILGtCQUFrQixHQUFHakssUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3hEZ0ssa0JBQWtCLENBQUM3RyxTQUFTLENBQUNDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztFQUN6RCxNQUFNNkcsZUFBZSxHQUFHbEssUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3JEaUssZUFBZSxDQUFDOUcsU0FBUyxDQUFDQyxHQUFHLENBQUMsb0JBQW9CLENBQUM7RUFDbkQsTUFBTThHLGNBQWMsR0FBR25LLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLElBQUksQ0FBQztFQUNuRGtLLGNBQWMsQ0FBQzNHLFdBQVcsR0FBQyxrQkFBa0I7RUFDN0MsTUFBTTRHLGFBQWEsR0FBR3BLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEdBQUcsQ0FBQztFQUNqRG1LLGFBQWEsQ0FBQzVHLFdBQVcsR0FBRywrRUFBK0U7RUFDM0csTUFBTTZHLGdCQUFnQixHQUFHckssUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3REb0ssZ0JBQWdCLENBQUNqSCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztFQUNyRCxNQUFNeEMsU0FBUyxHQUFHYixRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7RUFDbERZLFNBQVMsQ0FBQ3VDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLG1CQUFtQixDQUFDO0VBQzVDeEMsU0FBUyxDQUFDMkMsV0FBVyxHQUFHLFlBQVk7RUFDcEMsTUFBTThHLFdBQVcsR0FBR3RLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztFQUNwRHFLLFdBQVcsQ0FBQ2xILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLHFCQUFxQixDQUFDO0VBQ2hEaUgsV0FBVyxDQUFDOUcsV0FBVyxHQUFHLGlCQUFpQjtFQUMzQzhHLFdBQVcsQ0FBQzVKLGdCQUFnQixDQUFDLE9BQU8sRUFBQzZKLGNBQWMsQ0FBQztFQUNwREYsZ0JBQWdCLENBQUNsSSxNQUFNLENBQUN0QixTQUFTLEVBQUN5SixXQUFXLENBQUM7RUFDOUMsTUFBTUUsUUFBUSxHQUFHeEssUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzlDLEtBQUssSUFBSTRFLElBQUksSUFBSXVDLGtEQUFTLEVBQUU7SUFDeEJvRCxRQUFRLENBQUNwSyxXQUFXLENBQUNxSyxRQUFRLENBQUNyRCxrREFBUyxDQUFDdkMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUNuRDtFQUNBcUYsZUFBZSxDQUFDL0gsTUFBTSxDQUFDZ0ksY0FBYyxFQUFDQyxhQUFhLENBQUM7RUFDcERILGtCQUFrQixDQUFDOUgsTUFBTSxDQUFDK0gsZUFBZSxFQUFFTSxRQUFRLEVBQUVILGdCQUFnQixDQUFDO0VBQ3RFLE9BQU9KLGtCQUFrQjtBQUM3Qjs7QUFFQTtBQUNBLFNBQVNRLFFBQVFBLENBQUM1RixJQUFJLEVBQUU7RUFDcEIsTUFBTTZGLGFBQWEsR0FBRzFLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUNuRHlLLGFBQWEsQ0FBQ3RILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFlBQVksQ0FBQztFQUN6Q3FILGFBQWEsQ0FBQ3hLLEVBQUUsR0FBRyxHQUFHMkUsSUFBSSxDQUFDcEIsSUFBSSxPQUFPO0VBQ3RDLE1BQU1rSCxPQUFPLEdBQUczSyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDN0MwSyxPQUFPLENBQUN6SyxFQUFFLEdBQUcyRSxJQUFJLENBQUNwQixJQUFJO0VBQ3RCa0gsT0FBTyxDQUFDM0csT0FBTyxDQUFDdEMsTUFBTSxHQUFHbUQsSUFBSSxDQUFDbkQsTUFBTTtFQUNwQ2lKLE9BQU8sQ0FBQ3ZILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGdCQUFnQixDQUFDO0VBQ3ZDLEtBQUksSUFBSXVILENBQUMsR0FBRyxDQUFDLEVBQUdBLENBQUMsR0FBRy9GLElBQUksQ0FBQ25ELE1BQU0sRUFBR2tKLENBQUMsRUFBRSxFQUFDO0lBQ2xDLE1BQU1DLFFBQVEsR0FBRzdLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUM5QzRLLFFBQVEsQ0FBQ3pILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDO0lBQ3pDc0gsT0FBTyxDQUFDdkssV0FBVyxDQUFDeUssUUFBUSxDQUFDO0VBQ2pDO0VBQ0FGLE9BQU8sQ0FBQ0csU0FBUyxHQUFHLElBQUk7RUFDeEJILE9BQU8sQ0FBQzNHLE9BQU8sQ0FBQzRFLFNBQVMsR0FBRyxZQUFZO0VBQ3hDK0IsT0FBTyxDQUFDakssZ0JBQWdCLENBQUMsV0FBVyxFQUFFNEgsU0FBUyxDQUFDO0VBQ2hEcUMsT0FBTyxDQUFDakssZ0JBQWdCLENBQUMsU0FBUyxFQUFFdUksT0FBTyxDQUFDO0VBQzVDMEIsT0FBTyxDQUFDakssZ0JBQWdCLENBQUMsVUFBVSxFQUFFcUssVUFBVSxDQUFDO0VBRWhESixPQUFPLENBQUNqSyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsVUFBU2MsS0FBSyxFQUFFO0lBQ2xELE1BQU13SixDQUFDLEdBQUd4SixLQUFLLENBQUN5SixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUNDLE9BQU87SUFDbEMsTUFBTUMsQ0FBQyxHQUFHM0osS0FBSyxDQUFDeUosT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDRyxPQUFPO0lBQ2xDLE1BQU1DLFFBQVEsR0FBR3JMLFFBQVEsQ0FBQ3NMLGlCQUFpQixDQUFDTixDQUFDLEVBQUVHLENBQUMsQ0FBQztJQUNqRCxNQUFNaEMsU0FBUyxHQUFHa0MsUUFBUSxDQUFDL0IsTUFBTSxDQUFFaUMsT0FBTyxJQUFJQSxPQUFPLENBQUNuSSxTQUFTLENBQUMwRixRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakYsSUFBR0ssU0FBUyxDQUFFekgsTUFBTSxHQUFHLENBQUMsRUFBQztNQUNyQnlHLFNBQVMsQ0FBQzNHLEtBQUssRUFBRTJILFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDLE1BQUs7TUFDRmYsU0FBUyxDQUFDNUcsS0FBSyxDQUFDO0lBQ3BCO0lBQ0EsTUFBTXpCLEdBQUcsR0FBR0MsUUFBUSxDQUFDUyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQzFDLE1BQU0rSyxPQUFPLEdBQUd4TCxRQUFRLENBQUNTLGFBQWEsQ0FBQyxZQUFZLENBQUM7SUFDcEQsSUFBRytLLE9BQU8sRUFBRUEsT0FBTyxDQUFDcEgsTUFBTSxDQUFDLENBQUM7SUFDNUIsTUFBTXFILE1BQU0sR0FBR2QsT0FBTyxDQUFDZSxTQUFTLENBQUMsSUFBSSxDQUFDO0lBQ3RDLE1BQU1DLGFBQWEsR0FBR25LLEtBQUssQ0FBQ29LLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDNUMsSUFBR3ZFLFFBQVEsQ0FBQ0UsV0FBVyxDQUFDdkQsT0FBTyxDQUFDNEUsU0FBUyxLQUFLLFVBQVUsRUFBQztJQUNyRDZDLE1BQU0sQ0FBQ3JJLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLHFCQUFxQixDQUFDO0lBQy9Db0ksTUFBTSxDQUFDckksU0FBUyxDQUFDQyxHQUFHLENBQUMsWUFBWSxDQUFDO0lBQ2xDb0ksTUFBTSxDQUFDekksS0FBSyxDQUFDNkksSUFBSSxHQUFHLEdBQUdGLGFBQWEsQ0FBQ0csS0FBSyxHQUFHekUsUUFBUSxDQUFDRyxPQUFPLElBQUk7SUFDakVpRSxNQUFNLENBQUN6SSxLQUFLLENBQUMrSSxHQUFHLEdBQUcsR0FBR0osYUFBYSxDQUFDSyxLQUFLLEdBQUczRSxRQUFRLENBQUNJLE9BQU8sSUFBSTtJQUNoRTFILEdBQUcsQ0FBQ0ssV0FBVyxDQUFDcUwsTUFBTSxDQUFDO0VBQzNCLENBQUMsQ0FBQztFQUVGZCxPQUFPLENBQUNqSyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsVUFBVWMsS0FBSyxFQUFDO0lBQ2pELE1BQU1nSyxPQUFPLEdBQUd4TCxRQUFRLENBQUNTLGFBQWEsQ0FBQyxhQUFhLENBQUM7SUFDckQsSUFBRytLLE9BQU8sRUFBRUEsT0FBTyxDQUFDcEgsTUFBTSxDQUFDLENBQUM7SUFDNUI2RSxPQUFPLENBQUN6SCxLQUFLLENBQUM7SUFDZCxNQUFNd0osQ0FBQyxHQUFHeEosS0FBSyxDQUFDeUssY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDZixPQUFPO0lBQ3pDLE1BQU1DLENBQUMsR0FBRzNKLEtBQUssQ0FBQ3lLLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsT0FBTztJQUN6QyxNQUFNQyxRQUFRLEdBQUdyTCxRQUFRLENBQUNzTCxpQkFBaUIsQ0FBQ04sQ0FBQyxFQUFFRyxDQUFDLENBQUM7SUFDakQsTUFBTWhDLFNBQVMsR0FBR2tDLFFBQVEsQ0FBQy9CLE1BQU0sQ0FBQ2lDLE9BQU8sSUFBSUEsT0FBTyxDQUFDbkksU0FBUyxDQUFDMEYsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hGLElBQUdLLFNBQVMsQ0FBQ3pILE1BQU0sR0FBRyxDQUFDLEVBQUM7TUFDcEIyRyxJQUFJLENBQUM3RyxLQUFLLENBQUUySCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0I7RUFDSixDQUFDLENBQUM7O0VBRUY7RUFDQXdCLE9BQU8sQ0FBQ2pLLGdCQUFnQixDQUFDLFlBQVksRUFBRSxVQUFVYyxLQUFLLEVBQUU7SUFDcERBLEtBQUssQ0FBQzBILGNBQWMsQ0FBQyxDQUFDO0lBQ3RCLElBQUlnRCxJQUFJLEdBQUcsSUFBSUMsSUFBSSxDQUFDLENBQUM7SUFDckIsSUFBSUMsSUFBSSxHQUFHRixJQUFJLENBQUNHLE9BQU8sQ0FBQyxDQUFDO0lBQ3pCLE1BQU1DLFdBQVcsR0FBRyxHQUFHO0lBQ3ZCLElBQUlGLElBQUksR0FBSXpCLE9BQU8sQ0FBQzRCLFNBQVMsR0FBSUQsV0FBVyxFQUFFO01BQzFDdkIsVUFBVSxDQUFDdkosS0FBSyxDQUFDO01BQ2pCOEcsU0FBUyxDQUFDOUcsS0FBSyxDQUFDO0lBQ3BCLENBQUMsTUFBTztNQUNKOEcsU0FBUyxDQUFDOUcsS0FBSyxDQUFDO0lBQ3BCO0lBQ0FtSixPQUFPLENBQUM2QixTQUFTLEdBQUdKLElBQUk7RUFDNUIsQ0FBQyxDQUFDO0VBQ0YsTUFBTUssUUFBUSxHQUFHek0sUUFBUSxDQUFDQyxhQUFhLENBQUMsR0FBRyxDQUFDO0VBQzVDLElBQUc0RSxJQUFJLENBQUNwQixJQUFJLEtBQUssUUFBUSxFQUNyQmdKLFFBQVEsQ0FBQ2pKLFdBQVcsR0FBRyxhQUFhLENBQUMsS0FFckNpSixRQUFRLENBQUNqSixXQUFXLEdBQUVxQixJQUFJLENBQUNwQixJQUFJO0VBQ25DaUgsYUFBYSxDQUFDdkksTUFBTSxDQUFDc0ssUUFBUSxFQUFFOUIsT0FBTyxDQUFDO0VBQ3ZDLE9BQU9ELGFBQWE7QUFDeEI7O0FBRUE7QUFDQSxTQUFTSCxjQUFjQSxDQUFBLEVBQUU7RUFDckJuSSxNQUFNLENBQUNoQixTQUFTLENBQUNDLGtCQUFrQixDQUFDLENBQUM7RUFDckNlLE1BQU0sQ0FBQ2hCLFNBQVMsQ0FBQ0ssV0FBVyxDQUFDNkQsT0FBTyxDQUFFVCxJQUFJLElBQUk7SUFDMUMsTUFBTTBELElBQUksR0FBRzFELElBQUksQ0FBQzBELElBQUk7SUFDdEIsTUFBTW1FLE1BQU0sR0FBRzdILElBQUksQ0FBQ1EsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM5QixNQUFNdUQsU0FBUyxHQUFHL0QsSUFBSSxDQUFDK0QsU0FBUztJQUNoQyxNQUFNckIsV0FBVyxHQUFHdkgsUUFBUSxDQUFDUyxhQUFhLENBQUMsSUFBSThILElBQUksRUFBRSxDQUFDO0lBQ3REaEIsV0FBVyxDQUFDdkQsT0FBTyxDQUFDNEUsU0FBUyxHQUFHQSxTQUFTO0lBQ3pDckIsV0FBVyxDQUFDbkUsU0FBUyxDQUFDQyxHQUFHLENBQUMsb0JBQW9CLENBQUM7SUFDL0MsSUFBR3VGLFNBQVMsS0FBSyxVQUFVLEVBQ3ZCckIsV0FBVyxDQUFDbkUsU0FBUyxDQUFDQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUVqRGtFLFdBQVcsQ0FBQ25FLFNBQVMsQ0FBQ2dCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztJQUN2RCxNQUFNLENBQUNQLEdBQUcsRUFBRUMsR0FBRyxDQUFDLEdBQUc0SSxNQUFNO0lBQ3pCLE1BQU0zSSxJQUFJLEdBQUdILEtBQUssQ0FBQ25ELGFBQWEsQ0FBQyxjQUFjb0QsR0FBRyxnQkFBZ0JDLEdBQUcsSUFBSSxDQUFDO0lBQzFFQyxJQUFJLENBQUMzRCxXQUFXLENBQUNtSCxXQUFXLENBQUM7RUFDakMsQ0FBQyxDQUFDO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTb0IsY0FBY0EsQ0FBQ25ILEtBQUssRUFBQztFQUMxQixJQUFJd0osQ0FBQztFQUNMLElBQUlHLENBQUM7RUFDTCxJQUFHM0osS0FBSyxDQUFDK0csSUFBSSxLQUFLLFlBQVksRUFBQztJQUMzQixJQUFJb0UsR0FBRyxHQUFHbkwsS0FBSyxDQUFDNkMsTUFBTSxDQUFDbUUsYUFBYSxDQUFDb0UscUJBQXFCLENBQUMsQ0FBQztJQUM1RDVCLENBQUMsR0FBR3hKLEtBQUssQ0FBQ29LLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQ1YsT0FBTyxHQUFHeUIsR0FBRyxDQUFDM0IsQ0FBQztJQUMxQ0csQ0FBQyxHQUFHM0osS0FBSyxDQUFDb0ssYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDUixPQUFPLEdBQUd1QixHQUFHLENBQUN4QixDQUFDO0lBQzFDOUQsUUFBUSxDQUFDRyxPQUFPLEdBQUd3RCxDQUFDO0lBQ3BCM0QsUUFBUSxDQUFDSSxPQUFPLEdBQUcwRCxDQUFDO0VBQ3hCLENBQUMsTUFBSztJQUNGSCxDQUFDLEdBQUd4SixLQUFLLENBQUNnRyxPQUFPO0lBQ2pCMkQsQ0FBQyxHQUFHM0osS0FBSyxDQUFDaUcsT0FBTztFQUNyQjtFQUFDO0VBQ0QsTUFBTW9GLFFBQVEsR0FBRzdNLFFBQVEsQ0FBQ1MsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUNxTSxXQUFXO0VBQ3ZFLElBQUd6RixRQUFRLENBQUNFLFdBQVcsQ0FBQ3ZELE9BQU8sQ0FBQzRFLFNBQVMsS0FBSSxZQUFZLEVBQUM7SUFDdER2QixRQUFRLENBQUNLLE9BQU8sR0FBRyxDQUFDO0lBQ3BCTCxRQUFRLENBQUNNLE9BQU8sR0FBR29GLElBQUksQ0FBQ0MsS0FBSyxDQUFDaEMsQ0FBQyxJQUFJNkIsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ3JELENBQUMsTUFBTTtJQUNIeEYsUUFBUSxDQUFDSyxPQUFPLEdBQUdxRixJQUFJLENBQUNDLEtBQUssQ0FBQzdCLENBQUMsSUFBSTBCLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRHhGLFFBQVEsQ0FBQ00sT0FBTyxHQUFHLENBQUM7RUFDeEI7QUFDSjtBQUVBLFNBQVNvRCxVQUFVQSxDQUFDdkosS0FBSyxFQUFDO0VBQ3RCLE1BQU0rRixXQUFXLEdBQUdlLFNBQVMsQ0FBQ2YsV0FBVztFQUN6QyxNQUFNMEYsVUFBVSxHQUFHN0Ysa0RBQVMsQ0FBQ0csV0FBVyxDQUFDckgsRUFBRSxDQUFDLENBQUN3QixNQUFNO0VBQ25ELE1BQU1rSSxVQUFVLEdBQUdyQyxXQUFXLENBQUNpQixhQUFhO0VBQzVDLElBQUcsQ0FBQ29CLFVBQVUsQ0FBQ3hHLFNBQVMsQ0FBQzBGLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFRLENBQUM7O0VBRXBELE1BQU1vRSxTQUFTLEdBQUdDLFFBQVEsQ0FBQ3ZELFVBQVUsQ0FBQzVGLE9BQU8sQ0FBQ0gsR0FBRyxDQUFDO0VBQ2xELE1BQU11SixTQUFTLEdBQUdyRSxRQUFRLENBQUNhLFVBQVUsQ0FBQzVGLE9BQU8sQ0FBQ0YsR0FBRyxDQUFDO0VBQ2xEMkUsT0FBTyxDQUFDQyxHQUFHLENBQUN3RSxTQUFTLEVBQUNFLFNBQVMsQ0FBQztFQUNoQ2hMLE1BQU0sQ0FBQ2hCLFNBQVMsQ0FBQzRILFVBQVUsQ0FBQyxDQUFDa0UsU0FBUyxFQUFFRSxTQUFTLENBQUMsQ0FBQztFQUNuRCxJQUFJdkosR0FBRyxHQUFHcUosU0FBUztFQUNuQixJQUFJcEosR0FBRyxHQUFHc0osU0FBUztFQUNuQixJQUFJQyxlQUFlLEdBQUc5RixXQUFXLENBQUN2RCxPQUFPLENBQUM0RSxTQUFTO0VBQ25ELElBQUkwRSxZQUFZO0VBQ2hCLElBQUdELGVBQWUsS0FBSyxZQUFZLEVBQUM7SUFDaENDLFlBQVksR0FBRSxVQUFVO0lBQ3hCLElBQUksRUFBRSxHQUFHekosR0FBRyxHQUFJb0osVUFBVSxFQUFFcEosR0FBRyxHQUFHLEVBQUUsR0FBR29KLFVBQVU7RUFDckQsQ0FBQyxNQUFNO0lBQ0hLLFlBQVksR0FBRyxZQUFZO0lBQzNCLElBQUksRUFBRSxHQUFHeEosR0FBRyxHQUFJbUosVUFBVSxFQUFFbkosR0FBRyxHQUFHLEVBQUUsR0FBR21KLFVBQVU7RUFDckQ7RUFFQSxJQUFJTSxRQUFRLEdBQUcsQ0FBQztFQUNoQixJQUFJbkUsV0FBVyxHQUFHaEgsTUFBTSxDQUFDaEIsU0FBUyxDQUFDaUksY0FBYyxDQUFDNEQsVUFBVSxFQUFFLENBQUNwSixHQUFHLEVBQUNDLEdBQUcsQ0FBQyxFQUFFd0osWUFBWSxDQUFDO0VBQ3RGLE9BQU1sRSxXQUFXLENBQUNNLE9BQU8sS0FBSyxLQUFLLElBQUk2RCxRQUFRLEdBQUcsRUFBRSxFQUFDO0lBQ2pELElBQUdELFlBQVksS0FBSyxZQUFZLEVBQzVCekosR0FBRyxHQUFHQSxHQUFHLEdBQUcsQ0FBQyxHQUFHQSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUU1QkMsR0FBRyxHQUFHQSxHQUFHLEdBQUcsQ0FBQyxHQUFHQSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDL0JzRixXQUFXLEdBQUdoSCxNQUFNLENBQUNoQixTQUFTLENBQUNpSSxjQUFjLENBQUM0RCxVQUFVLEVBQUMsQ0FBQ3BKLEdBQUcsRUFBRUMsR0FBRyxDQUFDLEVBQUV3SixZQUFZLENBQUM7SUFDbEZDLFFBQVEsRUFBRTtFQUNkO0VBQ0EsSUFBR25FLFdBQVcsQ0FBQ00sT0FBTyxFQUFDO0lBQ25CdEgsTUFBTSxDQUFDaEIsU0FBUyxDQUFDeUksU0FBUyxDQUFDdEMsV0FBVyxDQUFDckgsRUFBRSxFQUFFLENBQUMyRCxHQUFHLEVBQUVDLEdBQUcsQ0FBQyxFQUFHd0osWUFBWSxDQUFDO0lBQ3JFLE1BQU1FLGFBQWEsR0FBRzVKLEtBQUssQ0FBQ25ELGFBQWEsQ0FBQyxjQUFjb0QsR0FBRyxnQkFBZ0JDLEdBQUcsSUFBSSxDQUFDO0lBQ25GMEosYUFBYSxDQUFDcE4sV0FBVyxDQUFDbUgsV0FBVyxDQUFDO0lBQ3RDQSxXQUFXLENBQUNrRyxPQUFPLENBQUM3RSxTQUFTLEdBQUcwRSxZQUFZO0lBQzVDLElBQUdBLFlBQVksS0FBSyxVQUFVLEVBQUcvRixXQUFXLENBQUNuRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEtBQzdFa0UsV0FBVyxDQUFDbkUsU0FBUyxDQUFDZ0IsTUFBTSxDQUFDLHFCQUFxQixDQUFDO0VBQzVELENBQUMsTUFBTTtJQUNIaEMsTUFBTSxDQUFDaEIsU0FBUyxDQUFDeUksU0FBUyxDQUFDdEMsV0FBVyxDQUFDckgsRUFBRSxFQUFHLENBQUNnTixTQUFTLEVBQUVFLFNBQVMsQ0FBQyxFQUFFQyxlQUFlLENBQUM7RUFDeEY7QUFFSjtBQUVBLE1BQU12TixLQUFLLEdBQUc7RUFDVndDLGNBQWM7RUFDZEU7QUFDSixDQUFDO0FBR0QsaUVBQWUxQyxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7O0FDNVZNO0FBQ1M7QUFDbkMsU0FBUzZOLFNBQVNBLENBQUEsRUFBRTtFQUNoQixNQUFNL0osS0FBSyxHQUFJZ0ssV0FBVyxDQUFDLENBQUM7RUFDNUIsTUFBTW5NLFdBQVcsR0FBRyxFQUFFOztFQUV0QjtFQUNBLFNBQVNtTSxXQUFXQSxDQUFBLEVBQUc7SUFDbkIsSUFBSUMsVUFBVSxHQUFHLEVBQUU7SUFDbkIsS0FBSSxJQUFJaEssR0FBRyxHQUFHLENBQUMsRUFBR0EsR0FBRyxJQUFJLENBQUMsRUFBRUEsR0FBRyxFQUFFLEVBQUM7TUFDOUIsSUFBSWlLLFFBQVEsR0FBRyxFQUFFO01BQ2pCLEtBQUksSUFBSWhLLEdBQUcsR0FBSSxDQUFDLEVBQUdBLEdBQUcsSUFBRyxDQUFDLEVBQUlBLEdBQUcsRUFBRSxFQUFDO1FBQ2hDZ0ssUUFBUSxDQUFDaEssR0FBRyxDQUFDLEdBQUUsSUFBSTtNQUN2QjtNQUNBK0osVUFBVSxDQUFDaEssR0FBRyxDQUFDLEdBQUdpSyxRQUFRO0lBQzlCO0lBQ0EsT0FBT0QsVUFBVTtFQUNyQjs7RUFFQTtFQUNBLFNBQVNFLFVBQVVBLENBQUNuSyxLQUFLLEVBQUU7SUFDdkIsS0FBSSxJQUFJQyxHQUFHLEdBQUksQ0FBQyxFQUFHQSxHQUFHLElBQUksQ0FBQyxFQUFHQSxHQUFHLEVBQUcsRUFBQztNQUNqQyxLQUFJLElBQUlDLEdBQUcsR0FBRyxDQUFDLEVBQUdBLEdBQUcsSUFBSSxDQUFDLEVBQUdBLEdBQUcsRUFBRSxFQUFDO1FBQy9CRixLQUFLLENBQUNDLEdBQUcsQ0FBQyxDQUFDQyxHQUFHLENBQUMsR0FBRSxJQUFJO01BQ3pCO0lBQ0o7RUFDSjtFQUNBLFNBQVMrRixTQUFTQSxDQUFDbUUsUUFBUSxFQUFFdEIsTUFBTSxFQUFFOUQsU0FBUyxFQUFFO0lBQzVDLE1BQU1xRSxVQUFVLEdBQUc3RixrREFBUyxDQUFDNEcsUUFBUSxDQUFDLENBQUN0TSxNQUFNO0lBQzdDLE1BQU0wSCxXQUFXLEdBQUcsSUFBSSxDQUFDQyxjQUFjLENBQUM0RCxVQUFVLEVBQUVQLE1BQU0sRUFBRTlELFNBQVMsQ0FBQztJQUN0RTtJQUNBLElBQUlRLFdBQVcsQ0FBQ00sT0FBTyxFQUFFO01BQ3JCLE1BQU03RSxJQUFJLEdBQUc2SSxrREFBSSxDQUFDTSxRQUFRLENBQUM7TUFDM0JuSixJQUFJLENBQUNRLE9BQU8sR0FBRytELFdBQVcsQ0FBQy9ELE9BQU87TUFDbENSLElBQUksQ0FBQytELFNBQVMsR0FBR0EsU0FBUztNQUMxQlEsV0FBVyxDQUFDL0QsT0FBTyxDQUFDQyxPQUFPLENBQUNuQixNQUFNLElBQUk7UUFDbEMsSUFBSSxDQUFDTixHQUFHLEVBQUVDLEdBQUcsQ0FBQyxHQUFHSyxNQUFNO1FBQ3ZCLElBQUksQ0FBQ1AsS0FBSyxDQUFDQyxHQUFHLENBQUMsQ0FBQ0MsR0FBRyxDQUFDLEdBQUdlLElBQUk7TUFDL0IsQ0FBQyxDQUFDO01BQ0ZwRCxXQUFXLENBQUN3TSxJQUFJLENBQUNwSixJQUFJLENBQUM7TUFDdEIsT0FBT0EsSUFBSTtJQUNmLENBQUMsTUFBTSxPQUFPLG9DQUFvQztFQUN0RDtFQUVBLFNBQVN3RSxjQUFjQSxDQUFDNEQsVUFBVSxFQUFFUCxNQUFNLEVBQUc5RCxTQUFTLEVBQUU7SUFDcEQ7SUFDQSxJQUFJLENBQUMvRSxHQUFHLEVBQUVDLEdBQUcsQ0FBQyxHQUFFNEksTUFBTTtJQUN0QixJQUFJdEQsV0FBVyxHQUFHLEVBQUU7SUFDcEIsS0FBSSxJQUFJd0IsQ0FBQyxHQUFHLENBQUMsRUFBR0EsQ0FBQyxHQUFHcUMsVUFBVSxFQUFFckMsQ0FBQyxFQUFFLEVBQUU7TUFDakN4QixXQUFXLENBQUM2RSxJQUFJLENBQUMsQ0FBQ3BLLEdBQUcsRUFBQ0MsR0FBRyxDQUFDLENBQUM7TUFDM0I4RSxTQUFTLEtBQUssWUFBWSxHQUFDOUUsR0FBRyxFQUFFLEdBQUVELEdBQUcsRUFBRTtJQUMzQztJQUNBO0lBQ0EsTUFBTXFLLGNBQWMsR0FBRzlFLFdBQVcsQ0FBQytFLEtBQUssQ0FBQ2hLLE1BQU0sSUFBRztNQUM5QyxJQUFJLENBQUNOLEdBQUcsRUFBRUMsR0FBRyxDQUFDLEdBQUlLLE1BQU07TUFDeEIsSUFBRyxJQUFJLENBQUNvRixXQUFXLENBQUMxRixHQUFHLEVBQUNDLEdBQUcsQ0FBQyxLQUFLMEYsU0FBUyxFQUN0QyxPQUFPLEtBQUs7TUFDaEIsT0FBTyxJQUFJLENBQUM1RixLQUFLLENBQUNDLEdBQUcsQ0FBQyxDQUFDQyxHQUFHLENBQUMsS0FBSyxJQUFJO0lBRXhDLENBQUMsQ0FBQztJQUNGO0lBQ0EsT0FBTztNQUNINEYsT0FBTyxFQUFHd0UsY0FBYztNQUN4QjdJLE9BQU8sRUFBRytEO0lBQ2QsQ0FBQztFQUNMO0VBRUEsU0FBU0csV0FBV0EsQ0FBQzFGLEdBQUcsRUFBRUMsR0FBRyxFQUFFO0lBQzNCLElBQUlELEdBQUcsR0FBRyxDQUFDLElBQUlDLEdBQUcsR0FBRyxDQUFDLEVBQUUsT0FBTzBGLFNBQVM7SUFDeEMsSUFBSTNGLEdBQUcsR0FBRyxDQUFDLElBQUlDLEdBQUcsR0FBRyxDQUFDLEVBQUUsT0FBTzBGLFNBQVMsQ0FBQyxLQUNwQyxPQUFPLElBQUksQ0FBQzVGLEtBQUssQ0FBQ0MsR0FBRyxDQUFDLENBQUNDLEdBQUcsQ0FBQztFQUNwQztFQUNBLFNBQVNzSyxVQUFVQSxDQUFDQyxLQUFLLEVBQUU7SUFDdkIsT0FBTUEsS0FBSyxDQUFDM00sTUFBTSxHQUFHLENBQUMsRUFBRzJNLEtBQUssQ0FBQ0MsR0FBRyxDQUFDLENBQUM7RUFDeEM7RUFFQSxTQUFTdEYsVUFBVUEsQ0FBQzBELE1BQU0sRUFBRTtJQUN4QixNQUFNLENBQUM3SSxHQUFHLEVBQUVDLEdBQUcsQ0FBQyxHQUFHNEksTUFBTTtJQUN6QixNQUFNN0gsSUFBSSxHQUFJLElBQUksQ0FBQzBFLFdBQVcsQ0FBQzFGLEdBQUcsRUFBQ0MsR0FBRyxDQUFDO0lBQ3ZDZSxJQUFJLENBQUNRLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDbkIsTUFBTSxJQUFHO01BQzFCLE1BQU0sQ0FBQ04sR0FBRyxFQUFFQyxHQUFHLENBQUMsR0FBR0ssTUFBTTtNQUN6QixJQUFJLENBQUNQLEtBQUssRUFBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUMsR0FBRyxJQUFJO0lBQy9CLENBQUMsQ0FBQztJQUNGLE1BQU15SyxVQUFVLEdBQUcsSUFBSSxDQUFDOU0sV0FBVyxDQUFDK00sT0FBTyxDQUFDM0osSUFBSSxDQUFDO0lBQ2pELElBQUksQ0FBQ3BELFdBQVcsQ0FBQ2dOLE1BQU0sQ0FBQ0YsVUFBVSxFQUFDLENBQUMsQ0FBQztFQUN6QztFQUVBLFNBQVNsTixrQkFBa0JBLENBQUEsRUFBRztJQUMxQjBNLFVBQVUsQ0FBQyxJQUFJLENBQUNuSyxLQUFLLENBQUM7SUFDdEJ3SyxVQUFVLENBQUMsSUFBSSxDQUFDM00sV0FBVyxDQUFDO0lBQzVCLEtBQUksSUFBSW9ELElBQUksSUFBSXVDLGtEQUFTLEVBQUM7TUFDdEIsSUFBSXpDLE1BQU0sR0FBRyxJQUFJLENBQUMrSixpQkFBaUIsQ0FBQzdKLElBQUksQ0FBQztNQUN6QyxPQUFNLE9BQU9GLE1BQU0sS0FBSyxRQUFRLElBQUlBLE1BQU0sS0FBSyxJQUFJLEVBQUM7UUFDaERBLE1BQU0sR0FBRyxJQUFJLENBQUMrSixpQkFBaUIsQ0FBQzdKLElBQUksQ0FBQztNQUN6QztJQUNKO0VBQ0o7O0VBRUE7RUFDQSxTQUFTNkosaUJBQWlCQSxDQUFDVixRQUFRLEVBQUU7SUFDakMsTUFBTWYsVUFBVSxHQUFHN0Ysa0RBQVMsQ0FBQzRHLFFBQVEsQ0FBQyxDQUFDdE0sTUFBTTtJQUM3QyxTQUFTaU4sZUFBZUEsQ0FBQSxFQUFFO01BQ3RCLE9BQU81QixJQUFJLENBQUM2QixNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxZQUFZLEdBQUcsVUFBVTtJQUMxRDtJQUNBLFNBQVNDLGVBQWVBLENBQUNqRyxTQUFTLEVBQUM7TUFDL0IsSUFBSWtHLE1BQU0sR0FBRyxDQUFDO01BQ2QsSUFBSUMsTUFBTSxHQUFHLENBQUM7TUFDZCxJQUFJbkcsU0FBUyxLQUFLLFlBQVksRUFDMUJtRyxNQUFNLEdBQUk5QixVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBRXpCNkIsTUFBTSxHQUFHN0IsVUFBVSxHQUFHLENBQUM7TUFDM0IsSUFBSXBKLEdBQUcsR0FBR2tKLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUM2QixNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBR0UsTUFBTSxDQUFDLENBQUM7TUFDbkQsSUFBSWhMLEdBQUcsR0FBR2lKLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUM2QixNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBR0csTUFBTSxDQUFDLENBQUM7TUFDbkQsT0FBTyxDQUFDbEwsR0FBRyxFQUFDQyxHQUFHLENBQUM7SUFDcEI7SUFFQSxJQUFJOEUsU0FBUyxHQUFHK0YsZUFBZSxDQUFDLENBQUM7SUFDakMsSUFBSWpDLE1BQU0sR0FBR21DLGVBQWUsQ0FBQ2pHLFNBQVMsQ0FBQztJQUN2QyxJQUFJUSxXQUFXLEdBQUcsSUFBSSxDQUFDQyxjQUFjLENBQUM0RCxVQUFVLEVBQUNQLE1BQU0sRUFBRTlELFNBQVMsQ0FBQztJQUNuRSxPQUFNLENBQUNRLFdBQVcsQ0FBQ00sT0FBTyxFQUFDO01BQ3ZCZCxTQUFTLEdBQUcrRixlQUFlLENBQUMsQ0FBQztNQUM3QmpDLE1BQU0sR0FBR21DLGVBQWUsQ0FBQ2pHLFNBQVMsQ0FBQztNQUNuQ1EsV0FBVyxHQUFHLElBQUksQ0FBQ0MsY0FBYyxDQUFDNEQsVUFBVSxFQUFDUCxNQUFNLEVBQUM5RCxTQUFTLENBQUM7SUFDbEU7SUFDQSxPQUFPLElBQUksQ0FBQ2lCLFNBQVMsQ0FBQ21FLFFBQVEsRUFBRXRCLE1BQU0sRUFBRTlELFNBQVMsQ0FBQztFQUN0RDtFQUVBLFNBQVNvRyxVQUFVQSxDQUFDbkwsR0FBRyxFQUFDQyxHQUFHLEVBQUU7SUFFekIsSUFBRyxJQUFJLENBQUN5RixXQUFXLENBQUMxRixHQUFHLEVBQUNDLEdBQUcsQ0FBQyxLQUFLMEYsU0FBUyxFQUFFLE9BQU8sa0JBQWtCO0lBQ3JFLE1BQU15RixZQUFZLEdBQUcsSUFBSSxDQUFDckwsS0FBSyxDQUFDQyxHQUFHLENBQUMsQ0FBQ0MsR0FBRyxDQUFDO0lBQ3pDLElBQUdtTCxZQUFZLEtBQUssSUFBSSxFQUFFLElBQUksQ0FBQ3JMLEtBQUssQ0FBQ0MsR0FBRyxDQUFDLENBQUNDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUNuRDtNQUNEbUwsWUFBWSxDQUFDQyxHQUFHLENBQUMsQ0FBQztNQUNsQixJQUFJLENBQUN0TCxLQUFLLENBQUNDLEdBQUcsQ0FBQyxDQUFDQyxHQUFHLENBQUMsR0FBRyxLQUFLO0lBQ2hDO0lBQ0EsT0FBTyxDQUFDLElBQUksQ0FBQ0YsS0FBSyxDQUFDQyxHQUFHLENBQUMsQ0FBQ0MsR0FBRyxDQUFDLEVBQUUsQ0FBQ0QsR0FBRyxFQUFFQyxHQUFHLENBQUMsRUFBRW1MLFlBQVksQ0FBQztFQUMzRDtFQUVBLFNBQVNFLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ3pCLE9BQU8xTixXQUFXLENBQUMwTSxLQUFLLENBQUN0SixJQUFJLElBQUVBLElBQUksQ0FBQ08sTUFBTSxDQUFDLENBQUMsQ0FBQztFQUNqRDtFQUVBLE9BQU87SUFDSHhCLEtBQUs7SUFDTG5DLFdBQVc7SUFDWDhILFdBQVc7SUFDWEYsY0FBYztJQUNkUSxTQUFTO0lBQ1RiLFVBQVU7SUFDVjNILGtCQUFrQjtJQUNsQnFOLGlCQUFpQjtJQUNqQk0sVUFBVTtJQUNWRztFQUNKLENBQUM7QUFDTDtBQUVBLGlFQUFleEIsU0FBUzs7Ozs7Ozs7Ozs7Ozs7QUM3SnhCLFNBQVN5QixVQUFVQSxDQUFBLEVBQUU7RUFDakI7RUFDQSxNQUFNQyxnQkFBZ0IsR0FBR0MsaUJBQWlCLENBQUMsQ0FBQztFQUM1QyxJQUFJQyxRQUFRO0VBQ1o7RUFDQSxNQUFNQyxZQUFZLEdBQUMsRUFBRTtFQUNyQixNQUFNQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxPQUFPLENBQUM7RUFDL0MsSUFBSUMsZ0JBQWdCLEdBQUcsQ0FBQztFQUN4QixTQUFTNUssTUFBTUEsQ0FBQzZLLEtBQUssRUFBQztJQUNsQixJQUFHLElBQUksQ0FBQ0gsWUFBWSxDQUFDOU4sTUFBTSxHQUFHLENBQUMsRUFBQztNQUM1QixJQUFJLENBQUNrTyxpQkFBaUIsQ0FBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQ0gsWUFBWSxDQUFDQSxZQUFZLENBQUM5TixNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0U7SUFDQSxJQUFHLElBQUksQ0FBQzJOLGdCQUFnQixDQUFDM04sTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLHVCQUF1QjtJQUNyRTtJQUNBLElBQUcsSUFBSSxDQUFDOE4sWUFBWSxDQUFDOU4sTUFBTSxLQUFLLENBQUMsRUFBQztNQUM5QixJQUFHLElBQUksQ0FBQ2dPLGdCQUFnQixHQUFDLENBQUMsSUFBSTNDLElBQUksQ0FBQzZCLE1BQU0sR0FBQyxHQUFHLEVBQUM7UUFDMUMsTUFBTWlCLFVBQVUsR0FBR0YsS0FBSyxDQUFDdk8sU0FBUyxDQUFDd0MsS0FBSztRQUN4QyxLQUFJLElBQUlDLEdBQUcsR0FBRyxDQUFDLEVBQUVBLEdBQUcsR0FBQyxFQUFFLEVBQUdBLEdBQUcsRUFBRSxFQUFDO1VBQzVCLEtBQUksSUFBSUMsR0FBRyxHQUFHLENBQUMsRUFBRUEsR0FBRyxHQUFDLEVBQUUsRUFBRUEsR0FBRyxFQUFFLEVBQUM7WUFDM0IsTUFBTUMsSUFBSSxHQUFHNEwsS0FBSyxDQUFDdk8sU0FBUyxDQUFDbUksV0FBVyxDQUFDMUYsR0FBRyxFQUFDQyxHQUFHLENBQUM7WUFDakQsSUFBRyxPQUFPQyxJQUFJLEtBQUssUUFBUSxJQUFJQSxJQUFJLEtBQUssSUFBSSxFQUFDO2NBQ3pDMEUsT0FBTyxDQUFDQyxHQUFHLENBQUMsVUFBVSxDQUFDO2NBQ3ZCLE9BQU8sQ0FBQzdFLEdBQUcsRUFBQ0MsR0FBRyxDQUFDO1lBQ3BCO1VBQ0o7UUFDSjtNQUNKO01BQ0EsSUFBSWdNLFlBQVksR0FBRyxJQUFJLENBQUNDLGFBQWEsQ0FBQ0osS0FBSyxDQUFDO01BQzVDLE9BQU9HLFlBQVk7SUFDdkI7SUFDQTtJQUNBLE1BQU1FLE9BQU8sR0FBRyxJQUFJLENBQUNSLFlBQVksQ0FBQ0EsWUFBWSxDQUFDOU4sTUFBTSxHQUFFLENBQUMsQ0FBQztJQUN6RCxNQUFNdU8sYUFBYSxHQUFHLElBQUksQ0FBQ0MsbUJBQW1CLENBQUNQLEtBQUssRUFBQ0ssT0FBTyxDQUFDO0lBQzdELE1BQU1HLFlBQVksR0FBR0YsYUFBYSxDQUFDM0csTUFBTSxDQUFDdkYsSUFBSSxJQUFJO01BQzlDLE9BQVFBLElBQUksQ0FBQ3FNLFVBQVUsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDUixpQkFBaUIsQ0FBQ0QsS0FBSyxFQUFFNUwsSUFBSSxDQUFDc00sWUFBWSxDQUFDLEtBQUssS0FBSztJQUNuRyxDQUFDLENBQUM7SUFDRjtJQUNBLElBQUdGLFlBQVksQ0FBQ3pPLE1BQU0sR0FBRyxDQUFDLEVBQUM7TUFDdkIsTUFBTTRPLGlCQUFpQixHQUFDSCxZQUFZLENBQUNwRCxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDNkIsTUFBTSxDQUFDLENBQUMsR0FBR3VCLFlBQVksQ0FBQ3pPLE1BQU0sQ0FBQyxDQUFDO01BQ3JGLElBQUk2TyxRQUFRLEdBQUcsSUFBSSxDQUFDQyxxQkFBcUIsQ0FBQ2IsS0FBSyxFQUFDSyxPQUFPLEVBQUMsSUFBSSxDQUFDUyxhQUFhLENBQUNILGlCQUFpQixDQUFDSSxTQUFTLENBQUMsQ0FBQztNQUN4RyxJQUFHSCxRQUFRLEtBQUcsS0FBSyxFQUFDO1FBQ2hCQSxRQUFRLEdBQUUsSUFBSSxDQUFDQyxxQkFBcUIsQ0FBQ2IsS0FBSyxFQUFDSyxPQUFPLEVBQUNNLGlCQUFpQixDQUFDSSxTQUFTLENBQUM7TUFDbkY7TUFBQztNQUNELE9BQU1ILFFBQVEsS0FBSSxLQUFLLEVBQUM7UUFDcEJBLFFBQVEsR0FBRyxJQUFJLENBQUNDLHFCQUFxQixDQUFDYixLQUFLLEVBQUNLLE9BQU8sRUFBQyxJQUFJLENBQUNQLFVBQVUsQ0FBQzFDLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUM2QixNQUFNLENBQUMsQ0FBQyxHQUFFLElBQUksQ0FBQ2EsVUFBVSxDQUFDL04sTUFBTSxDQUFDLENBQUMsQ0FBQztNQUMzSDtNQUFDO01BQ0QsT0FBTzZPLFFBQVE7SUFDbkI7O0lBRUE7SUFDQSxLQUFJLElBQUkzRixDQUFDLEdBQUcsSUFBSSxDQUFDNEUsWUFBWSxDQUFDOU4sTUFBTSxHQUFHLENBQUMsRUFBRWtKLENBQUMsSUFBRyxDQUFDLEVBQUdBLENBQUMsRUFBRSxFQUFDO01BQ2xELE1BQU03RyxJQUFJLEdBQUcsSUFBSSxDQUFDeUwsWUFBWSxDQUFDNUUsQ0FBQyxDQUFDO01BQ2pDLE1BQU1qRyxNQUFNLEdBQUcsSUFBSSxDQUFDZ00sWUFBWSxDQUFDWCxPQUFPLEVBQUNqTSxJQUFJLENBQUM7TUFDOUMsSUFBR1ksTUFBTSxFQUFDO1FBQ04sSUFBSTRMLFFBQVEsR0FBRyxJQUFJLENBQUNDLHFCQUFxQixDQUFDYixLQUFLLEVBQUVLLE9BQU8sRUFBRXJMLE1BQU0sQ0FBQytMLFNBQVMsQ0FBQztRQUMzRSxJQUFHSCxRQUFRLEVBQUUsT0FBT0EsUUFBUTtNQUNoQztJQUNKO0lBQ0EsTUFBTUssb0JBQW9CLEdBQUdYLGFBQWEsQ0FBQzNHLE1BQU0sQ0FBQ3ZGLElBQUksSUFBSTtNQUN0RCxPQUFPLE9BQU9BLElBQUksQ0FBQ3FNLFVBQVUsS0FBSyxRQUFRLElBQUlyTSxJQUFJLENBQUNxTSxVQUFVLEtBQUs1RyxTQUFTO0lBQy9FLENBQUMsQ0FBQztJQUNGLE1BQU16RixJQUFJLEdBQUc2TSxvQkFBb0IsQ0FBQzdELElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUM2QixNQUFNLENBQUMsQ0FBQyxHQUFHZ0Msb0JBQW9CLENBQUNsUCxNQUFNLENBQUMsQ0FBQztJQUMxRjtJQUNBLE9BQU9xQyxJQUFJLENBQUNzTSxZQUFZO0VBRTVCO0VBRUEsU0FBU04sYUFBYUEsQ0FBQ0osS0FBSyxFQUFFO0lBQzFCLElBQUcsSUFBSSxDQUFDTixnQkFBZ0IsQ0FBQzNOLE1BQU0sS0FBSSxDQUFDLEVBQUUsT0FBTyxzQkFBc0I7SUFDbkU7SUFDQSxJQUFJbVAsUUFBUSxHQUFHOUQsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQzZCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDUyxnQkFBZ0IsQ0FBQzNOLE1BQU0sQ0FBQztJQUN2RSxJQUFJb1AsUUFBUSxHQUFHL0QsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQzZCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDUyxnQkFBZ0IsQ0FBQ3dCLFFBQVEsQ0FBQyxDQUFDblAsTUFBTSxDQUFDO0lBQ2pGLElBQUlxQyxJQUFJLEdBQUcsSUFBSSxDQUFDc0wsZ0JBQWdCLENBQUN3QixRQUFRLENBQUMsQ0FBQ0MsUUFBUSxDQUFDO0lBQ3BEO0lBQ0EsTUFBTWIsYUFBYSxHQUFHLElBQUksQ0FBQ0MsbUJBQW1CLENBQUNQLEtBQUssRUFBRTVMLElBQUksQ0FBQztJQUMzRCxJQUFHa00sYUFBYSxDQUFDOUIsS0FBSyxDQUFDcEssSUFBSSxJQUFJLE9BQU9BLElBQUksQ0FBQ3FNLFVBQVUsS0FBSyxRQUFRLENBQUMsRUFBRTtNQUNqRSxPQUFPLElBQUksQ0FBQ0wsYUFBYSxDQUFDSixLQUFLLENBQUM7SUFDcEM7SUFDQSxPQUFPNUwsSUFBSTtFQUNmO0VBQ0E7RUFDQTtFQUNBLFNBQVNnTiw4QkFBOEJBLENBQUNoTixJQUFJLEVBQUU7SUFDMUMsS0FBSyxJQUFJRixHQUFHLEdBQUcsQ0FBQyxFQUFFQSxHQUFHLEdBQUcsSUFBSSxDQUFDd0wsZ0JBQWdCLENBQUMzTixNQUFNLEVBQUVtQyxHQUFHLEVBQUUsRUFBRTtNQUN6RCxLQUFLLElBQUlDLEdBQUcsR0FBRyxDQUFDLEVBQUVBLEdBQUcsR0FBRyxJQUFJLENBQUN1TCxnQkFBZ0IsQ0FBQ3hMLEdBQUcsQ0FBQyxDQUFDbkMsTUFBTSxFQUFFb0MsR0FBRyxFQUFFLEVBQUU7UUFDOUQsTUFBTUssTUFBTSxHQUFHLElBQUksQ0FBQ2tMLGdCQUFnQixDQUFDeEwsR0FBRyxDQUFDLENBQUNDLEdBQUcsQ0FBQztRQUM5QyxJQUFJQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUtJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSUosSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7VUFDaEQsSUFBSSxDQUFDa0wsZ0JBQWdCLENBQUN4TCxHQUFHLENBQUMsQ0FBQzRLLE1BQU0sQ0FBQzNLLEdBQUcsRUFBRSxDQUFDLENBQUM7VUFDekMsSUFBSSxJQUFJLENBQUN1TCxnQkFBZ0IsQ0FBQ3hMLEdBQUcsQ0FBQyxDQUFDbkMsTUFBTSxLQUFLLENBQUMsRUFDdkMsSUFBSSxDQUFDMk4sZ0JBQWdCLENBQUNaLE1BQU0sQ0FBQzVLLEdBQUcsRUFBRSxDQUFDLENBQUM7VUFDeEM7UUFDSjtNQUNKO0lBQ0o7RUFDSjtFQUNBLFNBQVNxTSxtQkFBbUJBLENBQUNQLEtBQUssRUFBRzVMLElBQUksRUFBRTtJQUN2QyxPQUFPMEwsVUFBVSxDQUFDdUIsR0FBRyxDQUFDTixTQUFTLElBQUc7TUFDOUIsTUFBTUwsWUFBWSxHQUFHLElBQUksQ0FBQ1ksZUFBZSxDQUFDbE4sSUFBSSxFQUFFMk0sU0FBUyxDQUFDO01BQzFELElBQUlOLFVBQVUsR0FBR1QsS0FBSyxDQUFDdk8sU0FBUyxDQUFDbUksV0FBVyxDQUFDOEcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFDQSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDN0UsSUFBR0QsVUFBVSxLQUFLLEtBQUssRUFBRTtRQUNyQixJQUFHLElBQUksQ0FBQ1IsaUJBQWlCLENBQUNELEtBQUssRUFBQ1UsWUFBWSxDQUFDLEVBQUVELFVBQVUsR0FBRyxNQUFNO01BQ3RFO01BQ0EsT0FBTztRQUNIQSxVQUFVO1FBQ1ZDLFlBQVk7UUFDWks7TUFDSixDQUFDO0lBQ0wsQ0FBQyxDQUFDO0VBQ047RUFFQSxTQUFTTyxlQUFlQSxDQUFDbE4sSUFBSSxFQUFHMk0sU0FBUyxFQUFDO0lBQzFDLElBQUksQ0FBQzdNLEdBQUcsRUFBRUMsR0FBRyxDQUFDLEdBQUdDLElBQUk7SUFDckIsUUFBUTJNLFNBQVM7TUFDYixLQUFLLElBQUk7UUFDTDdNLEdBQUcsRUFBRTtRQUNMO01BQ0osS0FBSyxNQUFNO1FBQ1BBLEdBQUcsRUFBRTtRQUNMO01BQ0osS0FBSyxNQUFNO1FBQ1BDLEdBQUcsRUFBRTtRQUNMO01BQ0osS0FBSyxPQUFPO1FBQ1JBLEdBQUcsRUFBRTtRQUNMO01BQ0o7UUFDSTtJQUNSO0lBQUM7SUFDRCxPQUFPLENBQUNELEdBQUcsRUFBRUMsR0FBRyxDQUFDO0VBQ2pCO0VBRUEsU0FBUzZNLFlBQVlBLENBQUM1TSxJQUFJLEVBQUVtTixhQUFhLEVBQUM7SUFDdEMsSUFBSVIsU0FBUztJQUNiLElBQUlTLGlCQUFpQjtJQUNyQixJQUFJQyxRQUFRO0lBQ1osSUFBR3JOLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBS21OLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBQztNQUM1QixNQUFNRyxJQUFJLEdBQUd0TixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUVtTixhQUFhLENBQUMsQ0FBQyxDQUFDO01BQ3RDUixTQUFTLEdBQUdXLElBQUksR0FBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU87TUFDdENGLGlCQUFpQixHQUFHRSxJQUFJLEdBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxNQUFNO01BQzdDRCxRQUFRLEdBQUdyRSxJQUFJLENBQUN1RSxHQUFHLENBQUNELElBQUksQ0FBQztJQUM3QixDQUFDLE1BQUssSUFBR3ROLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSW1OLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBQztNQUNqQyxNQUFNRyxJQUFJLEdBQUd0TixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUNtTixhQUFhLENBQUMsQ0FBQyxDQUFDO01BQ3JDUixTQUFTLEdBQUdXLElBQUksR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLElBQUk7TUFDcENGLGlCQUFpQixHQUFHRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNO01BQzVDRCxRQUFRLEdBQUdyRSxJQUFJLENBQUN1RSxHQUFHLENBQUNELElBQUksQ0FBQztJQUM3QixDQUFDLE1BQUk7TUFDRCxPQUFPLEtBQUs7SUFDaEI7SUFDQSxPQUFPO01BQ0hYLFNBQVM7TUFDVFMsaUJBQWlCO01BQ2pCQztJQUNKLENBQUM7RUFDTDs7RUFFQTtFQUNBLFNBQVNaLHFCQUFxQkEsQ0FBQ2IsS0FBSyxFQUFFNUwsSUFBSSxFQUFFMk0sU0FBUyxFQUFDO0lBQ2xELElBQUlILFFBQVEsR0FBR1UsZUFBZSxDQUFDbE4sSUFBSSxFQUFFMk0sU0FBUyxDQUFDO0lBQy9DLEtBQUksSUFBSTlGLENBQUMsR0FBRyxDQUFDLEVBQUdBLENBQUMsR0FBRSxDQUFDLEVBQUdBLENBQUMsRUFBRSxFQUFDO01BQ3ZCLElBQUkyRyxjQUFjLEdBQUU1QixLQUFLLENBQUN2TyxTQUFTLENBQUNtSSxXQUFXLENBQUNnSCxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUNBLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN4RSxJQUFHLE9BQU9nQixjQUFjLEtBQUssUUFBUSxJQUFJQSxjQUFjLEtBQUssSUFBSSxFQUFHLE9BQU9oQixRQUFRO01BQ2xGLElBQUdnQixjQUFjLEtBQUsvSCxTQUFTLEVBQUcsT0FBTyxLQUFLO01BQzlDLElBQUcrSCxjQUFjLEtBQUssTUFBTSxFQUFFLE9BQU8sS0FBSztNQUMxQyxJQUFHQSxjQUFjLEtBQUssS0FBSyxFQUFDO1FBQ3hCLElBQUcsSUFBSSxDQUFDM0IsaUJBQWlCLENBQUNELEtBQUssRUFBRVksUUFBUSxDQUFDLEVBQUUsT0FBTyxLQUFLO01BQzVEO01BQ0FBLFFBQVEsR0FBR1UsZUFBZSxDQUFDVixRQUFRLEVBQUNHLFNBQVMsQ0FBQztJQUNsRDtJQUNBLE9BQU8sS0FBSztFQUNoQjtFQUVBLFNBQVNELGFBQWFBLENBQUNDLFNBQVMsRUFBQztJQUM3QixRQUFPQSxTQUFTO01BQ1osS0FBSyxJQUFJO1FBQ0wsT0FBTyxNQUFNO01BQ2pCLEtBQUssTUFBTTtRQUNQLE9BQU8sSUFBSTtNQUNmLEtBQUssT0FBTztRQUNSLE9BQU8sTUFBTTtNQUNqQixLQUFLLE1BQU07UUFDUCxPQUFPLE9BQU87TUFDbEI7UUFDSSxPQUFPLEtBQUs7SUFDcEI7RUFDSjs7RUFFQTtFQUNBO0VBQ0EsU0FBU2QsaUJBQWlCQSxDQUFDRCxLQUFLLEVBQUM1TCxJQUFJLEVBQUM7SUFDbEMsTUFBTXlOLFNBQVMsR0FBRzdCLEtBQUssQ0FBQ3ZPLFNBQVMsQ0FBQ0ssV0FBVztJQUM3QyxJQUFJZ1EsT0FBTztJQUNYRCxTQUFTLENBQUNsTSxPQUFPLENBQUNULElBQUksSUFBSTtNQUN0QixJQUFHQSxJQUFJLENBQUNRLE9BQU8sQ0FBQ3FNLElBQUksQ0FBQ3ZOLE1BQU0sSUFBSTtRQUMzQixPQUFRQSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUtKLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFNSixJQUFJLENBQUMsQ0FBQyxDQUFDO01BQzNELENBQUMsQ0FBQyxFQUFFME4sT0FBTyxHQUFHNU0sSUFBSTtNQUFDO0lBQ3ZCLENBQUMsQ0FBQztJQUNGLElBQUc0TSxPQUFPLENBQUNyTSxNQUFNLENBQUMsQ0FBQyxFQUFDO01BQ2hCcU0sT0FBTyxDQUFDcE0sT0FBTyxDQUFDQyxPQUFPLENBQUNuQixNQUFNLElBQUk7UUFDOUIsTUFBTXdOLEtBQUssR0FBRyxJQUFJLENBQUNuQyxZQUFZLENBQUNvQyxTQUFTLENBQUNoTixRQUFRLElBQUk7VUFDbEQsT0FBUUEsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLVCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlTLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBS1QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUM7UUFDRixJQUFHd04sS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQ25DLFlBQVksQ0FBQ2YsTUFBTSxDQUFDa0QsS0FBSyxFQUFFLENBQUMsQ0FBQztNQUNyRCxDQUFDLENBQUM7TUFDRixPQUFPLElBQUk7SUFDZixDQUFDLE1BQU0sT0FBTyxLQUFLO0VBQ3ZCO0VBQ0EsT0FBTztJQUNIdEMsZ0JBQWdCO0lBQ2hCRSxRQUFRO0lBQ1JDLFlBQVk7SUFDWkMsVUFBVTtJQUNWQyxnQkFBZ0I7SUFDaEI1SyxNQUFNO0lBQ05pTCxhQUFhO0lBQ2JnQiw4QkFBOEI7SUFDOUJFLGVBQWU7SUFDZmYsbUJBQW1CO0lBQ25CTSxxQkFBcUI7SUFDckJHLFlBQVk7SUFDWkYsYUFBYTtJQUNiYjtFQUNKLENBQUM7QUFDTDtBQUVBLFNBQVNOLGlCQUFpQkEsQ0FBQSxFQUFFO0VBQ3hCLE1BQU11QyxXQUFXLEdBQUcsRUFBRTtFQUN0QixLQUFJLElBQUloTyxHQUFHLEdBQUcsQ0FBQyxFQUFHQSxHQUFHLEdBQUUsRUFBRSxFQUFHQSxHQUFHLEVBQUUsRUFBQztJQUM5QixJQUFJaUssUUFBUSxHQUFHLEVBQUU7SUFDakIsS0FBSSxJQUFJaEssR0FBRyxHQUFHLENBQUMsRUFBR0EsR0FBRyxHQUFHLEVBQUUsRUFBR0EsR0FBRyxFQUFFLEVBQUM7TUFDL0JnSyxRQUFRLENBQUNHLElBQUksQ0FBQyxDQUFDcEssR0FBRyxFQUFDQyxHQUFHLENBQUMsQ0FBQztJQUM1QjtJQUNBK04sV0FBVyxDQUFDNUQsSUFBSSxDQUFDSCxRQUFRLENBQUM7RUFDOUI7RUFDQSxPQUFPK0QsV0FBVztBQUN0QjtBQUVBLGlFQUFlekMsVUFBVTs7Ozs7Ozs7Ozs7Ozs7O0FDNU9LO0FBRTlCLFNBQVN6UCxJQUFJQSxDQUFBLEVBQUU7RUFDWCxJQUFJbUIsT0FBTztFQUNYLElBQUlDLE9BQU87RUFDWCxJQUFJMkQsYUFBYTtFQUNqQixJQUFJRCxlQUFlO0VBRW5CLFNBQVN2RCxZQUFZQSxDQUFDdUMsSUFBSSxFQUFFUSxNQUFNLEVBQUM7SUFDL0IsT0FBTzZOLG1EQUFNLENBQUNyTyxJQUFJLEVBQUVRLE1BQU0sQ0FBQztFQUMvQjtFQUVBLFNBQVN0RCxPQUFPQSxDQUFDRyxPQUFPLEVBQUVDLE9BQU8sRUFBQztJQUM5QixJQUFJLENBQUNELE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUNDLE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUMyRCxhQUFhLEdBQUksSUFBSSxDQUFDNUQsT0FBTztJQUNsQyxJQUFJLENBQUMyRCxlQUFlLEdBQUcsSUFBSSxDQUFDMUQsT0FBTztFQUN2QztFQUVBLFNBQVMyRSxVQUFVQSxDQUFBLEVBQUU7SUFDakIsSUFBSSxDQUFDaEIsYUFBYSxHQUFHLElBQUksQ0FBQ0EsYUFBYSxLQUFLLElBQUksQ0FBQzVELE9BQU8sR0FDbEQsSUFBSSxDQUFDQyxPQUFPLEdBQ1osSUFBSSxDQUFDRCxPQUFPO0lBQ2xCLElBQUksQ0FBQzJELGVBQWUsR0FBRyxJQUFJLENBQUNBLGVBQWUsS0FBSyxJQUFJLENBQUMxRCxPQUFPLEdBQ3RELElBQUksQ0FBQ0QsT0FBTyxHQUNaLElBQUksQ0FBQ0MsT0FBTztFQUN0QjtFQUNBLFNBQVN5RSxhQUFhQSxDQUFBLEVBQUU7SUFDcEIsSUFBRyxJQUFJLENBQUMxRSxPQUFPLENBQUNNLFNBQVMsQ0FBQytOLGlCQUFpQixDQUFDLENBQUMsRUFDekMsT0FBTyxJQUFJLENBQUNwTyxPQUFPLENBQUMsS0FDbkIsSUFBRyxJQUFJLENBQUNBLE9BQU8sQ0FBQ0ssU0FBUyxDQUFDK04saUJBQWlCLENBQUMsQ0FBQyxFQUM5QyxPQUFPLElBQUksQ0FBQ3JPLE9BQU8sQ0FBQyxLQUVwQixPQUFPLEtBQUs7RUFDcEI7RUFDQSxPQUFPO0lBQ0hBLE9BQU87SUFDUEMsT0FBTztJQUNQMkQsYUFBYTtJQUNiRCxlQUFlO0lBQ2Z2RCxZQUFZO0lBQ1pQLE9BQU87SUFDUCtFLFVBQVU7SUFDVkY7RUFDSixDQUFDO0FBQ0w7QUFDQSxpRUFBZTdGLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Q2M7QUFDSTtBQUVyQyxTQUFTbVMsTUFBTUEsQ0FBQ3hPLFVBQVUsRUFBRXlPLFNBQVMsRUFBQztFQUNsQyxJQUFJdE8sSUFBSSxHQUFHLE9BQU9ILFVBQVUsS0FBSyxRQUFRLEdBQUdBLFVBQVUsR0FBRyxLQUFLO0VBQzlELE1BQU1XLE1BQU0sR0FBRzhOLFNBQVM7RUFDeEIsTUFBTXhPLElBQUksR0FBRyxPQUFPRCxVQUFVLEtBQUssUUFBUSxHQUFHLEtBQUssR0FBRyxJQUFJO0VBQzFELE1BQU1sQyxTQUFTLEdBQUd1TSxrREFBUyxDQUFDLENBQUM7RUFDN0IsTUFBTWdDLEtBQUssR0FBR1AsdURBQVUsQ0FBQyxDQUFDO0VBQzFCLFNBQVN0SyxNQUFNQSxDQUFDVCxNQUFNLEVBQUVSLEdBQUcsRUFBR0MsR0FBRyxFQUFDO0lBQzlCLElBQUcsSUFBSSxDQUFDUCxJQUFJLEVBQUM7TUFDVCxJQUFHLElBQUksQ0FBQ29NLEtBQUssQ0FBQ04sZ0JBQWdCLENBQUMzTixNQUFNLEtBQUssQ0FBQyxFQUN2QyxPQUFPLHVCQUF1QjtNQUNsQyxDQUFDbUMsR0FBRyxFQUFDQyxHQUFHLENBQUMsR0FBRSxJQUFJLENBQUM2TCxLQUFLLENBQUM3SyxNQUFNLENBQUNULE1BQU0sQ0FBQztJQUN4QztJQUNBO0lBQ0EsTUFBTU0sTUFBTSxHQUFHTixNQUFNLENBQUNqRCxTQUFTLENBQUM0TixVQUFVLENBQUNuTCxHQUFHLEVBQUNDLEdBQUcsQ0FBQztJQUNuRCxJQUFHLElBQUksQ0FBQ1AsSUFBSSxFQUFDO01BQ1QsSUFBR29CLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUM7UUFDbkIsSUFBSSxDQUFDZ0wsS0FBSyxDQUFDSCxZQUFZLENBQUN2QixJQUFJLENBQUN0SixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDZ0wsS0FBSyxDQUFDRCxnQkFBZ0IsR0FBRyxDQUFDO01BQ25DO01BQ0EsSUFBRy9LLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUUsSUFBSSxDQUFDZ0wsS0FBSyxDQUFDRCxnQkFBZ0IsRUFBRTtNQUN0RCxJQUFHL0ssTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRSxJQUFJLENBQUNnTCxLQUFLLENBQUNKLFFBQVEsR0FBRzVLLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDeEQsSUFBSSxDQUFDZ0wsS0FBSyxDQUFDb0IsOEJBQThCLENBQUNwTSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQ7SUFDQSxPQUFPQSxNQUFNO0VBQ2pCO0VBQ0EsT0FBTTtJQUNGbEIsSUFBSTtJQUNKUSxNQUFNO0lBQ05WLElBQUk7SUFDSm5DLFNBQVM7SUFDVHVPLEtBQUs7SUFDTDdLO0VBQ0osQ0FBQztBQUNMO0FBRUEsaUVBQWVnTixNQUFNOzs7Ozs7Ozs7Ozs7OztBQ3RDckIsTUFBTTFLLFNBQVMsR0FBRztFQUNkNEssT0FBTyxFQUFDO0lBQ0o5UixFQUFFLEVBQUUsQ0FBQztJQUNMdUQsSUFBSSxFQUFHLFNBQVM7SUFDaEIvQixNQUFNLEVBQUM7RUFDWCxDQUFDO0VBQ0R1USxVQUFVLEVBQUM7SUFDUC9SLEVBQUUsRUFBQyxDQUFDO0lBQ0p1RCxJQUFJLEVBQUUsWUFBWTtJQUNsQi9CLE1BQU0sRUFBQztFQUNYLENBQUM7RUFDRHdRLFNBQVMsRUFBQztJQUNOaFMsRUFBRSxFQUFDLENBQUM7SUFDSnVELElBQUksRUFBQyxXQUFXO0lBQ2hCL0IsTUFBTSxFQUFDO0VBQ1gsQ0FBQztFQUNEeVEsU0FBUyxFQUFDO0lBQ05qUyxFQUFFLEVBQUMsQ0FBQztJQUNKdUQsSUFBSSxFQUFDLFdBQVc7SUFDaEIvQixNQUFNLEVBQUM7RUFDWCxDQUFDO0VBQ0QwUSxNQUFNLEVBQUM7SUFDSGxTLEVBQUUsRUFBQyxDQUFDO0lBQ0p1RCxJQUFJLEVBQUMsUUFBUTtJQUNiL0IsTUFBTSxFQUFDO0VBQ1g7QUFDSixDQUFDO0FBQ0QsaUVBQWUwRixTQUFTOzs7Ozs7Ozs7Ozs7Ozs7QUMzQlc7QUFDbkMsU0FBU3NHLElBQUlBLENBQUNNLFFBQVEsRUFBQztFQUNuQixNQUFNekYsSUFBSSxHQUFHeUYsUUFBUTtFQUNyQixNQUFNdE0sTUFBTSxHQUFHMEYsa0RBQVMsQ0FBQzRHLFFBQVEsQ0FBQyxDQUFDdE0sTUFBTTtFQUN6QyxJQUFJMlEsSUFBSSxHQUFHLENBQUM7RUFDWixJQUFJaE4sT0FBTztFQUNYLElBQUl1RCxTQUFTO0VBQ2IsU0FBU3NHLEdBQUdBLENBQUEsRUFBRTtJQUNWLElBQUksQ0FBQ21ELElBQUksRUFBRTtFQUNmO0VBQ0EsU0FBU2pOLE1BQU1BLENBQUEsRUFBRTtJQUNiLElBQUcsSUFBSSxDQUFDaU4sSUFBSSxJQUFJLElBQUksQ0FBQzNRLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQyxLQUNwQyxPQUFPLEtBQUs7RUFDckI7RUFDQSxPQUFPO0lBQ0g2RyxJQUFJO0lBQ0o3RyxNQUFNO0lBQ04yUSxJQUFJO0lBQ0poTixPQUFPO0lBQ1B1RCxTQUFTO0lBQ1RzRyxHQUFHO0lBQ0g5SjtFQUNKLENBQUM7QUFDTDtBQUNBLGlFQUFlc0ksSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJuQjtBQUMwRztBQUNqQjtBQUN6Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLE9BQU8scUZBQXFGLEtBQUssWUFBWSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxPQUFPLFlBQVksTUFBTSxVQUFVLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE1BQU0sS0FBSyxVQUFVLEtBQUssVUFBVSxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxNQUFNLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxLQUFLLFVBQVUsWUFBWSxNQUFNLEtBQUssTUFBTSxhQUFhLE1BQU0sVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLEtBQUssWUFBWSxNQUFNLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxjQUFjLE1BQU0sS0FBSyxVQUFVLFlBQVksTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLE1BQU0sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLFdBQVcsS0FBSyxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFlBQVksV0FBVyxVQUFVLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxNQUFNLFVBQVUsVUFBVSxLQUFLLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxNQUFNLEtBQUssVUFBVSxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxNQUFNLE1BQU0sYUFBYSxNQUFNLFlBQVksT0FBTyxZQUFZLE1BQU0sVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLEtBQUssWUFBWSxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE1BQU0sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sVUFBVSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLE9BQU8sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLGFBQWEsTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLGFBQWEsTUFBTSxNQUFNLFlBQVksTUFBTSxZQUFZLFdBQVcsVUFBVSxZQUFZLFdBQVcsWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxL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NURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7QUNBb0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvRE9NL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0RPTS9mb290ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0RPTS9oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0RPTS9zaGlwUGxhY2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZW5lbXlMb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwVHlwZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHYW1lIGZyb20gJy4uL2dhbWUnO1xyXG5pbXBvcnQgY3JlYXRlSGVhZGVyIGZyb20gJy4vaGVhZGVyJztcclxuaW1wb3J0IGNyZWF0ZUZvb3RlciBmcm9tICcuL2Zvb3Rlcic7XHJcbmltcG9ydCBzZXR1cCBmcm9tICcuL3NoaXBQbGFjZXInO1xyXG5cclxuY29uc3QgYXBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbmFwcC5pZCA9ICdhcHAnO1xyXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFwcCk7XHJcbmNvbnN0IGhlYWRlciA9IGNyZWF0ZUhlYWRlcigpO1xyXG5jb25zdCBmb290ZXIgPSBjcmVhdGVGb290ZXIoKTtcclxuY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5nYW1lQ29udGFpbmVyLmlkID0gJ2dhbWUtY29udGFpbmVyJztcclxuYXBwLmFwcGVuZENoaWxkKGhlYWRlcik7XHJcbmFwcC5hcHBlbmRDaGlsZChnYW1lQ29udGFpbmVyKTtcclxuYXBwLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcblxyXG5jb25zdCBuZXdHYW1lQnV0dG9uID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5uZXctZ2FtZS1idXR0b24nKTtcclxubmV3R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsbmV3R2FtZSk7XHJcbmNvbnN0IGdhbWUgPSBHYW1lKCk7XHJcbm5ld0dhbWUoKTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZShwbGF5ZXIxLCBwbGF5ZXIyKXtcclxuICAgIGdhbWUubmV3R2FtZShwbGF5ZXIxLCBwbGF5ZXIyKTtcclxuICAgIGRyYXdHYW1lKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5ld0dhbWUoKXtcclxuICAgIGNvbnN0IG5ld1BsYXllcjEgPSBnYW1lLkNyZWF0ZVBsYXllcignSm9obicsIDEpO1xyXG4gICAgY29uc3QgbmV3UGxheWVyMiA9IGdhbWUuQ3JlYXRlUGxheWVyKGZhbHNlLCAyKTtcclxuICAgIG5ld1BsYXllcjIuZ2FtZWJvYXJkLnBsYWNlU2hpcHNSYW5kb21seSgpO1xyXG4gICAgZHJhd1NldHVwKG5ld1BsYXllcjEpO1xyXG4gICAgY29uc3Qgc3RhcnRHYW1lQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0LWdhbWUtYnV0dG9uJyk7XHJcbiAgICBzdGFydEdhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xyXG4gICAgICAgIGlmKG5ld1BsYXllcjEuZ2FtZWJvYXJkLnBsYWNlZFNoaXBzLmxlbmd0aCA9PT0gNSl7XHJcbiAgICAgICAgICAgIHN0YXJ0R2FtZShuZXdQbGF5ZXIxLCBuZXdQbGF5ZXIyKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJDb250YWluZXIoY29udGFpbmVyKXtcclxuICAgIHdoaWxlKGNvbnRhaW5lci5maXJzdENoaWxkKSBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xyXG59XHJcbmZ1bmN0aW9uIGRyYXdHYW1lKCl7XHJcbiAgICBjbGVhckNvbnRhaW5lcihnYW1lQ29udGFpbmVyKTtcclxuICAgIGNvbnN0IHBsYXllcjFCb2FyZENvbnRhaW5lciA9IGRyYXdCb2FyZENvbnRhaW5lcihnYW1lLnBsYXllcjEpO1xyXG4gICAgY29uc3QgcGxheWVyMkJvYXJkQ29udGFpbmVyID0gZHJhd0JvYXJkQ29udGFpbmVyKGdhbWUucGxheWVyMik7XHJcbiAgICBwb3B1bGF0ZUJvYXJkKGdhbWUucGxheWVyMSwgcGxheWVyMUJvYXJkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZCcpKTtcclxuICAgIGdhbWVDb250YWluZXIuYXBwZW5kKHBsYXllcjFCb2FyZENvbnRhaW5lciwgcGxheWVyMkJvYXJkQ29udGFpbmVyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1NldHVwKHBsYXllcil7XHJcbiAgICBjbGVhckNvbnRhaW5lcihnYW1lQ29udGFpbmVyKTtcclxuICAgIGNvbnN0IHNldHVwQm9hcmQgPSBzZXR1cC5kcmF3U2V0dXBCb2FyZChwbGF5ZXIsIGRyYXdCb2FyZENvbnRhaW5lcihwbGF5ZXIpKTtcclxuICAgIGNvbnN0IHNldHVwU2hpcHMgPSBzZXR1cC5kcmF3U2V0dXBTaGlwcygpO1xyXG4gICAgY29uc3Qgc2hpcHMgPSBzZXR1cFNoaXBzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXR1cC1zaGlwLWJveCcpO1xyXG4gICAgZ2FtZUNvbnRhaW5lci5hcHBlbmQoc2V0dXBCb2FyZCwgc2V0dXBTaGlwcyk7XHJcbn1cclxuXHJcbi8vIElmIHRoZSBnYW1lIGNvbnRhaW5lciBoZWlnaHQgaWYgb3ZlciA1MDBweCwgd2UgY2FuIHNlZSB0aGUgZmxleGJveCBpcyB3cmFwcGVkXHJcbi8vIFdlIHRoZW4gYWRqdXN0IHRoZSBoZWFkZXIgdG8gbWF0Y2ggdGhlIHdpZHRoIG9mIHRoZSBnYW1lIGJvYXJkcyAtIGluc3RlYWQgb2YgYmVpbmcgMTAwJSB3aWRlXHJcbmNvbnN0IGdhbWVTaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoZW50cnkgPT4ge1xyXG4gICAgaWYoZW50cnlbMF0uY29udGVudFJlY3QuaGVpZ2h0PjUwMCkgXHJcbiAgICAgICAgaGVhZGVyLnN0eWxlLndpZHRoID0gJzMyMHB4JztcclxuICAgIGVsc2UgXHJcbiAgICAgICAgaGVhZGVyLnN0eWxlLndpZHRoID0gYCR7ZW50cnlbMF0uY29udGVudFJlY3Qud2lkdGh9cHhgO1xyXG59KVxyXG5nYW1lU2l6ZU9ic2VydmVyLm9ic2VydmUoZ2FtZUNvbnRhaW5lcik7XHJcblxyXG4vL2hvbGQgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBwbGF5ZXIncyBib2FyZCAtIG5hbWUgLCBib2FyZCBhbmQgc2hpcHMgbGVmdFxyXG5cclxuZnVuY3Rpb24gZHJhd0JvYXJkQ29udGFpbmVyKHBsYXllcil7XHJcbiAgICBjb25zdCBib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgYm9hcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYm9hcmQtY29udGFpbmVyJyk7XHJcbiAgICBjb25zdCBwbGF5ZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcclxuICAgIGlmKHBsYXllci5pc0FJKSBwbGF5ZXJOYW1lLnRleHRDb250ZW50ID0gYCR7cGxheWVyLm5hbWV9J3MgZmxlZXRgO1xyXG4gICAgZWxzZSBwbGF5ZXJOYW1lLnRleHRDb250ZW50ID0gYFlvdXIgRmxlZXRgO1xyXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkcmF3Qm9hcmQocGxheWVyKTtcclxuICAgIGJvYXJkQ29udGFpbmVyLmFwcGVuZChwbGF5ZXJOYW1lLCBwbGF5ZXJCb2FyZCk7XHJcbiAgICByZXR1cm4gYm9hcmRDb250YWluZXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdCb2FyZChwbGF5ZXIpe1xyXG4gICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGJvYXJkLmNsYXNzTGlzdC5hZGQoJ2JvYXJkJyk7XHJcbiAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IDEwIDsgcm93Kyspe1xyXG4gICAgICAgIGZvcihsZXQgY29sID0gMCA7IGNvbCA8IDEwIDsgY29sKyspe1xyXG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xyXG4gICAgICAgICAgICBjZWxsLmRhdGFzZXQucGxheWVyID0gcGxheWVyID8gcGxheWVyLm51bWJlciA6IDA7XHJcbiAgICAgICAgICAgIGNlbGwuZGF0YXNldC5yb3cgPSByb3c7XHJcbiAgICAgICAgICAgIGNlbGwuZGF0YXNldC5jb2wgPSBjb2w7XHJcbiAgICAgICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgICAgICBpZihwbGF5ZXIgJiYgcGxheWVyLmlzQUkpIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5Gb3JBdHRhY2ssIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYm9hcmQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlQm9hcmQocGxheWVyLGJvYXJkKXtcclxuICAgIGZvcihsZXQgcm93ID0gMCA7IHJvdyA8IDEwIDsgcm93Kyspe1xyXG4gICAgICAgIGZvcihsZXQgY29sID0gMCA7IGNvbCA8IDEwIDsgY29sKyspe1xyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBwbGF5ZXIuZ2FtZWJvYXJkLmJvYXJkW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXJvdz0nJHtyb3d9J11bZGF0YS1jb2w9JyR7Y29sfSddYCk7XHJcbiAgICAgICAgICAgIGlmKHNxdWFyZSAhPT0gbnVsbCAmJiB0eXBlb2Ygc3F1YXJlID09PSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwtc2hpcCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnY2VsbC1zaGlwJyk7XHJcbiAgICAgICAgfSAgIFxyXG4gICAgfVxyXG59XHJcblxyXG4vLyB1cG9uIGNsaWNraW5nIGEgY2VsbCAsIGF0dGFjayB0aGUgcmVsZXZhbnQgc3F1YXJlICwgaWYgYWxsb3dlZCBcclxuLy8gcGFzcyB0aGUgaW5mb3JtYXRpb24gZnJvbSB0aGUgYXR0YWNrIHRvIHRoZSBzdHlsZSBhdHRhY2tlZCBjZWxsIGZ1bmN0aW9uICBcclxuXHJcbmZ1bmN0aW9uIGxpc3RlbkZvckF0dGFjayhldmVudCl7XHJcbiAgICBjb25zdCBjZWxsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgY29uc3QgZGVmZW5kaW5nUGxheWVyTnVtYmVyID1jZWxsLmRhdGFzZXQucGxheWVyO1xyXG4gICAgY29uc3QgYXR0YWNraW5nUGxheWVyTnVtYmVyID0gZGVmZW5kaW5nUGxheWVyTnVtYmVyID09PSAnMSc/ICcyJzogJzEnO1xyXG4gICAgY29uc3QgYXR0YWNraW5nUGxheWVyID0gZ2FtZVtgcGxheWVyJHthdHRhY2tpbmdQbGF5ZXJOdW1iZXJ9YF07XHJcbiAgICBjb25zdCBkZWZlbmRpbmdQbGF5ZXIgPSBnYW1lW2BwbGF5ZXIke2RlZmVuZGluZ1BsYXllck51bWJlcn1gXTtcclxuICAgIGlmKGdhbWUuY3VycmVudFBsYXllciAhPT0gYXR0YWNraW5nUGxheWVyKSByZXR1cm47XHJcbiAgICBjb25zdCByb3cgPSBjZWxsLmRhdGFzZXQucm93O1xyXG4gICAgY29uc3QgY29sID0gY2VsbC5kYXRhc2V0LmNvbDtcclxuICAgIGNvbnN0IFtyZXN1bHQsIGxvY2F0aW9uICwgc2hpcF0gPSBhdHRhY2tpbmdQbGF5ZXIuYXR0YWNrKGRlZmVuZGluZ1BsYXllciwgcm93LCBjb2wpO1xyXG4gICAgc3R5bGVBdHRhY2tlZENlbGwoY2VsbCwgZGVmZW5kaW5nUGxheWVyTnVtYmVyLCByZXN1bHQgLCBzaGlwKTtcclxuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snICwgbGlzdGVuRm9yQXR0YWNrLCBmYWxzZSk7XHJcbiAgICBuZXh0VHVybigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxsQUlBdHRhY2soQUkpe1xyXG5pZihBSSAhPT0gZ2FtZS5jdXJyZW50UGxheWVyKXJldHVybiA7XHJcbmNvbnN0IGRlZmVuZGluZ1BsYXllck51bWJlciA9IGdhbWUuZGVmZW5kaW5nUGxheWVyPT09IGdhbWUucGxheWVyMSA/JzEnOicyJztcclxuY29uc3QgW3Jlc3VsdCAsIGxvY2F0aW9uICwgc2hpcF09IEFJLmF0dGFjayhnYW1lLmRlZmVuZGluZ1BsYXllcik7XHJcbmNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1wbGF5ZXI9JyR7ZGVmZW5kaW5nUGxheWVyTnVtYmVyfSddW2RhdGEtcm93PScke2xvY2F0aW9uWzBdfSddW2RhdGEtY29sPScke2xvY2F0aW9uWzFdfSddYClcclxuc3R5bGVBdHRhY2tlZENlbGwoY2VsbCwgZGVmZW5kaW5nUGxheWVyTnVtYmVyLCByZXN1bHQsIHNoaXApO1xyXG5uZXh0VHVybigpO1xyXG59XHJcblxyXG4vL1N0eWxlIGF0dGFja2VkIGNlbGwgYmFzZWQgb24gaWYgaXQgd2FzIGhpdCBvciBtaXNzIFxyXG4vL0lmIHRoZSBzaGlwIGlzIHN1bmsgLCBzdHlsZSBlYWNoIG9mIHRoZSBzaGlwIGNlbGxzIHdpdGggdGhlIC5jZWxsLXN1bmsgY2xhc3NcclxuZnVuY3Rpb24gc3R5bGVBdHRhY2tlZENlbGwoY2VsbCwgZGVmZW5kaW5nUGxheWVyTnVtYmVyLCByZXN1bHQgLCBzaGlwKSB7XHJcbiAgICBpZihyZXN1bHQgPT09ICdoaXQnKXtcclxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwtaGl0Jyk7XHJcbiAgICAgICAgaWYoc2hpcC5pc1N1bmsoKSl7XHJcbiAgICAgICAgICAgIHNoaXAuc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtcGxheWVyPScke2RlZmVuZGluZ1BsYXllck51bWJlcn0nXVtkYXRhLXJvdz0nJHtzcXVhcmVbMF19J11bZGF0YS1jb2w9JyR7c3F1YXJlWzFdfSddYClcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbC1zdW5rJylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihyZXN1bHQ9PT0nbWlzcycpIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbC1taXNzJyk7XHJcbn1cclxuXHJcbi8vIEhhbmRsZSBuZXh0IHR1cm4gXHJcbmZ1bmN0aW9uIG5leHRUdXJuKCkge1xyXG4gICAgY29uc3Qgd2lubmVyID0gZ2FtZS5jaGVja0dhbWVPdmVyKCk7XHJcbiAgICBpZih3aW5uZXIpe1xyXG4gICAgICAgIHJldHVybiBlbmRHYW1lKHdpbm5lcik7XHJcbiAgICB9XHJcbiAgICBnYW1lLnN3aXRjaFR1cm4oKTtcclxuICAgIGlmKGdhbWUuY3VycmVudFBsYXllci5pc0FJKXtcclxuICAgICAgICBjYWxsQUlBdHRhY2soZ2FtZS5jdXJyZW50UGxheWVyKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZW5kR2FtZSh3aW5uZXIpe1xyXG4gICAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbCcpO1xyXG4gICAgY2VsbHMuZm9yRWFjaChjZWxsID0+IGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5Gb3JBdHRhY2ssIGZhbHNlKSk7XHJcbiAgICBnYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGRyYXdWaWN0b3J5Q29udGFpbmVyKHdpbm5lcikpO1xyXG59XHJcblxyXG4vL2RyYXcgYSBwb3B1cCB3aW5kb3cgd2l0aCB0aGUgd2lubmVycyBuYW1lXHJcblxyXG5mdW5jdGlvbiBkcmF3VmljdG9yeUNvbnRhaW5lcih3aW5uZXIpe1xyXG4gICAgY29uc3QgbG9zZXIgPSBnYW1lLmNoZWNrR2FtZU92ZXIgKCkgPT09IGdhbWUucGxheWVyMSA/IGdhbWUucGxheWVyMiA6IGdhbWUucGxheWVyMTtcclxuICAgIGNvbnN0IHZpY3RvcnlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZpY3RvcnlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgndmljdG9yeS1jb250YWluZXInKTtcclxuICAgIGNvbnN0IHZpY3RvcnlUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XHJcbiAgICBjb25zdCB3aW5uZXJUZXh0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICBjb25zdCBsb3NlclRleHQgPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIGlmKHdpbm5lci5pc0FJKXtcclxuICAgICAgICB2aWN0b3J5VGl0bGUuY2xhc3NMaXN0LmFkZCgndmljdG9yeS1kZWZlYXQnKTtcclxuICAgICAgICB2aWN0b3J5VGl0bGUudGV4dENvbnRlbnQgPSAnRGVmZWF0ZWQnO1xyXG4gICAgICAgIHdpbm5lclRleHQudGV4dENvbnRlbnQgPSBgJHt3aW5uZXIubmFtZX0gaGFzIGNsYWltZWQgdmljdG9yeWA7XHJcbiAgICAgICAgbG9zZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdXIgRmxlZXQgSXMgU3Vua2A7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZpY3RvcnlUaXRsZS5jbGFzc0xpc3QuYWRkKCd2aWN0b3J5LXZpY3RvcnknKTtcclxuICAgICAgICB2aWN0b3J5VGl0bGUudGV4dENvbnRlbnQgPSBcIllvdSBXb25cIjtcclxuICAgICAgICB3aW5uZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdSBIYXZlIENsYWltZWQgVmljdG9yeWA7XHJcbiAgICAgICAgbG9zZXJUZXh0LnRleHRDb250ZW50ID0gYCR7bG9zZXIubmFtZX0ncyBmbGVldCBzdW5rYDtcclxuICAgIH1cclxuICAgIHZpY3RvcnlDb250YWluZXIuYXBwZW5kKHZpY3RvcnlUaXRsZSwgd2lubmVyVGV4dCwgbG9zZXJUZXh0KTtcclxuICAgIHJldHVybiB2aWN0b3J5Q29udGFpbmVyO1xyXG59XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZUZvb3RlcigpIHtcclxuICAgIGNvbnN0IGZvb3RlckJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpO1xyXG4gICAgY29uc3QgYXV0aG9yTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIGF1dGhvck5hbWUuY2xhc3NMaXN0LmFkZCgnZm9vdGVyLWF1dGhvcicpO1xyXG4gICAgYXV0aG9yTmFtZS50ZXh0Q29udGVudCA9ICdTYWNoaW4gS3VtYXIgU2luZ2gnO1xyXG4gICAgY29uc3QgZm9vdGVyTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGZvb3RlckxpbmsuaWQ9J2Zvb3Rlci1saW5rJztcclxuICAgIGZvb3Rlckxpbmsuc2V0QXR0cmlidXRlKCdocmVmJyxcImh0dHBzOi8vZ2l0aHViLmNvbS9qZXQtYmxhY2stbmluamEvQmF0dGxlLXNoaXAvdHJlZS9tYWluXCIpO1xyXG4gICAgY29uc3QgZ2l0aHViTG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgIGdpdGh1YkxvZ28uY2xhc3NMaXN0LmFkZChcImZhLWJyYW5kc1wiLFwiZmEtZ2l0aHViXCIsXCJmYS14bFwiLFwiZm9vdGVyLWxvZ29cIik7XHJcbiAgICBmb290ZXJMaW5rLmFwcGVuZENoaWxkKGdpdGh1YkxvZ28pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFRoZW1lKCl7XHJcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRGFya1RoZW1lKCl7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCc6cm9vdCcpLmNsYXNzTGlzdC50b2dnbGUoJ2RhcmsnKTtcclxuICAgIGRhcmtNb2RlQnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJmYS1tb29uXCIpO1xyXG4gICAgZGFya01vZGVCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImZhLXN1blwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVEYXJrU3RvcmFnZSgpIHtcclxuICAgICAgICBpZihnZXRUaGVtZSgpID09PSAnZGFyaycpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsJ2xpZ2h0Jyk7XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywnZGFyaycpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrRGFya01vZGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgd2luZG93Lm1hdGNoTWVkaWEgJiYgXHJcbiAgICAgICAgd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzXHJcbiAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBkYXJrTW9kZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgIGRhcmtNb2RlQnV0dG9uLmlkID0gJ2Zvb3Rlci1kYXJrLW1vZGUnO1xyXG4gICAgZGFya01vZGVCdXR0b24uY2xhc3NMaXN0LmFkZChcImZhLXNvbGlkXCIsXCJmYS1tb29uXCIsXCJmYS14bFwiKTtcclxuICAgIGRhcmtNb2RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdG9nZ2xlRGFya1RoZW1lKCk7XHJcbiAgICAgICAgdG9nZ2xlRGFya1N0b3JhZ2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmKGdldFRoZW1lKCkgPT09ICdkYXJrJyB8fCAoIWdldFRoZW1lKCkgJiYgY2hlY2tEYXJrTW9kZSgpKSkge1xyXG4gICAgICAgIHRvZ2dsZURhcmtUaGVtZSgpO1xyXG4gICAgfVxyXG4gICAgZm9vdGVyQm94LmFwcGVuZENoaWxkKGF1dGhvck5hbWUpO1xyXG4gICAgZm9vdGVyQm94LmFwcGVuZENoaWxkKGZvb3RlckxpbmspO1xyXG4gICAgZm9vdGVyQm94LmFwcGVuZENoaWxkKGRhcmtNb2RlQnV0dG9uKTtcclxuICAgIHJldHVybiBmb290ZXJCb3g7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZvb3RlciA7IiwiZnVuY3Rpb24gY3JlYXRlSGVhZGVyKCl7XHJcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoZWFkZXInKTtcclxuICAgIGhlYWRlci5pZCA9ICdoZWFkZXInO1xyXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xyXG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSAnQmF0dGxlc2hpcHMnO1xyXG4gICAgY29uc3QgbmV3R2FtZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgbmV3R2FtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCduZXctZ2FtZS1idXR0b24nKTtcclxuICAgIG5ld0dhbWVCdXR0b24udGV4dENvbnRlbnQgPSAnTmV3IEdhbWUnO1xyXG4gICAgaGVhZGVyLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuICAgIGhlYWRlci5hcHBlbmRDaGlsZChuZXdHYW1lQnV0dG9uKTtcclxuICAgIHJldHVybiBoZWFkZXI7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlSGVhZGVyOyIsImltcG9ydCBzaGlwVHlwZXMgZnJvbSAnLi4vc2hpcFR5cGVzJ1xyXG5sZXQgcGxheWVyIDtcclxubGV0IGJvYXJkO1xyXG5cclxuLy9hbiBvYmplY3QgdG8gaG9sZCB0aGUgZGF0YSBmb3IgdGhlIGRyYWcgbWV0aG9kIHRvIHVzZVxyXG5jb25zdCBkcmFnRGF0YSA9IHtcclxuICAgIHNoaXBPYmplY3QgOiBudWxsLFxyXG4gICAgc2hpcEVsZW1lbnQgOiBudWxsLFxyXG4gICAgb2Zmc2V0WCA6IG51bGwsXHJcbiAgICBvZmZzZXRZIDogbnVsbCxcclxuICAgIHJvd0RpZmYgOiBudWxsLFxyXG4gICAgY29sRGlmZiA6IG51bGwsIFxyXG4gICAgc2hpcEhvbWVDb250YWluZXIgOiBudWxsLFxyXG4gICAgcHJldkNvbnRhaW5lciA6IG51bGwsXHJcbiAgICBwcmV2Q2VsbCA6IG51bGwsXHJcbiAgICBjdXJyZW50Q2VsbCA6IG51bGxcclxufVxyXG5cclxuXHJcbi8vZHJhdyB0aGUgYm9hcmRcclxuZnVuY3Rpb24gZHJhd1NldHVwQm9hcmQoc2V0dXBQbGF5ZXIgLCBzZXR1cEJvYXJkKSB7XHJcbiAgICBwbGF5ZXIgPSBzZXR1cFBsYXllcjtcclxuICAgIGJvYXJkID0gc2V0dXBCb2FyZDtcclxuICAgIGNvbnN0IHNldHVwQ2VsbHMgPSBib2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbCcpO1xyXG4gICAgc2V0dXBDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xyXG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBkcmFnT3Zlcik7XHJcbiAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBkcmFnRW50ZXIpO1xyXG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZHJhZ0xlYXZlKTtcclxuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBkcm9wKTtcclxuICAgIH0pXHJcbiAgICByZXR1cm4gc2V0dXBCb2FyZDtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ1N0YXJ0KGV2ZW50KSB7XHJcbiAgICBpZihldmVudC50eXBlID09PSAndG91Y2hzdGFydCcpIHtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudCA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRyYWdEYXRhLnNoaXBFbGVtZW50KVxyXG4gICAgICAgIGRyYWdEYXRhLnNoaXBIb21lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuaWR9LWhvbWVgKTtcclxuICAgICAgICBkcmFnRGF0YS5wcmV2Q29udGFpbmVyID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHJhZ0RhdGEuc2hpcEVsZW1lbnQgPSBldmVudC50YXJnZXQgO1xyXG4gICAgICAgIGRyYWdEYXRhLnNoaXBIb21lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZXZlbnQudGFyZ2V0LmlkfS1ob21lYCk7XHJcbiAgICAgICAgZHJhZ0RhdGEucHJldkNvbnRhaW5lciA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxEaWZmKGV2ZW50KTtcclxuICAgIGlmKGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50ID09PSAndmVydGljYWwnKSBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwVmVydGljYWwnKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwLWhpZGUnKTtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLWRyb3BwZWQnKTtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLXZlcnRpY2FsJyk7XHJcbiAgICAgICAgZHJhZ0RhdGEuc2hpcEhvbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZHJhZ0RhdGEuc2hpcEVsZW1lbnQpO1xyXG5cclxuICAgIH0sMCk7XHJcbiAgICBpZihkcmFnRGF0YS5wcmV2Q29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKXtcclxuICAgICAgICBjb25zdCBjZWxsID0gZHJhZ0RhdGEucHJldkNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCByb3cgPSBwYXJzZUludChjZWxsLmRhdGFzZXQucm93KTtcclxuICAgICAgICBjb25zdCBjb2wgPSBwYXJzZUludChjZWxsLmRhdGFzZXQuY29sKTtcclxuICAgICAgICBwbGF5ZXIuZ2FtZWJvYXJkLnJlbW92ZVNoaXAoW3Jvdyxjb2xdKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ0VuZChldmVudCl7XHJcbiAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLWhpZGUnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ0VudGVyKGV2ZW50KSB7XHJcbiAgICBkcmFnTGVhdmUoZXZlbnQpO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHR5cGUgPSBkcmFnRGF0YS5zaGlwRWxlbWVudC5pZDtcclxuICAgIGxldCByb3c7XHJcbiAgICBsZXQgY29sO1xyXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gJ3RvdWNobW92ZScpe1xyXG4gICAgcm93ID0gcGFyc2VJbnQodG91Y2hDZWxsLmRhdGFzZXQucm93KSAtIHBhcnNlSW50KGRyYWdEYXRhLnJvd0RpZmYpO1xyXG4gICAgY29sID0gcGFyc2VJbnQodG91Y2hDZWxsLmRhdGFzZXQuY29sKSAtIHBhcnNlSW50KGRyYWdEYXRhLmNvbERpZmYpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByb3cgPSBwYXJzZUludChldmVudC50YXJnZXQuZGF0YXNldC5yb3cpIC0gcGFyc2VJbnQoZHJhZ0RhdGEucm93RGlmZik7XHJcbiAgICAgICAgY29sID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmRhdGFzZXQuY29sKSAtIHBhcnNlSW50KGRyYWdEYXRhLmNvbERpZmYpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNoaXBTcXVhcmVzID0gcGxheWVyLmdhbWVib2FyZC5jaGVja1BsYWNlbWVudChzaGlwVHlwZXNbdHlwZV0ubGVuZ3RoICwgW3JvdywgY29sXSwgIGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50KTtcclxuICAgIHNoaXBTcXVhcmVzLnNxdWFyZXMgPSBzaGlwU3F1YXJlcy5zcXVhcmVzLmZpbHRlcihzcXVhcmUgPT4ge1xyXG4gICAgICAgIHJldHVybiBwbGF5ZXIuZ2FtZWJvYXJkLmNoZWNrU3F1YXJlKHNxdWFyZVswXSxzcXVhcmVbMV0pICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9KVxyXG5cclxuICAgIHNoaXBTcXVhcmVzLnNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1yb3c9JyR7c3F1YXJlWzBdfSddW2RhdGEtY29sPScke3NxdWFyZVsxXX0nXWApO1xyXG4gICAgICAgIGNvbnN0IGNlbGxPdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY2VsbE92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnY2VsbCcsJ2NlbGwtZHJhZy1vdmVyJyk7XHJcbiAgICAgICAgY2VsbC5hcHBlbmRDaGlsZChjZWxsT3ZlcmxheSk7XHJcbiAgICAgICAgaWYoc2hpcFNxdWFyZXMuaXNWYWxpZCkgY2VsbE92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnY2VsbC1kcmFnLXZhbGlkJyk7XHJcbiAgICAgICAgZWxzZSBjZWxsT3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdjZWxsLWRyYWctaW52YWxpZCcpO1xyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ092ZXIoZXZlbnQpe1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ0xlYXZlKGV2ZW50KXtcclxuICAgIGNvbnN0IGxlZnRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsLWRyYWctb3ZlcicpO1xyXG4gICAgbGVmdENlbGxzLmZvckVhY2goY2VsbD0+IHtcclxuICAgICAgICBjZWxsLnJlbW92ZSgpO1xyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZHJvcChldmVudCwgdG91Y2hDZWxsKXtcclxuICAgIGRyYWdMZWF2ZShldmVudCk7XHJcbiAgICBsZXQgcm93O1xyXG4gICAgbGV0IGNvbDtcclxuICAgIGNvbnN0IHR5cGUgPSBkcmFnRGF0YS5zaGlwRWxlbWVudC5pZDtcclxuICAgIGlmKGV2ZW50LnR5cGUgPT09ICd0b3VjaGVuZCcpe1xyXG4gICAgICAgIHJvdyA9IHBhcnNlSW50KHRvdWNoQ2VsbC5kYXRhc2V0LnJvdykgLSBwYXJzZUludChkcmFnRGF0YS5yb3dEaWZmKTtcclxuICAgICAgICBjb2wgPSBwYXJzZUludCh0b3VjaENlbGwuZGF0YXNldC5jb2wpIC0gcGFyc2VJbnQoZHJhZ0RhdGEuY29sRGlmZik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvdyA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5kYXRhc2V0LnJvdykgLSBwYXJzZUludChkcmFnRGF0YS5yb3dEaWZmKTtcclxuICAgICAgICBjb2wgPSBwYXJzZUludChldmVudC50YXJnZXQuZGF0YXNldC5jb2wpIC0gcGFyc2VJbnQoZHJhZ0RhdGEuY29sRGlmZik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2hpcFNxdWFyZXMgPSBwbGF5ZXIuZ2FtZWJvYXJkLmNoZWNrUGxhY2VtZW50KHNoaXBUeXBlc1t0eXBlXS5sZW5ndGgsIFtyb3csIGNvbF0sIGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50KVxyXG4gICAgaWYgKHNoaXBTcXVhcmVzLmlzVmFsaWQpIHtcclxuICAgICAgICBjb25zdCBvcmlnaW5DZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihgW2RhdGEtcm93PScke3Jvd30nXVtkYXRhLWNvbD0nJHtjb2x9J11gKTtcclxuICAgICAgICBvcmlnaW5DZWxsLmFwcGVuZENoaWxkKGRyYWdEYXRhLnNoaXBFbGVtZW50KTtcclxuICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwLWRyb3BwZWQnKTtcclxuICAgICAgICBkcmFnRGF0YS5wcmV2Q29udGFpbmVyID0gb3JpZ2luQ2VsbDtcclxuICAgICAgICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChkcmFnRGF0YS5zaGlwRWxlbWVudC5pZCwgW3JvdywgY29sXSwgZHJhZ0RhdGEuc2hpcEVsZW1lbnQuZGF0YXNldC5hbGlnbm1lbnQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoZHJhZ0RhdGEucHJldkNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSkge1xyXG4gICAgICAgICAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwLWRyb3BwZWQnKTtcclxuICAgICAgICAgICAgY29uc3QgcHJldlJvdyA9IGRyYWdEYXRhLnByZXZDb250YWluZXIuZGF0YXNldC5yb3c7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZDb2wgPSBkcmFnRGF0YS5wcmV2Q29udGFpbmVyLmRhdGFzZXQuY29sO1xyXG4gICAgICAgICAgICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChkcmFnRGF0YS5zaGlwRWxlbWVudC5pZCwgW3ByZXZSb3csIHByZXZDb2xdLCBkcmFnRGF0YS5zaGlwRWxlbWVudC5kYXRhc2V0LmFsaWdubWVudClcclxuICAgICAgICB9XHJcbiAgICAgICAgZHJhZ0RhdGEucHJldmlvdXNDb250YWluZXIuYXBwZW5kQ2hpbGQoZHJhZ0RhdGEuc2hpcEVsZW1lbnQpXHJcbiAgICB9XHJcbiAgICBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLWhpZGUnKTtcclxuICAgIGlmIChkcmFnRGF0YS5zaGlwRWxlbWVudC5kYXRhc2V0LmFsaWdubWVudCA9PT0gJ3ZlcnRpY2FsJykgZHJhZ0RhdGEuc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcC12ZXJ0aWNhbCcpO1xyXG4gICAgZWxzZSBkcmFnRGF0YS5zaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLXZlcnRpY2FsJyk7XHJcbn1cclxuXHJcblxyXG4vL2RyYXcgc2V0dXAgc2hpcHNcclxuZnVuY3Rpb24gZHJhd1NldHVwU2hpcHMoKSB7XHJcbiAgICBjb25zdCBzZXR1cFNoaXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHNldHVwU2hpcENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwcy1jb250YWluZXInKTtcclxuICAgIGNvbnN0IHNldHVwU2hpcEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgc2V0dXBTaGlwSGVhZGVyLmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXBzLWhlYWRlcicpO1xyXG4gICAgY29uc3Qgc2V0dXBTaGlwVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xyXG4gICAgc2V0dXBTaGlwVGl0bGUudGV4dENvbnRlbnQ9J1BsYWNlIFlvdXIgU2hpcHMnO1xyXG4gICAgY29uc3Qgc2V0dXBTaGlwSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIHNldHVwU2hpcEluZm8udGV4dENvbnRlbnQgPSAnRHJhZyBhbmQgZHJvcCBzaGlwcyBvbnRvIHRoZSBib2FyZC4gRG91YmxlIENsaWNrIGFmdGVyIHBsYWNpbmcgU2hpcCB0byByb3RhdGUnO1xyXG4gICAgY29uc3Qgc2V0dXBTaGlwT3B0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgc2V0dXBTaGlwT3B0aW9ucy5jbGFzc0xpc3QuYWRkKCdzZXR1cC1zaGlwcy1vcHRpb25zJyk7XHJcbiAgICBjb25zdCBzdGFydEdhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIHN0YXJ0R2FtZS5jbGFzc0xpc3QuYWRkKCdzdGFydC1nYW1lLWJ1dHRvbicpO1xyXG4gICAgc3RhcnRHYW1lLnRleHRDb250ZW50ID0gJ1N0YXJ0IEdhbWUnO1xyXG4gICAgY29uc3QgcmFuZG9tU2hpcHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIHJhbmRvbVNoaXBzLmNsYXNzTGlzdC5hZGQoJ3NldHVwLWJ1dHRvbi1yYW5kb20nKVxyXG4gICAgcmFuZG9tU2hpcHMudGV4dENvbnRlbnQgPSAnUmFuZG9taXplIFNoaXBzJztcclxuICAgIHJhbmRvbVNoaXBzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxyYW5kb21pemVGbGVldCk7XHJcbiAgICBzZXR1cFNoaXBPcHRpb25zLmFwcGVuZChzdGFydEdhbWUscmFuZG9tU2hpcHMpO1xyXG4gICAgY29uc3Qgc2hpcExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGZvciAobGV0IHNoaXAgaW4gc2hpcFR5cGVzKSB7XHJcbiAgICAgICAgc2hpcExpc3QuYXBwZW5kQ2hpbGQoZHJhd1NoaXAoc2hpcFR5cGVzW3NoaXBdKSk7XHJcbiAgICB9XHJcbiAgICBzZXR1cFNoaXBIZWFkZXIuYXBwZW5kKHNldHVwU2hpcFRpdGxlLHNldHVwU2hpcEluZm8pO1xyXG4gICAgc2V0dXBTaGlwQ29udGFpbmVyLmFwcGVuZChzZXR1cFNoaXBIZWFkZXIsIHNoaXBMaXN0LCBzZXR1cFNoaXBPcHRpb25zKTtcclxuICAgIHJldHVybiBzZXR1cFNoaXBDb250YWluZXI7XHJcbn1cclxuXHJcbi8vRHJhdyBhIHNoaXAgdG8gYmUgZGlzcGxheWVkIGJhc2VkIG9uIFRoZSBwcm92aWRlZCBJRCBvZiB0aGUgc2hpcCB0eXBlIFxyXG5mdW5jdGlvbiBkcmF3U2hpcChzaGlwKSB7XHJcbiAgICBjb25zdCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBzaGlwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXAnKTtcclxuICAgIHNoaXBDb250YWluZXIuaWQgPSBgJHtzaGlwLm5hbWV9LWhvbWVgO1xyXG4gICAgY29uc3Qgc2hpcEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgc2hpcEJveC5pZCA9IHNoaXAubmFtZTtcclxuICAgIHNoaXBCb3guZGF0YXNldC5sZW5ndGggPSBzaGlwLmxlbmd0aDtcclxuICAgIHNoaXBCb3guY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcC1ib3gnKTtcclxuICAgIGZvcihsZXQgaSA9IDAgOyBpIDwgc2hpcC5sZW5ndGggOyBpKyspe1xyXG4gICAgICAgIGNvbnN0IHNoaXBDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgc2hpcENlbGwuY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcC1jZWxsJyk7XHJcbiAgICAgICAgc2hpcEJveC5hcHBlbmRDaGlsZChzaGlwQ2VsbCk7XHJcbiAgICB9XHJcbiAgICBzaGlwQm94LmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICBzaGlwQm94LmRhdGFzZXQuYWxpZ25tZW50ID0gJ2hvcml6b250YWwnO1xyXG4gICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBkcmFnU3RhcnQpO1xyXG4gICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgZHJhZ0VuZCk7XHJcbiAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgcm90YXRlU2hpcCk7XHJcblxyXG4gICAgc2hpcEJveC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGNvbnN0IHggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgICAgY29uc3QgeSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KHgsIHkpO1xyXG4gICAgICAgIGNvbnN0IHRvdWNoQ2VsbCA9IGVsZW1lbnRzLmZpbHRlciggZWxlbWVudCA9PiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKTtcclxuICAgICAgICBpZih0b3VjaENlbGwgLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBkcmFnRW50ZXIoZXZlbnQsIHRvdWNoQ2VsbFswXSk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBkcmFnTGVhdmUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBhcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyk7XHJcbiAgICAgICAgY29uc3QgcHJldkJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2dob3N0LXNoaXAnKTtcclxuICAgICAgICBpZihwcmV2Qm94KSBwcmV2Qm94LnJlbW92ZSgpO1xyXG4gICAgICAgIGNvbnN0IG5ld0JveCA9IHNoaXBCb3guY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgIGNvbnN0IHRvdWNoTG9jYXRpb24gPSBldmVudC50YXJnZXRUb3VjaGVzWzBdO1xyXG4gICAgICAgIGlmKGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50ID09PSAndmVydGljYWwnKTtcclxuICAgICAgICAgICAgbmV3Qm94LmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXAtdmVydGljYWwnKTtcclxuICAgICAgICBuZXdCb3guY2xhc3NMaXN0LmFkZCgnZ2hvc3Qtc2hpcCcpO1xyXG4gICAgICAgIG5ld0JveC5zdHlsZS5sZWZ0ID0gYCR7dG91Y2hMb2NhdGlvbi5wYWdlWCAtIGRyYWdEYXRhLm9mZnNldFh9cHhgO1xyXG4gICAgICAgIG5ld0JveC5zdHlsZS50b3AgPSBgJHt0b3VjaExvY2F0aW9uLnBhZ2VZIC0gZHJhZ0RhdGEub2Zmc2V0WX1weGA7XHJcbiAgICAgICAgYXBwLmFwcGVuZENoaWxkKG5ld0JveCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24gKGV2ZW50KXtcclxuICAgICAgICBjb25zdCBwcmV2Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdob3N0LXNoaXAnKTtcclxuICAgICAgICBpZihwcmV2Qm94KSBwcmV2Qm94LnJlbW92ZSgpO1xyXG4gICAgICAgIGRyYWdFbmQoZXZlbnQpO1xyXG4gICAgICAgIGNvbnN0IHggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICAgIGNvbnN0IHkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoeCwgeSk7XHJcbiAgICAgICAgY29uc3QgdG91Y2hDZWxsID0gZWxlbWVudHMuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSk7XHJcbiAgICAgICAgaWYodG91Y2hDZWxsLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBkcm9wKGV2ZW50LiB0b3VjaENlbGxbMF0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vYWQgbW9iaWxlIHVzZXJzIGNhbnQgZG91YmxlIHRhcCAsIHdlIGFkZCB0aW1lciBpbnRvIHRoZSB0b3VjaHN0YXJ0IGV2ZW50IGxpc3RlbmVyXHJcbiAgICBzaGlwQm94LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBsZXQgdGltZSA9IGRhdGUuZ2V0VGltZSgpO1xyXG4gICAgICAgIGNvbnN0IHRhcEludGVydmFsID0gMjAwO1xyXG4gICAgICAgIGlmKCh0aW1lICAtIHNoaXBCb3gubGFzdENoaWxkKSA8IHRhcEludGVydmFsKSB7XHJcbiAgICAgICAgICAgIHJvdGF0ZVNoaXAoZXZlbnQpO1xyXG4gICAgICAgICAgICBkcmFnU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgIH0gZWxzZSAge1xyXG4gICAgICAgICAgICBkcmFnU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaGlwQm94Lmxhc3RDbGljayA9IHRpbWU7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHNoaXBOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgaWYoc2hpcC5uYW1lID09PSAncGF0cm9sJykgXHJcbiAgICAgICAgc2hpcE5hbWUudGV4dENvbnRlbnQgPSAnUGF0cm9sIEJvYXQnO1xyXG4gICAgZWxzZSBcclxuICAgICAgICBzaGlwTmFtZS50ZXh0Q29udGVudCA9c2hpcC5uYW1lO1xyXG4gICAgc2hpcENvbnRhaW5lci5hcHBlbmQoc2hpcE5hbWUsIHNoaXBCb3gpO1xyXG4gICAgcmV0dXJuIHNoaXBDb250YWluZXI7XHJcbn1cclxuXHJcbi8vIFBsYWNlIHNoaXBzIHJhbmRvbWx5IG9uIHRoZSBwbGF5ZXJzIGJvYXJkXHJcbmZ1bmN0aW9uIHJhbmRvbWl6ZUZsZWV0KCl7XHJcbiAgICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcHNSYW5kb21seSgpO1xyXG4gICAgcGxheWVyLmdhbWVib2FyZC5wbGFjZWRTaGlwcy5mb3JFYWNoKCBzaGlwID0+IHtcclxuICAgICAgICBjb25zdCB0eXBlID0gc2hpcC50eXBlOyBcclxuICAgICAgICBjb25zdCBvcmlnaW4gPSBzaGlwLnNxdWFyZXNbMF07XHJcbiAgICAgICAgY29uc3QgYWxpZ25tZW50ID0gc2hpcC5hbGlnbm1lbnQ7XHJcbiAgICAgICAgY29uc3Qgc2hpcEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0eXBlfWApO1xyXG4gICAgICAgIHNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50ID0gYWxpZ25tZW50O1xyXG4gICAgICAgIHNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXAtZHJvcHBlZCcpO1xyXG4gICAgICAgIGlmKGFsaWdubWVudCA9PT0gJ3ZlcnRpY2FsJykgXHJcbiAgICAgICAgICAgIHNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NldHVwLXNoaXAtdmVydGljYWwnKTtcclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICBzaGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZXR1cC1zaGlwLXZlcnRpY2FsJyk7XHJcbiAgICAgICAgY29uc3QgW3JvdywgY29sXSA9IG9yaWdpbiA7IFxyXG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1yb3c9XCIke3Jvd31cIl1bZGF0YS1jb2w9XCIke2NvbH1cIl1gKTtcclxuICAgICAgICBjZWxsLmFwcGVuZENoaWxkKHNoaXBFbGVtZW50KTtcclxuICAgIH0pO1xyXG59XHJcbi8vIFdoZW4gYSB1c2VyIGdyYWJzIGEgc2hpcCBlbGVtZW50LCB3ZSB0cmFjayB0aGUgdXNlcidzIGN1cnNvciBsb2NhdGlvbiBmb3IgdGhlIGRyYWdFbnRlciBhbmQgZHJvcCBldmVudHNcclxuLy8gV2hlbiB0aGUgc2hpcCBpcyBncmFiYmVkIGZyb20gdGhlIGNlbnRlciwgdGhlIGN1cnNvciBkb2VzIG5vdCBtYXRjaCB1cCB3aXRoIHRoZSBzaGlwJ3Mgb3JpZ2luIGNlbGxcclxuLy8gVGhlIGNlbGxEaWYgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBvcmlnaW4gY2VsbCB0byB0aGUgY2VsbCB3aGVyZSB0aGUgdXNlciBoYXMgZ3JhYmJlZCB0aGUgc2hpcCBlbGVtZW50XHJcbmZ1bmN0aW9uIHVwZGF0ZUNlbGxEaWZmKGV2ZW50KXtcclxuICAgIGxldCB4OyBcclxuICAgIGxldCB5O1xyXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKXtcclxuICAgICAgICBsZXQgYmNyID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgeCA9IGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCAtIGJjci54O1xyXG4gICAgICAgIHkgPSBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkgLSBiY3IueTtcclxuICAgICAgICBkcmFnRGF0YS5vZmZzZXRYID0geDtcclxuICAgICAgICBkcmFnRGF0YS5vZmZzZXRZID0geTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgICB4ID0gZXZlbnQub2Zmc2V0WDtcclxuICAgICAgICB5ID0gZXZlbnQub2Zmc2V0WTtcclxuICAgIH07XHJcbiAgICBjb25zdCBjZWxsU2l6ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZXR1cC1zaGlwLWNlbGwnKS5vZmZzZXRXaWR0aDtcclxuICAgIGlmKGRyYWdEYXRhLnNoaXBFbGVtZW50LmRhdGFzZXQuYWxpZ25tZW50ID09PSdob3Jpem9udGFsJyl7XHJcbiAgICAgICAgZHJhZ0RhdGEucm93RGlmZiA9IDA7XHJcbiAgICAgICAgZHJhZ0RhdGEuY29sRGlmZiA9IE1hdGguZmxvb3IoeCAvIChjZWxsU2l6ZSArIDIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHJhZ0RhdGEucm93RGlmZiA9IE1hdGguZmxvb3IoeSAvIChjZWxsU2l6ZSArIDIpKTtcclxuICAgICAgICBkcmFnRGF0YS5jb2xEaWZmID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcm90YXRlU2hpcChldmVudCl7XHJcbiAgICBjb25zdCBzaGlwRWxlbWVudCA9IGRyYWdTdGFydC5zaGlwRWxlbWVudDtcclxuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwVHlwZXNbc2hpcEVsZW1lbnQuaWRdLmxlbmd0aDtcclxuICAgIGNvbnN0IG9yaWdpbkNlbGwgPSBzaGlwRWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgaWYoIW9yaWdpbkNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykpIHJldHVybiA7IC8vIGlmIHRoZSBzaGlwIGlzIG5vdCBwbGFjZWQgcmV0dXJuIDtcclxuXHJcbiAgICBjb25zdCBvcmlnaW5Sb3cgPSBwcmFzZUludChvcmlnaW5DZWxsLmRhdGFzZXQucm93KTtcclxuICAgIGNvbnN0IG9yaWdpbkNvbCA9IHBhcnNlSW50KG9yaWdpbkNlbGwuZGF0YXNldC5jb2wpO1xyXG4gICAgY29uc29sZS5sb2cob3JpZ2luUm93LG9yaWdpbkNvbCk7XHJcbiAgICBwbGF5ZXIuZ2FtZWJvYXJkLnJlbW92ZVNoaXAoW29yaWdpblJvdywgb3JpZ2luQ29sXSk7XHJcbiAgICBsZXQgcm93ID0gb3JpZ2luUm93O1xyXG4gICAgbGV0IGNvbCA9IG9yaWdpbkNvbDtcclxuICAgIGxldCBvcmlnaW5BbGlnbm1lbnQgPSBzaGlwRWxlbWVudC5kYXRhc2V0LmFsaWdubWVudDtcclxuICAgIGxldCBuZXdBbGlnbm1lbnQ7XHJcbiAgICBpZihvcmlnaW5BbGlnbm1lbnQgPT09ICdob3Jpem9udGFsJyl7XHJcbiAgICAgICAgbmV3QWxpZ25tZW50PSAndmVydGljYWwnO1xyXG4gICAgICAgIGlmKCgxMCAtIHJvdykgPCBzaGlwTGVuZ3RoKSByb3cgPSAxMCAtIHNoaXBMZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld0FsaWdubWVudCA9ICdob3Jpem9udGFsJztcclxuICAgICAgICBpZigoMTAgLSBjb2wpIDwgc2hpcExlbmd0aCkgY29sID0gMTAgLSBzaGlwTGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBhdHRlbXB0cyA9IDA7XHJcbiAgICBsZXQgc2hpcFNxdWFyZXMgPSBwbGF5ZXIuZ2FtZWJvYXJkLmNoZWNrUGxhY2VtZW50KHNoaXBMZW5ndGgsIFtyb3csY29sXSwgbmV3QWxpZ25tZW50KTtcclxuICAgIHdoaWxlKHNoaXBTcXVhcmVzLmlzVmFsaWQgPT09IGZhbHNlICYmIGF0dGVtcHRzIDwgMTApe1xyXG4gICAgICAgIGlmKG5ld0FsaWdubWVudCA9PT0gJ2hvcml6b250YWwnKVxyXG4gICAgICAgICAgICByb3cgPSByb3cgPCA5ID8gcm93ICsgMSA6IDA7XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgY29sID0gY29sIDwgMCA/IGNvbCArIDEgOiAwO1xyXG4gICAgICAgIHNoaXBTcXVhcmVzID0gcGxheWVyLmdhbWVib2FyZC5jaGVja1BsYWNlbWVudChzaGlwTGVuZ3RoLFtyb3csIGNvbF0sIG5ld0FsaWdubWVudCk7XHJcbiAgICAgICAgYXR0ZW1wdHMrKztcclxuICAgIH1cclxuICAgIGlmKHNoaXBTcXVhcmVzLmlzVmFsaWQpe1xyXG4gICAgICAgIHBsYXllci5nYW1lYm9hcmQucGxhY2VTaGlwKHNoaXBFbGVtZW50LmlkLCBbcm93LCBjb2xdICwgbmV3QWxpZ25tZW50KTtcclxuICAgICAgICBjb25zdCBuZXdPcmlnaW5DZWxsID0gYm9hcmQucXVlcnlTZWxlY3RvcihgW2RhdGEtcm93PVwiJHtyb3d9XCJdW2RhdGEtY29sPVwiJHtjb2x9XCJdYCk7XHJcbiAgICAgICAgbmV3T3JpZ2luQ2VsbC5hcHBlbmRDaGlsZChzaGlwRWxlbWVudCk7XHJcbiAgICAgICAgc2hpcEVsZW1lbnQuZGF0YVNldC5hbGlnbm1lbnQgPSBuZXdBbGlnbm1lbnQ7XHJcbiAgICAgICAgaWYobmV3QWxpZ25tZW50ID09PSAndmVydGljYWwnKSAgc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2V0dXAtc2hpcC12ZXJ0aWNhbCcpO1xyXG4gICAgICAgIGVsc2Ugc2hpcEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2V0dXAtc2hpcC12ZXJ0aWNhbCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwRWxlbWVudC5pZCAsIFtvcmlnaW5Sb3csIG9yaWdpbkNvbF0sIG9yaWdpbkFsaWdubWVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jb25zdCBzZXR1cCA9IHtcclxuICAgIGRyYXdTZXR1cEJvYXJkLFxyXG4gICAgZHJhd1NldHVwU2hpcHNcclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNldHVwO1xyXG5cclxuIiwiaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcHNcIlxyXG5pbXBvcnQgc2hpcFR5cGVzIGZyb20gXCIuL3NoaXBUeXBlc1wiXHJcbmZ1bmN0aW9uIEdhbWVib2FyZCgpe1xyXG4gICAgY29uc3QgYm9hcmQgPSAgY3JlYXRlQm9hcmQoKTtcclxuICAgIGNvbnN0IHBsYWNlZFNoaXBzID0gW107XHJcblxyXG4gICAgLy9jcmVhdGUgZW1wdHkgYm9hcmQgYXJyYXlcclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJvYXJkKCkge1xyXG4gICAgICAgIGxldCBib2FyZEFycmF5ID0gW107XHJcbiAgICAgICAgZm9yKGxldCByb3cgPSAwIDsgcm93IDw9IDkgO3JvdysrKXtcclxuICAgICAgICAgICAgbGV0IHJvd0FycmF5ID0gW107XHJcbiAgICAgICAgICAgIGZvcihsZXQgY29sICA9IDAgOyBjb2w8PSA5ICA7IGNvbCsrKXtcclxuICAgICAgICAgICAgICAgIHJvd0FycmF5W2NvbF09IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYm9hcmRBcnJheVtyb3ddID0gcm93QXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBib2FyZEFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vZnVuY3Rpb24gdG8gZW1wdHkgYm9hcmQgYXJyYXlcclxuICAgIGZ1bmN0aW9uIGNsZWFyQm9hcmQoYm9hcmQpIHtcclxuICAgICAgICBmb3IobGV0IHJvdyAgPSAwIDsgcm93IDw9IDkgOyByb3cgKyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IGNvbCA9IDAgOyBjb2wgPD0gOSA7IGNvbCsrKXtcclxuICAgICAgICAgICAgICAgIGJvYXJkW3Jvd11bY29sXT0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwVHlwZSwgb3JpZ2luLCBhbGlnbm1lbnQpIHsgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXBUeXBlc1tzaGlwVHlwZV0ubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHNoaXBTcXVhcmVzID0gdGhpcy5jaGVja1BsYWNlbWVudChzaGlwTGVuZ3RoLCBvcmlnaW4sIGFsaWdubWVudCk7XHJcbiAgICAgICAgLy8gSWYgc2hpcFNxdWFyZXMgaXMgYSB2YWxpZCBhcnJheSwgcGxhY2UgdGhlIHNoaXAgb24gYWxsIG9mIHRob3NlIHNxdWFyZXNcclxuICAgICAgICBpZiAoc2hpcFNxdWFyZXMuaXNWYWxpZCkge1xyXG4gICAgICAgICAgICBjb25zdCBzaGlwID0gU2hpcChzaGlwVHlwZSk7XHJcbiAgICAgICAgICAgIHNoaXAuc3F1YXJlcyA9IHNoaXBTcXVhcmVzLnNxdWFyZXM7XHJcbiAgICAgICAgICAgIHNoaXAuYWxpZ25tZW50ID0gYWxpZ25tZW50O1xyXG4gICAgICAgICAgICBzaGlwU3F1YXJlcy5zcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBbcm93LCBjb2xdID0gc3F1YXJlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbF0gPSBzaGlwO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBwbGFjZWRTaGlwcy5wdXNoKHNoaXApO1xyXG4gICAgICAgICAgICByZXR1cm4gc2hpcDtcclxuICAgICAgICB9IGVsc2UgcmV0dXJuIFwiQ2Fubm90IHBsYWNlIHNoaXAgaW4gdGhhdCBsb2NhdGlvblwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrUGxhY2VtZW50KHNoaXBMZW5ndGgsIG9yaWdpbiAsIGFsaWdubWVudCkge1xyXG4gICAgICAgIC8vY3JlYXRlIGFycmF5IG9mIHNoaXAgcGxhY2VtZW50IHNxdWFyZXNcclxuICAgICAgICBsZXQgW3JvdywgY29sXT0gb3JpZ2luO1xyXG4gICAgICAgIGxldCBzaGlwU3F1YXJlcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAgOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHNoaXBTcXVhcmVzLnB1c2goW3Jvdyxjb2xdKTtcclxuICAgICAgICAgICAgYWxpZ25tZW50ID09PSAnaG9yaXpvbnRhbCc/Y29sKys6IHJvdysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2lmIGV2ZXJ5IGV2ZXJ5IHBsYWNlbWVudCBzcXVhcmUgaXMgbnVsbCwgdGhlIHZhbGlkUGxhY2VtZW50IGlzIGFuIGFycmF5IG9mIHRoZSB2YWxpZCBzcXVhcmVzXHJcbiAgICAgICAgY29uc3QgdmFsaWRQbGFjZW1lbnQgPSBzaGlwU3F1YXJlcy5ldmVyeShzcXVhcmUgPT57XHJcbiAgICAgICAgICAgIGxldCBbcm93LCBjb2xdICA9IHNxdWFyZTtcclxuICAgICAgICAgICAgaWYodGhpcy5jaGVja1NxdWFyZShyb3csY29sKSA9PT0gdW5kZWZpbmVkKSBcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93XVtjb2xdID09PSBudWxsO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgICAgIC8vcmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSB2YWxpZFBsYWNlbWVudCBhbmQgc3F1YXJlcyBwcm9jZXNzZWRcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpc1ZhbGlkIDogdmFsaWRQbGFjZW1lbnQsXHJcbiAgICAgICAgICAgIHNxdWFyZXMgOiBzaGlwU3F1YXJlc1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja1NxdWFyZShyb3csIGNvbCkge1xyXG4gICAgICAgIGlmIChyb3cgPCAwIHx8IGNvbCA8IDApIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHJvdyA+IDkgfHwgY29sID4gOSkgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBlbHNlIHJldHVybiB0aGlzLmJvYXJkW3Jvd11bY29sXTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNsZWFyRmxlZXQoZmxlZXQpIHtcclxuICAgICAgICB3aGlsZShmbGVldC5sZW5ndGggPiAwICkgZmxlZXQucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlU2hpcChvcmlnaW4pIHtcclxuICAgICAgICBjb25zdCBbcm93LCBjb2xdID0gb3JpZ2luO1xyXG4gICAgICAgIGNvbnN0IHNoaXAgID0gdGhpcy5jaGVja1NxdWFyZShyb3csY29sKTtcclxuICAgICAgICBzaGlwLnNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT57XHJcbiAgICAgICAgICAgIGNvbnN0IFtyb3csIGNvbF0gPSBzcXVhcmU7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbcm93LCBjb2xdID0gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBzaGlwc0luZGV4ID0gdGhpcy5wbGFjZWRTaGlwcy5pbmRleE9mKHNoaXApO1xyXG4gICAgICAgIHRoaXMucGxhY2VkU2hpcHMuc3BsaWNlKHNoaXBzSW5kZXgsMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGxhY2VTaGlwc1JhbmRvbWx5KCkge1xyXG4gICAgICAgIGNsZWFyQm9hcmQodGhpcy5ib2FyZCk7XHJcbiAgICAgICAgY2xlYXJGbGVldCh0aGlzLnBsYWNlZFNoaXBzKTtcclxuICAgICAgICBmb3IobGV0IHNoaXAgaW4gc2hpcFR5cGVzKXtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMucGxhY2VTaGlwUmFuZG9tbHkoc2hpcCk7XHJcbiAgICAgICAgICAgIHdoaWxlKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnIHx8IHJlc3VsdCA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnBsYWNlU2hpcFJhbmRvbWx5KHNoaXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vVGFrZSBhIHNoaXAgYW5kIHBsYWNlIGl0IGF0IHJhbmRvbSBzcXVhcmUgYW5kIHJhbmRvbSBheGlzXHJcbiAgICBmdW5jdGlvbiBwbGFjZVNoaXBSYW5kb21seShzaGlwVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwVHlwZXNbc2hpcFR5cGVdLmxlbmd0aDtcclxuICAgICAgICBmdW5jdGlvbiByYW5kb21BbGlnbm1lbnQoKXtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPCAwLjUgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBnZXRSYW5kb21TcXVhcmUoYWxpZ25tZW50KXtcclxuICAgICAgICAgICAgbGV0IHJvd0RpZiA9IDA7XHJcbiAgICAgICAgICAgIGxldCBjb2xEaWYgPSAwO1xyXG4gICAgICAgICAgICBpZiAoYWxpZ25tZW50ID09PSAnaG9yaXpvbnRhbCcpIFxyXG4gICAgICAgICAgICAgICAgY29sRGlmICA9IHNoaXBMZW5ndGggLSAxO1xyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgcm93RGlmID0gc2hpcExlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIGxldCByb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTAgLSByb3dEaWYpKTtcclxuICAgICAgICAgICAgbGV0IGNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMCAtIGNvbERpZikpO1xyXG4gICAgICAgICAgICByZXR1cm4gW3Jvdyxjb2xdO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGxldCBhbGlnbm1lbnQgPSByYW5kb21BbGlnbm1lbnQoKTtcclxuICAgICAgICBsZXQgb3JpZ2luID0gZ2V0UmFuZG9tU3F1YXJlKGFsaWdubWVudCk7XHJcbiAgICAgICAgbGV0IHNoaXBTcXVhcmVzID0gdGhpcy5jaGVja1BsYWNlbWVudChzaGlwTGVuZ3RoLG9yaWdpbiwgYWxpZ25tZW50KTtcclxuICAgICAgICB3aGlsZSghc2hpcFNxdWFyZXMuaXNWYWxpZCl7XHJcbiAgICAgICAgICAgIGFsaWdubWVudCA9IHJhbmRvbUFsaWdubWVudCgpO1xyXG4gICAgICAgICAgICBvcmlnaW4gPSBnZXRSYW5kb21TcXVhcmUoYWxpZ25tZW50KTtcclxuICAgICAgICAgICAgc2hpcFNxdWFyZXMgPSB0aGlzLmNoZWNrUGxhY2VtZW50KHNoaXBMZW5ndGgsb3JpZ2luLGFsaWdubWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYWNlU2hpcChzaGlwVHlwZSwgb3JpZ2luLCBhbGlnbm1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlY2VpdmVIaXQocm93LGNvbCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmNoZWNrU3F1YXJlKHJvdyxjb2wpID09PSB1bmRlZmluZWQpIHJldHVybiBcIkludmFsaWQgTG9jYXRpb25cIjtcclxuICAgICAgICBjb25zdCBhdHRhY2tlZFNoaXAgPSB0aGlzLmJvYXJkW3Jvd11bY29sXTtcclxuICAgICAgICBpZihhdHRhY2tlZFNoaXAgPT09IG51bGwpIHRoaXMuYm9hcmRbcm93XVtjb2xdID0gJ21pc3MnO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhdHRhY2tlZFNoaXAuaGl0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2xdID0gJ2hpdCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbdGhpcy5ib2FyZFtyb3ddW2NvbF0sIFtyb3csIGNvbF0sIGF0dGFja2VkU2hpcF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tBbGxTaGlwc1N1bmsoKSB7XHJcbiAgICAgICAgcmV0dXJuIHBsYWNlZFNoaXBzLmV2ZXJ5KHNoaXA9PnNoaXAuaXNTdW5rKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYm9hcmQsXHJcbiAgICAgICAgcGxhY2VkU2hpcHMsXHJcbiAgICAgICAgY2hlY2tTcXVhcmUsXHJcbiAgICAgICAgY2hlY2tQbGFjZW1lbnQsXHJcbiAgICAgICAgcGxhY2VTaGlwLFxyXG4gICAgICAgIHJlbW92ZVNoaXAsXHJcbiAgICAgICAgcGxhY2VTaGlwc1JhbmRvbWx5LFxyXG4gICAgICAgIHBsYWNlU2hpcFJhbmRvbWx5LFxyXG4gICAgICAgIHJlY2VpdmVIaXQsXHJcbiAgICAgICAgY2hlY2tBbGxTaGlwc1N1bmtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkOyIsImZ1bmN0aW9uIGVuZW15TG9naWMoKXtcclxuICAgIC8vIDJEIGFycmF5IGNvbnRhaW5pbmcgYWxsIGF2YWlsYWJsZSBhdHRhY2sgY29vcmRpbmF0ZXNcclxuICAgIGNvbnN0IGF2YWlsYWJsZUF0dGFja3MgPSBjcmVhdGVBdHRhY2tBcnJheSgpO1xyXG4gICAgbGV0IGxhc3RTaGlwO1xyXG4gICAgLy9hcnJheSB3aXRoIGFsbCByZWNlbnQgYXR0YWNrcyBpbiBvcmRlclxyXG4gICAgY29uc3QgbGFzdEhpdEFycmF5PVtdO1xyXG4gICAgY29uc3QgRGlyZWN0aW9ucyA9IFsndXAnLCdkb3duJywnbGVmdCcsJ3JpZ2h0J107XHJcbiAgICBsZXQgY29uY3VycmVudE1pc3NlcyA9IDA7XHJcbiAgICBmdW5jdGlvbiBhdHRhY2soZW5lbXkpe1xyXG4gICAgICAgIGlmKHRoaXMubGFzdEhpdEFycmF5Lmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrSWZTaGlwSXNTdW5rKGVuZW15LCB0aGlzLmxhc3RIaXRBcnJheVtsYXN0SGl0QXJyYXkubGVuZ3RoLTFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5hdmFpbGFibGVBdHRhY2tzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICdObyBTcXVhcmVzIHRvIEF0dGFja3MnO1xyXG4gICAgICAgIC8vaWYgdGhlIGJvYXQgbWlzc2VzIG1vcmUgdGhhbiA1IHRpbWUgLCB0aGVuIGl0IGdldHMgYSBjaGFuY2UgdG8gY2hlYXQgXHJcbiAgICAgICAgaWYodGhpcy5sYXN0SGl0QXJyYXkubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgaWYodGhpcy5jb25jdXJyZW50TWlzc2VzPjUgJiYgTWF0aC5yYW5kb20+MC44KXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuZW15Qm9hcmQgPSBlbmVteS5nYW1lYm9hcmQuYm9hcmQ7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdzwxMCA7IHJvdysrKXtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbDwxMCA7Y29sKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZW5lbXkuZ2FtZWJvYXJkLmNoZWNrU3F1YXJlKHJvdyxjb2wpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgY2VsbCA9PT0gJ29iamVjdCcgJiYgY2VsbCAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlYXRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbcm93LGNvbF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGF0dGFja0Nvb3JkcyA9IHRoaXMuZ2V0UmFuZG9tQ2VsbChlbmVteSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRhY2tDb29yZHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vZWxzZSB3ZSBmaXJlIG9uIHRoZSBzcXVhcmVzIGFkamFjZW50IHRvIHRoZSBsYXN0IGhpdCBzcXVhcmVcclxuICAgICAgICBjb25zdCBsYXN0SGl0ID0gdGhpcy5sYXN0SGl0QXJyYXlbbGFzdEhpdEFycmF5Lmxlbmd0aCAtMV07XHJcbiAgICAgICAgY29uc3QgYWRqYWNlbnRDZWxscyA9IHRoaXMuZ2V0QWxsQWRqYWNlbnRDZWxscyhlbmVteSxsYXN0SGl0KTtcclxuICAgICAgICBjb25zdCBhZGphY2VudEhpdHMgPSBhZGphY2VudENlbGxzLmZpbHRlcihjZWxsID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChjZWxsLmNlbGxSZXN1bHQgPT09ICdoaXQnICYmIHRoaXMuY2hlY2tJZlNoaXBJc1N1bmsoZW5lbXksIGNlbGwuYWRqYWNlbnRDZWxsKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vaWYgdGhlcmUgaXMgYSBoaXQgKG9yIG11bHRpcGxlKSBhZGphY2VudCAsIGF0dGFjayBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uXHJcbiAgICAgICAgaWYoYWRqYWNlbnRIaXRzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBjb25zdCByYW5kb21BZGphY2VudEhpdD1hZGphY2VudEhpdHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWRqYWNlbnRIaXRzLmxlbmd0aCldO1xyXG4gICAgICAgICAgICBsZXQgbmV4dENlbGwgPSB0aGlzLmdldE5leHRBdHRhY2thYmxlQ2VsbChlbmVteSxsYXN0SGl0LHRoaXMuZmxpcERpcmVjdGlvbihyYW5kb21BZGphY2VudEhpdC5kaXJlY3Rpb24pKTtcclxuICAgICAgICAgICAgaWYobmV4dENlbGw9PT1mYWxzZSl7XHJcbiAgICAgICAgICAgICAgICBuZXh0Q2VsbD0gdGhpcy5nZXROZXh0QXR0YWNrYWJsZUNlbGwoZW5lbXksbGFzdEhpdCxyYW5kb21BZGphY2VudEhpdC5kaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3aGlsZShuZXh0Q2VsbD09PSBmYWxzZSl7XHJcbiAgICAgICAgICAgICAgICBuZXh0Q2VsbCA9IHRoaXMuZ2V0TmV4dEF0dGFja2FibGVDZWxsKGVuZW15LGxhc3RIaXQsdGhpcy5EaXJlY3Rpb25zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSogdGhpcy5EaXJlY3Rpb25zLmxlbmd0aCldKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHRDZWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9nbyBiYWNrd2FyZHMgdGhyb3VnaCBhbGwgb3RoZXIgaGl0IGNlbGxzIGZvciBhZGphY2VuY3kgdG8gbGFzdCBoaXQgY2VsbCBhbmQgYXR0YWNrIGEgY2VsbCBpbiB0aGF0IGRpcmVjdGlvblxyXG4gICAgICAgIGZvcihsZXQgaSA9IHRoaXMubGFzdEhpdEFycmF5Lmxlbmd0aCAtIDI7IGk+PSAwIDsgaS0tKXtcclxuICAgICAgICAgICAgY29uc3QgY2VsbCA9IHRoaXMubGFzdEhpdEFycmF5W2ldO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmdldEFkamFjZW5jeShsYXN0SGl0LGNlbGwpO1xyXG4gICAgICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IG5leHRDZWxsID0gdGhpcy5nZXROZXh0QXR0YWNrYWJsZUNlbGwoZW5lbXksIGxhc3RIaXQsIHJlc3VsdC5kaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYobmV4dENlbGwpIHJldHVybiBuZXh0Q2VsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBhZGphY2VudENlbGxUb0F0dGFjayA9IGFkamFjZW50Q2VsbHMuZmlsdGVyKGNlbGwgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGNlbGwuY2VsbFJlc3VsdCAhPT0gJ3N0cmluZycgJiYgY2VsbC5jZWxsUmVzdWx0ICE9PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgY2VsbCA9IGFkamFjZW50Q2VsbFRvQXR0YWNrW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFkamFjZW50Q2VsbFRvQXR0YWNrLmxlbmd0aCldO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY2VsbC5hZGphY2VudENlbGwpO1xyXG4gICAgICAgIHJldHVybiBjZWxsLmFkamFjZW50Q2VsbDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tQ2VsbChlbmVteSkge1xyXG4gICAgICAgIGlmKHRoaXMuYXZhaWxhYmxlQXR0YWNrcy5sZW5ndGg9PT0gMCkgcmV0dXJuIFwibm8gU3F1YXJlcyB0byBhdHRhY2tcIjtcclxuICAgICAgICAvL2dldCByb3cgYW5kIGNvbCBmb3IgYSByYW5kb20gYXR0YWNrIGZyb20gdGhlIGF2YWlsYWJsZUF0dGFja3MgYXJyYXlcclxuICAgICAgICBsZXQgYXJyYXlSb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmF2YWlsYWJsZUF0dGFja3MubGVuZ3RoKTtcclxuICAgICAgICBsZXQgYXJyYXlDb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmF2YWlsYWJsZUF0dGFja3NbYXJyYXlSb3ddLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IGNlbGwgPSB0aGlzLmF2YWlsYWJsZUF0dGFja3NbYXJyYXlSb3ddW2FycmF5Q29sXTtcclxuICAgICAgICAvL2lmIHRoZSBzZWxlY3RlZCBjZWxsIGhhcyAwIGFkamFjZW50IGF0dGFja2FibGUgY2VsbHMgZ2V0IGEgcmFuZG9tIGNlbGxcclxuICAgICAgICBjb25zdCBhZGphY2VudENlbGxzID0gdGhpcy5nZXRBbGxBZGphY2VudENlbGxzKGVuZW15LCBjZWxsKTtcclxuICAgICAgICBpZihhZGphY2VudENlbGxzLmV2ZXJ5KGNlbGwgPT4gdHlwZW9mIGNlbGwuY2VsbFJlc3VsdCAhPT0gJ29iamVjdCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJhbmRvbUNlbGwoZW5lbXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2VsbDtcclxuICAgIH1cclxuICAgIC8vUmVtb3ZlIGEgY2VsbCBmcm9tIHRoZSBhdmFpbGFibGVBdHRhY2sgYXJyYXlcclxuICAgIC8vZ2V0cyBjYWxsZWQgYnkgcGxheWVyLmpzIGFmdGVyIGF0dGFjayBcclxuICAgIGZ1bmN0aW9uIHJlbW92ZUNlbGxGcm9tQXZhaWxhYmxlQXR0YWNrcyhjZWxsKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5hdmFpbGFibGVBdHRhY2tzLmxlbmd0aDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5hdmFpbGFibGVBdHRhY2tzW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gdGhpcy5hdmFpbGFibGVBdHRhY2tzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsWzBdID09PSBzcXVhcmVbMF0gJiYgY2VsbFsxXSA9PT0gc3F1YXJlWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVBdHRhY2tzW3Jvd10uc3BsaWNlKGNvbCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlQXR0YWNrc1tyb3ddLmxlbmd0aCA9PT0gMCkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQXR0YWNrcy5zcGxpY2Uocm93LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRBbGxBZGphY2VudENlbGxzKGVuZW15ICwgY2VsbCkge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3Rpb25zLm1hcChkaXJlY3Rpb24gPT57XHJcbiAgICAgICAgICAgIGNvbnN0IGFkamFjZW50Q2VsbCA9IHRoaXMuZ2V0QWRqYWNlbnRDZWxsKGNlbGwsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIGxldCBjZWxsUmVzdWx0ID0gZW5lbXkuZ2FtZWJvYXJkLmNoZWNrU3F1YXJlKGFkamFjZW50Q2VsbFswXSxhZGphY2VudENlbGxbMV0pO1xyXG4gICAgICAgICAgICBpZihjZWxsUmVzdWx0ID09PSAnaGl0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jaGVja0lmU2hpcElzU3VuayhlbmVteSxhZGphY2VudENlbGwpKSBjZWxsUmVzdWx0ID0gJ3N1bmsnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjZWxsUmVzdWx0LFxyXG4gICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxsLFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEFkamFjZW50Q2VsbChjZWxsICwgZGlyZWN0aW9uKXtcclxuICAgIGxldCBbcm93LCBjb2xdID0gY2VsbDtcclxuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSAndXAnOlxyXG4gICAgICAgICAgICByb3ctLTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZG93bic6XHJcbiAgICAgICAgICAgIHJvdysrO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdsZWZ0JzpcclxuICAgICAgICAgICAgY29sLS07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcclxuICAgICAgICAgICAgY29sKys7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBbcm93LCBjb2xdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEFkamFjZW5jeShjZWxsLCBuZWlnaGJvdXJDZWxsKXtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uO1xyXG4gICAgICAgIGxldCBvcHBvc2l0ZURpcmVjdGlvbjtcclxuICAgICAgICBsZXQgZGlzdGFuY2U7XHJcbiAgICAgICAgaWYoY2VsbFswXSA9PT0gbmVpZ2hib3VyQ2VsbFswXSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBjZWxsWzFdLSBuZWlnaGJvdXJDZWxsWzFdO1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBkaWZmID4xID8gJ2xlZnQnIDogJ3JpZ2h0JyA7XHJcbiAgICAgICAgICAgIG9wcG9zaXRlRGlyZWN0aW9uICA9ZGlmZj4xID8gJ3JpZ2h0JyA6ICdsZWZ0JztcclxuICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhkaWZmKTtcclxuICAgICAgICB9ZWxzZSBpZihjZWxsWzFdPT09IG5laWdoYm91ckNlbGxbMV0pe1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmID0gY2VsbFswXS1uZWlnaGJvdXJDZWxsWzBdO1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBkaWZmID4gMSA/ICdkb3duJyA6ICd1cCc7XHJcbiAgICAgICAgICAgIG9wcG9zaXRlRGlyZWN0aW9uID0gZGlmZiA+IDEgPyAndXAnIDogJ2Rvd24nO1xyXG4gICAgICAgICAgICBkaXN0YW5jZSA9IE1hdGguYWJzKGRpZmYpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbixcclxuICAgICAgICAgICAgb3Bwb3NpdGVEaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGRpc3RhbmNlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vbG9vayBmb3IgYSBwb3NzaWJsZSBjZWxsIHRvIGF0dGFjayBpbiBhIGdpdmVuIGRpcmVjdGlvbihvbmx5IDQgY2VsbHMpXHJcbiAgICBmdW5jdGlvbiBnZXROZXh0QXR0YWNrYWJsZUNlbGwoZW5lbXksIGNlbGwgLGRpcmVjdGlvbil7XHJcbiAgICAgICAgbGV0IG5leHRDZWxsID0gZ2V0QWRqYWNlbnRDZWxsKGNlbGwsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCA7IGk8IDQgOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbmV4dENlbGxTdGF0dXM9IGVuZW15LmdhbWVib2FyZC5jaGVja1NxdWFyZShuZXh0Q2VsbFswXSxuZXh0Q2VsbFsxXSk7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBuZXh0Q2VsbFN0YXR1cyA9PT0gJ29iamVjdCcgfHwgbmV4dENlbGxTdGF0dXMgPT09IG51bGwgKSByZXR1cm4gbmV4dENlbGw7XHJcbiAgICAgICAgICAgIGlmKG5leHRDZWxsU3RhdHVzID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmKG5leHRDZWxsU3RhdHVzID09PSAnbWlzcycpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYobmV4dENlbGxTdGF0dXMgPT09ICdoaXQnKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hlY2tJZlNoaXBJc1N1bmsoZW5lbXksIG5leHRDZWxsKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5leHRDZWxsID0gZ2V0QWRqYWNlbnRDZWxsKG5leHRDZWxsLGRpcmVjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmbGlwRGlyZWN0aW9uKGRpcmVjdGlvbil7XHJcbiAgICAgICAgc3dpdGNoKGRpcmVjdGlvbil7XHJcbiAgICAgICAgICAgIGNhc2UgJ3VwJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZG93bic7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd1cCc7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAnbGVmdCc7XHJcbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdyaWdodCc7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vZmluZCBzaGlwIGF0IGdpdmVuIGNlbGwgYW5kIGNoZWNrIGlmIHN1bmsgb3Igbm90IFxyXG4gICAgLy9pZiBzdW5rIHJlbW92ZSB0aGUgc3F1YXJlcyBmcm9tIHRoZSBsYXN0SGl0QXJyYXlcclxuICAgIGZ1bmN0aW9uIGNoZWNrSWZTaGlwSXNTdW5rKGVuZW15LGNlbGwpe1xyXG4gICAgICAgIGNvbnN0IGVuZW15U2hpcCA9IGVuZW15LmdhbWVib2FyZC5wbGFjZWRTaGlwcztcclxuICAgICAgICBsZXQgaGl0U2hpcDtcclxuICAgICAgICBlbmVteVNoaXAuZm9yRWFjaChzaGlwID0+IHtcclxuICAgICAgICAgICAgaWYoc2hpcC5zcXVhcmVzLnNvbWUoc3F1YXJlID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoc3F1YXJlWzBdID09PSBjZWxsWzBdICYmIHNxdWFyZVsxXSAgPT09IGNlbGxbMV0pXHJcbiAgICAgICAgICAgIH0pKSBoaXRTaGlwID0gc2hpcDs7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBpZihoaXRTaGlwLmlzU3VuaygpKXtcclxuICAgICAgICAgICAgaGl0U2hpcC5zcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5sYXN0SGl0QXJyYXkuZmluZEluZGV4KGxvY2F0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGxvY2F0aW9uWzBdID09PSBzcXVhcmVbMF0gJiYgbG9jYXRpb25bMV0gPT09IHNxdWFyZVsxXSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaW5kZXggPiAtMSkgdGhpcy5sYXN0SGl0QXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGF2YWlsYWJsZUF0dGFja3MsXHJcbiAgICAgICAgbGFzdFNoaXAsXHJcbiAgICAgICAgbGFzdEhpdEFycmF5LFxyXG4gICAgICAgIERpcmVjdGlvbnMsXHJcbiAgICAgICAgY29uY3VycmVudE1pc3NlcyxcclxuICAgICAgICBhdHRhY2ssXHJcbiAgICAgICAgZ2V0UmFuZG9tQ2VsbCxcclxuICAgICAgICByZW1vdmVDZWxsRnJvbUF2YWlsYWJsZUF0dGFja3MsXHJcbiAgICAgICAgZ2V0QWRqYWNlbnRDZWxsLFxyXG4gICAgICAgIGdldEFsbEFkamFjZW50Q2VsbHMsXHJcbiAgICAgICAgZ2V0TmV4dEF0dGFja2FibGVDZWxsLFxyXG4gICAgICAgIGdldEFkamFjZW5jeSxcclxuICAgICAgICBmbGlwRGlyZWN0aW9uLFxyXG4gICAgICAgIGNoZWNrSWZTaGlwSXNTdW5rXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUF0dGFja0FycmF5KCl7XHJcbiAgICBjb25zdCBhdHRhY2tBcnJheSA9IFtdO1xyXG4gICAgZm9yKGxldCByb3cgPSAwIDsgcm93PCAxMCA7IHJvdysrKXtcclxuICAgICAgICBsZXQgcm93QXJyYXkgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGNvbCA9IDAgOyBjb2wgPCAxMCA7IGNvbCsrKXtcclxuICAgICAgICAgICAgcm93QXJyYXkucHVzaChbcm93LGNvbF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhdHRhY2tBcnJheS5wdXNoKHJvd0FycmF5KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhdHRhY2tBcnJheTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZW5lbXlMb2dpYzsiLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xyXG5cclxuZnVuY3Rpb24gR2FtZSgpe1xyXG4gICAgbGV0IHBsYXllcjE7XHJcbiAgICBsZXQgcGxheWVyMjtcclxuICAgIGxldCBjdXJyZW50UGxheWVyO1xyXG4gICAgbGV0IGRlZmVuZGluZ1BsYXllcjtcclxuXHJcbiAgICBmdW5jdGlvbiBDcmVhdGVQbGF5ZXIobmFtZSwgbnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gUGxheWVyKG5hbWUsIG51bWJlcik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbmV3R2FtZShwbGF5ZXIxLCBwbGF5ZXIyKXtcclxuICAgICAgICB0aGlzLnBsYXllcjEgPSBwbGF5ZXIxO1xyXG4gICAgICAgIHRoaXMucGxheWVyMiA9IHBsYXllcjI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyICA9IHRoaXMucGxheWVyMTtcclxuICAgICAgICB0aGlzLmRlZmVuZGluZ1BsYXllciA9IHRoaXMucGxheWVyMjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzd2l0Y2hUdXJuKCl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5jdXJyZW50UGxheWVyID09PSB0aGlzLnBsYXllcjEgXHJcbiAgICAgICAgICAgID8gdGhpcy5wbGF5ZXIyICBcclxuICAgICAgICAgICAgOiB0aGlzLnBsYXllcjE7XHJcbiAgICAgICAgdGhpcy5kZWZlbmRpbmdQbGF5ZXIgPSB0aGlzLmRlZmVuZGluZ1BsYXllciA9PT0gdGhpcy5wbGF5ZXIyIFxyXG4gICAgICAgICAgICA/IHRoaXMucGxheWVyMSBcclxuICAgICAgICAgICAgOiB0aGlzLnBsYXllcjI7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjaGVja0dhbWVPdmVyKCl7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIxLmdhbWVib2FyZC5jaGVja0FsbFNoaXBzU3VuaygpKSBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyMjtcclxuICAgICAgICBlbHNlIGlmKHRoaXMucGxheWVyMi5nYW1lYm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKSkgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcjE7XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlIDtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcGxheWVyMSxcclxuICAgICAgICBwbGF5ZXIyLFxyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIsXHJcbiAgICAgICAgZGVmZW5kaW5nUGxheWVyLFxyXG4gICAgICAgIENyZWF0ZVBsYXllcixcclxuICAgICAgICBuZXdHYW1lLFxyXG4gICAgICAgIHN3aXRjaFR1cm4sXHJcbiAgICAgICAgY2hlY2tHYW1lT3ZlclxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IEdhbWU7IiwiaW1wb3J0IEdhbWVib2FyZCAgZnJvbSBcIi4vYm9hcmRcIjtcclxuaW1wb3J0IGVuZW15TG9naWMgZnJvbSAnLi9lbmVteUxvZ2ljJ1xyXG5cclxuZnVuY3Rpb24gUGxheWVyKHBsYXllck5hbWUsIHBsYXllck51bSl7XHJcbiAgICBsZXQgbmFtZSA9IHR5cGVvZiBwbGF5ZXJOYW1lID09PSAnc3RyaW5nJyA/IHBsYXllck5hbWUgOiAnYm90JztcclxuICAgIGNvbnN0IG51bWJlciA9IHBsYXllck51bTtcclxuICAgIGNvbnN0IGlzQUkgPSB0eXBlb2YgcGxheWVyTmFtZSA9PT0gJ3N0cmluZycgPyBmYWxzZSA6IHRydWU7XHJcbiAgICBjb25zdCBnYW1lYm9hcmQgPSBHYW1lYm9hcmQoKTtcclxuICAgIGNvbnN0IGVuZW15ID0gZW5lbXlMb2dpYygpO1xyXG4gICAgZnVuY3Rpb24gYXR0YWNrKHRhcmdldCwgcm93ICwgY29sKXtcclxuICAgICAgICBpZih0aGlzLmlzQUkpe1xyXG4gICAgICAgICAgICBpZih0aGlzLmVuZW15LmF2YWlsYWJsZUF0dGFja3MubGVuZ3RoID09PSAwKSBcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImNhbm5vdCBhdHRhY2sgZnVydGhlclwiO1xyXG4gICAgICAgICAgICBbcm93LGNvbF09IHRoaXMuZW5lbXkuYXR0YWNrKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vZ2V0IHRoZSByZXN1bHQgb2YgdGhlIGF0dGFja1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5nYW1lYm9hcmQucmVjZWl2ZUhpdChyb3csY29sKTtcclxuICAgICAgICBpZih0aGlzLmlzQUkpe1xyXG4gICAgICAgICAgICBpZihyZXN1bHRbMF0gPT09ICdoaXQnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbXkubGFzdEhpdEFycmF5LnB1c2gocmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbXkuY29uY3VycmVudE1pc3NlcyA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocmVzdWx0WzBdID09PSAnbWlzcycpIHRoaXMuZW5lbXkuY29uY3VycmVudE1pc3NlcysrO1xyXG4gICAgICAgICAgICBpZihyZXN1bHRbMl0gIT09ICdudWxsJykgdGhpcy5lbmVteS5sYXN0U2hpcCA9IHJlc3VsdFsyXTtcclxuICAgICAgICAgICAgdGhpcy5lbmVteS5yZW1vdmVDZWxsRnJvbUF2YWlsYWJsZUF0dGFja3MocmVzdWx0WzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHJldHVybntcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIG51bWJlcixcclxuICAgICAgICBpc0FJLFxyXG4gICAgICAgIGdhbWVib2FyZCxcclxuICAgICAgICBlbmVteSxcclxuICAgICAgICBhdHRhY2tcclxuICAgIH0gXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcclxuIiwiY29uc3Qgc2hpcFR5cGVzID0ge1xyXG4gICAgY2Fycmllcjp7XHJcbiAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgbmFtZSA6ICdjYXJyaWVyJyxcclxuICAgICAgICBsZW5ndGg6NVxyXG4gICAgfSxcclxuICAgIGJhdHRsZXNoaXA6e1xyXG4gICAgICAgIGlkOjIsXHJcbiAgICAgICAgbmFtZTogJ2JhdHRsZXNoaXAnLFxyXG4gICAgICAgIGxlbmd0aDo0XHJcbiAgICB9LFxyXG4gICAgZGVzdHJveWVyOntcclxuICAgICAgICBpZDozLFxyXG4gICAgICAgIG5hbWU6J2Rlc3Ryb3llcicsXHJcbiAgICAgICAgbGVuZ3RoOjNcclxuICAgIH0sXHJcbiAgICBzdWJtYXJpbmU6e1xyXG4gICAgICAgIGlkOjQsXHJcbiAgICAgICAgbmFtZTonc3VibWFyaW5lJyxcclxuICAgICAgICBsZW5ndGg6M1xyXG4gICAgfSxcclxuICAgIHBhdHJvbDp7XHJcbiAgICAgICAgaWQ6NSxcclxuICAgICAgICBuYW1lOidwYXRyb2wnLFxyXG4gICAgICAgIGxlbmd0aDoyXHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgc2hpcFR5cGVzOyIsImltcG9ydCBzaGlwVHlwZXMgZnJvbSBcIi4vc2hpcFR5cGVzXCJcclxuZnVuY3Rpb24gU2hpcChzaGlwVHlwZSl7XHJcbiAgICBjb25zdCB0eXBlID0gc2hpcFR5cGU7XHJcbiAgICBjb25zdCBsZW5ndGggPSBzaGlwVHlwZXNbc2hpcFR5cGVdLmxlbmd0aDtcclxuICAgIGxldCBoaXRzID0gMDtcclxuICAgIGxldCBzcXVhcmVzOyBcclxuICAgIGxldCBhbGlnbm1lbnQgO1xyXG4gICAgZnVuY3Rpb24gaGl0KCl7XHJcbiAgICAgICAgdGhpcy5oaXRzKys7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBpc1N1bmsoKXtcclxuICAgICAgICBpZih0aGlzLmhpdHMgPj0gdGhpcy5sZW5ndGgpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlICxcclxuICAgICAgICBsZW5ndGgsXHJcbiAgICAgICAgaGl0cywgXHJcbiAgICAgICAgc3F1YXJlcyxcclxuICAgICAgICBhbGlnbm1lbnQsXHJcbiAgICAgICAgaGl0LCBcclxuICAgICAgICBpc1N1bmtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaGlwOyIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBzZXR1cCAqL1xyXG46cm9vdHtcclxuICAgIC0taGVhZGVyLWhlaWdodDogMTAwcHg7XHJcbiAgICAtLWJvYXJkLXNpemU6IDMxOHB4O1xyXG4gICAgLS1jZWxsLXNpemU6IDMwcHg7XHJcblxyXG4gICAgLS1iYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQwLCAyNDAsIDI0MCk7XHJcbiAgICAtLWJhY2tncm91bmQtY29sb3ItdHJhbnNwYXJlbnQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC43KTtcclxuICAgIC0tY2VsbC1jb2xvcjogcmdiKDIzMCwgMjMwLCAyMzApO1xyXG4gICAgLS1jZWxsLWhvdmVyLWNvbG9yOiByZ2IoMjAwLCAyMDAsIDIwMCk7XHJcbiAgICAtLWNlbGwtYm9yZGVyLWNvbG9yOiByZ2IoNzAsIDcwLCA3MCk7XHJcbiAgICAtLXNoaXAtY29sb3I6IHJnYigxNTAsIDE1MCwgMTUwKTtcclxuICAgIC0taGl0LWNvbG9yOiByZ2IoMjA2LCAxNjksIDEzNCk7XHJcbiAgICAtLW1pc3MtY29sb3I6IHJnYigxNjEsIDIxNiwgMTYxKTtcclxuICAgIC0tc3Vuay1jb2xvcjogcmdiKDIwNiwgMTM0LCAxMzQpO1xyXG4gICAgLS10ZXh0LWNvbG9yLW1haW46IHJnYig0MCwgNDAsIDQwKTtcclxuICAgIC0tdGV4dC1jb2xvci1ncmV5OiByZ2IoMTAwLCAxMDAsIDEwMCk7XHJcbiAgICAtLWJ1dHRvbi1jb2xvcjogcmdiKDIxMCwgMjEwLCAyMTApO1xyXG4gICAgLS1idXR0b24tY29sb3ItaG92ZXI6IHJnYigyMzAsIDIzMCwgMjMwKTtcclxuICAgIC0tYnV0dG9uLWNvbG9yLWFjdGl2ZTogZ3JleTtcclxufVxyXG46cm9vdC5kYXJrIHtcclxuICAgIC0tYmFja2dyb3VuZC1jb2xvcjogcmdiKDMwLCAzMCwgMzApO1xyXG4gICAgLS1iYWNrZ3JvdW5kLWNvbG9yLXRyYW5zcGFyZW50OiByZ2JhKDMwLCAzMCwgMzAsIDAuNyk7XHJcbiAgICAtLWNlbGwtY29sb3I6IHJnYig0MCwgNDAsIDQwKTtcclxuICAgIC0tY2VsbC1ob3Zlci1jb2xvcjogcmdiKDkwLCA5MCwgOTApO1xyXG4gICAgLS1jZWxsLWJvcmRlci1jb2xvcjogcmdiKDIyMCwgMjIwLCAyMjApO1xyXG4gICAgLS1zaGlwLWNvbG9yOiByZ2IoMTUzLCAxNTMsIDE1Myk7XHJcbiAgICAtLWhpdC1jb2xvcjogcmdiKDE1NSwgOTksIDYxKTtcclxuICAgIC0tbWlzcy1jb2xvcjogcmdiKDUyLCAxMDksIDUyKTtcclxuICAgIC0tc3Vuay1jb2xvcjogcmdiKDE1NSwgNjEsIDYxKTtcclxuICAgIC0tdGV4dC1jb2xvci1tYWluOiByZ2IoMjIwLCAyMjAsIDIyMCk7XHJcbiAgICAtLXRleHQtY29sb3ItZ3JleTogcmdiKDE2MCwgMTYwLCAxNjApO1xyXG4gICAgLS1idXR0b24tY29sb3I6IHJnYig1MCwgNTAsIDUwKTtcclxuICAgIC0tYnV0dG9uLWNvbG9yLWhvdmVyOiByZ2IoMjAsIDIwLCAyMCk7XHJcbiAgICAtLWJ1dHRvbi1jb2xvci1hY3RpdmU6IGdyZXk7XHJcbn1cclxuXHJcbiosXHJcbio6OmJlZm9yZSxcclxuKjo6YWZ0ZXIge1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxufVxyXG4vKiBjb250ZW50cyAqL1xyXG5ib2R5IHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWJhY2tncm91bmQtY29sb3IpO1xyXG4gICAgZm9udC1mYW1pbHk6ICdSYWxld2F5Jywgc2Fucy1zZXJpZjtcclxuICAgIGNvbG9yOnZhcigtLXRleHQtY29sb3ItbWFpbik7XHJcbn1cclxuXHJcbiNhcHAge1xyXG4gICAgcGFkZGluZzogMCA1JTtcclxuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbn1cclxuaDN7XHJcbiAgICBtYXJnaW46MDtcclxufVxyXG4vKiBoZWFkZXIgKi9cclxuaGVhZGVyIHtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbiA7XHJcbiAgICBhbGlnbi1pdGVtczpjZW50ZXI7XHJcbiAgICB3aWR0aDo2NzVweDtcclxufVxyXG5cclxuaGVhZGVyIGJ1dHRvbntcclxuICAgIGhlaWdodDozMnB4O1xyXG4gICAgd2lkdGg6IDEyMHB4O1xyXG4gICAgZm9udC1zaXplOjFyZW07XHJcbiAgICBwYWRkaW5nLWJvdHRvbToycHg7XHJcbn1cclxuXHJcbmJ1dHRvbiB7XHJcbiAgICBmb250LWZhbWlseTogJ0ZpcmEgQ29kZScsIG1vbm9zcGFjZTtcclxuICAgIGNvbG9yOnZhcigtLXRleHQtY29sb3ItbWFpbik7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS10ZXh0LWNvbG9yLW1haW4pO1xyXG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnV0dG9uLWNvbG9yKTtcclxufVxyXG5idXR0b246YWN0aXZle1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnV0dG9uLWNvbG9yLWFjdGl2ZSk7XHJcbiAgICBzY2FsZTowLjk1O1xyXG59XHJcblxyXG5AbWVkaWEgKGhvdmVyOmhvdmVyKXtcclxuICAgIGJ1dHRvbjpob3ZlciB7XHJcbiAgICAgICAgY3Vyc29yOnBvaW50ZXI7XHJcbiAgICAgICAgYm9yZGVyLXdpZHRoOiAycHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1idXR0b24tY29sb3ItaG92ZXIpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIGdhbWUgY29udGFpbmVyICovXHJcblxyXG4jZ2FtZS1jb250YWluZXIge1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBmbGV4LXdyYXA6d3JhcDtcclxuICAgIGdhcDo0MHB4O1xyXG59XHJcbi8qIHBsYXllciBzZXR1cCAqL1xyXG4uc2V0dXAtc2hpcHMtY29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIHdpZHRoOiB2YXIoLS1ib2FyZC1zaXplKTtcclxuICAgIGhlaWdodDogY2FsYyh2YXIoLS1ib2FyZC1zaXplKSsyNXB4KTtcclxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xyXG5cclxufVxyXG4uc2V0dXAtc2hpcHMtaGVhZGVyIHAge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgZm9udC1zaXplOiAwLjhyZW07XHJcbn1cclxuLnNldHVwLXNoaXAtc2hpcGxpc3Qge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO1xyXG59XHJcbi5zZXR1cC1zaGlwe1xyXG4gICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLnNldHVwLXNoaXAgcHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xyXG59XHJcblxyXG4uc2V0dXAtc2hpcC1ib3h7XHJcbiAgICBjdXJzb3I6Z3JhYjtcclxuICAgIGRpc3BsYXk6aW5saW5lLWZsZXg7XHJcbiAgICBnYXA6MnB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgei1pbmRleDoyMDtcclxufVxyXG4uc2V0dXAtc2hpcC12ZXJ0aWNhbHtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbn1cclxuLnNldHVwLXNoaXAtaGlkZSBkaXZ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDApO1xyXG4gICAgb3BhY2l0eTogMC41O1xyXG59XHJcbi5zZXR1cC1zaGlwLWRyb3BwZWR7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBsZWZ0OiAtMXB4O1xyXG4gICAgdG9wOiAtMXB4O1xyXG59XHJcblxyXG4uZ2hvc3Qtc2hpcHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHotaW5kZXg6IDIwMDtcclxuICAgIG9wYWNpdHk6IDAuODtcclxufVxyXG4uZ2hvc3Qtc2hpcD4gLnNldHVwLXNoaXAtY2VsbHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNlbGwtaG92ZXItY29sb3IpO1xyXG59XHJcblxyXG4uc2V0dXAtc2hpcC1jZWxsIHtcclxuICAgIHdpZHRoOiB2YXIoLS1jZWxsLXNpemUpO1xyXG4gICAgaGVpZ2h0OnZhcigtLWNlbGwtc2l6ZSk7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jZWxsLWhvdmVyLWNvbG9yKTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNlbGwtYm9yZGVyLWNvbG9yKTtcclxufVxyXG5cclxuLnNldHVwLXNoaXBzLW9wdGlvbnN7XHJcbiAgICBkaXNwbGF5OmZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbn1cclxuXHJcbi5zdGFydC1nYW1lLWJ1dHRvbixcclxuLnNldHVwLWJ1dHRvbi1yYW5kb20ge1xyXG4gICAgd2lkdGg6IDEyMHB4O1xyXG4gICAgaGVpZ2h0OjM2cHg7XHJcbn1cclxuLnN0YXJ0LWdhbWUtYnV0dG9ue1xyXG4gICAgZm9udC13ZWlnaHQ6NjAwO1xyXG4gICAgZm9udC1zaXplOjFyZW07XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWhpdC1jb2xvcik7XHJcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4xcyBlYXNlO1xyXG59XHJcbi5zdGFydC1nYW1lLWJ1dHRvbi1kaXNhYmxlZHtcclxuICAgIG9wYWNpdHk6IDAuNTtcclxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG59XHJcbkBtZWRpYShob3ZlcjogaG92ZXIpe1xyXG4gICAgLnNldHVwLWJ1dHRvbi1zdGFydDpob3ZlcntcclxuICAgICAgICB0cmFuc2Zvcm06c2NhbGUoMS4xKTtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOnJnYigyMjYsMTE2LDExNik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIHBsYXllciBzZWN0aW9ucyAqL1xyXG5cclxuLmJvYXJkLWNvbnRhaW5lciB7XHJcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcclxufVxyXG5cclxuLyogcGxheWVyIGJvYXJkICovXHJcbi5ib2FyZHtcclxuICAgIGRpc3BsYXk6Z3JpZDtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLDFmcik7XHJcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwxZnIpO1xyXG4gICAgZ2FwOjJweDtcclxufVxyXG5cclxuLmNlbGwge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgY3Vyc29yOiBjcm9zc2hhaXI7XHJcbiAgICBoZWlnaHQ6dmFyKC0tY2VsbC1zaXplKTtcclxuICAgIHdpZHRoOiB2YXIoLS1jZWxsLXNpemUpO1xyXG4gICAgZGlzcGxheTpmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBhbGlnbi1jb250ZW50OmNlbnRlcjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNlbGwtY29sb3IpO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tY2VsbC1ib3JkZXItY29sb3IpO1xyXG59XHJcblxyXG4uY2VsbC1zZXR1cHtcclxuICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xyXG59XHJcbi5jZWxsLWRyYWctb3ZlcntcclxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgICB6LWluZGV4OjQwO1xyXG59XHJcblxyXG4uY2VsbC1kcmFnLXZhbGlke1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1taXNzLWNvbG9yKTtcclxufVxyXG4uY2VsbC1kcmFnLWludmFsaWR7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWhpdC1jb2xvcik7XHJcbn1cclxuXHJcbkBtZWRpYShob3ZlcjogaG92ZXIpe1xyXG4gICAgLmNlbGw6bm90KFtkYXRhLXBsYXllcj0nMSddKTpub3QoLmNlbGwtaGl0KTpub3QoLmNlbGwtbWlzcyk6aG92ZXJ7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1jZWxsLWhvdmVyLWNvbG9yKTtcclxuICAgIH1cclxufVxyXG5cclxuLmNlbGwtc2hpcHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tc2hpcC1jb2xvcik7XHJcbn1cclxuXHJcbi5jZWxsLWhpdHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0taGl0LWNvbG9yKTtcclxufVxyXG4uY2VsbC1oaXQ6OmFmdGVye1xyXG4gICAgY29udGVudDonWCc7XHJcbiAgICBvcGFjaXR5OjAuODtcclxuICAgIGZvbnQtc2l6ZTogMS4zcmVtO1xyXG4gICAgcGFkZGluZy1ib3R0b206IDFweDtcclxufVxyXG4uY2VsbC1taXNze1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1taXNzLWNvbG9yKTtcclxufVxyXG5cclxuLmNlbGwtbWlzczo6YWZ0ZXJ7XHJcbiAgICBjb250ZW50OlwiT1wiO1xyXG4gICAgb3BhY2l0eTowLjY7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogNHB4O1xyXG59XHJcblxyXG4uY2VsbC1zdW5re1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc3Vuay1jb2xvcik7XHJcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgZWFzZTtcclxufVxyXG5cclxuLyogZm9vdGVyICovXHJcbmZvb3RlcntcclxuICAgIGRpc3BsYXk6ZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIHRleHQtYWxpZ246Y2VudGVyO1xyXG4gICAgZ2FwOjE2cHg7XHJcbiAgICBwYWRkaW5nOjAgMzJweDtcclxufVxyXG5cclxuI2Zvb3Rlci1saW5re1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG59XHJcbmZvb3RlciBwe1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xyXG59XHJcbmZvb3RlciBpe1xyXG4gICAgY29sb3I6dmFyKC0tdGV4dC1jb2xvci1tYWluKTtcclxufVxyXG5AbWVkaWEoaG92ZXI6IGhvdmVyKXtcclxuICAgICNmb290ZXItbGluazpob3ZlcntcclxuICAgICAgICBjdXJzb3I6cG9pbnRlcjtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XHJcbiAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMXMgZWFzZTtcclxuICAgIH1cclxufVxyXG5cclxuLyogVmljdG9yeSBDb250YWluZXIgKi9cclxuLnZpY3RvcnktY29udGFpbmVye1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgbGVmdDogNTAlO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgIHdpZHRoOiAzMThweDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHBhZGRpbmc6IDIwcHg7XHJcbiAgICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS10ZXh0LWNvbG9yLW1haW4pO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1jb2xvci10cmFuc3BhcmVudCk7XHJcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcclxufVxyXG4udmljdG9yeS1jb250YWluZXIgaDIge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgdGV4dC1zaGFkb3c6IDAgMCAycHggYmxhY2ssIDAgMCA0cHggYmxhY2ssIDAgMCA2cHggYmxhY2s7XHJcbn1cclxuXHJcbi52aWN0b3J5LWNvbnRhaW5lciBwIHtcclxuICAgIG1hcmdpbjogNnB4O1xyXG59XHJcblxyXG4udmljdG9yeS12aWN0b3J5IHtcclxuICAgIGNvbG9yOiB2YXIoLS1taXNzLWNvbG9yKTtcclxufVxyXG5cclxuLnZpY3RvcnktZGVmZWF0IHtcclxuICAgIGNvbG9yOiB2YXIoLS1zdW5rLWNvbG9yKTtcclxufVxyXG5cclxuXHJcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDgwMHB4KSB7XHJcbiAgICA6cm9vdCB7XHJcbiAgICAgICAgLS1oZWFkZXItaGVpZ2h0OiA4MHB4O1xyXG4gICAgICAgIC0tYm9hcmQtc2l6ZTogMjc4cHg7XHJcbiAgICAgICAgLS1jZWxsLXNpemU6IDI2cHg7XHJcbiAgICB9XHJcbiAgICBoZWFkZXJ7XHJcbiAgICAgICAgd2lkdGg6NDAwcHg7XHJcbiAgICB9XHJcblxyXG4gICAgaGVhZGVyIGJ1dHRvbiB7XHJcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xyXG4gICAgICAgIHdpZHRoOiAxMDBweDtcclxuICAgICAgICBmb250LXNpemU6IDAuOXJlbTtcclxuICAgICAgICBwYWRkaW5nLWJvdHRvbTogMnB4O1xyXG4gICAgfVxyXG5cclxuICAgICNnYW1lLWNvbnRhaW5lciB7XHJcbiAgICAgICAgZ2FwOiAyMHB4O1xyXG4gICAgfVxyXG5cclxuICAgIC5zdGFydC1nYW1lLWJ1dHRvbixcclxuICAgIC5zZXR1cC1idXR0b24tcmFuZG9tIHtcclxuICAgICAgICB3aWR0aDogMTAwcHg7XHJcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xyXG4gICAgfVxyXG5cclxuICAgIC5zZXR1cC1idXR0b24tc3RhcnQge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMC45cmVtO1xyXG4gICAgfVxyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLFVBQVU7QUFDVjtJQUNJLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsaUJBQWlCOztJQUVqQixzQ0FBc0M7SUFDdEMsd0RBQXdEO0lBQ3hELGdDQUFnQztJQUNoQyxzQ0FBc0M7SUFDdEMsb0NBQW9DO0lBQ3BDLGdDQUFnQztJQUNoQywrQkFBK0I7SUFDL0IsZ0NBQWdDO0lBQ2hDLGdDQUFnQztJQUNoQyxrQ0FBa0M7SUFDbEMscUNBQXFDO0lBQ3JDLGtDQUFrQztJQUNsQyx3Q0FBd0M7SUFDeEMsMkJBQTJCO0FBQy9CO0FBQ0E7SUFDSSxtQ0FBbUM7SUFDbkMscURBQXFEO0lBQ3JELDZCQUE2QjtJQUM3QixtQ0FBbUM7SUFDbkMsdUNBQXVDO0lBQ3ZDLGdDQUFnQztJQUNoQyw2QkFBNkI7SUFDN0IsOEJBQThCO0lBQzlCLDhCQUE4QjtJQUM5QixxQ0FBcUM7SUFDckMscUNBQXFDO0lBQ3JDLCtCQUErQjtJQUMvQixxQ0FBcUM7SUFD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SSxpQkFBaUI7SUFDckI7QUFDSlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBzZXR1cCAqL1xcclxcbjpyb290e1xcclxcbiAgICAtLWhlYWRlci1oZWlnaHQ6IDEwMHB4O1xcclxcbiAgICAtLWJvYXJkLXNpemU6IDMxOHB4O1xcclxcbiAgICAtLWNlbGwtc2l6ZTogMzBweDtcXHJcXG5cXHJcXG4gICAgLS1iYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQwLCAyNDAsIDI0MCk7XFxyXFxuICAgIC0tYmFja2dyb3VuZC1jb2xvci10cmFuc3BhcmVudDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjcpO1xcclxcbiAgICAtLWNlbGwtY29sb3I6IHJnYigyMzAsIDIzMCwgMjMwKTtcXHJcXG4gICAgLS1jZWxsLWhvdmVyLWNvbG9yOiByZ2IoMjAwLCAyMDAsIDIwMCk7XFxyXFxuICAgIC0tY2VsbC1ib3JkZXItY29sb3I6IHJnYig3MCwgNzAsIDcwKTtcXHJcXG4gICAgLS1zaGlwLWNvbG9yOiByZ2IoMTUwLCAxNTAsIDE1MCk7XFxyXFxuICAgIC0taGl0LWNvbG9yOiByZ2IoMjA2LCAxNjksIDEzNCk7XFxyXFxuICAgIC0tbWlzcy1jb2xvcjogcmdiKDE2MSwgMjE2LCAxNjEpO1xcclxcbiAgICAtLXN1bmstY29sb3I6IHJnYigyMDYsIDEzNCwgMTM0KTtcXHJcXG4gICAgLS10ZXh0LWNvbG9yLW1haW46IHJnYig0MCwgNDAsIDQwKTtcXHJcXG4gICAgLS10ZXh0LWNvbG9yLWdyZXk6IHJnYigxMDAsIDEwMCwgMTAwKTtcXHJcXG4gICAgLS1idXR0b24tY29sb3I6IHJnYigyMTAsIDIxMCwgMjEwKTtcXHJcXG4gICAgLS1idXR0b24tY29sb3ItaG92ZXI6IHJnYigyMzAsIDIzMCwgMjMwKTtcXHJcXG4gICAgLS1idXR0b24tY29sb3ItYWN0aXZlOiBncmV5O1xcclxcbn1cXHJcXG46cm9vdC5kYXJrIHtcXHJcXG4gICAgLS1iYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMzAsIDMwLCAzMCk7XFxyXFxuICAgIC0tYmFja2dyb3VuZC1jb2xvci10cmFuc3BhcmVudDogcmdiYSgzMCwgMzAsIDMwLCAwLjcpO1xcclxcbiAgICAtLWNlbGwtY29sb3I6IHJnYig0MCwgNDAsIDQwKTtcXHJcXG4gICAgLS1jZWxsLWhvdmVyLWNvbG9yOiByZ2IoOTAsIDkwLCA5MCk7XFxyXFxuICAgIC0tY2VsbC1ib3JkZXItY29sb3I6IHJnYigyMjAsIDIyMCwgMjIwKTtcXHJcXG4gICAgLS1zaGlwLWNvbG9yOiByZ2IoMTUzLCAxNTMsIDE1Myk7XFxyXFxuICAgIC0taGl0LWNvbG9yOiByZ2IoMTU1LCA5OSwgNjEpO1xcclxcbiAgICAtLW1pc3MtY29sb3I6IHJnYig1MiwgMTA5LCA1Mik7XFxyXFxuICAgIC0tc3Vuay1jb2xvcjogcmdiKDE1NSwgNjEsIDYxKTtcXHJcXG4gICAgLS10ZXh0LWNvbG9yLW1haW46IHJnYigyMjAsIDIyMCwgMjIwKTtcXHJcXG4gICAgLS10ZXh0LWNvbG9yLWdyZXk6IHJnYigxNjAsIDE2MCwgMTYwKTtcXHJcXG4gICAgLS1idXR0b24tY29sb3I6IHJnYig1MCwgNTAsIDUwKTtcXHJcXG4gICAgLS1idXR0b24tY29sb3ItaG92ZXI6IHJnYigyMCwgMjAsIDIwKTtcXHJcXG4gICAgLS1idXR0b24tY29sb3ItYWN0aXZlOiBncmV5O1xcclxcbn1cXHJcXG5cXHJcXG4qLFxcclxcbio6OmJlZm9yZSxcXHJcXG4qOjphZnRlciB7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxufVxcclxcbi8qIGNvbnRlbnRzICovXFxyXFxuYm9keSB7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1iYWNrZ3JvdW5kLWNvbG9yKTtcXHJcXG4gICAgZm9udC1mYW1pbHk6ICdSYWxld2F5Jywgc2Fucy1zZXJpZjtcXHJcXG4gICAgY29sb3I6dmFyKC0tdGV4dC1jb2xvci1tYWluKTtcXHJcXG59XFxyXFxuXFxyXFxuI2FwcCB7XFxyXFxuICAgIHBhZGRpbmc6IDAgNSU7XFxyXFxuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcclxcbiAgICBkaXNwbGF5OmZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbn1cXHJcXG5oM3tcXHJcXG4gICAgbWFyZ2luOjA7XFxyXFxufVxcclxcbi8qIGhlYWRlciAqL1xcclxcbmhlYWRlciB7XFxyXFxuICAgIGRpc3BsYXk6ZmxleDtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuIDtcXHJcXG4gICAgYWxpZ24taXRlbXM6Y2VudGVyO1xcclxcbiAgICB3aWR0aDo2NzVweDtcXHJcXG59XFxyXFxuXFxyXFxuaGVhZGVyIGJ1dHRvbntcXHJcXG4gICAgaGVpZ2h0OjMycHg7XFxyXFxuICAgIHdpZHRoOiAxMjBweDtcXHJcXG4gICAgZm9udC1zaXplOjFyZW07XFxyXFxuICAgIHBhZGRpbmctYm90dG9tOjJweDtcXHJcXG59XFxyXFxuXFxyXFxuYnV0dG9uIHtcXHJcXG4gICAgZm9udC1mYW1pbHk6ICdGaXJhIENvZGUnLCBtb25vc3BhY2U7XFxyXFxuICAgIGNvbG9yOnZhcigtLXRleHQtY29sb3ItbWFpbik7XFxyXFxuICAgIGRpc3BsYXk6ZmxleDtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXRleHQtY29sb3ItbWFpbik7XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnV0dG9uLWNvbG9yKTtcXHJcXG59XFxyXFxuYnV0dG9uOmFjdGl2ZXtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnV0dG9uLWNvbG9yLWFjdGl2ZSk7XFxyXFxuICAgIHNjYWxlOjAuOTU7XFxyXFxufVxcclxcblxcclxcbkBtZWRpYSAoaG92ZXI6aG92ZXIpe1xcclxcbiAgICBidXR0b246aG92ZXIge1xcclxcbiAgICAgICAgY3Vyc29yOnBvaW50ZXI7XFxyXFxuICAgICAgICBib3JkZXItd2lkdGg6IDJweDtcXHJcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0tYnV0dG9uLWNvbG9yLWhvdmVyKVxcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbi8qIGdhbWUgY29udGFpbmVyICovXFxyXFxuXFxyXFxuI2dhbWUtY29udGFpbmVyIHtcXHJcXG4gICAgZGlzcGxheTpmbGV4O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbiAgICBmbGV4LXdyYXA6d3JhcDtcXHJcXG4gICAgZ2FwOjQwcHg7XFxyXFxufVxcclxcbi8qIHBsYXllciBzZXR1cCAqL1xcclxcbi5zZXR1cC1zaGlwcy1jb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OmZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICB3aWR0aDogdmFyKC0tYm9hcmQtc2l6ZSk7XFxyXFxuICAgIGhlaWdodDogY2FsYyh2YXIoLS1ib2FyZC1zaXplKSsyNXB4KTtcXHJcXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XFxyXFxuXFxyXFxufVxcclxcbi5zZXR1cC1zaGlwcy1oZWFkZXIgcCB7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgZm9udC1zaXplOiAwLjhyZW07XFxyXFxufVxcclxcbi5zZXR1cC1zaGlwLXNoaXBsaXN0IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OmNlbnRlcjtcXHJcXG59XFxyXFxuLnNldHVwLXNoaXB7XFxyXFxuICAgIGhlaWdodDogNDBweDtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICBkaXNwbGF5OmZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uc2V0dXAtc2hpcCBwe1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xcclxcbn1cXHJcXG5cXHJcXG4uc2V0dXAtc2hpcC1ib3h7XFxyXFxuICAgIGN1cnNvcjpncmFiO1xcclxcbiAgICBkaXNwbGF5OmlubGluZS1mbGV4O1xcclxcbiAgICBnYXA6MnB4O1xcclxcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICAgIHotaW5kZXg6MjA7XFxyXFxufVxcclxcbi5zZXR1cC1zaGlwLXZlcnRpY2Fse1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbn1cXHJcXG4uc2V0dXAtc2hpcC1oaWRlIGRpdntcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwwKTtcXHJcXG4gICAgb3BhY2l0eTogMC41O1xcclxcbn1cXHJcXG4uc2V0dXAtc2hpcC1kcm9wcGVke1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIGxlZnQ6IC0xcHg7XFxyXFxuICAgIHRvcDogLTFweDtcXHJcXG59XFxyXFxuXFxyXFxuLmdob3N0LXNoaXB7XFxyXFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgei1pbmRleDogMjAwO1xcclxcbiAgICBvcGFjaXR5OiAwLjg7XFxyXFxufVxcclxcbi5naG9zdC1zaGlwPiAuc2V0dXAtc2hpcC1jZWxse1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jZWxsLWhvdmVyLWNvbG9yKTtcXHJcXG59XFxyXFxuXFxyXFxuLnNldHVwLXNoaXAtY2VsbCB7XFxyXFxuICAgIHdpZHRoOiB2YXIoLS1jZWxsLXNpemUpO1xcclxcbiAgICBoZWlnaHQ6dmFyKC0tY2VsbC1zaXplKTtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2VsbC1ob3Zlci1jb2xvcik7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNlbGwtYm9yZGVyLWNvbG9yKTtcXHJcXG59XFxyXFxuXFxyXFxuLnNldHVwLXNoaXBzLW9wdGlvbnN7XFxyXFxuICAgIGRpc3BsYXk6ZmxleDtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uc3RhcnQtZ2FtZS1idXR0b24sXFxyXFxuLnNldHVwLWJ1dHRvbi1yYW5kb20ge1xcclxcbiAgICB3aWR0aDogMTIwcHg7XFxyXFxuICAgIGhlaWdodDozNnB4O1xcclxcbn1cXHJcXG4uc3RhcnQtZ2FtZS1idXR0b257XFxyXFxuICAgIGZvbnQtd2VpZ2h0OjYwMDtcXHJcXG4gICAgZm9udC1zaXplOjFyZW07XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0taGl0LWNvbG9yKTtcXHJcXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMXMgZWFzZTtcXHJcXG59XFxyXFxuLnN0YXJ0LWdhbWUtYnV0dG9uLWRpc2FibGVke1xcclxcbiAgICBvcGFjaXR5OiAwLjU7XFxyXFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xcclxcbn1cXHJcXG5AbWVkaWEoaG92ZXI6IGhvdmVyKXtcXHJcXG4gICAgLnNldHVwLWJ1dHRvbi1zdGFydDpob3ZlcntcXHJcXG4gICAgICAgIHRyYW5zZm9ybTpzY2FsZSgxLjEpO1xcclxcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjpyZ2IoMjI2LDExNiwxMTYpO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbi8qIHBsYXllciBzZWN0aW9ucyAqL1xcclxcblxcclxcbi5ib2FyZC1jb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG59XFxyXFxuXFxyXFxuLyogcGxheWVyIGJvYXJkICovXFxyXFxuLmJvYXJke1xcclxcbiAgICBkaXNwbGF5OmdyaWQ7XFxyXFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLDFmcik7XFxyXFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLDFmcik7XFxyXFxuICAgIGdhcDoycHg7XFxyXFxufVxcclxcblxcclxcbi5jZWxsIHtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICBjdXJzb3I6IGNyb3NzaGFpcjtcXHJcXG4gICAgaGVpZ2h0OnZhcigtLWNlbGwtc2l6ZSk7XFxyXFxuICAgIHdpZHRoOiB2YXIoLS1jZWxsLXNpemUpO1xcclxcbiAgICBkaXNwbGF5OmZsZXg7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBhbGlnbi1jb250ZW50OmNlbnRlcjtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2VsbC1jb2xvcik7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNlbGwtYm9yZGVyLWNvbG9yKTtcXHJcXG59XFxyXFxuXFxyXFxuLmNlbGwtc2V0dXB7XFxyXFxuICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xcclxcbn1cXHJcXG4uY2VsbC1kcmFnLW92ZXJ7XFxyXFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xcclxcbiAgICB6LWluZGV4OjQwO1xcclxcbn1cXHJcXG5cXHJcXG4uY2VsbC1kcmFnLXZhbGlke1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLW1pc3MtY29sb3IpO1xcclxcbn1cXHJcXG4uY2VsbC1kcmFnLWludmFsaWR7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0taGl0LWNvbG9yKTtcXHJcXG59XFxyXFxuXFxyXFxuQG1lZGlhKGhvdmVyOiBob3Zlcil7XFxyXFxuICAgIC5jZWxsOm5vdChbZGF0YS1wbGF5ZXI9JzEnXSk6bm90KC5jZWxsLWhpdCk6bm90KC5jZWxsLW1pc3MpOmhvdmVye1xcclxcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1jZWxsLWhvdmVyLWNvbG9yKTtcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG4uY2VsbC1zaGlwe1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLXNoaXAtY29sb3IpO1xcclxcbn1cXHJcXG5cXHJcXG4uY2VsbC1oaXR7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6dmFyKC0taGl0LWNvbG9yKTtcXHJcXG59XFxyXFxuLmNlbGwtaGl0OjphZnRlcntcXHJcXG4gICAgY29udGVudDonWCc7XFxyXFxuICAgIG9wYWNpdHk6MC44O1xcclxcbiAgICBmb250LXNpemU6IDEuM3JlbTtcXHJcXG4gICAgcGFkZGluZy1ib3R0b206IDFweDtcXHJcXG59XFxyXFxuLmNlbGwtbWlzc3tcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1taXNzLWNvbG9yKTtcXHJcXG59XFxyXFxuXFxyXFxuLmNlbGwtbWlzczo6YWZ0ZXJ7XFxyXFxuICAgIGNvbnRlbnQ6XFxcIk9cXFwiO1xcclxcbiAgICBvcGFjaXR5OjAuNjtcXHJcXG4gICAgcGFkZGluZy1ib3R0b206IDRweDtcXHJcXG59XFxyXFxuXFxyXFxuLmNlbGwtc3Vua3tcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc3Vuay1jb2xvcik7XFxyXFxuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBmb290ZXIgKi9cXHJcXG5mb290ZXJ7XFxyXFxuICAgIGRpc3BsYXk6ZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIHRleHQtYWxpZ246Y2VudGVyO1xcclxcbiAgICBnYXA6MTZweDtcXHJcXG4gICAgcGFkZGluZzowIDMycHg7XFxyXFxufVxcclxcblxcclxcbiNmb290ZXItbGlua3tcXHJcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcbn1cXHJcXG5mb290ZXIgcHtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXHJcXG4gICAgZm9udC1zaXplOiAxLjFyZW07XFxyXFxufVxcclxcbmZvb3RlciBpe1xcclxcbiAgICBjb2xvcjp2YXIoLS10ZXh0LWNvbG9yLW1haW4pO1xcclxcbn1cXHJcXG5AbWVkaWEoaG92ZXI6IGhvdmVyKXtcXHJcXG4gICAgI2Zvb3Rlci1saW5rOmhvdmVye1xcclxcbiAgICAgICAgY3Vyc29yOnBvaW50ZXI7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XFxyXFxuICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4xcyBlYXNlO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbi8qIFZpY3RvcnkgQ29udGFpbmVyICovXFxyXFxuLnZpY3RvcnktY29udGFpbmVye1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIGxlZnQ6IDUwJTtcXHJcXG4gICAgdG9wOiA1MCU7XFxyXFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcclxcbiAgICB3aWR0aDogMzE4cHg7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gICAgcGFkZGluZzogMjBweDtcXHJcXG4gICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tdGV4dC1jb2xvci1tYWluKTtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1jb2xvci10cmFuc3BhcmVudCk7XFxyXFxuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xcclxcbn1cXHJcXG4udmljdG9yeS1jb250YWluZXIgaDIge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHRleHQtc2hhZG93OiAwIDAgMnB4IGJsYWNrLCAwIDAgNHB4IGJsYWNrLCAwIDAgNnB4IGJsYWNrO1xcclxcbn1cXHJcXG5cXHJcXG4udmljdG9yeS1jb250YWluZXIgcCB7XFxyXFxuICAgIG1hcmdpbjogNnB4O1xcclxcbn1cXHJcXG5cXHJcXG4udmljdG9yeS12aWN0b3J5IHtcXHJcXG4gICAgY29sb3I6IHZhcigtLW1pc3MtY29sb3IpO1xcclxcbn1cXHJcXG5cXHJcXG4udmljdG9yeS1kZWZlYXQge1xcclxcbiAgICBjb2xvcjogdmFyKC0tc3Vuay1jb2xvcik7XFxyXFxufVxcclxcblxcclxcblxcclxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDgwMHB4KSB7XFxyXFxuICAgIDpyb290IHtcXHJcXG4gICAgICAgIC0taGVhZGVyLWhlaWdodDogODBweDtcXHJcXG4gICAgICAgIC0tYm9hcmQtc2l6ZTogMjc4cHg7XFxyXFxuICAgICAgICAtLWNlbGwtc2l6ZTogMjZweDtcXHJcXG4gICAgfVxcclxcbiAgICBoZWFkZXJ7XFxyXFxuICAgICAgICB3aWR0aDo0MDBweDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICBoZWFkZXIgYnV0dG9uIHtcXHJcXG4gICAgICAgIGhlaWdodDogMjhweDtcXHJcXG4gICAgICAgIHdpZHRoOiAxMDBweDtcXHJcXG4gICAgICAgIGZvbnQtc2l6ZTogMC45cmVtO1xcclxcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDJweDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAjZ2FtZS1jb250YWluZXIge1xcclxcbiAgICAgICAgZ2FwOiAyMHB4O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5zdGFydC1nYW1lLWJ1dHRvbixcXHJcXG4gICAgLnNldHVwLWJ1dHRvbi1yYW5kb20ge1xcclxcbiAgICAgICAgd2lkdGg6IDEwMHB4O1xcclxcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5zZXR1cC1idXR0b24tc3RhcnQge1xcclxcbiAgICAgICAgZm9udC1zaXplOiAwLjlyZW07XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi9zdHlsZS5jc3MnXHJcbmltcG9ydCAnLi9tb2R1bGVzL0RPTS9Db250cm9sbGVyJ1xyXG5cclxuIl0sIm5hbWVzIjpbIkdhbWUiLCJjcmVhdGVIZWFkZXIiLCJjcmVhdGVGb290ZXIiLCJzZXR1cCIsImFwcCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiYm9keSIsImFwcGVuZENoaWxkIiwiaGVhZGVyIiwiZm9vdGVyIiwiZ2FtZUNvbnRhaW5lciIsIm5ld0dhbWVCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5ld0dhbWUiLCJnYW1lIiwic3RhcnRHYW1lIiwicGxheWVyMSIsInBsYXllcjIiLCJkcmF3R2FtZSIsIm5ld1BsYXllcjEiLCJDcmVhdGVQbGF5ZXIiLCJuZXdQbGF5ZXIyIiwiZ2FtZWJvYXJkIiwicGxhY2VTaGlwc1JhbmRvbWx5IiwiZHJhd1NldHVwIiwic3RhcnRHYW1lQnV0dG9uIiwiZXZlbnQiLCJwbGFjZWRTaGlwcyIsImxlbmd0aCIsImNsZWFyQ29udGFpbmVyIiwiY29udGFpbmVyIiwiZmlyc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwicGxheWVyMUJvYXJkQ29udGFpbmVyIiwiZHJhd0JvYXJkQ29udGFpbmVyIiwicGxheWVyMkJvYXJkQ29udGFpbmVyIiwicG9wdWxhdGVCb2FyZCIsImFwcGVuZCIsInBsYXllciIsInNldHVwQm9hcmQiLCJkcmF3U2V0dXBCb2FyZCIsInNldHVwU2hpcHMiLCJkcmF3U2V0dXBTaGlwcyIsInNoaXBzIiwicXVlcnlTZWxlY3RvckFsbCIsImdhbWVTaXplT2JzZXJ2ZXIiLCJSZXNpemVPYnNlcnZlciIsImVudHJ5IiwiY29udGVudFJlY3QiLCJoZWlnaHQiLCJzdHlsZSIsIndpZHRoIiwib2JzZXJ2ZSIsImJvYXJkQ29udGFpbmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwicGxheWVyTmFtZSIsImlzQUkiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJwbGF5ZXJCb2FyZCIsImRyYXdCb2FyZCIsImJvYXJkIiwicm93IiwiY29sIiwiY2VsbCIsImRhdGFzZXQiLCJudW1iZXIiLCJsaXN0ZW5Gb3JBdHRhY2siLCJzcXVhcmUiLCJyZW1vdmUiLCJ0YXJnZXQiLCJkZWZlbmRpbmdQbGF5ZXJOdW1iZXIiLCJhdHRhY2tpbmdQbGF5ZXJOdW1iZXIiLCJhdHRhY2tpbmdQbGF5ZXIiLCJkZWZlbmRpbmdQbGF5ZXIiLCJjdXJyZW50UGxheWVyIiwicmVzdWx0IiwibG9jYXRpb24iLCJzaGlwIiwiYXR0YWNrIiwic3R5bGVBdHRhY2tlZENlbGwiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibmV4dFR1cm4iLCJjYWxsQUlBdHRhY2siLCJBSSIsImlzU3VuayIsInNxdWFyZXMiLCJmb3JFYWNoIiwid2lubmVyIiwiY2hlY2tHYW1lT3ZlciIsImVuZEdhbWUiLCJzd2l0Y2hUdXJuIiwiY2VsbHMiLCJkcmF3VmljdG9yeUNvbnRhaW5lciIsImxvc2VyIiwidmljdG9yeUNvbnRhaW5lciIsInZpY3RvcnlUaXRsZSIsIndpbm5lclRleHQiLCJsb3NlclRleHQiLCJmb290ZXJCb3giLCJhdXRob3JOYW1lIiwiZm9vdGVyTGluayIsInNldEF0dHJpYnV0ZSIsImdpdGh1YkxvZ28iLCJnZXRUaGVtZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJ0b2dnbGVEYXJrVGhlbWUiLCJ0b2dnbGUiLCJkYXJrTW9kZUJ1dHRvbiIsInRvZ2dsZURhcmtTdG9yYWdlIiwic2V0SXRlbSIsImNoZWNrRGFya01vZGUiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInRpdGxlIiwic2hpcFR5cGVzIiwiZHJhZ0RhdGEiLCJzaGlwT2JqZWN0Iiwic2hpcEVsZW1lbnQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsInJvd0RpZmYiLCJjb2xEaWZmIiwic2hpcEhvbWVDb250YWluZXIiLCJwcmV2Q29udGFpbmVyIiwicHJldkNlbGwiLCJjdXJyZW50Q2VsbCIsInNldHVwUGxheWVyIiwic2V0dXBDZWxscyIsImRyYWdPdmVyIiwiZHJhZ0VudGVyIiwiZHJhZ0xlYXZlIiwiZHJvcCIsImRyYWdTdGFydCIsInR5cGUiLCJwYXJlbnRFbGVtZW50IiwiY29uc29sZSIsImxvZyIsInVwZGF0ZUNlbGxEaWZmIiwiYWxpZ25tZW50Iiwic2V0VGltZW91dCIsImNvbnRhaW5zIiwicGFyc2VJbnQiLCJyZW1vdmVTaGlwIiwiZHJhZ0VuZCIsInByZXZlbnREZWZhdWx0IiwidG91Y2hDZWxsIiwic2hpcFNxdWFyZXMiLCJjaGVja1BsYWNlbWVudCIsImZpbHRlciIsImNoZWNrU3F1YXJlIiwidW5kZWZpbmVkIiwiY2VsbE92ZXJsYXkiLCJpc1ZhbGlkIiwibGVmdENlbGxzIiwib3JpZ2luQ2VsbCIsInBsYWNlU2hpcCIsInByZXZSb3ciLCJwcmV2Q29sIiwicHJldmlvdXNDb250YWluZXIiLCJzZXR1cFNoaXBDb250YWluZXIiLCJzZXR1cFNoaXBIZWFkZXIiLCJzZXR1cFNoaXBUaXRsZSIsInNldHVwU2hpcEluZm8iLCJzZXR1cFNoaXBPcHRpb25zIiwicmFuZG9tU2hpcHMiLCJyYW5kb21pemVGbGVldCIsInNoaXBMaXN0IiwiZHJhd1NoaXAiLCJzaGlwQ29udGFpbmVyIiwic2hpcEJveCIsImkiLCJzaGlwQ2VsbCIsImRyYWdnYWJsZSIsInJvdGF0ZVNoaXAiLCJ4IiwidG91Y2hlcyIsImNsaWVudFgiLCJ5IiwiY2xpZW50WSIsImVsZW1lbnRzIiwiZWxlbWVudHNGcm9tUG9pbnQiLCJlbGVtZW50IiwicHJldkJveCIsIm5ld0JveCIsImNsb25lTm9kZSIsInRvdWNoTG9jYXRpb24iLCJ0YXJnZXRUb3VjaGVzIiwibGVmdCIsInBhZ2VYIiwidG9wIiwicGFnZVkiLCJjaGFuZ2VkVG91Y2hlcyIsImRhdGUiLCJEYXRlIiwidGltZSIsImdldFRpbWUiLCJ0YXBJbnRlcnZhbCIsImxhc3RDaGlsZCIsImxhc3RDbGljayIsInNoaXBOYW1lIiwib3JpZ2luIiwiYmNyIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2VsbFNpemUiLCJvZmZzZXRXaWR0aCIsIk1hdGgiLCJmbG9vciIsInNoaXBMZW5ndGgiLCJvcmlnaW5Sb3ciLCJwcmFzZUludCIsIm9yaWdpbkNvbCIsIm9yaWdpbkFsaWdubWVudCIsIm5ld0FsaWdubWVudCIsImF0dGVtcHRzIiwibmV3T3JpZ2luQ2VsbCIsImRhdGFTZXQiLCJTaGlwIiwiR2FtZWJvYXJkIiwiY3JlYXRlQm9hcmQiLCJib2FyZEFycmF5Iiwicm93QXJyYXkiLCJjbGVhckJvYXJkIiwic2hpcFR5cGUiLCJwdXNoIiwidmFsaWRQbGFjZW1lbnQiLCJldmVyeSIsImNsZWFyRmxlZXQiLCJmbGVldCIsInBvcCIsInNoaXBzSW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwicGxhY2VTaGlwUmFuZG9tbHkiLCJyYW5kb21BbGlnbm1lbnQiLCJyYW5kb20iLCJnZXRSYW5kb21TcXVhcmUiLCJyb3dEaWYiLCJjb2xEaWYiLCJyZWNlaXZlSGl0IiwiYXR0YWNrZWRTaGlwIiwiaGl0IiwiY2hlY2tBbGxTaGlwc1N1bmsiLCJlbmVteUxvZ2ljIiwiYXZhaWxhYmxlQXR0YWNrcyIsImNyZWF0ZUF0dGFja0FycmF5IiwibGFzdFNoaXAiLCJsYXN0SGl0QXJyYXkiLCJEaXJlY3Rpb25zIiwiY29uY3VycmVudE1pc3NlcyIsImVuZW15IiwiY2hlY2tJZlNoaXBJc1N1bmsiLCJlbmVteUJvYXJkIiwiYXR0YWNrQ29vcmRzIiwiZ2V0UmFuZG9tQ2VsbCIsImxhc3RIaXQiLCJhZGphY2VudENlbGxzIiwiZ2V0QWxsQWRqYWNlbnRDZWxscyIsImFkamFjZW50SGl0cyIsImNlbGxSZXN1bHQiLCJhZGphY2VudENlbGwiLCJyYW5kb21BZGphY2VudEhpdCIsIm5leHRDZWxsIiwiZ2V0TmV4dEF0dGFja2FibGVDZWxsIiwiZmxpcERpcmVjdGlvbiIsImRpcmVjdGlvbiIsImdldEFkamFjZW5jeSIsImFkamFjZW50Q2VsbFRvQXR0YWNrIiwiYXJyYXlSb3ciLCJhcnJheUNvbCIsInJlbW92ZUNlbGxGcm9tQXZhaWxhYmxlQXR0YWNrcyIsIm1hcCIsImdldEFkamFjZW50Q2VsbCIsIm5laWdoYm91ckNlbGwiLCJvcHBvc2l0ZURpcmVjdGlvbiIsImRpc3RhbmNlIiwiZGlmZiIsImFicyIsIm5leHRDZWxsU3RhdHVzIiwiZW5lbXlTaGlwIiwiaGl0U2hpcCIsInNvbWUiLCJpbmRleCIsImZpbmRJbmRleCIsImF0dGFja0FycmF5IiwiUGxheWVyIiwicGxheWVyTnVtIiwiY2FycmllciIsImJhdHRsZXNoaXAiLCJkZXN0cm95ZXIiLCJzdWJtYXJpbmUiLCJwYXRyb2wiLCJoaXRzIl0sInNvdXJjZVJvb3QiOiIifQ==