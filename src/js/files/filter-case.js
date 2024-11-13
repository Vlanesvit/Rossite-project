import {
	getChecked,
	filterChange,
	outputChecked,
	ajax_project
} from "./filter.js";

window.addEventListener("load", (() => {
	filter_projects();
}));

export function filter_projects() {
	const filter = document.querySelector('.filter');
	if (filter) {
		const filterItem = document.querySelectorAll(".rs-project .filter__item"),
			checked = document.querySelectorAll('.filter__list input[type="checkbox"]'),
			reset = filter.querySelector('button[type="reset"]'),
			projectAdd = document.querySelector(".rs-project .rs-project__add");
		let defaultCheckType = document.querySelector('.filter__list input[name="project_type"]'),
			defaultcheckedType = (defaultCheckType.value);
		let checkedYear = [], checkedCity = [], checkedIndustry = [], checkedType = [];

		filterChange(filterItem);
		reset.addEventListener('click', function () {
			let activeList = filter.querySelectorAll('.filter__modal_select_list'),
				filterCount = filter.querySelectorAll('.filter__count');

			activeList.forEach(function (elem) {
				elem.innerHTML = "";
			});

			filterCount.forEach(function (elem) {
				elem.innerHTML = "";
				elem.style.display = "none";
			});

			checked.forEach((item => {
				item.checked = false;
			}));

			filterChange(filterItem);
			checkedYear = []; checkedCity = []; checkedIndustry = []; checkedType = defaultcheckedType;
			projectAdd.setAttribute('data-paged', 1);
			ajax_project('project_check', checkedYear, checkedCity, checkedIndustry, checkedType);
		});
		projectAdd.addEventListener('click', function (e) {
			e.preventDefault();
			filterChange(filterItem);
			checkedYear = getChecked("year[]");
			checkedCity = getChecked("city[]");
			checkedIndustry = getChecked("industry[]");
			checkedType = getChecked("type[]");
			if (!checkedType.length) checkedType = defaultcheckedType;
			ajax_project('project_check', checkedYear, checkedCity, checkedIndustry, checkedType, true)
		});
		checked.forEach(function (item) {
			item.addEventListener('input', function () {
				const itemThisName = item.getAttribute('name'),
					itemThisAllChecked = document.querySelectorAll("[name='" + itemThisName + "']"),
					itemThisChecked = document.querySelectorAll("[name='" + itemThisName + "']:checked");

				if (item.value == 'all') {
					if (item.checked) {
						itemThisAllChecked.forEach((item => {
							item.checked = true;
						}));
					} else {
						itemThisAllChecked.forEach((item => {
							item.checked = false;
						}));
					}
				} else {
					if (itemThisAllChecked.length == itemThisChecked.length) {
						itemThisAllChecked.forEach((item => {
							if (item.value == 'all') item.checked = true;
						}));
					} else {
						itemThisAllChecked.forEach((item => {
							if (item.value == 'all') item.checked = false;
						}));
					}
				}

				filterChange(filterItem);
				switch (itemThisName) {
					case "year[]": checkedYear = getChecked(itemThisName); break;
					case "city[]": checkedCity = getChecked(itemThisName); break;
					case "industry[]": checkedIndustry = getChecked(itemThisName); break;
					case "type[]": checkedType = getChecked(itemThisName); break;
				}
				projectAdd.setAttribute('data-paged', 1);
				if (!checkedType.length) checkedType = defaultcheckedType;

				ajax_project('project_check', checkedYear, checkedCity, checkedIndustry, checkedType)
			});
		});
	}
}