export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("background", "assets/psychedelic_bg.png");
    this.load.audio("audio_beam", ["assets/sounds/beam.ogg", "assets/sounds/beam.mp3"]);
    this.load.audio("audio_explosion", ["assets/sounds/explosion.ogg", "assets/sounds/explosion.mp3"]);
    this.load.audio("audio_pickup", ["assets/sounds/pickup.ogg", "assets/sounds/pickup.mp3"]);
    this.load.audio("music", "assets/sounds/earthbound_saturn_ness.mp3");

    // this.load.image("ship","assets/ship.png");
    // this.load.image("ship2","assets/ship2.png");
    // this.load.image("ship3","assets/ship3.png");

    this.load.spritesheet("frog", "assets/spritesheets/frog.png",{
      frameWidth: 27,
      frameHeight: 38
    });
    this.load.spritesheet("totodile", "assets/spritesheets/totodile.png",{
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("link", "assets/spritesheets/minishCap.png",{
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("power-up", "assets/spritesheets/power-up.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("player", "assets/spritesheets/nessBike.png",{
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("beam", "assets/spritesheets/beam.png",{
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.bitmapFont("pixelFont", "assets/font/font.png","assets/font/font.xml");
  }

  create() {
    this.add.text(20,20, "Loading Game...");
    this.scene.start('MainScene');

    this.anims.create({
      key:"ship1_anim",
      frames: this.anims.generateFrameNumbers("frog",{ start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key:"ship2_anim",
      frames: this.anims.generateFrameNumbers("totodile",{ start: 0, end: 2 }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key:"ship3_anim",
      frames: this.anims.generateFrameNumbers("link",{ start: 0, end: 10 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key:"explode",
      frames: this.anims.generateFrameNumbers("explosion",{ start: 0, end: 4 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key:"red",
      frames: this.anims.generateFrameNumbers("power-up",{ start: 0, end: 1 }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key:"gray",
      frames: this.anims.generateFrameNumbers("power-up",{ start: 2, end: 3 }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key:"thrust",
      frames: this.anims.generateFrameNumbers("player",{ start: 0, end: 1}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key:"beam_anim",
      frames: this.anims.generateFrameNumbers("beam",{ start: 0, end: 1}),
      frameRate: 20,
      repeat: -1
    });
  }
}
