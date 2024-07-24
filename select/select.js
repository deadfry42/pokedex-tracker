var pokedexes = [
    {
        label: "Generation 1",
        national: null,
        types: [
            {label: "Pokemon Red/Blue/Yellow", store: "rby"},
        ]
    },
    {
        label: "Generation 2",
        national: null,
        types: [
            {label: "Pokemon Gold/Silver/Crystal", store: "gsc"},
        ]
    },
    {
        label: "Generation 3",
        national: "gen3",
        types: [
            {label: "Pokemon Ruby/Sapphire/Emerald\n(Hoenn Dex)", store: "rse"},
            {label: "Pokemon FireRed/LeafGreen\n(Kanto Dex)", store: "frlg"},
            {label: "Pokemon Box: Ruby & Sapphire", store: "pbrs"},
        ]
    },
    {
        label: "Generation 4",
        national: "gen4",
        types: [
            {label: "Pokemon Diamond/Pearl/Platinum\n(Sinnoh Dex)", store: "dppt"},
            {label: "Pokemon HeartGold/SoulSilver\n(Johto Dex)", store: "hgss"},
        ]
    },
    {
        label: "Generation 5",
        national: "gen5",
        types: [
            {label: "Pokemon Black/White\n(Unova Dex)", store: "bw"},
            {label: "Pokemon Black2/White2\n(Unova Dex)", store: "b2w2"},
        ]
    },
    {
        label: "Generation 6",
        national: "gen6",
        types: [
            {label: "Pokemon X/Y\n(Kalos Dex)", store: "xy"}, //we'll come to kalos later
            {label: "Pokemon Omega Ruby/Alpha Sapphire\n(Hoenn Dex)", store: "oras"},
        ]
    },
    {
        label: "Generation 7",
        national: null,
        types: [
            {label: "Pokemon Sun/Moon\n(Alola Dex)", store: "sm"},
            {label: "Pokemon Ultra Sun/Ultra Moon\n(Alola Dex)", store: "usum"},
            {label: "Pokemon Bank", store: "pokebank"},
        ]
    },
]


var readyPokedexes = [ // all of the pokedexes that are ready and should be shown to the user
    pokedexes[0],
    pokedexes[1],
    pokedexes[2],
]

const CreatePokedexElement = (data) => {
    var pokedex = document.createElement("div")
    var title = document.createElement("h2")
    title.innerText = data.label;
    title.style.margin = "1vw"

    var anchor = document.createElement("a")
    anchor.href = `../tracker/index.html?game=${data.store}`

    var image = document.createElement("img")
    image.src = `../assets/boxart/${data.store}.png`
    image.style.width = "10vw"
    image.classList = ["pokemon-claimed"]

    anchor.append(image)

    pokedex.append(title)
    pokedex.append(anchor)

    return pokedex
}

const CreateGroupElement = (data) => {
    var group = document.createElement("fieldset")
    group.style.display = "inline"
    group.style.borderRadius = "1rem"

    group.style.borderBottom = "none"
    group.style.marginBottom = "1rem"

    var inside = document.createElement("div")
    inside.style.display = "flex"
    inside.style.margin = "auto"
    inside.classList = ["center"]

    var title = document.createElement("legend")
    title.innerText = data.label;
    title.style.fontWeight = "900";
    title.style.fontSize = "1.5rem"

    group.append(title)
    group.append(inside);

    data.types.forEach((pokedex) => {
        inside.append(CreatePokedexElement(pokedex));
    })

    return group;
}

const workspace = document.getElementById("workspace")

var groups = []

readyPokedexes.forEach((element) => {
    var group = CreateGroupElement(element)
    groups.push(group)
})

window.addEventListener("load", () => {
    groups.forEach((group) => {
        workspace.append(group)
    })
})