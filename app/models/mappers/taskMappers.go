package mappers

import (
	"app/app/models/entities"
	. "app/app/supporting"
	"database/sql"
	"time"
)

func TaskGet(idTask int64) (task entities.Task, err error) {
	sqlString := "SELECT idtask, formulation, description, position, theoreticalTimeWork, realtimework, dateexecution, l.idlisttask, namelisttask, l.idproject, nameproject, u.idurgency, nameurgency, s.idstatus, namestatus, e.idemployee, firstname, middlename, lastname FROM task LEFT JOIN listtask l on l.idlisttask = task.idlisttask LEFT JOIN urgency u on u.idurgency = task.idurgency LEFT JOIN status s on s.idstatus = task.idstatus LEFT JOIN employee e on e.idemployee = task.idemployee  LEFT JOIN project p on l.idproject = p.idproject WHERE  idtask = $1 ORDER BY idtask"
	rows, err := DB.Query(sqlString, idTask)

	defer CloseRows(rows)

	if err == nil && rows.Next() {
		return ScanRows(rows)
	}

	return task, err
}

func TaskGetByListTask(idListTask int64) (tasks []entities.Task, err error) {
	sqlString := "SELECT idtask, formulation, description, position, theoreticalTimeWork, realtimework, dateexecution, l.idlisttask, namelisttask, l.idproject, nameproject, u.idurgency, nameurgency, s.idstatus, namestatus, e.idemployee, firstname, middlename, lastname FROM task LEFT JOIN listtask l on l.idlisttask = task.idlisttask LEFT JOIN urgency u on u.idurgency = task.idurgency LEFT JOIN status s on s.idstatus = task.idstatus LEFT JOIN employee e on e.idemployee = task.idemployee  LEFT JOIN project p on l.idproject = p.idproject WHERE  l.idlisttask = $1 ORDER BY idtask"
	rows, err := DB.Query(sqlString, idListTask)

	defer CloseRows(rows)

	var task entities.Task
	for err == nil && rows.Next() {
		task, err = ScanRows(rows)
		if err == nil {
			tasks = append(tasks, task)
		}
	}

	return tasks, err
}

func TaskGetByEmployee(idEmployee int64) (tasks []entities.Task, err error) {
	sqlString := "SELECT idtask, formulation, description, position, theoreticalTimeWork, realtimework, dateexecution, l.idlisttask, namelisttask, l.idproject, nameproject, u.idurgency, nameurgency, s.idstatus, namestatus, e.idemployee, firstname, middlename, lastname FROM task LEFT JOIN listtask l on l.idlisttask = task.idlisttask LEFT JOIN urgency u on u.idurgency = task.idurgency LEFT JOIN status s on s.idstatus = task.idstatus LEFT JOIN employee e on e.idemployee = task.idemployee  LEFT JOIN project p on l.idproject = p.idproject WHERE  e.idemployee = $1 ORDER BY position"
	rows, err := DB.Query(sqlString, idEmployee)

	defer CloseRows(rows)

	var task entities.Task
	for err == nil && rows.Next() {
		task, err = ScanRows(rows)
		if err == nil {
			tasks = append(tasks, task)
		}
	}

	return tasks, err
}

func TaskGetByEmployeeAndDate(idEmployee int64, date time.Time) (tasks []entities.Task, err error) {
	timeBefore := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, time.Local)
	timeAfter := time.Date(date.Year(), date.Month(), date.Day(), 23, 59, 59, 0, time.Local)

	sqlString := "SELECT idtask, formulation, description, position, theoreticalTimeWork, realtimework, dateexecution, l.idlisttask, namelisttask, l.idproject, nameproject, u.idurgency, nameurgency, s.idstatus, namestatus, e.idemployee, firstname, middlename, lastname FROM task LEFT JOIN listtask l on l.idlisttask = task.idlisttask LEFT JOIN urgency u on u.idurgency = task.idurgency LEFT JOIN status s on s.idstatus = task.idstatus LEFT JOIN employee e on e.idemployee = task.idemployee  LEFT JOIN project p on l.idproject = p.idproject WHERE  e.idemployee = $1 and dateexecution between $2 AND $3 ORDER BY position"
	rows, err := DB.Query(sqlString, idEmployee, timeBefore, timeAfter)

	defer CloseRows(rows)

	var task entities.Task
	for err == nil && rows.Next() {
		task, err = ScanRows(rows)
		if err == nil {
			tasks = append(tasks, task)
		}

	}

	return tasks, err
}

