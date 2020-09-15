package providers

import (
	"app/app/models/entities"
	"app/app/models/mappers"
	. "app/app/supporting"
)

func EmployeeAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	employeeAll, err := mappers.EmployeeAllGet()
	data["error"] = ErrorInDatabase(err)
	data["data"] = employeeAll
	return data
}

func EmployeeGet(idEmployee int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.EmployeeGet(idEmployee)
	data["error"] = ErrorInDatabase(err)
	data["data"] = employee
	return data
}

func EmployeeGetByProjectTeam(idProjectTeam int64) map[string]interface{} {
	data := make(map[string]interface{})
	employee, err := mappers.EmployeeGetByProjectTeam(idProjectTeam)
	data["error"] = ErrorInDatabase(err)
	data["data"] = employee
	return data
}

func EmployeeGetByLoginAndPassword(employee entities.Employee, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		employee, err = mappers.EmployeeGetByLoginAndPassword(employee)
		data["error"] = ErrorInDatabase(err)
		data["data"] = employee
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func EmployeeSave(employee entities.Employee, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.EmployeeSave(employee))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func EmployeeUpdate(employee entities.Employee, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.EmployeeUpdate(employee))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}

func EmployeeDelete(employee entities.Employee, err error) map[string]interface{} {
	data := make(map[string]interface{})
	if err == nil {
		data["error"] = ErrorInDatabase(mappers.EmployeeDelete(employee))
	} else {
		data["error"] = ErrorInGetDataFromUser(err)
	}
	return data
}
