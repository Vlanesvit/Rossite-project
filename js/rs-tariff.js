function openFullList() {
	const tariffAbout = document.querySelector('.rs-tariff__about')
	const tariffAdd = document.querySelector('.rs-tariff__add');

	if (tariffAdd && tariffAbout) {
		tariffAdd.addEventListener('click', function () {
			tariffAbout.classList.add('_full')
			tariffAdd.classList.add('_hide');
		})
	}
}
openFullList()