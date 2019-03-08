const express = require("express");
const router = express.Router();

// Scraping Tools
const rp = require("request-promise");
const cheerio = require("cheerio");

// Model Database
const Kurs = require("../models/Kurs");

// Importing Helpers
const { chunk, filterArray } = require(('../helpers/function-helpers.js'));

const bcaURI =
  "https://www.bca.co.id/id/Individu/Sarana/Kurs-dan-Suku-Bunga/Kurs-dan-Kalkulator";

// Options for Request Promise Cheerio
const options = {
  uri: bcaURI,
  transform: body => cheerio.load(body)
};

// Scraping Data
router.get("/indexing", (req, res) => {
  rp(options).then(data => {

    // Filtering raw data 
    const result = filterArray(data("tbody.text-right").text())

    // Organizing data to be structured
    const chunkedData = chunk(result, 7);

    // Saving Data to Database there's 16 data saved
    for (let i = 0; i < chunkedData.length; i++) {
      Kurs.bulkWrite([{
        insertOne: {
          document: {
            symbol: chunkedData[i][0],
            e_rate: {
              jual: chunkedData[i][1],
              beli: chunkedData[i][2]
            },
            tt_counter: {
              jual: chunkedData[i][3],
              beli: chunkedData[i][4]
            },
            bank_notes: {
              jual: chunkedData[i][5],
              beli: chunkedData[i][6]
            }
          }
        }
      }]);
    }

    res.status(201).send({
      status: 'ok',
      data: chunkedData
    })
  });
});

// Query data by date

router.get("/kurs", (req, res) => {
  let query = {};

  if (req.query.startdate) {
    query.startdate = {
      $gte: new Date(req.query.startdate)
    }
  }

  if (req.query.enddate) {
    query.enddate = {
      $lte: new Date(req.query.enddate)
    }
  }

  Kurs.find(query)

    .then(kurs => {
      if (kurs.length === 0) {
        res.send({
          status: "error",
          data: "no match found"
        });
      }
      res.send({
        status: "ok",
        data: kurs
      });
    });
});

// Query Data by Symbol

router.get("/kurs/:symbol", (req, res) => {
  let query = [];

  if (req.query.startdate) {
    query.push({
      startdate: {
        $gte: new Date(req.query.startdate)
      }
    });
  }
  if (req.query.enddate) {
    query.push({
      enddate: {
        $lte: new Date(req.query.enddate)
      }
    });
  }

  Kurs.find({
    symbol: req.params.symbol
  }).then(kurs => {
    if (kurs.length === 0) {
      res.status(404).send({
        status: "error",
        data: "no match found"
      });
    }
    res.send({
      status: "ok",
      data: kurs
    });
  });
});

// Adding New data to database
router.post("/kurs", (req, res) => {
  const newKurs = new Kurs({
    symbol: req.body.symbol,
    e_rate: req.body.e_rate,
    tt_counter: req.body.tt_counter,
    bank_notes: req.body.bank_notes,
    date: req.body.date
  });

  newKurs
    .save()
    .then(savedKurs => {
      res.status(201).send({
        status: "created",
        data: savedKurs
      });
    })
    .catch(err => {
      if (err) throw err;
      res.send({
        err
      });
    });
});

// Updating Data by it's id from Database

router.put("/kurs/:id", (req, res) => {
  Kurs.findOne({
      _id: req.params.id
    },
    err => {
      if (err)
        res.status(404).send({
          status: "error",
          data: "No Match id found"
        });
    }
  ).then(kurs => {
    kurs.symbol = req.body.symbol;
    kurs.e_rate = req.body.e_rate;
    kurs.tt_counter = req.body.tt_counter;
    kurs.bank_notes = req.body.bank_notes;
    kurs.date = req.body.date;

    kurs
      .save()
      .then(savedKurs => {
        res.status(202).send({
          status: "updated",
          data: savedKurs
        });
      })
      .catch(err => {
        if (err) throw err;
        res.send({
          err
        });
      });
  });
});

// Deleting Data by date

router.delete("/kurs/:date", (req, res) => {
  Kurs.deleteMany({
    date: new Date(req.params.date)
  }).then(kurs => {
    res.send({
      status: "deleted",
      data: kurs
    });
  });
});

module.exports = router;