import ExampleObject from '../objects/exampleObject';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.Image;
  ship1: Phaser.GameObjects.Image;
  ship2: Phaser.GameObjects.Image;
  ship3: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.image(0,0,"background");
    this.background.setOrigin(0,0);

    this.ship1 = this.add.image(this.scale.width / 2 - 50, this.scale.height / 2, "ship");
    this.ship2 = this.add.image(this.scale.width / 2, this.scale.height / 2, "ship2");
    this.ship3 = this.add.image(this.scale.width / 2 + 50, this.scale.height / 2, "ship3");

    this.add.text(20,20, "This is the Game");
    this.exampleObject = new ExampleObject(this, 0, 0);
  }

  update() {
  }
}