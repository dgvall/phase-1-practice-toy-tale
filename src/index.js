let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", (e) => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  getToys()
  createToy()
});

  // GET Request (Toys) and Iterate
  function getToys() {
    fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      for (const toy of toys) {
        createCard(toy)
      }
    })
  }

function createCard(toy) {

  let toyObj = {
    "id": toy.id,
    "name": toy.name,
    "image": toy.image,
    "likes": toy.likes
  }
  // create
  let collection = document.getElementById("toy-collection")
  let card = document.createElement("div")
  card.className = "card"

  let header = document.createElement("h2")
  header.textContent = toy.name

  let img = document.createElement("img")
  img.src = toy.image
  img.className = "toy-avatar"

  let p = document.createElement("p")
  p.textContent = `${toy.likes} Likes`

  let btn = document.createElement("button")
  btn.className = "like-btn"
  btn.id = toy.id
  btn.textContent = "Like ❤️"


// Like Event Listener

  btn.addEventListener("click", (e) => {
    updateLikes(e, toyObj)
  })
  
  // append
  collection.appendChild(card)
  card.appendChild(header)
  card.appendChild(img)
  card.appendChild(p)
  card.appendChild(btn)
}

// POST Request and createCard
function postToy(name, imgUrl) {
let newToy = {
  "name": name,
  "image": imgUrl,
  "likes": 0
}

fetch("http://localhost:3000/toys", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  body: JSON.stringify(newToy)
})
  .then (res => res.json())
  .then(toy => createCard(toy))
  .catch(error => console.log(`Post failed. Error message: ${error.message}`))
}

 // Create Toy Event Listener
 function createToy() {
  let form = document.querySelector("form")
  
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    postToy(e.target.name.value, e.target.image.value)
  })
}

// PATCH Request for Likes

function updateLikes (e, toyObj) {
  let newNumberOfLikes = toyObj.likes +=1
  fetch(`http://localhost:3000/toys/${toyObj.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": newNumberOfLikes
    })
  })
  .then(res => res.json())
  .then((data) => {
    console.log(`${data.name} now has ${data.likes} likes!`)
    let p = e.target.parentNode.querySelector("p")
    p.textContent = `${data.likes} Likes`
  })
}