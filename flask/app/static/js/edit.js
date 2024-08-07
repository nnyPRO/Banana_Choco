// function

function createEleFromStr(str) {
    const a = document.createElement("div");
    a.innerHTML = str.trim();
    return a.firstChild;
}

// set data

class DataManage {
    title = document.getElementById("title");
    tag_field = document.getElementById("tag-field");
    card_form = document.getElementById("card-form");
    tags = [];
    input_tags = [];
    old_data = {}
    db_tags = [];
    delete_input = [];
    suggest_icon = "/static/image/suggestion-icon.png";
    delete_icon = "/static/image/recycle-bin.png";
    edit_icon = "/static/image/edit.png";
    edit_confirm = document.getElementById("edit-own");
    currentPage = "prop";

    constructor(deck_data) {
        this.old_data = deck_data;
        this.title.value = deck_data.name;
        if (deck_data.is_public && document.getElementById("status").value==="private") {
            onStatusToggle();
        }
        deck_data.tags.forEach(tag_data => {
            this.addTag(tag_data["name"], tag_data["id"]);
        });
        deck_data.cards.forEach((card, index)=>{
            this.createInputTag(index, card);
        });
        this.getDBtagFromServer();
    }

    async getDBtagFromServer() {
        const response = await fetch("/api/tag", {method: "GET"});
        const result = await response.json();
        this.db_tags = result.data.map(val=>{return {id: val.id, name: val.name};});
    }

    getDeckID() {
        return this.old_data.deck_id;
    }

    getDeleteID() {
        return this.delete_input;
    }

    getPage() {
        return this.currentPage;
    }

    togglePage() {
        if (this.currentPage==="prop") {
            this.currentPage="card";
        } else {
            this.currentPage="prop";
        }
    }

    getTags() {
        return this.tags;
    }
 
    getDBtag() {
        return this.db_tags;
    }

    getInputTag() {
        return this.input_tags;
    }

    removeTag(id) {
        this.tags = this.tags.filter(val=>val.id!==id);
    }

    addTag(name, dbid=0) {
        if (!name) {
            return;
        }
        let id = 0;
        if (this.tags.length!==0) {
            id = this.tags[this.tags.length-1].id + 1;
        }
        let already_have = false;
        for (const tag of this.tags) {
            if (tag.tag.toLowerCase()===name || (tag.dbid!=0 && tag.dbid===dbid)) {
                already_have = true;
                break;
            }
        }
        if (already_have) {
            confirm_.open("This tag is already there.", "The tag you mentioned is already present in the field. Could you please consider adding a different name tag?")
            return;
        }
        const tag_tag = document.createElement("div");
        tag_tag.append(document.createTextNode(name));
        const delete_tag = document.createElement("div");
        delete_tag.classList.add("x");
        delete_tag.addEventListener("click", (e)=>{
            this.tags = this.tags.filter(val=>{
                if (val.id===id) {
                    val.element.remove();
                    return false;
                }
                return true;
            });
        });
        delete_tag.innerHTML = "<div></div><div></div>";
        tag_tag.append(delete_tag);
        this.tag_field.append(tag_tag);
        this.tags.push({ id, tag: name, dbid, element: tag_tag });
    }

    createInputTag(order, data) {
        const tag = `<div class="card-form-grp" order_="${order}" is_edited="f" old_id="${data.id}">
            <input style="grid-area: in1;" id="question" name="question" value="${data.question}" type="text" placeholder="Question..." disabled>
            <input style="grid-area: in2;" id="answer" name="answer" value="${data.answer}" type="text" placeholder="Answer..." disabled>
            <input type="text" name="is_recom" value="t" hidden>
            <input type="text" name="own_recom" value="${data.is_own ? "t" : "f"}" hidden>
            <input type="text" name="edit_origin" value="f" hidden>
            <input type="text" name="ref" value="${data.id}" hidden>
            <button style="grid-area: btn1;" type="button" onclick="datamng.onEditInput(this);"><div class="icon-img" style="background-image: url(${this.edit_icon});"></div></button>
            <button style="grid-area: btn2;" type="button" onclick="datamng.onDeleteInput(this);"><div class="icon-img" style="background-image: url(${this.delete_icon});"></div></button>
        </div>`
        const tag_element = createEleFromStr(tag);
        this.card_form.appendChild(tag_element);
        this.input_tags.push({ order_id: order, element: tag_element});
    }

