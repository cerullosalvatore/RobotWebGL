/** File name:      terrain.js
 *  Author:         Salvatore Cerullo
 *  Description:    This file contains the functions for creating and managing the procedural terrain.
 */

//I declare some fundamental variables for land management.
var DIMENSION = 100; //Indicates the size of a single block.
var GRID_H = 10;
var GRID_W = 10;
var TREES1_PER_BLOCK = 10;
var TREES2_PER_BLOCK = 10;
var ROCKS_PER_BLOCK = 7;
var CRYSTALS_PER_BLOCK = 5;

/**
 *Class that defines the block object.
 *
 * @class BlockFloor
 */
class BlockFloor {

    /**
     *The constructor acquires the 3 positions and a type that will indicate the position of the block in the ground grid
     * @param {*} posx 
     * @param {*} posy
     * @param {*} posz
     * @param {*} type
     * @memberof BlockFloor
     */
    constructor(posx, posy, posz, type) {
        this.dimension = DIMENSION;
        this.posx = posx;
        this.posy = posy;
        this.posz = posz;
        this.type = type;
        this.treesCollidable1 = [];
        this.treesCollidable2 = [];
        this.rocksCollidable = [];
        this.crystalsCollidable = [];

        this.setTexture()
        this.setPosition(posx, posy, posz); //Set the position.
        this.addObjects(); //I add the trees to the block.
        this.addCrystals(); //I add the crystals to the block.
        this.addToScen(); //I add the block made to the scene.
    }

    setPosition(posx, posy, posz) {
        this.blockMesh.position.set(posx, posy, posz);
        this.blockMesh.rotation.set(Math.PI / 2, Math.PI, 0); // Rotate the plane so that it is perpendicular to the z axis.
    }

    addToScen() {
        this.blockMesh.castShadow = true;
        this.blockMesh.receiveShadow = true;
        scene.add(this.blockMesh);
    }

    /**
     *  In this function and in the application i utilize some element downloaded from https://poly.google.com/ 
     *  Tree1: Poly by Google
     *  Tree2: Poly by Google
     *  Rocks: Poly by Google
     * @memberof BlockFloor
     */
    addObjects() {

        var mtlLoader = new THREE.MTLLoader();
        var objLoader = new THREE.OBJLoader();
        var i = 0;
        for (i = 0; i < TREES1_PER_BLOCK; i++) {
            mtlLoader.load('./models/tree01.mtl', (materials) => {
                materials.preload()
                objLoader.setMaterials(materials)
                objLoader.load('./models/tree01.obj', (object) => {
                    object.position.y = 0;
                    object.position.x = getRndInteger(this.posx - DIMENSION / 2 + 1, DIMENSION / 2 + this.posx - 1);
                    object.position.z = getRndInteger(this.posz - DIMENSION / 2 + 1, DIMENSION / 2 + this.posz - 1);
                    object.scale.x = 0.04;
                    object.scale.y = 0.04;
                    object.scale.z = 0.04;
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.treesCollidable1.push(object);
                    scene.add(object)
                });

            })
        }

        var mtlLoader2 = new THREE.MTLLoader();
        var objLoader2 = new THREE.OBJLoader();
        var i = 0;
        for (i = 0; i < TREES2_PER_BLOCK; i++) {
            mtlLoader2.load('./models/tree02.mtl', (materials) => {
                materials.preload()
                objLoader2.setMaterials(materials)
                objLoader2.load('./models/tree02.obj', (object) => {
                    object.position.y = 6;
                    object.position.x = getRndInteger(this.posx - DIMENSION / 2 + 1, DIMENSION / 2 + this.posx - 1);
                    object.position.z = getRndInteger(this.posz - DIMENSION / 2 + 1, DIMENSION / 2 + this.posz - 1);
                    object.scale.x = 8;
                    object.scale.y = 8;
                    object.scale.z = 8;
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.treesCollidable2.push(object);
                    scene.add(object)
                });

            })
        }

        var mtlLoader3 = new THREE.MTLLoader();
        var objLoader3 = new THREE.OBJLoader();
        var i = 0;
        for (i = 0; i < ROCKS_PER_BLOCK; i++) {
            mtlLoader3.load('./models/rock02.mtl', (materials) => {
                materials.preload()
                objLoader3.setMaterials(materials)
                objLoader3.load('./models/rock02.obj', (object) => {
                    object.position.y = 0.5;
                    object.position.x = getRndInteger(this.posx - DIMENSION / 2 + 1, DIMENSION / 2 + this.posx - 1);
                    object.position.z = getRndInteger(this.posz - DIMENSION / 2 + 1, DIMENSION / 2 + this.posz - 1);
                    object.scale.x = 1.5;
                    object.scale.y = 1.5;
                    object.scale.z = 1.5;
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.rocksCollidable.push(object);
                    scene.add(object)
                });

            })
        }
    }

