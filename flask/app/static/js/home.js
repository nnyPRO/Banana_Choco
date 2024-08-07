// write by Rachata 650510638

class Deck {
    constructor() {
        /* deck_lst schema:
        [
            {
                player_id: 1,
                id: 1, 
                name: "animal",
                is_public: true,
                is_deleted: false,
                deleted_at: datetime(2024, 2, 12)
                element: <div>
            }, 
            {}, {}, ...
        ]
        */
        this.deck_lst = [];
        try {
            this.getDeck();
        } catch(error) {
            load.toggle();
        }
    }
    // Rachata create function for generate deck from database 
    async getDeck() {
        load.toggle();
        const respond = await fetch("/api/deck");
        const data = await respond.json();
        // console.log(data);
        const deckContainner = document.getElementsByClassName('deck-bg');
        deckContainner[0].innerHTML = ``
        let tagHtml
        data["data"].forEach(element => {
            // console.log(element);
            /*
            { avatar_url: "https://ui-avatars.com/api/?name=d+i&background=f6d394&color=725c3a",
             create_at: "2024-02-29 21:11:33", delete_at: null,
            id: 3, is_deleted: false, is_public: false, len_card: 1, 
            name: "ta", player_id: 3, username: "Didi" }
            */
            tagHtml = `` 
            for (let i=0; i<element.tag.length; i++) {
                if (i==2) {break;}
                tagHtml += `<span class="tag">#${limitStr(element.tag[i].name, 6)}</span><nobr></nobr>`;
            }

            const str = `
            <div class="box">
                <div class="deck-popup" onclick="popup('${limitStr(element.name, 15)}', ${element.id}, ${element.len_card})"></div>
                <div class="profile">
                    <img class="profile-icon" src="${element.avatar_url}" alt="">
                    <span class="people">${limitStr(element.username, 8)}</span>
                </div>
                <div class="description">
                    <h4 id="nameD" class="deckName">${limitStr(element.name, 10)}</h4>
                    <span class="cardNum"><h5>${element.len_card} Cards</h5></span>
                    <div class='deck-tag'>${tagHtml}</div>
                </div>
                <div class="window-size">
                    <button onclick="onChange('/edit/${element.id}');" type="button">
                        <div class='icon-img edit'></div>
                    </button>
                    <button onclick="onChange('/play/${element.id}', ${element.len_card});" type="button">
                        <div class='icon-img play'></div>
                    </button>
                    <button onclick="handler.onDelete(${element.id})" type="button">
                        <div class='icon-img delete'></div>
                    </button>
                </div>
                
            </div>`
            const card = createElementFromString(str);
            deckContainner[0].append(card);
            this.deck_lst.push({ name: element.name, tag: element.tag.map(val=>val.name), element: card});
        });
        
        load.toggle();
    }

    // delete deck
    onDelete(id) {
        
        async function del() {
            load.toggle();
            try {
                await fetch(`api/deck?id=${id}`, {
                    method: "DELETE",
                    
                });
                load.toggle();
                // append(); 
                window.location.reload(); 
                onClose();
            } catch {
                load.toggle();
            }

        } 
        confirm_.open("Warning", "Are you sure to delete?", () => {
            del();
        })
    }
    
    onSearch(word) {
        if (word.length===0) {
            this.deck_lst.forEach(val=>{
                val.element.style.display = "flex";
            });  
        }
        const insen_word = word.toLocaleLowerCase();
        this.deck_lst.forEach(val=>{
            if (val.name.includes(insen_word)) {
                val.element.style.display = "flex";
            } else {
                let have = false;
                for (const tag of val.tag) {
                    if (tag.includes(insen_word)) {
                        val.element.style.display = "flex";
                        have = true;
                        break;
                    }
                }
                if (!have) {
                    val.element.style.display = "none";
                }
            }
        });
    }

}
const handler = new Deck();