    onEditInput(element) {
        // this.tag_field.children[0].setAttribute("disable", "false");
        const parent = element.parentElement;
        if (parent.children[3].value==="t") {
            const edit_own_change = document.getElementById("edit-own-change");
            const edit_own_nchange = document.getElementById("edit-own-nchange");

            this.edit_confirm.style.display = "flex";

            function replaceBTN() {
                const new_btn_change = "<button id=\"edit-own-change\" type=\"button\">change</button>";
                const tag_change = createEleFromStr(new_btn_change);
                edit_own_change.replaceWith(tag_change);
                const new_btn_nc = "<button id=\"edit-own-nchange\" type=\"button\">not change</button>";
                const tag_nc = createEleFromStr(new_btn_nc);
                edit_own_nchange.replaceWith(tag_nc);
            }
            
            edit_own_change.addEventListener("click", (e)=>{
                parent.children[4].value = "t";
                parent.setAttribute("is_edited", "t");
                parent.children[0].disabled = false;
                parent.children[1].disabled = false;
                element.children[0].style.backgroundImage = `url(${this.suggest_icon})`;
                element.setAttribute("onclick", "onSuggestClick(this);");
                replaceBTN();
                this.closeEditOwn();
            });

            edit_own_nchange.addEventListener("click", (e)=>{
                parent.setAttribute("is_edited", "t");
                parent.children[0].disabled = false;
                parent.children[1].disabled = false;
                element.children[0].style.backgroundImage = `url(${this.suggest_icon})`;
                element.setAttribute("onclick", "onSuggestClick(this);");
                replaceBTN();
                this.closeEditOwn();
            });
        } else {
            parent.children[4].value = "t";
            parent.setAttribute("is_edited", "t");
            element.children[0].style.backgroundImage = `url(${this.suggest_icon})`;
            element.setAttribute("onclick", "onSuggestClick(this);");
            parent.children[0].disabled = false;
            parent.children[1].disabled = false;
        }
        
        
    }

    onDeleteInput(element) {
        const parent = element.parentElement;
        const id = parseInt(parent.children[5].value);
        const order_id = parseInt(parent.getAttribute("order_"));
        if (id!==0 && parent.getAttribute("is_edited")!=="n") {
            confirm_.open("Do you want to remove this card?", "After this action, this card will be removed only from this deck.", ()=>{
                this.delete_input.push(id);
                parent.replaceWith([]);
            });
        } else {
            parent.replaceWith([]);
        }
        this.input_tags = this.input_tags.filter(val=>val.order_id !== order_id);
    }

    closeEditOwn() {
        this.edit_confirm.style.display = "none";
    }

    onAddInput() {
        let order = 0;
        if (this.input_tags.length!==0) {
            order = this.input_tags[this.input_tags.length-1].order_id + 1;
        }
        const tag = `<div class="card-form-grp" order_="${order}" is_edited="n" old_id="0">
            <input style="grid-area: in1;" id="question" name="question" value="" type="text" placeholder="Question...">
            <input style="grid-area: in2;" id="answer" name="answer" value="" type="text" placeholder="Answer...">
            <input type="text" name="is_recom" value="f" hidden>
            <input type="text" name="own_recom" value="f" hidden>
            <input type="text" name="edit_origin" value="f" hidden>
            <input type="text" name="ref" value="0" hidden>
            <button style="grid-area: btn1;" type="button" onclick="onSuggestClick(this);"><div class="icon-img" style="background-image: url(${this.suggest_icon});"></div></button>
            <button style="grid-area: btn2;" type="button" onclick="datamng.onDeleteInput(this);"><div class="icon-img" style="background-image: url(${this.delete_icon});"></div></button>
        </div>`;
        const tag_element = createEleFromStr(tag)
        this.card_form.appendChild(tag_element);
        this.card_form.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.input_tags.push({ order_id: order, element: tag_element });
    }

