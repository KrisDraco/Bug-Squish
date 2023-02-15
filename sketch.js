let spriteSheet;
let bugs;

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};

let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 10, state: GameState.Start};

function preload() {
  spriteSheet = loadImage("bug2.png");
}

function setup() {
  createCanvas(640, 480);
  imageMode(CENTER);
  reset();
}

function reset() {
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(10,20);

  animations = [];
  let move = 1;
  for (let i = 0; i < game.totalSprites; i++) {
    animations[i] = new bug(spriteSheet, 32, 32, random(100,400), random(100,400), 2, move);
    move = -move;
  }
}

function draw() {
  switch (game.state) {
    case GameState.Playing:
      background(255);
      for(let i=0; i < animations.length; i++) {
        animations[i].draw();
      }
      fill(0);
      textSize(40);
      text(game.score,20,40);
      let currentTime = game.maxTime - game.elapsedTime;
      text(ceil(currentTime), 300,40);
      game.elapsedTime += deltaTime / 1000;

      if (currentTime < 0)
        game.state = GameState.GameOver;
      break;

    case GameState.GameOver:
      game.maxScore = max(game.score, game.maxScore)
      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("Game Over!", 200, 200);
      textSize(35);
      text("Score: " + game.score, 200, 270);
      text("Max Score: " +game.maxScore, 200, 320)

      break;
    case GameState.Start:
      background(0);
      fill(255);
      textSize(50);
      textAlign(CENTER);
      text("Bug Squish", 200, 200);
      textSize(30);
      text("Press Any Key To Start", 200, 300);
      
      break;
  }
}

function keyPressed() {
  switch (game.state) {
    
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

function mouseClicked() {
  switch (game.state) {
    case GameState.Playing:
      for (let i = 0; i < animations.length; i++) {
        let contains = animations[i].contains(mouseX, mouseY);
        if (contains) {
          if (animations[i].moving != 0) {
            animations[i].stop();
            game.score += 1;
          }
        }
      }
      break;
  }
}

class bug {
  constructor(spriteSheet, sw, sh, dx, dy, animationLength, moving) {
    this.spriteSheet = spriteSheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.moving = moving;
    this.frame = 0;
    this.facing = moving;
    
  }

  draw() {
    this.u = (this.moving != 0) ? this.frame % this.animationLength : this.u;

    push();
    translate(this.dx, this.dy);
    scale(this.facing,1);
    
    image(this.spriteSheet,0,0,this.sw,this.sh,this.u*this.sw,this.v*this.sh,this.sw,this.sh);
    pop();

    if (frameCount % 6 == 0) {
      this.frame++;
    }

    this.dx += this.moving;
    if (this.dx >= width - 25) {
      this.moving = -this.moving;
      this.facing = -this.facing;
    }
    if (this.dx <= 25) {
      this.moving = -this.moving;
      this.facing = -this.facing;
    }
  }

  contains(x,y) {
    let insideX = x >= this.dx - 12 && x <= this.dx + 12;
    let insideY = x >= this.dy - 12 && y <= this.dy + 12;
    return insideX && insideY;
  }
  
  stop() {
    this.moving = 0;
    this.u = 0;
    this.v = 1;
  }
}
