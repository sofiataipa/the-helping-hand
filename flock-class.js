let count = 0;
class Flock 
{
    constructor(nBoids, mass, allWeights)
    {
        this.boids = [];

        this.fleeing = false;
        this.seeking = false;

        this.fleeBehaviour = new Flee(allWeights[3]);
        this.seekBehaviour = new Seek(allWeights[3]);

        // generate boids
        for (let i = 0; i < nBoids; i++) 
        {
            let c = color(240,5);
            let p = createVector(random(0, width), random(0, height));
            let r = random(MIN_RADIUS, MAX_RADIUS);
            
            let newBoid = new Boid(p, mass, r, c);
            
            // adds standard behaviours
            newBoid.addBehaviour(new Align(allWeights[0]));
            newBoid.addBehaviour(new Separate(allWeights[1]));
            newBoid.addBehaviour(new Cohesion(allWeights[2]));

            this.boids.push(newBoid);
        }

        // vision setup 
        this.boids.forEach(b => { b.setVision(new Vision(b, this.boids)) });
    }

    /**
     * add the target for the boids to flee
     * and adds the behaviour flee to all the boids
     */
    fleeFrom(x, y)
    {
        for(let b of this.boids) 
        {
            b.getVision().setFleeTarget(createVector(x, y));
            if(!this.fleeing) 
                b.addBehaviour(this.fleeBehaviour);
        }
        if(!this.fleeing)
            this.fleeing = true;
    }

    /**
     * add the target for the boids to seek
     * and adds the behaviour seek to all the boids
     */
    seekOut(x, y)
    {
        for(let b of this.boids) 
        {
            b.getVision().setSeekTarget(createVector(x, y));
            if(!this.seeking) 
                b.addBehaviour(this.seekBehaviour);
        }
        if(!this.seeking)
            this.seeking = true;
    }

    /**
     * removes the flee behaviour from all the boids
     */
    removeFleeFrom()
    {
        this.fleeing = false;
        for (let b of this.boids) 
        {
            b.removeBehaviour(this.fleeBehaviour);
        }
    }

    /**
     * removes the seek behaviour from all the boids
     */
    removeSeekOut()
    {
        this.seeking = false;
        for (let b of this.boids) 
        {
            b.removeBehaviour(this.seekBehaviour);
        }
    }

    applyBehaviours(dt)
    {
        for (let b of this.boids) 
        {
            b.applyAllBehaviours(dt); 
        }
    }

    draw()
    {
        for (let b of this.boids) 
        {
            b.draw(); 
        }
    }
}