    searchInput(word) {
        if (word.length!==0) {
            word = word.toLowerCase();
            const word_len = word.length;
            this.input_tags.forEach(val=>{
                const qus = val.element.children[0].value.toLowerCase();
                const ans = val.element.children[1].value.toLowerCase();
                if (qus.length < word_len && ans.length < word_len) {
                    val.element.style.display = "none";
                } else if (qus.slice(0, word_len)!==word && ans.slice(0, word_len)!==word) {
                    val.element.style.display = "none";
                } else {
                    val.element.style.display = "grid";
                }
            });
        } else {
            this.clearSearch()
        }
    }

    clearSearch() {
        this.input_tags.forEach(val=>{
            val.element.style.display = "grid";
        });
    }
}

const datamng = new DataManage(deck_data);

const tag_input = document.getElementById("tag-insert");
const rec_tab = document.getElementById("tag-recm");

function onSearchTag(word) {
    const word_length = word.length;
    const db_tags = datamng.getDBtag();
    let result = [];
    for (const val of db_tags) {
        if (val.name.toLowerCase().slice(0, word_length)===word.toLowerCase()) {
            result.push(val);
            if (result.length===3) {
                return result;
            }
        }
    }
    return result;
}

function deleteAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChildren);
    }
}

tag_input.addEventListener("input", (e)=>{
    // deleteAllChildren(rec_tab);
    rec_tab.replaceChildren()
    if (e.target.value.length > 0) {
        onSearchTag(e.target.value).forEach(element => {
            const li_tag = document.createElement("li");
            li_tag.addEventListener("click", (e)=>{
                datamng.addTag(element.name, element.id);
                tag_input.value = "";
                rec_tab.replaceChildren();
            });
            li_tag.innerHTML = element.name;
            rec_tab.append(li_tag);
        });
    }
});

const tag_form = document.getElementById("tag-form");
tag_form.addEventListener("submit", (e)=>{
    e.preventDefault();
    datamng.addTag(tag_input.value, 0);
    rec_tab.replaceChildren();
    tag_input.value = "";
});

// toggle status

function onStatusToggle() {
    const status_toggle = document.getElementById("status-toggle");
    const status_input = document.getElementById("status");
    const private_toggle = document.getElementById("private-toggle");
    const public_toggle = document.getElementById("public-toggle");
    const current = status_input.value;
    const circle = status_toggle.getElementsByClassName("circle");
    if (current==="private") {
        status_input.value = "public"
        circle[0].classList.add("switch");
        private_toggle.classList.remove("activate");
        public_toggle.classList.add("activate");
        status_toggle.classList.add("activate");
    } else {
        status_input.value = "private"
        circle[0].classList.remove("switch");
        public_toggle.classList.remove("activate");
        private_toggle.classList.add("activate");
        status_toggle.classList.remove("activate");
    }
}

// change page
const prop_btn = document.getElementById("prop-btn");
const card_btn = document.getElementById("card-btn");
const bg_btn = document.getElementById("bg-btn");
const prop_form = document.getElementById("prop-form");
const card_mng = document.getElementById("card-mng");

function onChangePage(page) {
    if (page!==datamng.getPage()) {
        datamng.togglePage();
        if (page==="card") {
            bg_btn.classList.add("switch");
            card_btn.classList.add("activate");
            prop_btn.classList.remove("activate");
            prop_form.classList.remove("activate");
            card_mng.classList.add("activate");
        } else {
            bg_btn.classList.remove("switch");
            prop_btn.classList.add("activate");
            card_btn.classList.remove("activate");
            card_mng.classList.remove("activate");
            prop_form.classList.add("activate");
        }
    }
}

// suggest

class Suggest {
    sug_close = document.getElementById("sug-close");
    sug_window = document.getElementById("suggest");

    sug_own = document.getElementById("sug-own");
    sug_dict = document.getElementById("sug-dict");
    sug_other = document.getElementById("sug-other");

    sug_nav_own = document.getElementById("sug-nav-own");
    sug_nav_dict = document.getElementById("sug-nav-dict");
    sug_nav_other = document.getElementById("sug-nav-other");
    sug_nav_bg = document.getElementById("sug-nav-bg");

