// game logic
(function() {
  var whoseTurn = 'white';
  var grid = new Board(whoseTurn),
      cells = document.getElementsByClassName('cell'),
      figures = document.getElementsByClassName('figure'),
      potentialMoves = [],
      forEach = Array.prototype.forEach,
      ls = this.localStorage;
  ls.setItem('aGameOfChess', JSON.stringify({pieces: pieces, moves: []}));
  var chess = getState();
  grid.draw(whoseTurn).placePieces(chess.pieces);
  forEach.call(figures, function(figure) { prepareFigure(figure); });
})();

/**
 * prepareFigure adds drag event listeners to the specified figure
 *
 * @param {ele} figure
 */
function prepareFigure(figure) {
  var parent = figure.parentNode;
  var image = document.createElement('img');
  image.src = 'public/images/white-pawn.png';
  figure.addEventListener('dragstart', function(e) {
    parent.className += ' selected';
    potentialMoves = findPotentialMoves(figure, parent.id);
    prepareCells(potentialMoves);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', parent.innerHTML);
    e.dataTransfer.setData('text/plain', parent.id);
    e.dataTransfer.setDragImage(image, +25, +25);
    return false;
  });
  figure.addEventListener('dragend', function(e) {
    forgetCells(potentialMoves);
    parent.className = parent.className.replace(/(?:^|\s)selected(?!\S)/, '');
  });
  // update figure position
  var pieces = getPieces();
  var pieceProperties = getFigureProperties(figure);
  pieces[pieceProperties.team][pieceProperties.type].position = parent.id;
  setPieces(pieces);
}

/**
 * hasClass checks to see if the specified elements has the specified class
 *
 * @param {element} ele
 * @param {string} klass
 * @return {boolean}
 */
function hasClass(ele, klass) {
  return ele.className.indexOf(klass) > -1;
}

/**
 * whichTeam returns the team the piece in the specified cell belongs to
 *
 * @param {element} cell
 * @return {string}
 */
function whichTeam(cell) {
  if (cell.childNodes['0']) {
    return cell.childNodes['0'].id.indexOf('white') > -1 ? 'white' : 'black';
  } else {
    return 'neutral';
  }
}

/**
 * findPotentialMoves returns an array of cell IDs. Each cell ID represents a cell
 * that the specified piece can move to
 *
 * @param {element} piece
 * @param {string} position
 * @return {array}
 */
function findPotentialMoves(piece, position) {
  var properties = piece.id.split('-');
  // if piece is king or queen then there is no number specified
  if (properties.length === 2) {
    properties.push(null);
  }
  properties.push(position);
  var piece = new Piece(properties);
  return piece.potentialMoves();
}

/**
 * prepareCells adds drag event listeners to cells marked as potential
 * destinations for the "picked up" piece
 *
 * @param {array} potentialDestinations
 */
function prepareCells(potentialDestinations) {
  potentialDestinations.forEach(function(destination) {
    var potentialDestination = document.getElementById(destination);
    potentialDestination.addEventListener('dragenter', handleDragEnter);
    potentialDestination.addEventListener('dragleave', handleDragLeave);
    potentialDestination.addEventListener('dragover', handleDragOver);
    potentialDestination.addEventListener('drop', handleDrop);
  });
}

/**
 * forgetCells removes the event listeners added by prepareCells when
 * the dragend event occurs
 *
 * @param {array} potentialDestinations
 */
function forgetCells(potentialDestinations) {
  potentialDestinations.forEach(function(destination) {
    var potentialDestination = document.getElementById(destination);
    potentialDestination.removeEventListener('dragenter', handleDragEnter);
    potentialDestination.removeEventListener('dragleave', handleDragLeave);
    potentialDestination.removeEventListener('drop', handleDrop);
  });
}

/**
 * Event handler for dragenter
 *
 * @param {event} e
 */
function handleDragEnter(e) {
  if (!hasClass(this, 'draggedOver')) {
    this.className += ' draggedOver';
  }
}

/**
 * Event handler for dragleave
 *
 * @param {event} e
 */
function handleDragLeave(e) {
  if (hasClass(this, 'draggedOver')) {
    this.className = this.className.replace(/(?:^|\s)draggedOver(?!\S)/, '');
  }
}

/**
 * Event handler for dragover
 *
 * @param {event} e
 */
function handleDragOver(e) {
  e.preventDefault();
  return false;
}

/**
 * Event handler for drop
 *
 * @param {event} e
 */
function handleDrop(e) {
  e.stopPropagation();
  // get the picked up figure
  var parser = new DOMParser();
  var figure = e.dataTransfer.getData('text/html');
  figure = figure.substring(figure.indexOf('<span'), figure.length);
  // clear the previous location of the picked up figure
  var previousLocation = document.getElementById(e.dataTransfer.getData('text/plain'));
  previousLocation.innerHTML = '';
  previousLocation.className = previousLocation.className.replace(/(?:^|\s)hasPiece(?!\S)/, '');
  // if the destination cell has a figure on it
  if (this.innerHTML.length > 0) {
    var destroyedFigure = getFigureProperties(this.childNodes[0]);
        pieces = getPieces();
    var destroyedPiece = pieces[destroyedFigure.team][destroyedFigure.type];
    delete pieces[destroyedFigure.team][destroyedFigure.type];
    pieces.graveyard[destroyedFigure.team][destroyedFigure.type] = destroyedPiece;
    setPieces(pieces);
  }
  // drop the piece into the destination cell
  this.innerHTML = figure;
  this.className = this.className.replace(/(?:^|\s)draggedOver(?!\S)/, ' hasPiece');
  prepareFigure(this.childNodes[0]);
  return false;
}

/**
 * gets the current state of the game
 *
 * @return {object}
 */
function getState() {
  return (JSON.parse(window.localStorage.getItem('aGameOfChess')));
}

/**
 * sets the game state to the given state
 *
 * @param {object} state
 */
function setState(state) {
  window.localStorage.setItem('aGameOfChess', JSON.stringify(state));
}
/**
 * gets the game state from localstorage
 *
 * @return {object}
 */
function getPieces() {
  return getState().pieces;
}

/**
 * sets the game state to localstorage
 *
 * @param {object} pieces
 */
function setPieces(pieces) {
  var state = getState();
  state.pieces = pieces;
  setState(state);
}

/**
 * returns an array of move objects from localStorage
 *
 * @return {array}
 */
function getMoves() {

}

function setMoves() {

}

function getMove(i) {

}

function pushMove(move) {

}

function popMove() {

}

/**
 * returns an array of the position's of pieces on the specified team
 *
 * @param {string} team
 * @return {array} positions
 */
function getTeamPiecesPositions(team) {
  var pieces = getPieces(),
      positions = [];
  pieces = pieces[team];
  for (piece in pieces) {
    positions.push(pieces[piece].position);
  }
  return positions;
}

/**
 * A helper function that parses the id of the figure element
 *
 * @param {element} figure
 * @return {object} properties
 */
function getFigureProperties(figure) {
  var properties = {};
  figure = figure.id.split('-');
  properties.team = figure[0];
  properties.type = figure[1];
  if (figure[2]) {
    properties.type += figure[2];
  }
  return properties;
}
