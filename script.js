kaboom()

//Assets
loadSprite("birdy", "images/birdy.png");
loadSprite("bg", "images/bg.png");
loadSprite("pipe", "images/pipe.png");
// loadSound("wooosh", "sounds/wooosh.mp3");
let highScore = 0;
 let hop = 400
scene("game", () => {
  const PIPE_GAP = 120;
  let score = 0;
 

  add([
    sprite("bg", {width: width(), height: height()})
  ]);

  const scoreText = add([
    text(score, {size: 50})
  ]);

  // add a game object to screen
  const player = add([
    // list of components
    sprite("birdy"),
    scale(2),
    pos(80, 40),
    area(),
    body(),
  ]);

  function producePipes(){
    const offset = rand(-50, 50);

    add([
      sprite("pipe"),
      pos(width(), height()/2 + offset + PIPE_GAP/2),
      "pipe",
      area(),
      {passed: false}
    ]);

    add([
      sprite("pipe", {flipY: true}),
      pos(width(), height()/2 + offset - PIPE_GAP/2),
      origin("botleft"),
      "pipe",
      area()
    ]);
  }

  loop(1.5, () => {
    producePipes();
  });

  action("pipe", (pipe) => {
    pipe.move(-160, 0);

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score;
    }
  });

  player.collides("pipe", () => {
    go("gameover", score);
  });

  player.action(() => {
    if (player.pos.y > height() + 30 || player.pos.y < -30) {
      go("gameover", score);
    }
  });

  keyPress("space", () => {
    // play("wooosh"); 
    player.jump(hop);
  });
});

scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score;
  }

  add([
    text(
      "gameover!\n"
      + "score: " + score
      + "\nhigh score: " + highScore,
      {size: 45}
    )
  ]);

  keyPress("space", () => {
    go("game");
  });
});

go("game");