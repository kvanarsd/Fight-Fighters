class RM extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        // hero variables
        this.direction = 'right';
        this.powerUp = false;
        this.health = game.settings.health;
        this.points = game.settings.points;
        this.speed = game.settings.speed;
        this.grav = game.settings.gravity;
        this.velY = game.settings.velocity;
        this.immune = false;
        this.second = false;
        this.attack = 30;
        this.attacking = false;

        //state machine
        this.state = new StateMachine('idle', {
            idle: new RMIdleState(),
            runR: new RMRunState(),
            jump: new RMJumpState(),
            dubJump: new RMDubJumpState(),
            duck: new RMDuckState(),
            hurt: new RMHurtState(),
            norm: new RMNormAttackState(),
            sec: new RMSecAttackState(),
            pow: new RMPowAttackState()
        }, [scene, this])
    }
}

class RMIdleState extends State { 
    enter(scene, player) {
        player.anims.play(`p-idle`)
        player.doubleJump = 0;
        scene.hurt = false
        player.attack = 30;
        player.attacking = false;
        player.setVelocity(0);
    } 
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const WKey = scene.keys.Wkey;
        const AKey = scene.keys.Akey;
        const SKey = scene.keys.Skey;
        const DKey = scene.keys.Dkey;
        const CKey = scene.keys.Ckey;
        const VKey = scene.keys.Vkey;

        if(scene.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(Phaser.Input.Keyboard.JustDown(WKey) && (scene.onFloor || collide.down)) {
            player.doubleJump = 1;
            this.stateMachine.transition('jump')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(DKey) || Phaser.Input.Keyboard.JustDown(AKey)) {
            this.stateMachine.transition('run')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(SKey)) {
            this.stateMachine.transition('duck')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(CKey) && !player.second) {
            this.stateMachine.transition('norm')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(CKey) && player.second) {
            this.stateMachine.transition('sec')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(VKey) && player.powerUp) {
            this.stateMachine.transition('pow')
            return
        }
    }
}

class RMRunState extends State { 
    enter(scene, player) {
        player.anims.play(`run-${player.direction}`)
        player.doubleJump = 0;
        scene.hurt = false
    } 
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const WKey = scene.keys.Wkey;
        const AKey = scene.keys.Akey;
        const SKey = scene.keys.Skey;
        const DKey = scene.keys.Dkey;
        const CKey = scene.keys.Ckey;
        const VKey = scene.keys.Vkey;

        if(scene.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(Phaser.Input.Keyboard.JustDown(WKey) && (scene.onFloor || collide.down)) {
            player.doubleJump = 1;
            this.stateMachine.transition('jump')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(SKey)) {
            this.stateMachine.transition('duck')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(CKey) && !player.second) {
            this.stateMachine.transition('norm')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(VKey) && player.powerUp) {
            this.stateMachine.transition('pow')
            return
        }

        if(!(AKey.isDown || DKey.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

        let d = 0;
        if(AKey.isDown) {
            player.direction = 'left'
            d = -1;
        } else if(DKey.isDown) {
            player.direction = 'right'
            d = 1;
        }
        
        player.anims.play(`run-${player.direction}`);
        player.setVelocityX(player.speed * d);
    }
}

class RMJumpState extends State {
    enter(scene, player) {
        player.anims.play(`jump-${player.direction}`)
        scene.notJump = false

        player.setVelocityY(player.velY)
        scene.onFloor = false;
        const {WKey} = scene.keys;
        WKey.reset();
    
    }
    execute(scene, player) {
        const {WKey} = scene.keys
        const CKey = scene.keys.Ckey;
        const VKey = scene.keys.Vkey;

        if(scene.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(!Phaser.Input.Keyboard.JustDown(WKey) && (scene.onFloor || collide.down)) {
            this.stateMachine.transition('idle')
        }
        if(player.doubleJump < 2 && Phaser.Input.Keyboard.JustDown(WKey) && !scene.onFloor) {
            player.doubleJump = 2;
            this.stateMachine.transition('dubJump')
        } 

        if(Phaser.Input.Keyboard.JustDown(CKey)) {
            this.stateMachine.transition('norm')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(VKey) && player.powerUp) {
            this.stateMachine.transition('pow')
            return
        }

        
    }
}

class RMDubJumpState extends State {
    enter(scene, player) {
        player.setVelocityY(player.velocity)
    }
    execute(scene, player) {
        const CKey = scene.keys.Ckey;
        const VKey = scene.keys.Vkey;

        if(Phaser.Input.Keyboard.JustDown(CKey)) {
            this.stateMachine.transition('norm')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(VKey) && player.powerUp) {
            this.stateMachine.transition('pow')
            return
        }

        if(scene.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        } 

        let collide = player.body.touching
        if(collide.down) {
            this.stateMachine.transition('idle')
        }
    }
}

class RMDuckState extends State {
    enter(scene, player) {
        player.body.setSize(124,30).setOffset(0,108)
        player.anims.play(`duck-${player.direction}`)
        
    }execute(scene, player) {
        if(scene.hurt && !player.immune) {
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

class RMHurtState extends State {
    enter(scene, player) {
        player.attacking = false;
        player.immune = true;
        player.anims.play(`hurt-${player.direction}`)

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })

        scene.time.delayedCall(200, () => {
            player.immune = false;
        })
    }
}

class RMNormAttackState extends State {
    enter(scene, player) {
        player.attacking = true;
        player.anims.play(`nAttack-${player.direction}`)

        player.second = true;
        scene.time.delayedCall(100, () => {
            player.second = false;
        })

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
    execute(scene, player) {
        if(scene.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }
    }
}

class RMSecAttackState extends State {
    enter(scene, player) {
        player.attacking = true;
        player.attack += 20;
        player.second = false;
        player.anims.play(`sAttack-${player.direction}`)

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
    execute(scene, player) {
        if(scene.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }
    }
}

class RMPowAttackState extends State {
    enter(scene, player) {
        player.attacking = true;
        player.attack *= 3;
        player.anims.play(`pAttack-${player.direction}`)

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
    execute(scene, player) {
        if(scene.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }
    }
}
