const container = document.querySelector('div.container');

function setNodeState(event){
    // checks whether a start and ending node have been created and if not creates one
    if (!document.querySelector('div[state=start]')){
        event.target.setAttribute('state', 'start');
        event.target.style.backgroundColor = 'blue';
    }
    else if (!document.querySelector('div[state=end]')){
        event.target.setAttribute('state', 'end');
        event.target.style.backgroundColor = 'gold';
    }
}

function createNode(row, col, boxes){
    /* 
        creates a new DOM element (node) for each grid space on the board with the following attributes:
        row, col - position on the board
        grid-limit - to help detect whether the node is adjacent to a board boundary
        state - whether the node is empty, the starting point, the ending point, or a wall
        eventlisteners to change the color of the node with user interaction 
    */
    let node = document.createElement('div');
    node.setAttribute('class', 'node');
    node.setAttribute('row', row);
    node.setAttribute('col', col);
    node.setAttribute('grid-limit', boxes);
    node.setAttribute('state', 'empty');
    node.addEventListener('mousedown', setNodeState, {once: true});
    node.addEventListener('mouseover', (e) => {
        if (e.shiftKey && e.target.getAttribute('state') == 'empty') {
            e.target.setAttribute('state', 'wall');
            e.target.style.backgroundColor = 'black';
        }
    })
    return node;
}

function createGrid(gridSize){ 
    // creates a CSS grid of gridSize by gridSize and creates nodes for each grid space
    for (let row = 0; row < gridSize; row++){
        for (let col = 0; col < gridSize; col++){
            node = createNode(row, col, gridSize);
            container.appendChild(node);
        }
    }
    container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
}

function getCoordinates(node){
    // returns the absolute position of the node in pixels as {x,y} coordinates
    let rect=node.getBoundingClientRect();
    return {x:rect.left, y:rect.top};
}

function getPosition(node){
    // returns the row, column of a given node and edge of grid as integers
    position = {};
    position.row = Number(node.getAttribute('row'));
    position.col = Number(node.getAttribute('col'));
    position.limit = Number(node.getAttribute('grid-limit'));
    return position;
}

function getNode(row, col){
    // returns a node at a given row, column
    return document.querySelector(`div[row="${row}"][col="${col}"]`);
}

function findDistance(pos1, pos2){
    // returns the distance between two nodes using Manhattan distance
    return Math.abs(pos1.x-pos2.x) + Math.abs(pos1.y-pos2.y);
}

function findNeighbors(node){
    // returns a list of neighboring nodes if the nodes are valid options for exploration

    let position = getPosition(node);
    let neighbors = [];
    let tempNode = null;

    if (position.row < position.limit - 1){
        tempNode = getNode(position.row + 1, position.col);
        if (tempNode.getAttribute('state') !== 'wall') neighbors.push(tempNode);
    }
    if (position.row > 0){
        tempNode = getNode(position.row - 1, position.col);
        if (tempNode.getAttribute('state') !== 'wall') neighbors.push(tempNode);
    }
    if (position.col < position.limit - 1){
        tempNode = getNode(position.row, position.col + 1);
        if (tempNode.getAttribute('state') !== 'wall') neighbors.push(tempNode);
    }   
    if (position.col > 0){
        tempNode = getNode(position.row, position.col - 1);
        if (tempNode.getAttribute('state') !== 'wall') neighbors.push(tempNode);
    }
    return neighbors;
}

function clearGrid(){
    // removes all child elements from the grid container
    while (container.firstChild){
        container.removeChild(container.firstChild);
    }
}

function reset(){
    // clears the grid and generates a new grid
    clearGrid();
    createGrid(40);
}

function main(){
    createGrid(40);
}

main();