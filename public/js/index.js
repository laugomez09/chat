//Inicializo Socket del lado del Cliente
const socket = io();

let user = "";
let chatBox = document.querySelector("#chatBox");
let messagesLogs = document.querySelector("#messagesLogs");
let title = document.querySelector("#title")

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el Chat",
    inputValidator: (value) => {
        return !value && "¡Necesitas identificarte para continuar!";
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    let titleInteractivo = `¡Hola ${user}! Te invito a charlar en mi chat`
    if (user != "") {
        title.innerHTML = titleInteractivo
    }
    console.log(`Tu nombre de usuario es ${user}`);

    socket.emit("userConnect", user);
});

let titleInteractivo = `¡Hola ${user}! Bienvenidos al CoderChat Comunitario`
if (user != "") {
    title.innerHTML = titleInteractivo
}

chatBox.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        if (chatBox.value.trim().length > 0) {
            console.log(`Mensaje: ${chatBox.value}`);

            socket.emit("message", {
                user,
                message: chatBox.value
            });

            chatBox.value = "";
        }
    }
});

socket.on("messagesLogs", data => {
    let messages = "";

    data.forEach(chat => {
        messages += `<h3>${chat.user}:</h3>${chat.message} </br>`;
    });

    messagesLogs.innerHTML = messages;
});

socket.on("newUser", data => {
    Swal.fire({
        text: `${data} se ha unido al chat`,
        toast: true,
        position: "top-right"
    })
})