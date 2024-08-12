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
				ScrollTrigger.refresh(true);
			})
		}
	});
}
if (document.querySelector('.rs-tariff__block') && document.querySelector('.rs-tariff__add')) {
	openFullList()
}