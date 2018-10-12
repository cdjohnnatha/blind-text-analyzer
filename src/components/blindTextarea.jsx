import React, { Component } from 'react'
import axios from 'axios';
import Speech from 'speak-tts'
const dictionaryUrl = 'http://localhost:3001/api/v1/classification';
const speech = new Speech();
const ptI18n = require('../i18n/pt-br');

class BlindTextarea extends Component {
  constructor(props) {
    super(props);
    this.speachSetup = {
      'volume': 1,
      'lang': 'pt-BR',
      'rate': 1,
      'pitch': 1,
      'splitSentences': false
    }
    speech.init(this.speachSetup);
  }
  prepareText(inputText) {
    return inputText.split(" ");
  }

  buildJson(inputText) {
    return {
      data: {
       type: 'classification',
       attributes: {
         inputText: inputText
       }
     }
   }
  }

  buildComaSplit(inputWord) {
    const chars = inputWord.split('');
    return chars.join(',');
  }

  keyUpHandler = async (event) => {
    const inputText = event.target.value;
    let lastWord;
    if (event.charCode === 46) {

    }
    if (event.charCode === 32) {
      try {
        const words = this.prepareText(inputText);
        lastWord = words[words.length - 1];
        await axios({ method: 'post', url: dictionaryUrl, data: this.buildJson(lastWord) });
      } catch (error) {
        await speech.speak({ text: `${ptI18n.full_error_type}${this.buildComaSplit(lastWord)}`});
        console.log(error);
      }
    }
    console.log(event.charCode);

  }

  render() {
    return(
      <div className="d-sm-flex flex-sm-column align-self-center align-items-center">
        <h2 htmlFor="basic-url" className="p-2">Type your text here</h2>
        <div className="input-group p-2 w-50">
          <textarea type="text"
            id="blind-text-area"
            className="form-control"
            rows="5"
            onKeyPress={this.keyUpHandler}
          ></textarea>
        </div>
      </div>
    );
  }
}

export default BlindTextarea;