import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // #4.1 Заполняем select
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map((name) => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    // #4.3 Настраиваем компаратор
    const compare = createComparison(defaultRules);

    return (data, state, action) => {

        // #4.2 Очистка поля
        if (action?.name === "clear") {
            const input = action.parentElement.querySelector("input, select");

            if (input) {
                input.value = "";

                const field = action.dataset.field;
                state[field] = "";

                input.dispatchEvent(new Event("change", {
                    bubbles: true
                }));
            }
        }

        // #4.5 Фильтрация
        return data.filter(row => compare(row, state));
    };
}