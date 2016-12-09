
function MyStack() {
    this.stack = [];
};

MyStack.prototype.constructor = MyStack;


MyStack.prototype.push = function (item) {
    this.stack.push(item);
}

MyStack.prototype.pop = function() {
    if (this.stack.length > 0)
        this.stack.pop();
}

MyStack.prototype.top = function() {
    if (this.stack.length > 0)
        return this.stack[this.stack.length-1];
    return null;
}
