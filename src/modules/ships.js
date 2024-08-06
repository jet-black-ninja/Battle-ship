import shipTypes from "./shipTypes"
function Ship(shipType){
    const type = shipType;
    const length = shipType[shipType].length;
    let hits = 0;
    let square; 
    let alignment ;
    function hit(){
        this.hits++;
    }
    function isSunk(){
        if(this.hits >= this.length) return true;
        else return false;
    }
    return {
        type ,
        length,
        hits, 
        squares,
        hit, 
        isSunk
    }
}
export default Ship;