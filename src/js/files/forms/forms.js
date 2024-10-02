// Подключение функционала "Чертогов Фрилансера"
// Подключение списка активных модулей
import { vnvModules } from "../modules.js";
// Вспомогательные функции
import { isMobile, _slideUp, _slideDown, _slideToggle, vnv } from "../functions.js";
// Модуль прокрутки к блоку
import { gotoBlock } from "../scroll/gotoblock.js";
//================================================================================================================================================================================================================================================================================================================================

/*
Документация: https://template.vnv.guru/template-docs/rabota-s-formami.html
*/

// Работа с полями формы. Добавление классов, работа с placeholder
export function formFieldsInit(options = { viewPass: false, autoHeight: false }) {
	// Если включено, добавляем функционал "скрыть плейсходлер при фокусе"
	const forms = document.querySelectorAll('.form');
	forms.forEach(form => {
		const formFields = form.querySelectorAll('input[placeholder],textarea[placeholder]');
		if (formFields.length) {
			formFields.forEach(formField => {
				if (!formField.hasAttribute('data-placeholder-nohide')) {
					formField.dataset.placeholder = formField.placeholder;
				}
			});
		}
		document.body.addEventListener("focusin", function (e) {
			const targetElement = e.target;
			if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
				if (targetElement.dataset.placeholder) {
					targetElement.placeholder = '';
				}
				if (!targetElement.hasAttribute('data-no-focus-classes') && targetElement.closest('.form__line')) {
					targetElement.classList.add('_form-focus');
					targetElement.closest('.form__line').classList.add('_form-focus');
				}
				formValidate.removeError(targetElement);
			}
		});
		document.body.addEventListener("focusout", function (e) {
			const targetElement = e.target;
			if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
				if (targetElement.dataset.placeholder) {
					targetElement.placeholder = targetElement.dataset.placeholder;
				}
				if (!targetElement.hasAttribute('data-no-focus-classes') && targetElement.closest('.form__line')) {
					targetElement.classList.remove('_form-focus');
					targetElement.closest('.form__line').classList.remove('_form-focus');
				}
				// Моментальная валидация
				if (targetElement.hasAttribute('data-validate')) {
					formValidate.validateInput(targetElement);
				}
			}
		});
		// Если включено, добавляем функционал "Показать пароль"
		if (options.viewPass) {
			document.addEventListener("click", function (e) {
				let targetElement = e.target;
				if (targetElement.closest('[class*="__viewpass"]')) {
					let inputType = targetElement.classList.contains('_viewpass-active') ? "password" : "text";
					targetElement.closest('.form__line').querySelector('input').setAttribute("type", inputType);
					targetElement.classList.toggle('_viewpass-active');
				}
			});
		}
		// Если включено, добавляем функционал "Автовысота"
		if (options.autoHeight) {
			const textareas = document.querySelectorAll('textarea[data-autoheight]');
			if (textareas.length) {
				textareas.forEach(textarea => {
					const startHeight = textarea.hasAttribute('data-autoheight-min') ?
						Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
					const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
						Number(textarea.dataset.autoheightMax) : Infinity;
					setHeight(textarea, Math.min(startHeight, maxHeight))
					textarea.addEventListener('input', () => {
						if (textarea.scrollHeight > startHeight) {
							textarea.style.height = `auto`;
							setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
						}
					});
				});
				function setHeight(textarea, height) {
					textarea.style.height = `${height}px`;
				}
			}
		}

		const formLines = document.querySelectorAll('.form__line');
		formLines.forEach(formLine => {
			const formInput = formLine.querySelector('.rs-input')
			const formClear = formLine.querySelector('.rs-input-clear')
			formInput.addEventListener('input', function () {
				if (formInput.value != '') {
					formClear.style.display = "block";
					formInput.closest('.form__line').classList.add('_form-valid')
				} else {
					formClear.style.display = "none";
					formInput.closest('.form__line').classList.remove('_form-valid')
				}
			})
			formClear.addEventListener('click', function () {
				formInput.value = '';
				formClear.style.display = "none";
				formInput.closest('.form__line').classList.remove('_form-valid')
				formInput.focus()
			})
		});
	});

}

