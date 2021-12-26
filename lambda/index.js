/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Bienvenido a la prueba del laberinto. Prepara un desafío.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

let CurrentWorld = null;
let tryagain = false;
let player_pointer_x = 0;
let player_pointer_y = 0;
let end_x, end_y;
let player_orientation = 'E';
let player_position_package = { player_pointer_x, player_pointer_y, player_orientation };
let worldmodule = require ("./world.js");
let playermodule = require ("./player.js");

let checkpoint_wrapper = [];

let inventory_wrapper = [];


const NewWorldIntentHandler = {

    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NewWorldIntent';
    },
    handle(handlerInput) {
        if (CurrentWorld !== null && tryagain == false){
            const speakOutput = 'Ya existe un mundo, si quieres reiniciar di reinicia mundo, si quieres crear uno nuevo vuelve a decir crea mundo';
            tryagain = true;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        if (tryagain){
            player_position_package = { player_pointer_x, player_pointer_y, player_orientation };
            checkpoint_wrapper = [];
            inventory_wrapper = [];
        }
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Size.value;
        let count = 0;
        let countobstacle = 0;
        switch (AnswerValue){
            case 'pequeño':
                CurrentWorld = worldmodule.World(4,4);
                end_x = 4-1;
                end_y = 4-1;
                break;

            case 'mediano':
                CurrentWorld = worldmodule.World(6,6);
                end_x = 6-1;
                end_y = 6-1;
                break;

            case 'grande':
                CurrentWorld = worldmodule.World(8,8);
                end_x = 8-1;
                end_y = 8-1;
                break;

            default:
                const speakOutput = 'Tamaño de mundo no soportado, prueba con pequeño, mediano y grande';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
                break;
        }
        for (let n = 0; n < CurrentWorld.length; n++) {
            for (let m = 0; m < CurrentWorld[n].length; m++) {
                count++;
                if (CurrentWorld[n][m] == 'X'){
                    countobstacle++;
                }
            }
        }
        let contador = count.toString();
        //let speakOutput = 'Creando ' + AnswerValue + ' con ' + contador + ' casillas' + ' y obstaculos ' + countobstacle;
        let speakOutput = "Entras en el laberinto";
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        speakOutput += "." + " A tu derecha tienes un" + worldmodule.SymbolToString(right) + " delante un" + worldmodule.SymbolToString(front) + " a tu izquierda un" + worldmodule.SymbolToString(left) + " y detras la entrada";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const AnswerDirectionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerDirectionsIntent';
    },
    handle(handlerInput) {
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Direction.value;
        if (CurrentWorld == null){
            let speakOutput = "No existe laberinto, crea uno antes de empezar diciendo crea mundo pequeño, mediano o grande";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        let speakOutput = 'Te mueves ' + AnswerValue;
        let direction_wrapper = worldmodule.ManageDirection(AnswerValue,CurrentWorld,player_position_package);
        CurrentWorld = direction_wrapper[0];
        player_position_package = direction_wrapper[1];
        if (player_position_package.player_pointer_x == end_x && player_position_package.player_pointer_y == end_y){
            speakOutput = "¡Felicidades has llegado a la meta! El laberinto se va a autodestruir.";
            CurrentWorld = null;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        //speakOutput += ' X:'+ player_position_package.player_pointer_x.toString() + ' Y:' + player_position_package.player_pointer_y.toString() + ' Orientacion: ' + player_position_package.player_orientation.toString();
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        if (CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y] == 'H'){
            speakOutput += "." + "Te encuentras encima de un objeto"
        }
        speakOutput += "." + "A tu derecha tienes un" + worldmodule.SymbolToString(right) + " delante un" + worldmodule.SymbolToString(front) + " a tu izquierda un" + worldmodule.SymbolToString(left) + " y detras un" + worldmodule.SymbolToString(behind)
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const PutCheckpointIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PutCheckpointIntent';
    },
    handle(handlerInput) {
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Query.value;
        if (CurrentWorld == null){
            let speakOutput = "No existe laberinto, crea uno antes de empezar diciendo crea mundo pequeño, mediano o grande";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        let NewCheckPoint = playermodule.Checkpoint(AnswerValue, player_position_package.player_pointer_x, player_position_package.player_pointer_y);
        checkpoint_wrapper.push(NewCheckPoint);
        const speakOutput = 'Se ha creado un checkpoint llamado ' + NewCheckPoint.name + " en la posicion x:" + player_position_package.player_pointer_x.toString() + " y en la posicion y:" + player_position_package.player_pointer_y.toString() + ".Tienes " + checkpoint_wrapper.length + " checkpoints";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    } 
};

const ReturnToCheckpointIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReturnToCheckpointIntent';
    },
    handle(handlerInput) {
        let found_checkpoint = false;
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Query.value;
        if (CurrentWorld == null){
            let speakOutput = "No existe laberinto, crea uno antes de empezar diciendo crea mundo pequeño, mediano o grande";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        for (let i = 0; i < checkpoint_wrapper.length; i++){
            if (AnswerValue == checkpoint_wrapper[i].name){
                player_position_package.player_pointer_x = checkpoint_wrapper[i].x;
                player_position_package.player_pointer_y = checkpoint_wrapper[i].y;
                found_checkpoint = true;
            }
        }
        let speakOutput;
        if (found_checkpoint){
            speakOutput = "Encontrado el checkpoint llamado " + AnswerValue + " regresando a " + player_position_package.player_pointer_x.toString() + " " + player_position_package.player_pointer_y.toString(); 
        }
        else {
            speakOutput = "No se ha encontrado el checkpoint llamado " + AnswerValue;
        }
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        speakOutput +="." + "A tu derecha tienes un" + worldmodule.SymbolToString(right) + " delante un" + worldmodule.SymbolToString(front) + " a tu izquierda un" + worldmodule.SymbolToString(left) + " y detras un" + worldmodule.SymbolToString(behind);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const InventoryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InventoryIntent';
    },
    handle(handlerInput) {
        if (CurrentWorld == null){
            let speakOutput = "No existe laberinto, crea uno antes de empezar diciendo crea mundo pequeño, mediano o grande";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        // CODIGO
        let speakOutput;
        if (inventory_wrapper.length === 0){
            speakOutput = "El inventario está vacio, primero consigue un objeto"
        }
        else {
            speakOutput = "Tienes "
            for (let i = 0; i < inventory_wrapper[0].length ; i++){
                switch(inventory_wrapper[0][i]){
                    case 'H':
                        speakOutput += "un hacha "
                        break;
                    case 'B':
                        speakOutput += "una bomba "
                        break;
                }
            }
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

let object_found = false

const UseObjectIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UseObjectIntent';
    },
    handle(handlerInput) {
        if (CurrentWorld == null){
            let speakOutput = "No existe laberinto, crea uno antes de empezar diciendo crea mundo pequeño, mediano o grande";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        // CODIGO
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Object.value;
        let object_found = false;
        let object_index = null;

        let speakOutput;
        if (inventory_wrapper.length === 0){
            speakOutput = "El inventario está vacio, primero consigue un objeto"
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }
        else{
            for (let i = 0; i < inventory_wrapper[0].length; i++){
                switch(AnswerValue){
                    case 'espada':
                    case 'hacha':
                        object_found = true
                        object_index = i
                    case 'bomba':
                        object_found = true
                        object_index = i
                }
            }
        }
        if (object_found == true){
            speakOutput = "¿En que direccion quieres usar el objeto? "
            //reprompt

            //rescatar direccion
            //evaluar direccion con la orientacion del player wrapper
            //direccion valida, speak suscess
        }
        else {
            speakOutput = "No dispones del objeto " + AnswerValue + " intentalo de nuevo."
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SingleDirectionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SingleDirectionIntent';
    },
    handle(handlerInput) {
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Direction.value;
        let speakOutput;
        if (object_found){
            let result = worldmodule.UseObjectDirection(AnswerValue,CurrentWorld,player_position_package);
            CurrentWorld = result[0];
            let success = result[1];
            if (success){
                speakOutput = "Se ha usado el hacha para eliminar el arbusto en la direccion " + AnswerValue;
            }
            else{
                speakOutput = "No hay ningun arbusto en la direccion " + AnswerValue;
            }
        }
        else speakOutput = "No se puede realizar dicha acción, vuelve a intentarlo"
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
    
};

const PickObjectIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PickObjectIntent';
    },
    handle(handlerInput) {
        //quitar el valor a recibir, solo recojo objeto y ya se maneja el tipo de objeto en la propia funcion
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Object.value;
        if (CurrentWorld == null){
            let speakOutput = "No existe laberinto, crea uno antes de empezar diciendo crea mundo pequeño, mediano o grande";
            CurrentWorld = null;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        // CODIGO
        let speakOutput;
        //revisar implementacion de las celdas, si añadimos vacio al objeto
        if (CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y] == 'H'){
                switch(CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y][0]){
                    case 'H':
                        speakOutput = "Has encontrado un hacha, la recojes";
                        inventory_wrapper.push(CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y]);
                        break;

                    case 'B':
                        speakOutput = "Has encontrado una bomba, la recojes";
                        inventory_wrapper.push(CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y]);
                        break;
                }
                CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y][0] = '0'
            }
        else {
            speakOutput = "No estas sobre ningun objeto, muevete hacia la casilla donde se encuentre y vuelve a intentarlo";
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Intent para que repita todas las alternativas, el objeto de la celda, etc
const SituationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SituationIntent';
    },
    handle(handlerInput) {
        if (CurrentWorld == null){
            let speakOutput = "No existe laberinto, crea uno antes de empezar diciendo crea mundo pequeño, mediano o grande";
            CurrentWorld = null;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        let speakOutput = "A tu derecha tienes un" + worldmodule.SymbolToString(right) + " delante un" + worldmodule.SymbolToString(front) + " a tu izquierda un" + worldmodule.SymbolToString(left) + " y detras un" + worldmodule.SymbolToString(behind);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Oigo tu súplica, ¿cómo puedo guiar tu camino?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    
    handle(handlerInput) {
        const speakOutput = 'Te has rendido ante el laberinto.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Tu voz se pierde tras los muros. ¿Puedes repetir tus palabras?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `Has activado ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'No he podido acatar tu orden. Si me lo pides de nuevo, volveré a intentarlo.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AnswerDirectionIntentHandler,
        NewWorldIntentHandler,
        UseObjectIntentHandler,
        PickObjectIntentHandler,
        SingleDirectionIntentHandler,
        SituationIntentHandler,
        InventoryIntentHandler,
        HelpIntentHandler,
        ReturnToCheckpointIntentHandler,
        PutCheckpointIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();