    addCrystals() {
        var i;
        for (i = 0; i < CRYSTALS_PER_BLOCK; i++) {
            var crystals = createCrystal();
            crystals[0].position.x = getRndInteger(this.posx - DIMENSION / 2 + 1, DIMENSION / 2 + this.posx - 1);
            crystals[0].position.y = 4;
            crystals[0].position.z = getRndInteger(this.posz - DIMENSION / 2 + 1, DIMENSION / 2 + this.posz - 1);
            crystals[1].position.x = crystals[0].position.x;
            crystals[1].position.y = crystals[0].position.y;
            crystals[1].position.z = crystals[0].position.z;

            this.crystalsCollidable.push(crystals);

            scene.add(crystals[0]);
            scene.add(crystals[1]);
        }
    }

    /**
     * Removes the block from the scene and then from the ground grid.
     *
     * @memberof BlockFloor
     */
    removeBlock() {
        var i;
        for (i = 0; i < this.treesCollidable1.length; i++) {
            scene.remove(this.treesCollidable1[i]);
        }
        for (i = 0; i < this.treesCollidable2.length; i++) {
            scene.remove(this.treesCollidable2[i]);
        }
        for (i = 0; i < this.rocksCollidable.length; i++) {
            scene.remove(this.rocksCollidable[i]);
        }
        for (i = 0; i < CRYSTALS_PER_BLOCK; i++) {
            scene.remove(this.crystalsCollidable[i][0]);
            scene.remove(this.crystalsCollidable[i][1]);
        }
        scene.remove(this.blockMesh);
        this.blockMesh.geometry.dispose();
        this.blockMesh.material.dispose();
    }

    setTexture() {
        var texture = new THREE.TextureLoader().load('textures/grass2.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);
        texture.anisotropy = 16;
        var material = new THREE.MeshLambertMaterial({
            map: texture
        });
        material.map.magFilter = THREE.NearestFilter;
        //material.map.minFilter = THREE.LinearMipMapNearestFilter;
        this.blockMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this.dimension, this.dimension, GRID_H, GRID_W),
            material
        );
    }
}

/**
 *Function that restores a random integer in a range (min, max).
 *
 * @param {*} min
 * @param {*} max
 * @returns
 */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *Function used to create the terrain when the application starts.
 *
 */
function createInitialFloor() {
    //Scorro la griglia 3x3 del pavimento
    var i, j, type = 0;
    for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            blocks.push(new BlockFloor(i * DIMENSION, 0, j * DIMENSION, type + 1));
            type = type + 1;
        }
    }
}

