
// tw_movie プロジェクト特有の処理をまとめる。
// three.js ammoなどから必要に応じてメソッドが呼ばれる。
// このuser 以外は、基本的には他のプロジェクトでも使えるはず。
const user = new function () {
    this.create_objects = function (physics, canvas_rect) {
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();

        // origin
        /*
        physics.createParalellepipedWithPhysics(0, 10, 10, 100, pos.set(60, 60, 50), quat, physics.createMaterial(0xff0000));
        physics.createParalellepipedWithPhysics(0, 10, 10, 100, pos.set(400, 60, 50), quat, physics.createMaterial(0xff0000));
        physics.createParalellepipedWithPhysics(0, 10, 10, 100, pos.set(400, 400, 50), quat, physics.createMaterial(0xff0000));
        physics.createParalellepipedWithPhysics(0, 10, 10, 100, pos.set(60, 400, 50), quat, physics.createMaterial(0xff0000));
        */

        // Ground
        const ground = physics.createParalellepipedWithPhysics(0, canvas_rect.width, canvas_rect.height, 100, pos.set(canvas_rect.width / 2, canvas_rect.height / 2, -5), quat.set(0, 0, 0, 1),
            new THREE.MeshPhongMaterial({ opacity: 0., transparent: true }));


        /*
        const ground = physics.createParalellepipedWithPhysics(0, 340, 340, 10, pos.set(170 + 60, 170 + 60, -5), quat.set(0, 0, 0, 1),
            new THREE.MeshPhongMaterial({ color: 0x886600 }));
        */
        //ground.receiveShadow = true;
        /*
        new THREE.TextureLoader().load("textures/grid.png", function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(40, 40);
            ground.material.map = texture;
            ground.material.needsUpdate = true;
        });
        */

        // frame
        /*
        let h_frame = 20;
        const frame_color = 0x8b4513;
        physics.createParalellepipedWithPhysics(0, 340, 1, h_frame, pos.set(170 + 60, 60, h_frame / 2), quat, physics.createMaterial(frame_color));
        physics.createParalellepipedWithPhysics(0, 340, 1, h_frame, pos.set(170 + 60, 170 + 60 + 170, h_frame / 2), quat, physics.createMaterial(frame_color));
        physics.createParalellepipedWithPhysics(0, 1, 340, h_frame, pos.set(60, 170 + 60, h_frame / 2), quat, physics.createMaterial(frame_color));
        physics.createParalellepipedWithPhysics(0, 1, 340, h_frame, pos.set(340 + 60, 170 + 60, h_frame / 2), quat, physics.createMaterial(frame_color));

        physics.createParalellepipedWithPhysics(0, 170, 1, h_frame, pos.set(170 * 2 + 60, 170 + 60, h_frame / 2), quat, physics.createMaterial(frame_color));
        */


        // moving object
        /*
        for (let i = 0; i < 1; i++) {
            const obj = physics.createParalellepipedWithPhysics(1, 16, 16, 16,
                pos.set((i % 225 % 15) * 20 + 70, Math.floor((i % 225) / 15) * 20 + 70, Math.floor(i / 225) * 20 + 5), quat.set(0, 0, 0, 1),
                physics.createMaterial(0x000000));
            obj.userData.hsl = { h: 60 / 360, s: 1.0, l: 1.0 };
        }
        */
    };

    // physical objectに関連付けられていないthree.jsのアニメーション
    this.update_three_animation = function () {
        /*
        for (const cube of cubes.filter(e => e.do_effect !== undefined)) {
            cube.rotation.x += cube.do_effect[0];
            cube.rotation.y += cube.do_effect[1];
            cube.do_effect[2] -= 1;
            cube.do_effect = cube.do_effect[2] > 0 ? cube.do_effect : undefined;
        }
        points.update();
        */
        //debug_cube.position.set(debug_cube.position.x, debug_cube.position.y - 1, debug_cube.position.z);
    };

    this.update_physics = function (p, q) {
        /*
        // 枠の外に出ないようにする
        const mi = 60 + 8, mx = 400 - 8;
        if (p.x < mi || p.x > mx || p.y < mi || p.y > mx || p.z < 0) {
            //$("#debug > text").text(["x", "y", "z"].map(e => Math.round(p[e]())).join(","));

            p.setX(Math.max(mi, Math.min(mx, p.x)));
            p.setY(Math.max(mi, Math.min(mx, p.y)));
            p.setZ(Math.max(0, Math.min(20, p.z)));
        }
        */
    };
    this.update_three = function (p, q, objThree) {
        // 色を変える
        const a = 0.1 / ((p.z + 1) * 5 + 0.1);
        if (objThree !== undefined && objThree.userData.hsl !== undefined) {
            objThree.userData.hsl.l = Math.max(0.1, objThree.userData.hsl.l - a);
            objThree.material.color.setHSL(objThree.userData.hsl.h, objThree.userData.hsl.s, objThree.userData.hsl.l);
        }
    }
};

