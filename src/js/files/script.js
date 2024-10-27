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