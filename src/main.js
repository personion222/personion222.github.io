import "./style.css";
import exifr from "exifr";
import js_yaml from "js-yaml";
import fs from "fs";
import OpenSeadragon from "openseadragon";

const resize_rate = 6;
const min_size = 20;
const max_size = 220;
const main_el = document.querySelector("main");
const timestr = document.getElementById("timestr");

add_template(document.getElementById("whoami").parentElement.parentElement.getElementsByClassName("windowcontent")[0], "whoamitemp");
add_template(document.getElementById("site").parentElement.parentElement.getElementsByClassName("windowcontent")[0], "sitetemp");

update_time();
setInterval(update_time, 1000);

const calc_projects = ["fox", "pool", "drone"];
const calc_proj = calc_projects[randmaxint(3)];
var elt = document.getElementById("calculator");
var calculator;
if (calc_proj == "drone") {
	calculator = Desmos.Calculator3D(elt, {expressionsCollapsed: true});
} else {
	calculator = Desmos.GraphingCalculator(elt, {expressionsCollapsed: true});
}
fetch(`./assets/${calc_proj}.json`).then((response) => {
	return response.json();
}).then((data) => {
	console.log(data);
	calculator.setState(data);
})

var viewer = OpenSeadragon({
	id: "openseadragon",
	prefixUrl: "/openseadragon-images/",
	// tileSources: "./dzi/IMG_1661.dzi",
	maxZoomPixelRatio: 5,
});

var yaml_parsed;
var img_idx;
var img_ids;
fetch("./assets/images/index.yaml").then(async (response) => {
	const yaml_text = await response.text();
	yaml_parsed = js_yaml.load(yaml_text);
	console.log(yaml_parsed);
	img_ids = Object.keys(yaml_parsed);
	img_ids.sort();
	console.log(img_ids);
	img_idx = Math.floor(Math.random() * img_ids.length);
	load_photo(img_ids[img_idx]);
})

addEventListener("keydown", (event) => {
	console.log(event.key);
	if (event.ctrlKey) {
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
		add_template(event.target.parentElement.parentElement.getElementsByClassName("windowcontent")[0], "whoamitemp");
	}
}

document.getElementById("contact").onmouseover = (event) => {
	if (event.target.classList.contains("desel")) {
		change_sel(event.target);
		event.target.classList.remove("desel");
		add_template(event.target.parentElement.parentElement.getElementsByClassName("windowcontent")[0], "contacttemp");
	}
}

document.getElementById("site").onmouseover = (event) => {
	if (event.target.classList.contains("desel")) {
		change_sel(event.target);
		event.target.classList.remove("desel");
		add_template(event.target.parentElement.parentElement.getElementsByClassName("windowcontent")[0], "sitetemp");
	}
}

document.getElementById("8831").onmouseover = (event) => {
	if (event.target.classList.contains("desel")) {
		change_sel(event.target);
		event.target.classList.remove("desel");
		add_template(event.target.parentElement.parentElement.getElementsByClassName("windowcontent")[0], "8831temp");
	}
}

document.getElementById("bckbtn").onclick = () => {
	img_idx--;
	img_idx = modulo(img_idx, img_ids.length);
	console.log(img_idx);
	load_photo(img_ids[img_idx]);
}

document.getElementById("fwdbtn").onclick = () => {
	img_idx++;
	img_idx = modulo(img_idx, img_ids.length);
	console.log(img_idx);
	load_photo(img_ids[img_idx]);
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
	while (pos.firstChild) {
		pos.removeChild(pos.firstChild);
	}
	pos.appendChild(document.getElementById(temp).content.cloneNode(true));
}

function load_photo(id) {
	viewer.open(`/dzi/${id}.dzi`);
	exifr.parse(`./assets/images/jpeg/${id}.jpg`).then((response) => {
		console.log(response);
		document.getElementById("eogexifval").innerHTML = `
			<a href="./assets/images/jpeg/${id}.jpg" download>${id}.jpg</a><br>
			f/${response.FNumber.toFixed(1)}<br>
			1/${Math.round(1 / response.ExposureTime)} sec.<br>
			${response.FocalLength.toFixed(1)} (lens)<br>
			${response.ISO}<br>
			${response.Make}<br>
			${response.Model}<br>
			${response.DateTimeOriginal.toLocaleDateString()}<br>
			${response.DateTimeOriginal.toLocaleTimeString()}<br>
			${yaml_parsed[id]["location"]}<br>`;
	});
}

function update_time() {
	let date = new Date();
	timestr.textContent = `my local time: ${date.toLocaleString("en-GB", {timeZone: "America/Toronto"})} (America/Toronto)`;
}

function modulo(n, d){
	return ((n % d) + d) % d;
}

function randmaxint(int) {
	return Math.floor(Math.random() * int);
}
