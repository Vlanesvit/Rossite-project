// Подключение функционала "Чертогов Фрилансера"
import { isMobile, vnv } from "./functions.js";
// Подключение списка активных модулей
import { vnvModules } from "./modules.js";

// Подключение из node_modules
import tippy from 'tippy.js';

// Подключение cтилей из src/scss/libs
import "../../scss/libs/tippy.scss";
// Подключение cтилей из node_modules
//import 'tippy.js/dist/tippy.css';

// Запускаем и добавляем в объект модулей
vnvModules.tippy = tippy('[data-tippy-content]', {

});