// 配列の最初でオブジェクトを作成して、そのあとの関数で値をセットする。
Array.prototype.a2e = function () { return this.reduce((e, f) => { f(e); return e; }); }

// create physics system
// この関数の実行は、 const physics = new create_physics(....)とnewを付けて実行する。
// そしてこの関数内で this.func = function(){...} と記述される関数は、physics.funcとコールできる公開関数となる。
const create_physics = function (scene, update_physics, update_three, step_speed_rate = 1) {
    this.scene = scene;
    const gravityConstant = 7.8;
    let collisionConfiguration;
    let dispatcher;
    let broadphase;
    let solver;
    let physicsWorld;
    const margin = 0.05;
    const reductionSpaceEffect = 1;

    //const convexBreaker = new ConvexObjectBreaker();
    // Rigid bodies include all movable objects
    const rigidBodies = [];

    // Physics configuration
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);


    this.enable_updatePhysics = true;
    this.step_speed_rate = step_speed_rate;

    this.set_animations_to_object = function (obj, animations) {
        obj.ani_ctrl = {
            anis: animations,
            acts: [],// datum json is {name:string,action:AnimationAction}
            mix: new THREE.AnimationMixer(obj),
            play_animation: function (name) {
                if (name === undefined) {
                    return;
                }
                this.acts.forEach(e => e.blending = (e.name === name ? 0.5 : -0.5));
            },
            blend: function (delta_time_s) {
                this.acts.filter(e => e.blending !== 0).forEach(e => {
                    e.action.weight += e.blending * delta_time_s;
                    if (e.action.weight > 1.0 || e.action.weight < 0.0) {
                        e.action.weight = e.action.weight > 0 ? 1.0 : 0.0;
                        e.blending = 0.0;
                    }
                })
            },
        };
        animations.forEach(e => {
            obj.ani_ctrl.acts.push({
                name: e.name,
                action: [
                    obj.ani_ctrl.mix.clipAction(e),
                    e => e.weight = 0.0,
                    e => e.play(),
                ].a2e(),
                blending: 0,
            });
        });
        obj.ani_ctrl.play_animation(animations[0].name);
    };

    this.set_gravity = function (x, y, z) {
        physicsWorld.setGravity(new Ammo.btVector3(x, y, z));
    }
    this.set_gravity(0, 0, -gravityConstant);


    this.createRigidBody = function (physicsShape, mass, pos, quat, vel, angVel, update) {
        pos = pos.clone().divideScalar(reductionSpaceEffect);
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        const motionState = new Ammo.btDefaultMotionState(transform);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);

        // body.setFriction(0.1);
        // body.setRollingFriction(0.1);

        if (vel) {
            body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z));
        }
        if (angVel) {
            body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z));
        }
        body.userData = { update: update };

        if (mass > 0) {
            //rigidBodies.push(object);
            rigidBodies.push(body);

            //var STATE = {
            // ACTIVE : 1,
            // ISLAND_SLEEPING : 2,
            // WANTS_DEACTIVATION : 3,
            // DISABLE_DEACTIVATION : 4,
            // DISABLE_SIMULATION : 5
            // }
            // Disable deactivation
            body.setActivationState(4);
        }
        physicsWorld.addRigidBody(body);
        return body;
    }
    const tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);
    this.createConvexHullPhysicsShape = function (coords) {
        const shape = new Ammo.btConvexHullShape();
        for (let i = 0, il = coords.length; i < il; i += 3) {
            tempBtVec3_1.setValue(coords[i], coords[i + 1], coords[i + 2]);
            const lastOne = (i >= (il - 3));
            shape.addPoint(tempBtVec3_1, lastOne);
        }
        return shape;
    }
    this.createModelWithPhysics = function (view, collider, mass, pos, quat, vel, angVel, update) {
        view.position.copy(pos);
        view.quaternion.copy(quat);
        this.scene.add(view);

        collider.setMargin(margin);
        const body = this.createRigidBody(collider, mass, pos, quat, vel, angVel, update);
        body.userData.objThree = view;
        view.userData.rigidBody = body;
        return view;
    }
    this.createParalellepipedWithPhysics = function (mass, sx, sy, sz, pos, quat, material) {
        const view = new THREE.Mesh(new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1), material);
        const collider = this.createBoxShape([sx, sy, sz]);
        return this.createModelWithPhysics(view, collider, mass, pos, quat);

        // const view = new THREE.Mesh(new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1), material);
        // view.position.copy(pos);
        // view.quaternion.copy(quat);
        // scene.add(view);

        // const shape = this.createBoxShape([sx, sy, sz]);
        // shape.setMargin(margin);
        // const body = this.createRigidBody(shape, mass, pos, quat);
        // body.userData.objThree = view;
        // view.userData.rigidBody = body;
        // return view;
    }
    this.createBoxShape = function (size) {
        return new Ammo.btBoxShape(new Ammo.btVector3(...size.map(x => x * 0.5 / reductionSpaceEffect)));
    }
    this.createSphereShape = function (r) {
        return new Ammo.btSphereShape(r / reductionSpaceEffect);
    }
    this.setLinearVelocity = function (view, v) {
        view.userData.rigidBody.setLinearVelocity(new Ammo.btVector3(...v));
    }
    this.setAngularVelocity = function (view, v) {
        view.userData.rigidBody.setAngularVelocity(new Ammo.btVector3(...v));
    }

    this.getPosition = function (view) {
        return view.position;
    }
    this.setPosition = function (view, p) {
        const transform = new Ammo.btTransform;
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(...p));
        view.userData.rigidBody.setWorldTransform(transform);
        view.userData.rigidBody.getMotionState().setWorldTransform(transform);
    }

    this.createDebrisFromBreakableObject = function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        const shape = createConvexHullPhysicsShape(object.geometry.attributes.position.array);
        shape.setMargin(margin);
        const body = createRigidBody(object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity);
        this.scene.add(object);

        // Set pointer back to the three object only in the debris objects
        const btVecUserData = new Ammo.btVector3(0, 0, 0);
        btVecUserData.threeObject = object;
        body.setUserPointer(btVecUserData);
    }
    this.createObject = function (mass, halfExtents, pos, quat, material) {
        const object = new THREE.Mesh(new THREE.BoxBufferGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2), material);
        object.position.copy(pos);
        object.quaternion.copy(quat);
        convexBreaker.prepareBreakableObject(object, mass, new THREE.Vector3(), new THREE.Vector3(), true);
        createDebrisFromBreakableObject(object);
    }


    this.createRandomColor = function () {
        return Math.floor(Math.random() * (1 << 24));
    }
    this.createMaterial = function (color) {
        //color = color || createRandomColor();
        //return new THREE.MeshPhongMaterial({ opacity: 0., transparent: true })
        return new THREE.MeshStandardMaterial(
            Object.assign({}, color === undefined ? { opacity: 0, transparent: true } : { color: color })
        );
    }

    function phys2tree_vector3(vec) {
        return new THREE.Vector3(vec.x(), vec.y(), vec.z());
    }
    function tree2phys_vector3(vec) {
        return new Ammo.btVector3(vec.x, vec.y, vec.z);
    }
    function phys2tree_quaternion(q) {
        return new THREE.Quaternion(q.x(), q.y(), q.z(), q.w());
    }
    function tree2phys_quaternion(q) {
        return new Ammo.btQuaternion(q.x, q.y, q.z, q.w);
    }

    //let debug_flag = true;
    const transformAux1 = new Ammo.btTransform();
    this.updatePhysics = function (deltaTime) {
        /*
        let numObjectsToRemove = 0;
        const impactPoint = new THREE.Vector3();
        const impactNormal = new THREE.Vector3();
        */
        // Step world (deltaTime is a step time in second, but this is very slow in my environment, so multiply some value in order to speed up)
        if (this.enable_updatePhysics) {
            physicsWorld.stepSimulation(deltaTime * this.step_speed_rate, 0);
        }

        // Update rigid bodies
        for (let i = 0, il = rigidBodies.length; i < il; i++) {
            const objThree = rigidBodies[i].userData.objThree;
            const objPhys = rigidBodies[i];
            const ms = objPhys.getMotionState();

            if (ms) {
                ms.getWorldTransform(transformAux1);
                const p_phys = phys2tree_vector3(transformAux1.getOrigin());
                const p_view = p_phys.clone().multiplyScalar(reductionSpaceEffect);

                /*
                console.log("phys",p_phys);
                console.log("p_view",p_view);
                */

                const q = phys2tree_quaternion(transformAux1.getRotation());

                const p_view_0 = p_view.clone();
                const q_0 = q.clone();
                update_physics(p_view, q);
                if (rigidBodies[i].userData.update !== undefined) {
                    rigidBodies[i].userData.update(p_view, q);
                }
                if (p_view_0.equals(p_view) === false || q_0.equals(q) === false) {
                    p_phys.copy(p_view.clone().divideScalar(reductionSpaceEffect));
                    transformAux1.setOrigin(tree2phys_vector3(p_phys));
                    transformAux1.setRotation(tree2phys_quaternion(q));
                    objPhys.setWorldTransform(transformAux1);
                    ms.setWorldTransform(transformAux1);
                }

                if (objThree !== undefined) {
                    objThree.position.set(p_view.x, p_view.y, p_view.z);
                    objThree.quaternion.set(q.x, q.y, q.z, q.w);
                    update_three(p_view, q, objThree);
                }
            }
        }
    }
    // return {
    //     updatePhysics: updatePhysics, set_gravity: this.set_gravity, createParalellepipedWithPhysics: createParalellepipedWithPhysics,
    //     createMaterial: createMaterial, createRandomColor: createRandomColor,
    //     createRigidBody: createRigidBody, createBoxShape: createBoxShape, createSphereShape: createSphereShape,
    // };
    return this;
};

