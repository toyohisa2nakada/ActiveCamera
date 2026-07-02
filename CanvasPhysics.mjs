/*
Three.js, Ammo.jsによる物理のテスト
*/
export const CanvasPhysics = {

    efc: undefined,
    canvas_wh: undefined,
    objects: [],
    model: undefined,
    effect_start_flag: false,

    init: async function (canvas) {
        this.canvas_wh = [canvas.width, canvas.height];
        if (this.efc === undefined) {
            await this.load_script(`libs/three.js_libs/tw_movie_three.js?${Date.now()}`);
            // tw_movie_three("three.js-master.r138", canvas, e => this.onload(e));
            tw_movie_three("../../neko_editor/libs/three.js-master.r138", canvas, e => this.onload(e));

            ["keydown"].forEach(e => {
                const ef = `on_${e}`;
                const _ef = `_${ef}`;
                this[_ef] ??= (ei) => { this[ef](ei); };
                const elem = (e.includes("key") ? document.body : canvas);
                elem.removeEventListener(e, this[_ef]);
                elem.addEventListener(e, this[_ef]);
            });
        }
    },
    on_keydown: function (e) {
        if (e.key === "u") {
            this.effect_start_flag = !this.effect_start_flag;
        } else if (e.key >= 0 && e.key <= 5) {
            const aname = this.objects[0]?.ani_ctrl.anis[e.key]?.name;
            console.log("key", e.key, "ani name", aname);
            if (aname !== undefined) {
                this.objects.forEach(o => {
                    o.ani_ctrl.play_animation(aname);
                })
            }
        }
    },
    set_viewpoint_element: function (e, ctx, wh) {
    },
    update_viewpoint: function (factors, dt, effective_pixels) {
        if (this.effect_start_flag === false || this.efc === undefined || factors.length === 0 || this.objects.length === 100 || this.model === undefined) {
            return;
        }
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();

        const createObject = (pos, quat) => {
            Array.prototype.choice = function () {
                return this[Math.floor(this.length * Math.random())];
            };
            // 黄色いプリミティブオブジェクト
            // return this.efc.createParalellepipedWithPhysics(1, 2, 2, 10, pos, quat, this.efc.createMaterial("#ffff00"));

            // トトロモデル
            const vel = new THREE.Vector3();
            vel.set(0, 0, 10);
            // this.model.scale.set(10, 10, 10);
            const m = this.efc.clone(this.model);
            m.ani_ctrl.play_animation?.(m.ani_ctrl.anis.map(e => e.name).choice());

            // this.efc.set_animation(m, "Bear_Walk.glb");
            // this.efc.set_animation(m, "animation");
            return this.efc.createModelWithPhysics(m, this.efc.createBoxShape([8, 8, 8]),
                1.0, pos, quat, vel);
        };

        // 変化のあった箇所の中からランダムに選択した場所にオブジェクトを落下させる。
        pos.set(...factors[Math.floor(factors.length * Math.random())].
            slice(0, 2).map((e, i) => i == 0 ? e : this.canvas_wh[1] - e), 30);
        this.objects.push(createObject(pos, quat));
        // console.log("obj 0 ", this.objects[0])


        // 物体を作成し、位置の移動と速度の移動を、stepSimulationの有る/なしの2状態で実施する。
        // if (this.objects.length === 0) {
        //     pos.set(...this.canvas_wh.map(e => e / 2), 200);
        //     this.objects.push(this.efc.createParalellepipedWithPhysics(1, 100, 100, 100,
        //         pos, quat, this.efc.createMaterial("#ffff00")));
        //     let d = 1;
        //     setInterval(()=>{
        //         // this.efc.setLinearVelocity(this.objects[0],[0,15*d,10]);
        //         // this.efc.setAngularVelocity(this.objects[0],[0,0.5*d,0]);
        //         const p = this.efc.getPosition(this.objects[0]);
        //         console.log(p);
        //         this.efc.setPosition(this.objects[0],[p.x+1,p.y,p.z]);
        //         d *= -1;
        //     },2);
        //     setInterval(()=>{
        //         this.efc.setLinearVelocity(this.objects[0],[-20,0,0]);
        //     },2000);
        //     setInterval(()=>{
        //         this.efc.enable_updatePhysics = !this.efc.enable_updatePhysics;
        //     },5000);
        // }
    },

    load_script: function (fname) {
        return new Promise((resolve, reject) => {
            const sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.src = fname;
            sc.onload = () => resolve();
            sc.onerror = (e) => reject(e);
            const s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(sc, s);
        });
    },
    load_json: function (url) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status === 200) {
            return JSON.parse(xhr.response);
        }
        return "";
    },

    // three.js, ammo の初期化が終わるとコールされる。
    onload: async function (efc) {
        console.log("loaded three.js and ammo.js");
        this.efc = efc;
        // this.efc.step_speed = 4;

        // gltファイルの読み込み
        // const loader = new THREE.GLTFLoader();
        // loader.load(
        //     "three.js_libs/3d_models/cat1/cat_-_walking.glb", gltf => {
        //         console.log("gltf",gltf);

        //         loader.load("three.js_libs/3d_models/cat1/cat_-_idle.glb", gltf2 => {
        //             console.log("gltf2",gltf2)
        //             Object.assign(this.efc.animations, {animation: gltf2.animations})
        //             this.model = gltf.scene;
        //         });

        //     },
        //     (progress) => { }
        // );
        // return;

        let objectloader_count = 0;

        (new THREE.ObjectLoader()).load(`libs/three.js_libs/3d_models/ball/uploads_files_1859469_ball_1.json?${Date.now()}`, obj => {
            if (objectloader_count != 0) {
                return;
            }
            objectloader_count++;
            this.model = this.efc.clone(obj.children[0]);
            // this.model = this.efc.clone(obj.getObjectByName("Armature_yellow"));
            this.efc.set_animations_to_object(this.model, obj.children[0].animations);
            this.model.scale.set(40, 40, 40);
            console.log(this.model);
        })
        return;

        // シーンは、threejs.org/editor/で作成したモデルをFile-Export Sceneで出力したもの
        (new THREE.ObjectLoader()).load(`libs/three.js_libs/3d_models/bear/scene_dl_by_threejs_org.json?${Date.now()}`, obj => {
            if (objectloader_count != 0) {
                return;
            }
            objectloader_count++;

            const obj_name = "Bear_Walk.glb";
            // this.model = this.efc.clone(obj.getObjectByName(obj_name));
            this.model = this.efc.clone(obj.children[0]);
            this.efc.set_animations_to_object(this.model, obj.children[0].animations);
            this.model.scale.set(50, 50, 50);
            console.log("obj", obj);
            console.log("model", this.model);
        }, xhr => { }, err => { console.log(err) }
        );

    },
};