// Валидация форм
export let formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll('*[data-required]');
		if (formRequiredItems.length) {
			formRequiredItems.forEach(formRequiredItem => {
				if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.dataset.required === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				this.removeRight(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addRight(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === "tel") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.phoneTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				this.removeRight(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addRight(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			this.removeRight(formRequiredItem);
			error++;
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				this.removeRight(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addRight(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add('_form-error');
		if (formRequiredItem.closest('.form__line')) {
			formRequiredItem.closest('.form__line').classList.add('_form-error');
			let inputError = formRequiredItem.closest('.form__line').querySelector('.form__error');
			if (inputError) formRequiredItem.closest('.form__line').removeChild(inputError);
			if (formRequiredItem.dataset.error) {
				formRequiredItem.closest('.form__line').insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
			}
		}
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove('_form-error');
		if (formRequiredItem.closest('.form__line')) {
			formRequiredItem.closest('.form__line').classList.remove('_form-error');
			if (formRequiredItem.closest('.form__line').querySelector('.form__error')) {
				formRequiredItem.closest('.form__line').removeChild(formRequiredItem.closest('.form__line').querySelector('.form__error'));
			}
		}
	},
	addRight(formRequiredItem) {
		formRequiredItem.classList.add('_form-right');
		if (formRequiredItem.closest('.form__line')) {
			formRequiredItem.closest('.form__line').classList.add('_form-right');
			let inputRight = formRequiredItem.closest('.form__line').querySelector('.form__right');
			if (inputRight) formRequiredItem.closest('.form__line').removeChild(inputRight);
			formRequiredItem.closest('.form__line').insertAdjacentHTML('beforeend', `<div class="form__right"></div>`);
		}
	},
	removeRight(formRequiredItem) {
		formRequiredItem.classList.remove('_form-right');
		if (formRequiredItem.closest('.form__line')) {
			formRequiredItem.closest('.form__line').classList.remove('_form-right');
			if (formRequiredItem.closest('.form__line').querySelector('.form__right')) {
				formRequiredItem.closest('.form__line').removeChild(formRequiredItem.closest('.form__line').querySelector('.form__right'));
			}
		}
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll('input,textarea');
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				if (el.closest('.form__line')) {
					el.closest('.form__line').classList.remove('_form-focus');
				}
				el.classList.remove('_form-focus');
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll('.checkbox__input');
			if (checkboxes.length > 0) {
				for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
				}
			}
			if (vnvModules.select) {
				let selects = form.querySelectorAll('.select');
				if (selects.length) {
					for (let index = 0; index < selects.length; index++) {
						const select = selects[index].querySelector('select');
						vnvModules.select.selectBuild(select);
					}
				}
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	},
	phoneTest(formRequiredItem) {
		return !/^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(formRequiredItem.value);
	}
}
/* Отправка форм */
export function formSubmit() {
	const forms = document.forms;
	if (forms.length) {
		for (const form of forms) {
			form.addEventListener('submit', function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener('reset', function (e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
	}
	async function formSubmitAction(form, e) {
		const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
		if (error === 0) {
			const ajax = form.hasAttribute('data-ajax');
			if (ajax) {
				// Если режим ajax
				e.preventDefault();
				const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
				const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
				const formData = new FormData(form);

				form.classList.add('_sending');
				const response = await fetch(formAction, {
					method: formMethod,
					body: formData
				});
				if (response.ok) {
					let responseResult = await response.json();
					form.classList.remove('_sending');
					formSent(form, responseResult);
				} else {
					alert("Ошибка");
					form.classList.remove('_sending');
				}
			} else if (form.hasAttribute('data-dev')) {	// Если режим разработки
				e.preventDefault();
				formSent(form);
			}
		} else {
			e.preventDefault();
			if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
				const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
				gotoBlock(formGoToErrorClass, true, 1000);
			}
		}
	}
	// Действия после отправки формы
	function formSent(form, responseResult = ``) {
		// Создаем событие отправки формы
		document.dispatchEvent(new CustomEvent("formSent", {
			detail: {
				form: form
			}
		}));
		// Показываем попап, если подключен модуль попапов 
		// и для формы указана настройка
		setTimeout(() => {
			if (vnvModules.popup) {
				const popup = form.dataset.popupMessage;
				popup ? vnvModules.popup.open(popup) : null;
			}
		}, 0);
		// Очищаем форму и убираем активные классы
		formValidate.formClean(form);
		form.classList.remove('_form-valid', '_form-focus');
		const formLines = form.querySelectorAll('.form__line');
		formLines.forEach(line => {
			line.classList.remove('_form-focus', '_form-valid');
		});
		// Сообщаем в консоль
		formLogging(`Форма отправлена!`);
	}
	function formLogging(message) {
		vnv(`[Формы]: ${message}`);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const formsBlock = document.querySelectorAll('.form'); // Получаем форму
	formsBlock.forEach(formBlock => {
		// Получаем все инпуты формы, которые нужно валидировать
		const form = formBlock.querySelector('form'); // Получаем форму
		const formLines = document.querySelectorAll('.form__line');
		const inputs = formBlock.querySelectorAll('.rs-input');

		// Функция добавления/удаления классов при фокусе и анфокусе
		inputs.forEach(input => {
			// При фокусе добавляем класс .wpcf7-focus
			input.addEventListener('focus', function () {
				this.classList.add('wpcf7-focus');
				this.closest('.form__line').classList.add('wpcf7-focus');
			});

			// При анфокусе проверяем заполнено ли поле
			input.addEventListener('blur', function () {
				this.classList.remove('wpcf7-focus');
				this.closest('.form__line').classList.remove('wpcf7-focus');

				// Проверяем, заполнено ли поле, чтобы добавить класс .wpcf7-content
				if (this.value.trim() !== '') {
					this.classList.add('wpcf7-content');
					this.closest('.form__line').classList.add('wpcf7-content');
				} else {
					this.classList.remove('wpcf7-content');
					this.closest('.form__line').classList.remove('wpcf7-content');
				}

				// Проверяем наличие класса .wpcf7-not-valid, который WP добавляет после валидации
				if (this.classList.contains('wpcf7-not-valid')) {
					this.classList.add('wpcf7-not-valid');
					this.closest('.form__line').classList.add('wpcf7-not-valid');
					this.classList.remove('wpcf7-valid');
					this.closest('.form__line').classList.remove('wpcf7-valid');

					// Если был добавлен спан для .wpcf7-valid-tip, удаляем его при ошибке
					const validTip = this.closest('.form__line').querySelector('.wpcf7-valid-tip');
					if (validTip) {
						validTip.remove();
					}
				} else if (this.value.trim() !== '') {
					// Если поле заполнено и валидно, добавляем класс .wpcf7-valid
					this.classList.add('wpcf7-valid');
					this.closest('.form__line').classList.add('wpcf7-valid');
					this.classList.remove('wpcf7-not-valid');
					this.closest('.form__line').classList.remove('wpcf7-not-valid');

					// Проверяем, есть ли уже спан .wpcf7-valid-tip. Если нет, добавляем его
					if (!this.closest('.form__line').querySelector('.wpcf7-valid-tip')) {
						const validTip = document.createElement('span');
						validTip.classList.add('wpcf7-valid-tip');
						this.closest('.form__line').appendChild(validTip);
					}
				} else {
					// Если поле не заполнено или не валидно, убираем классы .wpcf7-valid
					this.classList.remove('wpcf7-valid');
					this.closest('.form__line').classList.remove('wpcf7-valid');

					// Если был добавлен спан для .wpcf7-valid-tip, удаляем его
					const validTip = this.closest('.form__line').querySelector('.wpcf7-valid-tip');
					if (validTip) {
						validTip.remove();
					}
				}
			});
		});

		formLines.forEach(formLine => {
			const formInput = formLine.querySelector('.rs-input')
			const formClear = formLine.querySelector('.rs-input-clear')
			formInput.addEventListener('input', function () {
				if (formInput.value != '') {
					formClear.style.display = "block";
					formInput.closest('.form__line').classList.add('wpcf7-content')
				} else {
					formClear.style.display = "none";
					formInput.closest('.form__line').classList.remove('wpcf7-content')
				}
			})
			formClear.addEventListener('click', function () {
				formInput.value = '';
				formClear.style.display = "none";
				formInput.closest('.form__line').classList.remove('wpcf7-content')
				formInput.focus()
			})
		});

		// Удаление всех классов при отправке формы
		form.addEventListener('submit', function () {
			setTimeout(() => {
				inputs.forEach(input => {
					input.classList.remove('wpcf7-focus', 'wpcf7-content', 'wpcf7-not-valid', 'wpcf7-valid');
					input.closest('.form__line').classList.remove('wpcf7-focus', 'wpcf7-content', 'wpcf7-not-valid', 'wpcf7-valid');

					// Удаление спанов .wpcf7-valid-tip при отправке формы
					const validTip = input.closest('.form__line').querySelector('.wpcf7-valid-tip');
					if (validTip) {
						validTip.remove();
					}
				});

				formLines.forEach(formLine => {
					const formClear = formLine.querySelector('.rs-input-clear')
					formClear.style.display = "none";
				});
			}, 300);
		});
	});
});

/* Модуь формы "колличество" */
export function formQuantity() {
	document.addEventListener("click", function (e) {
		let targetElement = e.target;
		if (targetElement.closest('[data-quantity-plus]') || targetElement.closest('[data-quantity-minus]')) {
			const valueElement = targetElement.closest('[data-quantity]').querySelector('[data-quantity-value]');
			let value = parseInt(valueElement.value);
			if (targetElement.hasAttribute('data-quantity-plus')) {
				value++;
				if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) {
					value = valueElement.dataset.quantityMax;
				}
			} else {
				--value;
				if (+valueElement.dataset.quantityMin) {
					if (+valueElement.dataset.quantityMin > value) {
						value = valueElement.dataset.quantityMin;
					}
				} else if (value < 1) {
					value = 1;
				}
			}
			targetElement.closest('[data-quantity]').querySelector('[data-quantity-value]').value = value;
		}
	});
}
/* Модуь звездного рейтинга */
export function formRating() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}
	// Основная функция
	function initRatings() {
		let ratingActive, ratingValue;
		// "Бегаем" по всем рейтингам на странице
		for (let index = 0; index < ratings.length; index++) {
			const rating = ratings[index];
			initRating(rating);
		}
		// Инициализируем конкретный рейтинг
		function initRating(rating) {
			initRatingVars(rating);

			setRatingActiveWidth();

			if (rating.classList.contains('rating_set')) {
				setRating(rating);
			}
		}
		// Инициализайция переменных
		function initRatingVars(rating) {
			ratingActive = rating.querySelector('.rating__active');
			ratingValue = rating.querySelector('.rating__value');
		}
		// Изменяем ширину активных звезд
		function setRatingActiveWidth(index = ratingValue.innerHTML) {
			const ratingActiveWidth = index / 0.05;
			ratingActive.style.width = `${ratingActiveWidth}%`;
		}
		// Возможность указать оценку 
		function setRating(rating) {
			const ratingItems = rating.querySelectorAll('.rating__item');
			for (let index = 0; index < ratingItems.length; index++) {
				const ratingItem = ratingItems[index];
				ratingItem.addEventListener("mouseenter", function (e) {
					// Обновление переменных
					initRatingVars(rating);
					// Обновление активных звезд
					setRatingActiveWidth(ratingItem.value);
				});
				ratingItem.addEventListener("mouseleave", function (e) {
					// Обновление активных звезд
					setRatingActiveWidth();
				});
				ratingItem.addEventListener("click", function (e) {
					// Обновление переменных
					initRatingVars(rating);

					if (rating.dataset.ajax) {
						// "Отправить" на сервер
						setRatingValue(ratingItem.value, rating);
					} else {
						// Отобразить указанную оцнку
						ratingValue.innerHTML = index + 1;
						setRatingActiveWidth();
					}
				});
			}
		}
		async function setRatingValue(value, rating) {
			if (!rating.classList.contains('rating_sending')) {
				rating.classList.add('rating_sending');

				// Отправика данных (value) на сервер
				let response = await fetch('rating.json', {
					method: 'GET',

					//body: JSON.stringify({
					//	userRating: value
					//}),
					//headers: {
					//	'content-type': 'application/json'
					//}

				});
				if (response.ok) {
					const result = await response.json();

					// Получаем новый рейтинг
					const newRating = result.newRating;

					// Вывод нового среднего результата
					ratingValue.innerHTML = newRating;

					// Обновление активных звезд
					setRatingActiveWidth();

					rating.classList.remove('rating_sending');
				} else {
					alert("Ошибка");

					rating.classList.remove('rating_sending');
				}
			}
		}
	}
}