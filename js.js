"use strict";

window.addEventListener("DOMContentLoaded", init);
//prototype declaration
let StudentPrototype = {
  firstname: "-firstname",
  lastname: "-lastname",
  fullname: "-student-fullname-",
  house: "-house-"
};

//global variables
let jsonData;
let jsonDataBlood;
let arrayStudents = [];
let arrFiltered = [];
let myJson;
let spacebar;
let fullLast;

//initial function that calls json loading function
function init() {
  document.querySelector("#list").addEventListener("click", clickList);
  loadJSON();
}

function loadJSON() {
  /*fetches local json and cals function that creates array
   of objects from json data*/
  fetch("http://petlatkea.dk/2019/hogwarts/students.json")
    .then(response => response.json())
    .then(myJson => {
      jsonData = myJson;
      prepareObjects(myJson);
    });
}
//makes array of student from json data and calls display function
function prepareObjects(jsonData) {
  jsonData.forEach(student => {
    const studs = Object.create(StudentPrototype);
    studs.fullname = student.fullname;
    studs.house = student.house;
    let spacebar = studs.fullname.indexOf(" ");

    studs.lastname = studs.fullname.substring(spacebar, studs.fullname.length);
    studs.firstname = studs.fullname.substring(0, spacebar);
    //push to array
    arrayStudents.push(studs);
    //puts unique id's to each student
    arrayStudents.forEach(item => {
      item.id = uuidv4();
    });
  });
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
  displayStudent(arrayStudents);
}
//displays student info in tbody html element
function displayStudent() {
  //IMPORTANT to clear before cloning!
  document.querySelector("#list tbody").innerHTML = "";
  arrFiltered.forEach(studs => {
    //clone to html
    const clone = document
      .querySelector("template#student")
      .content.cloneNode(true);
    clone.querySelector("[data-field=name]").textContent = studs.firstname;
    clone.querySelector("[data-field=house]").textContent = studs.house;
    clone.querySelector("[data-field=last]").textContent = studs.lastname;
    clone.querySelector("button").dataset.id = studs.id;
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

//Modal stolen and modified
document.addEventListener(
  "click",
  function(e) {
    e = e || window.event;
    let target = e.target || e.srcElement;
    e.preventDefault();
    if (
      target.hasAttribute("data-toggle") &&
      target.getAttribute("data-toggle") == "modal"
    ) {
      if (target.hasAttribute("data-target")) {
        let m_ID = target.getAttribute("data-target");
        document.getElementById(m_ID).classList.add("open");
      }
    }
    // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
    if (
      (target.hasAttribute("data-dismiss") &&
        target.getAttribute("data-dismiss") == "modal") ||
      target.classList.contains("modal")
    ) {
      let modal = document.querySelector('[class="modal open"]');
      modal.classList.remove("open");
    }
  },
  false
);
//end of Modal

function filtering(house) {
  if (house === "all") {
    arrFiltered = arrayStudents;
  } else {
    arrFiltered = arrayStudents.filter(elem => elem.house === house);
  }
  displayStudent();
}

function sorting(property) {
  arrFiltered = arrFiltered.sort(sortDesc);
  function sortDesc(a, b) {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  }
  displayStudent();
}
