/**
 * @author       Ruben García Vilà
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 */
import { AnimationState, AnimationStateData, SkeletonBounds } from '@esotericsoftware/spine-core';
import SpineBaseGameObject from './spineBaseGameObject';
import SpineSkeleton from './spineSkeleton';
import SpineUtils from './spineUtils';

export default class SpineGameObject extends SpineBaseGameObject {
  constructor(game, plugin, x, y, key, premultipliedAlpha = false) {
    super(game, x, y);
    this.key = key;
    this.game = game;
    this.plugin = plugin;
    this.premultipliedAlpha = premultipliedAlpha;
    this.scaleMode = Phaser.PIXI.scaleModes.LINEAR;
    this.utils = new SpineUtils();

    this.debug = false;
    this.enableCanvasMesh = false;

    this._setCallbacks();
    this._setSpine();
  }

  _setCallbacks() {
    this.beforeUpdateWorldTransforms = () => { };
    this.afterUpdateWorldTransforms = () => { };
  }

  _setSpine() {
    this.skeleton = new SpineSkeleton(this.game, this.plugin, this.key, this).skeleton;
    this.animationStateData = new AnimationStateData(this.skeleton.data);
    this.animationState = new AnimationState(this.animationStateData);
    this.skeletonBounds = new SkeletonBounds();
    this.spineBounds = SpineUtils.calculateBounds(this);
  }

  _checkSpine() {
    return (
      !this.inCamera
      || !this.visible
      || this.alpha <= 0
      || !this.skeleton
      || !this.animationState
    );
  }

  getBounds() {
    const bounds = this._bounds;

    const w0 = this.spineBounds.x;
    const w1 = this.spineBounds.width + w0;

    const h0 = this.spineBounds.y;
    const h1 = this.spineBounds.height + h0;

    const { a, b, c, d, tx, ty } = this.worldTransform;

    const x1 = a * w1 + c * h1 + tx;
    const y1 = d * h1 + b * w1 + ty;

    const x2 = a * w0 + c * h1 + tx;
    const y2 = d * h1 + b * w0 + ty;

    const x3 = a * w0 + c * h0 + tx;
    const y3 = d * h0 + b * w0 + ty;

    const x4 = a * w1 + c * h0 + tx;
    const y4 = d * h0 + b * w1 + ty;

    const maxX = Math.max(x1, x2, x3, x4);
    const maxY = Math.max(y1, y2, y3, y4);

    const minX = Math.min(x1, x2, x3, x4);
    const minY = Math.min(y1, y2, y3, y4);

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    return bounds;
  }

  /* Rebuilds to replace current spine */
  replaceSpine(key) {
    this.key = key;
    this._setSpine();
  }

  preUpdate() {
    /* super.preUpdate(); */
    if (this._checkSpine()) return;
    this.updatePose(this.game.time.delta);
  }

  update() {
    /* super.update(); */
  }

  postUpdate() {
    // This object cant have children to postUpdate, so we can skip super.postUpdate();
  }

  updatePose(delta) {
    this.animationState.update(delta / 1000);
    this.animationState.apply(this.skeleton);
    this.beforeUpdateWorldTransforms(this);
    this.skeleton.updateWorldTransform();
    this.afterUpdateWorldTransforms(this);
  }

  destroy() {
    this.destroyPhase = true;
    this.renderable = false;

    if (this.events) {
      this.events.onDestroy$dispatch(this);
    }

    if (this.parent) {
      if (this.parent instanceof Phaser.Group) {
        this.parent.remove(this);
      } else {
        this.parent.removeChild(this);
      }
    }

    if (this.input) {
      this.input.destroy();
    }

    if (this.transformCallback) {
      this.transformCallback = null;
      this.transformCallbackContext = null;
    }

    this.game.tweens.removeFrom(this);

    delete this.skeleton;
    delete this.animationStateData;
    delete this.animationState;
    delete this.skeletonBounds;
    delete this.spineBounds;
    delete this.beforeUpdateWorldTransforms;
    delete this.afterUpdateWorldTransforms;
    delete this.debug;
    delete this.enableCanvasMesh;
    delete this.utils;
    delete this.scaleMode;
    delete this.key;
    delete this.premultipliedAlpha;

    delete this.alive;
    delete this.exists;
    delete this.visible;
    delete this.filters;
    delete this.mask;
    delete this.game;
    delete this.data;

    delete this.hitArea;
    delete this.parent;
    delete this.stage;
    delete this.worldTransform;
    delete this.filterArea;
    delete this._bounds;
    delete this._currentBounds;
    delete this._mask;

    this._destroyCachedSprite();

    this.destroyPhase = false;
    this.pendingDestroy = false;
  }