    constructor() {
        this.sug_close.addEventListener("click", (e)=>{
            this.sug_window.style.display = "none";
            this.clearList();
        });

        this.sug_nav_own.addEventListener("click", (e)=>{
            this.sug_own.parentElement.style.display = "table";
            this.sug_dict.parentElement.style.display = "none";
            this.sug_other.parentElement.style.display = "none";
            this.sug_nav_bg.style.left = "0";
            this.sug_nav_own.classList.add("activate");
            this.sug_nav_dict.classList.remove("activate");
            this.sug_nav_other.classList.remove("activate");
        });

        this.sug_nav_dict.addEventListener("click", (e)=>{
            this.sug_own.parentElement.style.display = "none";
            this.sug_dict.parentElement.style.display = "table";
            this.sug_other.parentElement.style.display = "none";
            this.sug_nav_bg.style.left = "33.33%";
            this.sug_nav_own.classList.remove("activate");
            this.sug_nav_dict.classList.add("activate");
            this.sug_nav_other.classList.remove("activate");
        });

        this.sug_nav_other.addEventListener("click", (e)=>{
            this.sug_own.parentElement.style.display = "none";
            this.sug_dict.parentElement.style.display = "none";
            this.sug_other.parentElement.style.display = "table";
            this.sug_nav_bg.style.left = "66.66%";
            this.sug_nav_own.classList.remove("activate");
            this.sug_nav_dict.classList.remove("activate");
            this.sug_nav_other.classList.add("activate");
        });
    }

    clearList() {
        document.getElementById("sug-own").replaceChildren([]);
        document.getElementById("sug-dict").replaceChildren([]);
        document.getElementById("sug-other").replaceChildren([]);
    }

    onSuggest(element_btn, word) {
        const element = element_btn.parentElement;
        const sug_own = document.getElementById("sug-own");
        const sug_other = document.getElementById("sug-other");
        const sug_dict = document.getElementById("sug-dict");
        const sug_window = document.getElementById("suggest");
        load.toggle();
        function changeBTN() {
            element_btn.innerHTML = `<div class="icon-img" style="background-image: url(${datamng.edit_icon});"></div>`;
            element_btn.setAttribute("onclick", "datamng.onEditInput(this);");
        }

        const clear_list = this.clearList;

        function checkRefRepeat(id_) {
            for (const input_data of datamng.getInputTag()) {
                if (input_data.element.children[2].value==="t" && input_data.element.children[4].value==="t" && parseInt(input_data.element.children[5].value)===id_) {
                    return false;
                }
            }
            return true;
        }

        async function getSuggest() {    
            const response = await fetch(`/api/suggest?search=${word}`);
            const result = await response.json();

            result.data.owner.forEach(val=>{
                const tr = document.createElement("tr");
                tr.innerHTML = `<th>${val.question}</th><th>${val.answer}</th>`;
                tr.addEventListener("click", (e)=>{
                    if (checkRefRepeat(val.id)) {
                        element.children[0].value = val.question;
                        element.children[0].disabled = true;
                        element.children[1].value = val.answer;
                        element.children[1].disabled = true;
                        element.children[2].value = 't';
                        element.children[3].value = 't';
                        element.children[4].value = 'f';
                        element.children[5].value = val.id;
                        sug_window.style.display = "none";
                        changeBTN();
                        clear_list();
                    } else {
                        confirm_.open(
                            "Repeat Alert!!",
                            "There're some repeat suggestion. The system'll not add this card to the deck. Please create new card or edit that suggest card."
                        );
                    }
                });
                sug_own.append(tr);
            });

            result.data.dict.forEach(val=>{
                const tr_ = document.createElement("tr");
                tr_.innerHTML += `<th>${val.question}</th><th>${val.answer}</th>`
                tr_.addEventListener("click", (e)=>{
                    if (checkRefRepeat(val.id)) {
                        element.children[0].value = val.question;
                        element.children[0].disabled = true;
                        element.children[1].value = val.answer;
                        element.children[1].disabled = true;
                        element.children[2].value = 't';
                        element.children[3].value = 'f';
                        element.children[4].value = 'f';
                        element.children[5].value = val.id;
                        sug_window.style.display = "none";
                        changeBTN();
                        clear_list();
                    } else {
                        confirm_.open(
                            "Repeat Alert!!",
                            "There're some repeat suggestion. The system'll not add this card to the deck. Please create new card or edit that suggest card."
                        );
                    }
                });
                sug_dict.append(tr_);
            });

            result.data.other.forEach(val=>{
                const tr = document.createElement("tr");
                tr.innerHTML = `<th>${val.question}</th><th>${val.answer}</th>`;
                tr.addEventListener("click", (e)=>{
                    if (checkRefRepeat(val.id)) {
                        element.children[0].value = val.question;
                        element.children[0].disabled = true;
                        element.children[1].value = val.answer;
                        element.children[1].disabled = true;
                        element.children[2].value = 't';
                        element.children[3].value = 'f';
                        element.children[4].value = 'f';
                        element.children[5].value = val.id;
                        sug_window.style.display = "none";
                        changeBTN();
                        clear_list();
                    } else {
                        confirm_.open(
                            "Repeat Alert!!",
                            "There're some repeat suggestion. The system'll not add this card to the deck. Please create new card or edit that suggest card."
                        );
                    }
                });
                sug_other.append(tr);
            });

            load.toggle();
        }

        this.sug_window.style.display = "flex";
        try {
            getSuggest();
        } catch (error) {
            load.toggle();
            confirm_.open("Currently Unable to Provide Suggestions", "We apologize for the inconvenience caused by a system error. Kindly try your request again later. Thank you for your understanding.")
        }
    }

}

