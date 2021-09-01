class Node {
    // constructs a node with a value given certain priority
    constructor(value, priority, tiebreaker){
        this.value = value;
        this.priority = priority;
        this.tiebreaker = tiebreaker;
    }
}

class PriorityQueue {
    // constructs a priority queue data structure using an array
    constructor() {
        this.heap = [null];
    }

    enqueue(value, priority, tiebreaker){
        // pushes new value to heap and bubbles up by priority
        let node = new Node(value, priority, tiebreaker);
        this.heap.push(node);
        let currentIndex = this.heap.length-1;
        let parentIndex = Math.floor(currentIndex/2);
        while (
            this.heap[parentIndex] && node.priority < this.heap[parentIndex].priority
        ){
            let parentNode = this.heap[parentIndex];
            this.heap[parentIndex] = node;
            this.heap[currentIndex] = parentNode;
            currentIndex = parentIndex;
            parentIndex = Math.floor(currentIndex/2);
        }
    }

    dequeue(){
        //pops value at top of the heap and re-sorts heap
        
        //edge case to remove element at the top of the heap when it is the only element
        if (this.heap.length < 3){
            let value = this.heap.pop();
            this.heap[0] = null;
            return value;
        }
        let forRemoval = this.heap[1];
        this.heap[1] = this.heap.pop();
        let currentIndex = 1;
        let [leftChild, rightChild] = [2*currentIndex, 2*currentIndex+1];
        let childIndex = null;

        // if priorities are equal, use tiebreaker to determine index
        if (this.heap[rightChild] && this.heap[rightChild].priority == this.heap[leftChild].priority){
            childIndex = this.heap[rightChild].tiebreaker < this.heap[leftChild].tiebreaker ? rightChild : leftChild;
        }

        else{
            childIndex = this.heap[rightChild] && this.heap[rightChild].priority < this.heap[leftChild].priority ? rightChild : leftChild;
        }
        while (
            this.heap[childIndex] && this.heap[currentIndex].priority >= this.heap[childIndex].priority
        ){
            let node = this.heap[currentIndex];
            let childNode = this.heap[childIndex];
            this.heap[childIndex] = node;
            this.heap[currentIndex] = childNode;
            currentIndex = childIndex;
            [leftChild, rightChild] = [2*currentIndex, 2*currentIndex+1];
            if (this.heap[rightChild] && this.heap[rightChild].priority == this.heap[leftChild].priority){
                childIndex = this.heap[rightChild].tiebreaker < this.heap[leftChild].tiebreaker ? rightChild : leftChild;
            }
            else{
                childIndex = this.heap[rightChild] && this.heap[rightChild].priority < this.heap[leftChild].priority ? rightChild : leftChild;
            }
        }
        return forRemoval;
    }

    empty(){
        // if the heap has no nodes return true
        if (this.heap.length == 1) return true;
        else return false;
    }
}