// particle system
const particles = function () {
    const numParticles = 100;
    const init_life = () => Math.ceil(50 * Math.random()) + 20;
    const positions0 = new Float32Array(numParticles * 3).map((e, i) => i % 3 === 2 ? 0 : Math.random() * 20);
    const positions = Float32Array.from(positions0);
    const velocities = new Float32Array(numParticles * 3).map((e, i) => [Math.random() - 0.5, Math.random() * -2, 0][i % 3]);
    const lifes = new Float32Array(numParticles).map((e, i) => init_life());
    //const colors = new Float32Array(numParticles * 3).map((e, i) => i % 3 === 0 ? 0xff : 0x00/*Math.random() * 0xff*/);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const init_size = () => 0.1;
    const sizes = new Float32Array(numParticles).map((e, i) => init_size());
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));

    // マテリアルを作成
    /*
    const texture = new THREE.TextureLoader().load("images/pngwing.com.png");
    const material = new THREE.PointsMaterial({
        size: 16, blending: THREE.AdditiveBlending,
        transparent: true, depthTest: false, map: texture,
        //vertexColors: true,
        //color: 0xff8888,
        //color: 0x00ff00,
        vertexShader: document.getElementById('vertexshader').textContent,
    });
    */
    const uniforms = {
        pointTexture: { value: new THREE.TextureLoader().load("images/pngwing.com.png") }
    };
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true,
    });

    // 物体を作成
    const mesh = new THREE.Points(geometry, material);
    mesh.position.set(250, 200, 0);
    mesh.sortParticles = false;
    scene.add(mesh);

    function update() {
        const positions = this.mesh.geometry.attributes.position.array;
        const sizes = geometry.attributes.size.array;
        for (let i = 0; i < this.numParticles * 3; i += 3) {
            if (lifes[i / 3] === 0) {
                positions[i + 0] = positions0[i + 0];
                positions[i + 1] = positions0[i + 1];
                lifes[i / 3] = init_life();
                sizes[i / 3] = init_size();
            } else {
                positions[i + 0] += velocities[i + 0];
                positions[i + 1] += velocities[i + 1];
                lifes[i / 3] -= 1;
                sizes[i / 3] *= 0.95;
            }
        }
        this.mesh.geometry.attributes.position.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;
    }
    return { mesh: mesh, numParticles: numParticles, update: update };
}

