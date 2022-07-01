document.getElementById('docsToggler').onclick = function() {
	let parent = document.getElementById('docsItem');
	parent.classList.toggle('navigation__item_active');
}

document.getElementById('headerToggler').onclick = function() {
	let header = document.getElementById('header');
	header.classList.toggle('header_hidden');
}


spiral = SpiralJS.init('canvas');