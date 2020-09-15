package providers

import (
	"app/app/models/entities"
	"app/app/models/mappers"
	. "app/app/supporting"
	"time"
)

func TaskGet(idTask int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.TaskGet(idTask)
	data["error"] = ErrorInDatabase(err)
	data["data"] = employee
	return data
}

func TaskGetByListTask(idListTask int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.TaskGetByListTask(idListTask)
	data["error"] = ErrorInDatabase(err)
	data["data"] = employee
	return data
}

func TaskGetByEmployee(idEmployee int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.TaskGetByEmployee(idEmployee)
	data["error"] = ErrorInDatabase(err)
	data["data"] = employee
	return data
}

func TaskGetByEmployeeAndDate(idEmployee int64, date time.Time, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		employee, err := mappers.TaskGetByEmployeeAndDate(idEmployee, date)
		data["error"] = ErrorInDatabase(err)
		data["data"] = employee
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func TaskGetByEmployeeAndActiveTask(idEmployee int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.TaskGetByEmployeeAndActiveTask(idEmployee)
	data["error"] = ErrorInDatabase(err)
	data["data"] = employee
	return data
}


func TaskSave(task entities.Task, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.TaskSave(task))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func TaskUpdate(task entities.Task, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.TaskUpdate(task))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func TaskDelete(task entities.Task, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.TaskDelete(task))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}
