const pb = new PocketBase('http://170.64.166.150');

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url;
    if (!url.includes("https://www.asurascans.com/manga/")) {
        // hides the div with class of menu and shows the div with class of unavailable
        document.querySelector("body > div.menu").style.display = "none";
        return document.querySelector("body > div.unavailable").style.display = "flex";
    }

    //if not logged in show login screen
    if (!pb.authStore.isValid) {
        document.querySelector("body > div.login").style.display = "block"
        document.querySelector("body > div.menu").style.display = "none";
    }
});

// listen to login button click and then login
document.getElementById('login').addEventListener('click', async () => {
    await loginOrCreateAccount()
})

// listen to logout and then logout
document.getElementById('logout').addEventListener('click', () => {
    pb.authStore.clear();
    document.querySelector("body > div.login").style.display = "block"
    document.querySelector("body > div.menu").style.display = "none";
})

// gets email and password and login 
async function loginOrCreateAccount() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    // if the account does not exist, create it
    if (!(await validateAccount(email))) {
        if (!(await createAccount(password, email))) return await login(email, password)
    } else {
        // else logs in with email and password
        await login(email, password)
    }

    // show main menu
    document.querySelector("body > div.login").style.display = "none"
    document.querySelector("body > div.menu").style.display = "block";
    return
}

// check if the email exits return true or false
async function validateAccount(email) {
    const resultList = await pb.collection('users').getList(1, 1, {
        filter: `email = "${email}"`,
    });

    if (resultList.items[0]) return true;
    return false;
}

// creates an account using password and email
async function createAccount(password, email) {
    try {
        await pb.collection('users').create({
            email,
            password,
            "passwordConfirm": password,
            "emailVisibility": true,
        });

        return true
    } catch (error) {
        console.log(error.data);
        return false
    }
}

// logs in with password and email
async function login(email, password) {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
    } catch (error) {
        console.log(error.data);

        let errorElement = document.getElementById('errorMessage')
        errorElement.innerHTML = "yes"
    }
}

//wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
