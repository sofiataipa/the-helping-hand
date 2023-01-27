
class Seek extends Behaviour 
{
    constructor(weight) { super(weight); }

    getDesired(currentBoid)
    {   
        let target = currentBoid.getVision().getSeekTarget(); // search for the target

        let desired = p5.Vector.sub(target, currentBoid.getPos()); // desired is the difference between the 2 positions
        
        let d = desired.mag();

        if(d < FAR_VISION_DIST * 2.5) // if is close enough
            return desired 
        else
            return createVector(0, 0);
    }
} 