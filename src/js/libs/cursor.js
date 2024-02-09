
/* ====================================
Функции инициализация кастомный курсор в блоке
==================================== */
export const addCursorHover = (hoveredElement, selectedElement, newClass) => {
	if (document.querySelector(hoveredElement) && document.querySelector(selectedElement)) {
		document.querySelectorAll(hoveredElement).forEach(hover => {
			hover.addEventListener('mouseenter', function () {
				document.querySelector(selectedElement).classList.add(newClass)
				hover.classList.add('_mouse-event')
			})

			hover.addEventListener('mouseleave', function () {
				document.querySelector(selectedElement).classList.remove(newClass)
				hover.classList.remove('_mouse-event')
			})

			hover.addEventListener('mousemove', function () {
				document.querySelector(selectedElement).classList.add(newClass)
			})
		});
	}
}
export const addCursorDrag = (hoveredElement, selectedElement, newClass) => {
	if (document.querySelector(hoveredElement) && document.querySelector(selectedElement)) {
		document.querySelectorAll(hoveredElement).forEach(hover => {
			hover.addEventListener('mousedown', function () {
				document.querySelector(selectedElement).classList.add(newClass)
			})
		});
		document.body.addEventListener('mouseup', function () {
			document.querySelector(selectedElement).classList.remove(newClass)
		})
	}
}
export const addCursorMove = (hoveredElement, selectedElement) => {
	if (document.querySelector(hoveredElement) && document.querySelector(selectedElement)) {
		document.body.addEventListener('mousemove', function (e) {
			if (document.querySelector(hoveredElement) && document.querySelector(selectedElement)) {
				document.querySelector(selectedElement).style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
			}
		});
	}
}