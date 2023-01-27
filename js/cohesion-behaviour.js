class Cohesion extends Behaviour 
{
    constructor(weight) { super(weight); }

    getDesired(currentBoid)
    {
        // if current boid doesn't see any other boid, 
        // target is its own position
        let target = currentBoid.getPos().copy();  

        let allBoids = currentBoid.getVision().getFarSight(); // get all boids being seen at far sight
        
        for (let b of allBoids) 
        { 
            target.add(b.getPos()); 
        }

        target = target.div(allBoids.length + 1); // adds the current boid to the counter

        return (p5.Vector.sub(target, currentBoid.getPos()));
    }
}