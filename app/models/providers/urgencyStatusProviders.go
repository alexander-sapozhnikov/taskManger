package providers

import (
	"app/app/models/mappers"
	. "app/app/supporting"
)

func UrgencyAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	urgencyAll, err := mappers.UrgencyAllGet()
	data["error"] = ErrorInDatabase(err)
	data["data"] = urgencyAll
	return data
}

func StatusAllGet() map[string]interface{} {
	data := make(map[string]interface{})
	statusAll, err := mappers.StatusAllGet()
	data["error"] = ErrorInDatabase(err)
	data["data"] = statusAll
	return data
}
