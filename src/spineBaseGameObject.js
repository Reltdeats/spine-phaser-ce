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
