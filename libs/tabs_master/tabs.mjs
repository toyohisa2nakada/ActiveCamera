// await import("https://unpkg.com/uuid@latest/dist/umd/uuidv4.min.js");
await import("./uuidv4.min.js");
export const createTabs = (element, listener) => {
    const tabs = Object.create(Tabs);
    tabs.uuid = uuidv4();
    tabs.parent = element;
    tabs.listeners = [];
    tabs.parent.classList.add(`tabs_${tabs.uuid}`);
    tabs.buttons = document.createElement("div");
    tabs.buttons.appendChild(
        [e => e.classList.add("content0", "lamp"), e => e.id = `lamp_${tabs.uuid}`].
            reduce((a, e) => { e(a); return a; }, document.createElement("div"))
    );
    tabs.parent.appendChild(
        [e => e.id = `tab-buttons_${tabs.uuid}`].
            reduce((a, e) => { e(a); return a; }, tabs.buttons)
    );
    tabs.contents = document.createElement("div");
    tabs.parent.appendChild(
        [e => e.id = `tab-content_${tabs.uuid}`].
            reduce((a, e) => { e(a); return a; }, tabs.contents)
    );
    listener === undefined || tabs.add_listener(listener);
    return tabs;
};
// prototypeとして使用するため、この連想配列に変数は実装しない。
const Tabs = {
    add_listener: function (f) {
        this.listeners.push(f);
    },
    // cssの生成
    update_css: function () {
        const id = `style_${this.uuid}`;
        const n = this.buttons.children.length - 1;
        const w = Number(100.0 / n).toFixed(2);
        const content_display = this.contents.children.length === 0 ? "none" : "inline-block";
        document.getElementById(id)?.remove();
        const style = document.createElement("style");
        style.id = id;
        style.innerText = 
            `.tabs_${this.uuid} {margin:10px auto;position:relative;}` +
            `#tab-buttons_${this.uuid} span{cursor:pointer;border-bottom:2px solid #ddd;display:block;float:left;text-align:center;height:40px;line-height:40px;width:${w}%;font-size:small;}` +
            `#tab-content_${this.uuid} {border-bottom:3px solid #ddd;padding:15px;display:${content_display};}` +
            `#lamp_${this.uuid} {height:4px;background:#333;display:block;position:absolute;top:40px;transition:all .3s ease-in;width:${w}%;}` +
            [...Array(n).keys()].map(i => `#lamp_${this.uuid}.content${i} {left:${Number(i * 100 / n).toFixed(2)}%;}`).join(" ") +
            "";
        document.head.appendChild(style);
    },
    // tabがクリックされたときの処理
    onclick_tab: function (e) {
// console.log("onclick_tab",this.uuid,"listeners",this.listeners);
        const clist = document.getElementById(`lamp_${this.uuid}`).classList;
        [...clist].filter(c => c.startsWith("content")).forEach(c => clist.remove(c));
        const content_name = [...e.classList].filter(c => c.startsWith("content"))[0];
        clist.add(content_name);

        const contents = document.getElementById(`tab-content_${this.uuid}`);
        if (contents.children.length > 0) {
            Array.from(contents.children).forEach(c => c.style.display = "none");
            contents.querySelectorAll(`.${e.className}`)[0].style.display = "block";
        }
        const title = this.buttons.querySelector(`.${content_name}:not(.lamp)`);
        this.listeners.forEach(l => { l({ name: content_name, title: title }) });
    },
    // タブの追加
    add: function (label, content) {
        const cno = Number([...([...this.buttons.querySelectorAll(".lamp ~ *")].slice(-1)[0]?.classList || ["content-1"])].filter(e=>e.startsWith("content"))[0].replace("content",""))+1;
        const name = `content${cno}`;
        this.buttons.appendChild(
            [
                e => e.classList.add(name),
                e => e.addEventListener("click", ev => this.onclick_tab(ev.currentTarget)),
            ].reduce((a, e) => { e(a); return a; }, label)
        );
        content === undefined || this.contents.appendChild(
            [e => e.classList.add(name),].
                reduce((a, e) => { e(a); return a; }, content)
        );
        this.update_css();
        const current_name = [...document.getElementById(`lamp_${this.uuid}`).classList].filter(c => c.startsWith("content"))[0];

        this.onclick_tab(this.buttons.querySelector(`.${current_name}:not(.lamp)`));
        return name;
    },
    remove: function(name){
        return this.remove_from_name(name);
    },
    remove_from_name: function(name){
        const e = this.get_title_element_from_name(name);
        e?.remove();
        this.update_css();
    },
    remove_from_content_no: function(cno){
        const e = this.get_title_element_from_content_no(name);
        e?.remove();
        this.update_css();
    },
    // タブの変更
    replace: function (cno, label) {
        const e = this.get_title_element_from_content_no(cno);
        if (e != null) {
            this.buttons.insertBefore(
                [
                    e => e.classList.add(cno),
                    e => e.addEventListener("click", ev => this.onclick_tab(ev.currentTarget)),
                ].reduce((a, e) => { e(a); return a; }, label), e
            );
            e.remove();
        }
    },
    // タイトルのHTMLエレメント取得
    get_title_element_from_content_no: function (cno) {
        return this.buttons.querySelector(`.${cno}:not(.lamp)`);
    },
    get_title_element_from_name: function(name){
        return [...this.buttons.querySelectorAll(".lamp ~ *")].filter(e=>e.innerText.match(new RegExp(name)))[0];
    },
    // タブ数の取得
    length: function () {
        return this.buttons.children.length - 1;
    },
};
