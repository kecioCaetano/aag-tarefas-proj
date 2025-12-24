import logo from "./restaurant.jpg"; 

export class Restaurant {    

    #content;

    constructor(){
        this.#cache();
        this.#render();
     }

    #cache(){
        // this.#content = document.getElementById("content");
        this.#content = document.createElement("div");
        this.#content.setAttribute("id","tab-content-home");
        this.#content.setAttribute("class", "tab-content active")
        // console.log(this.#content);
    }

    get getRestaurant(){
        return this.#content;
    }

    #render(){
        const h2 = document.createElement("h2");
        h2.textContent = "AFC - Asian Fusion Cuisine - Dynamic";
        
        const divImg = document.createElement("div");
        const img = document.createElement("img");
        img.src = logo;
        divImg.append(img)
        
        const p = document.createElement("p");
        p.textContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " 
                + " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " 
                + " when an unknown printer took a galley of type and scrambled it to make a type " 
                + " specimen book. It has survived not only five centuries, but also the leap into " 
                + "  electronic typesetting, remaining essentially unchanged. It was popularised " 
                + "  in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, " 
                + "  and more recently with desktop publishing software like Aldus PageMaker including " 
                + "  versions of Lorem Ipsum"

        this.#content.append(h2);
        this.#content.append(divImg);
        this.#content.append(p);

        
    }

}
