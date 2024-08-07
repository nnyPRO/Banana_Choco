// Switch Login And Sign Up

function createInputElement(id, label, type, placeh) {
    const label_t = document.createElement("label");
    label_t.appendChild(document.createTextNode(label));
    label_t.appendChild(document.createElement("br"));
    label_t.setAttribute("for", id);
    label_t.setAttribute("id", id);
    const input_t = document.createElement("input");
    input_t.name = id;
    input_t.type = type;
    input_t.placeholder = placeh;
    label_t.appendChild(input_t);
    return label_t
}

const change_type_button = document.getElementById("change_type");
const change_type_moblie = document.getElementById("change_type_mobile")

function onClickChange(e) {
    const current_type = document.getElementById("login-form");
    const title = document.getElementById("title");
    const submit_btn = document.getElementById("submit-btn");
    const account_status = document.getElementById("account-status");
    const sub_title = document.getElementById("subtitle");
    const google_btn = document.getElementById("google-login-btn");
    const facebook_btn = document.getElementById("fb-login-btn");
    if (current_type[0].value==="login") {
        current_type[0].value="register";
        document.getElementById("email").insertAdjacentElement("beforebegin", createInputElement("username", "Username", "text", "Username..."));
        document.getElementById("password").insertAdjacentElement("afterend", createInputElement("c_password", "Confirm Password", "password", "Confirm Password..."));
        title.innerHTML = "Register";
        submit_btn.innerHTML = "Register";
        change_type_button.firstChild.innerHTML = "Sign In";
        account_status.firstChild.replaceWith(document.createTextNode("Already have accounts? "));
        sub_title.innerHTML = "Please Register to continue"
        google_btn.lastChild.replaceWith(document.createTextNode("Register with Google"));
        facebook_btn.lastChild.replaceWith(document.createTextNode("Register with Facebook"));
    } else {
        current_type[0].value="login";
        try {document.getElementById("username").remove();} catch (error) {}
        try {document.getElementById("c_password").remove();} catch (error) {}
        title.innerHTML = "Login";
        submit_btn.innerHTML = "Login"
        change_type_button.firstChild.innerHTML = "Sign Up";
        account_status.firstChild.replaceWith(document.createTextNode("Don't have an account? "));
        sub_title.innerHTML = "Please Login to continue";
        google_btn.lastChild.replaceWith(document.createTextNode("Login with Google"));
        facebook_btn.lastChild.replaceWith(document.createTextNode("Login with Facebook"));
    }
    clearErr();
}

change_type_button.addEventListener("click", onClickChange);
change_type_moblie.addEventListener("click", onClickChange);

// on submit form

const login_f = document.getElementById("login-form");
login_f.addEventListener("submit", (e)=>{
    e.preventDefault();
    if (e.target.type.value==="login") {
        const form_object = {
            email: e.target.email.value,
            password: e.target.password.value
        };
        clearErr();
        const form_checked = formValidateLogin(form_object);
        if (form_checked[0]) {
            // not pass
            errHandle(form_checked[1]);
        } else {
            // pass
            onLogin(form_object);
        }
    } else {
        const form_object = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            c_password: e.target.c_password.value
        }
        clearErr();
        const form_checked = formValidateRegister(form_object);
        if (form_checked[0]) {
            // not pass
            errHandle(form_checked[1]);
        } else {
            onRegister(form_object);
        }
    }
});


// Log In //

// function send login
async function onLogin(body) {
    const res = await fetch("/api/login", { method: "POST", body: JSON.stringify(body), headers: {"Content-Type": "application/json"} });
    if (res.status===400) {
        const result = await res.json();
        let err_message = {}
        result.err.forEach(err_code=>{
            if (err_code==="EMAIL_NFOUND") {
                err_message["email"] = "Not found this email."
            } else if (err_code==="PASS_WRONG") {
                err_message["password"] = "Password's not correct."
            }
        });
        errHandle(err_message);
    } else if (res.status===200) {
        window.location.reload()
    }
}

// function for validate login form
function formValidateLogin(data) {
    let have_err = false;
    let err_message = {};
    
    // email check
    if (!data.email || data.email.split("@").length!==2 || !data.email.split("@")[1].includes(".") || data.email[data.email.length-1]==".") {
        have_err = true;
        err_message["email"] = "email's invalid.";
    }
    // password check
    if (!data.password || data.password.length < 8 || data.password.length > 20) {
        have_err = true;
        err_message["password"] = "password must be in range 8-20 charactors.";
    }

    return [have_err, err_message];
}

// Register //

// function send register
async function onRegister(body) {
    const res = await fetch("/api/register", {method: "POST", body: JSON.stringify(body), headers: {"Content-Type": "application/json"}});
    
    if (res.status===200) {
        window.location.reload();
    } else if (res.status===400) {
        const result = await res.json();
        const err = result.err;
        let err_message = {}
        err.forEach(err_code=>{
            if (err_code==="EMAIL_INVALID") {
                err_message["email"] = "email's invalid.";
            } else if (err_code==="EMAIL_ALREADY") {
                err_message["email"] = "this email's already used.";
            } else if (err_code==="PASS_LEN") {
                err_message["password"] = "password must be in range 8-20 charactors.";
            } else if (err_code==="PASS_NEQUAL") {
                err_message["c_password"] = "confirm password must match with password.";
            } else if (err_code==="NAME_LEN") {
                err_message["username"] = "username must be in range 8-20 charactors.";
            }
        });
        errHandle(err_message);
    }
}

// function for validate register form
function formValidateRegister(data) {
    let have_err = false;
    let err_message = {};

    if (!data.username || data.username.length < 8 || data.username.length > 20) {
        have_err = true;
        err_message["username"] = "username must be in range 8-20 charactors.";
    }
    
    // email check
    if (!data.email || data.email.split("@").length!==2 || !data.email.split("@")[1].includes(".") || data.email[data.email.length-1]==".") {
        have_err = true;
        err_message["email"] = "email's invalid.";
    }
    // password check
    if (!data.password || data.password.length < 8 || data.password.length > 20) {
        have_err = true;
        err_message["password"] = "password must be in range 8-20 charactors.";
    }

    if (!data.password || !data.c_password || data.password!=data.c_password) {
        have_err = true;
        err_message["c_password"] = "confirm password must match with password.";
    }

    return [have_err, err_message];
}

// Lib //

// function for err show
function errHandle(data) {
    for (const key in data) {
        const element = document.getElementById(key);

        // console.log(element.children);
        const input = element.children[1];
        const err_message = document.createElement("p");
        err_message.classList.add("err_text");
        err_message.innerHTML = data[key];
        input.classList.add("err");
        element.appendChild(err_message);
    }
}

// function for clear err
function clearErr() {
    const err_text_tags = document.getElementsByClassName("err_text");
    for (const err_text_tag of err_text_tags) {
        err_text_tag.parentNode.removeChild(err_text_tag);
    }

    const err_ps = document.getElementsByClassName("err");
    for (const err_p of err_ps) {
        err_p.classList.remove("err");
    }
    
}

login_f.reset();
