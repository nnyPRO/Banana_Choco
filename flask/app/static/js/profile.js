class Profile {
    image = null;
    btn_up = document.getElementById("btn-upload");
    inp_up = document.getElementById("input-upload");
    icon_up = document.getElementById("icon-upload");
    avatar_circle = document.getElementById("avatar-circle");
    old_avatar = ""
    new_avatar = ""

    constructor() {
        this.old_avatar = this.avatar_circle.style.backgroundImage.slice(5, this.avatar_circle.style.backgroundImage.length-2);
        this.inp_up.addEventListener("change", (e)=>{
            if (e.target.files && e.target.files[0]) {
                this.setImg(e.target.files[0]);
            }
        });
        this.icon_up.addEventListener("change", (e)=>{
            if (e.target.files && e.target.files[0]) {
                this.setImg(e.target.files[0]);
            }
        });
    }

    setImg(image) {
        if (image.size > 52428800) {
            confirm_.open("Input File is over size!!", "Your image must be smaller than 50MB. Please select a different image or ensure that the image you use is below the size limit.")
        }
        this.image = image;
        if (this.new_avatar) {
            URL.revokeObjectURL(this.new_avatar);
        }
        this.new_avatar = URL.createObjectURL(image);
        this.avatar_circle.style.backgroundImage = `url("${this.new_avatar}")`;
        this.inp_up.style.display = "none";
        this.changeToClear();
    }

    changeToClear() {
        this.btn_up.lastChild.replaceWith(document.createTextNode("Undo"));
        this.btn_up.setAttribute("onclick", "profile.clearImg();");
    }

    changeToUpload() {
        this.btn_up.lastChild.replaceWith(document.createTextNode("Upload"));
        this.btn_up.setAttribute("onclick", "");
    }

    clearImg() {
        this.image = null;
        URL.revokeObjectURL(this.new_avatar);
        this.new_avatar = "";
        this.avatar_circle.style.backgroundImage = `url("${this.old_avatar}")`;
        this.inp_up.style.display = "block";
        this.changeToUpload();
    }
}

const profile = new Profile();

function hasNumbers(inputString) {
    var regex = /\d/;
    return regex.test(inputString);
}


const form = document.getElementById("change-form");
const user_tag = document.getElementById("new-username");

function hasErr(code) {
    user_tag.classList.add("err");
    let err = "";
    if (code === "invalid") {
        err = "Username must contain with A-Z, a-z and 0-9.";
    } else {
        err = "Username must have length more than 8 charactors.";
    }
    user_tag.lastElementChild.innerHTML = err;
}

function clearErr() {
    user_tag.classList.remove("err");
    user_tag.lastElementChild.innerHTML = ""
}


form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const new_username = e.target.username.value;
    if (new_username || profile.image) {
        function onProcess() {
            load.toggle();
            clearErr();
            const formData = new FormData();
            if (profile.image) {
                formData.append("img", profile.image);
            }
            let has_err = false;
            if (new_username) {
                if (!isNaN(parseInt(new_username)) || !hasNumbers(new_username)) {
                    has_err = true;
                    hasErr("invalid");
                } else if (new_username.length <= 8) {
                    has_err = true;
                    hasErr("length");
                } else {
                    formData.append("new_username", new_username);
                }
            }
            async function sendData() {
                try {
                    const response = await fetch("/api/profile",
                        {
                            method: "POST",
                            body: formData
                        }
                    );
                    load.toggle();
                    window.location.href = "/";
                } catch (error) {
                    load.toggle();
                    confirm_.open("Something went wrong!!", "Please try again later. The server is experiencing issues.")
                }
            }
            if (has_err) {
                load.toggle();
            } else {
                sendData()
            }
        }
        confirm_.open("Do you want to save these changes?", "If you wish to edit your data, please ensure that your information is correct and confirm the changes.", onProcess);
    } else {
        confirm_.open("You've not changed your infomations yet.", "Your information has not been updated yet. Please upload a new photo or enter a new username to update your information.")
    }
});