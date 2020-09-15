package supporting

import (
	"database/sql"
	"log"
)

func ErrorInGetDataFromUser(err error) string {
	log.Println(err.Error())
	return "Поступили некорректные данные."
}
func ErrorInDatabase(err error) interface{} {
	if err != nil {
	log.Println(err.Error())
	return "Ошибка при обработке данных."
	}
	return nil
}


func CloseRows(rows *sql.Rows){
	if rows != nil {
		err := rows.Close()
		if err != nil {
			log.Println(err.Error())
		}
	}
}
