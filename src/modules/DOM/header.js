function createHeader(){
    header.id = 'header';
    const title = createElement('title');
    title.textContent = 'Battleships';
    const newGameButton = createElement('button');
    newGameButton.classlist.add('new-game-button');
    newGameButton.textContent = 'New Game';
    header.appendChild(title);
    header.appendChild(newGameButton);
    return header;
}
export default createHeader;