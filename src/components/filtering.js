import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    
    Object.keys(indexes).forEach((elementName) => {
        // Очищаем элемент перед добавлением опций
        elements[elementName].innerHTML = '';
        
        // Добавляем пустую опцию (показать всё)
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Все';
        elements[elementName].append(emptyOption);
        
        // Добавляем опции из индекса
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input, select');
            
            if (input) {
                input.value = '';
                const fieldName = action.dataset.field;
                if (fieldName && state[fieldName] !== undefined) {
                    state[fieldName] = '';
                }
                // Триггерим событие change для обновления
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        
        // Если нет данных — возвращаем пустой массив
        if (!data) {
            return [];
        }
        
        // Если нет состояния — возвращаем все данные
        if (!state) {
            return data;
        }
        
        // Создаём объект фильтров, исключая служебные поля и пустые значения
        const filters = {};
        const skipFields = ['rowsPerPage', 'page', 'search'];
        
        Object.keys(state).forEach(key => {
            // Пропускаем служебные поля
            if (skipFields.includes(key)) {
                return;
            }
            
            const value = state[key];
            // Добавляем только непустые значения
            if (value !== '' && value !== null && value !== undefined) {
                filters[key] = value;
            }
        });
        
        // Если нет активных фильтров — возвращаем все данные
        if (Object.keys(filters).length === 0) {
            return data;
        }
        
        // Фильтруем данные с помощью компаратора
        return data.filter(row => compare(row, filters));
    }
}