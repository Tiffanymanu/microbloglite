"use strict";

async function createUser() {
  let signUpData = {
    username: document.getElementById("username").value.trim(),
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("numberOrEmail").value.trim(),
    password: document.getElementById("password").value.trim(),
    // passwordReEntry: document.getElementById("passwordReEntry").value.trim(),
  };
  try {
    let promise = fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", {
      method: "POST",
      headers: {
        "content-type": "application/JSON",
      },
      body: JSON.stringify(signUpData),
    }); //asking another computer for the data

    let response = await promise; //wait for the response message to come back from the server with the data in the body
    let data = await response.json(); //turn JSON string in the body into a JavaScript array of objects
    console.log(data);
  } catch (error) {
    console.error("Error Message", error.message);
  }
}
