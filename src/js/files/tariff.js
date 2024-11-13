import { handleReveal } from "../libs/animation-gsap.js";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
gsap.registerPlugin(ScrollTrigger);

/* ====================================
Кнопка "Показать еще"
==================================== */
export function openFullList() {
	const tariffs = document.querySelectorAll('.rs-tariff');

	tariffs.forEach(tariff => {
		const tariffAbout = tariff.querySelector('.rs-tariff__block')
		const tariffAdd = tariff.querySelector('.rs-tariff__add');

		if (tariffAdd && tariffAbout) {
			tariffAdd.addEventListener('click', function () {
				tariffAbout.classList.add('_full')
				tariffAdd.classList.add('_hide');

				// handleReveal()  // Обновление ScrollTrigger после появления новых элементо
				ScrollTrigger.refresh()
			});
		}
	});
}
if (document.querySelector('.rs-tariff__block') && document.querySelector('.rs-tariff__add')) {
	openFullList()
}