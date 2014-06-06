// game logic
(function() {
  var whoseTurn = 'white';
  var grid = new Board(whoseTurn),
      cells = document.getElementsByClassName('cell'),
      figures = document.getElementsByClassName('figure'),
      potentialMoves = [],
      forEach = Array.prototype.forEach,
      ls = this.localStorage;
  ls.setItem('pieces', JSON.stringify(pieces));
  grid.draw(whoseTurn).placePieces(JSON.parse(ls.getItem('pieces')));
  forEach.call(figures, function(figure) { prepareFigure(figure); });
})();

/**
 * prepareFigure adds drag event listeners to the specified figure
 *
 * @param {ele} figure
 */
function prepareFigure(figure) {
  var parent = figure.parentNode;
  figure.addEventListener('dragstart', function(e) {
    parent.className += ' selected';
    potentialMoves = findPotentialMoves(figure, parent.id);
    prepareCells(potentialMoves);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', parent.innerHTML);
    e.dataTransfer.setData('text/plain', parent.id);
  });
  figure.addEventListener('dragend', function(e) {
    forgetCells(potentialMoves);
    parent.className = parent.className.replace(/(?:^|\s)selected(?!\S)/, '');
  });
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
    var destroyedFigure = this.childNodes[0].id.split('-');
        pieces = getPieces();
    var team = destroyedFigure[0],
        type = destroyedFigure[1];
    if (destroyedFigure.length !== 2) {
      type += destroyedFigure[2];
    }
    var destroyedPiece = pieces[team][type];
    delete pieces[team][type];
    pieces.graveyard[team][type] = destroyedPiece;
    setPieces(pieces);
  }
  // drop the piece into the destination cell
  this.innerHTML = figure;
  this.className = this.className.replace(/(?:^|\s)draggedOver(?!\S)/, ' hasPiece');
  prepareFigure(this.childNodes[0]);
  return false;
}

function getPieces() {
  return JSON.parse(window.localStorage.getItem('pieces'));
}

function setPieces(pieces) {
  window.localStorage.setItem('pieces', JSON.stringify(pieces));
}