// 加速度センサー
const start_acceleration = new function () {
    let acceleration_started = false;
    return function (cb) {
        if (acceleration_started === false) {
            const is_android = navigator.userAgent.indexOf('Android') > 0;
            let add_listener = () => {
                acceleration_started = true;
                window.addEventListener("devicemotion", function (event) {
                    let a = ["x", "y", "z"].map(ax => (is_android ? -1 : 1) * event.accelerationIncludingGravity[ax] /** 100*/);
                    cb(a[0], a[1], a[2]);
                });
            };
            if (is_android) {
                add_listener();
            } else if ((DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function')) {
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        add_listener();
                    } else {
                        // 許可を得られない
                    }
                }).catch(e => { console.log("ERROR : " + e); });
            }
        }
    }
};

// three.js ammo
const three = function (canvas_rect, onloaded) {
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(60, canvas_rect.width / canvas_rect.height, 1, 2000);

    const camera_h = Math.sqrt(3) * canvas_rect.height / 2;
    camera.position.set(canvas_rect.width / 2, canvas_rect.height / 2, camera_h);
    camera.lookAt(new THREE.Vector3(canvas_rect.width / 2, canvas_rect.height / 2, 0));

    // [-1, 1].forEach(e => {
    //     const light = new THREE.DirectionalLight(0xffffff, 0.3);
    //     light.position.set(0, 0, e);
    //     scene.add(light);
    // });
    {
        const light = new THREE.AmbientLight(0xffffff, 1.);
        scene.add(light);
    }

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(canvas_rect.width, canvas_rect.height);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = canvas_rect.top + "px";
    renderer.domElement.style.left = canvas_rect.left + "px";
    renderer.domElement.style.zIndex = 1;
    renderer.domElement.style.pointerEvents = "none"; // マウスイベント等を処理しない
    document.body.appendChild(renderer.domElement);

    /*****************************************************************************************************
     * // test debug
    let debug_cube = undefined;
    {
        const geometry = new THREE.BoxGeometry(50, 50, 10);
        const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });

        for (let x of [0, canvas_rect.width / 2, canvas_rect.width]) {
            for (let y of [0, canvas_rect.height / 2, canvas_rect.height]) {
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(x, y, 0);
                scene.add(cube);
            }
        }
        //debug_cube = cube;
    }
    {
        const geometry = new THREE.BoxGeometry(50, 50, 10);
        const material = new THREE.MeshLambertMaterial({ color: 0xaa0000 });
        for (let xy of [[600, 400], [200, 600], [200, 200]]) {
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(xy[0], canvas_rect.height - xy[1], 0);
            scene.add(cube);
        }
    }
    /******************************************************************************************************/

    Ammo().then(function (AmmoLib) {
        Ammo = AmmoLib;
        physics = new create_physics(scene, user.update_physics, user.update_three);
        // skinnedmeshをコピーするcloneメソッドをこのphysicsに移植する。
        add_SkeletonUtils(physics);
        user.create_objects(physics, canvas_rect);
        const start_animate = new function () {
            const physics_update_rate = 1.0;
            let animated_count = 0;
            const animate = function () {
                requestAnimationFrame(animate);

                animated_count += 1;
                const deltaTime = clock.getDelta(); // 単位 秒
                if (1 / physics_update_rate <= animated_count) {
                    physics.updatePhysics(deltaTime);
                    animated_count = 0;
                }
                user.update_three_animation();
                // debug用にtest_scene, test_cameraがセットされているとそちらを使用する。
                // console.log(physics.scene);
                renderer.render(physics.scene, physics.test_camera ?? camera);

                // animatin debug
                // physics.update_animation?.(deltaTime);
                physics.scene.children.filter(e => e.ani_ctrl !== undefined).forEach(e => {
                    e.ani_ctrl.blend(deltaTime);
                    e.ani_ctrl.mix.update(deltaTime);
                });
            }
            animate();
        };
        document.addEventListener("touchend", (e) => {
            start_acceleration((x, y, z) => {
                physics.set_gravity(x, y, z);
            });
        });
        onloaded(physics);
    });
};

