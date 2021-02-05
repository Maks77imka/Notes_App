/* notetoself.js
 * 
 * This version uses array and adds the color JSON
 */

window.onload = init;

function init() {
	const button = document.querySelector("#add_button");
	button.onclick = createSticky;

	const clearButton = document.querySelector("#clear_button");
	clearButton.onclick = clearStorage;

	let stickiesArray = getStickiesArray();

	for (let i = 0; i < stickiesArray.length; i++) {
		let key = stickiesArray[i];
		let value = JSON.parse(localStorage[key]);
		addStickyToDOM(key, value);
	}
}

function createSticky() {
	let stickiesArray = getStickiesArray();

	let colorSelectObj = document.querySelector("#note_color");
	let index = colorSelectObj.selectedIndex;
	let color = colorSelectObj[index].value;
	let value = document.querySelector("#note_text").value;

	// create sticky note using JSON to hold value and color
	let currentDate = new Date();
	let key = "sticky_" + currentDate.getTime();
	if (value) {
		const stickyObj = {
			"value": value,
			"color": color
		};
		localStorage.setItem(key, JSON.stringify(stickyObj));
		// add new sticky note key to array and update notes array in localStorage
		stickiesArray.push(key);
		localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));

		addStickyToDOM(key, stickyObj);
	}
}

function getStickiesArray() {
	let stickiesArray = localStorage.getItem("stickiesArray");
	if (!stickiesArray) {
		stickiesArray = [];
		localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
	} else {
		stickiesArray = JSON.parse(stickiesArray);
	}
	return stickiesArray;
}

function addStickyToDOM(key, stickyObj) {
	let stickies = document.querySelector("#stickies");

	let sticky = document.createElement("li");
	// set the id attribute to the key so we can find it using
	// the ids stored in the stickies array
	sticky.setAttribute("id", key);
	// use the stickyObj color, and set the background-color CSS style
	sticky.style.backgroundColor = stickyObj.color;

	
	let new_image = document.createElement("a");
	new_image.setAttribute("id", "close_button");
	let span = document.createElement("span");
	span.setAttribute("class", "sticky");

	// use the stickyObj value as text for the sticky note
	span.innerHTML = stickyObj.value;

	// add all to the DOM
	sticky.appendChild(new_image);
	sticky.appendChild(span);
	stickies.appendChild(sticky);

	// add an event listener so if u click on a bin sticky can be deleted
	new_image.onclick = deleteSticky;
}

function removeStickyFromDOM(key) {
	let sticky = document.getElementById(key);
	sticky.parentNode.removeChild(sticky);
}

function clearStorage() {
	localStorage.clear();
}

// delete function
function deleteSticky(event) {
	let key = event.target.id;
	if (event.target.tagName.toLowerCase() == "a") {
		key = event.target.parentNode.id;
	}
	localStorage.removeItem(key);
	let stickiesArray = getStickiesArray();
	if (stickiesArray) {
		for (let i = 0; i < stickiesArray.length; i++) {
			if (key == stickiesArray[i]) {
				stickiesArray.splice(i, 1);
			}
		}
		localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
		removeStickyFromDOM(key);
	}
}