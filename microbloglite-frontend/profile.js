"use strict";
const cardsListDiv = document.getElementById("cardsListDiv");
const username = document.getElementById("username");
const fullName = document.getElementById("fullName");
const abouts = document.getElementById("abouts"); 


async function populateUserProfile() {
  const loginData = getLoginData();
  try {
    let response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${loginData.username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user profile data");

    let userData = await response.json();
    document.getElementById("username").innerText = userData.username;
    document.getElementById("fullName").innerText = userData.fullName || "Anonymous";
    document.getElementById("abouts").innerText = userData.bio || "This user hasn't added a bio yet.";
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}

// Run this on page load
document.addEventListener("DOMContentLoaded", populateUserProfile);





async function createAPost() {
  const loginData = getLoginData();
  let newPost = {
    text: document.getElementById("tweetInput").value.trim(),
  };
  try {
    let promise = fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?limit=100&offset=0", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
      body: JSON.stringify(newPost),
    });
    let response = await promise;
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error;
  }
}

async function getAllUsers() {
  const loginData = getLoginData();
  try {
    let promise = fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
    });
    let response = await promise;
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error;
  }
}

getAllUsers();

async function getAllUserPosts() {
  const loginData = getLoginData();
  try {
    let promise = fetch(
      `http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?username=${loginData.username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
      }
    );
    let response = await promise;
    let data = await response.json();
    console.log(data);

    makeCards(data);
  } catch (error) {
    console.error(error);
  }
}
getAllUserPosts();

function makeCards(posts) {
  posts.forEach((post) => {
    let card = makeCard(post);

    cardsListDiv.appendChild(card);
  });
}

function makeCard(post) {
  // Create the card container
  const card = document.createElement("div");
  card.className = "card";

  // Inner container with padding
  const px3 = document.createElement("div");
  px3.className = "px-3 pt-4 pb-2";

  // Header section
  const header = document.createElement("div");
  header.className = "d-flex align-items-center justify-content-between";

  // User info
  const userInfo = document.createElement("div");
  userInfo.className = "d-flex align-items-center";

  // Avatar (Using DiceBear for dynamic avatar based on username)
  const avatar = document.createElement("img");
  avatar.style.width = "50px";
  avatar.className = "me-2 avatar-sm rounded-circle";
  avatar.src = `https://api.dicebear.com/9.x/glass/svg?seed=${post.username}`;
  avatar.alt = `${post.username} Avatar`;

  // const username = document.getElementById("username");
  //  username.innerText = post.username;

  // const fullName = document.getElementById("fullName");
  //  fullName.innerText = post.fullName;

  // const abouts = document.getElementById("abouts");
  //  abouts.innerText = post.bio;

  // User name
  const userNameContainer = document.createElement("div");
  const userName = document.createElement("h5");
  userName.className = "card-title mb-0";
  const userNameLink = document.createElement("a");
  userNameLink.href = "#";
  userNameLink.textContent = post.username;
  userName.appendChild(userNameLink);
  userNameContainer.appendChild(userName);

  // Append user info
  userInfo.appendChild(avatar);
  userInfo.appendChild(userNameContainer);
  header.appendChild(userInfo);
  px3.appendChild(header);
  card.appendChild(px3);

  // Body section
  const cardBody = document.createElement("div");
  cardBody.id = "postCardBody";
  cardBody.className = "card-body";

  // Post text
  const paragraphText = document.createElement("p");
  paragraphText.id = "paragraphText";
  paragraphText.className = "fs-6 fw-light text-muted";
  paragraphText.textContent = post.text;
  cardBody.appendChild(paragraphText);

  // Footer actions
  const actions = document.createElement("div");
  actions.className = "d-flex justify-content-between";

  // Likes
  const likesContainer = document.createElement("div");
  const likeLink = document.createElement("a");
  likeLink.href = "#";
  likeLink.className = "fw-light nav-link fs-6";
  likeLink.innerHTML = `<span class="fas fa-heart me-1"></span> ${post.likes.length}`;
  likesContainer.appendChild(likeLink);

  // Date
  const dateContainer = document.createElement("div");
  const dateText = document.createElement("span");
  dateText.className = "fs-6 fw-light text-muted";
  const formattedDate = new Date(post.createdAt).toLocaleDateString();
  dateText.innerHTML = `<span class="fas fa-clock"></span> ${formattedDate}`;
  dateContainer.appendChild(dateText);

  actions.appendChild(likesContainer);
  actions.appendChild(dateContainer);
  cardBody.appendChild(actions);

  // Comment input
  const commentSection = document.createElement("div");
  const textAreaContainer = document.createElement("div");
  textAreaContainer.className = "mb-3";
  const textArea = document.createElement("textarea");
  textArea.className = "fs-6 form-control";
  textArea.rows = 1;
  textArea.placeholder = "Add a comment...";
  textAreaContainer.appendChild(textArea);
  commentSection.appendChild(textAreaContainer);

  const commentButton = document.createElement("button");
  commentButton.className = "btn btn-primary btn-sm";
  commentButton.textContent = "Post Comment";
  commentSection.appendChild(commentButton);
  cardBody.appendChild(commentSection);

  // username.innerText = post.username;
  // fullName.innerText = post.fullName
  // abouts.innerText = post.bio

  let deleteButton = document.createElement("button");
  deleteButton.innerText = `Delete`;
  deleteButton.className = "btn btn-dark rounded-5";

  deleteButton.addEventListener("click", async () => {
    if (post._id) {
      const loginData = getLoginData();
      try {
        let promise = fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts/${post._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
          },
        });

        let response = await promise;
        let data = await response.json();

        if (response.ok) {
          console.log("Success");
          location.reload();
        }
        console.log(data);
      } catch (error) {
        console.error;
      }
    }
  });

  cardBody.appendChild(deleteButton);

  // Append body to card
  card.appendChild(cardBody);

  // Append card to the body of the document (or return it to be appended elsewhere)
  return card;
}
