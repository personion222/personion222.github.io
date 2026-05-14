import "./style.css"

const resize_rate = 6;
const min_size = 20;
const max_size = 220;
const main_el = document.querySelector("main");
const timestr = document.getElementById("timestr");

add_template(document.getElementById("whoami").parentElement.parentElement.getElementsByClassName("windowcontent")[0], "whoamicont");
add_template(document.getElementById("site").parentElement.parentElement.getElementsByClassName("windowcontent")[0], "sitecont");

update_time();
setInterval(update_time, 1000);

var elt = document.getElementById("calculator");
var calculator = Desmos.GraphingCalculator(elt);
fetch("./src/assets/calcstate.json").then((response) => {
	return response.json();
}).then((data) => {
	console.log(data);
	calculator.setState(data);
})

var viewer = OpenSeadragon({
	id: "openseadragon",
	prefixUrl: "./src/openseadragon/images/",
	tileSources: "./public/dzi/IMG_1661.dzi"
});

addEventListener("keydown", (event) => {
	console.log(event.key);
	if (event.shiftKey) {
		let sel_window = document.querySelector(".window:hover");
		if (sel_window) {
			let side = sel_window.parentElement;
			let row_index = Array.from(side.children).indexOf(sel_window);
			let col_index = Array.from(main_el.children).indexOf(side);

			if (event.key == "ArrowUp") {
				let grid_nums_str = side.style.gridTemplateRows.split(' ');
				let grid_nums = grid_nums_str.map((numstr) => {
					return Number(numstr.substring(0, numstr.length - 2)) + resize_rate / (grid_nums_str.length - 1);
				});
				grid_nums[row_index] = grid_nums[row_index] - resize_rate / (grid_nums_str.length - 1) - resize_rate;
				if (grid_nums.every((v) => min_size < v && v < max_size)) {
					side.style.gridTemplateRows = grid_nums.join("fr ") + "fr";
				}
			}

			if (event.key == "ArrowDown") {
				let grid_nums_str = side.style.gridTemplateRows.split(' ');
				let grid_nums = grid_nums_str.map((numstr) => {
					return Number(numstr.substring(0, numstr.length - 2)) - resize_rate / (grid_nums_str.length - 1);
				});
				grid_nums[row_index] = grid_nums[row_index] + resize_rate / (grid_nums_str.length - 1) + resize_rate;
				if (grid_nums.every((v) => min_size < v && v < max_size)) {
					side.style.gridTemplateRows = grid_nums.join("fr ") + "fr";
				}
			}

			if (event.key == "ArrowLeft") {
				let grid_nums_str = main_el.style.gridTemplateColumns.split(' ');
				let grid_nums = grid_nums_str.map((numstr) => {
					return Number(numstr.substring(0, numstr.length - 2)) + resize_rate / (grid_nums_str.length - 1);
				});
				grid_nums[col_index] = grid_nums[col_index] - resize_rate / (grid_nums_str.length - 1) - resize_rate;
				if (grid_nums.every((v) => min_size < v && v < max_size)) {
					main_el.style.gridTemplateColumns = grid_nums.join("fr ") + "fr";
				}
			}

			if (event.key == "ArrowRight") {
				let grid_nums_str = main_el.style.gridTemplateColumns.split(' ');
				let grid_nums = grid_nums_str.map((numstr) => {
					return Number(numstr.substring(0, numstr.length - 2)) - resize_rate / (grid_nums_str.length - 1);
				});
				grid_nums[col_index] = grid_nums[col_index] + resize_rate / (grid_nums_str.length - 1) + resize_rate;
				if (grid_nums.every((v) => min_size < v && v < max_size)) {
					main_el.style.gridTemplateColumns = grid_nums.join("fr ") + "fr";
				}
			}
		}
	}
})

document.getElementById("whoami").onmouseover = (event) => {
	if (event.target.classList.contains("desel")) {
		change_sel(event.target);
		event.target.classList.remove("desel");
		add_template(event.target.parentElement.parentElement.getElementsByClassName("windowcontent")[0], "whoamicont");
	}
}

document.getElementById("asdf").onmouseover = () => {
	if (event.target.classList.contains("desel")) {
		change_sel(event.target);
		event.target.classList.remove("desel");
		add_template(event.target.parentElement.parentElement.getElementsByClassName("windowcontent")[0], "asdfcont");
	}
}

document.getElementById("site").onmouseover = () => {
	if (event.target.classList.contains("desel")) {
		change_sel(event.target);
		event.target.classList.remove("desel");
		add_template(event.target.parentElement.parentElement.getElementsByClassName("windowcontent")[0], "sitecont");
	}
}

document.getElementById("8831").onmouseover = () => {
	if (event.target.classList.contains("desel")) {
		change_sel(event.target);
		event.target.classList.remove("desel");
		add_template(event.target.parentElement.parentElement.getElementsByClassName("windowcontent")[0], "8831cont");
	}
}

function change_sel(element) {
	let children = element.parentElement.children
	for (let i = 0; i < children.length; i++) {
		if (!children[i].classList.contains("desel")) {
			children[i].classList.add("desel");
		}
	}
}

function add_template(pos, temp) {
	if (pos.firstChild) {
		pos.removeChild(pos.firstChild);
	}
	pos.appendChild(document.getElementById(temp).content.cloneNode(true));
}

function update_time() {
	let date = new Date();
	timestr.textContent = `my local time: ${date.toLocaleString("en-GB", {timeZone: "America/Toronto"})} (America/Toronto)`;
}
