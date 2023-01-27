class Vision 
{
    constructor(currentBoid, allBoids)
    {
        this.farSight = [];
        this.nearSight = [];

        this.currentBoid = currentBoid;
        this.allBoids = allBoids; 
    }

    getSeekTarget() { return this.seekTarget; }
    getFleeTarget() { return this.fleeTarget; }
    setSeekTarget(t) { this.seekTarget = t; }
    setFleeTarget(t) { this.fleeTarget = t; }

    getFarSight() { return this.farSight; } 
    getNearSight() { return this.nearSight; }

    /**
     * updates the boids in the near and far sight of the field of view
     */
    look()
    {
        this.farSight = [];
        this.nearSight = [];

        for(let b of this.allBoids)
        {
            if(this.isInFarSight(b.getPos()))
				this.farSight.push(b);
			if(this.isInNearSight(b.getPos()))
				this.nearSight.push(b);
        }
    }

    /**
     * checks if the boid in the position pos is inside the far vision field
     */
    isInFarSight(pos) 
    { 
        let dna = this.currentBoid.getDNA();
        return this.inSight(pos, dna.getFarVisionDist(), dna.getFarVisionAngle()); 
    }

    /**
     * checks if the boid in the position pos is inside the near vision field
     */
    isInNearSight(pos)
    {
        let dna = this.currentBoid.getDNA();
        return this.inSight(pos, dna.getNearVisionDist(), dna.getNearVisionAngle()); 
    }

    /**
     * global method that checks if a boid with the position pos is inside
     * the field of view with a certain angle and sight distance
     */
    inSight(pos, maxDistance, maxAngle) {
		
        // distance between the two boids
		let r = p5.Vector.sub(pos, this.currentBoid.getPos());
		let d = r.mag(); 
        // angle between the two boids
		let angle = r.angleBetween(this.currentBoid.getVel()); 
        angle = isNaN(angle) ? 0.0 : angle; // when one of the vectors is (0,0)

        // excludes itself with the d > 0 statement
		return ((d > 0) && (d < maxDistance) && (angle < maxAngle)); 
    }
}