# spine-phaser-ce
Spine runtimes plugin for Phaser CE.

## Features

- Full support of the last Spine version (4.x.x).
- Support for Canvas and WebGL.
- Support for Canvas mesh.

## Requisites

- Phaser CE 2.20.0 or newer (not tested with older versions).
- Globally declared Phaser so the plugin can extend it.
- Some spines to use with the plugin :D.

## How to use

1. Install via npm: `npm install @reltdeats/spine-phaser-ce`
2. Add the plugin to your Phaser CE game:

```javascript
import SpinePlugin from '@reltdeats/spine-phaser-ce';

this.game.plugins.add(SpinePlugin);
```
or...

1. Use jsdelivr cdn:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-ce@2.20.0"></script>
<script src="https://cdn.jsdelivr.net/npm/@reltdeats/spine-phaser-ce@0.9.4/dist/spine-phaser-ce.min.js"></script>

this.game.plugins.add(SpinePlugin);
```
2. Import the plugin:

```javascript
this.game.plugins.add(SpinePlugin);
```
3. Import your assets with the spine loader:

```javascript
// The loader expects a config object with the following structure:
const spineDino = {
    image: require('../../assets/spines/dino.png'),
    atlas: require('../../assets/spines/dino.atlas'),
    json: require('../../assets/spines/dino.json')
}

// For spines with multiples atlases, 
// use images in plural and the key of 
// the image atlas must be the name of the atlas.
const spineBomb = {
    images: {
        Bomb: require('../../assets/spines/bomb/Bomb.png'),
        Bomb_2: require('../../assets/spines/bomb/Bomb_2.png')
    },
    atlas: require('../../assets/spines/bomb/Bomb.atlas.txt'),
    json: require('../../assets/spines/bomb/Bomb.json')
}

// Also, the loader supports binary format
const spineStar = {
    image: require('../../assets/spines/star/Star.png'),
    atlas: require('../../assets/spines/star/Star.atlas'),
    binary: require('../../assets/spines/star/Star.skel')
}
   
// Load the spine with your game loader
this.game.load.spine('spineStar', spineStar);
```
4. Add the spine to the game:

```javascript
// The last two arguments, group and premultipliedAlpha
// are optional. 
// Group is a reference to a Phaser.Group
this.star = this.game.add.spine(200, 300, 'spineStar', group, false);
```

## Manipulating the Spine and examples
All transforms are handled by the Phaser CE system:

```javascript
this.star.x = 300;
this.star.y = 100;
this.star.scale.setTo(1, 2);
this.star.scale.x = -1;
this.star.rotation = Phaser.Math.degToRad(45);
```
Specific Spine functionalities are handled by the oficial [Spine runtimes](https://github.com/EsotericSoftware/spine-runtimes).
For handling animations, mixing and all the spine features, please refer to the [oficial spine documentation](https://esotericsoftware.com/spine-runtime-documentation).

Example:

```javascript
this.star.animationState.setAnimation(0, 'Idle', true);

this.game.time.events.loop(8000, () => {
    this.star.animationState.setAnimation(0, 'In', false);
    this.star.animationState.addAnimation(0, 'Idle', false);
    this.star.animationState.addAnimation(0, 'Out', false);
});
```

For more examples, check out the [example index](http://htmlpreview.github.io/?https://github.com/Reltdeats/spine-phaser-ce/blob/dev/dist/examples/index.html)

## Debug
Debug is still in progress and shows little to no information. WIP.

To enable debug, just set the `debug` property of the spine to `true`.

```javascript
this.star = this.game.add.spine(200, 300, 'spineStar', group, false);
this.star.debug = true;
```

## Canvas mesh
To enable canvas mesh, set the `enableCanvasMesh` property of the spine to `true`.

Be aware, that canvas mesh is a hack to render each triangle of the mesh separately.
This can cause some aliasing (cause the triangles are not attached to each other) and performance issues.

```javascript
this.star = this.game.add.spine(200, 300, 'spineStar', group, false);
this.star.enableCanvasMesh = true;
```

## Maintenance
I use this plugin in my daily work, so expect some improvements and inclusion of Phaser features over time.

Feel free to report any bugs the usual way in the github [issues page](https://github.com/Reltdeats/spine-phaser-ce/issues).