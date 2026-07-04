import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    
    // Создаём компаратор с правилами для поиска
    // Используем skipEmptyTargetValues и searchMultipleFields
    const compare = createComparison({
        skipEmptyTargetValues: true,
        searchMultipleFields: rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    });

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        
        // Если нет данных или нет состояния — возвращаем всё
        if (!data || !state) {
            return data;
        }
        
        // Получаем значение поиска из state
        const searchValue = state[searchField];
        
        // Если поиск пустой — возвращаем все данные
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        // Применяем компаратор для фильтрации данных
        return data.filter(row => compare(row, state));
    }
}