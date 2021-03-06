// game logic

(function() {
  title.addEventListener('click', resetGame.bind(this));
  resetGame();
})();

/**
 * resetGame creates a fresh game
 */
function resetGame() {
  this.aGameOfChess = {
    whoseTurn: 'white'
  }
  var whoseTurn = this.aGameOfChess.whoseTurn;
  var grid = new Board(whoseTurn),
      table = document.getElementById('chessBoard');
  cells = document.getElementsByClassName('cell'),
  figures = document.getElementsByClassName('figure'),
  title = document.getElementById('title');
  potentialMoves = [],
  forEach = Array.prototype.forEach,
  ls = this.localStorage;
  table.innerHTML = '';
  ls.setItem('aGameOfChess', JSON.stringify({
    pieces: pieces,
    moves: []
  }));
  var chess = getState();
  grid.draw().placePieces(chess.pieces);
  forEach.call(figures, function(figure) {
    prepareFigure(figure);
  });
}

/**
 * prepareFigure adds drag event listeners to the specified figure
 *
 * @param {ele} figure
 */
function prepareFigure(figure) {
  var parent = figure.parentNode;
  var image = document.createElement('img');
  image.src = getFigureImage(figure);
  figure.addEventListener('dragstart', function(e) {
    parent.className += ' selected';
    potentialMoves = createPieceFromFigure(figure, parent.id).potentialMoves();
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
  var figureProperties = getFigureProperties(figure);
  var pieces = getPieces();
  pieces[figureProperties.team][figureProperties.type].position = parent.id;
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
// function findPotentialMoves(piece, position) {
//   var properties = piece.id.split('-');
//   // if piece is king or queen then there is no number specified
//   if (properties.length === 2) {
//     properties.push(null);
//   }
//   properties.push(position);
//   var piece = new Piece(properties);
//   return piece.potentialMoves();
// }

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
  var figureProperties = getFigureProperties(previousLocation.childNodes[0]);
  var from = previousLocation.id;
  previousLocation.innerHTML = '';
  previousLocation.className = previousLocation.className.replace(/(?:^|\s)hasPiece(?!\S)/, '');
  // if the destination cell has a figure on it. this handles the "taking" of pieces
  if (this.innerHTML.length > 0) {
    sendToGraveyard(this.childNodes[0]);
  }
  // drop the piece into the destination cell
  this.innerHTML = figure;
  this.className = this.className.replace(/(?:^|\s)draggedOver(?!\S)/, ' hasPiece');
  var move = {
    team: figureProperties.team,
    piece: figureProperties.type,
    from: from,
    to: this.id
  }
  //special pawn stuff
  //TODO: export this pawn logic
  if (move.piece.substring(0, move.piece.length - 1) === 'pawn') {
    //check to see if this piece has performed en passant
    multiplier = 1;
    if (move.team === "black") multiplier = -1;
    columns = getColumns();
    var values = document.getElementById(move.to).childNodes[0].id.split("-");
    var enPassant = getPieces()[move.team]['pawn' + values[2]]['enPassant'].split("-")[0];
    if ( (Math.abs(Number(columns.indexOf(move.to[0])) - Number(columns.indexOf(move.from[0]))) > 0) && enPassant == "true" ) {
      var lowerSquare = document.getElementById(move.to[0] + (Number(move.to[1]) - 1 * multiplier)).childNodes[0];
      sendToGraveyard(lowerSquare);
    }
    //check to see if we can add en passant to another piece
    if ((Math.abs(Number(move.to[1]) - Number(move.from[1]))) > 1) handleEnPassant(move);
  }

  setHasMoved(figureProperties);
  prepareFigure(this.childNodes[0]);
  var checkTeam = move.team === 'white' ? 'black' : 'white';
  var pieces = getPieces();
  putInCheck(pieces[checkTeam].king, pieces[move.team]);
  nextTurn();
  return false;
}

/**
 * @param {object} king
 * @param {object} pieces
 * Sets the inCheck property for the king
 */
function putInCheck(oppositeKing, pieces) {
  var piecesToCheck = [],
      pieceNames = Object.keys(pieces),
      i;

  for (i = 0; i < pieceNames.length; i += 1) {
    var pieceName = pieceNames[i];
    if (!isNaN(pieceName[pieceName.length - 1])) {
      pieceName = pieceName.slice(0, pieceName.length - 1);
    }
    if (piecesToCheck.indexOf(pieceName) < 0) {
      piecesToCheck.push(pieceName);
    }
  }

  var kingFigure = document.getElementById(oppositeKing.position).childNodes[0];

  for (i = 0; i < piecesToCheck.length; i += 1) {
    // var num = (piece === 'king' || piece === 'queen') ? null : '1';

    var fakePiece = createPieceFromFigure(kingFigure, oppositeKing.position);
    fakePiece.hasMoved = true;
    fakePiece.type = piecesToCheck[i];
    fakePiece.number = 1;

    moves = fakePiece.potentialMoves();
    if (moves.length > 0) {
      // console.log(fakePiece);
      // console.log(moves.length)
      for(var j = 0; j < moves.length; j++) {
        var square = document.getElementById(moves[j]);
        if (square.childNodes.length > 0 && square.childNodes[0].id.split("-")[1] == fakePiece.type) {
          setInCheck(oppositeKing.id.split("-")[0]);
          console.log("check!");
        }
      }
    }
  }
}

function createPieceFromFigure(figure, position) {
  var properties = figure.id.split('-');

  if (properties.length === 2) {
    properties.push(null);
  }
  properties.push(position);

  return new Piece(properties);
}

/**
 * @param {object} move
 * sets the enPassant property for adjacent pieces
 */
function handleEnPassant(move) {
  var columns = getColumns();
  var multiplier = 1;
  if (move.team === "black") multiplier = -1;

  var adjacentRight = document.getElementById(columns[columns.indexOf(move.to[0]) + 1] + move.to[1]);
  var adjacentLeft = document.getElementById(columns[columns.indexOf(move.to[0]) - 1] + move.to[1]);

  if (adjacentRight != null && adjacentRight.childNodes.length > 0) {
    var values = adjacentRight.childNodes[0].id.split("-");
    setEnPassant(values[0], values[1] + values[2], move.to[0] + Number(move.to[1] - 1 * multiplier));
  }
  if (adjacentLeft != null && adjacentLeft.childNodes.length > 0) {
    var values = adjacentLeft.childNodes[0].id.split("-");
    setEnPassant(values[0], values[1] + values[2], move.to[0] + Number(move.to[1] - 1 * multiplier));
  }
}

/**
 * nextTurn switches the board perspective. It also restricts movement of the pieces
 * belonging to the team that just played.
 */
function nextTurn() {
  var previousTurnTeam = this.aGameOfChess.whoseTurn;
  var thisTurnTeam = previousTurnTeam === 'white' ? 'black' : 'white';
  var table = document.getElementById('chessBoard');
  setTimeout(function() {
    table.innerHTML = '';
    grid = new Board(thisTurnTeam);
    this.aGameOfChess.whoseTurn = thisTurnTeam;
    grid.draw().placePieces(getPieces());
    var figures = document.getElementsByClassName('figure');
    forEach.call(figures, function(figure) {
      prepareFigure(figure);
    });
  }, 500);
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
  return getState().moves;
}

/**
 * sets/updates an array of move objects in localStorage
 *
 * @param {[type]} moves [description]
 */
function setMoves(moves) {
  var state = getState();
  state.moves = moves;
  setState(state);
}

/**
 * gets the specified move from localStorage
 *
 * @return {number} i
 */
function getMove(i) {
  var moves = getState().moves;
  return moves[i];
}

/**
 * pushes a move to localStorage
 *
 * @param {object} move
 */
function pushMove(move) {
  var state = getState();
  state.moves.push(move);
  setState(state);
}

/**
 * pops and returns a move from localStorage
 *
 * @return {object} move
 */
function popMove() {
  var state = getState();
  var move = state.moves.pop();
  setState(state);
  return move;
}

/**
 * returns the graveyard object from localStorage
 *
 * @return {object}
 */
function getGraveyard() {
  return getPieces().graveyard;
}

/**
 * sendToGraveyard updates the graveyard in localstorage and updates
 * the graveyard element in the UI by calling updateGraveyardElement
 *
 * @param {element} figure
 */
function sendToGraveyard(figure) {
  var destroyedFigure = getFigureProperties(figure);
  pieces = getPieces();
  var destroyedPiece = pieces[destroyedFigure.team][destroyedFigure.type];
  delete pieces[destroyedFigure.team][destroyedFigure.type];
  pieces.graveyard[destroyedFigure.team][destroyedFigure.type] = destroyedPiece;
  setPieces(pieces);
  updateGraveyardElement();
}

/**
 * gets all pieces inside the graveyard in localStorage and adds them to the
 * #graveyard
 */
function updateGraveyardElement() {
  var graveyard = getGraveyard();
  for (team in graveyard) {
    teamGraveyardObject = graveyard[team];
    var teamGraveyard = document.getElementById(team + '-graveyard');
    var count = 0;
    for (piece in teamGraveyardObject) {
      count += 1;
    }
    if (count > 0) {
      teamGraveyard.innerHTML = '';
      var indicator = document.createElement('div');
      indicator.id = team + '-indicator';
      indicator.className = 'team-indicator';
      teamGraveyard.appendChild(indicator);
    }
    for (piece in teamGraveyardObject) {
      piece = teamGraveyardObject[piece];
      figure = document.createElement('span');
      figure.id = piece.id;
      figure.className = 'deadFigure';
      figure.innerHTML += piece.figure;
      teamGraveyard.appendChild(figure);
    }
  }
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

/**
 * a helper function that returns the location of the specified figure's
 * corresponding image
 *
 * @param {element} figure
 */
function getFigureImage(figure) {
  var figureProperties = getFigureProperties(figure);
  var type = figureProperties.type;
  if (!isNaN(parseInt(type.charAt(type.length - 1)))) {
    type = type.substring(0, type.length - 1);
  }
  return '/images/' + figureProperties.team + '-' + type + '.png';
}

//TODO: If we get the time we should change the setters to use the piece instead of figure properties
/**
 * Getter for hasMoved
 * @param {element} piece
 * @return {boolean} hasMoved
 */
function getHasMoved(piece) {
  var pieces = getPieces();
  return JSON.parse(pieces[piece.team][piece.type + piece.number]["hasMoved"]);
}
/**
 * Setter for hasMoved
 * @param {element} figureProperties
 */
function setHasMoved(figureProperties) {
  var pieces = getPieces();
  pieces[figureProperties.team][figureProperties.type]["hasMoved"] = "true";
  setPieces(pieces);
}
/**
 * Getter for enPassant
 * @param {element} piece
 * @return {boolean} enPassant
 */
function getEnPassant(piece) {
  var pieces = getPieces();
  return pieces[piece.team][piece.type + piece.number]["enPassant"];
}
/**
 * Setter for hasMoved
 * @param {element} figureProperties
 */
function setEnPassant(team, type, square) {
  var pieces = getPieces();
  pieces[team][type]["enPassant"] = "true-" + square;
  setPieces(pieces);
}
/**
 * Returns the columns of the board in order
 * @return {array} columns
 */
function getColumns() {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
}
/** TODO:
 * @params {object} piece
 * @return {boolean} inCheck
 */
 function getInCheck(team) {
  var pieces = getPieces();
  return pieces[team]['king']["inCheck"];
 }
/** TODO:
* @params {object} piece
* @return {boolean} inCheck
*/
function setInCheck(team) {
  var pieces = getPieces();
  pieces[team]['king']["inCheck"] = "true";
  setPieces(pieces);
}
