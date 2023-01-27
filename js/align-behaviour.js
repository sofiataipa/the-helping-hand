class Align extends Behaviour 
{
    constructor(weight) { super(weight); }

    getDesired(currentBoid)
    {
        // if current boid doesn't see any other boid, 
        // desired is its own velocity
        let desired = currentBoid.getVel().copy();  

        let allBoids = currentBoid.getVision().getFarSight(); // get all boids being seen at far sight
        
        for (let b of allBoids) 
        { 
            desired.add(b.getVel()); // sum of all the velocities
        }

        desired = desired.div(allBoids.length + 1); // adds the current boid to the counter

        return desired;
    }
} 