  _renderWebGL(renderer) {
    if (this._checkSpine() || !this.plugin.webGLRenderer) return;

    const { currentBlendMode } = renderer.blendModeManager;
    const { currentShader } = renderer.shaderManager;
    renderer.spriteBatch.stop();
    for (let i = 0; i < renderer.shaderManager.attribState.length; i++) {
      renderer.shaderManager.attribState[i] = null;
      renderer.gl.disableVertexAttribArray(i);
    }

    const { a, b, c, d, tx, ty } = this.worldTransform;
    const sceneRenderer = this.plugin.webGLRenderer;

    if (this._mask) {
      renderer.maskManager.pushMask(this._mask, renderer);
    }

    if (this._filters) {
      renderer.filterManager.pushFilter(this._filterBlock);
    }

    // check blend mode
    /* if (this.blendMode && this.blendMode !== spriteBatch.currentBlendMode) {
      const blendModeWebGL = Phaser.PIXI.blendModesWebGL[spriteBatch.currentBlendMode];
      renderer.blendModeManager.setBlendMode(blendModeWebGL);
    } */

    sceneRenderer.begin();
    sceneRenderer.drawSkeleton(this.skeleton, this.premultipliedAlpha, -1, -1, (vertices, numVertices, stride) => {
      for (let i = 0; i < numVertices; i += stride) {
        const vx = vertices[i];
        const vy = vertices[i + 1];
        vertices[i] = vx * a + vy * c + tx;
        vertices[i + 1] = vx * b + vy * d + ty;
      }
    });

    sceneRenderer.end();

    if (this._filters) {
      renderer.filterManager.popFilter();
    }

    if (this._mask) {
      renderer.maskManager.popMask(this.mask, renderer);
    }

    renderer.drawCount++;

    renderer.blendModeManager.currentBlendMode = -1;
    renderer.blendModeManager.setBlendMode(currentBlendMode);
    renderer.gl.enable(renderer.gl.BLEND);
    renderer.shaderManager._currentId = null;
    renderer.shaderManager.setShader(currentShader);
    renderer.spriteBatch.start();

    if (this.debug) this._debug();
  }

  _renderCanvas(renderer) {
    if (this._checkSpine() || !this.plugin.canvasRenderer) return;

    const { context } = renderer;
    const { a, b, c, d, tx, ty } = this.worldTransform;
    const { skeleton } = this;
    const skeletonRenderer = this.plugin.canvasRenderer;

    context.setTransform(a, b, c, d, tx, ty);

    if (this.blendMode && this.blendMode !== renderer.currentBlendMode) {
      renderer.currentBlendMode = this.blendMode;
      renderer.context.globalCompositeOperation = Phaser.PIXI.blendModesCanvas[renderer.currentBlendMode];
    }

    if (this._mask) {
      renderer.maskManager.pushMask(this._mask, renderer);
    }

    if (renderer.smoothProperty && renderer.scaleMode !== this.scaleMode) {
      renderer.scaleMode = this.scaleMode;
      renderer.context[renderer.smoothProperty] = (renderer.scaleMode === Phaser.PIXI.scaleModes.LINEAR);
    }

    if (this.debug) this._debug();
    skeletonRenderer.debugRendering = this.debug;
    skeletonRenderer.triangleRendering = this.enableCanvasMesh;

    context.save();
    skeletonRenderer.ctx = context;
    skeletonRenderer.draw(skeleton);
    context.restore();

    if (this._mask) {
      renderer.maskManager.popMask(renderer);
    }
  }

  _debug() {
    this.game.debug.spriteBounds(this);
  }
}
