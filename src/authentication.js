// this is the authentication file, it handles the login and logout, and also the signup

// listen to login button click and then tries to login
document.getElementById("login").addEventListener("click", async () => {
  if (await login()) {
    // if login is successful hides the login menu and shows the main menu
    document.querySelector("body > div.login").style.display = "none";
    document.querySelector("body > div.menu").style.display = "block";
  }
});

// listen to signup button click and tries to make an account
document.getElementById("signup").addEventListener("click", async () => {
  if (await signup()) {
    // if sign up is successful hides the login menu and shows the main menu
    document.querySelector("body > div.login").style.display = "none";
    document.querySelector("body > div.menu").style.display = "block";
  }
});

// listen to logout button and then logs out
document.getElementById("logout").addEventListener("click", () => {
  pb.authStore.clear();
  // disables the main menu and shows the login menu
  document.querySelector("body > div.login").style.display = "block";
  document.querySelector("body > div.menu").style.display = "none";
});

// gets email and password and then makes an account, then authenticate with that account
async function signup() {
  // grabs the email and password from the signup form
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  // checks if the user inputed their email and password
  if (!email || !password) {
    let errorElement = document.getElementById("errorMessage");
    errorElement.innerText = "Email and Password cannot be empty";
    return false;
  }

  // checks if it's a valid email
  if (!validateEmail(email)) {
    let errorElement = document.getElementById("errorMessage");
    errorElement.innerText = "Please input a valid email";
    return false;
  }

  // checks if the password is at least 8 characters long
  if (password.length < 8) {
    let errorElement = document.getElementById("errorMessage");
    errorElement.innerText = "Password must be at least 8 characters long";
    return false;
  }

  try {
    // creates an account with the given email and password
    await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
    });
    return true;
  } catch (error) {
    let errorElement = document.getElementById("errorMessage");

    // handles if the email is already in use or if the email isn't valid or empty
    if (error.data.data.email) {
      errorElement.innerText = "Email is invalid or already in use.";
      return false;
    }

    // handles if the password is too short
    if (error.data.data.password) {
      errorElement.innerText = "Password must be at least 8 characters long";
      return false;
    }

    // general fail message
    errorElement.innerText = "Something went wrong, please try again later.";
    return false;
  }
}

// gets email and password and logs in with those details
async function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  // checks if the user inputed their email and password
  if (!email || !password) {
    let errorElement = document.getElementById("errorMessage");
    errorElement.innerText = "Email and Password cannot be empty";
    return false;
  }

  // checks if it's a valid email
  if (!validateEmail(email)) {
    let errorElement = document.getElementById("errorMessage");
    errorElement.innerText = "Please input a valid email";
    return false;
  }

  try {
    // logs in with the given email and password
    await pb.collection("users").authWithPassword(email, password);
    return true;
  } catch (error) {
    let errorElement = document.getElementById("errorMessage");

    // handles if the email or password is incorrect
    if (error.data.message === "Failed to authenticate.") {
      errorElement.innerText = "Please check your Email or Password.";
      return false;
    }

    // handles if the email or password is empty
    if (error.data.data.password || error.data.data.identity) {
      errorElement.innerText = "Email and Password cannot be empty.";
      return false;
    }

    // general fail message
    errorElement.innerText = "Something went wrong, please try again later.";
    return false;
  }
}

// check if given string is a valid email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
