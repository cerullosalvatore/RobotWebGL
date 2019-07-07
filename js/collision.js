/** File name:      collision.js
 *  Author:         Salvatore Cerullo
 *  Description:    This file contains the functions for managing collisions between the robot and the elements of the scene.
 */


/**
 *  This function takes care of collisions with trees inserted in the scene eploiting te raycasting.
 *
 * @param {*} delta
 * @param {*} velocity
 */
function checkCollisionTree(delta, velocity, collidableObjects, minDistance) {
    //Movement Forward (W)
    if (moveForward) {
        var i = 0;
        for (i = -1; i <= 1; i = i + 0.1) {
            //I realize the vectors to which the ray will point.
            var vectorDirection = new THREE.Vector3(i, 0, 1);
            vectorDirection.applyQuaternion(robot.quaternion);
            var ray = new THREE.Raycaster(robot.position, vectorDirection); //I realize the beam that will point from my robot to the tree.
            var intersects = ray.intersectObjects(collidableObjects, true); //I get the intersections of the radius.
            if (intersects.length > 0 && intersects[0].distance < minDistance) {
                // If the radius returns an intersection with a minor object of minDistance then invert the translation of the robot in such a way that I will have a null movement.
                robot.translateX(velocity.x * delta);
                robot.translateZ(velocity.z * delta);
            }
        }
    }

    //Movement Backword (S)
    if (moveBackward) {
        var i = 0;
        for (i = -1; i <= 1; i = i + 0.1) {
            //I realize the vectors to which the ray will point.
            var vectorDirection = new THREE.Vector3(i, 0, -1);
            vectorDirection.applyQuaternion(robot.quaternion);
            var ray = new THREE.Raycaster(robot.position, vectorDirection); //I realize the beam that will point from my robot to the tree.
            var intersects = ray.intersectObjects(collidableObjects, true); //I get the intersections of the radius.
            if (intersects.length > 0 && intersects[0].distance < minDistance - 1) {
                // If the radius returns an intersection with a minor object of minDistance then invert the translation of the robot in such a way that I will have a null movement.
                robot.translateX(velocity.x * delta);
                robot.translateZ(velocity.z * delta);
            }
        }
    }

    //Movement Left (A)
    if (moveLeft) {
        //In this case i need to distinguish the two cameras, as the movement of the character is different.
        if (camera_type == 1) {
            var i = 0;
            for (i = -1; i <= 1; i = i + 0.1) {
                //I realize the vectors to which the ray will point.
                var vectorDirection = new THREE.Vector3(1, 0, i);
                vectorDirection.applyQuaternion(robot.quaternion);
                var ray = new THREE.Raycaster(robot.position, vectorDirection); //I realize the beam that will point from my robot to the tree.
                var intersects = ray.intersectObjects(collidableObjects, true); //I get the intersections of the radius.
                if (intersects.length > 0 && intersects[0].distance < minDistance) {
                    // If the radius returns an intersection with a minor object of minDistance then invert the translation of the robot in such a way that I will have a null movement.
                    robot.translateX(velocity.x * delta);
                    robot.translateZ(velocity.z * delta);
                }

            }
        }
        if (camera_type == 2) {
            var i = 0;
            for (i = -1; i <= 1; i = i + 0.1) {
                //I realize the vectors to which the ray will point.
                var vectorDirection = new THREE.Vector3(i, 0, 1);
                vectorDirection.applyQuaternion(robot.quaternion);
                var ray = new THREE.Raycaster(robot.position, vectorDirection); //I realize the beam that will point from my robot to the tree.
                var intersects = ray.intersectObjects(collidableObjects, true); //I get the intersections of the radius.
                if (intersects.length > 0 && intersects[0].distance < minDistance - 1) {
                    // If the radius returns an intersection with a minor object of minDistance then invert the translation of the robot in such a way that I will have a null movement.
                    robot.translateZ(velocity.x * delta);
                }

            }
        }
    }

    //Movement Right (D)
    if (moveRight) {
        if (camera_type == 1) {
            var i = 0;
            for (i = -1; i <= 1; i = i + 0.1) {
                //I realize the vectors to which the ray will point.
                var vectorDirection = new THREE.Vector3(-1, 0, i);
                vectorDirection.applyQuaternion(robot.quaternion);
                var ray = new THREE.Raycaster(robot.position, vectorDirection); //I realize the beam that will point from my robot to the tree.
                var intersects = ray.intersectObjects(collidableObjects, true); //I get the intersections of the radius.
                if (intersects.length > 0 && intersects[0].distance < minDistance) {
                    // If the radius returns an intersection with a minor object of minDistance then invert the translation of the robot in such a way that I will have a null movement.
                    robot.translateX(velocity.x * delta);
                    robot.translateZ(velocity.z * delta);
                }

            }
        }
        if (camera_type == 2) {
            var i = 0;
            for (i = -1; i <= 1; i = i + 0.1) {
                //I realize the vectors to which the ray will point.
                var vectorDirection = new THREE.Vector3(i, 0, 1);
                vectorDirection.applyQuaternion(robot.quaternion);
                var ray = new THREE.Raycaster(robot.position, vectorDirection); //I realize the beam that will point from my robot to the tree.
                var intersects = ray.intersectObjects(collidableObjects, true); //I get the intersections of the radius.
                if (intersects.length > 0 && intersects[0].distance < minDistance - 1) {
                    // If the radius returns an intersection with a minor object of minDistance then invert the translation of the robot in such a way that I will have a null movement.
                    robot.translateZ(-velocity.x * delta);
                }

            }
        }
    }
}

/**
 *This function takes care of collisions with crystal inserted in the scene exploiting te intersectBox of threejs.
 *
 */
function checkCollisionCrystal() {
    if (loading_model) {
        var i;
        //I make a box containing the character
        var vecMax = new THREE.Vector3(robot.position.x + 1, 3.6, robot.position.z + 1);
        var vecMin = new THREE.Vector3(robot.position.x - 1, 0, robot.position.z - 1);
        var bbox = new THREE.Box3(vecMin, vecMax);
        
        for (i = 0; i < blocks[4].crystalsCollidable.length; i++) {
            var box2 = new THREE.Box3().setFromObject(blocks[4].crystalsCollidable[i][0]);
            // If I have an intersection that has not yet been captured I add +1 to the score and insert the element into a removal list that will be edited by the function animationRemotionCrystal ():
            if (bbox.intersectsBox(box2)) {
                if (remotionCrystal.indexOf(blocks[4].crystalsCollidable[i]) == -1) {
                    score++;
                    audio2.currentTime = 0;
                    audio2.play();
                    document.getElementById("points_view").innerHTML = "X" + score;
                    remotionCrystal.push(blocks[4].crystalsCollidable[i]);
                }
            }
        }
    }

}

