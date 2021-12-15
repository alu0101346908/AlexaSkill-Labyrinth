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
let player_orientation = 'E';
let player_position_package = { player_pointer_x, player_pointer_y, player_orientation };
let worldmodule = require ("./world.js");
let playermodule = require ("./player.js");

let checkpoint_wrapper;

let inventory_wrapper;


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
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Size.value;
        let count = 0;
        let countobstacle = 0;
        switch (AnswerValue){
            case 'pequeño':
                CurrentWorld = worldmodule.World(4,4);
                break;

            case 'mediano':
                CurrentWorld = worldmodule.World(6,6);
                break;

            case 'grande':
                CurrentWorld = worldmodule.World(8,8);
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
        const speakOutput = 'Creando ' + AnswerValue + ' con ' + contador + ' casillas' + ' y obstaculos ' + countobstacle;

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
        let speakOutput = 'Respondiste ' + AnswerValue;
        player_position_package = { player_pointer_x, player_pointer_y, player_orientation };
        let wrapper = worldmodule.ManageDirection(AnswerValue,CurrentWorld,player_position_package);
        CurrentWorld = wrapper[0];
        player_position_package = wrapper[1];
        speakOutput = speakOutput + wrapper[2];
        
        speakOutput = speakOutput + ' X:'+ player_position_package.player_pointer_x.toString() + ' Y:' + player_position_package.player_pointer_y.toString() + ' Orientacion: ' + player_position_package.player_orientation.toString();

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
        
        // CODIGO
        let speakOutput;
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
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Direction.value;
        // CODIGO
        let NewCheckPoint = playermodule.Checkpoint(AnswerValue, player_position_package.player_pointer_x, player_position_package.player_pointer_y);
        const speakOutput = 'Se ha creado un checkpoint llamado ' + NewCheckPoint.name + " en la posicion x:" + player_position_package.player_pointer_x.toString() + " y en la posicion y:" + player_position_package.player_pointer_y.toString();
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

        // CODIGO
        let speakOutput;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const UseObjectIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UseObjectIntent';
    },
    handle(handlerInput) {

        // CODIGO
        let speakOutput;
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
        
        // CODIGO
        let speakOutput;
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

        // CODIGO
        let speakOutput;
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
        HelpIntentHandler,
        PutCheckpointIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();