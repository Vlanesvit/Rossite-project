// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { vnvModules } from "./modules.js";

/* ====================================
Добавить картинкам draggable="false"
==================================== */
const imgs = document.getElementsByTagName('img');
for (let i = 0; i < imgs.length; i++) {
	imgs[i].setAttribute('draggable', false);
}

/* ====================================
Прогресс прокрутки страницы
==================================== */
function progressBar() {
	let scroll = document.body.scrollTop || document.documentElement.scrollTop;
	let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	let scrolled = scroll / height * 100;
	document.getElementById('progressBar').style.width = scrolled + '%';
}
window.addEventListener('scroll', progressBar);

/* ====================================
Появление кнопки "Посмотреть другие кейсы" на главной в моб.версии
==================================== */
function showBtnCases() {
	const btnProjectAll = document.querySelector('.rs-main__project-all');

	if (btnProjectAll) {
		if (window.scrollY > 500 && window.scrollY < 2500) {
			btnProjectAll.classList.add('_show');
		} else {
			btnProjectAll.classList.remove('_show');
		}
	}
}
window.addEventListener('scroll', showBtnCases);