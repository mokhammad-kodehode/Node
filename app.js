const express = require("express");
const carsData = require("./carsData");

console.log(carsData);
const bodyParser = require("body-parser");
const sql = require("mssql");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const config = {
  server: "LAPTOP-4LB9J2QV\\SQLEXPRESS", // Имя сервера и, если нужно, название экземпляра SQL Server
  authentication: {
    type: "default",
    options: {
      trustServerCertificate: true,
    },
  },
  database: "RentCars", // Имя базы данных
  options: {
    encrypt: true,
  },
};

// const config = {
//   user: "stech",
//   server: "LAPTOP-4LB9J2QV\\SQLEXPRESS",
//   database: "RentCars",
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
// };

async function addCarToDatabase(car) {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      INSERT INTO Cars (id, brand, model, engine, speed, accel, passengers, emissionenCo2, transmission, horsepower, fuel)
      VALUES (${car.id}, '${car.brand}', '${car.model}', '${car.engine}', '${car.speed}', '${car.accel}', ${car.passengers}, '${car.emissionenCo2}', '${car.transmission}', '${car.horsepower}', '${car.fuel}');
    `);
    console.log("Car added");
  } catch (err) {
    console.error("Error", err);
  } finally {
    sql.close();
  }
}

async function addCarsToDatabase() {
  for (const car of carsData) {
    await addCarToDatabase(car);
  }
}

addCarsToDatabase().then(() => {
  const port = 8080;
  app.listen(port, () => {
    console.log(`Server is running port 8080 ${port}`);
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to page");
});

app.get("/cars", (req, res) => {
  res.json(carsData);
});
