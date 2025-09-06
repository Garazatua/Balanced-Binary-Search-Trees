function isFiniteNumber(value) {
  return Number.isFinite(value);
}

function sanitizeSAndDedupSorted(array) {
  let usefulArr = [];
  let prev = null;
  for (let i = 0; i < array.length; i++) {
    if (!isFiniteNumber(array[i])) {
      throw new Error("At least one input is NOT A NUMBER");
    }
  }

  array.sort((a, b) => a - b);

  for (let i = 0; i < array.length; i++) {
    if (usefulArr.length === 0 || array[i] !== prev) {
      usefulArr.push(array[i]);
      prev = array[i];
    }
  }
  return usefulArr;
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    this.root = this.buildTree(arr);
  }

  buildTree(array) {
    const usefulArr = sanitizeSAndDedupSorted(array);
    return this.buildTreeRecursive(usefulArr, 0, usefulArr.length - 1);
  }

  buildTreeRecursive(arr, start, end) {
    if (start > end) return null;

    let mid = start + Math.floor((end - start) / 2);

    let root = new Node(arr[mid]);

    root.left = this.buildTreeRecursive(arr, start, mid - 1);
    root.right = this.buildTreeRecursive(arr, mid + 1, end);

    return root;
  }

  insert(value) {
    if (!isFiniteNumber(value))
      throw new Error("Cannot insert a non-finite number");
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      return true;
    }
    let currentNode = this.root;
    let parent = null;
    while (currentNode !== null) {
      parent = currentNode;
      if (currentNode.data > value) {
        currentNode = currentNode.left;
      } else if (currentNode.data < value) {
        currentNode = currentNode.right;
      } else return false;
    }

    if (parent.data > value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
    return true;
  }
}

const tree = new Tree([3, 2, 2, 1, 1, 5, 6, 4, 7]);
prettyPrint(tree.root);
