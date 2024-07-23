//                 _                                      _      _
//  ___ _ ____   _(_)_ __ ___  _ __  _ __ ___   ___ _ __ | |_   (_)___
// / _ \ '_ \ \ / / | '__/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|  | / __|
// |  __/ | | \ V /| | | | (_) | | | | | | | | |  __/ | | | |_ _ | \__ \
// \___|_| |_|\_/ |_|_|  \___/|_| |_|_| |_| |_|\___|_| |_|\__(_)/ |___/
//                                                           |__/

// this file works with setting up basic variables for api & frontend, including:
// the game, the generation, the pokemon and more

const urlParams = new URL(window.location.href).searchParams;

console.log(urlParams.get("game"))

const gamedatastore = urlParams.get("game") != null ? urlParams.get("game") : "pbrs"

var generation;
var gametitle;
var rowSize = 12
var rowCount = 5
var maxPokemon = 386

const doGen1Setup = () => { generation = 1; rowSize = 5; rowCount = 4; maxPokemon = 151; }
const doGen2Setup = () => { generation = 2; rowSize = 5; rowCount = 4; maxPokemon = 251; }
const doGen3Setup = () => { generation = 3; rowSize = 6; rowCount = 5; maxPokemon = 386; }
const doGen3_1Setup = () => { generation = 3; rowSize = 12; rowCount = 5; maxPokemon = 386; } //pbrs
const doGen4Setup = () => { generation = 4; rowSize = 6; rowCount = 5; maxPokemon = 493; }
const doGen5Setup = () => { generation = 5; rowSize = 6; rowCount = 5; maxPokemon = 649; }
const doGen6Setup = () => { generation = 6; rowSize = 6; rowCount = 5; maxPokemon = 721; }
const doGen7Setup = () => { generation = 7; rowSize = 6; rowCount = 5; maxPokemon = 802; } //sm
const doGen7_1Setup = () => { generation = 7; rowSize = 6; rowCount = 5; maxPokemon = 807; } //usum+

switch (gamedatastore){
    case "rby": doGen1Setup(); gametitle = "Pokemon Red/Blue/Yellow"; break; //rby (fallback)

    case "gsc": doGen2Setup(); gametitle = "Pokemon Gold/Silver/Crystal"; break; //gsc only has national dex

    case "pbrs": doGen3_1Setup(); gametitle = "Pokemon Box: Ruby & Sapphire"; break;
    case "rse": doGen3Setup(); gametitle = "Pokemon Ruby/Sapphire/Emerald"; break;
    case "frlg": doGen3Setup(); gametitle = "Pokemon FireRed/LeafGreen"; break;
    case "gen3": doGen3Setup(); gametitle = "Pokemon Generation 3"; break;

    case "dppt": doGen4Setup(); gametitle = "Pokemon Diamond/Pearl/Platinum"; break;
    case "hgss": doGen4Setup(); gametitle = "Pokemon HeartGold/SoulSilver"; break;
    case "gen4": doGen4Setup(); gametitle = "Pokemon Generation 4"; break;
    
    case "bw": doGen5Setup(); gametitle = "Pokemon Black/White"; break;
    case "b2w2": doGen5Setup(); gametitle = "Pokemon Black2/White2"; break;
    case "gen5": doGen5Setup(); gametitle = "Pokemon Generation 5"; break;

    case "xy": doGen6Setup(); gametitle = "Pokemon X/Y"; break;
    case "oras": doGen6Setup(); gametitle = "Pokemon Omega Ruby/Alpha Sapphire"; break;
    case "gen6": doGen6Setup(); gametitle = "Pokemon Generation 6"; break;

    case "pokebank"||"sm"||"usum":  break; // gen 7+ doesn't have a national dex
    case "sm": doGen7Setup(); gametitle = "Pokemon Sun/Moon"; break;
    case "usum": doGen7_1Setup(); gametitle = "Pokemon Ultra Sun/Ultra Moon"; break;
    case "pokebank": doGen7_1Setup(); gametitle = "Pokemon Bank"; break;

    // do post gen7 later
    case "swsh": generation = 8.1; break;
    case "bdsp": generation = 8.2; break;
    case "pla": generation = 8.3; break;
    case "sv": generation = 9.1; break;
}

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