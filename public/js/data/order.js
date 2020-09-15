export class Order{
    constructor(float, typeHeader, typeBody) {
        this.float = float;
        this.typeHeader = typeHeader;
        this.dataHeader = {};
        this.typeBody = typeBody;
        this.dataBody = {};
    }
}

// order.dataHeader.headerTitle текстовое значение для имени в заголовке таблицы 
// order.dataHeader.innerHeaderTitle текстовое значение header внутри блоков

// order.dataBody.state в каком состояние тело (stateProject, stateProjectTeam, stateEmployee) (пока только для формы)
// order.dataBody.form тип формы редактирование, удаление (по уомлчанию создание)
// order.dataBody.data информация по нужномум обьекту или из поиска
// для обновления
// order.dataBody.objActive обьект откуда пришли данные
// order.dataBody.dataBase скакой бд работаем (ПЕРЕДАЕМ ИМЯ БД!!!!)
// order.dataBody.idInDataBase - id изменяемого элемента
// Опа! Костыль для обнволения страницы
// order.dataBody.oldOrder
// order.dataBody.helpFunction - вспомагательная функция она может либо обновлять часть страницы либо делать какие-то дествия