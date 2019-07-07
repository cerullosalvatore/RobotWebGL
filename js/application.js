/** File name:      application.js
 *  Author:         Salvatore Cerullo
 *  Description:   This file contains the main functions of the program.
 */

//I declare some variables that must be accessible to different functions of the program
//Basic elements
var container, scene, camera, renderer;
var hemiLight, dirLight, skyDay, skyNight;
var camera_type = 1; //As value from 1 to 3: 1 - First Person Camera; 2 - Third person camera; 3 - Free camera;
var mode_dn = 0; //As value from 0 to 1: 0 - Day; 1 - Night.
var music = 0; //As value from 0 to 1: 0 - OFF; 1 - ON.
var audio = document.getElementsByTagName("audio")[0];
var audio2 = document.getElementsByTagName("audio")[1];
//Elements for the character
var robot, animations, activeAction, previousAction, mixer;
var clock = new THREE.Clock();
var loading_model = false; //This indicate if the character is loaded on the scene
var api = {
    state: 'Idle'
};

//Elements for the world
var blocks = []; //Array of 9 block of terrain
var collidableTrees1 = []; // An array of collidable trees1 that limitated the characters movement
var collidableTrees2 = []; // An array of collidable trees2 that limitated the characters movement
var collidableRocks = []; // An array of collidable rocks that limitated the characters movement
var crystalsCollidable = [];
var remotionCrystal = []; // An array of collidable objects that the character must collect
var score = 0; // Score of the game

/* init(): This will manage all functions of the application. */
function init() {
    // Tihis script show the state on the up left corner
    (function () {
        var script = document.createElement('script');
        script.onload = function () {
            var stats = new Stats();
            document.body.appendChild(stats.dom);
            requestAnimationFrame(function loop() {
                stats.update();
                requestAnimationFrame(loop)
            });
        };
        script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
        document.head.appendChild(script);
    })()

    //SCENE
    createScene();
    //CAMERA
    createCamera();
    //CHARACTER
    importRobot();
    //FLOOR
    createInitialFloor();
    //CONTROLS
    createControls();
    //DAY LIGHTS
    createLightsDay();
    //SKY DAY
    createSkyDay();
    //RENDERER
    createRenderer(); //Realize the render object. It is foundamental for the threejs applicatoins.
    window.addEventListener('resize', onWindowResize, false); //Function that deals with the realization of the animation of our scene
    onWindowResize(); //Call the resize function.
    //AUDIO
    audio2.muted = true;
    //ANTIMATE
    animate(); //Function that deals with the realization of the animation of the scene.
}

/* createScene: initialize the scene of our program. */
function createScene() {
    scene = new THREE.Scene(); // I create a new Scene object
    scene.background = new THREE.Color(0x8FBCD4); //I set a bg to the scene
}

/*createCamera(): Realize and position the camera inside our scene. */
function createCamera() {
    //Initialize the camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    //I set the initial position of my camera.
    camera.position.set(0, 4, 0);
}

/*createRender(): Initialize the Render of our scene.*/
function createRenderer() {
    // create a WebGLRenderer and set its width and height
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innertHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    //renderer.gammaInput = true;
    //renderer.gammaOutput = true;

    renderer.shadowMapEnabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaFactor = 1;
    renderer.gammaOutput = true;

    //renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);
}

/*importRobot(): function that deals with importing the character into our scene. */
function importRobot() {
    //I use the GLTF loader made available by threejs.
    var loader = new THREE.GLTFLoader();
    loader.load(
        "./models/RobotExpressive.glb",
        function (gltf) {
            var scale = 1;
            robot = gltf.scene;
            robot.rotation.set(0, Math.PI, 0);
            robot.scale.set(scale, scale, scale);
            robot.position.set(0, 0, 0);
            robot.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });
            scene.add(robot);
            animations = gltf.animations;
            createAnimations(robot, animations); //Function implemented within robotAnimations.js .
            loading_model = true;
        });

}

/*animate(): function that constantly updates our scene and therefore what we visualize. */
function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    if (loading_model) {
        playerControls(); // Funcion implemented within player_controls.js
        mixer.update(delta);
        // Call up the functions for collision detection-.
        checkCollisionTree(delta, velocity, collidableTrees1, 2);
        checkCollisionTree(delta, velocity, collidableTrees2, 4.5);
        checkCollisionTree(delta, velocity, collidableRocks, 2);
        checkCollisionCrystal(delta);
        checkPosition(robot.position.z, robot.position.x); //For update terrain
        crystalAnimation(delta);
        animationRemotionCrystal(delta); //Funcion implemented within collisions.js

        updateLights();
    }
    renderer.render(scene, camera);
}

/* Function for resizing the window */
function onWindowResize() {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

/* Call and then run the init () function. */
init();

/**
 *This function is called within the animation function and will be executed in loop.
 *It takes care of deleting the elements inserted in an array from the 
 *checkCollisionCrystal () function, creating an animation.
 */
function animationRemotionCrystal(delta) {
    for (i = 0; i < remotionCrystal.length; i++) {
        if (remotionCrystal[i][0].position.y <= 10) {
            remotionCrystal[i][0].position.y += delta * 15;
            remotionCrystal[i][1].position.y += delta * 15;
        } else {
            scene.remove(remotionCrystal[i][0]);
            scene.remove(remotionCrystal[i][1]);
            remotionCrystal.splice(i, 1)
            i--;
        }
    }
}