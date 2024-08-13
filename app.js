let start_fen = 'rbna1abnr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ABNR w - - 0 1';
// let start_fen = 'rnba1anbr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ANBR b - - 0 1';
let board = [];

let pieceToImage = {
  'r': 'cho_cha',
  'n': 'cho_ma',
  'b': 'cho_sang',
  'a': 'cho_sa',
  'k': 'cho_gung',
  'c': 'cho_fo',
  'p': 'cho_jol',
  'R': 'han_cha',
  'N': 'han_ma',
  'B': 'han_sang',
  'A': 'han_sa',
  'K': 'han_gung',
  'C': 'han_fo',
  'P': 'han_b'
};

let images = {};
let bg;
let selectedPiece = null;
let first;
let fen;
let wood_sound;

function preload() {
    wood_sound = loadSound('wood.mp3');
    bg = loadImage('JanggiBrown.png');
    for (let piece in pieceToImage) {
        images[piece] = loadImage(pieceToImage[piece] + '.png');
    }
    console.log(images);
}

function setup() {
  createCanvas(400, 400);
  noLoop();
  first = start_fen.split(' ')[1];
  if (first == "w") {
    fen = start_fen.split(' ')[0];
  } else {
    let test = start_fen.split(' ')[0];
    fen = test.split("").reverse().join("");
  }
  
  board = fen.split('/').map(row => {
    let newRow = [];
    for (let char of row) {
      if (isNaN(char)) {
        newRow.push(char);
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          newRow.push(' ');
        }
      }
    }
    return newRow;
  });
  console.log(board);
  console.log(first);
  console.log(fen);
}

function draw() {
  background(bg);
  let w = width / 9;
  let h = height / 10;
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 10; j++) {
      let piece = board[j][i];
      if (piece in images) {
        image(images[piece], i * w, j * h, w, h);
      }
    }
  }
  
  // 선택된 기물에 표시 추가
  if (selectedPiece) {
    stroke(255, 0, 0); // 빨간색 테두리
    strokeWeight(4);
    noFill();
    rect(selectedPiece.i * w, selectedPiece.j * h, w, h);
  }
}

function isSameTeam(piece1, piece2) {
  if (!piece1 || !piece2) return false;
  return (piece1.toLowerCase() === piece1 && piece2.toLowerCase() === piece2) ||
         (piece1.toUpperCase() === piece1 && piece2.toUpperCase() === piece2);
}

function mousePressed() {
  wood_sound.play();
  let i = floor(mouseX / (width / 9));
  let j = floor(mouseY / (height / 10));
  
  if (selectedPiece) {
    let selectedPieceType = board[selectedPiece.j][selectedPiece.i];
    let targetPieceType = board[j][i];
    
    // 같은 팀인지 확인
    if (selectedPiece.i === i && selectedPiece.j === j) {
      // 이미 선택된 기물을 다시 클릭한 경우
      selectedPiece = null;
      redraw();
    } else if (targetPieceType === ' ' || !isSameTeam(selectedPieceType, targetPieceType)) {
      board[j][i] = selectedPieceType;
      board[selectedPiece.j][selectedPiece.i] = ' ';
      selectedPiece = null;
      redraw();
    }
  } else if (board[j][i] in images) {
    selectedPiece = {i, j};
    redraw(); // 선택된 기물을 표시하기 위해 화면을 다시 그립니다.
  }
  
  console.log(selectedPiece);
  console.log(board);
}