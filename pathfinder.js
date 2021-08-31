const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');

class Node {
    /*  constructs a node at gridspace (row, col)
        Attributes:
            row (int) - row coordinate in a (row, col) grid
            col (int) - column coordinate in a (row, col) grid
            boxSize (int) - the width (px) of the node
            gridEdge (int) - the last row coordinate in the grid
            x (int) - the x-coordinate of the top left corner of the node on the canvas
            y (int) - the y-coordinate of the top left corner of the node on the canvas
            color (str) - the fill color of the node when draw (or re-drawn)
            neighbors (array) - an array of nodes that share edges with this node
    */
    constructor(row, col, boxSize, gridEdge){
        this.row = row;
        this.col = col;
        this.boxSize = boxSize;
        this.gridEdge = gridEdge;
        this.x = col*boxSize;
        this.y = row*boxSize;
        this.color = 'white';
        this.neigbors = [];
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.rect(this.x, this.y, this.boxSize, this.boxSize);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    
    findNeighbors(grid){
        if (grid[this.row+1][this.col].closed == false){
            this.neigbors.push(grid[this.row+1][this.col]);
        }
    }

}

function createNodes(boxes){ 
    // creates a 2D array (boxes x boxes) of Node objects 

    let grid = new Array(boxes);

    for (let i = 0; i < boxes; i++){
        grid[i] = new Array(boxes);
        for (let j = 0; j < boxes; j++){
            grid[i][j] = new Node(i, j);
        }
    }
    return grid;
}

function drawGrid(boxes, size){
    canvas.width = size+'px';
    canvas.height = size+'px';

    const boxSize = size / boxes;
    


}

function main(){
    drawGrid(20, 800);
    createNodes(20);
}