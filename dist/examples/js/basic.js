/**
 * Copyright for the Phaser CE Spine Plugin software and its source files:
 * @author       Ruben García Vilà
 * @version      0.9.7
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 *
 * Copyright for the Spine Runtimes software and its source files:
 * @author       Esoteric Software LLC
 * @copyright    Copyright (c) 2013-2023, Esoteric Software LLC
 * @licence      {@link https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE}
 * 
 */(()=>{const e=new Phaser.Game(800,600,Phaser.AUTO,"spine-phaser-ce-example",{preload:function(){e.plugins.add(SpinePlugin),e.load.crossOrigin="anonymous";const n="https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/",a={image:`${n}spineboy-pma.png`,atlas:`${n}spineboy-pma.atlas`,binary:`${n}spineboy-pro.skel`};e.load.spine("spineBoy",a)},create:function(){const n=e.add.spine(e.world.centerX,595,"spineBoy");n.scale.setTo(.7);const{animations:a}=n.animationStateData.skeletonData;let t;n.animationState.setAnimation(0,a[6].name,!0),e.time.events.loop(2500,(()=>{let e=Math.floor(Math.random()*(a.length-1));for(;e===t&&a.length>1;)e=Math.floor(Math.random()*(a.length-1));t=e,n.animationState.setAnimation(0,a[e].name,!0)}))}})})();
//# sourceMappingURL=basic.js.map