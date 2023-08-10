/**
 * @author       Ruben García Vilà
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 */
import { AnimationState, Skeleton, Skin } from '@esotericsoftware/spine-core';

export default class SpineUtils {
  /** Converts a point from the skeleton coordinate system to the Phaser world coordinate system. */
  static skeletonToPhaserWorldCoordinates(point) {
    const transform = this.worldTransform;
    const {
      a, b, c, d, tx, ty
    } = transform;
    const { x, y } = point;
    point.x = x * a + y * c + tx;
    point.y = x * b + y * d + ty;
  }

  /** Converts a point from the Phaser world coordinate system to the skeleton coordinate system. */
  static phaserWorldCoordinatesToSkeleton(point) {
    let transform = this.worldTransform;
    transform = transform.invert();
    const {
      a, b, c, d, tx, ty
    } = transform;
    const { x, y } = point;
    point.x = x * a + y * c + tx;
    point.y = x * b + y * d + ty;
  }

  /** Converts a point from the Phaser world coordinate system to the bone's local coordinate system. */
  static phaserWorldCoordinatesToBone(point, bone) {
    this.phaserWorldCoordinatesToSkeleton(point);
    if (bone.parent) {
      bone.parent.worldToLocal(point);
    } else {
      bone.worldToLocal(point);
    }
  }

  /** A bounds provider that calculates the bounding box from the setup pose. */
  static calculateBounds(gameObject) {
    if (!gameObject.skeleton) {
      return {
        x: 0, y: 0, width: 0, height: 0
      };
    }
    // Make a copy of animation state and skeleton as this might be called while
    // the skeleton in the GameObject has already been heavily modified. We can not
    // reconstruct that state.
    const skeleton = new Skeleton(gameObject.skeleton.data);
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    const bounds = skeleton.getBoundsRect();
    return bounds.width === Number.NEGATIVE_INFINITY ? {
      x: 0, y: 0, width: 0, height: 0
    } : bounds;
  }

  /** A bounds provider that calculates the bounding box by taking the maximumg bounding box for a combination of skins and specific animation. */
  static calculateSkinBounds(gameObject, animations, skins = [], timeStep = 0.05) {
    const defaultBounds = {
      x: 0, y: 0, width: 0, height: 0
    };

    if (!gameObject.skeleton || !gameObject.animationState) return defaultBounds;

    // Make a copy of animation state and skeleton as this might be called while
    // the skeleton in the GameObject has already been heavily modified. We can not
    // reconstruct that state.
    const animationState = new AnimationState(gameObject.animationState.data);
    const skeleton = new Skeleton(gameObject.skeleton.data);
    const { data } = skeleton;
    if (skins.length > 0) {
      const customSkin = new Skin('custom-skin');
      for (const skinName of skins) {
        const skin = data.findSkin(skinName);
        if (skin !== null) customSkin.addSkin(skin);
      }
      skeleton.setSkin(customSkin);
    }
    skeleton.setToSetupPose();

    const animation = animations != null ? data.findAnimation(animations) : null;
    if (animation == null) {
      skeleton.updateWorldTransform();
      const bounds = skeleton.getBoundsRect();
      return bounds.width === Number.NEGATIVE_INFINITY ? defaultBounds : bounds;
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    animationState.clearTracks();
    animationState.setAnimationWith(0, animation, false);
    const steps = Math.max(animation.duration / timeStep, 1.0);

    for (let i = 0; i < steps; i++) {
      animationState.update(i > 0 ? timeStep : 0);
      animationState.apply(skeleton);
      skeleton.updateWorldTransform();
      const bounds = skeleton.getBoundsRect();
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, minX + bounds.width);
      maxY = Math.max(maxY, minY + bounds.height);
    }

    const bounds = {
      x: minX, y: minY, width: maxX - minX, height: maxY - minY
    };

    return bounds.width === Number.NEGATIVE_INFINITY ? defaultBounds : bounds;
  }
}
