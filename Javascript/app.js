var arNewFact;

// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact, image) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
    this.factArray = [this.fact];
    this.image = image;
}

// Create Dino Objects
async function dinoObject() {
    const jsonData = await fetch("./dino.json");
    const data = await jsonData.json();
    const allDinos = [];
    data.Dinos.map(value => {
        allDinos.push(new Dino(value.species, value.weight, value.height, value.diet, value.where, value.when, value.fact, value.species.toLowerCase() + ".png"));
    });

    return allDinos;
}

// Create Human Object
// Use IIFE to get human data from form
function humanObject() {
    const human = (function() {
        let name = document.getElementById('name').value;
        let feet = document.getElementById('feet').value;
        let inches = document.getElementById('inches').value;
        let weight = document.getElementById('weight').value;
        let diet = document.getElementById('diet').value;
        let image = 'human.png';

        function getName() {
            return name;
        }

        function getHeight() {
            return parseFloat((feet) * 12) + parseFloat(inches);
        }

        function getWeight() {
            return parseFloat(weight);
        }

        function getDiet() {
            return diet;
        }

        function getImage() {
            return image;
        }

        return {
            name: getName(),
            height: getHeight(),
            weight: getWeight(),
            diet: getDiet(),
            image: getImage()
        };
    })();

    return human;
}


// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches. 
Dino.prototype.compareHeight = function(humanHeight) {
    arNewFact = this.factArray;
    arNewFact.push(`The dinosaur was ${Math.floor(this.height / humanHeight)} times taller than you`);
    this.factArray = arNewFact;
};

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function(humanWeight) {
    arNewFact = this.factArray;
    arNewFact.push(`The dinosaur was ${Math.floor(this.weight / humanWeight)} times heavier than you`);
    this.factArray = arNewFact;
};

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function(humanDiet) {
    arNewFact = this.factArray;
    if (this.diet === humanDiet) {
        arNewFact.push(`The dinosaur was also a ${this.diet}!`);
    } else {
        arNewFact.push(`The dinosaur was a ${this.diet}`);
    }
    this.factArray = arNewFact;
};

// Generate Tiles for each Dino in Array
// Add tiles to DOM
function addTilesToDOM(dinos, human) {
    const grid = document.getElementById('grid');
    let arrayDinos = dinos;
    arrayDinos.splice(4, 0, human);
    arrayDinos.map(dino => {
        if (dino.species) {
            dino.compareHeight(human.height);
            dino.compareWeight(human.weight);
            dino.compareDiet(human.diet);
        }
        const tile = document.createElement('div');
        tile.className = 'grid-item';

        const title = document.createElement('h3');
        title.className = 'h3';
        if (dino.species) {
            title.innerHTML = dino.species;
        } else {
            title.innerHTML = human.name;
        }

        const fact = document.createElement('p');
        fact.className = 'p';
        const factsArray = dino.factArray;
        let randomFact = '';

        if (factsArray) {
            randomFact = factsArray[Math.floor(Math.random() * factsArray.length)];
        }
        if (dino.species == 'Pigeon') {
            fact.innerHTML = dino.fact;
        } else {
            fact.innerHTML = randomFact;
        }

        const image = document.createElement('img');
        image.className = 'img';
        image.src = `./images/${dino.image}`;
        tile.appendChild(title);
        tile.appendChild(image);
        tile.appendChild(fact);
        grid.appendChild(tile);
    });
}

// Remove form from screen
function removeForm() {
    const form = document.getElementById('dino-compare');
    form.style.display = "none";
}

// On button click, prepare and display infographic
const button = document.getElementById('btn');
button.addEventListener("click", compareData);
async function compareData() {
    const dinos = await dinoObject();
    // Create Human Object
    let human = new humanObject();

    addTilesToDOM(dinos, human);
    removeForm();
}