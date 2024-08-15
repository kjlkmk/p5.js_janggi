// let start_fen = 'rbna1abnr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ABNR w - - 0 1';
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
let turn;

function preload() {
    wood_sound = loadSound('wood.mp3');
    bg = loadImage('JanggiBrown.png');
    for (let piece in pieceToImage) {
        images[piece] = loadImage(pieceToImage[piece] + '.png');
    }
}

function getURLParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setup() {
  createCanvas(400, 400);
  // "한수 쉼" 버튼 추가
  let skipTurnButton = createButton('한수 쉼');
  skipTurnButton.position(50, height + 120);
  skipTurnButton.mousePressed(skipTurn);
  noLoop();

  // URL 파라미터에서 start_fen 값을 가져옴
  let start_fen = getURLParameter('start_fen');

  // start_fen 값이 없으면 하드 코딩된 기본 값 사용
  if (!start_fen) {
    start_fen = 'rnba1anbr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ANBR b - - 0 1';
  }

  first = start_fen.split(' ')[1];
  if (first == "w") {
    fen = start_fen.split(' ')[0];
    turn = first;
  } else {
    let test = start_fen.split(' ')[0];
    fen = test.split("").reverse().join("");
    turn = first;
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
  console.log('turn: ', turn);
}

function draw() {
  background(bg);
  drawCoordinates();

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

function switchTurn() {
  turn = (turn === 'w') ? 'b' : 'w';
}

function skipTurn() {
  switchTurn(); // 턴을 변경하여 한 수 쉼
}

function isValidMove(from, to) {
  // 현재 턴에 해당하는 플레이어의 기물만 이동 가능
  if (!isPlayerPiece(from)) return false;
  // 기물의 이동 규칙 확인
  return true;
}

function isPlayerPiece(piece) {
  // 현재 턴에 해당하는 플레이어의 기물인지 확인
  if (turn === 'w') {
    return piece === piece.toUpperCase(); // 대문자이면 'w'
  } else {
    return piece === piece.toLowerCase(); // 소문자이면 'b'
  }
}


function isSameTeam(piece1, piece2) {
  if (!piece1 || !piece2) return false;
  return (piece1.toLowerCase() === piece1 && piece2.toLowerCase() === piece2) ||
         (piece1.toUpperCase() === piece1 && piece2.toUpperCase() === piece2);
}

function drawCoordinates() {
  textSize(20);
  fill(0);
  
  if (first === 'w') {
    // 왼쪽에서 오른쪽으로 a부터 i까지
    for (let i = 0; i < 9; i++) {
      text(String.fromCharCode(97 + i), i * (width / 9) + (width / 18), height - 10);
    }
    // 아래에서 위로 1부터 10까지
    for (let j = 0; j < 10; j++) {
      text(10 - j, 10, j * (height / 10) + (height / 20));
    }
  } else {
    // 오른쪽에서 왼쪽으로 a부터 i까지
    for (let i = 0; i < 9; i++) {
      text(String.fromCharCode(97 + i), (8 - i) * (width / 9) + (width / 18), height - 10);
    }
    // 위에서 아래로 1부터 10까지 (보드 이미지 우측에 표시)
    for (let j = 0; j < 10; j++) {
      text(j + 1, width - 30, j * (height / 10) + (height / 20));
    }
    // 위쪽에 i부터 a까지
    for (let i = 0; i < 9; i++) {
      text(String.fromCharCode(105 - i), i * (width / 9) + (width / 18), 20);
    }
  }
}



// 궁 (K), 사 (A)
function canMoveKing(from, to) {
  // 궁성 내 좌표
  const palace = [
    {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
    {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1},
    {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
    {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7},
    {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8},
    {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}
  ];

  // 궁성 내에 있는지 확인
  const isInPalace = (pos) => palace.some(p => p.x === pos.x && p.y === pos.y);

  // 상하좌우 한 칸 이동
  const isOneStepMove = (Math.abs(from.x - to.x) === 1 && from.y === to.y) ||
                        (Math.abs(from.y - to.y) === 1 && from.x === to.x);

  // 사선 이동
  const isDiagonalMove =                     
                         (from.x === 3 && from.y === 0 && to.x === 4 && to.y === 1) ||
                         (from.x === 5 && from.y === 0 && to.x === 4 && to.y === 1) ||
                         (from.x === 3 && from.y === 2 && to.x === 4 && to.y === 1) ||
                         (from.x === 5 && from.y === 2 && to.x === 4 && to.y === 1) ||
                         (from.x === 4 && from.y === 1 && to.x === 3 && to.y === 0) ||
                         (from.x === 4 && from.y === 1 && to.x === 5 && to.y === 0) ||
                         (from.x === 4 && from.y === 1 && to.x === 3 && to.y === 2) ||
                         (from.x === 4 && from.y === 1 && to.x === 5 && to.y === 2) ||

                         (from.x === 3 && from.y === 9 && to.x === 4 && to.y === 8) ||
                         (from.x === 5 && from.y === 9 && to.x === 4 && to.y === 8) ||
                         (from.x === 3 && from.y === 7 && to.x === 4 && to.y === 8) ||
                         (from.x === 5 && from.y === 7 && to.x === 4 && to.y === 8) ||
                         (from.x === 4 && from.y === 8 && to.x === 3 && to.y === 9) ||
                         (from.x === 4 && from.y === 8 && to.x === 5 && to.y === 9) ||
                         (from.x === 4 && from.y === 8 && to.x === 3 && to.y === 7) ||
                         (from.x === 4 && from.y === 8 && to.x === 5 && to.y === 7);
              

  return isInPalace(from) && isInPalace(to) && (isOneStepMove || isDiagonalMove);
}

// 차 (R)
function canMoveRook(from, to, board) {
  // 궁성 내 좌표
  const palace = [
    {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
    {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1},
    {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
    {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7},
    {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8},
    {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}
  ];

  // 궁성 내에 있는지 확인
  const isInPalace = (pos) => palace.some(p => p.x === pos.x && p.y === pos.y);

  // 장기판 범위 내에 있는지 확인
  const isWithinBoard = (pos) => pos.x >= 0 && pos.x < board[0].length && pos.y >= 0 && pos.y < board.length;

  // 가로 또는 세로로 이동, 중간에 장애물이 없어야 함
  if (from.x === to.x) {
    for (let y = Math.min(from.y, to.y) + 1; y < Math.max(from.y, to.y); y++) {
      if (board[y][from.x] !== ' ') return false;
    }
    return isWithinBoard(to);
  } else if (from.y === to.y) {
    for (let x = Math.min(from.x, to.x) + 1; x < Math.max(from.x, to.x); x++) {
      if (board[from.y][x] !== ' ') return false;
    }
    return isWithinBoard(to);
  }

  // 궁성 내에서 사선 이동
  const isDiagonalMove =                     
  (from.x === 3 && from.y === 0 && to.x === 4 && to.y === 1) ||
  (from.x === 3 && from.y === 0 && to.x === 5 && to.y === 2) ||
  (from.x === 5 && from.y === 0 && to.x === 4 && to.y === 1) ||
  (from.x === 5 && from.y === 0 && to.x === 3 && to.y === 2) ||
  (from.x === 3 && from.y === 2 && to.x === 4 && to.y === 1) ||
  (from.x === 3 && from.y === 2 && to.x === 5 && to.y === 0) ||

  (from.x === 5 && from.y === 2 && to.x === 4 && to.y === 1) ||
  (from.x === 5 && from.y === 2 && to.x === 3 && to.y === 0) ||

  (from.x === 4 && from.y === 1 && to.x === 3 && to.y === 0) ||
  (from.x === 4 && from.y === 1 && to.x === 5 && to.y === 0) ||
  (from.x === 4 && from.y === 1 && to.x === 3 && to.y === 2) ||
  (from.x === 4 && from.y === 1 && to.x === 5 && to.y === 2) ||

  (from.x === 3 && from.y === 9 && to.x === 4 && to.y === 8) ||
  (from.x === 3 && from.y === 9 && to.x === 5 && to.y === 7) ||

  (from.x === 5 && from.y === 9 && to.x === 4 && to.y === 8) ||
  (from.x === 5 && from.y === 9 && to.x === 3 && to.y === 7) ||

  (from.x === 3 && from.y === 7 && to.x === 4 && to.y === 8) ||
  (from.x === 3 && from.y === 7 && to.x === 5 && to.y === 9) ||

  (from.x === 5 && from.y === 7 && to.x === 4 && to.y === 8) ||
  (from.x === 5 && from.y === 7 && to.x === 3 && to.y === 9) ||

  (from.x === 4 && from.y === 8 && to.x === 3 && to.y === 9) ||
  (from.x === 4 && from.y === 8 && to.x === 5 && to.y === 9) ||
  (from.x === 4 && from.y === 8 && to.x === 3 && to.y === 7) ||
  (from.x === 4 && from.y === 8 && to.x === 5 && to.y === 7);

  return isInPalace(from) && isInPalace(to) && isDiagonalMove && isWithinBoard(to);
}


// 한 병(P)의 이동 규칙
function canMovePawnW(from, to, board) {

  if(first === 'w'){
     // 장기판 범위 내에 있는지 확인
    const isWithinBoard = (pos) => pos.x >= 0 && pos.x < board[0].length && pos.y >= 0 && pos.y < board.length;
      // 궁성 내 좌표
    const palace = [
      {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
      {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1},
      {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
      {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7},
      {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8},
      {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}
    ];

      // 궁성 내에 있는지 확인
    const isInPalace = (pos) => palace.some(p => p.x === pos.x && p.y === pos.y);

      // 기본 이동 규칙: 한 칸 전진, 좌우 이동
    const isBasicMove = (from.x === to.x && from.y - 1 === to.y) || 
                        (from.y === to.y && Math.abs(from.x - to.x) === 1);

     // 궁성 내에서 사선 이동
    const isDiagonalMove = isInPalace(from) && isInPalace(to) && 
                            (
                            (from.x === 3 && from.y === 2 && to.x === 4 && to.y === 1) ||
                            
                            (from.x === 5 && from.y === 2 && to.x === 4 && to.y === 1) ||
                            
                            (from.x === 4 && from.y === 1 && to.x === 3 && to.y === 0) ||
                            (from.x === 4 && from.y === 1 && to.x === 5 && to.y === 0));

    return isWithinBoard(to) && (isBasicMove || isDiagonalMove);

  }else{
    // 장기판 범위 내에 있는지 확인
    const isWithinBoard = (pos) => pos.x >= 0 && pos.x < board[0].length && pos.y >= 0 && pos.y < board.length;
      // 궁성 내 좌표
    const palace = [
      {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
      {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1},
      {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
      {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7},
      {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8},
      {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}
    ];

      // 궁성 내에 있는지 확인
    const isInPalace = (pos) => palace.some(p => p.x === pos.x && p.y === pos.y);

      // 기본 이동 규칙: 한 칸 전진, 좌우 이동
    const isBasicMove = (from.x === to.x && from.y + 1 === to.y) || 
                        (from.y === to.y && Math.abs(from.x - to.x) === 1);

     // 궁성 내에서 사선 이동
    const isDiagonalMove = isInPalace(from) && isInPalace(to) && 
                            (
                            (from.x === 3 && from.y === 7 && to.x === 4 && to.y === 8) ||
                            
                            (from.x === 5 && from.y === 7 && to.x === 4 && to.y === 8) ||
                            
                            (from.x === 4 && from.y === 8 && to.x === 3 && to.y === 9) ||
                            (from.x === 4 && from.y === 8 && to.x === 5 && to.y === 9));

    return isWithinBoard(to) && (isBasicMove || isDiagonalMove);
  }

}

// 초 졸(p)의 이동 규칙
function canMovePawnB(from, to, board) {

  if(first === 'b'){
     // 장기판 범위 내에 있는지 확인
    const isWithinBoard = (pos) => pos.x >= 0 && pos.x < board[0].length && pos.y >= 0 && pos.y < board.length;
      // 궁성 내 좌표
    const palace = [
      {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
      {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1},
      {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
      {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7},
      {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8},
      {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}
    ];

      // 궁성 내에 있는지 확인
    const isInPalace = (pos) => palace.some(p => p.x === pos.x && p.y === pos.y);

      // 기본 이동 규칙: 한 칸 전진, 좌우 이동
    const isBasicMove = (from.x === to.x && from.y - 1 === to.y) || 
                        (from.y === to.y && Math.abs(from.x - to.x) === 1);

     // 궁성 내에서 사선 이동
    const isDiagonalMove = isInPalace(from) && isInPalace(to) && 
                            (
                            (from.x === 3 && from.y === 2 && to.x === 4 && to.y === 1) ||
                            
                            (from.x === 5 && from.y === 2 && to.x === 4 && to.y === 1) ||
                            
                            (from.x === 4 && from.y === 1 && to.x === 3 && to.y === 0) ||
                            (from.x === 4 && from.y === 1 && to.x === 5 && to.y === 0));

    return isWithinBoard(to) && (isBasicMove || isDiagonalMove);

  }else{
    // 장기판 범위 내에 있는지 확인
    const isWithinBoard = (pos) => pos.x >= 0 && pos.x < board[0].length && pos.y >= 0 && pos.y < board.length;
      // 궁성 내 좌표
    const palace = [
      {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
      {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1},
      {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
      {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7},
      {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8},
      {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}
    ];

      // 궁성 내에 있는지 확인
    const isInPalace = (pos) => palace.some(p => p.x === pos.x && p.y === pos.y);

      // 기본 이동 규칙: 한 칸 전진, 좌우 이동
    const isBasicMove = (from.x === to.x && from.y + 1 === to.y) || 
                        (from.y === to.y && Math.abs(from.x - to.x) === 1);

     // 궁성 내에서 사선 이동
    const isDiagonalMove = isInPalace(from) && isInPalace(to) && 
                            (
                            (from.x === 3 && from.y === 7 && to.x === 4 && to.y === 8) ||
                            
                            (from.x === 5 && from.y === 7 && to.x === 4 && to.y === 8) ||
                            
                            (from.x === 4 && from.y === 8 && to.x === 3 && to.y === 9) ||
                            (from.x === 4 && from.y === 8 && to.x === 5 && to.y === 9));

    return isWithinBoard(to) && (isBasicMove || isDiagonalMove);
  }

}

// 마(N)의 이동 규칙
function canMoveKnight(from, to, board) {
  // 장기판 범위 내에 있는지 확인
  const isWithinBoard = (pos) => pos.x >= 0 && pos.x < board[0].length && pos.y >= 0 && pos.y < board.length;

  // 한 칸 직선 이동 후 대각선 한 칸 이동
  const isLMove = (Math.abs(from.x - to.x) === 2 && Math.abs(from.y - to.y) === 1) ||
                  (Math.abs(from.x - to.x) === 1 && Math.abs(from.y - to.y) === 2);

  // 이동 경로에 장애물이 없어야 함
  let isPathClear = false;
  if (Math.abs(from.x - to.x) === 2 && Math.abs(from.y - to.y) === 1) {
    const midX = from.x + (to.x - from.x) / 2;
    isPathClear = board[from.y][midX] === ' ';
  } else if (Math.abs(from.x - to.x) === 1 && Math.abs(from.y - to.y) === 2) {
    const midY = from.y + (to.y - from.y) / 2;
    isPathClear = board[midY][from.x] === ' ';
  }

  return isWithinBoard(to) && isLMove && isPathClear;
}

// 상(B)의 이동 규칙
function canMoveElephant(from, to, board) {
   // 장기판 범위 내에 있는지 확인
   const isWithinBoard = (pos) => pos.x >= 0 && pos.x < board[0].length && pos.y >= 0 && pos.y < board.length;

    // 한 칸 직선 이동 후 대각선 한 칸 이동
  const isLMove = (Math.abs(from.x - to.x) === 3 && Math.abs(from.y - to.y) === 2) ||
  (Math.abs(from.x - to.x) === 2 && Math.abs(from.y - to.y) === 3);

    // 이동 경로에 장애물이 없어야 함
    let isPathClear = true;
    if (isLMove) {
      // 직선 이동 후 대각선 이동 경로에 장애물이 없어야 함
      if (from.x + 2 === to.x && from.y + 3 === to.y) {
        
        isPathClear = board[from.y + 1][from.x] === ' ' && board[from.y + 2][from.x + 1] === ' ';
      } else if (from.x - 2 === to.x && from.y + 3 === to.y) {
        
        isPathClear = board[from.y + 1][from.x] === ' ' && board[from.y + 2][from.x - 1] === ' ';
      } else if (from.x + 2 === to.x && from.y - 3 === to.y) {
        
        isPathClear = board[from.y - 1][from.x] === ' ' && board[from.y - 2][from.x + 1] === ' ';
      } else if (from.x - 2 === to.x && from.y - 3 === to.y) {
        
        isPathClear = board[from.y - 1][from.x] === ' ' && board[from.y - 2][from.x - 1] === ' ';
      }else if (from.x + 3 === to.x && from.y + 2 === to.y) {
        
        isPathClear = board[from.y][from.x + 1] === ' ' && board[from.y + 1][from.x + 2] === ' ';
      }else if (from.x - 3 === to.x && from.y - 2 === to.y) {
        
        isPathClear = board[from.y][from.x - 1] === ' ' && board[from.y - 1][from.x - 2] === ' ';
      }else if (from.x + 3 === to.x && from.y - 2 === to.y) {
        
        isPathClear = board[from.y][from.x + 1] === ' ' && board[from.y - 1][from.x + 2] === ' ';
      }else if (from.x - 3 === to.x && from.y + 2 === to.y) {
        
        isPathClear = board[from.y][from.x - 1] === ' ' && board[from.y + 1][from.x - 2] === ' ';
      }
    }
  return isWithinBoard(to) && isLMove && isPathClear;

}

// 포(C)의 이동 규칙
function canMoveCannon(from, to, board) {
   // 궁성 내 좌표
   const palace = [
    {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
    {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1},
    {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
    {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7},
    {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8},
    {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}
  ];

  // 궁성 내에 있는지 확인
  const isInPalace = (pos) => palace.some(p => p.x === pos.x && p.y === pos.y);

  // 장기판 범위 내에 있는지 확인
  const isWithinBoard = (pos) => pos.x >= 0 && pos.x < board[0].length && pos.y >= 0 && pos.y < board.length;
  
  // 궁성 내에서 사선 이동 확인
  if (isInPalace(from) && isInPalace(to)) {
    const dx = Math.abs(from.x - to.x);
    const dy = Math.abs(from.y - to.y);
    if (dx === dy) {
      // 사선 이동 시 중간에 장애물이 있는지 확인
      const stepX = (to.x - from.x) / dx;
      const stepY = (to.y - from.y) / dy;
      let x = from.x + stepX;
      let y = from.y + stepY;
      let obstacleCount = 0;
      while (x !== to.x && y !== to.y) {
        if (board[y][x] !== ' ') {
          if (board[y][x] === 'c' || board[y][x] === 'C') return false; // 중간에 다른 포가 있으면 안됨
          obstacleCount++;
        }
        x += stepX;
        y += stepY;
      }
      // 도착 지점에 상대방의 포가 있는지 확인
      if (board[to.y][to.x] === 'c' || board[to.y][to.x] === 'C') return false;
      return obstacleCount === 1 && isWithinBoard(to); // 중간에 하나의 장애물이 있어야 함
    }
  }

  // 가로 또는 세로로 이동
  if (from.x === to.x) {
    let obstacleCount = 0;
    for (let y = Math.min(from.y, to.y) + 1; y < Math.max(from.y, to.y); y++) {
      if (board[y][from.x] !== ' ') {
        if (board[y][from.x] === 'c' || board[y][from.x] === 'C') return false; // 중간에 다른 포가 있으면 안됨
        obstacleCount++;
      }
    }
    // 도착 지점에 상대방의 포가 있는지 확인
    if (board[to.y][to.x] === 'c' || board[to.y][to.x] === 'C') return false;
    return obstacleCount === 1 && isWithinBoard(to); // 중간에 하나의 장애물이 있어야 함
  } else if (from.y === to.y) {
    let obstacleCount = 0;
    for (let x = Math.min(from.x, to.x) + 1; x < Math.max(from.x, to.x); x++) {
      if (board[from.y][x] !== ' ') {
        if (board[from.y][x] === 'c' || board[from.y][x] === 'C') return false; // 중간에 다른 포가 있으면 안됨
        obstacleCount++;
      }
    }
    // 도착 지점에 상대방의 포가 있는지 확인
    if (board[to.y][to.x] === 'c' || board[to.y][to.x] === 'C') return false;
    return obstacleCount === 1 && isWithinBoard(to); // 중간에 하나의 장애물이 있어야 함
  }
  return false;
}



function canMove(piece, from, to, board) {
  switch (piece) {
    case 'k':
    case 'K':
    case 'a':
    case 'A':
      return canMoveKing(from, to);
    case 'r':
    case 'R':
      return canMoveRook(from, to, board);
    case 'n':
    case 'N':
      return canMoveKnight(from, to, board);
    case 'b':
    case 'B':
      return canMoveElephant(from, to, board);
    case 'p':
      return canMovePawnB(from, to, board);
    case 'P':
      return canMovePawnW(from, to, board);
    case 'c':
    case 'C':
      return canMoveCannon(from, to, board);
    default:
      return false;
  }
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
      // 이동 가능 여부 확인
      if (canMove(selectedPieceType, {x: selectedPiece.i, y: selectedPiece.j}, {x: i, y: j}, board)) {
        board[j][i] = selectedPieceType;
        board[selectedPiece.j][selectedPiece.i] = ' ';
        selectedPiece = null;
        switchTurn(); // 턴 변경
        redraw();
      }
    }
  } else if (board[j][i] in images) {
    if(isPlayerPiece(board[j][i])){
      selectedPiece = {i, j};
      redraw(); // 선택된 기물을 표시하기 위해 화면을 다시 그립니다.
    }
   
  }
  
  console.log(selectedPiece);
  console.log(board);
}
