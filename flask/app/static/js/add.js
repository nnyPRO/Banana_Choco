// Switch Page

const tag_field = document.getElementById("tag-field");

class MyData {

    constructor() {
        this.currentPage = "prop";
        this.tags = []; // { id: number, tag: string, dbid: number # 0 is to insert, element: Node } 
        this.db_tags = [];
        this.getDBtagFromServer();
        this.input_tag = []; // { order_id: number, element: element }
    }

    async getDBtagFromServer() {
        const response = await fetch("/api/tag", {method: "GET"});
        const result = await response.json();
        this.db_tags = result.data.map(val=>{return {id: val.id, name: val.name};});
    }

    getDBtag() {
        return this.db_tags;
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
        tag_field.append(tag_tag);
        this.tags.push({ id, tag: name, dbid, element: tag_tag });
    }

    addInputTag(order_id, node) {
        this.input_tag.push({ order_id, element: node });
    }

    getInputTag() {
        return this.input_tag;
    }

    removeInputTag(order_id) {
        this.input_tag = this.input_tag.filter((val)=>{
            if (order_id===val.order_id) {
                val.element.remove();
                return false;
            }
            return true;
        });
    }

    searchInput(word) {
        tag_field.ch
        if (word.length!==0) {
            word = word.toLowerCase();
            const word_len = word.length;
            this.input_tag.forEach(val=>{
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
        this.input_tag.forEach(val=>{
            val.element.style.display = "grid";
        });
    }

}

const my_state = new MyData();

const prop_btn = document.getElementById("prop-btn");
const card_btn = document.getElementById("card-btn");
const bg_btn = document.getElementById("bg-btn");
const prop_form = document.getElementById("prop-form");
const card_mng = document.getElementById("card-mng");

function onChangePage(page) {
    if (page!==my_state.getPage()) {
        my_state.togglePage();
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

// toggle status

const status_toggle = document.getElementById("status-toggle");
const status_input = document.getElementById("status");

function onStatusToggle() {
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

// Add
const form_add = document.getElementById("card-form");

function createElementFromStr(string) {
    const div = document.createElement("div");
    div.innerHTML = string.trim();
    return div.firstChild;
}

function onAdd() {
    let number_input = 0;
    onChangePage("card");
    if (form_add.lastElementChild) {
        const last_number = parseInt(form_add.lastElementChild.getAttribute("order_"));
        if (!isNaN(last_number)) {
            number_input = last_number+1;
        }
    }
    const tag = `<div class="card-form-grp" order_="${number_input}">
        <input style="grid-area: in1;" id="question${number_input}" name="question${number_input}" type="text" placeholder="Question...">
        <input style="grid-area: in2;" id="answer${number_input}" name="answer${number_input}" type="text" placeholder="Answer...">
        <input type="text" name="is_recom${number_input}" value="f" hidden>
        <input type="text" name="own_recom${number_input}" value="f" hidden>
        <input type="text" name="edit_origin${number_input}" value="t" hidden>
        <input type="text" name="ref${number_input}" value="0" hidden>
        <button style="grid-area: btn1;" type="button" onclick="onSuggestClick(this);"><div class="icon-img" style="background-image: url(/static/image/suggestion-icon.png);"></div></button>
        <button style="grid-area: btn2;" type="button" onclick="onRemoveClick(this);"><div class="icon-img" style="background-image: url(/static/image/recycle-bin.png);"></div></button>
    </div>`
    const node = createElementFromStr(tag);
    my_state.addInputTag(number_input, node);
    form_add.append(node);
    form_add.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' })
}


function onRemoveClick(element) {
    const parent = element.parentElement;
    const order_id = parseInt(parent.getAttribute("order_"));
    my_state.removeInputTag(order_id);
}

function onSuggestClick(element) {
    // console.log(element.parentElement.children[0].value);
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
    my_state.searchInput(search_input.value);
});

search_form.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    my_state.searchInput(e.target.search_input.value);
});

// tag inclease

const tag_input = document.getElementById("tag-insert");
const rec_tab = document.getElementById("tag-recm");

function onSearchTag(word) {
    const word_length = word.length;
    const db_tags = my_state.getDBtag();
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
                my_state.addTag(element.name, element.id);
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
    my_state.addTag(tag_input.value, 0);
    rec_tab.replaceChildren();
    tag_input.value = "";
});

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
            element_btn.innerHTML = "<div class=\"icon-img\" style=\"background-image: url(/static/image/edit.png);\"></div>";
            element_btn.setAttribute("onclick", "onEdit(this);");
        }

