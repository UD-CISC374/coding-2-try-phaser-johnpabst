import ExampleObject from '../objects/exampleObject';
import { gameSettings } from "../game";
import Beam from '../objects/beam';
import Explosion from '../objects/explosion';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private background: Phaser.GameObjects.TileSprite;
  private ship1: Phaser.GameObjects.Sprite;
  private ship2: Phaser.GameObjects.Sprite;
  private ship3: Phaser.GameObjects.Sprite;
  private player: Phaser.Physics.Arcade.Sprite;
  private projectiles: Phaser.GameObjects.Group;
  private powerUps: Phaser.Physics.Arcade.Group;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private spacebar: Phaser.Input.Keyboard.Key;
  private enemies: Phaser.Physics.Arcade.Group;
  private scoreLabel: Phaser.GameObjects.BitmapText;
  private score: number;
  private beamSound: Phaser.Sound.BaseSound;
  private explosionSound: Phaser.Sound.BaseSound;
  private pickupSound: Phaser.Sound.BaseSound;
  private music: Phaser.Sound.BaseSound;
  title: Phaser.GameObjects.BitmapText;
  

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0,0,this.scale.width, this.scale.height,"background");
    this.background.setOrigin(0,0);

    this.ship1 = this.add.sprite(this.scale.width / 2 - 50, this.scale.height / 2, "ship");
    this.ship2 = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "ship2");
    this.ship3 = this.add.sprite(this.scale.width / 2 + 50, this.scale.height / 2, "ship3");

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0,0);
    graphics.lineTo(this.scale.width, 0);
    graphics.lineTo(this.scale.height, 30);
    graphics.lineTo(0,30);
    graphics.lineTo(0,0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10,7,"pixelFont", "SCORE ", 20);
    this.title = this.add.bitmapText(150, 7, "pixelFont", "FUNKADELIC SHOOTER", 18);

    this.beamSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_explosion");
    this.pickupSound = this.sound.add("audio_pickup");

    this.music = this.sound.add("music");

    var musicConfig = {
      mute: false,
      volume: 1,
      rate:1,
      detune:0,
      seek:0,
      loop: false,
      delay: 0
    }
    
    this.music.play(musicConfig);

    this.powerUps = this.physics.add.group();

    var maxObjects = 4;
    for (var i =0; i<= maxObjects; i++){
      var powerUp = this.physics.add.sprite(16,16,"power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0,0,this.scale.width, this.scale.height);
      if (Math.random() > 0.5){
        powerUp.play("red");
      }
      else{
        powerUp.play("gray");
      }

      powerUp.setVelocity(100,100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on('gameobjectdown',this.destroyShip, this);

    this.player = this.physics.add.sprite(-this.scale.width + 32, this.scale.height / 2 + 8, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.projectiles = this.add.group();

    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile,powerUp){
      projectile.destroy();
    });

    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, undefined, this);

    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, undefined, this);

    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, undefined, this);
  }
  pickPowerUp(player, powerUp){
    this.pickupSound.play();
    powerUp.disableBody(true, true);
    this.score += 5;
    
    var scoreFormatted = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormatted;
  }

  hurtPlayer(player, enemy){
    this.explosionSound.play();
    this.resetShipPos(enemy);

    if(this.player.alpha < 1){
      return;
    }

    this.score -= 15;
    if (this.score < 0){
      this.scoreLabel.text = "SCORE " + this.score;
    }
    else {
      let scoreFormatted = this.zeroPad(this.score, 6);
      this.scoreLabel.text = "SCORE " + scoreFormatted;
    }

    let explosion = new Explosion(this, player.x, player.y);

    player.disableBody(true, true);

    //this.resetPlayer();
    this.time.addEvent({
      delay:1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

  resetPlayer(){
    let x = this.scale.width - 250;
    let y = this.scale.height / 2;
    this.player.enableBody(true,x,y,true,true);

    this.player.alpha = 0.5;

    var tween = this.tweens.add({
      targets: this.player,
      y: this.scale.height - 64,
      ease: 'Power1',
      duration: 1500,
      repeat:0,
      onComplete: () => {
        this.player.alpha = 1;
      },
      callbackScope: this
    });
  }

  zeroPad(number, size) {
    let stringNumber = String(number);
    while(stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  hitEnemy(projectile, enemy){
    this.explosionSound.play();
    let explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 15;
    
    var scoreFormatted = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormatted;
  }

  moveShip(ship, speed){
    ship.x -= speed;
    if (ship.x <= 0){
      this.resetShipPos(ship);
    }
  }
  update() {
    this.player.setVelocity(0);
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 1);

    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
      if(this.player.active){
        this.shootBeam();
      }
    }
    for(let i = 0; i< this.projectiles.getChildren().length; i++){
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
    this.background.tilePositionX += 0.5;
  }

  movePlayerManager(){
    if(this.cursorKeys.left?.isDown){
      this.player.setVelocityX(-gameSettings.playerSpeed);
      console.log();
    } else if(this.cursorKeys.right?.isDown){
      this.player.setVelocityX(gameSettings.playerSpeed);
      console.log("right");
    }
    if(this.cursorKeys.up?.isDown){
      this.player.setVelocityY(-gameSettings.playerSpeed);
      console.log("up");
    } else if(this.cursorKeys.down?.isDown){
      this.player.setVelocityY(gameSettings.playerSpeed);
      this.player.setVelocityY(gameSettings.playerSpeed);console.log("down");
    }
  }
  resetShipPos(ship){
    ship.x= this.scale.height;
    var randomY = Phaser.Math.Between(0, this.scale.height);
    ship.y = randomY;
  }

  shootBeam(){
    var beam = new Beam(this);
    this.beamSound.play();
  }
  destroyShip(pointer, gameObject){
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }
}