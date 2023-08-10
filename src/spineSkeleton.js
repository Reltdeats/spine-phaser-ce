/**
 * @author       Ruben García Vilà
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 */
import { Skeleton } from '@esotericsoftware/spine-core';
import {
  AtlasAttachmentLoader, GLTexture, SkeletonBinary,
  SkeletonJson, TextureAtlas
} from '@esotericsoftware/spine-webgl';
import { CanvasTexture } from '@esotericsoftware/spine-canvas';

export default class SpineSkeleton {
  constructor(game, plugin, key, gameObject) {
    this.key = key;
    this.game = game;
    this.plugin = plugin;
    this.gameObject = gameObject;

    this.setKeys(key);
    this.setSkeletonData();
  }

  setKeys(key) {
    this.keys = {
      root: key,
      image: `${key}-image`,
      text: `${key}-text`,
      json: `${key}-json`,
      binary: `${key}-binary`,
      atlas: `${key}-atlas`,
      skeleton: `${key}-skeleton`
    };
  }

  setSkeletonData() {
    Skeleton.yDown = true;
    this.skeleton = this.createSkeleton();
  }

  /** Creates a new Skeleton instance from the data and atlas. */
  createSkeleton() {
    return new Skeleton(this.getSkeletonData());
  }

  /** Returns the SkeletonData instance for the given data and atlas key */
  getSkeletonData() {
    const atlas = this.getAtlas();
    let skeletonData;
    if (this.game.cache.checkSpineSkeleton(this.keys.skeleton)) {
      skeletonData = this.game.cache.getSpineSkeleton(this.keys.skeleton);
    } else {
      if (this.game.cache.checkJSONKey(this.keys.json)) {
        const jsonFile = this.game.cache.getJSON(this.keys.json);
        const json = new SkeletonJson(new AtlasAttachmentLoader(atlas));
        skeletonData = json.readSkeletonData(jsonFile);
      } else {
        const binaryFile = this.game.cache.getBinary(this.keys.binary);
        const binary = new SkeletonBinary(new AtlasAttachmentLoader(atlas));
        skeletonData = binary.readSkeletonData(new Uint8Array(binaryFile));
      }
      this.game.cache.addSpineSkeleton(this.keys.skeleton, skeletonData);
    }
    return skeletonData;
  }

  /** Returns the TextureAtlas instance */
  getAtlas() {
    let atlas;
    if (this.game.cache.checkSpineAtlas(this.keys.atlas)) {
      atlas = this.game.cache.getSpineAtlas(this.keys.atlas);
    } else {
      const atlasFile = this.game.cache.getText(this.keys.text);
      atlas = new TextureAtlas(atlasFile);
      if (this.plugin.isWebGL) {
        this.plugin.gl.pixelStorei(this.plugin.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        if (atlas.pages.length < 2) {
          const imageFile = this.game.cache.getImage(this.keys.image);
          atlas.pages[0].setTexture(new GLTexture(this.plugin.gl, imageFile, false));
        } else {
          for (const atlasPage of atlas.pages) {
            const name = atlasPage.name.replace(/\.[^/.]+$/gm, '').toLocaleLowerCase();
            const imageFile = this.game.cache.getImage(`${this.keys.root}-${name}`);
            atlasPage.setTexture(new GLTexture(this.plugin.gl, imageFile, false));
          }
        }
      } else if (atlas.pages.length < 2) {
        const imageFile = this.game.cache.getImage(this.keys.image);
        atlas.pages[0].setTexture(new CanvasTexture(imageFile));
      } else {
        for (const atlasPage of atlas.pages) {
          const name = atlasPage.name.replace(/\.[^/.]+$/gm, '').toLocaleLowerCase();
          const imageFile = this.game.cache.getImage(`${this.keys.root}-${name}`);
          atlasPage.setTexture(new CanvasTexture(imageFile));
        }
      }
      this.game.cache.addSpineAtlas(this.keys.atlas, atlas);
    }
    return atlas;
  }
}
