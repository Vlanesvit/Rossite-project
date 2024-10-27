
/*
Документация: https://image-compare-viewer.netlify.app/
*/
// Подключаем из node_modules
import 'image-compare-viewer/dist/image-compare-viewer.min.css';
import ImageCompareViewer from 'image-compare-viewer';
import { addCursorHover, addCursorMove, addCursorDrag } from "../libs/cursor.js";

// Инициализация сравнения картинок
export function initComparison(id) {
	const comparison = document.getElementById(id);
	if (comparison) {
		const comparisonViewer = new ImageCompareViewer(comparison, {
			// UI Theme Defaults
			controlColor: "#FFFFFF",
			controlShadow: false,
			addCircle: true,
			addCircleBlur: false,

			// Label Defaults
			showLabels: false,
			labelOptions: {
				before: 'Before',
				after: 'After',
				onHover: false
			},

			// Smoothing
			smoothing: true,
			smoothingAmount: 300,

			// Other options
			hoverStart: true,
			verticalMode: false,
			startingPoint: 46.2,
			fluidMode: true,
		}).mount();
	}
}

// Функция для уничтожения сравнения изображений
export function destroyComparison(id) {
	const comparison = document.getElementById(id);
	if (comparison && comparison.__imageCompare) {
		comparison.__imageCompare.destroy(); // Предполагается, что ImageCompare экземпляры могут иметь этот метод
	}
}

// Инициализация на странице
initComparison('image-compare');

// Инициализация курсора
addCursorHover(".rs-comparison__compare", ".rs-comparison .icv__circle", "cursor__active");
addCursorMove(".rs-comparison__compare", ".icv__circle")
