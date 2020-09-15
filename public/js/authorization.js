import {employeeData} from "./data/employeeData.js";
import {drawMainPage} from "./mainPage.js";

let drawAuthorization = function(){
    webix.ui({
        id : "mainPage",
        rows:[
            {},
            {
                cols:[
                    {},
                    {
                        rows:[
                            {
                                view:"label",
                                label: "Добро пожаловать в Task Manager!",
                                align:"center"
                            },
                            {
                                id : "logIn",
                                view:"form",
                                scroll:false,
                                width: 400,
                                elements:[
                                    {
                                        name : "login",
                                        view:"text",
                                        label:"Login:"
                                    },
                                    {
                                        name : "password",
                                        view:"text",
                                        type:"password",
                                        label:"Password"
                                    },
                                    {
                                        margin:5,
                                        cols:[
                                            {
                                                view:"button",
                                                label:"Войти" ,
                                                type:"form",
                                                click : clickCheckLoginAndPassword
                                            },
                                        ]
                                    }
                                ],
                                rules:{
                                    login: webix.rules.isNotEmpty,
                                }
                            },
                        ]
                    },
                    {}
                ]
            },
            {},
        ]
    });
}
webix.ready(drawAuthorization);

function clickCheckLoginAndPassword(){
    if(!$$("logIn").validate()){
        webix.message({
            text:"Логин не должен быть пустым!",
            type:"error",
            expire: 2000,
        })
        return
    }

    employeeData.getByLoginAndPassword($$("logIn").getValues())
        .then(response => {
            if(response.data.idEmployee > 0){
                drawMainPage()
            } else if(!response.error){
                webix.message({
                    text:"Неверный логин или пароль.",
                    type:"error",
                    expire: 2000,
                })
            }
        })
}