function createAnimations(model, animations) {
    var states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    var emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
    mixer = new THREE.AnimationMixer(model);
    actions = {};
    //fadeToAction(api.state, 0.5);
    for (var i = 0; i < animations.length; i++) {
        var clip = animations[i];
        var action = mixer.clipAction(clip);
        actions[clip.name] = action;
        if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
        }
    }

    // states

    function createEmoteCallback(name) {
        api[name] = function () {
            fadeToAction(name, 0.2);
            mixer.addEventListener('finished', restoreState);
        };
    }

    function restoreState() {
        mixer.removeEventListener('finished', restoreState);
        fadeToAction(api.state, 0.2);
    }

    for (var i = 0; i < emotes.length; i++) {
        createEmoteCallback(emotes[i]);
    }

    // expressions
    face = model.getObjectByName('Head_2');
    var expressions = Object.keys(face.morphTargetDictionary);

    activeAction = actions['Idle'];
    activeAction.play();
}

function fadeToAction(name, duration) {
    previousAction = activeAction;
    activeAction = actions[name];
    if (previousAction !== activeAction) {
        previousAction.fadeOut(duration);
    }
    activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
}

function fadeToAction2(name, duration) {
    previousAction = activeAction;
    activeAction = actions[name];
    if (previousAction !== activeAction) {
        previousAction.fadeOut(duration);
        activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
    }
}