func TaskGetByEmployeeAndActiveTask(idEmployee int64) (tasks []entities.Task, err error) {
	sqlString := "SELECT idtask, formulation, description, position, theoreticalTimeWork, realtimework, dateexecution, l.idlisttask, namelisttask, l.idproject, nameproject, u.idurgency, nameurgency, s.idstatus, namestatus, e.idemployee, firstname, middlename, lastname FROM task LEFT JOIN listtask l on l.idlisttask = task.idlisttask LEFT JOIN urgency u on u.idurgency = task.idurgency LEFT JOIN status s on s.idstatus = task.idstatus LEFT JOIN employee e on e.idemployee = task.idemployee  LEFT JOIN project p on l.idproject = p.idproject WHERE  e.idemployee = $1 AND s.idstatus != 4 ORDER BY dateexecution, position"
	rows, err := DB.Query(sqlString, idEmployee)

	defer CloseRows(rows)

	var task entities.Task
	for err == nil && rows.Next() {
		task, err = ScanRows(rows)
		if err == nil {
			tasks = append(tasks, task)
		}
	}

	return tasks, err
}

func ScanRows(rows *sql.Rows) (task entities.Task, err error) {
	var listTask entities.ListTask
	var urgency entities.Urgency
	var status entities.Status
	var idEmployee sql.NullInt64
	var firstName sql.NullString
	var middleName sql.NullString
	var lastName sql.NullString

	err = rows.Scan(
		&task.IdTask, &task.Formulation, &task.Description, &task.Position,
		&task.TheoreticalTimeWork, &task.RealTimeWork, &task.DateExecution,
		&listTask.IdListTask, &listTask.NameListTask,
		&listTask.Project.IdProject, &listTask.Project.NameProject,
		&urgency.IdUrgency, &urgency.NameUrgency,
		&status.IdStatus, &status.NameStatus,
		&idEmployee, &firstName, &middleName, &lastName)

	if err == nil {
		task.ListTask = listTask
		task.Urgency = urgency
		task.Status = status
		task.Employee = entities.Employee{
			IdEmployee: idEmployee.Int64,
			FirstName:  firstName.String,
			MiddleName: middleName.String,
			LastName:   lastName.String,
		}
	}
	return task, err
}

func TaskSave(task entities.Task) (err error) {
	if task.Employee.IdEmployee == 0 {
		sqlString := `INSERT INTO task (formulation, description, theoreticaltimework, idlisttask, idurgency, idStatus, idemployee) VALUES ($1, $2, $3, $4, $5, $6, NULL);`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork,
			task.ListTask.IdListTask, task.Urgency.IdUrgency, task.Status.IdStatus)
	} else {
		sqlString := `INSERT INTO task (formulation, description, theoreticaltimework, idlisttask, idurgency, idStatus, idemployee) VALUES ($1, $2, $3, $4, $5, $6, $7);`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork,
			task.ListTask.IdListTask, task.Urgency.IdUrgency, task.Status.IdStatus, task.Employee.IdEmployee)
	}
	return err
}

func TaskUpdate(task entities.Task) (err error) {
	if task.Employee.IdEmployee == 0 {
		sqlString := `UPDATE task SET formulation = $1, description = $2,theoreticaltimework = $3, realtimework = $4, 
                	 idurgency  = $5, idStatus = $6, idemployee  = NULL WHERE idtask = $7;`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork, task.RealTimeWork,
			task.Urgency.IdUrgency, task.Status.IdStatus, task.IdTask)
	} else if task.Employee.IdEmployee == -1 {
		sqlString := `UPDATE task SET formulation = $1, description = $2,theoreticaltimework = $3, realtimework = $4, 
                	 idurgency  = $5, idStatus = $6 WHERE idtask = $7;`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork, task.RealTimeWork,
			task.Urgency.IdUrgency, task.Status.IdStatus, task.IdTask)
	} else {
		sqlString := `UPDATE task SET formulation = $1, description = $2, theoreticaltimework = $3, realtimework = $4, 
                	 idurgency  = $5, idStatus = $6, idemployee  = $7, position = $8, dateexecution = $9 WHERE idtask = $10;`
		_, err = DB.Exec(sqlString, task.Formulation, task.Description, task.TheoreticalTimeWork, task.RealTimeWork,
			task.Urgency.IdUrgency, task.Status.IdStatus, task.Employee.IdEmployee, task.Position, task.DateExecution, task.IdTask)
	}
	return err
}

func TaskDelete(task entities.Task) error {
	sqlString := `DELETE FROM task WHERE idtask = $1`
	_, err := DB.Exec(sqlString, task.IdTask)
	return err
}
