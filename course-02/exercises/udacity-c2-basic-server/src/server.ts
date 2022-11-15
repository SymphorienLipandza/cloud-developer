import express, { Request, Response } from 'express';
import { create } from 'tailwind-rn';
// import bodyParser from 'body-parser'; deprecated
const bodyParser = require('body-parser')

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars
  app.get("/cars", (req:Request, res:Response) => {
    let {make} = req.body;
    let cars_list = cars;
    if (make){
      cars_list = cars.filter((cars) => cars.make==make);
    }
    res.status(200).send(cars_list); 
  })

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars",(req:Request,res:Response) => {
    let {id} = req.body;
    
    if (!id){
      // Error message
     return res.status(400).send("Request failled");
    }
     const car = cars.filter((cars) => cars.id==id);
     //Car not found, error message
    if(car  && car.length==0){
      return res.status(400).send("Card not found");
    }

    // Send the car
    res.status(200).send(car);
}) 

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/cars/",(req:Request,res:Response) =>
  {
    let {id,type, model,cost, make} = req.body;
    if (!id || !type || !model || !cost){
      return res.status(400).send("Id, cost, type, model , make not found");
    }
    //creating a new car
    const new_car: Car = {
      id: id, make: make, cost:cost, type:type, model:model 
     };
  //Adding the new car in the car list
     cars.push(new_car);
     res.status(201).send(new_car);
  })
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
