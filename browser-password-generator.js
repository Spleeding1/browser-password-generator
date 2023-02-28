/**
 * @package Browser Password Generator
 * browswer-password-generator.js
 * Copyright (c) 2023 by Carl David Brubaker
 * All Rights Reserved
 * https://github.com/Spleeding1/browser-password-generator/
 *
 * Generates random password with the given criteria
 */

if (`loading` === document.readyState) {
	// The DOM has not yet been loaded.
	document.addEventListener(`DOMContentLoaded`, initPasswordGenerator);
} else {
	// The DOM has already been loaded.
	initPasswordGenerator();
}

function initPasswordGenerator() {
	pgDivHTML = `<div class="password-generator"><form><h3>Select password options:</h3>`;
	const checkboxes = [`Lowercase`, `Uppercase`, `Numbers`, `Specials`];
	checkboxes.forEach(checkbox => {
		pgDivHTML += `<div><input type="checkbox" id="${checkbox}">`;
		pgDivHTML += `<label for="${checkbox}">${checkbox}</label></div>`;
	});
	pgDivHTML += `<div><label for="length">Length</label>`;
	pgDivHTML += `<input type="number" min="4" max="255" id="length" value="16">`;
	pgDivHTML += `<button id="generate">Generate Password</button></form>`;
	pgDivHTML += `<p id="password"></p><button type="button" id="copy">Copy Password</button><small>Copied!</small><input type="hidden" id="hiddenPassword"></div>`;

	document.body.innerHTML = pgDivHTML;

	checkboxes.forEach(checkbox => {
		document.querySelector(`#${checkbox}`).checked = true;
	});
	const button = document.querySelector(`#generate`);
	button.addEventListener(`click`, generatePassword);
	const copy = document.querySelector(`#copy`);
	copy.addEventListener(`click`, copyPassword);
}

function generatePassword(e) {
	e.preventDefault();
	const characterSets = [`Lowercase`, `Uppercase`, `Numbers`, `Specials`];
	const characters = {
		"Lowercase": `abcdefghijklmnopqrstuvwxyz`,
		"Uppercase": `ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
		"Numbers": `1234567890`,
		"Specials": `!@#$%^&*()`,
	};

	let finalCharacters = ``;
	let password = ``;
	const loopPromises = [];
	const passwordLength = parseInt(document.querySelector(`#length`).value);

	for (let i = 0; i < passwordLength; i++) {
		loopPromises.push(
			new Promise(resolve => {
				const random = Math.random();
				if (characterSets.length > 0) {
					const index = Math.floor(random * characterSets.length);
					const setName = characterSets[index];
					console.log(setName);
					const setCheckbox = document.querySelector(`#${setName}`);
					if (setCheckbox.checked) {
						const set = characters[setName];
						password += set.charAt(Math.floor(random * set.length));
						finalCharacters += set;
					}
					characterSets.splice(index, 1);
					resolve();
					return;
				}
				password += finalCharacters.charAt(Math.floor(random * finalCharacters.length));
				console.log(password);
				resolve();
			})
		);
	}

	Promise.all(loopPromises).then(() => {
		document.querySelector(`#password`).innerHTML = password;
		document.querySelector(`#hiddenPassword`).value = password;
		document.querySelector(`#copy`).style.display = `block`;
		document.querySelector(`small`).style.display = `none`;
	});
}

function copyPassword() {
	navigator.clipboard.writeText(document.querySelector(`#hiddenPassword`).value);
	document.querySelector(`small`).style.display = `block`;
}
