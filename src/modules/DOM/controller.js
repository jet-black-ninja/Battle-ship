import Game from '../game';
import createHeader from './header';
import createFooter from './footer';
import setup from './shipPlacer';

const app = document.createElement('div');
app.id = 'app';
document.body.appendChild(app);
const header = createHeader();
const footer = createFooter();
const gameContainer = document.createElement('div');
gameContainer.id = 'game-container';
app.appendChild(header);
app.appendChild(gameContainer);
app.appendChild(footer);

const newGameButton = header.querySelector('.new-game-button');
newGameButton.addEventListener('click',newGame);
const game = Game();
newGame();

function startGame(player1, player2){
    game.newGame(player1, player2);
    drawGame();
}

function newGame(){
    const newPlayer1 = game.CreatePlayer('John', 1);
    const newPlayer2 = game.CreatePlayer(false, 2);
    newPlayer2.gameboard.placeShipsRandomly();
    drawSetup(newPlayer1);
    const startGameButton = document.querySelector('.setup-button-start');
    startGameButton.addEventListener('click', function (event){
        if(newPlayer1.gameboard.placedShips.length === 5){
            startGame(newPlayer1, newPlayer2);
        }
    });
}

function clearContainer(container){
    while(container.firstChild) container.removeChild(container.firstChild);
}
function drawGame(){
    clearContainer(gameContainer);
    const player1BoardContainer = drawBoardContainer(game.player1);
    const player2BoardContainer = drawBoardContainer(game.player2);
    populateBoard(game.player1, player1BoardContainer.querySelector('.board'));
    gameContainer.append(player1BoardContainer, player2BoardContainer);
}

function drawSetup(player){
    clearContainer(gameContainer);
    const setupBoard = setup.drawSetupBoard(player, drawBoardContainer(player));
    const setupShips = setup.drawSetupShips();
    const ships = setupShips.querySelectorAll('.setup-ship-box');
    gameContainer.append(setupBoard, setupShips);
}

// If the game container height if over 500px, we can see the flexbox is wrapped
// We then adjust the header to match the width of the game boards - instead of being 100% wide
const gameSizeObserver = new ResizeObserver(entry => {
    if(entry[0].contentRect.height>500) 
        header.style.width = '320px';
    else 
        header.style.width = `${entry[0].contentRect.width}px`;
})
gameSizeObserver.observe(gameContainer);

//hold the information of the player's board - name , board and ships left

function drawBoardContainer(player){
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');
    const playerName = document.createElement('h3');
    if(player.isAI) playerName.textContent = `${player.name}'s fleet`;
    else playerName.textContent = `Your Fleet`;
    const playerBoard = drawBoard(player);
    boardContainer.append(playerName, playerBoard);
    return boardContainer;
}

function drawBoard(player){
    const board = document.createElement('div');
    board.classList.add('board');
    for(let row = 0; row < 10 ; row++){
        for(let col = 0 ; col < 10 ; col++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.player = player ? player.number: 0;
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
            if(player.isAI && player) cell.addEventListener('click', listenForAttack, false);
        }
    }
    return board;
}

function populateBoard(player,board){
    for(let row = 0 ; row < 10 ; row++){
        for(let col = 0 ; col < 10 ; col++){
            const square = player.gameboard.board[row][col];
            const cell = board.querySelector(`[data-row="${row}"][data-col="${col}]`);
            if(square!== null && typeof square === 'object')
                cell.classList.add('cell-ship');
            else
                cell.classList.remove('cell-ship');
        }   
    }
}

// upon clicking a cell , attack the relevant square , if allowed 
// pass the information from the attack to the style attacked cell function  

function listenForAttack(event){
    const cell = event.target;
    const defendingPlayerNumber =cell.dataset.player;
    const attackingPlayerNumber = defendingPlayerNumber === '1'? '2': '1';
    const attackingPlayer = game[`player${attackingPlayerNumber}`];
    const defendingPlayer = game[`player${defendingPlayerNumber}`];
    if(game.currentPlayer !== attackingPlayer) return;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const [result, location , ship] = attackingPlayer.attack(defendingPlayer, row, col);
    styleAttackedCell(cell, defendingPlayerNumber, result , ship);
    cell.removeEventListener('click' , listenForAttack, false);
    nextTurn();
}

function callAIAttack(AI){
if(AI !== game.currentPlayer)return ;
const defendingPlayerNumber = game.defendingPlayer=== game.player1 ?'1':'2';
const [result , location , ship]= AI.attack(game.defendingPlayer);
const cell = document.querySelector(`[data-player='${defendingPlayerNumber}][data-row='${location[0]}'][data-col='${location[1]}']`)
styleAttackedCell(cell, defendingPlayerNumber, result, ship);
nextTurn();
}

//Style attacked cell based on if it was hit or miss 
//If the ship is sunk , style each of the ship cells with the .cell-sunk class
function styleAttackedCell(cell, defendingPlayerNumber, result , ship) {
    if(result === 'hit'){
        cell.classList.add('cell-hit');
        if(ship.isSunk()){
            ship.squares.forEach(square => {
                const cell = document.querySelector(`[data-player='${defendingPlayerNumber}'][data-row='${square[0]}'}][data-col='${square[1]}']`)
                cell.classList.add('cell-sunk')
            })
        }
    }
    if(result==='miss') cell.classList.add('cell-miss');
}

// Handle next turn 
function nextTurn() {
    const winner = game.checkGameOver();
    if(winner){
        return endGame(winner);
    }
    game.switchTurn();
    if(game.currentPlayer.isAI){
        callAIAttack(game.currentPlayer);
    }
}

function endGame(winner){
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.removeEventListener('click', listenForAttack, false));
    gameContainer.appendChild(drawVictoryContainer(winner));
}

//draw a popup window with the winners name

function drawVictoryContainer(winner){
    const loser = game.checkGameOver () === game.player1 ? game.player2 : game.player1;
    const victoryContainer = document.createElement('div');
    victoryContainer.classList.add('victory-container');
    const victoryTitle = document.createElement('h2');
    const winnerText= document.createElement('p');
    const loserText =document.createElement('p');
    if(winner.isAI){
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
