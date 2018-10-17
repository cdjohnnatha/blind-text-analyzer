import React, { Component } from 'react'
import axios from 'axios';
import Speech from 'speak-tts'
import { Deserializer } from 'jsonapi-serializer';
import SintaticAnalizer from '../helpers/sintaticAnalizer/sintaticAnalizer';
const querystring = require('querystring');

const dictionaryUrl = 'https://www.dicionarioweb.com.br/';
const classificatorUrl = 'http://localhost:3001/api/v1/classification';
const mismatchCheckerUrl = 'https://languagetool.org/api/v2/check';
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
    this.mismatchRequestHeader = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    this.formMismatch = {
      text: '',
	    language: 'pt-BR',
	    enabledOnly: false
    }
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
    let lastWord;
    if (event.charCode === 46) {
      try {
        let inputText = event.target.value;

        if (inputText[inputText.length - 1] !== '.') {
          inputText += '.';
        }
        const { data } = await axios({ method: 'post', url: classificatorUrl, data: this.buildJson(inputText) });
        const stackTokens = await new Deserializer().deserialize(data);
        new SintaticAnalizer(stackTokens);
        this.formMismatch.text = inputText;
        const { data: { matches: [mismatchErrors] } } = await axios({
          method: 'post',
          url: mismatchCheckerUrl,
          headers: this.mismatchRequestHeader,
          data: querystring.stringify(this.formMismatch) });
          console.log(mismatchErrors);
          console.log(mismatchErrors.message);
          if (mismatchErrors.message === ptI18n.verbal_mismatch_error) {
            let { replacements } = mismatchErrors;
            replacements = replacements.map(element => element.value);
            replacements = replacements.join(', ou, ');
            await speech.speak({ text:
              `
                ${ptI18n.verbal_mismatch_error_speech}
                ${inputText}
                ${ptI18n.suggests}
                ${replacements}
               `
              });
          }
      } catch (error) {
        console.log(error);
        await speech.speak({ text: ptI18n.complexity_error_message});
      }
    }
    if (event.charCode === 32) {
      try {
        const inputText = event.target.value;
        const words = this.prepareText(inputText);
        lastWord = words[words.length - 1];
        await axios({ method: 'get', url: `${dictionaryUrl}${lastWord}` });
      } catch (error) {
        console.log(error);
        await speech.speak({ text: `${ptI18n.full_error_type}${this.buildComaSplit(lastWord)}`});
      }
    }
  }

  render() {
    return(
      <div className="d-sm-flex flex-sm-column align-self-center align-items-center">
        <h2 htmlFor="basic-url" className="p-2">Digite aqui.</h2>
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