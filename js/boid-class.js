class Boid 
    {
    constructor(pos, mass, radius, color) 
    {
        this.pos = pos;
        this.mass = mass;

        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        
        this.color = color;
		this.radius = radius;

        this.behaviours = [];
        this.dna = new DNA(); 
    }

    getPos() { return this.pos; }

    getVel() { return this.vel; }

    getVision() { return this.vision; }
    setVision(v) { this.vision = v; }
    
    getDNA() { return this.dna; }

    /**
     * method that updates the sum of all the weights,
     * when one of the behaviours has been changed
     */
    updateSumWeights() 
    {
        this.sumWeights = 0;
        for(let behaviour of this.behaviours)
        {
            this.sumWeights += behaviour.getWeight();
        }
    }

    /**
     * adds a new behaviour to the boid and updates the global weights
     */
    addBehaviour(b) 
    { 
        this.behaviours.push(b);
        this.updateSumWeights();
    }

    /**
     * remove a behaviour from the boid and updates the global weights
     */
    removeBehaviour(b) 
    {
        let i = this.behaviours.indexOf(b);
        if(i >= 0)
            this.behaviours.splice(i, 1);
        this.updateSumWeights();
    }

    getBehaviours() { return this.behaviours; }

    applyAllBehaviours(dt) 
    {
        if(this.vision != undefined)
            this.vision.look(); // update far and near sight
        
        let desired = createVector(0, 0);
        for(let behaviour of this.behaviours)
        {
            let _desired = behaviour.getDesired(this); // get desired velocity from each behaviour
            _desired.mult(behaviour.getWeight()/this.sumWeights); // multiplies it by the defined weight
            desired.add(_desired);
        }

        this.move(dt, desired);
    }

    /**
     * given a certain desired velocity, it calculates the movement of the boid
     */
    move(dt, desired)
    {        
        desired.normalize();
        desired.mult(this.dna.getMaxSpeed()); // normalize all to the max speed

        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.dna.getMaxForce()); // normalize all to the max force
        
        this.acc.add(p5.Vector.div(steer, this.mass)); // applies the force

        this.acc.mult(dt); // multiply by delta time
        this.vel.add(this.acc);

        let newPos = p5.Vector.mult(this.vel, dt); // don't want to change the original vector
        this.pos.add(newPos);

        this.acc.mult(0); // reset acceleration
        
        this.borders();
    }

    /**
     * makes sure the boids don't disappear when of the screen
     */
    borders() 
    {
        let x = this.pos.x;
        let y = this.pos.y;
        let r = this.radius;

        if(x < -r)
            this.pos.x = width + r;
        else if(x > width + r)
            this.pos.x = -r;

        if(y < -r)
            this.pos.y = height + r;
        else if(y > height + r)
            this.pos.y = -r;
    }

    draw() 
    {
        push();

        fill(this.color);
        noStroke();

        circle(this.pos.x, this.pos.y, this.radius);
        pop();

        // draws the field of vision
        if(debug)
        {
            push();

            noFill();
            stroke(255, 0, 0, 60);
            strokeWeight(1);

            translate(this.pos.x, this.pos.y);
            rotate(this.vel.heading()); 

            let dist = this.dna.getFarVisionDist();
            let angle = this.dna.getFarVisionAngle();
            
            // far vision 
            rotate(angle);
            line(0, 0, dist, 0);
            rotate(-2*angle);
            line(0, 0, dist, 0);
            rotate(angle);
            arc(0, 0, 2*dist, 2*dist, -angle, angle);

            // near vision
            stroke(255, 0, 255, 60);
            dist = this.dna.getNearVisionDist();
            ellipse(0, 0, 2*dist, 2*dist);

            pop();
        }
    }
}