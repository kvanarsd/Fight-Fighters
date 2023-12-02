class RM extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(game.settings.gravity);

        // hero variables
        this.direction = 'right';
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
            idle: new RMIdleState(),
            run: new RMRunState(),
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
        player.anims.play(`RM-idle-${player.direction}`)
        player.doubleJump = 0;
        player.hurt = false
        player.attack = 30;
        player.attacking = false;
        player.setVelocity(0);
        player.spoken = false;
    } 
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const WKey = scene.keys.WKey;
        const AKey = scene.keys.AKey;
        const SKey = scene.keys.SKey;
        const DKey = scene.keys.DKey;
        const CKey = scene.keys.CKey;
        const VKey = scene.keys.VKey;

        if(player.hurt && !player.immune) {
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

        const C = Phaser.Input.Keyboard.JustDown(CKey);
        if(C && !player.second) {
            this.stateMachine.transition('norm')
            return
        }

        if(C && player.second) {
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
        //player.anims.play(`RM-run-${player.direction}`)
        player.doubleJump = 0;
        player.hurt = false
    } 
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const WKey = scene.keys.WKey;
        const AKey = scene.keys.AKey;
        const SKey = scene.keys.SKey;
        const DKey = scene.keys.DKey;
        const CKey = scene.keys.CKey;
        const VKey = scene.keys.VKey;

        if(player.hurt && !player.immune) {
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
        
        player.anims.play(`RM-run-${player.direction}`, true);
        player.setVelocityX(player.speed * d);
    }
}

class RMJumpState extends State {
    enter(scene, player) {
        player.anims.play(`RM-jump-${player.direction}`)
        scene.notJump = false

        player.setVelocityY(player.velY)
        scene.onFloor = false;
        const {WKey} = scene.keys;
        WKey.reset();
    
    }
    execute(scene, player) {
        const {WKey} = scene.keys
        const CKey = scene.keys.CKey;
        const VKey = scene.keys.VKey;

        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(!Phaser.Input.Keyboard.JustDown(WKey) && (scene.onFloor || collide.down)) {
            player.once('animationcomplete', () => {
                this.stateMachine.transition('idle')
            })
            //console.log("stop")
            //this.stateMachine.transition('idle')
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
        const CKey = scene.keys.CKey;
        const VKey = scene.keys.Vkey;

        if(Phaser.Input.Keyboard.JustDown(CKey)) {
            this.stateMachine.transition('norm')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(VKey) && player.powerUp) {
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

class RMDuckState extends State {
    enter(scene, player) {
        //player.body.setSize(124,30).setOffset(0,108)
        player.anims.play(`RM-duck-${player.direction}`)
        
    }execute(scene, player) {
        if(player.hurt && !player.immune) {
            //player.body.setSize(50,138).setOffset(74,0)
            this.stateMachine.transition('hurt')
            return
        }

        player.once('animationcomplete', () => {
            scene.time.delayedCall(200, () => {
                //player.body.setSize(50,138).setOffset(74,0)
                this.stateMachine.transition('idle')
            })
        })
    }
}

class RMHurtState extends State {
    enter(scene, player) {
        player.attacking = false;
        player.immune = true;
        player.anims.play(`RM-hurt-${player.direction}`)

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
        player.anims.play(`RM-nAttack-${player.direction}`)

        player.second = true;
        scene.time.delayedCall(700, function () {
            player.second = false;
        }, [], scene)
        console.log("first")
        
    }
    execute(scene, player) {
        
        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }
        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
}

class RMSecAttackState extends State {
    enter(scene, player) {
        player.attacking = true;
        player.attack += 20;
        player.second = false;
        player.anims.play(`RM-nAttack-${player.direction}`)

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })

        console.log("second")
    }
    execute(scene, player) {
        if(player.hurt && !player.immune) {
            this.stateMachine.transition('hurt')
            return
        }
    }
}

class RMPowAttackState extends State {
    enter(scene, player) {
        player.attacking = true;
        player.attack *= 3;
        player.anims.play(`RM-pAttack-${player.direction}`)

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
