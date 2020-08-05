setTimeout(() => document.body.classList.add('render'), 60);
const navdemos = Array.from(document.querySelectorAll('nav.demos > .demo'));
const navigate = (linkEl) => {
	document.body.classList.remove('render');
	document.body.addEventListener('transitionend', () => window.location = linkEl.href);
};
navdemos.forEach(link => link.addEventListener('click', (ev) => {
	ev.preventDefault();
	navigate(ev.target);
}));
