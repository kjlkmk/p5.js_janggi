let pieces = [];

function setup() {
  // 장기알 객체를 생성하고 배열에 추가
  pieces.push({
    img: cho_gung,
    x: coords.e9[0],
    y: coords.e9[1],
    width: cho_gung.width * 3 / 5,
    height: cho_gung.height * 3 / 5
  });
  // 나머지 장기알도 추가...
}

function draw() {
  image(board, 250, 278);
  
  // 각 장기알을 그림
  for (let piece of pieces) {
    image(piece.img, piece.x, piece.y, piece.width, piece.height);
  }
}

function mousePressed() {
  // 클릭된 장기알을 찾음
  for (let piece of pieces) {
    let d = dist(mouseX, mouseY, piece.x, piece.y);
    if (d < piece.width / 2) {
      // 장기알을 이동시킴
      piece.x = mouseX;
      piece.y = mouseY;
      break;
    }
  }
}
