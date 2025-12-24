import img1 from "./breakfast/1.jpg"
import img2 from "./breakfast/2.jpg"
import img3 from "./breakfast/3.jpg"
import img4 from "./breakfast/4.jpg"
import img5 from "./breakfast/5.jpg"

import imgl1 from "./lunch/1.jpg"
import imgl2 from "./lunch/2.jpg"
import imgl3 from "./lunch/3.jpg"
import imgl4 from "./lunch/4.jpg"
import imgl5 from "./lunch/5.jpg"



const breakfastImages = [img1, img2, img3, img4, img5];
const lunchImages = [imgl1, imgl2, imgl3, imgl4, imgl5];

export class Menu{
    
    #content;

    constructor(){
        this.#cache();
        this.#render();    
    }

    #cache(){
        // this.#content = document.getElementById("content");
        this.#content = document.createElement("div");
        this.#content.setAttribute("id","tab-content-menu");
        this.#content.setAttribute("class", "tab-content")
    }

    #render(){
        

        const breakfast = new MenuItem("Breakfast", 5, breakfastImages).getItems;
        const lunch = new MenuItem("Lunch", 5, lunchImages).getItems;
        // console.log(breakfast);
        this.#renderMeal(breakfast);
        this.#renderMeal(lunch);
        
    }
    get getMenu(){
        return this.#content;
    }

    #renderMeal(meal){
        meal.forEach((item) =>{
            const divCard = document.createElement("div");
            divCard.classList.add("card");


            const pPrice = document.createElement("p");
            pPrice.textContent = `${item.type} - ${item.name} ........................ ${item.price}`;

            const divImg = document.createElement("div");
            const image = document.createElement("img");
            image.src = item.url;
            divImg.append(image);

            const pDesc = document.createElement("span");
            pDesc.textContent = `${item.description}`;

            divCard.append(pPrice);
            divCard.append(divImg);
            divCard.append(pDesc);
            this.#content.append(divCard);
        })
        
    }
}

class MenuItem{
    #item;
    #type;
    #images;

    constructor(type, length, images){
        this.#item = new Array(length);
        this.#type = type;
        this.#images = images;
        this.#load();
    }

    #load(){
        for (let x = 0; x < this.#item.length; x++) {
            this.#item[x] = {
                type: this.#type, 
                name: `Dish ${x}`,
                url: this.#images[x],
                price: this.#getRandomPrice(10,30),
                description: ` ${x} ${x} It is a long established fact that a reader will ` 
                + `be distracted by the ${x} readable content of a page when looking at `
                + ` its layout. The point of using Lorem Ipsum ${x}`
            };
        }
    }

    get getItems(){
        return this.#item;
    }

    #getRandomPrice(min, max) {
        min = Math.ceil(min); // Ensure min is an integer
        max = Math.floor(max); // Ensure max is an integer
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
}