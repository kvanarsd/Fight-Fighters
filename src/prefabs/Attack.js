class Attack extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, player, direction, enemy, word) {
        super(scene, x, y, texture, frame, player, direction, enemy, word);
        this.anims.play(texture)

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
        this.setBounce(0.2)

        scene.physics.add.collider(enemy, this, () => {
            console.log("hit")
            enemy.hurt = true;
            enemy.health -= player.attack;
            player.powScore += player.attack;
            console.log(player.powScore)
            enemy.healthBar.setScale(enemy.health/1000, 1)
            this.destroy();
            if(word != "") {
                this.text.destroy();
            }
        }, null, scene);

        // movement
        if(direction == 'right') {
            this.direction = 1;
        } else {
            this.direction = -1;
        }

        this.setVelocityX(200 * this.direction);

        // word
        if(word != "") {
            this.text = scene.add.bitmapText(x, y, 'midnew', word, 15, 1).setOrigin(0.5)
            scene.physics.world.enable(this.text)
            this.text.body.setVelocityX(200 * this.direction);
        }
        
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