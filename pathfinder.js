const container = document.querySelector('div.container');

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
    node.setAttribute('f', 'Infinity');
    node.setAttribute('g', 'Infinity');
    node.addEventListener('mousedown', setNodeState, {once: true});
    node.addEventListener('mouseover', (e) => {
        if (e.shiftKey && e.target.getAttribute('state') == 'empty') {
            e.target.setAttribute('state', 'wall');
            e.target.style.backgroundColor = 'black';
        }
    })
    return node;
}

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

function getStart(){
    // returns the starting node or null if none selected
    return document.querySelector('div[state=start]') || null;
}

function getEnd(){
    // returns the ending node or null if none selected
    return document.querySelector('div[state=end]') || null;
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

function getScores(node){
    // returns the f, g, and h scores of a given node
    score = {}
    score.g = Number(node.getAttribute('g'));
    score.h = Number(node.getAttribute('h'));
    score.f = Number(node.getAttribute('f'));
    return score;
}

function setScores(g, node, end){
    // takes the g score, end node and current node and calculates + sets the current node's new f, g and h scores
    node.setAttribute('g', g);
    node.setAttribute('h', findDistance(getCoordinates(node), getCoordinates(end)));
    node.setAttribute('f', Number(node.getAttribute('g')) + Number(node.getAttribute('h')));
}

function openNode(node){
    // changes the node to open 
    node.setAttribute('state', 'open');
    node.style.backgroundColor = 'teal';
}

function closeNode(node){
    // changes the node to closed
    node.setAttribute('state', 'closed');
    node.style.backgroundColor = 'silver';
}

function assignParent(parent, child){
    // assigns the node position of the parent node to the child's parent attributes
    pos = getPosition(parent);
    child.setAttribute(`parentRow`,`${pos.row}`);
    child.setAttribute(`parentCol`,`${pos.col}`);
}

function getParent(child){
    // returns the parent node of the given child node
    row = child.getAttribute('parentRow');
    col = child.getAttribute('parentCol');
    return getNode(row, col);
}

function createPath(node){
    // changes the node to part of shortest path
    node.setAttribute('state', 'path');
    node.style.backgroundColor = 'purple';
}

function drawPath(current){
    // draws the path from end to start following child to parent nodes
    while(getParent(current)){
        createPath(current);
        current = getParent(current);
    }
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

    function checkNodeValidity(node){
        if (node.getAttribute('state') == 'wall' || node.getAttribute('state') == 'closed') {
            return false;
        }
        else return true;
    }

    if (position.row < position.limit - 1){
        tempNode = getNode(position.row + 1, position.col);
        if (checkNodeValidity(tempNode)) neighbors.push(tempNode);
    }
    if (position.row > 0){
        tempNode = getNode(position.row - 1, position.col);
        if (checkNodeValidity(tempNode)) neighbors.push(tempNode);
    }
    if (position.col < position.limit - 1){
        tempNode = getNode(position.row, position.col + 1);
        if (checkNodeValidity(tempNode)) neighbors.push(tempNode);
    }   
    if (position.col > 0){
        tempNode = getNode(position.row, position.col - 1);
        if (checkNodeValidity(tempNode)) neighbors.push(tempNode);
    }
    return neighbors;
}

async function findPath(start, end){
    // implementation of A* search algorithm
    let steps = 0;
    let openQueue = new PriorityQueue();
    let openSet = new Set();

    openQueue.enqueue(start, 0, steps);
    openSet.add(start);

    setScores(0, start, end);

    // while there are remaining possible nodes to explore, continue algorith,
    while (!openQueue.empty()){
        await sleep(100); // slows loop for better visualization
        let currentNode = openQueue.dequeue().value;
        openSet.delete(currentNode);

        // destination reached
        if (currentNode == end) {
            drawPath(end);
            return;
        }
        
        // closes node now that it's been visited
        if (currentNode != start){
            closeNode(currentNode);
        }

        let currentScores = getScores(currentNode, end);

        let neighbors = findNeighbors(currentNode);

        //updates scores for neighbors and places neighbors in priority queue if not already present
        neighbors.forEach(neighbor => {
            let tempG = currentScores.g + 1;
            let neighborScores = getScores(neighbor);
            if (tempG < neighborScores.g){
                assignParent(currentNode, neighbor);
                setScores(tempG, neighbor, end);
                neighborScores = getScores(neighbor);
                if (!openSet.has(neighbor)){
                    steps++;
                    openQueue.enqueue(neighbor, neighborScores.f, steps);
                    openSet.add(neighbor);
                    openNode(neighbor);
                }
            }
        });


    }
}

const sleep = (milliseconds) => {
    // delay function
    return new Promise(resolve => setTimeout(resolve, milliseconds));
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

function run(){
    // executes the algorithm when run button pressed
    start = getStart();
    end = getEnd();
    if (!start){
        window.alert('Error: Please add a starting node.');
        return;
    }
    else if (!end) {
        window.alert('Error: Please add an ending node.');
        return;
    }
    else findPath(start, end);
}

function main(){
    createGrid(40);
}

main();