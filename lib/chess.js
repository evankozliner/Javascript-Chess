// game logic
(function() {
  var grid = new Board("regular");
  grid.draw().placePieces(pieces);
  var cells = document.getElementsByClassName('cell');
  var whoseTurn = 'white';
  var forEach = Array.prototype.forEach;
  forEach.call(cells, function(cell) {
    cell.addEventListener('click', function(e) {
      var team = whichTeam(cell);
      var potentialMoves = [];
      if (whoseTurn === team) {
        if (hasClass(cell, 'hasPiece') && !hasClass(cell, 'selected')) {
          var previouslySelectedCell = document.getElementsByClassName('selected')['0'];
          if (previouslySelectedCell) {
            previouslySelectedCell.className = previouslySelectedCell.className.replace(/(?:^|\s)selected(?!\S)/ , '');
          }
          findPotentialMoves(cell.childNodes['0']);
          cell.className += ' selected';
        } else if (!hasClass(cell, 'hasPiece') && potentialMoves.length > 0) {

        }
      } else {

      }
    });
  });
})();

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
 * @return {array}
 */
function findPotentialMoves(piece) {
  var properties = piece.id.split('-');
  var piece = new Piece(properties);
  return piece.potentialMoves();
}
