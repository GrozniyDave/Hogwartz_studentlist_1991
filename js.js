"use strict";
window.addEventListener("DOMContentLoaded", init);
//prototype declaration
let StudentPrototype = {
  firstname: "-firstname",
  lastname: "-lastname",
  fullname: "-student-fullname-",
  house: "-house-"
};
let mySelf = {
  firstname: "Artjoms",
  lastname: "Turks",
  fullname: "Artjoms Turks",
  house: "Copenhagen",
  id: "27",
  blood: "The king of the pirates"
};
//global variables
let jsonData;
let jsonDataBlood;
let arrayStudents = [];
let arrFiltered = [];
let bloodFamily = [];
let myJson;
let myJsonBlood;
let spacebar;
let fullLast;
let modal = document.querySelector("#simpleModal_5");
let TrueLast;
let squad = document.querySelector("#squadAdd");
let selectedStudent;
//initial function that calls json loading function
function init() {
  document.querySelector("#list").addEventListener("click", clickList);
  loadJSONBlood();
}

//loads hogwartz students
function loadJSON() {
  fetch("https://petlatkea.dk/2019/hogwarts/students.json")
    .then(response => response.json())
    .then(myJson => {
      jsonData = myJson;
      prepareObjects(myJson);
    });
}

//loads blood json
function loadJSONBlood() {
  fetch("https://petlatkea.dk/2019/hogwarts/families.json")
    .then(response => response.json())
    .then(myJsonBlood => {
      jsonDataBlood = myJsonBlood;
      console.log(myJsonBlood);
      loadJSON();
    });
}

//makes array of student from json data and calls display function
function prepareObjects(jsonData) {
  jsonData.forEach(student => {
    const studs = Object.create(StudentPrototype);
    studs.fullname = student.fullname;
    studs.house = student.house;
    let spacebar = studs.fullname.indexOf(" ");
    let TrueLast = studs.lastname.substring(
      studs.lastname.indexOf(" "),
      studs.lastname.length
    );
    studs.lastname = studs.fullname.substring(
      spacebar + 1,
      studs.fullname.length
    );
    studs.blood = TrueLast;

    studs.firstname = studs.fullname.substring(0, spacebar);
    if (jsonDataBlood.half.includes(studs.lastname)) {
      studs.blood = "half";
    } else if (jsonDataBlood.pure.includes(studs.lastname)) {
      studs.blood = "pure";
    } else {
      studs.blood = "muggle";
    }
    //push to array
    arrayStudents.push(studs);
    //puts unique id's to each student
    arrayStudents.forEach(item => {
      item.id = uuidv4();
    });
  });
  arrayStudents.push(mySelf);
  arrFiltered = arrayStudents;
  console.log(arrFiltered);
  //IMPORTANT to not put it inside loop but after loop is finished!
  displayStudent(arrayStudents);
}
//just to check status of array students
console.log(arrayStudents);
//when expell is clicked,call remove function
function clickList(event) {
  if (event.target.tagName == "BUTTON") {
    clickRemove();
  }
}

//remove function(expellling)
function clickRemove() {
  let target = event.target.dataset.id;
  let indexToCut = arrayStudents.findIndex(student => student.id === target);
  arrayStudents.splice(indexToCut, 1);
  let indexToCut1 = arrFiltered.findIndex(student => student.id === target);
  arrFiltered.splice(indexToCut1, 1);

  if (target === "27") {
    alert("Ok,u're happy now?");
    setTimeout(function() {
      alert("But remember, I will follow you..");
    }, 1500);
  }
  arrFiltered.push(mySelf);
  arrFiltered.sort;
  displayStudent();
}

//displays student info in tbody html element
function displayStudent() {
  //IMPORTANT to clear before cloning!
  document.querySelector("#list tbody").innerHTML = "";
  arrFiltered.forEach(studs => {
    selectedStudent = student;
    //clone to html
    const clone = document
      .querySelector("template#student")
      .content.cloneNode(true);
    clone.querySelector("[data-field=name]").textContent = studs.firstname;
    clone.querySelector("[data-field=house]").textContent = studs.house;
    clone.querySelector("[data-field=last]").textContent = studs.lastname;
    clone.querySelector("button").dataset.id = studs.id;
    clone.querySelector(".Modallink").onclick = () => {
      displayModal(studs);
    };
    clone
      .querySelector("#squadAdd")
      .addEventListener("click", () => addToInquisitorialSquad(studs));
    document.querySelector("#list tbody").appendChild(clone);
  });
}

//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//displays modal
function displayModal(stud) {
  let spacebar = stud.lastname.indexOf(" ");

  document.querySelector("#simpleModal_5 > div > h1").textContent =
    stud.fullname;
  document.querySelector("#simpleModal_5 > div > img:nth-child(2)").src =
    "images/" +
    stud.lastname.substring(spacebar + 1, stud.lastname.length).toLowerCase() +
    "_" +
    stud.firstname.substring(0, 1).toLowerCase() +
    ".png";
  document.querySelector("#simpleModal_5 > div > img:nth-child(3)").src =
    "flags/" + stud.house + ".png";
  document.querySelector("#simpleModal_5 > div > h4").textContent =
    "Blood type: " + stud.blood;
  //shows modal on click
  modal.style.display = "block";
}

//close modal on click
modal.addEventListener("click", () => {
  modal.style.display = "none";
});

//filters
function filtering(house) {
  if (house === "all") {
    arrFiltered = arrayStudents;
  } else {
    arrFiltered = arrayStudents.filter(elem => elem.house === house);
  }
  displayStudent();
}

//sorts
function sorting(property) {
  arrFiltered = arrFiltered.sort(sortDesc);
  function sortDesc(a, b) {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  }
  displayStudent();
}

//adds students to IS
function addToInquisitorialSquad(stud) {
  if (stud.inSquad) {
    alert("Student is already in the squad.");
  } else {
    if (stud.blood === "pure" || stud.house === "Slytherin") {
      alert("You're in the squad ! Well done!");
      //u can use it later - to know if student is in the squad
      stud.inSquad = true;
    } else {
      alert("This student can't be in the squad!");
    }
  }
}
//removes from IS (unfortunately that's didnt work)
// function removeFromInquisitorialSquad() {
//   if (selectedStudent.inSquad) {
//     alert("Student is removed from the squad.");
//   } else {
//     alert("Student does not belong to the squad so you can't remove him.");
//   }
// }
