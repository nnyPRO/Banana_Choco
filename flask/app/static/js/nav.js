const hidden_nav = document.getElementById("hidden-nav");
const ham_bar = document.getElementById("ham-nav");
const block_bg = document.getElementById("block-nav");

ham_bar.addEventListener("click", (e)=>{
    if (hidden_nav.classList.contains("activate")) {
        hidden_nav.classList.remove("activate");
        block_bg.classList.remove("activate");
    } else {
        hidden_nav.classList.add("activate");
        block_bg.classList.add("activate");
    }
});


block_bg.addEventListener("click", (e)=>{
    if (hidden_nav.classList.contains("activate")) {
        hidden_nav.classList.remove("activate");
        block_bg.classList.remove("activate");
    }
});