import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
if (before && Array.isArray(before)) {
    before.reverse().forEach(subName => {
      root[subName] = cloneTemplate(subName);
      root.container.prepend(root[subName].container);
    });
  }


  if (after && Array.isArray(after)) {
    after.forEach(subName => {
      root[subName] = cloneTemplate(subName);
      root.container.append(root[subName].container);
    });
  }


  // @todo: #1.3 —  обработать события и вызвать onAction()
root.container.addEventListener('change', ()=>{
  onAction();
})

root.container.addEventListener('reset', ()=>{
  setTimeout(()=> {
    onAction()
  });
})

root.container.addEventListener('submit', (e)=>{
  e.preventDefault();
  onAction(e.submitter);
})




const render = (data) => {
    console.log('Данные для отображения:', data); // ← посмотрите данные
    
    const nextRows = data.map(item => {
        const row = cloneTemplate(rowTemplate);
        
        console.log('Доступные элементы в row:', Object.keys(row.elements)); 
        // ↑ Посмотрите, какие ключи есть в шаблоне
        
        Object.keys(item).forEach(key => {
            console.log(`Пытаемся найти ключ "${key}" в row.elements:`, row.elements[key] ? '✅ Найден' : '❌ Не найден');
            
            if (row.elements[key]) {
                console.log(`Устанавливаем значение "${item[key]}" для элемента с ключом "${key}"`);
                row.elements[key].textContent = item[key];
            } else {
                console.warn(`Ключ "${key}" не найден в шаблоне!`);
            }
        });
        
        return row.container;
    });
    root.elements.rows.replaceChildren(...nextRows);
};

  return { ...root, render };
}
