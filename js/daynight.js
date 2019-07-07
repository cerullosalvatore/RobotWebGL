/**
 * This function initialize the day lights at the start of the program
 *
 */
function createLightsDay() {

    scene.background = new THREE.Color().setHSL(0.6, 1, 1);
    scene.fog = new THREE.Fog(scene.background, 80, 100);
    // LIGHTS
    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    //hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    //scene.add(hemiLightHelper);

    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 100;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 100;
    dirLight.shadow.bias = -0.0001;

    //dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
    //scene.add(dirLightHeper);

    scene.add(dirLight.target);
}

/**
 * This function set the light when is in the mode night
 *
 */
function setLightsDay() {
    scene.remove(hemiLight);
    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    //hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    //scene.add(hemiLightHelper);

    //
    scene.remove(dirLight);
    scene.remove(dirLight.target);
    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 100;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;


    //dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
    //scene.add(dirLightHeper);
    scene.add(dirLight.target);

}

/**
 * This function set the light when is in the mode day
 *
 */
function setLightsNight() {
    scene.remove(hemiLight);
    hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    //hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    //scene.add(hemiLightHelper);

    scene.remove(dirLight);
    scene.remove(dirLight.target);
    dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 100;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;


    //dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
    //scene.add(dirLightHeper);
    scene.add(dirLight.target);

}

/**
 *  This function update the position of the lights in the world
 *  
 *
 */
function updateLights() {
    dirLight.position.set(robot.position.x, 50, robot.position.z);
    dirLight.target.position.set(robot.position.x - 10, 0, robot.position.z - 10);
    hemiLight.position.set(robot.position.x, 0, robot.position.z);
    if (mode_dn == 0) {
        skyDay.position.set(controls.getObject().position.x, robot.position.y, controls.getObject().position.z);
    } else {
        skyNight.position.set(controls.getObject().position.x, robot.position.y, controls.getObject().position.z);
    }

}

/**
 * This function realize the skydom for the day mode and utilize a personal shaders
 *
 */
function createSkyDay() {
    var uniforms = {
        "topColor": {
            value: new THREE.Color(0x0077ff)
        },
        "bottomColor": {
            value: new THREE.Color(0xffffff)
        },
        "exponent": {
            value: 0.6
        }
    };
    uniforms["topColor"].value.copy(hemiLight.color);

    scene.fog.color.copy(uniforms["bottomColor"].value);

    var skyGeo = new THREE.SphereBufferGeometry(100, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShaderSky').textContent,
        fragmentShader: document.getElementById('fragmentShaderSky').textContent,
        side: THREE.BackSide
    });

    skyDay = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDay);
}

/**
 * This function realize the skydom for the night mode and utilize a personal shaders
 *
 */
function createSkyNight() {
    var uniforms = {
        "topColor": {
            value: new THREE.Color(0x000000)
        },
        "bottomColor": {
            value: new THREE.Color(0x191970)
        },
        "exponent": {
            value: 0.6
        }
    };

    scene.fog.color.copy(uniforms["bottomColor"].value);

    var skyGeo = new THREE.SphereBufferGeometry(100, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShaderSky').textContent,
        fragmentShader: document.getElementById('fragmentShaderSky').textContent,
        side: THREE.BackSide
    });

    skyNight = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyNight);
}