// redirect function
function onChange(redirectUrl, len_card=0)
{
    // const redirectUrl = '/create_deck';
    if (redirectUrl.split("/")[1]==="play") {
        if (len_card==0) {
            confirm_.open("Empty Deck!!", "We have observed that this deck currently contains no cards. Kindly ensure to include your desired cards on the edit page.")
        } else {
            window.location.href = redirectUrl;
        }
    } else {
        window.location.href = redirectUrl;
    }
}

//  popup option deck
function popup(deckName, deck_id, len_card=0) {
    if (deckName == '') {
        $('.header > h1').html('Unknow');
    } else {
        $('.header > h1').html(limitStr(deckName, 10, 300000));
    }
    
    $("#play-btn").attr("onclick", `onChange('/play/${deck_id}', ${len_card});`);
    $("#edit-btn").attr("onclick", `onChange('/edit/${deck_id}');`);
    $("#delete-btn").attr("onclick", `handler.onDelete(${deck_id});`);
    $('#deck-menu').css("display", "flex");
}

// close popup option deck
function onClose() {
    $('#deck-menu').css("display", "none");
}

// edit home html to this >>
// 
function addDataDecks(decks){
    let tagHtml = ``;
    $(".deck-bg").html('');
    let deck = ``;
    for (let i of decks) {
        for (let j of i.tag) {
            tagHtml += `<span class="tag">#${limitStr(j.name, 6)}</span><nobr></nobr>`;
        }
        deck = `
        <div class="box">
            <div class="deck-popup"></div>
            <div class="profile">
                <img class="profile-icon" src="${i.avatar_url}" alt="">
                <span class="people">${limitStr(i.username, 15)}</span>
            </div>
            <div class="description">
            <h4 id="nameD" class="deckName">${limitStr(i.name, 10)}</h4>
            <span class="cardNum"><h5>${i.len_card} Cards</h5></span>
            <div class='deck-tag'>${tagHtml}</div>
            </div>
            <div class="window-size">
                <button onclick="onChange('/edit/${i.id}');" type="button">
                    <div class='icon-img edit'></div>
                </button>
                <button onclick="onChange('/play/${i.id}');" type="button">
                    <div class='icon-img play'></div>
                </button>
                <button onclick="handler.onDelete(${i.id})" type="button">
                    <div class='icon-img delete'></div>
                </button>
            </div>
        </div>`;
        $(".deck-bg").html($(".deck-bg").html()+deck);
    }
}

// search deck
async function searchInput(word) {
    
    if (word.length!==0) {
        // const respond = await fetch("/api/deck");
        // const raw_data = await respond.json();
        // const decks = raw_data['data'];
        // /* decks schema:
        //     {
        //         'id' : 3, 'name' : 'deckname', 'len_card' : 1, 'tag' : [{ delete_at: null, id: 1, is_deleted: false, name: "CS"}],
        //         'player_id': 3, 'username': 'รชต ธนัญชัย', 'avatar_url': 'https://lh3.googleusercontent.com/a/ACg8ocLU8_khO9j6dlSlrg7TyFRA3O1ECRnBxyXliCkNm4Lmbas=s96-c',
        //         'create_at': '2024-03-02 19:19:26', delete_at : None, 'is_deleted' : False,
        //         'is_public' : False
        //     }
        // */
        // word = word.toLowerCase();
        // let search = [];
        // let deckName, deckTag
        // $.each(decks, (index, ele) =>{
        //     deckName = ele.name.toLowerCase();
        //     deckTag = ele.tag;
        //     if (deckName.includes(word)) {
        //         search.push(ele);
        //     } else {
        //         for (let i of deckTag) {
        //             if (i.name.toLowerCase().includes(word)) {
        //                 search.push(ele);
        //             }
        //         }
        //     }
        // })
        addDataDecks(search)
    } else {
        handler.getDeck();
    }
    
}

const search_icon = document.getElementById("search-btn");
const search_form = document.getElementById("search-form");
const search_input = document.getElementById("search-input");

search_icon.addEventListener("click", (e)=>{
    handler.onSearch(search_input.value);
});

search_form.addEventListener("submit", (e)=>{
    e.preventDefault();
    handler.onSearch(search_input.value); // Use search_input.value to access the input value
});