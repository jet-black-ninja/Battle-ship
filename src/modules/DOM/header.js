function createHeader(){
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
export default createHeader;