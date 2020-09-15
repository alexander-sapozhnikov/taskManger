package controllers

import (
	"app/app/models/entities"
	"app/app/models/providers"
	"time"

	"github.com/revel/revel"
)

func (c App) TaskGet(idTask int64) revel.Result {
	return c.RenderJSON(providers.TaskGet(idTask))
}

func (c App) TaskGetByListTask(idListTask int64) revel.Result {
	return c.RenderJSON(providers.TaskGetByListTask(idListTask))
}

func (c App) TaskGetByEmployee(idEmployee int64) revel.Result {
	return c.RenderJSON(providers.TaskGetByEmployee(idEmployee))
}

func (c App) TaskGetByEmployeeAndDate(idEmployee int64) revel.Result {
	format := "Mon Jan 02 2006 15:04:05 GMT+0400"
	minLen := len(c.Params.Get("date"))
	if minLen > len(format) {
		minLen = len(format)
	}
	parseTime, err := time.Parse(format, c.Params.Get("date")[0:minLen])
	return c.RenderJSON(providers.TaskGetByEmployeeAndDate(idEmployee, parseTime, err))
}

func (c App) TaskGetByEmployeeAndActiveTask(idEmployee int64) revel.Result {
	return c.RenderJSON(providers.TaskGetByEmployeeAndActiveTask(idEmployee))
}

func (c App) TaskSave() revel.Result {
	var task entities.Task
	err := c.Params.BindJSON(&task)
	return c.RenderJSON(providers.TaskSave(task, err))
}

func (c App) TaskUpdate() revel.Result {
	var task entities.Task
	err := c.Params.BindJSON(&task)
	return c.RenderJSON(providers.TaskUpdate(task, err))
}

func (c App) TaskDelete() revel.Result {
	var task entities.Task
	err := c.Params.BindJSON(&task)
	return c.RenderJSON(providers.TaskDelete(task, err))
}
