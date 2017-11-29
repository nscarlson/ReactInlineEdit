import { bool, func, node, number, object, string } from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

function selectInputText (element) {
  element.setSelectionRange(0, element.value.length)
}

const ReactInlineEdit = class InlineEdit extends Component {
  static displayName = 'ReactInlineEdit'
  static propTypes = {
    activeClassName: string,
    change: func.isRequired,
    className: string,
    editing: bool,
    editingElement: string,
    element: node,
    isDisabled: bool,
    maxLength: number,
    minLength: number,
    paramName: string.isRequired,
    placeholder: string,
    staticElement: string,
    stopPropagation: bool,
    style: object,
    tabIndex: number,
    text: string.isRequired,
    validate: func,
  };

  static defaultProps = {
    editing: false,
    editingElement: 'input',
    isDisabled: false,
    maxLength: 256,
    minLength: 1,
    staticElement: 'span',
    tabIndex: 0,
  };

  state = {
    editing: this.props.editing,
    maxLength: this.props.maxLength,
    minLength: this.props.minLength,
    text: this.props.text,
  };

  componentWillMount () {
    this.isInputValid = this.props.validate || this.isInputValid
        // Warn about deprecated elements
    if (this.props.element) {
      console.warn('`element` prop is deprecated: instead pass editingElement or staticElement to InlineEdit component')
    }
  }

  componentWillReceiveProps (nextProps) {
    const isTextChanged = (nextProps.text !== this.props.text)
    const isEditingChanged = (nextProps.editing !== this.props.editing)
    const nextState = {}
    if (isTextChanged) {
      nextState.text = nextProps.text
    }
    if (isEditingChanged) {
      nextState.editing = nextProps.editing
    }
    if (isTextChanged || isEditingChanged) {
      this.setState(nextState)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const inputElem = ReactDOM.findDOMNode(this.refs.input)
    if (this.state.editing && !prevState.editing) {
      inputElem.focus()
      selectInputText(inputElem)
    } else if (this.state.editing && prevProps.text !== this.props.text) {
      this.finishEditing()
    }
  }

  handleStartEditing = (e) => {
    if (this.props.stopPropagation) {
      e.stopPropagation()
    }
    this.setState({ editing: true, text: this.props.text })
  };

  handleFinishEditing = () => {
    if (this.isInputValid(this.state.text) && this.props.text !== this.state.text) {
      this.handleCommitEditing()
    } else if (this.props.text === this.state.text || !this.isInputValid(this.state.text)) {
      this.handleCancelEditing()
    }
  };

  handleCancelEditing = () => {
    this.setState({ editing: false, text: this.props.text })
  };

  handleCommitEditing = () => {
    this.setState({ editing: false, text: this.state.text })
    const newProp = {}
    newProp[this.props.paramName] = this.state.text
    this.props.change(newProp)
  };

  handleClickWhenEditing = (e) => {
    if (this.props.stopPropagation) {
      e.stopPropagation()
    }
  };

  isInputValid = (text) => (text.length >= this.state.minLength && text.length <= this.state.maxLength);

  keyDown = (event) => {
    if (event.keyCode === 13) {
      this.finishEditing()
    } else if (event.keyCode === 27) {
      this.cancelEditing()
    }
  };

  handleTextChanged = (event) => {
    this.setState({
      text: event.target.value.trim(),
    })
  };

  render () {
    if (this.props.isDisabled) {
      const Element = this.props.element || this.props.staticElement
      return <Element
        className={this.props.className}
        style={this.props.style}
             >
        {this.state.text || this.props.placeholder}
      </Element>
    } else if (!this.state.editing) {
      const Element = this.props.element || this.props.staticElement
      return <Element
        className={this.props.className}
        onClick={this.handleStartEditing}
        style={this.props.style}
        tabIndex={this.props.tabIndex}
             >
        {this.state.text || this.props.placeholder}
      </Element>
    } else {
      const Element = this.props.element || this.props.editingElement
      return <Element
        className={this.props.activeClassName}
        defaultValue={this.state.text}
        onBlur={this.handleFinishEditing}
        onChange={this.handleTextChanged}
        onClick={this.handleClickWhenEditing}
        onKeyDown={this.handleKeyDown}
        placeholder={this.props.placeholder}
        ref="input"
        style={this.props.style}
             />
    }
  }
}

export default ReactInlineEdit
