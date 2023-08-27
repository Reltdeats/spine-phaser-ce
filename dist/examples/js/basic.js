/**
 * Copyright for the Phaser CE Spine Plugin software and its source files:
 * @author       Ruben García Vilà
 * @version      0.9.3
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 *
 * Copyright for the Spine Runtimes software and its source files:
 * @author       Esoteric Software LLC
 * @copyright    Copyright (c) 2013-2023, Esoteric Software LLC
 * @licence      {@link https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE}
 * 
 */(()=>{const e=new Phaser.Game(800,600,Phaser.AUTO,"spine-phaser-ce-example",{preload:function(){e.plugins.add(SpinePlugin),e.load.crossOrigin="anonymous";e.load.spine("spineBoy",{image:"https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/spineboy-pma.png",atlas:"https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/spineboy-pma.atlas",binary:"https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/spineboy-pro.skel"})},create:function(){const t=e.add.spine(e.world.centerX,595,"spineBoy");t.scale.setTo(.7);const{animations:n}=t.animationStateData.skeletonData;let s;t.animationState.setAnimation(0,n[6].name,!0),e.time.events.loop(2500,(()=>{let e=Math.floor(Math.random()*(n.length-1));for(;e===s&&n.length>1;)e=Math.floor(Math.random()*(n.length-1));s=e,t.animationState.setAnimation(0,n[e].name,!0)}))}})})();
//# sourceMappingURL=basic.js.map