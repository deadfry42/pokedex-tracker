//                 _                                      _      _
//  ___ _ ____   _(_)_ __ ___  _ __  _ __ ___   ___ _ __ | |_   (_)___
// / _ \ '_ \ \ / / | '__/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|  | / __|
// |  __/ | | \ V /| | | | (_) | | | | | | | | |  __/ | | | |_ _ | \__ \
// \___|_| |_|\_/ |_|_|  \___/|_| |_|_| |_| |_|\___|_| |_|\__(_)/ |___/
//                                                           |__/

// this file works with setting up basic variables for api & frontend, including:
// the game, the generation, the pokemon and more

const rowSize = 12
const rowCount = 5
const maxPokemon = 386
const gametitle = "Pokemon Box: Ruby & Sapphire"
const gamedatastore = "pbrs"
const generation = 3

const startAPI = () => {
    var script = document.createElement("script")
    script.src = "api.js"
    body.append(script)
}

const startFrontend = () => {
    var script = document.createElement("script")
    script.src = "frontend.js"
    body.append(script)
}

startAPI()