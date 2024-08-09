import Player from "./player";

function Game(){
    let player1;
    let player2;
    let currentPlayer;
    let defendingPlayer;

    function CreatePlayer(name, number){
        return Player(name, number);
    }

    function newGame(player1, player2){
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer  = this.player1;
        this.defendingPlayer = this.player2;
    }

    function switchTurn(){
        this.currentPlayer = this.currentPlayer === this.player1 
            ? this.player2  
            : this.player1;
        this.defendingPlayer = this.defendingPlayer === this.player2 
            ? this.player1 
            : this.player2;
    }
    function checkGameOver(){
        if(this.player1.gameboard.checkAllShipsSunk()) 
            return this.player2;
        else if(this.player2.gameboard.checkAllShipsSunk()) 
            return this.player1;
        else 
            return false ;
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
    }
}
export default Game;