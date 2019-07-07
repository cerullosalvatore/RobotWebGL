/** File Name:      player_controls.js
 *  Author:         Salvatore Cerullo
 *  Description:    In this file I have inserted the functions 
 *                  that concern the control of the camera and the character.
 */

//Variables for controls
var controls;
var moveForward, moveBackward, moveLeft, moveRight, jump;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
/**
 * createControls(): initializes the functions of the various keyboard 
 *                   buttons that must be enabled
 *
 */
function createControls() {
    controls = new THREE.PointerLockControls(camera);

    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {

        controls.lock();

    }, false);

    controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    });

    /* CONTROLS */
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if (havePointerLock) {
        var element = document.body;
        var pointerlockchange = function (event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                controls.enabled = true;
            } else {
                controls.enabled = false;
            }
        };
        var pointerlockerror = function (event) {};
        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
        document.addEventListener('click', function (event) {
            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
        }, false);
    }

    /* Associamo le varie funzioni al nostro personaggio */
    var onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
            case 87: // w
                if (camera_type != 3) fadeToAction2("Walking", 0.1);
                moveForward = true;
                break;
            case 37:
            case 65: // a
                if (camera_type != 3) fadeToAction2("Walking", 0.1);
                moveLeft = true;
                break;
            case 40:
            case 83: // s
                if (camera_type != 3) fadeToAction2("Walking", 0.1);
                moveBackward = true;
                break;
            case 39:
            case 68: // d
                if (camera_type != 3) fadeToAction2("Walking", 0.1);
                moveRight = true;
                break;
            case 67: //c
                //In questa parte del codice richiamo l'inizializzazione della telecamera in mo che alla sua realizzazione
                //il personaggio non cambi posizione
                switch (camera_type) {
                    case 1:
                        initializeThirdPersonCamera(robot);
                        document.getElementById("ico-cam").src = "/icon/video-camera_2.png";
                        camera_type = 2;
                        break;
                    case 2:
                        initializeFreeCamera();
                        document.getElementById("ico-cam").src = "/icon/video-camera_3.png";
                        camera_type = 3;
                        break;
                    case 3:
                        initializeFirstPersonCamera(robot);
                        document.getElementById("ico-cam").src = "/icon/video-camera_1.png";
                        camera_type = 1;
                        break;
                }
                break;
            case 86: //V
                if (mode_dn == 0) {
                    scene.remove(skyDay);
                    setLightsNight();
                    createSkyNight();
                    document.getElementById("ico-nd").src = "/icon/moon.png";
                    mode_dn = 1;
                } else {
                    scene.remove(skyNight);
                    setLightsDay();
                    createSkyDay();
                    document.getElementById("ico-nd").src = "/icon/sunny.png";
                    mode_dn = 0;
                }
                break;
            case 77: //M
                if(music ==1){
                    audio.pause();
                    audio2.muted = true;
                    document.getElementById("ico-sound").src = "/icon/mute.png";
                    music=0;
                }else{
                    audio.play();
                    audio2.muted = false;
                    document.getElementById("ico-sound").src = "/icon/speaker.png";
                    audio.volume = 0.5;
                    music=1;
                }
                break;
        }
    };

    var onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                if (!moveBackward && !moveForward && !moveLeft && !moveRight) fadeToAction("Idle", 0.2);
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                if (!moveBackward && !moveForward && !moveLeft && !moveRight) fadeToAction("Idle", 0.2);
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                if (!moveBackward && !moveForward && !moveLeft && !moveRight) fadeToAction("Idle", 0.2);
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                if (!moveBackward && !moveForward && !moveLeft && !moveRight) fadeToAction("Idle", 0.2);
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

/**
 * This function will be executed in the animate () function to update the scene 
 * frames. It has several tasks including updating the character's position as well
 * as repositioning the camera. Another important function is to recall the 
 * function that deals with collision detection.
 */
