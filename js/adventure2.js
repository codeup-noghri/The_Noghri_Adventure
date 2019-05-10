"use strict";
let Player = {
    name:"Player",
    color:"red",
    backpack:1,
    inventory:[],
    pickup:function(item){
        if(Player.inventory.length < Player.backpack*4){
            Player.inventory.push(item);
            return true;
        }else{
            return false;
        }
    }
};


$(document).ready(function() {

});