const suggest = new Suggest()


function onSuggestClick(element) {
    console.log(element.parentElement.children[0].value);
    if (element.parentElement.children[0].value) {
        suggest.onSuggest(element, element.parentElement.children[0].value);
    } else {
        confirm_.open("Input your question.", "Please input your question before using suggestion. System will find that question for you.");
    }
}

const search_btn = document.getElementById("search-btn");
const search_form = document.getElementById("search");
const search_input = document.getElementById("search-input");

search_btn.addEventListener("click", (e)=>{
    datamng.searchInput(search_input.value);
});

search_form.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    datamng.searchInput(e.target.search_input.value);
});

// save
// on submit
function onSave() {
    confirm_.open(
        "Are you sure to create?",
        "Please, recheck your deck's infomation. you can return to edit this deck soon. the same cards won't save to the database.",
        saving
    );
}

function saving() {
    load.toggle();
    const form_data = {};

    form_data["id"] = datamng.getDeckID();
    form_data["title"] = document.getElementById("title").value;
    form_data["is_public"] = document.getElementById("status").value==="public";
    form_data["tags"] = datamng.getTags().map(val=>{return {dbid: val.dbid, tag: val.tag};});
    form_data["cards"] = [];
    form_data["deleted"] = datamng.getDeleteID();

    for (const input_tag of datamng.getInputTag()) {
        const element = input_tag.element;
        const val = {
            is_recom: element.children[2].value==="t",
            own_recom: element.children[3].value==="t",
            edit_origin: element.children[4].value==="t",
            ref: parseInt(element.children[5].value),
            question: element.children[0].value,
            answer: element.children[1].value,
            is_edited: element.getAttribute("is_edited"),
            old_id: parseInt(element.getAttribute("old_id"))
        }
        if (val.question && val.answer) {
            if (val.is_edited!=="f") {
                form_data["cards"].push(val);    
            }
        } else {
            confirm_.open("An issue has arisen with certain cards!!", "Our system has detected that some of your cards are missing certain values.")
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            load.toggle();
            return;
        }
    }

    async function sendData() {
        try {
            const response = await fetch("/api/deck", {
                method: "PATCH",
                body: JSON.stringify(form_data),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {}
        load.toggle();
        window.location.href = "/";
    }

    sendData();
}

function onCancel() {
    confirm_.open(
        "Do you want to exit without saving?",
        "You haven't saved this deck yet. if you want to discard this deck, choose 'confirm' for back to 'home page'.",
        ()=>{window.location.href="/";}
    );
}