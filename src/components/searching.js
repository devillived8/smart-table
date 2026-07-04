import {rules, createComparison, defaultRules} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    
    // Создаём компаратор с правилом поиска по нескольким полям
    const compare = createComparison(
        defaultRules, // базовые правила
        [
            rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
        ]
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        
        if (!data) {
            return [];
        }
        
        if (!state) {
            return data;
        }
        
        const searchValue = state[searchField];
        
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        // Создаём объект ТОЛЬКО с полем поиска для компаратора
        const searchState = {
            [searchField]: searchValue.trim()
        };
        
        return data.filter(row => compare(row, searchState));
    };
}