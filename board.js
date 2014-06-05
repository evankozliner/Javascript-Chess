function Board(style) {
  this.size = 8;
  this.style = style;
  //screen size later
  this.dimension = 400;
}

Board.prototype.draw = function() {
  var chessBoard = document.getElementById("chessBoard");
  var cell = this.dimension / 8;
  for (var i = 0; i < this.size; i++) {
    var row = document.createElement("tr");
    chessBoard.appendChild(row);
    for (var j = 0; j < this.size; j++) {
      var cell = document.createElement("td");
      cell.className = "cell";
      if (i % 2 == 0) {
          if (j % 2 == 0) {
              cell.className += " light";
          } else {
              cell.className += " dark";
          }
      } else {
        if (j % 2 == 0) {
            cell.className += " dark";
        } else {
            cell.className += " light";
        }
      }
      row.appendChild(cell);
    };
  };
}
