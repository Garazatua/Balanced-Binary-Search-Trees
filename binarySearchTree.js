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
  constructor(arr = null) {
    this.root = this.buildTree(arr);
  }

  buildTree(array) {
    if (array === null) return null;
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

  find(value) {
    if (!isFiniteNumber(value)) {
      throw new Error("Cannot find a non-finite number");
    }
    let currentNode = this.root;
    let parent = null;
    while (currentNode !== null) {
      if (currentNode.data > value) {
        parent = currentNode;
        currentNode = currentNode.left;
      } else if (currentNode.data < value) {
        parent = currentNode;
        currentNode = currentNode.right;
      } else {
        return {
          node: currentNode,
          parent: parent,
        };
      }
    }
    return null;
  }
  deleteItem(value) {
    const nodeWithParent = this.find(value);
    if (!nodeWithParent) return false;
    const { node, parent } = nodeWithParent;

    if (!node.right && !node.left) {
      if (!parent) {
        this.root = null;
        return true;
      }
      if (parent.right === node) {
        parent.right = null;
        return true;
      } else if (parent.left === node) {
        parent.left = null;
        return true;
      }
    } else if (!node.right && node.left) {
      if (!parent) {
        this.root = node.left;
        return true;
      }
      if (parent.right === node) {
        parent.right = node.left;
      } else if (parent.left === node) {
        parent.left = node.left;
      }
      return true;
    } else if (node.right && !node.left) {
      if (!parent) {
        this.root = node.right;
        return true;
      }
      if (parent.right === node) {
        parent.right = node.right;
      } else if (parent.left === node) {
        parent.left = node.right;
      }
      return true;
    } else if (node.right && node.left) {
      let justBiggerNode = node.right;
      let parentOfJustBiggerNode = node;
      while (justBiggerNode.left) {
        parentOfJustBiggerNode = justBiggerNode;
        justBiggerNode = justBiggerNode.left;
      }
      node.data = justBiggerNode.data;
      if (!justBiggerNode.left && !justBiggerNode.right) {
        if (parentOfJustBiggerNode === node) {
          node.right = null;
          return true;
        }
        parentOfJustBiggerNode.left = null;
        return true;
      } else if (justBiggerNode.right && !justBiggerNode.left) {
        if (parentOfJustBiggerNode === node) {
          node.right = justBiggerNode.right;
          return true;
        }
        parentOfJustBiggerNode.left = justBiggerNode.right;
        return true;
      }
    }
    return false;
  }
  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    let queue = [];
    if (this.root) {
      queue.push(this.root);
    } else {
      return;
    }
    while (queue.length !== 0) {
      callback(queue[0]);
      if (queue[0].left) queue.push(queue[0].left);
      if (queue[0].right) queue.push(queue[0].right);
      queue.shift();
    }
  }

  preOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!node) return;
    callback(node);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);
  }

  inOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!node) return;
    this.inOrderForEach(callback, node.left);
    callback(node);
    this.inOrderForEach(callback, node.right);
  }

  postOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!node) return;
    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node);
  }

  height(value) {}
}

const tree = new Tree([3, 2, 2, 1, 1, 4, 5, 6, 7]);
prettyPrint(tree.root);
tree.levelOrderForEach();
