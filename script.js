kaboom()

//Assets
loadSprite("mj", "images/mj.png");
loadSprite("bulls", "images/Bulls.png");
loadSprite("bg", "images/bg.png");
loadSprite("pipe", "images/pipe.png");
loadSprite("giphy", "images/giphy.gif");
loadSound("download", "audio/download.mp3");
loadSound("weak", "audio/weak.mp3");
loadSound("score", "audio/score.mp3");
loadSound("halo", "audio/halo.mp3");
let highScore = 0;
let hop = 400;
let gap = 180;

scene("easy", () => {
  hop = 400;
  gap = 180;
  go("game")
})


scene("medium", () => {
  hop = 350;
  gap = 120;
  go("game")
})

scene("hard", () => {
  hop = 280;
  gap = 100;
  go("game")
})


scene("intro", () => {
  add([
    sprite("bg", {width: width(), height: height()})
  ]);
  add([
    text(
      "Start (Press Space Bar for easy)\n"
      + "(press enter for meduim)\n"+
      "(press tab for hard)",
      {size: 45}
    )
    

  ]);

  keyPress("space", () => {
    go("easy");
  });

  keyPress("enter", () => {
    go("medium");
  });

  keyPress("tab", () => {
    go("hard");
  });

  
});

scene("game", () => {
  let PIPE_GAP = gap;
  let score = 0;


  add([
    sprite("bulls", {width: width(), height: height()})
  ]);

  const scoreText = add([
    text(score, {size: 50})
  ]);

  // add a game object to screen
  const player = add([
    // list of components
    sprite("mj"),
    scale(.07),
    pos(80, 40),
    area(),
    body(),
  ]);

  function producePipes(){
    const offset = rand(-80, 80);

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
      play("score")
    }
  });

  player.collides("pipe", () => {
    play("weak");
    go("gameover", score);
  });

  player.action(() => {
    if (player.pos.y > height() + 120 || player.pos.y < -120) {
      play("halo");
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
    sprite("giphy", {width: width(), height: height()})
  ]);
  add([
    text(
      "gameover!\n"
      + "score: " + score
      + "\nhigh score: " + highScore + "\n(press space to try again)" + 
      "\n(press enter to main menu)",
      {size: 45}
    )
  ]);

  keyPress("space", () => {
    go("game");
  });

  keyPress("enter", () => {
    highScore = 0;
    go("intro");
  });

});

go("intro");