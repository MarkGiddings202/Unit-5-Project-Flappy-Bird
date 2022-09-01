kaboom()

//Assets
loadSprite("birdy", "images/birdy.png");
loadSprite("bg", "images/bg.png");
loadSprite("pipe", "images/pipe.png");
loadSound("download", "audio/download.mp3");
loadSound("weak", "audio/weak.mp3");
loadSound("score", "audio/score.mp3");

let highScore = 0;
let hop = 400

scene("intro", () => {
  add([
    text(
      "Start (Press Space Bar)!\n",
      {size: 45}
    )
  ]);

  keyPress("space", () => {
    go("game");
  });
});

scene("game", () => {
  const PIPE_GAP = 140;
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
    scale(3),
    pos(80, 40),
    area(),
    body(),
  ]);

  function producePipes(){
    const offset = rand(-200, 200);

    add([
      sprite("pipe"),
      scale(3),
      pos(width(), height()/2 + offset + PIPE_GAP/2),
      "pipe",
      area(),
      {passed: false}
    ]);

    add([
      sprite("pipe", {flipY: true}),
      scale(3),
      pos(width(), height()/2 + offset - PIPE_GAP/2),
      origin("botleft"),
      "pipe",
      area()
    ]);
  }

  loop(1.5, () => {
    producePipes();
  });
 // pipe speed
  action("pipe", (pipe) => {
         // x-axis y-axis
    pipe.move(-160, 0);

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score;
    }
  });

  player.collides("pipe", () => {
    play("weak");
    go("gameover", score);
  });

  player.action(() => {
    if (player.pos.y > height() + 30 || player.pos.y < -30) {
      go("gameover", score);
    }
  });

  keyPress("space", () => {
    play("download"); 
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

go("intro");