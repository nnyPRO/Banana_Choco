//write by Mesanee Laihueang 650510676


$(document).ready(function () {
    function add() {
        load.toggle();
        $.get("api/explore/all/decks", (decks)=>{
            // console.log("decks:", decks[0]["name"])
            $.each(decks, (key, value) =>{
                // console.log(value)    
                addDataDecks(value)
            })
        });
        load.toggle();
    }
    add();
});


function addDataDecks(decks){
    // console.log(decks.avatar_url)
    let tagHtml = '';
    for (let i=0; i<decks.tags.length; i++) {
        if (i==2) {break;}
        tagHtml += `<span class="tag">#${limitStr(decks.tags[i], 6)}</span><nobr></nobr>`;
    }
    const post_block = `<div class="box" onclick="onPreview('${limitStr(decks.name, 10)}', ${decks.num_card}, ${decks.id})";>
    <div class="profile">
        <img class="profile-icon" src="${decks.avatar_url}" alt="">
        <span class="people">${limitStr(decks.player_name ,10)}</span>
    </div>
    <div class="description"><h4 class="deckName">${limitStr(decks.name, 15)}</h4><h5 class="cardNum">${decks.num_card} Cards</h5></div>
    <span class="tags">${tagHtml}</span> 
    </div>`;
    $(".container").html($(".container").html()+post_block);
}



function onPreview(deck_name, num_card, id) {
    async function getCard() {
        load.toggle();
        //clear หน้า preview ส่วน head
        $(".header").html("")
        //clear หน้า preview ส่วน word
        $("#sug-own").html("")
        addPreview(deck_name, num_card);
        try {
            // console.log(result);
            const resp = await fetch(`/api/explore/all/decks/cards?id=${id}`);
            const result = await resp.json();
            result.data.forEach(element => {
                addWordPreview(element.question, element.answer);
            });
            $('#preview').show();
            $('.box').hide();
            $("#copy-btn").attr("onclick", `onCopy(${id});`);
        } catch (error) {}
        load.toggle();
    }
    getCard();
}

function onClose() {
    $('#preview').hide();
    $('.box').show();
}

function addPreview(deck_name, num_card) {
    const head = `<h1>${deck_name.length > 15 ? deck_name.substr(0, 15) : deck_name}<div id="sug-close" class="x" onclick="onClose()"><div></div><div></div></div></h1>
    <h4>${num_card} Cards</h4> `;
    $(".header").html($(".header").html() + head);
}

function addWordPreview(question, answer) {
    const word = `<tr><th>${question}</th><th>${answer}</th></tr>
    <hr>`;
    $("#sug-own").html($("#sug-own").html()+word)
}


function searchInput(word) {
    $.get("api/explore/all/decks", (decks)=>{
        //console.log(decks[0].name)
        $(".container").html("")
        if (word.length!==0) {
            word = word.toLowerCase();
            const word_len = word.length;
            $.each(decks, (key, value) =>{
                
                // value["name"].forEach(name=>{
                const name = value.name.toLowerCase();
                // console.log(name) 
                if (name.length < word_len) {
                    
                } else if (name.slice(0, word_len)!==word) {
                    
                } else {
                    addDataDecks(value)
                }

                $.each(value.tags, (k, v) =>{
                    const tag = v.toLowerCase();
                    if (tag.length < word_len) {
                    
                    } else if (tag.slice(0, word_len)!==word) {
                        
                    } else {
                        addDataDecks(value)
                    }
                });
            })
        } else {
            $.each(decks, (key, value) =>{
                addDataDecks(value);
            })
            
        }
    });
    
}


const search_icon = document.getElementById("search-icon");
const search_form = document.getElementById("formSearch");
const search_input = document.getElementById("search-input");

search_icon.addEventListener("click", (e)=>{
    searchInput(search_input.value);
});

search_form.addEventListener("submit", (e)=>{
    e.preventDefault();
    searchInput(search_input.value); // Use search_input.value to access the input value
});

function onCopy(deck_id) {
    async function copy() {
        load.toggle();
        try {
            const resp = await fetch(`/api/explore/copy?id=${deck_id}`);
            const result = await resp.json();
            window.location.href = `/edit/${result.data}`;
        } catch (error) {}
        load.toggle();
    }

    confirm_.open("Do you want to copy this deck?", "This action will replicate the current deck to become your personal deck. As the owner, you will have editing privileges.", ()=>{
        copy();
    });
}