        const clear_list = this.clearList;

        function checkRefRepeat(id_) {
            for (const input_data of my_state.getInputTag()) {
                if (input_data.element.children[2].value==="t" && parseInt(input_data.element.children[5].value)===id_) {
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
                    console.log("Out")
                    if (checkRefRepeat(val.id)) {
                        console.log("Out")
                        element.children[0].value = val.question;
                        element.children[0].disabled = true;
                        element.children[1].value = val.answer;
                        element.children[1].disabled = true;
                        element.children[2].value = 't';
                        element.children[3].value = 't';
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

class EditCheck {
    change_btn = document.getElementById("edit-own-change");
    nchange_btn = document.getElementById("edit-own-nchange");
    close_btn = document.getElementById("edit-own-cancel");

    edit_window = document.getElementById("edit-own");

    constructor() {
        this.close_btn.addEventListener("click", (e)=>{
            this.edit_window.style.display = "none";
        });
    }

    onActivate(element) {
        const parent = element.parentElement;
        this.edit_window.style.display = "flex";

        function changeBTN() {
            element.innerHTML = "<div class=\"icon-img\" style=\"background-image: url(/static/image/suggestion-icon.png);\"></div>";
            element.setAttribute("onclick", "onSuggestClick(this);");
        }

        this.change_btn.addEventListener("click", (e)=>{
            parent.children[0].disabled = false;
            parent.children[1].disabled = false;
            changeBTN();
            this.edit_window.style.display = "none";
        }, {once: true});

        this.nchange_btn.addEventListener("click", (e)=>{
            parent.children[0].disabled = false;
            parent.children[1].disabled = false;
            parent.children[4].value = "f";
            this.edit_window.style.display = "none";
            changeBTN();
        }, {once: true});
    }
}

function onEdit(element) {
    console.log(element)
    const parent = element.parentElement;
    if (parent.children[2].value==="t" && parent.children[3].value==="t") {
        edit_check.onActivate(element);
    } else if (parent.children[2].value==="t" && parent.children[3].value==="f") {
        parent.children[0].disabled = false;
        parent.children[1].disabled = false;
        parent.children[4].value = "f";
        element.innerHTML = "<div class=\"icon-img\" style=\"background-image: url(/static/image/suggestion-icon.png);\"></div>";
        element.setAttribute("onclick", "onSuggestClick(this);");
    }
}

const suggest = new Suggest()
const edit_check = new EditCheck()


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

    form_data["title"] = document.getElementById("title").value;
    form_data["is_public"] = document.getElementById("status").value==="public";
    form_data["tags"] = my_state.getTags().map(val=>{return {dbid: val.dbid, tag: val.tag};});
    form_data["cards"] = [];
    for (const input_tag of my_state.getInputTag()) {
        const element = input_tag.element;
        const val = {
            is_recom: element.children[2].value==="t",
            own_recom: element.children[3].value==="t",
            edit_origin: element.children[4].value==="t",
            ref: parseInt(element.children[5].value),
            question: element.children[0].value,
            answer: element.children[1].value,
        }
        if (val.question && val.answer) {
            -form_data["cards"].push(val);    
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
                method: "POST",
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

// function cancel
function onCancel() {
    confirm_.open(
        "Do you want to exit without saving?",
        "You haven't saved this deck yet. if you want to discard this deck, choose 'confirm' for back to 'home page'.",
        ()=>{window.location.href="/";}
    );
}
