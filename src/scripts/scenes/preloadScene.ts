export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("ship","assets/ship.png");
    this.load.image("ship2","assets/ship2.png");
    this.load.image("ship3","assets/ship3.png");

    this.load.spritesheet("ship", "assets/spritesheets/ship.png"),{
      frameWidth: 16,
      frameHeight: 16
    }
    this.load.spritesheet("ship2", "assets/spritesheets/ship2.png"),{
      frameWidth: 16,
      frameHeight: 16
    }
    this.load.spritesheet("ship3", "assets/spritesheets/ship3.png"),{
      frameWidth: 32,
      frameHeight: 32
    }
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png"),{
      frameWidth: 16,
      frameHeight: 16
    }
  }

  create() {
    this.add.text(20,20, "Loading Game...");
    this.scene.start('MainScene');

  }
}
