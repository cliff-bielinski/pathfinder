class Node {
    // constructs a node with a value given certain priority
    constructor(value, priority){
        this.value = value;
        this.priority = priority;
    }
}

class PriorityQueue {
    // constructs a priority queue data structure using an array
    constructor() {
        this.heap = [];
    }

    enqueue(value, priority){
        let node = new Node(value, priority);
        this.heap.push(node);

    }
}