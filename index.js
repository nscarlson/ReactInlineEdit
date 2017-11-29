'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _propTypes = require('prop-types');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function selectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

var ReactInlineEdit = (_temp2 = _class = function (_Component) {
  _inherits(InlineEdit, _Component);

  function InlineEdit() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InlineEdit);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InlineEdit.__proto__ || Object.getPrototypeOf(InlineEdit)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      editing: _this.props.editing,
      maxLength: _this.props.maxLength,
      minLength: _this.props.minLength,
      text: _this.props.text
    }, _this.handleStartEditing = function (e) {
      if (_this.props.stopPropagation) {
        e.stopPropagation();
      }
      _this.setState({ editing: true, text: _this.props.text });
    }, _this.handleFinishEditing = function () {
      if (_this.isInputValid(_this.state.text) && _this.props.text !== _this.state.text) {
        _this.handleCommitEditing();
      } else if (_this.props.text === _this.state.text || !_this.isInputValid(_this.state.text)) {
        _this.handleCancelEditing();
      }
    }, _this.handleCancelEditing = function () {
      _this.setState({ editing: false, text: _this.props.text });
    }, _this.handleCommitEditing = function () {
      _this.setState({ editing: false, text: _this.state.text });
      var newProp = {};
      newProp[_this.props.paramName] = _this.state.text;
      _this.props.change(newProp);
    }, _this.handleClickWhenEditing = function (e) {
      if (_this.props.stopPropagation) {
        e.stopPropagation();
      }
    }, _this.isInputValid = function (text) {
      return text.length >= _this.state.minLength && text.length <= _this.state.maxLength;
    }, _this.keyDown = function (event) {
      if (event.keyCode === 13) {
        _this.finishEditing();
      } else if (event.keyCode === 27) {
        _this.cancelEditing();
      }
    }, _this.handleTextChanged = function (event) {
      _this.setState({
        text: event.target.value.trim()
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InlineEdit, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.isInputValid = this.props.validate || this.isInputValid;
      // Warn about deprecated elements
      if (this.props.element) {
        console.warn('`element` prop is deprecated: instead pass editingElement or staticElement to InlineEdit component');
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var isTextChanged = nextProps.text !== this.props.text;
      var isEditingChanged = nextProps.editing !== this.props.editing;
      var nextState = {};
      if (isTextChanged) {
        nextState.text = nextProps.text;
      }
      if (isEditingChanged) {
        nextState.editing = nextProps.editing;
      }
      if (isTextChanged || isEditingChanged) {
        this.setState(nextState);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var inputElem = _reactDom2.default.findDOMNode(this.refs.input);
      if (this.state.editing && !prevState.editing) {
        inputElem.focus();
        selectInputText(inputElem);
      } else if (this.state.editing && prevProps.text !== this.props.text) {
        this.finishEditing();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.isDisabled) {
        var Element = this.props.element || this.props.staticElement;
        return _react2.default.createElement(
          Element,
          {
            className: this.props.className,
            style: this.props.style
          },
          this.state.text || this.props.placeholder
        );
      } else if (!this.state.editing) {
        var _Element = this.props.element || this.props.staticElement;
        return _react2.default.createElement(
          _Element,
          {
            className: this.props.className,
            onClick: this.handleStartEditing,
            style: this.props.style,
            tabIndex: this.props.tabIndex
          },
          this.state.text || this.props.placeholder
        );
      } else {
        var _Element2 = this.props.element || this.props.editingElement;
        return _react2.default.createElement(_Element2, {
          className: this.props.activeClassName,
          defaultValue: this.state.text,
          onBlur: this.handleFinishEditing,
          onChange: this.handleTextChanged,
          onClick: this.handleClickWhenEditing,
          onKeyDown: this.handleKeyDown,
          placeholder: this.props.placeholder,
          ref: 'input',
          style: this.props.style
        });
      }
    }
  }]);

  return InlineEdit;
}(_react.Component), _class.displayName = 'ReactInlineEdit', _class.propTypes = {
  activeClassName: _propTypes.string,
  change: _propTypes.func.isRequired,
  className: _propTypes.string,
  editing: _propTypes.bool,
  editingElement: _propTypes.string,
  element: _propTypes.node,
  isDisabled: _propTypes.bool,
  maxLength: _propTypes.number,
  minLength: _propTypes.number,
  paramName: _propTypes.string.isRequired,
  placeholder: _propTypes.string,
  staticElement: _propTypes.string,
  stopPropagation: _propTypes.bool,
  style: _propTypes.object,
  tabIndex: _propTypes.number,
  text: _propTypes.string.isRequired,
  validate: _propTypes.func
}, _class.defaultProps = {
  editing: false,
  editingElement: 'input',
  isDisabled: false,
  maxLength: 256,
  minLength: 1,
  staticElement: 'span',
  tabIndex: 0
}, _temp2);

exports.default = ReactInlineEdit;
