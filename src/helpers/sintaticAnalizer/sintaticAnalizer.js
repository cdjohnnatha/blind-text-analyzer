import TokenStack from '../tokenStack/tokenStack';
const ptI18n = require('../../i18n/pt-br.json');

class SintaticAnalizer {
  constructor (elements) {
    this.stack = new TokenStack(elements)
    console.log('askdjaskdjaskdjaksdjaksjd');
    this.textDefinition();
  }

  validateStackHeader() {
    const { classification } = this.stack.top();
    if ( classification !== 'VERB'
    && classification !== 'DET'
    && classification !== 'NOUN'
    && classification !== 'PUNCT') {
      throw new Error(ptI18n.complexity_error_message);
    }
  }

  sintagmaNominal() {
    this.validateStackHeader();
    if (this.stack.top().classification === 'DET') {
      console.log(this.stack.top());
      this.stack.next();
    }
    this.validateStackHeader();
    if (this.stack.top().classification === 'NOUN') {
      console.log(this.stack.top());
      this.stack.next();
    }
    this.validateStackHeader();
  }

  sintagmaVerbal() {
    this.validateStackHeader();
    if (this.stack.top().classification === 'VERB') {
      console.log(this.stack.top());
      this.stack.next();
    }
    this.validateStackHeader();
    if (this.stack.top().classification === 'VERB') {
      console.log(this.stack.top());
      this.stack.next();
    }
    this.validateStackHeader();
  }

  sentence() {
    this.sintagmaNominal();
    this.sintagmaVerbal();
  }

  textDefinition() {
    this.sentence();
    if (this.stack.top().classification !== 'PUNCT' && !this.stack.empty()) {
      this.validateStackHeader();
      this.textDefinition();
    }
    console.log('sucesso');
    this.stack.next();
  }
}

export default SintaticAnalizer;