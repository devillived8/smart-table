import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    
    // Создаём компаратор с правилами для поиска
    const compare = createComparison({
        skipEmptyTargetValues: true,
        searchMultipleFields: rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    });

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        
        // Если нет данных — возвращаем пустой массив
        if (!data) {
            return [];
        }
        
        // Если нет состояния — возвращаем все данные
        if (!state) {
            return data;
        }
        
        // Получаем значение поиска из state
        const searchValue = state[searchField];
        
        // Если поиск пустой — возвращаем все данные
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        // Создаём объект ТОЛЬКО с полем поиска для компаратора
        const searchState = {
            [searchField]: searchValue.trim()
        };
        
        // Применяем компаратор для фильтрации данных
        return data.filter(row => compare(row, searchState));
    }
}