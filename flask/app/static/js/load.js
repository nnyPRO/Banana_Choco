class Loader {
    load_window = document.getElementById("window-loader");

    toggle() {
        if (this.load_window.style.display==="flex") {
            this.load_window.style.display="none";
        } else {
            this.load_window.style.display="flex";
        }
    }
}

const load = new Loader();

function limitStr(str, len, maxWidth=610) {
    return String(str).length > len && window.innerWidth<maxWidth ? String(str).substr(0, len)+"..."  : String(str)
}

function createElementFromString(str) {
    const div = document.createElement("div");
    div.innerHTML = str.trim();
    return div.firstChild;
}

// load.toggle();