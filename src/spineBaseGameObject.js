/**
 * @author       Ruben García Vilà
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 */
export default class SpineBaseGameObject extends Phaser.PIXI.DisplayObject {
  constructor(game, x, y) {
    super(game);
    this.x = x || 0;
    this.y = y || 0;
    this.type = Phaser.SPRITE;
    this.physicsType = Phaser.SPRITE;

    Phaser.Component.Core.init.call(this, game, x, y);
  }

  get width() {
    return this.getBounds().width * this.scale.x;
  }

  set width(value) {
    const { width } = this.getBounds();

    if (width !== 0) {
      this.scale.x = value / width;
    } else {
      this.scale.x = 1;
    }

    this._width = value;
  }

  get height() {
    return this.getBounds().height * this.scale.y;
  }

  set height(value) {
    const { height } = this.getBounds();

    if (height !== 0) {
      this.scale.y = value / height;
    } else {
      this.scale.y = 1;
    }

    this._height = value;
  }
}

Phaser.Component.Core.install.call(SpineBaseGameObject.prototype, [
  'Angle',
  /* 'Animation', */
  'AutoCull',
  'Bounds',
  'BringToTop',
  /* 'Crop', */
  'Delta',
  'Destroy',
  'FixedToCamera',
  /* 'Health', */
  'InCamera',
  'InputEnabled',
  'InWorld',
  /* 'LifeSpan', */
  /* 'LoadTexture', */
  'Overlap',
  'PhysicsBody',
  'Reset'
  /* 'ScaleMinMax', */
  /* 'Smoothed' */
]);

SpineBaseGameObject.prototype.preUpdatePhysics = Phaser.Component.PhysicsBody.preUpdate;
SpineBaseGameObject.prototype.preUpdateLifeSpan = Phaser.Component.LifeSpan.preUpdate;
SpineBaseGameObject.prototype.preUpdateInWorld = Phaser.Component.InWorld.preUpdate;
SpineBaseGameObject.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

SpineBaseGameObject.prototype.preUpdate = function preUpdate() {
  if (!this.preUpdatePhysics() || !this.preUpdateLifeSpan() || !this.preUpdateInWorld()) {
    return false;
  }

  return this.preUpdateCore();
};
