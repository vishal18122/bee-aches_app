const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper');
const Beach = require('../models/beeaches');



//CONNECTINF THE PAGE WITH DATABASE
mongoose.connect('mongodb://localhost:27017/Bee-aches' , {
    useNewUrlParser : true , 
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error" , console.error.bind(console, "connection error: "));
db.once("open" , () => {
    console.log("DATABASE CONNECTED!!")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Beach.deleteMany({});
    
    for(let i = 0 ; i < 200 ; i++){
        const ran = Math.floor(Math.random() * 60);
        const nums = Math.floor(Math.random()*20) + 10;
        
        const b = new Beach({
            author : '614acea49edb82dbbc81d859',
            location: `${cities[ran].city}, ${cities[ran].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: nums,
            geometry: { 
                type: "Point",
                coordinates: [
                    cities[ran].longitude,
                    cities[ran].latitude,
                ]
                    
                // coordinates : [ 77.17222, 31.10333 ],
            },
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            images: [             
                {
                    url: 'https://res.cloudinary.com/dxdkgbvly/image/upload/v1632411813/Beach/eqvrn3xvzdil4gs4wiv9.jpg',
                    filename: 'Beach/eqvrn3xvzdil4gs4wiv9',
                    
                },
                {
                    url: 'https://res.cloudinary.com/dxdkgbvly/image/upload/v1632411813/Beach/k4ac60fdpj9hz6lm18em.jpg',
                    filename: 'Beach/k4ac60fdpj9hz6lm18em',
                    
                }
            ] 

        })
        await b.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});