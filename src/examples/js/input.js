const game = new Phaser.Game(800, 600, Phaser.AUTO, 'spine-phaser-ce-example', { preload, create });

function preload() {
    game.plugins.add(SpinePlugin);

    game.load.crossOrigin = 'anonymous';

    const spineBoyConfig = {
        image: 'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/coin-pma.png',
        atlas: 'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/coin-pma.atlas',
        binary: 'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/coin-pro.skel'
    };

    this.game.load.spine('spineBoy', spineBoyConfig);
}

function create() {
    const spineBoy = game.add.spine(game.world.centerX, game.world.centerY, 'spineBoy');
    spineBoy.scale.setTo(0.7);

    const { animations } = spineBoy.animationStateData.skeletonData;
    spineBoy.animationState.setAnimation(0, animations[0].name, true);
}
