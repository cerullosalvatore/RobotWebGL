/**
 *This function deals with the creation of crystals.
 *
 * @returns
 */
function createCrystal() {
    //Realize the object that simulate the light and i call this mesh
    // establish variable for our mesh object 
    var mesh;

    // determine a length and width for each particle
    var length = 0.2,
        width = 0.5;

    // Realize the shape that i want extrude
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    //Extrude that shape
    var extrudeSettings = {
        steps: 0,
        amount: 0,
        bevelEnabled: true,
        bevelThickness: 0.53,
        bevelSize: 0.53,
        bevelSegments: 2
    };

    //Define the geometry based on the settings above
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    for (var i = 0; i < geometry.faces.length; i++) {
        geometry.faces[i].color.setHex(0xffffff);
    }

    //The material was create exploiting personal shaders
    var material = new THREE.ShaderMaterial({
        uniforms: {
            viewVector: {
                type: "v3",
                value: camera.position
            }
        },
        vertexShader: document.getElementById("vertexShaderCrystal").textContent,
        fragmentShader: document.getElementById("fragmentShaderCrystal").textContent,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    //Realize the object that is the solid object  
    var mesh1;
    var length = 0.2,
        width = 0.5;

    //Realize the light effect of the element
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    //Extrude that shape
    var extrudeSettings = {
        steps: 0,
        amount: 0,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelSegments: 2
    };

    //Define the geometry based on the settings above
    var geometry2 = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    for (var i = 0; i < geometry.faces.length; i++) {
        geometry.faces[i].color.setHex(0xffffff);
    }

    //Define a material for the mesh
    var material2 = new THREE.MeshPhongMaterial({
        color: 0xFF0000
    });

    var meshes = [];
    meshes.push();
    // geometry + material = mesh (sugar particle)
    mesh = new THREE.Mesh(geometry, material);
    mesh1 = new THREE.Mesh(geometry2, material2);
    mesh.castShadow = true;
    meshes.push(mesh);
    meshes.push(mesh1);

    return meshes;
}

/* Function that deals with the rotation of the "crystals". */
function crystalAnimation(delta) {
    var i, j;
    for (i = 0; i < 9; i++) {
        for (j = 0; j < blocks[i].crystalsCollidable.length; j++) {
            blocks[i].crystalsCollidable[j][0].rotation.y += delta;
            blocks[i].crystalsCollidable[j][1].rotation.y += delta;
        }
    }
}
