import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Campaign extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      showinput: false,
    }
    this.checkHandle = this.checkHandle.bind(this)
    this.editClick = this.editClick.bind(this)
    this.renderInput = this.renderInput.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.changeHandle = this.changeHandle.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  checkHandle() {
    const action = this.state.active
    const paas = this.props.paas
    const index = this.props.index
    if (action) {
      ReactDOM.findDOMNode(this).classList.remove('active')
      this.props.checkHandle(paas, index, false)
    } else {
      ReactDOM.findDOMNode(this).classList.add('active')
      this.props.checkHandle(paas, index, true)
    }
    this.setState({
      active: !action,
    })
  }

  editClick() {
    if (this.state.showinput === true) return
    this.setState(
      {
        showinput: true,
      },
      () => {
        ReactDOM.findDOMNode(this).querySelector('input').focus()
      },
    )
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.mouseLeave()
    }
  }

  renderInput(val) {
    val = val || ''
    const showinput = this.state.showinput
    if (showinput) {
      return (
        <input
          type="number"
          onBlur={this.mouseLeave}
          onChange={this.changeHandle}
          className="cvinput"
          defaultValue={val}
          maxLength="5"
          onKeyDown={this.handleKeyDown}
        />
      )
    }
  }

  mouseLeave() {
    this.setState({ showinput: false })
  }

  changeHandle() {
    let cv = ReactDOM.findDOMNode(this).querySelector('input').value
    cv = Number(cv && cv.replace(/^0+/, ''))
    this.props.setCV(cv, this.props.paas, this.props.index)
  }

  render() {
    const { content, index, paas, dataUnit } = this.props //es6语法
    return (
      <tr id={paas + index}>
        {Object.keys(content).map((k, i) => {
          if (k === 'CV') {
            return (
              <td key={i} className={k} onClick={this.editClick}>
                <div>
                  <span>{content[k] || '-'}</span>
                  <small>{dataUnit[k]}</small>
                </div>
                {this.renderInput(content[k])}
              </td>
            )
          }

          return (
            <td key={i} className={k} onClick={this.checkHandle}>
              <div>
                <span>{content[k] || '-'}</span>
                <small>{dataUnit[k]}</small>
              </div>
            </td>
          )
        })}
      </tr>
    )
  }
}

export default Campaign