/*  This function takes care of updating the terrain when the character moves from one quadrant to another.

    // The following diagram shows how the individual blocks within the block[] vector are loaded.

                             -Z
             ___________ ___________ ___________
            |           |           |           |
            |   UP_SX   |     UP    |   UP_DX   |
            |     1     |     4     |     7     |
            |___________|___________|___________|
            |           |           |           |
     -X     |     SX    |  CENTRAL  |     DX    |       +X
            |     2     |     5     |     8     |
            |___________|___________|___________|
            |           |           |           |
            |  DOWN_SX  |   DOWN    |  DOWN_DX  |
            |     3     |     6     |     9     |
            |___________|___________|___________|

                             +Z
*/
function updateFloor(type_current_block) {

    switch (type_current_block) {
        //UP_SX
        case 1:
            var i = 0;
            var blocks_old = [];
            for (i = 0; i < 9; i++) {
                blocks_old.push(blocks[i]);
            }
            blocks[0] = new BlockFloor(blocks_old[0].posx - DIMENSION, 0, blocks_old[0].posz - DIMENSION);
            blocks[1] = new BlockFloor(blocks_old[1].posx - DIMENSION, 0, blocks_old[1].posz - DIMENSION);
            blocks[2] = new BlockFloor(blocks_old[2].posx - DIMENSION, 0, blocks_old[2].posz - DIMENSION);
            blocks[3] = new BlockFloor(blocks_old[3].posx - DIMENSION, 0, blocks_old[3].posz - DIMENSION);
            blocks[4] = blocks_old[0];
            blocks[5] = blocks_old[1];
            blocks[6] = new BlockFloor(blocks_old[6].posx - DIMENSION, 0, blocks_old[6].posz - DIMENSION);
            blocks[7] = blocks_old[3];
            blocks[8] = blocks_old[4];

            blocks_old[2].removeBlock();
            blocks_old[5].removeBlock();
            blocks_old[6].removeBlock();
            blocks_old[7].removeBlock();
            blocks_old[8].removeBlock();

            /*
            for (i = 0; i < 9; i++) {
                blocks[i].blockMesh.material.color.setHex(color[i]);
            }
            */

            break;

            //SX (-X)
        case 2:
            var i = 0;
            var blocks_old = [];
            for (i = 0; i < 9; i++) {
                blocks_old.push(blocks[i]);
            }
            blocks[0] = new BlockFloor(blocks_old[0].posx - DIMENSION, 0, blocks_old[0].posz);
            blocks[1] = new BlockFloor(blocks_old[1].posx - DIMENSION, 0, blocks_old[1].posz);
            blocks[2] = new BlockFloor(blocks_old[2].posx - DIMENSION, 0, blocks_old[2].posz);
            blocks[3] = blocks_old[0];
            blocks[4] = blocks_old[1];
            blocks[5] = blocks_old[2];
            blocks[6] = blocks_old[3];
            blocks[7] = blocks_old[4];
            blocks[8] = blocks_old[5];

            blocks_old[6].removeBlock();
            blocks_old[7].removeBlock();
            blocks_old[8].removeBlock();

            /*
            for (i = 0; i < 9; i++) {
                blocks[i].blockMesh.material.color.setHex(color[i]);
            }
            */

            break;

            //DOWN_SX
        case 3:
            var i = 0;
            var blocks_old = [];
            for (i = 0; i < 9; i++) {
                blocks_old.push(blocks[i]);
            }
            blocks[0] = new BlockFloor(blocks_old[1].posx - DIMENSION, 0, blocks_old[1].posz);
            blocks[1] = new BlockFloor(blocks_old[2].posx - DIMENSION, 0, blocks_old[2].posz);
            blocks[2] = new BlockFloor(blocks_old[2].posx - DIMENSION, 0, blocks_old[2].posz + DIMENSION);
            blocks[3] = blocks_old[1];
            blocks[4] = blocks_old[2];
            blocks[5] = new BlockFloor(blocks_old[2].posx, 0, blocks_old[2].posz + DIMENSION);
            blocks[6] = blocks_old[4];
            blocks[7] = blocks_old[5];
            blocks[8] = new BlockFloor(blocks_old[5].posx, 0, blocks_old[5].posz + DIMENSION);

            blocks_old[0].removeBlock();
            blocks_old[3].removeBlock();
            blocks_old[6].removeBlock();
            blocks_old[7].removeBlock();
            blocks_old[8].removeBlock();

            /*
            for (i = 0; i < 9; i++) {
                blocks[i].blockMesh.material.color.setHex(color[i]);
            }
            */

            break;

            //UP (-Z)
        case 4:
            var i = 0;
            var blocks_old = [];
            for (i = 0; i < 9; i++) {
                blocks_old.push(blocks[i]);
            }
            blocks[0] = new BlockFloor(blocks_old[0].posx, 0, blocks_old[0].posz - DIMENSION);
            blocks[1] = blocks_old[0];
            blocks[2] = blocks_old[1];
            blocks[3] = new BlockFloor(blocks_old[3].posx, 0, blocks_old[3].posz - DIMENSION);
            blocks[4] = blocks_old[3];
            blocks[5] = blocks_old[4];
            blocks[6] = new BlockFloor(blocks_old[6].posx, 0, blocks_old[6].posz - DIMENSION);
            blocks[7] = blocks_old[6];
            blocks[8] = blocks_old[7];

            blocks_old[2].removeBlock();
            blocks_old[5].removeBlock();
            blocks_old[8].removeBlock();


            /*
            for (i = 0; i < 9; i++) {
                blocks[i].blockMesh.material.color.setHex(color[i]);
            }
            */
            break;

            //UP (+Z)
        case 6:
            var i = 0;
            var blocks_old = [];
            for (i = 0; i < 9; i++) {
                blocks_old.push(blocks[i]);
            }
            blocks[0] = blocks_old[1];
            blocks[1] = blocks_old[2];
            blocks[2] = new BlockFloor(blocks_old[2].posx, 0, blocks_old[2].posz + DIMENSION);
            blocks[3] = blocks_old[4];
            blocks[4] = blocks_old[5];
            blocks[5] = new BlockFloor(blocks_old[5].posx, 0, blocks_old[5].posz + DIMENSION);
            blocks[6] = blocks_old[7];
            blocks[7] = blocks_old[8];
            blocks[8] = new BlockFloor(blocks_old[8].posx, 0, blocks_old[8].posz + DIMENSION);

            blocks_old[0].removeBlock();
            blocks_old[3].removeBlock();
            blocks_old[6].removeBlock();

            /*
            for (i = 0; i < 9; i++) {
                blocks[i].blockMesh.material.color.setHex(color[i]);
            }
            */
            break;

            //UP_DX
        case 7:
            var i = 0;
            var blocks_old = [];
            for (i = 0; i < 9; i++) {
                blocks_old.push(blocks[i]);
            }

            blocks[0] = new BlockFloor(blocks_old[3].posx, 0, blocks_old[3].posz - DIMENSION);
            blocks[1] = blocks_old[3];
            blocks[2] = blocks_old[4];
            blocks[3] = new BlockFloor(blocks_old[6].posx, 0, blocks_old[6].posz - DIMENSION);
            blocks[4] = blocks_old[6];
            blocks[5] = blocks_old[7];
            blocks[6] = new BlockFloor(blocks_old[6].posx + DIMENSION, 0, blocks_old[6].posz - DIMENSION);
            blocks[7] = new BlockFloor(blocks_old[6].posx + DIMENSION, 0, blocks_old[6].posz);
            blocks[8] = new BlockFloor(blocks_old[7].posx + DIMENSION, 0, blocks_old[7].posz);

            blocks_old[0].removeBlock();
            blocks_old[1].removeBlock();
            blocks_old[2].removeBlock();
            blocks_old[5].removeBlock();
            blocks_old[8].removeBlock();

            /*
            for (i = 0; i < 9; i++) {
                blocks[i].blockMesh.material.color.setHex(color[i]);
            }
            */

            break;

            //UP (-X)
        case 8:
            var i = 0;
            var blocks_old = [];
            for (i = 0; i < 9; i++) {
                blocks_old.push(blocks[i]);
            }
            blocks[0] = blocks_old[3];
            blocks[1] = blocks_old[4];
            blocks[2] = blocks_old[5];
            blocks[3] = blocks_old[6];
            blocks[4] = blocks_old[7];
            blocks[5] = blocks_old[8];
            blocks[6] = new BlockFloor(blocks_old[6].posx + DIMENSION, 0, blocks_old[6].posz, 7);
            blocks[7] = new BlockFloor(blocks_old[7].posx + DIMENSION, 0, blocks_old[7].posz, 7);
            blocks[8] = new BlockFloor(blocks_old[8].posx + DIMENSION, 0, blocks_old[8].posz, 7);

            blocks_old[0].removeBlock();
            blocks_old[1].removeBlock();
            blocks_old[2].removeBlock();

            /*
            for (i = 0; i < 9; i++) {
                blocks[i].blockMesh.material.color.setHex(color[i]);
            }
            */
            break;

            //UP_DX
        case 9:
            var i = 0;
            var blocks_old = [];
            for (i = 0; i < 9; i++) {
                blocks_old.push(blocks[i]);
            }

            blocks[0] = blocks_old[4];
            blocks[1] = blocks_old[5];
            blocks[2] = new BlockFloor(blocks_old[5].posx, 0, blocks_old[5].posz + DIMENSION);
            blocks[3] = blocks_old[7];
            blocks[4] = blocks_old[8];
            blocks[5] = new BlockFloor(blocks_old[8].posx, 0, blocks_old[8].posz + DIMENSION);
            blocks[6] = new BlockFloor(blocks_old[7].posx + DIMENSION, 0, blocks_old[7].posz);
            blocks[7] = new BlockFloor(blocks_old[8].posx + DIMENSION, 0, blocks_old[8].posz);
            blocks[8] = new BlockFloor(blocks_old[8].posx + DIMENSION, 0, blocks_old[8].posz + DIMENSION);

            blocks_old[0].removeBlock();
            blocks_old[1].removeBlock();
            blocks_old[2].removeBlock();
            blocks_old[3].removeBlock();
            blocks_old[6].removeBlock();

            /*
            for (i = 0; i < 9; i++) {
                blocks[i].blockMesh.material.color.setHex(color[i]);
            }
            */

            break;



    }
}

