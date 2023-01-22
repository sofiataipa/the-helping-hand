/**
 * Author: Sofia Taipa
 * Last Updated: 16/01/2021
 * 
 * References:
 *  https://natureofcode.com/
 *  https://github.com/tensorflow/tfjs-models/tree/master/pose-detection 
 *  https://editor.p5js.org/carles.gutierrez/sketches/_GJ2jKsZx
 */

// General
let cnv;
let debug = false; // when true, can see the vision field of the boids
const SIZE = 1; // size of the canvas of the screen (0 to 1)

// Pose detection
let detector;
let poses;
let video;
//calibration of the coordinates from the video input to the canvas
const X_CALIB_MIN = 20;
const X_CALIB_MAX = 600;
const Y_CALIB_MIN = 0;
const Y_CALIB_MAX = 470;

// Time
let lastTimeStamp = 0;
let dt = 0; // delta time

// Flock
let flock;
let nBoids = 350;
let mass = 1;

const MAX_RADIUS = 120;
const MIN_RADIUS = 30;

let allWeights = [1, 900, 1, 10]; // align, separate, cohesion, flee
const BAHAVIOUR_TYPE = { 
    TYPE_ALIGN: 0, 
    TYPE_SEPARATE: 1, 
    TYPE_COHESION: 2, 
    TYPE_FLEE: 3
};

// DNA
const MIN_SPEED = 50;
const MAX_SPEED = 60;

const MIN_FORCE = 40;
const MAX_FORCE = 70;

const FAR_VISION_DIST  = 50;
const NEAR_VISION_DIST = 20;

const FAR_VISION_ANG  = Math.PI * 0.3; // sees 30% of 180º to each side
const NEAR_VISION_ANG = Math.PI;       // sees 360º 

////////////////////////

async function setup() 
{
    updateCanvas(); // draws canvas
    video = createCapture(VIDEO, videoReady); // generate video
    flock = new Flock(nBoids, mass, allWeights);
    await initTF(); // initialize tensorflow
}

function draw() 
{
    background(10,40);
    getDeltaTime();
    updateTargets();
    flock.applyBehaviours(dt);
    flock.draw();    
}

/**
 * searches for the coordinates of each hand and updates the flock
 * behaviour accordingly
 */
function updateTargets()
{
    let wrists = getWrists();
    
    // LEFT HAND -> SEEK
    if(wrists[0] != null)
        flock.seekOut(wrists[0][0], wrists[0][1]);
    else
        flock.removeSeekOut();
    
    // RIGHT HAND -> FLEE
    if(wrists[1] != null)
        flock.fleeFrom(wrists[1][0], wrists[1][1]); 
    else
        flock.removeFleeFrom();
}

/**
 * helps with smooth animation
 */
function getDeltaTime() 
{
    let now = millis(); // milliseconds
    dt = (now - lastTimeStamp) / 1000.; // delta time in seconds
    lastTimeStamp = now;
}

/**
 * draws and configures the canvas position 
 */
function updateCanvas() 
{
  cnv = createCanvas(windowWidth*SIZE, windowHeight*SIZE);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

// each time the window is resized, the canvas is updated
function windowResized() { updateCanvas(); }







