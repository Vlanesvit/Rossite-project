
/*
Документация: https://splitting.js.org/
*/
// Подключаем из node_modules
// import "splitting/dist/splitting.css";
// import "splitting/dist/splitting-cells.css";
// import Splitting from "splitting";

Splitting();

/* ====================================
Разделение слов на буквы
==================================== */
export function SplittingTextAnim() {
	const splittingItems = [
		{ item: '.rs-header__menu .menu__list li > a > span' },
		{ item: '.rs-footer__menu .menu__list li > a', },
		{ item: '.rs-btn .btn-text', },
		{ item: '.split-text', },
	]
	for (let i = 0; i < splittingItems.length; i++) {
		const spltItems = document.querySelectorAll(splittingItems[i].item)
		spltItems.forEach(item => {
			item.innerHTML =
				'<span class="spltting-text">' + item.textContent + '</span>'
			const spanTextItems = item.querySelector('span.spltting-text');
			Splitting({
				target: spanTextItems,
			});
		});
	}
}
SplittingTextAnim()