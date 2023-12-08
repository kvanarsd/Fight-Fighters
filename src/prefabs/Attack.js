class Attack extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, player, direction, enemy, word) {
        super(scene, x, y, texture, frame, player, direction, enemy, word);
        this.anims.play(texture)

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
        this.setBounce(0.2)

        // colliding with enemy
        scene.physics.add.collider(enemy, this, () => {
            enemy.hurt = true;
            if(!enemy.imune){
                let attackPoints = player.attack;
                if(word != "") {
                    // multiply attack points by 2 if
                    // player is speaking while attacking
                    attackPoints *= 2;
                }
                
                enemy.health -= attackPoints;
                player.powScore += attackPoints; // loading power up
                player.damage += attackPoints * 10;
                player.damageDealt.setText(scene.formatValue(player.damage))

                // if enemy is dead Game over and set everything to 0
                if(enemy.health <= 0) {
                    enemy.health = 0;
                    scene.gameOver = true;
                    enemy.healthBar.setScale(0, 1)
                } else { // make healthbar smaller
                    enemy.healthBar.setScale(enemy.health/1000, 1)
                }
            }

            // destroy assets on collision
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

        this.setVelocityX(270 * this.direction);

        // word
        if(word != "") {
            this.text = scene.add.bitmapText(scene.width/2, scene.height/2, 'midnew', word, 52, 1).setOrigin(0.5).setScale(.5).setAlpha(0.2);
            // tween attack text
            var TweenIn = scene.tweens.add({
                targets: this.text,
                duration: 500,
                ease: 'Linear',
                repeat: 0,
                yoyo: false,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                onComplete: function() {
                    this.targets[0].setScale(1);
                    this.targets[0].setAlpha(1)
                    TweenOut.play();
                }
            });

            var TweenOut = scene.tweens.add({
                targets: this.text,
                duration: 1000,
                ease: 'Linear',
                repeat: 0,
                yoyo: false,
                scaleX: 2,
                scaleY: 2,
                alpha: 0,
                delay: 500
            });

            TweenIn.play();
        }
        
    }

    update() {
        // destroy if off screen
        if(this.x > scene.width + borderPadding || this.x < -borderPadding) {
            this.destroy();
            this.text.destroy();
        }
    }
}