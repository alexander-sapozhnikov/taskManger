package mappers

import (
	"app/app/models/entities"
	"app/app/supporting"
)

func UrgencyAllGet() (urgencies []entities.Urgency, err error) {
	sqlString := "SELECT * FROM urgency"
	rows, err := supporting.DB.Query(sqlString)
	if err == nil {
		for rows.Next() {
			var urgency entities.Urgency
			err = rows.Scan(&urgency.IdUrgency, &urgency.NameUrgency)
			if err == nil {
				urgencies = append(urgencies, urgency)
			}
		}
	}

	return urgencies, err
}

func StatusAllGet() (statuses []entities.Status, err error) {
	sqlString := "SELECT * FROM status"
	rows, err := supporting.DB.Query(sqlString)
	if err == nil {
		for rows.Next() {
			var status entities.Status
			err = rows.Scan(&status.IdStatus, &status.NameStatus)
			if err == nil {
				statuses = append(statuses, status)
			}
		}
	}
	return statuses, err
}
