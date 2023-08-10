/**
 * @author       Ruben García Vilà
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 */
import { SceneRenderer } from '@esotericsoftware/spine-webgl';
import { SkeletonRenderer } from '@esotericsoftware/spine-canvas';
import SpineGameObject from './spineGameObject';

export default class SpinePlugin extends Phaser.Plugin {
  constructor(game, parent) {
    super(game, parent);
    this.game = game;
    this.pluginManager = parent;
    this.spineList = [];

    this._setFlags();
    this._rendererConfig();
    this._addSpineCache();
    this._addSpineLoader();
    this._addSpineFactory();
    this._addRenderers();
  }

  _setFlags() {
    this.hasPostRender = false;
    this.hasPostUpdate = false;
    this.hasPreUpdate = false;
    this.hasRender = false;
    this.hasUpdate = false;
  }

  _rendererConfig() {
    this.isWebGL = this.game.renderType === Phaser.WEBGL || this.game.renderType === Phaser.WEBGL_MULTI;
    this.gl = this.isWebGL ? this.game.renderer.gl : null;
    this.webGLRenderer = null;
    this.canvasRenderer = null;
  }

  _addSpineCache() {
    Phaser.Cache.prototype.addCustom = function addCustom(key) {
      this._cache[key] = {};
      this[key.toUpperCase()] = this._cacheMap.length;
      this._cacheMap[this[key.toUpperCase()]] = this._cache[key];

      const keyIdx = this[key.toUpperCase()];
      const methodName = key.charAt(0).toUpperCase() + key.slice(1);

      Phaser.Cache.prototype[`add${methodName}`] = function add(str, data) {
        this._cache[key][str] = data;
      };

      Phaser.Cache.prototype[`check${methodName}`] = function check(str) {
        return this.checkKey(keyIdx, str);
      };

      Phaser.Cache.prototype[`get${methodName}`] = function get(str) {
        return this.getItem(str, keyIdx, `get${methodName}`);
      };
    };

    this.skeletonDataCache = this.game.cache.addCustom('spineSkeleton');
    this.atlasCache = this.game.cache.addCustom('spineAtlas');
  }

  _addSpineLoader() {
    Phaser.Loader.prototype.spine = function spine(key, spineFiles, overwrite) {
      this.text(`${key}-text`, spineFiles.atlas, overwrite);

      if (spineFiles.json) this.json(`${key}-json`, spineFiles.json);
      if (spineFiles.binary) this.binary(`${key}-binary`, spineFiles.binary);

      if (spineFiles.image) {
        this.image(`${key}-image`, spineFiles.image, overwrite);
      } else {
        for (const image in spineFiles.images) {
          if (Object.prototype.hasOwnProperty.call(spineFiles.images, image)) {
            this.image(`${key}-${image.toLocaleLowerCase()}`, spineFiles.images[image], overwrite);
          }
        }
      }

      return this;
    };
  }

  _addSpineFactory() {
    const self = this;
    Phaser.GameObjectFactory.prototype.spine = function spine(x, y, key, group, premultipliedAlpha) {
      if (premultipliedAlpha === void 0) { premultipliedAlpha = false; }
      if (group === undefined) {
        group = this.world;
      }
      const spineObject = new SpineGameObject(this.game, self, x, y, key, premultipliedAlpha);
      self.spineList.push(spineObject);
      return group.add(spineObject);
    };

    Phaser.GameObjectCreator.prototype.spine = function spine(x, y, key, premultipliedAlpha) {
      if (premultipliedAlpha === void 0) { premultipliedAlpha = false; }
      const spineObject = new SpineGameObject(this.game, self, x, y, key, premultipliedAlpha);
      self.spineList.push(spineObject);
      return spineObject;
    };
  }

  _addRenderers() {
    if (this.isWebGL) {
      if (!this.webGLRenderer) {
        this.webGLRenderer = new SceneRenderer(this.game.canvas, this.gl, true);
      }
      this.onResize();
      this.game.scale.onSizeChange.add(this.onResize, this);
    } else if (!this.canvasRenderer) {
      this.canvasRenderer = new SkeletonRenderer(this.game.context);
    }
    this.game.onDestroy.addOnce(this.gameDestroy);
  }

  onResize() {
    const phaserRenderer = this.game.renderer;
    const sceneRenderer = this.webGLRenderer;
    if (phaserRenderer && sceneRenderer) {
      const viewportWidth = phaserRenderer.width;
      const viewportHeight = phaserRenderer.height;
      sceneRenderer.camera.position.x = viewportWidth / 2;
      sceneRenderer.camera.position.y = viewportHeight / 2;
      sceneRenderer.camera.up.y = -1;
      sceneRenderer.camera.direction.z = 1;
      sceneRenderer.camera.setViewport(viewportWidth, viewportHeight);
    }
  }

  destroy() {
    if (this.isWebGL) {
      this.game.scale.onSizeChange.remove(this.onResize);
    }
    super.destroy();
  }

  gameDestroy() {
    for (const spine of this.spineList) {
      if (spine.destroy) spine.destroy();
    }
    if (this.webGLRenderer) this.webGLRenderer.dispose();
  }
}
