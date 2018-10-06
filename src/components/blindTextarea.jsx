import React, { Component } from 'react'
// import translate from 'google-translate-api';

class BlindTextarea extends Component {
  constructor(props) {
    super(props);
  }

  keyUpHandler = (event) => {
    if (event.charCode === 32) {
      const fullText = event.target.value;
      const words = fullText.split(" ");
      console.log(words);
      // const googie1 = new GoogieSpell("googiespell/", "/");
      console.log('>>>>>>>>>>>>>>>>>');
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