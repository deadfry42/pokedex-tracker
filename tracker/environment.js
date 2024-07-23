//                 _                                      _      _
//  ___ _ ____   _(_)_ __ ___  _ __  _ __ ___   ___ _ __ | |_   (_)___
// / _ \ '_ \ \ / / | '__/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|  | / __|
// |  __/ | | \ V /| | | | (_) | | | | | | | | |  __/ | | | |_ _ | \__ \
// \___|_| |_|\_/ |_|_|  \___/|_| |_|_| |_| |_|\___|_| |_|\__(_)/ |___/
//                                                           |__/

// this file works with setting up basic variables for api & frontend, including:
// the game, the generation, the pokemon and more

const urlParams = new URL(window.location.href).searchParams;

var gamedatastore = urlParams.has("game") == true ? urlParams.get("game") : "pbrs"

var generation;
var gametitle;
var rowSize;
var rowCount;
var maxPokemon;
var defSprite;
var minSprite;
var boxBgName;
var boxVariations = true;
var boxHeaderOverrides = {};
var boxImageOverrides = {};

const doGen1Setup = () => { generation = 1; rowSize = 5; rowCount = 4; maxPokemon = 151; defSprite = -5; minSprite = -5; boxBgName = "gen1"; boxVariations = false; }
const doGen2Setup = () => { generation = 2; rowSize = 5; rowCount = 4; maxPokemon = 251; defSprite = -3; minSprite = -3; boxBgName = "gen1"; boxVariations = false; boxHeaderOverrides.box8 = "box8-1" }
const doGen3Setup = () => { generation = 3; rowSize = 6; rowCount = 5; maxPokemon = 386; defSprite = 0; minSprite = 0; boxBgName = "rse"; }
const doGen3_1Setup = () => { generation = 3; rowSize = 12; rowCount = 5; maxPokemon = 386; defSprite = 0; minSprite = 0; boxBgName = "pbrs"; } //pbrs
const doGen4Setup = () => { generation = 4; rowSize = 6; rowCount = 5; maxPokemon = 493; defSprite = 3; minSprite = 3; boxBgName = "gen4"; }
const doGen5Setup = () => { generation = 5; rowSize = 6; rowCount = 5; maxPokemon = 649; defSprite = 6; minSprite = 6; boxBgName = "gen5"; }
const doGen6Setup = () => { generation = 6; rowSize = 6; rowCount = 5; maxPokemon = 721; defSprite = 7; minSprite = 7; boxBgName = "gen6"; }
const doGen7Setup = () => { generation = 7; rowSize = 6; rowCount = 5; maxPokemon = 802; defSprite = 7; minSprite = 7; boxBgName = "gen7"; } //sm
const doGen7_1Setup = () => { generation = 7; rowSize = 6; rowCount = 5; maxPokemon = 807; defSprite = 7; minSprite = 7; boxBgName = "gen7"; } //usum+

const doFrlgBoxOverrides = () => {
    boxHeaderOverrides.box13 = "box13-frlg"
    boxHeaderOverrides.box14 = "box14-frlg"
    boxHeaderOverrides.box15 = "box15-frlg"
    boxHeaderOverrides.box16 = "box16-frlg"
    boxImageOverrides.box13 = "box13-frlg"
    boxImageOverrides.box14 = "box14-frlg"
    boxImageOverrides.box15 = "box15-frlg"
    boxImageOverrides.box16 = "box16-frlg"
}

switch (gamedatastore){
    case "rby": doGen1Setup(); gametitle = "Pokemon Red/Blue/Yellow"; break;

    case "gsc": doGen2Setup(); gametitle = "Pokemon Gold/Silver/Crystal"; break; //gsc only has national dex

    case "rse": doGen3Setup(); gametitle = "Pokemon Ruby/Sapphire/Emerald"; break;
    case "frlg": doGen3Setup(); gametitle = "Pokemon FireRed/LeafGreen"; doFrlgBoxOverrides(); break;
    case "gen3": doGen3Setup(); gametitle = "Pokemon Generation 3"; break;

    case "dppt": doGen4Setup(); gametitle = "Pokemon Diamond/Pearl/Platinum"; break;
    case "hgss": doGen4Setup(); gametitle = "Pokemon HeartGold/SoulSilver"; defSprite = 5; break;
    case "gen4": doGen4Setup(); gametitle = "Pokemon Generation 4"; break;
    
    case "bw": doGen5Setup(); gametitle = "Pokemon Black/White"; break;
    case "b2w2": doGen5Setup(); gametitle = "Pokemon Black2/White2"; break;
    case "gen5": doGen5Setup(); gametitle = "Pokemon Generation 5"; break;

    case "xy": doGen6Setup(); gametitle = "Pokemon X/Y"; break;
    case "oras": doGen6Setup(); gametitle = "Pokemon Omega Ruby/Alpha Sapphire"; break;
    case "gen6": doGen6Setup(); gametitle = "Pokemon Generation 6"; break;

    case "sm": doGen7Setup(); gametitle = "Pokemon Sun/Moon"; break;
    case "usum": doGen7_1Setup(); gametitle = "Pokemon Ultra Sun/Ultra Moon"; break;
    case "pokebank": doGen7_1Setup(); gametitle = "Pokemon Bank"; defSprite = 8; break;

    // do post gen7 later
    case "swsh": generation = 8.1; break;
    case "bdsp": generation = 8.2; break;
    case "pla": generation = 8.3; break;
    case "sv": generation = 9.1; break;

    default: //pbrs: fallback option
        gametitle = "Pokemon Box: Ruby & Sapphire";
        gamedatastore = "pbrs"
        doGen3_1Setup();
    break;
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