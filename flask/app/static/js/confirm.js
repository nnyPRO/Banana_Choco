class Confirm {
    confirm_window = document.getElementById("confirm");
    confirm_head = this.confirm_window.firstElementChild.children[0];
    confirm_content = this.confirm_window.firstElementChild.children[1];
    confirm_btn_grp = this.confirm_window.firstElementChild.children[2];

    open(head, content, callback=null) {
        const close_btn = document.createElement("button");
        close_btn.innerHTML = "close";
        close_btn.addEventListener("click", (e)=>{this.close()})
        if (callback) {
            close_btn.innerHTML = "cancel";
            const to_do_btn = document.createElement("button");
            to_do_btn.innerHTML = "confirm";
            to_do_btn.classList.add("highlight");
            to_do_btn.addEventListener("click", (e)=>{callback();this.close();});
            this.confirm_btn_grp.append(to_do_btn);
        }
        this.confirm_head.innerHTML = head;
        this.confirm_content.innerHTML = content;
        this.confirm_btn_grp.append(close_btn);
        this.confirm_window.style.display = "flex";
    }

    close() {
        this.confirm_window.style.display = "none";
        this.confirm_btn_grp.replaceChildren([]);
    }

}

const confirm_ = new Confirm();