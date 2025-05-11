import express from "express";
import axios from "axios";

const app=express();
const port=3000;

function cardValue(a){
    const cardOrder = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
    "8": 8, "9": 9, "10": 10,
    "JACK": 11, "QUEEN": 12, "KING": 13, "ACE": 14
  };
  return cardOrder[a];
}

app.use(express.static("public"));

let deck_id="";
let count=50;

const API_URL="https://deckofcardsapi.com/";

app.get("/",async (req,res)=>{
    try{
        const deck=await axios.get(API_URL+"api/deck/new/shuffle/?deck_count=1");
        deck_id=deck.data.deck_id;
        const cards=await axios.get(API_URL+"api/deck/"+deck_id+"/draw/?count=2");
        res.render("index.ejs",{
            compCardImage:cards.data.cards[0].image,
            compCardNum:cards.data.cards[0].value,
            compCardSuit:cards.data.cards[0].suit,
            userCardImage:cards.data.cards[0].image,
            userCardNum:cards.data.cards[0].value,
            userCardSuit:cards.data.cards[0].suit,
        });
        console.log("remianing cards in the deck "+cards.data.remaining);   
    }catch(error){
        res.status(500).send("something wrong");
    }
});

app.post("/draw",async(req,res)=>{
    try{
        if(count==0){
            const deck=await axios.get(API_URL+"api/deck/new/shuffle/?deck_count=1");
            deck_id=deck.data.deck_id;
        }
        const cards=await axios.get(API_URL+"api/deck/"+deck_id+"/draw/?count=2");
        let user=cards.data.cards[1].value;
        let comp=cards.data.cards[0].value;
        count-=2;
        res.render("index.ejs",{
            compCardImage:cards.data.cards[0].image,
            compCardNum:cards.data.cards[0].value,
            compCardSuit:cards.data.cards[0].suit,
            userCardImage:cards.data.cards[1].image,
            userCardNum:cards.data.cards[1].value,
            userCardSuit:cards.data.cards[1].suit,
            userVal:user,
            compVal:comp,
        });
        console.log("remianing cards in the deck "+cards.data.remaining);   
    }catch(error){
        res.status(500).send("something wrong");
    }
});

app.post("/new-deck", (req,res)=>{
    res.redirect("/");
});

app.listen(port,()=>{
    console.log("port running at "+port);
});