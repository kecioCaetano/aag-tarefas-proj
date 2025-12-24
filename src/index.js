import "./style.css";

import {Restaurant} from "./home/home.js"
import {Menu} from "./menu/menu.js"
//  alert("test");

// const rest = new Restaurant();

const body = document.getElementById("main");

 const menu = new Menu();
 const rest = new Restaurant();
 body.append(rest.getRestaurant);``
 body.append(menu.getMenu);

 document.addEventListener('DOMContentLoaded', () =>{

    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContent = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link =>{
        link.addEventListener('click', () =>{
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContent.forEach(item => item.classList.remove('active'));

            link.classList.add('active');

            const targetId = link.dataset.target;
            document.getElementById(targetId).classList.add('active');
        });
    });

    if (tabLinks.length > 0){
        tabContent[0].click();
    }
 });


