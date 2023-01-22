class Separate extends Behaviour 
{
    constructor(weight) { super(weight); }

    getDesired(currentBoid)
    {
        let desired = createVector(0, 0);  

        let allBoids = currentBoid.getVision().getNearSight(); // get all boids from the near sight

        allBoids.forEach(b => { 
            let r = p5.Vector.sub(currentBoid.getPos(), b.getPos());
            let d = r.mag(); // distance between the two boids
            r.div(d*d); // the farther away, the least influence it has on the boid

            desired.add(r);
        });  
        
        return desired;
    }
}