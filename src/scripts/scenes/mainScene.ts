import ExampleObject from '../objects/exampleObject';
import { gameSettings } from "../game";
import Beam from '../objects/beam';

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
  enemies: Phaser.Physics.Arcade.Group;
  

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

    this.add.text(20,20, "This is the Game",{
      font: "20px Arial",
      bold: true,
      color:"yellow"
    });

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

    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
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
    powerUp.disableBody(true, true);
  }

  hurtPlayer(player, enemy){
    this.resetShipPos(enemy);
    player.x = this.scale.width / 2 - 8;
    player.y = this.scale.height - 64;
  }

  hitEnemy(projectile, enemy){
    projectile.destroy();
    this.resetShipPos(enemy);
  }

  moveShip(ship, speed){
    ship.y += speed;
    if (ship.y > this.scale.height){
      this.resetShipPos(ship);
    }
  }
  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
      console.log("Fire!");
      this.shootBeam();
    }
    for(let i = 0; i< this.projectiles.getChildren().length; i++){
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
    this.background.tilePositionY -= 0.5;
  }

  movePlayerManager(){
    if(this.cursorKeys.left?.isDown){
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if(this.cursorKeys.right?.isDown){
      this.player.setVelocityX(gameSettings.playerSpeed);
    }
    if(this.cursorKeys.up?.isDown){
      this.player.setVelocityY(-gameSettings.playerSpeed);
    } else if(this.cursorKeys.down?.isDown){
      this.player.setVelocityY(gameSettings.playerSpeed);
    }
  }
  resetShipPos(ship){
    ship.y=0;
    var randomX = Phaser.Math.Between(0, this.scale.width);
    ship.x = randomX;
  }

  shootBeam(){
    var beam = new Beam(this);
  }
  destroyShip(pointer, gameObject){
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }
}