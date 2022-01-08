/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');


// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// We create a language strings object containing all of our strings. 
// The keys for each string will then be referenced in our code
// e.g. requestAttributes.t('WELCOME')
const languageStrings = {
  en: {
    translation: {
      WELCOME_MESSAGE: '?',
      HELLO_MESSAGE: '',
      HELP_MESSAGE: '',
      WORLD_EXIST: '',
      GOODBYE_MESSAGE: '',
      REFLECTOR_MESSAGE: 'You just triggered %s',
      FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
      ERROR_MESSAGE: 'Sorry, there was an error. Please try again.'
    }
  },
  es:{
    translation: {
      WELCOME_MESSAGE: 'Bienvenido a la prueba del laberinto. Prepara un desafío.',
      HELLO_MESSAGE: 'Hola Mundo!',
      WORLD_EXIST_MESSAGE: 'Ya existe un mundo, si quieres reiniciar di reinicia mundo, si quieres crear uno nuevo vuelve a decir crea mundo',
      HELP_MESSAGE: 'Puedes decirme hola. Cómo te puedo ayudar?',
      ENTER_LABYRINTH_MESSAGE: 'Entras en el laberinto',
      MISSING_WORLD_MESSAGE : 'No existe laberinto, crea uno antes de empezar diciendo crea mundo pequeño, mediano o grande',
      NOT_A_OBJECT_MESSAGE: 'No estas sobre ningun objeto, muevete hacia la casilla donde se encuentre y vuelve a intentarlo',
      FOUND_BOMB_MESSAGE: 'Has encontrado una bomba, la recojes',
      FOUND_HATCHET_MESSAGE: 'Has encontrado un hacha, la recojes',
      CANT_USE_OBJECT_MESSAGE: 'No se puede realizar dicha acción, vuelve a intentarlo',
      NOT_A_BUSH_MESSAGE: 'No hay ningun arbusto en la direccion %s',
      USED_HATCHET_MESSAGE: 'Se ha usado el hacha para eliminar el arbusto en la direccion %s',
      MISSING_OBJECT_MESSAGE: 'No dispones del objeto %s intentalo de nuevo.',
      USE_OBJECT_MESSAGE: '¿En que direccion quieres usar el objeto? ',
      EMPTY_INVENTORY_MESSAGE: 'El inventario está vacio, primero consigue un objeto',
      A_HATCHET_MESSAGE: 'un hacha ',
      A_BOMB_MESSAGE: 'una bomba ',
      HAVE_MESSAGE: 'Tienes ',
      CHECKPOINT_NOT_FOUND_MESSAGE: 'No se ha encontrado el checkpoint llamado %s',
      CHECKPOINT_FOUND_MESSAGE: 'Encontrado el checkpoint llamado %s. Regresando a la posicion %s %s',
      CHECKPOINT_CREATED_MESSAGE: 'Se ha creado un checkpoint llamado %s en la coordenada x igual %s y en la coordenada y igual %s. Tienes %s checkpoints',
      PLAYER_SURROUNDINGS_MESSAGE: '. A tu derecha tienes un%s. Delante hay un%s. A tu izquierda, un%s. Detrás de ti, hay un%s',
      STEPPED_OBJECT_MESSAGE: '. Te encuentras encima de un objeto%s',
      REACHED_GOAL_MESSAGE: '¡Felicidades has llegado a la meta! El laberinto se va a autodestruir.',
      CANT_MOVE_MESSAGE: 'No te puede mover hacia %s porque hay un muro',
      MOVE_MESSAGE: 'Te mueves hacia %s',
      RESTART_LABYRINTH_MESSAGE: 'Se ha creado un nuevo laberinto. Entras en el laberinto',
      UNSUPPORTED_SIZE_MESSAGE: 'Tamaño de mundo no soportado, prueba con pequeño, mediano y grande',
      PLAYER_SURROUNDINGS_START_MESSAGE: '. A tu derecha tienes un %s. Delante, tienes un %s. A tu izquierda, hay un %s. Detrás de ti está la entrada.',
      LABYRINTH_HELP_MESSAGE: 'Oigo tu súplica, ¿cómo puedo guiar tu camino?',
      GOODBYE_MESSAGE: 'Adiós!',
      REFLECTOR_MESSAGE: 'Acabas de activar %s',
      CANCEL_MESSAGE: 'Te has rendido ante el laberinto.',
      FALLBACK_MESSAGE: 'Tu voz se pierde tras los muros. ¿Puedes repetir tus palabras?',
      ERROR_MESSAGE: 'No he podido acatar tu orden. Si me lo pides de nuevo, volveré a intentarlo.'
    }
  }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

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
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        if (CurrentWorld !== null && tryagain == false){
            const speakOutput = requestAttributes.t('WORLD_EXIST');
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
            case 'small':
            case 'pequeño':
                CurrentWorld = worldmodule.World(4,4);
                end_x = 4-1;
                end_y = 4-1;
                break;
            case 'medium':
            case 'mediano':
            case 'normal':
                CurrentWorld = worldmodule.World(6,6);
                end_x = 6-1;
                end_y = 6-1;
                break;
            case 'big':
            case 'grande':
                CurrentWorld = worldmodule.World(8,8);
                end_x = 8-1;
                end_y = 8-1;
                break;

            default:
                const speakOutput = requestAttributes.t('UNSUPPORTED_SIZE_MESSAGE');
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
        //let speakOutput = requestAttributes.t('ENTER_LABYRINTH');
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        let dummy_string1 = requestAttributes.t('ENTER_LABYRINTH_MESSAGE');
        let dummy_string2 = requestAttributes.t('PLAYER_SURROUNDINGS_START_MESSAGE',worldmodule.SymbolToString(right,language),worldmodule.SymbolToString(front,language),worldmodule.SymbolToString(left,language));
        let speakOutput = dummy_string1 + dummy_string2;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RestartWorldIntentHandler = {

    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RestartWorldIntent';
    },
    handle(handlerInput) {
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Size.value;
        let count = 0;
        let countobstacle = 0;
        CurrentWorld = null
        switch (AnswerValue){
            case 'small':
            case 'pequeño':
                CurrentWorld = worldmodule.World(4,4);
                end_x = 4-1;
                end_y = 4-1;
                break;
            case 'medium':
            case 'mediano':
            case 'normal':
                CurrentWorld = worldmodule.World(6,6);
                end_x = 6-1;
                end_y = 6-1;
                break;
            case 'big':
            case 'grande':
                CurrentWorld = worldmodule.World(8,8);
                end_x = 8-1;
                end_y = 8-1;
                break;

            default:
                const speakOutput = requestAttributes.t('UNSUPPORTED_SIZE_MESSAGE');
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
        //let speakOutput = requestAttributes.t('RESTART_LABYRINTH');
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        let dummy_string1 = requestAttributes.t('RESTART_LABYRINTH_MESSAGE');
        let dummy_string2 = requestAttributes.t('PLAYER_SURROUNDINGS_START_MESSAGE',worldmodule.SymbolToString(right,language),worldmodule.SymbolToString(front,language),worldmodule.SymbolToString(left,language));
        let speakOutput = dummy_string1 + dummy_string2
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
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Direction.value;
        let can_move = false;
        if (CurrentWorld == null){
            let speakOutput = requestAttributes.t('MISSING_WORLD_MESSAGE');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        let speakOutput;
        let direction_wrapper = worldmodule.ManageDirection(AnswerValue,CurrentWorld,player_position_package,language);
        CurrentWorld = direction_wrapper[0];
        player_position_package = direction_wrapper[1];
        let dummy_string1 = '';
        let dummy_string2 = '';
        if (direction_wrapper[2]){
            dummy_string1 = requestAttributes.t('MOVE_MESSAGE',AnswerValue);
        }
        else dummy_string2 = requestAttributes.t('CANT_MOVE_MESSAGE');
        if (player_position_package.player_pointer_x == end_x && player_position_package.player_pointer_y == end_y){
            speakOutput = requestAttributes.t('REACHED_GOAL_MESSAGE');
            CurrentWorld = null;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        //speakOutput += ' X:'+ player_position_package.player_pointer_x.toString() + ' Y:' + player_position_package.player_pointer_y.toString() + ' Orientacion: ' + player_position_package.player_orientation.toString();
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        let dummy_string3 = ''
        if (CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y] == 'H'){
            dummy_string3 = requestAttributes.t('STEPPED_OBJECT_MESSAGE');
        }
        let dummy_string4 = requestAttributes.t('PLAYER_SURROUNDINGS_MESSAGE',worldmodule.SymbolToString(right,language),worldmodule.SymbolToString(front,language),worldmodule.SymbolToString(left,language),worldmodule.SymbolToString(behind,language));

        speakOutput = dummy_string1 + dummy_string2 + dummy_string3 + dummy_string4
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
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Query.value;
        if (CurrentWorld === null){
            let speakOutput = requestAttributes.t('MISSING_WORLD_MESSAGE');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        let NewCheckPoint = playermodule.Checkpoint(AnswerValue, player_position_package.player_pointer_x, player_position_package.player_pointer_y);
        checkpoint_wrapper.push(NewCheckPoint);
        const speakOutput = requestAttributes.t('CHECKPOINT_CREATED_MESSAGE',NewCheckPoint.name,player_position_package.player_pointer_x.toString(),player_position_package.player_pointer_y.toString(),checkpoint_wrapper.length);
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
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Query.value;
        if (CurrentWorld === null){
            let speakOutput = requestAttributes.t('MISSING_WORLD_MESSAGE');
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
            //speakOutput = requestAttributes.t('CHECKPOINT_FOUND_MESSAGE',AnswerValue,player_position_package.player_pointer_x.toString(),player_position_package.player_pointer_y.toString());
            
        }
        else {
            speakOutput = requestAttributes.t('CHECKPOINT_NOT_FOUND_MESSAGE',AnswerValue);
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        let dummy_string1 = requestAttributes.t('CHECKPOINT_FOUND_MESSAGE',AnswerValue);
        let dummy_string2 = requestAttributes.t('PLAYER_SURROUNDINGS_MESSAGE',player_position_package.player_pointer_x.toString(),player_position_package.player_pointer_y.toString(),worldmodule.SymbolToString(right,language),worldmodule.SymbolToString(front,language),worldmodule.SymbolToString(left,language),worldmodule.SymbolToString(behind,language));
        speakOutput = dummy_string1 + dummy_string2 
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
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        if (CurrentWorld == null){
            let speakOutput = requestAttributes.t('MISSING_WORLD_MESSAGE');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        // CODIGO
        let speakOutput;
        let dummy_string1;
        let dummy_string2;
        if (inventory_wrapper.length === 0){
            speakOutput = requestAttributes.t('EMPTY_INVENTORY_MESSAGE');
        }
        else {
            dummy_string1 = requestAttributes.t('HAVE_MESSAGE');
            for (let i = 0; i < inventory_wrapper[0].length ; i++){
                switch(inventory_wrapper[0][i]){
                    case 'H':
                        dummy_string2 = requestAttributes.t('A_HATCHET_MESSAGE');
                        speakOutput = dummy_string1 + dummy_string2;
                        break;
                    case 'B':
                        dummy_string2 = requestAttributes.t('A_BOMB_MESSAGE_MESSAGE');
                        speakOutput = dummy_string1 + dummy_string2;
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
let object_index = null
const UseObjectIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UseObjectIntent';
    },
    handle(handlerInput) {
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        if (CurrentWorld == null){
            let speakOutput = requestAttributes.t('MISSING_WORLD_MESSAGE');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        // CODIGO
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Object.value;
        object_found = false;

        let speakOutput;
        if (inventory_wrapper.length === 0){
            speakOutput = requestAttributes.t('EMPTY_INVENTORY_MESSAGE');
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }
        else{
            for (let i = 0; i < inventory_wrapper[0].length; i++){
                switch(AnswerValue){
                    case 'hatchet':
                    case 'hacha':
                        object_found = true
                        object_index = i
                    case 'bomba':
                    case 'bomb'
                        object_found = true
                        object_index = i
                }
            }
        }
        if (object_found == true){
            speakOutput = requestAttributes.t('USE_OBJECT_MESSAGE');
            //reprompt

            //rescatar direccion
            //evaluar direccion con la orientacion del player wrapper
            //direccion valida, speak suscess
        }
        else {
            speakOutput = requestAttributes.t('MISSING_OBJECT_MESSAGE',AnswerValue);
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
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Direction.value;
        if (CurrentWorld == null){
            let speakOutput = requestAttributes.t('MISSING_WORLD_MESSAGE');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        let speakOutput;
        if (object_found){
            let result = worldmodule.UseObjectDirection(AnswerValue,CurrentWorld,player_position_package,language);
            CurrentWorld = result[0];
            let success = result[1];
            if (success){
                speakOutput = requestAttributes.t('USED_HATCHET_MESSAGE',AnswerValue);
            }
            else{
                speakOutput = requestAttributes.t('NOT_A_BUSH_MESSAGE',AnswerValue);
            }
        }
        else{
            speakOutput = requestAttributes.t('CANT_USE_OBJECT_MESSAGE');
        }
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
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        //quitar el valor a recibir, solo recojo objeto y ya se maneja el tipo de objeto en la propia funcion
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.Object.value;
        if (CurrentWorld == null){
            let speakOutput = requestAttributes.t('MISSING_WORLD_MESSAGE');
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
                        speakOutput = requestAttributes.t('FOUND_HATCHET_MESSAGE');
                        inventory_wrapper.push(CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y]);
                        break;

                    case 'B':
                        speakOutput = requestAttributes.t('FOUND_BOMB_MESSAGE');
                        inventory_wrapper.push(CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y]);
                        break;
                }
                CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y][0] = '0'
            }
        else {
            speakOutput = requestAttributes.t('NOT_A_OBJECT_MESSAGE');
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
        const language = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        if (CurrentWorld == null){
            let speakOutput = requestAttributes.t('MISSING_WORLD_MESSAGE');
            CurrentWorld = null;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        let wrapper = worldmodule.Surroundings(CurrentWorld,player_position_package);
        let left = wrapper[0], right = wrapper[1], front = wrapper[2], behind = wrapper[3];
        let speakOutput = requestAttributes.t('PLAYER_SURROUNDINGS_MESSAGE',worldmodule.SymbolToString(right,language),worldmodule.SymbolToString(front,language),worldmodule.SymbolToString(left,language),worldmodule.SymbolToString(behind,language));
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('CANCEL_MESSAGE');

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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        let dummy = `${intentName}`;
        const speakOutput = requestAttributes.t('REFLECTOR_MESSAGE',dummy);

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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}

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
        RestartWorldIntentHandler,
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
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();