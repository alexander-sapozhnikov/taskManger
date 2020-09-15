import {informAboutErrorWithWorkData, informAboutSuccess} from "./helpFunction.js";

class DataUsualAction{

    getSomething(url){
        return fetch(url)
            .catch(error => informAboutErrorWithWorkData(error))
            .then(response =>  {
                if (!response.ok){
                    informAboutErrorWithWorkData(response, "Попробуйте ещё раз или перезагрузите страницу.")
                } else return  response})
            .then(response =>  response.json())
            .then(response => {
                if (response.error) {
                    informAboutErrorWithWorkData(response)
                } else return response
            })
    }

    remove(item, URL){
        fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)})
            .catch(error => {informAboutErrorWithWorkData(error)})
            .then(response => {
                if (!response.ok || response.error) informAboutErrorWithWorkData(response, "Удаления не произошло.")
                else informAboutSuccess("Успешно удаленно!")})
    }


    save(item, URL){
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)})
            .catch(error => {informAboutErrorWithWorkData(error)})
            .then(response => {
                if (!response.ok || response.error) informAboutErrorWithWorkData(response, "Добавление не произошло.")
                else informAboutSuccess("Успешно добавлено!")})
    }


    update(item, URL){
        fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)})
            .catch(error => {informAboutErrorWithWorkData(error)})
            .then(response => {
                if (!response.ok || response.error) informAboutErrorWithWorkData(response, "Обвновление не произошло.")
                // else informAboutSuccess("Успешно изменено!")
                })
    }
}

let dataUsualAction = new DataUsualAction()

export {dataUsualAction}