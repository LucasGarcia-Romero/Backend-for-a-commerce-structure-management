const {IncomingWebhook} = require("@slack/webhook")
const webHook = new IncomingWebhook(process.env.SLACK_WEBHOOK)          
// Conecta la aplicación con el webhook de Slack usando la URL almacenada en la variable de entorno SLACK_WEBHOOK.

const loggerStream = {
    write: message => {
    webHook.send({
        text: message
        })
    },
}
// Define un objeto loggerStream con un método write que envía un mensaje al Slack. 
// Cada vez que se llame a write, se enviará una notificación a Slack con el contenido del mensaje.

module.exports = loggerStream
