import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {

    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    const compare = createComparison(defaultRules);

    return (data, state, action) => {

        if (action?.name === "clear") {
            const input = action.parentElement.querySelector("input, select");

            if (input) {
                input.value = "";
                state[action.dataset.field] = "";
                input.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }

        return data.filter(row => {

            // Сначала обычные фильтры
            if (!compare(row, state)) {
                return false;
            }

            // Затем диапазон суммы

            if (state.totalFrom !== "" &&
                Number(row.total) < Number(state.totalFrom)) {
                return false;
            }

            if (state.totalTo !== "" &&
                Number(row.total) > Number(state.totalTo)) {
                return false;
            }

            return true;
        });
    };
}