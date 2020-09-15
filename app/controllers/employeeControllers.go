package controllers

import (
	"app/app/models/entities"
	"app/app/models/providers"
	"github.com/revel/revel"
)

func (c App) EmployeeAllGet() revel.Result {
	return c.RenderJSON(providers.EmployeeAllGet())
}

func (c App) EmployeeGet(idEmployee int64) revel.Result {
	return c.RenderJSON(providers.EmployeeGet(idEmployee))
}

func (c App) EmployeeGetByProjectTeam(idProjectTeam int64) revel.Result {
	return c.RenderJSON(providers.EmployeeGetByProjectTeam(idProjectTeam))
}

func (c App) EmployeeGetByLoginAndPassword() revel.Result {
	var employee entities.Employee
	err := c.Params.BindJSON(&employee)
	return c.RenderJSON(providers.EmployeeGetByLoginAndPassword(employee, err))
}

func (c App) EmployeeSave() revel.Result {
	var employee entities.Employee
	err := c.Params.BindJSON(&employee)
	return c.RenderJSON(providers.EmployeeSave(employee, err))
}
func (c App) EmployeeUpdate() revel.Result {
	var employee entities.Employee
	err := c.Params.BindJSON(&employee)
	return c.RenderJSON(providers.EmployeeUpdate(employee, err))
}

func (c App) EmployeeDelete() revel.Result {
	var employee entities.Employee
	err := c.Params.BindJSON(&employee)
	return c.RenderJSON(providers.EmployeeDelete(employee, err))
}
