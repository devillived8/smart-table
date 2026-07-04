import {createComparison, defaultRules, rules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

// Расширяем правила для поддержки числовых диапазонов
// defaultRules - это массив имён правил из compare.js
const customRules = [
    // Добавляем правило для поиска по нескольким полям
    // Оно будет применяться к полю 'search'
    rules.searchMultipleFields('search', ['date', 'customer', 'seller'], false),
    
    // Добавляем правило для диапазона чисел (totalFrom, totalTo)
    // arrayAsRange обрабатывает массивы [from, to]
    rules.arrayAsRange(),
    
    // Добавляем правило для поиска по продавцу (точное совпадение)
    // Для поля searchBySeller используем caseInsensitiveStringIncludes
    (key, sourceValue, targetValue, source, target) => {
        if (key === 'searchBySeller' && !isEmpty(targetValue)) {
            const sourceStr = String(sourceValue).toLowerCase();
            const targetStr = String(targetValue).toLowerCase();
            return { result: sourceStr.includes(targetStr) };
        }
        return { continue: true };
    },
    
    // Добавляем правило для totalFrom (больше или равно)
    (key, sourceValue, targetValue, source, target) => {
        if (key === 'totalFrom' && !isEmpty(targetValue)) {
            const rowNum = parseFloat(sourceValue);
            const filterNum = parseFloat(targetValue);
            if (rowNum < filterNum) {
                return { result: false };
            }
            return { result: true };
        }
        return { continue: true };
    },
    
    // Добавляем правило для totalTo (меньше или равно)
    (key, sourceValue, targetValue, source, target) => {
        if (key === 'totalTo' && !isEmpty(targetValue)) {
            const rowNum = parseFloat(sourceValue);
            const filterNum = parseFloat(targetValue);
            if (rowNum > filterNum) {
                return { result: false };
            }
            return { result: true };
        }
        return { continue: true };
    }
];

// Создаём компаратор с расширенными правилами
const compare = createComparison(
    defaultRules, // базовые правила
    customRules   // дополнительные правила
);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
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
        }
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
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        
        if (!data) {
            return [];
        }
        
        if (!state) {
            return data;
        }
        
        // Создаём объект фильтров, исключая служебные поля и пустые значения
        const filters = {};
        const skipFields = ['rowsPerPage', 'page'];
        
        Object.keys(state).forEach(key => {
            if (skipFields.includes(key)) {
                return;
            }
            
            const value = state[key];
            // Добавляем только непустые значения
            if (value !== '' && value !== null && value !== undefined) {
                filters[key] = value;
            }
        });
        
        if (Object.keys(filters).length === 0) {
            return data;
        }
        
        // Фильтруем данные с помощью компаратора
        return data.filter(row => compare(row, filters));
    };
}