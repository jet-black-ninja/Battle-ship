import Gameboard  from "./board";
import enemyLogic from './enemyLogic'

function Player(playerName, playerNum){
    let name = typeof playerName === 'string' ? playerName : 'bot';
    const number = playerNum;
    const isAI = typeof playerName === 'string' ? false : true;
    const gameboard = Gameboard();
    const enemy = enemyLogic();
    function attack(target, row , col){;
        if(this.isAI){
            if(this.enemy.availableAttacks.length === 0) 
                return "cannot attack further";
            [row,col]= this.enemy.attack(target);
        }
        //get the result of the attack
        const result = target.gameboard.receiveHit(row,col);
        if(this.isAI){
            if(result[0] === 'hit'){
                this.enemy.lastHitArray.push(result[1]);
                this.enemy.concurrentMisses = 0;
            }
            if(result[0] === 'miss') this.enemy.concurrentMisses++;
            if(result[2] !== 'null') this.enemy.lastShip  = result[2];
            this.enemy.makeCellUnavailable(result[1]);
        }
        return result;
    }
    return{
        name,
        number,
        isAI,
        gameboard,
        enemy,
        attack
    } 
}

export default Player;
