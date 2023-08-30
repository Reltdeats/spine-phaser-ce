/**
 * Copyright for the Phaser CE Spine Plugin software and its source files:
 * @author       Ruben García Vilà
 * @version      0.9.5
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 *
 * Copyright for the Spine Runtimes software and its source files:
 * @author       Esoteric Software LLC
 * @copyright    Copyright (c) 2013-2023, Esoteric Software LLC
 * @licence      {@link https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE}
 *
 */(() => { const n = new Phaser.Game(800, 600, Phaser.AUTO, 'spine-phaser-ce-example', { preload() { n.plugins.add(SpinePlugin), n.load.crossOrigin = 'anonymous'; const e = 'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/'; const a = { image: ''.concat(e, 'spineboy-pma.png'), atlas: ''.concat(e, 'spineboy-pma.atlas'), binary: ''.concat(e, 'spineboy-pro.skel') }; n.load.spine('spineBoy', a); }, create() { const e = n.add.spine(n.world.centerX, 595, 'spineBoy'); e.scale.setTo(0.7); const { animations: a } = e.animationStateData.skeletonData; let t; e.animationState.setAnimation(0, a[6].name, !0), n.time.events.loop(2500, (() => { let n = Math.floor(Math.random() * (a.length - 1)); for (;n === t && a.length > 1;)n = Math.floor(Math.random() * (a.length - 1)); t = n, e.animationState.setAnimation(0, a[n].name, !0); })); } }); })();
// # sourceMappingURL=basic.js.map
