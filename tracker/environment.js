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