function playerControls() {
    //Elements that allow the variables to be updated to make the move
    var time = performance.now();
    var delta = (time - prevTime) / 1000;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= velocity.y * 100.0 * delta; // 100.0 = mass
    if (moveForward) velocity.z -= 60.0 * delta;
    if (moveBackward) velocity.z += 60.0 * delta;
    if (moveLeft) velocity.x -= 60.0 * delta;
    if (moveRight) velocity.x += 60.0 * delta;


    // In this part of the code I update the position of the character and
    // also reposition the camera on the subject.
    switch (camera_type) {
        //First Person Control
        case 1:
            //I update the character's position in the scene
            robot.translateX(-velocity.x * delta);
            robot.translateZ(-velocity.z * delta);
            //Update the camera position based on the new character position
            updatePositionFirstPerson(robot);
            break;
            //Third person camera
        case 2:
            //In the case of the third-person room it is of fundamental importance to set the movements based on the movement to the right or left or so and to update the position of the character in this way
            if (moveLeft) {
                robot.translateZ(-velocity.x * delta);
            } else {
                if (moveRight) {
                    robot.translateZ(+velocity.x * delta);
                } else {
                    robot.translateX(-velocity.x * delta);
                    robot.translateZ(-velocity.z * delta);
                }
            }
            //I update the character's position in the third person
            updatePositionThirdPerson(robot);
            break;
        case 3:
            //In the case of free view we note that we are going to directly change the 
            //position of the camera. In this case our character will never be moved.
            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);
            initializeFreeCamera();
            break;
    }

    prevTime = time;
}

/* Initialize the position of video camera 1 - First Person Camera*/
function initializeFirstPersonCamera(model) {
    var euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(controls.getObject().quaternion);
    controls.getObject().position.set(model.position.x, 4, model.position.z);
}

/* I update the position of the video camera 1 - First Person Camera*/
function updatePositionFirstPerson(model) {
    //Acquisisco e setto i valori di eulero dalla telecamera
    var euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(controls.getObject().quaternion);
    controls.getObject().position.set(
        model.position.x - Math.sin(euler.y) * 1.5,
        model.position.y + 4,
        model.position.z - Math.cos(euler.y) * 1.5
    );

    //Giro il modello di 180°.
    model.rotation.set(0, euler.y + Math.PI, 0);
}

/* Initialize the position of the camera 2 - Third Person Camera*/
function initializeThirdPersonCamera(model) {
    var euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(controls.getObject().quaternion);
    model.rotation.set(0, euler.y + Math.PI, 0);
    controls.getObject().position.x = 25 * Math.sin(euler.y) + model.position.x;
    controls.getObject().position.y = 6;
    controls.getObject().position.z = 25 * Math.cos(euler.y) + model.position.z;
    controls.getObject().quaternion.x = 0;
    controls.getObject().quaternion.z = 0;
}

/* I update the position of the video camera 2 - Third Person Camera*/
function updatePositionThirdPerson(model) {
    var euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(controls.getObject().quaternion);

    if (moveLeft || moveRight) {
        if (moveLeft) model.rotation.set(0, euler.y + Math.PI + Math.PI / 2, 0);
        if (moveRight) model.rotation.set(0, euler.y + Math.PI - Math.PI / 2, 0);
    } else {
        model.rotation.set(0, euler.y + Math.PI, 0);
    }


    controls.getObject().position.x = 25 * Math.sin(euler.y) + model.position.x;
    controls.getObject().position.y = 6;
    controls.getObject().position.z = 25 * Math.cos(euler.y) + model.position.z;


    controls.getObject().quaternion.x = 0;
    controls.getObject().quaternion.z = 0;

}

/* Initialize the position of video camera 3 - Flight (this function will also be used for updating camera 3). */
function initializeFreeCamera() {
    controls.getObject().position.x = controls.getObject().position.x;
    controls.getObject().position.y = controls.getObject().position.y;
    controls.getObject().position.z = controls.getObject().position.z;
}