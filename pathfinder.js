const cols = 20
const rows = 20
//const nodeHeight = height / rows
//const nodeWidth = width / cols

class Node {
    /*  constructs a node at gridspace (row, col)
        each node calculates the f(n) from f(n) = g(n) + h(n) using A* search algorithm where:
            f is the estimated total cost of traversal through this node
            g is the known cost of traversal from the start to this node
            h is the estimated remaining cost from this node to the end
    */
    constructor(row, col){
        this.row = row;
        this.col = col;
        this.f 
        this.g 
        this.h 
    }
}

function drawGrid(){ 
    // creates a 2D array of Node objects
    let grid = new Array(rows);
    
    for (let i = 0; i < rows; i++){
        grid[i] = new Array(cols)
        for (let j = 0; j < cols; j++){
            grid[i][j] = new Node(i, j);
        }
    }
    return grid
}