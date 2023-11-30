class Attack extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, player, direction, enemy, word) {
        super(scene, x, y, texture, frame, player, direction, enemy, word);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        scene.physics.add.collider(enemy, this, () => {
            enemy.health -= player.attack;
            this.destroy();
            this.text.destroy();
        }, null, scene);

        // word
        this.text = scene.add.bitmapText(x, y, 'midnew', word, 30, 1).setOrigin(0.5)
        scene.physics.world.enable(this.text)

        // movement
        if(direction == 'right') {
            this.direction = 1;
        } else {
            this.direction = -1;
        }

        this.setVelocityX(200 * this.direction);
        this.text.body.setVelocityX(200 * this.direction);
    }

    update() {
        console.log(this.x)
        if(this.x > scene.width + borderPadding || this.x < -borderPadding) {
            console.log("destroyed")
            this.destroy();
            this.text.destroy();
        }
    }
}