/**
 * This function controls the position of the robot inside the ground and in the case it calls the update function
 *
 * @param {*} z_robot
 * @param {*} x_robot
 */
function checkPosition(z_robot, x_robot) {
    //SX (-X)
    if (z_robot <= (blocks[1].posz + DIMENSION / 2) && z_robot >= (blocks[1].posz - DIMENSION / 2) &&
        x_robot <= (blocks[1].posx + DIMENSION / 2) && x_robot >= (blocks[1].posx - DIMENSION / 2)) {
        updateFloor(2);
    }

    //UP (-Z)
    if (z_robot <= (blocks[3].posz + DIMENSION / 2) && z_robot >= (blocks[3].posz - DIMENSION / 2) &&
        x_robot <= (blocks[3].posx + DIMENSION / 2) && x_robot >= (blocks[3].posx - DIMENSION / 2)) {
        updateFloor(4);
    }

    //DOWN (+Z)
    if (z_robot <= (blocks[5].posz + DIMENSION / 2) && z_robot >= (blocks[5].posz - DIMENSION / 2) &&
        x_robot <= (blocks[5].posx + DIMENSION / 2) && x_robot >= (blocks[5].posx - DIMENSION / 2)) {
        updateFloor(6);
    }

    //UP (+X)
    if (z_robot <= (blocks[7].posz + DIMENSION / 2) && z_robot >= (blocks[7].posz - DIMENSION / 2) &&
        x_robot <= (blocks[7].posx + DIMENSION / 2) && x_robot >= (blocks[7].posx - DIMENSION / 2)) {
        updateFloor(8);
    }

    //UP_SX (-X -Z)
    if (z_robot <= (blocks[0].posz + DIMENSION / 2) && z_robot >= (blocks[0].posz - DIMENSION / 2) &&
        x_robot <= (blocks[0].posx + DIMENSION / 2) && x_robot >= (blocks[0].posx - DIMENSION / 2)) {
        updateFloor(1);
    }

    //UP_SX (-X +Z)
    if (z_robot <= (blocks[2].posz + DIMENSION / 2) && z_robot >= (blocks[2].posz - DIMENSION / 2) &&
        x_robot <= (blocks[2].posx + DIMENSION / 2) && x_robot >= (blocks[2].posx - DIMENSION / 2)) {
        updateFloor(3);
    }

    //UP_DX (+X -Z)
    if (z_robot <= (blocks[6].posz + DIMENSION / 2) && z_robot >= (blocks[6].posz - DIMENSION / 2) &&
        x_robot <= (blocks[6].posx + DIMENSION / 2) && x_robot >= (blocks[6].posx - DIMENSION / 2)) {
        updateFloor(7);
    }

    //DOWN_DX (+X -Z)
    if (z_robot <= (blocks[8].posz + DIMENSION / 2) && z_robot >= (blocks[8].posz - DIMENSION / 2) &&
        x_robot <= (blocks[8].posx + DIMENSION / 2) && x_robot >= (blocks[8].posx - DIMENSION / 2)) {
        updateFloor(9);
    }

    collidableTrees1 = [];
    collidableTrees2 = [];
    collidableRocks = [];

    for (i = 0; i < this.blocks[4].treesCollidable1.length; i++) {
        collidableTrees1.push(this.blocks[4].treesCollidable1[i]);
    }
    for (i = 0; i < this.blocks[4].treesCollidable2.length; i++) {
        collidableTrees2.push(this.blocks[4].treesCollidable2[i]);
    }
    for (i = 0; i < this.blocks[4].rocksCollidable.length; i++) {
        collidableRocks.push(this.blocks[4].rocksCollidable[i]);
    }
}