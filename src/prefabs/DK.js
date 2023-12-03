class DK extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(game.settings.gravity);
        this.setMass(3)
        this.body.setDragX(100)

        // hero variables
        this.direction = 'left';
        this.powerUp = false;
        this.health = game.settings.health;
        this.points = game.settings.points;
        this.speed = game.settings.speed;
        this.velY = game.settings.jump;
        this.immune = false;
        this.second = false;
        this.attack = 30;
        this.attacking = false;
        this.hurt = false;
        this.spoken = false             // one word per attack

        //state machine
        this.state = new StateMachine('idle', {
            idle: new IdleState(),
            run: new RunState(),
            jump: new JumpState(),
            dubJump: new DubJumpState(),
            duck: new DuckState(),
            hurt: new HurtState(),
            fir: new firAttackState(),
            sec: new SecAttackState(),
            pow: new PowAttackState()
        }, [scene, this])
    }
}

class IdleState extends State { 
    enter(scene, player) {
        player.anims.play(`DK-idle-${player.direction}`)
        player.doubleJump = 0;
        player.hurt = false
        player.attack = 30;
        player.attacking = false;
        player.setVelocity(0);
        player.spoken = false;
    } 
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const { right, up, down, left} = scene.keys
        const OKey = scene.keys.OKey;
        const PKey = scene.keys.PKey;

        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(Phaser.Input.Keyboard.JustDown(up) && (scene.onFloor || collide.down)) {
            player.doubleJump = 1;
            this.stateMachine.transition('jump')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(right) || Phaser.Input.Keyboard.JustDown(left)) {
            this.stateMachine.transition('run')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(down)) {
            this.stateMachine.transition('duck')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(OKey) && !player.second) {
            this.stateMachine.transition('fir')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(OKey) && player.second) {
            this.stateMachine.transition('sec')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(PKey) && player.powerUp) {
            this.stateMachine.transition('pow')
            return
        }
    }
}

class RunState extends State { 
    enter(scene, player) {
        //player.anims.play(`DK-run-${player.direction}`)
        player.doubleJump = 0;
        player.hurt = false
    } 
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const { right, up, down, left} = scene.keys
        const OKey = scene.keys.OKey;
        const PKey = scene.keys.PKey;

        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(Phaser.Input.Keyboard.JustDown(up) && (scene.onFloor || collide.down)) {
            player.doubleJump = 1;
            this.stateMachine.transition('jump')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(down)) {
            this.stateMachine.transition('duck')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(OKey)) {
            this.stateMachine.transition('fir')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(PKey) && player.powerUp) {
            this.stateMachine.transition('pow')
            return
        }

        if(!(left.isDown || right.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

        let d = 0;
        if(left.isDown) {
            player.direction = 'left'
            d = -1;
        } else if(right.isDown) {
            player.direction = 'right'
            d = 1;
        }
        
        player.anims.play(`DK-run-${player.direction}`, true);
        player.setVelocityX(player.speed * d);
    }
}

class JumpState extends State {
    enter(scene, player) {
        player.anims.play(`DK-jump-${player.direction}`)
        scene.notJump = false

        player.setVelocityY(player.velY)
        scene.onFloor = false;
        const {up} = scene.keys;
        up.reset();
    
    }
    execute(scene, player) {
        const {up} = scene.keys
        const OKey = scene.keys.OKey;
        const PKey = scene.keys.PKey;

        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(!Phaser.Input.Keyboard.JustDown(up) && (scene.onFloor || collide.down)) {
            this.stateMachine.transition('idle')
        }
        if(player.doubleJump < 2 && Phaser.Input.Keyboard.JustDown(up) && !collide.down) {
            player.doubleJump = 2;
            this.stateMachine.transition('dubJump')
        } 

        if(Phaser.Input.Keyboard.JustDown(OKey)) {
            this.stateMachine.transition('fir')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(PKey) && player.powerUp) {
            this.stateMachine.transition('pow')
            return
        }

        
    }
}

class DubJumpState extends State {
    enter(scene, player) {
        player.setVelocityY(player.velocity)
    }
    execute(scene, player) {
        const OKey = scene.keys.OKey;
        const PKey = scene.keys.PKey;

        if(Phaser.Input.Keyboard.JustDown(OKey)) {
            this.stateMachine.transition('fir')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(PKey) && player.powerUp) {
            this.stateMachine.transition('pow')
            return
        }

        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        } 

        let collide = player.body.touching
        if(collide.down) {
            this.stateMachine.transition('idle')
        }
    }
}

class DuckState extends State {
    enter(scene, player) {
        player.body.setSize(124,30).setOffset(0,108)
        player.anims.play(`DK-duck-${player.direction}`)
        
    }execute(scene, player) {
        if(player.hurt && !player.immune) {
            player.body.setSize(50,138).setOffset(74,0)
            this.stateMachine.transition('hurt')
            return
        }

        player.once('animationcomplete', () => {
            scene.time.delayedCall(200, () => {
                player.body.setSize(50,138).setOffset(74,0)
                this.stateMachine.transition('idle')
            })
        })
    }
}

class HurtState extends State {
    enter(scene, player) {
        player.attacking = false;
        player.immune = true;
        player.anims.play(`DK-hurt-${player.direction}`)

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })

        scene.time.delayedCall(200, () => {
            player.immune = false;
        })
    }
}

class firAttackState extends State {
    enter(scene, player) {
        player.attacking = true;
        player.anims.play(`DK-nAttack-${player.direction}`)

        player.second = true;
        scene.time.delayedCall(100, () => {
            player.second = false;
        })

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
    execute(scene, player) {
        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }
    }
}

class SecAttackState extends State {
    enter(scene, player) {
        player.attacking = true;
        player.attack += 20;
        player.second = false;
        player.anims.play(`DK-sAttack-${player.direction}`)

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
    execute(scene, player) {
        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }
    }
}

class PowAttackState extends State {
    enter(scene, player) {
        player.attacking = true;
        player.attack *= 3;
        player.anims.play(`DK-pAttack-${player.direction}`)

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
    execute(scene, player) {
        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }
    }
}
