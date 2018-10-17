class TokenStack {
  constructor(elements) {
    this.stack = elements;
    this.header = 0;
  }

  top() {
    return this.stack[this.header];
  }

  next() {
    this.header += 1;
  }

  empty() {
    return this.stack === this.header;
  }
}

export default TokenStack;