let POSE_CHAIN_INDICES = 
[
    ["0", "1"],
    ["1", "3"],
    ["0", "2"],
    ["2", "4"],
    ["0", "5"],
    ["5", "7"],
    ["7", "9"],
    ["5", "11"],
    ["11", "13"],
    ["13", "15"],
    ["0", "6"],
    ["6", "8"],
    ["8", "10"],
    ["6", "12"],
    ["12", "14"],
    ["14", "16"],
];

const FLAGS = 
{
    WEBGL_CHECK_NUMERICAL_PROBLEMS: true,
    WEBGL_CONV_IM2COL: true,
    WEBGL_CPU_FORWARD: true,
    WEBGL_DELETE_TEXTURE_THRESHOLD: -1,
    WEBGL_DOWNLOAD_FLOAT_ENABLED: true,
    WEBGL_FLUSH_THRESHOLD: -1,
    WEBGL_FORCE_F16_TEXTURES: false,
    WEBGL_LAZILY_UNPACK: true,
    WEBGL_MAX_TEXTURES_IN_SHADER: 16,
    WEBGL_PACK_IMAGE_OPERATIONS: true,
};

/**
 * initializes the tensorflow pose detection algorithm
 */
async function initTF() 
{
    tf.env().setFlags(FLAGS);
  
    const detectorConfig = 
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
}
  
async function videoReady() 
{
    video.size(200, 200);
    //video.hide(); // hides the video from the window
    await getPoses();
}

async function getPoses() 
{
    if (detector) 
        poses = await detector.estimatePoses(video.elt, { maxPoses: 1, flipHorizontal: false, });

    requestAnimationFrame(getPoses);
}

/**
 * method that returns, if defined, the coordinates of both the
 * right wrist and the left wrist
 * 
 * it is null if one of the wrists isn't found on the video capture
 */
function getWrists() 
{
    let output = [null, null];

    if (poses && poses.length > 0)
    {
        for (let kp of poses[0].keypoints)
        {
            let { x, y, score, name } = kp;
            let _x;
            
            if (score > 0.3) 
            {
                // LEFT WRIST
                if(name == "left_wrist")
                {
                    // calibrates the position to the screen
                    _x = map(x, X_CALIB_MIN, X_CALIB_MAX, width, 0);
                    _y = map(y, Y_CALIB_MIN, Y_CALIB_MAX, 0, height) - 50;
                    
                    output[0] = [_x, _y];

                    push();
                    noStroke();
                    // paints green
                    fill(0, 255, 200, 70);
                    circle(_x, _y, 100);
                    pop();
                }

                // RIGHT WRIST
                else if(name == "right_wrist")
                {
                    // calibrates the position to the screen
                    _x = map(x, X_CALIB_MIN, X_CALIB_MAX, width, 0);
                    _y = map(y, Y_CALIB_MIN, Y_CALIB_MAX, 0, height) - 50;
                    
                    output[1] = [_x, _y];

                    push();
                    noStroke();
                    // paints red
                    fill(255, 0, 0, 70);
                    circle(_x, _y, 100);
                    pop();
                } 
            } 
        }
    }
    return output;
}