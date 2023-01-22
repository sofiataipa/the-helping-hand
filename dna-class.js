class DNA 
{
    constructor()
    {
        this.maxSpeed = random(MIN_SPEED, MAX_SPEED);
        this.maxForce = random(MIN_FORCE, MAX_FORCE);

        this.farVisionDist = FAR_VISION_DIST;
        this.farVisionAngle = FAR_VISION_ANG;

        this.nearVisionDist = NEAR_VISION_DIST;
        this.nearVisionAngle = NEAR_VISION_ANG;
    }

    getMaxSpeed() { return this.maxSpeed; }
    getMaxForce() { return this.maxForce; }

    getFarVisionDist() { return this.farVisionDist; }
    getFarVisionAngle() { return this.farVisionAngle; }

    getNearVisionDist() { return this.nearVisionDist; }
    getNearVisionAngle() { return this.nearVisionAngle; }
}

