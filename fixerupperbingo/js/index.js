'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SQUARE_NAMES = ['Open floorplan', 'Take down a wall', 'Curb appeal', 'Raise ceiling', 'Crown molding', 'Farmhouse sink', 'Farmhouse chandelier', 'Rustic charm', 'Buyers envision drinking alcohol outside', 'Add island to kitchen', 'Chip breaks something', 'Basket of crayons', 'Something is an "easy fix"', 'Eat-in kitchen', 'Load-bearing wall', 'Double vanity', 'Popcorn ceiling', 'Natural light', 'Shiplap', 'Backsplash', 'Recessed lighting', 'Buyers pick house 1', 'Buyers pick house 2', 'Buyers pick house 3', 'Buyers get house for under list', 'Inspirational sign'];

var Bingo = function (_React$Component) {
  _inherits(Bingo, _React$Component);

  function Bingo(props) {
    _classCallCheck(this, Bingo);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.state = {
      squares: _this.getSquares()
    };
    return _this;
  }

  Bingo.prototype.getSquares = function getSquares() {
    if (window.localStorage) {
      var savedGame = JSON.parse(window.localStorage.getItem('fixerUpperBingo'));
      if (savedGame) return savedGame;else {
        var squares = this.newSquares();
        window.localStorage.setItem('fixerUpperBingo', JSON.stringify(squares));
        return squares;
      }
    } else {
      return this.newSquares();
    }
  };

  Bingo.prototype.newSquares = function newSquares() {
    var sq = [];
    var text = shuffle(SQUARE_NAMES);
    for (var i = 0; i < 25; i++) {
      sq.push({ stamped: false, text: text[i], win: false });
    }
    sq[12].text = 'Free Space';
    sq[12].stamped = true;
    return sq;
  };

  Bingo.prototype.handleClick = function handleClick(i) {
    var squares = this.state.squares;
    squares[i].stamped = !squares[i].stamped;
    squares.forEach(function (square) {
      square.win = false;
    });

    var winLines = hasBingo(this.state.squares);
    if (winLines.length > 0) {

      winLines.forEach(function (line) {
        line.forEach(function (j) {
          squares[j].win = true;
        });
      });
    }

    this.setState({ squares: squares });

    if (window.localStorage) {
      window.localStorage.setItem('fixerUpperBingo', JSON.stringify(squares));
    }
  };

  Bingo.prototype.newGame = function newGame() {
    var squares = this.newSquares();
    if (window.localStorage) {
      window.localStorage.setItem('fixerUpperBingo', JSON.stringify(squares));
    }
    this.setState({ squares: squares });
  };

  Bingo.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      'div',
      { className: 'card clearfix' },
      React.createElement(
        'h1',
        { className: 'board-heading' },
        'Fixer Upper Bingo'
      ),
      React.createElement(
        'div',
        { className: 'col-letters' },
        React.createElement(
          'span',
          null,
          'B'
        ),
        React.createElement(
          'span',
          null,
          'I'
        ),
        React.createElement(
          'span',
          null,
          'N'
        ),
        React.createElement(
          'span',
          null,
          'G'
        ),
        React.createElement(
          'span',
          null,
          'O'
        )
      ),
      React.createElement(Board, {
        squares: this.state.squares,
        onClick: function onClick(i) {
          return _this2.handleClick(i);
        }
      }),
      React.createElement(
        'button',
        { className: 'new-game', onClick: function onClick() {
            return _this2.newGame();
          } },
        'New Card'
      )
    );
  };

  return Bingo;
}(React.Component);

var Square = function (_React$Component2) {
  _inherits(Square, _React$Component2);

  function Square() {
    _classCallCheck(this, Square);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this3.state = {
      value: null
    };
    return _this3;
  }

  Square.prototype.render = function render() {
    return React.createElement(
      'button',
      {
        className: 'square' + ' ' + (this.props.value.stamped ? 'stamped' : '') + ' ' + (this.props.value.win ? 'win' : ''),
        onClick: this.props.onClick
      },
      this.props.value.text
    );
  };

  return Square;
}(React.Component);

var Board = function (_React$Component3) {
  _inherits(Board, _React$Component3);

  function Board() {
    _classCallCheck(this, Board);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  Board.prototype.renderSquare = function renderSquare(i) {
    var _this5 = this;

    return React.createElement(Square, {
      value: this.props.squares[i],
      onClick: function onClick() {
        return _this5.props.onClick(i);
      }
    });
  };

  Board.prototype.render = function render() {
    var board = [];
    for (var i = 0; i < 5; i++) {
      var row = [];
      for (var j = 0; j < 5; j++) {
        row.push(this.renderSquare(j + i * 5));
      }
      board.push(React.createElement(
        'div',
        { key: i, className: 'board-row' },
        row
      ));
    }

    return React.createElement(
      'div',
      { className: 'board' },
      board
    );
  };

  return Board;
}(React.Component);

ReactDOM.render(React.createElement(Bingo, null), document.getElementById('app'));

// Helpers
function shuffle(arr) {
  return arr.sort(function () {
    return 0.5 - Math.random();
  });
}

function hasBingo(squares) {
  var lines = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]];

  return lines.filter(function (line) {
    if (line.every(function (l) {
      return squares[l].stamped;
    })) {
      return line;
    }
  });
}