const add_SkeletonUtils = function (physics) {
    physics.parallelTraverse = function (a, b, callback) {
        callback(a, b);
        for (let i = 0; i < a.children.length; i++) {
            this.parallelTraverse(a.children[i], b.children[i], callback);
        }
    };
    physics.clone = function (source) {
        const sourceLookup = new Map();
        const cloneLookup = new Map();
        const clone = source.clone();
        this.parallelTraverse(source, clone, function (sourceNode, clonedNode) {
            sourceLookup.set(clonedNode, sourceNode);
            cloneLookup.set(sourceNode, clonedNode);
        });
        clone.traverse(function (node) {
            if (!node.isSkinnedMesh) return;
            const clonedMesh = node;
            const sourceMesh = sourceLookup.get(node);
            const sourceBones = sourceMesh.skeleton.bones;
            clonedMesh.skeleton = sourceMesh.skeleton.clone();
            clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);
            clonedMesh.skeleton.bones = sourceBones.map(function (bone) {
                return cloneLookup.get(bone);
            });
            clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
        });
        if (source.ani_ctrl?.anis !== undefined) {
            physics.set_animations_to_object(clone, source.ani_ctrl.anis);
        }
        return clone;
    };

};

const load_script = function (fname, tp = "text/javascript") {
    return new Promise((resolve, reject) => {
        const sc = document.createElement("script");
        sc.type = tp;
        sc.src = fname;
        sc.onload = e => resolve();
        sc.onerror = e => reject(e);
        const s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(sc, s);
    });
}

