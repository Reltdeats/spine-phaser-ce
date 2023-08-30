const game = new Phaser.Game(800, 600, Phaser.AUTO, 'spine-phaser-ce-example', { preload, create });

function preload() {
    game.plugins.add(SpinePlugin);

    game.load.crossOrigin = 'anonymous';

    const baseUrl = 'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.1/spine-ts/spine-phaser/example/assets/';

    const spineBoyConfig = {
        image: `${baseUrl}spineboy-pma.png`,
        atlas: `${baseUrl}spineboy-pma.atlas`,
        binary: `${baseUrl}spineboy-pro.skel`
    };

    game.load.spine('spineBoy', spineBoyConfig);
}

function create() {
    const spineBoy = game.add.spine(game.world.centerX, 595, 'spineBoy');
    spineBoy.scale.setTo(0.7);

    const { animations } = spineBoy.animationStateData.skeletonData;
    spineBoy.animationState.setAnimation(0, animations[6].name, true);

    let currentRnd;
    game.time.events.loop(2500, () => {
        let rnd = Math.floor(Math.random() * (animations.length - 1));
        while (rnd === currentRnd && animations.length > 1) rnd = Math.floor(Math.random() * (animations.length - 1));
        currentRnd = rnd;

        spineBoy.animationState.setAnimation(0, animations[rnd].name, true);
    });
}
