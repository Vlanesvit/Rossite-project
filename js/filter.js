function getChecked(type) {
	let itemThisChecked = document.querySelectorAll("[name='" + type + "']:checked");
	return Array.from(itemThisChecked).map(cb => cb.value);
}
function filterChange(filterItem) {
	filterItem.forEach((filter => {
		const filterTitle = filter.querySelector(".filter__title");
		outputChecked(filter, filterTitle);
	}));
}
function outputChecked(where_find, where_output) {
	const projectAdd = document.querySelector(".rs-project .rs-project__add");

	if (where_output) {
		const activeCheckbox = where_find.querySelectorAll('input[type="checkbox"]:checked'),
			activeList = where_find.querySelector('.filter__modal_select_list');
		let numCheckedFilter = activeCheckbox.length,
			activeCheckboxLabel = Array.from(activeCheckbox).map(cb => cb.getAttribute('data-title')),
			filterCount = where_find.querySelector('.filter__count');

		if (activeList) activeList.innerHTML = "";

		if (numCheckedFilter > 0) {
			if (filterCount) {
				where_output.classList.add("_output-count");
				filterCount.style.display = "flex";
				filterCount.innerHTML = numCheckedFilter;
			}
			if (activeList) {
				activeCheckboxLabel.forEach(function (elem) {
					let li = document.createElement('li');
					li.textContent = elem;
					activeList.append(li);
				})
			}
		} else {
			if (activeList) activeList.innerHTML = "";
			if (filterCount) {
				where_output.classList.remove("_output-count");
				filterCount.style.display = "none";
				filterCount.innerHTML = "";
			}
		}
	}

	if (projectAdd.getAttribute('data-max_pages') > 1) {
		projectAdd.classList.remove("_close-btn");
	} else {
		projectAdd.classList.add("_close-btn");
	}
}
function ajax_project(action, checkedYear = [], checkedCity = [], checkedIndustry = [], checkedType = [], loadmore = false) {
	const url = new URL(location);
	const baseUrl = `${url.origin}${url.pathname}`;
	const projectAdd = document.querySelector(".rs-project .rs-project__add");
	jQuery.ajax({
		type: 'POST',
		url: rs_ajax.ajaxurl,
		data: {
			'year': checkedYear,
			'city': checkedCity,
			'industry': checkedIndustry,
			'type': checkedType,
			'paged': loadmore ? +projectAdd.getAttribute('data-paged') + 1 : +projectAdd.getAttribute('data-paged'),
			'maxPages': projectAdd.getAttribute('data-max_pages'),
			'loadmore': loadmore,
			'base': baseUrl,
			'action': action,
		},
		dataType: 'json',
		beforeSend: function (xhr) {
			jQuery('body').addClass('loading');
			//  console.log('Загружаю...');
		},
		success: function (response) {
			if (response.projects) {
				if (loadmore) {
					jQuery('#response').append(response.projects);
				} else {
					jQuery('#response').html(response.projects);
				}

				jQuery('#response .rs-project__slide').addClass('_open-project');
				jQuery('.rs-project__footer .pagging').html(response.nav);
				projectAdd.setAttribute('data-max_pages', response.max_pages);
				projectAdd.setAttribute('data-paged', response.paged);
				if (response.max_pages > 1 && response.paged != response.max_pages) {
					projectAdd.classList.remove("_close-btn");
				} else {
					projectAdd.classList.add("_close-btn");
				}

				// Диспатч события об обновлении проектов
				const event = new Event('projectsUpdated');
				document.dispatchEvent(event);
			}

			if (loadmore && response.paged != 1 && action != 'project_check') {
				var newUrl = baseUrl + '?page=' + response.paged;
				history.pushState(null, null, newUrl);
			} else {
				history.pushState(history.state, null, baseUrl);
			}
			jQuery('body').removeClass('loading');
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log('Filter ERROR STATUS: ' + xhr.status);
			console.log('Filter ajaxOptions: ' + ajaxOptions);
			console.log('Filter Error: ' + thrownError);
		}
	});
}

document.addEventListener('projectsUpdated', () => {
	// Обновляем ScrollTrigger или любую другую анимацию
	if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
		setTimeout(() => {
			ScrollTrigger.refresh();
		}, 100);
	}
});