// スクリプトファイルの読み込み
const script_loader = async function (threejs_folder, canvas_rect, onloaded) {
    // 動的にthree.js/examples/jsm/utils/SkeletonUtils.jsを読み込もうとする。
    // javascript moduleなので、import関数を使用すると、SkeletonUtils.jsにおいてfrom threeと書かれている箇所でエラーになる。
    // あらかじめscript type=importmapを用意してこの文字threeは何を読み込むのかを指定する必要がありそう。
    // そこでscriptのimportmapを動的に以下のように追加しようとすると、"An import map is added after module script load was triggered."
    // と表示されて結果的にimportmapが適用されていなく、SkeletonUtilsにおけるエラーは解消されていない。
    // とりあえず、SkeletonUtilsで必要な関数はcloneだけなのでそれをこのファイルに追加して、とりあえず動作させる。   
    // await (async function () {
    //     const sc = document.createElement("script");
    //     sc.type = "importmap";
    //     sc.innerText = `{"imports":{"three":"/${threejs_folder}/build/three.module.js"}}`;
    //     const s = document.getElementsByTagName("script")[0];
    //     s.parentNode.insertBefore(sc, s);
    //     console.log(await import(`/${threejs_folder}/build/three.module.js`));
    // })();
    const js_files = [
        `${threejs_folder}/examples/js/libs/ammo.wasm.js`,
        `${threejs_folder}/build/three.js`,
        `${threejs_folder}/examples/js/loaders/GLTFLoader.js`,
    ];
    for (const js of js_files) {
        await load_script(js);
    }
    // import(`/${threejs_folder}/examples/jsm/utils/SkeletonUtils.js`)
    three(canvas_rect, onloaded);

    // 以下のコードは非同期にJSファイルを読み込むもの。
    // その時に、GLTFLoader.jsでTHREEが未定義というエラーが出たので、上の同期的に変更した。
    // const loader = new Promise(resolve => {
    //     const js_files = [
    //         `${threejs_folder}/examples/js/libs/ammo.wasm.js`,
    //         `${threejs_folder}/build/three.js`,
    //         `${threejs_folder}/examples/js/loaders/GLTFLoader.js`,
    //     ];
    //     let loaded_counter = 0;
    //     for (const name of js_files) {
    //         const script = document.createElement('script');
    //         script.src = name;
    //         script.onload = (e) => {
    //             loaded_counter += 1;
    //             if (loaded_counter === js_files.length) {
    //                 resolve("loaded");
    //             }
    //         }
    //         document.body.appendChild(script);
    //     }
    // }).then((ret) => {
    //     three(canvas_rect, onloaded);
    // })
}

// このscriptファイルを利用する関数
const tw_movie_three = function (threejs_folder, elem, onloaded) {
    // このjavascriptを読み込むhtmlファイルへのパラメータ
    const html_params = [...new URLSearchParams(location.search).entries()].reduce((obj, e) => ({ ...obj, [e[0]]: e[1] }), {});
    if (html_params["light"] === undefined || html_params["light"] == 0) {
        // script_loader({ w: elem.offsetWidth, h: elem.offsetHeight}, onloaded);
        script_loader(threejs_folder, elem.getBoundingClientRect(), onloaded);
    }
};
