const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const itemFilter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear");
const formButton = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromLocalStorage = getItemFromLocalStorage();
  itemsFromLocalStorage.forEach((item) => addItemToDom(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  // Validate Input
  if (newItem === "") {
    alert("Please add an item.");
    return;
  }

  //   Check for edit Mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromLocalStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  }else{
    if(checkDuplicate(newItem)){
        alert('Item already exists!');
    }
  }

  //   create item DOM element
  addItemToDom(newItem);
  //   Add item t storage
  addItemToLocalStorage(newItem);
  checkUI();

  itemInput.value = "";
}

function addItemToDom(item) {
  //Create List Items
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add li to DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToLocalStorage(item) {
  const itemsFromLocalStorage = getItemFromLocalStorage();

  // add new item to array
  itemsFromLocalStorage.push(item);

  // convert to JSON string and set to local
  localStorage.setItem("items", JSON.stringify(itemsFromLocalStorage));
}

function getItemFromLocalStorage() {
  let itemsFromLocalStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromLocalStorage = [];
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromLocalStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkDuplicate(item) {
  const itemsFromLocalStorage = getItemFromLocalStorage();
  return itemsFromLocalStorage.includes(item);
}
function setItemToEdit(item) {
  isEditMode = true;
  if (item.tagName === "LI") {
    item.classList.add("edit-mode");
    formButton.innerHTML = "<i class = 'fa-solid fa-pen'></i>  Update Item ";
    formButton.style.backgroundColor = "#228B22";
    itemInput.value = item.textContent;
  }
}

function removeItem(item) {
  if (confirm("Are you sure?")) {
    // Remove item from DOM
    item.remove();

    // Remove item from local storage
    removeItemFromLocalStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromLocalStorage(item) {
  let itemsFromLocalStorage = getItemFromLocalStorage();

  // Filter out item to remove from storage
  itemsFromLocalStorage = itemsFromLocalStorage.filter((i) => i !== item);

  //   Re - set to localstorage
  localStorage.setItem("items", JSON.stringify(itemsFromLocalStorage));
}

function clearAll() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  //   Clear From local storage
  localStorage.removeItem("items");
  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearButton.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearButton.style.display = "block";
    itemFilter.style.display = "block";
  }
  formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formButton.style.backgroundColor = "";
  isEditMode = false;
}

//Initialize app
function init() {
  //Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearButton.addEventListener("click", clearAll);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
