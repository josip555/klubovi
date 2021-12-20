const fs = require('fs');
const https = require('https');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/cert.pem', 'utf8');

const swaggerOptions = {
  swaggerDefinition:{
    info: {
      title: 'Nogometni klubovi API',
      version: '1.0.0'
    }
  },
  apis: ['app.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);



const {
  Pool
} = require('pg')
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'klubovi',
  user: 'postgres',
  password: 'sifra123',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const credentials = {
  key: privateKey,
  cert: certificate
};
const express = require('express');
const app = express();
const httpsServer = https.createServer(credentials, app);
const port = 3000;
app.use(express.json({
  limit: '10mb'
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

httpsServer.listen(port);
console.log(`Listening at port ${port}...`)

app.get('/download/csv', (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`COPY(SELECT
        klub_naziv,
        kratica,
        nadimak,
        klub_grad,
        klub_drzava,
        osnovan,
        predsjednik,
        trener,
        liga,
        web,
        stadion_naziv,
        stadion_grad,
        stadion_drzava,
        adresa,
        kapacitet,
        podloga,
        ime,
        prezime,
        igrac_drzava,
        pozicija,
        datum_rod
      FROM klub JOIN stadion ON klub.stadion_id=stadion.stadion_id 
        JOIN igrac ON igrac.klub_id=klub.klub_id)
    TO '${path.join(__dirname, 'klubovi.csv')}' with DELIMITER ',' CSV HEADER;`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.download(path.join(__dirname, 'klubovi.csv'));
      console.log(`CSV sent...`);
    })
  })
});

app.get('/download/json', (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`COPY (
      SELECT to_json(array_agg(t)) FROM (
          SELECT 
            klub_naziv AS klub_naziv,
            kratica,
            nadimak,
            klub_grad,
            klub_drzava,
            osnovan,
            predsjednik,
            trener,
            liga,
            web,
            json_build_object(
              'stadion_naziv', stadion.stadion_naziv,
              'stadion_grad', stadion.stadion_grad,
              'stadion_drzava', stadion.stadion_drzava,
              'adresa', stadion.adresa,
              'kapacitet', stadion.kapacitet,
              'podloga', stadion.podloga) AS stadion,
            json_agg(
              json_build_object(
                'ime', igrac.ime,
                'prezime', igrac.prezime,
                'igrac_drzava', igrac.igrac_drzava,
                'pozicija', igrac.pozicija,
                'datum_rod', igrac.datum_rod)) AS igraci
          FROM klub 
            JOIN stadion ON klub.stadion_id=stadion.stadion_id
            JOIN igrac ON klub.klub_id = igrac.klub_id
          GROUP BY klub.klub_id, stadion.stadion_id
          ORDER BY klub.klub_id::int
          ) t )
    TO '${path.join(__dirname, 'klubovi.json')}';`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.download(path.join(__dirname, 'klubovi.json'));
      console.log(`JSON sent...`);
    })
  })
});

app.post('/download/filteredcsv', (req, res) => {
  console.log(req.body);
  let ids = req.body;
  let idstring = ids.toString();

  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`COPY(SELECT
        klub_naziv,
        kratica,
        nadimak,
        klub_grad,
        klub_drzava,
        osnovan,
        predsjednik,
        trener,
        liga,
        web,
        stadion_naziv,
        stadion_grad,
        stadion_drzava,
        adresa,
        kapacitet,
        podloga,
        ime,
        prezime,
        igrac_drzava,
        pozicija,
        datum_rod
      FROM klub JOIN stadion ON klub.stadion_id=stadion.stadion_id 
        JOIN igrac ON igrac.klub_id=klub.klub_id
      WHERE igrac_id IN (${idstring}))
      TO '${path.join(__dirname, 'temp', 'fklubovi.csv')}' with DELIMITER ',' CSV HEADER;`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.download(path.join(__dirname, 'temp', 'fklubovi.csv'));
      console.log(`CSV sent...`);
    })
  });
});

app.post('/download/filteredjson', (req, res) => {
  console.log(req.body);
  let ids = req.body;
  let idstring = ids.toString();
  console.log(idstring);

  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`COPY (
      SELECT to_json(array_agg(t)) FROM (
          SELECT 
            klub_naziv AS klub_naziv,
            kratica,
            nadimak,
            klub_grad,
            klub_drzava,
            osnovan,
            predsjednik,
            trener,
            liga,
            web,
            json_build_object(
              'stadion_naziv', stadion.stadion_naziv,
              'stadion_grad', stadion.stadion_grad,
              'stadion_drzava', stadion.stadion_drzava,
              'adresa', stadion.adresa,
              'kapacitet', stadion.kapacitet,
              'podloga', stadion.podloga) AS stadion,
            json_agg(
              json_build_object(
                'ime', igrac.ime,
                'prezime', igrac.prezime,
                'igrac_drzava', igrac.igrac_drzava,
                'pozicija', igrac.pozicija,
                'datum_rod', igrac.datum_rod)) AS igraci
          FROM klub 
            JOIN stadion ON klub.stadion_id=stadion.stadion_id
            JOIN igrac ON klub.klub_id = igrac.klub_id
          WHERE igrac_id IN (${idstring})
          GROUP BY klub.klub_id, stadion.stadion_id
          ORDER BY klub.klub_id::int
          ) t )
    TO '${path.join(__dirname, 'temp', 'fklubovi.json')}';`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.download(path.join(__dirname, 'temp', 'fklubovi.json'));
      console.log(`CSV sent...`);
    })
  });
});

app.get('/allrows', (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`SELECT  igrac_id, 
    ime,
    prezime,
    igrac_drzava,
    pozicija,
    datum_rod,
    igrac.klub_id AS klub_id,
    klub_naziv,
    kratica,
    nadimak,
    klub_grad,
    klub_drzava,
    osnovan,
    predsjednik,
    trener,
    liga,
    web,
    klub.stadion_id AS stadion_id,
    stadion_naziv,
    stadion_grad,
    stadion_drzava,
    adresa,
    kapacitet,
    podloga
    FROM klub JOIN stadion ON klub.stadion_id=stadion.stadion_id 
    JOIN igrac ON igrac.klub_id=klub.klub_id`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.send(JSON.stringify(result.rows));
      console.log(`All rows sent...`);
      res.end();
    })
  })
});

//*******************//
//  API methods      //
//*******************//

class ResponseWrapper {
  constructor(status, message, response) {
    this.status = status;
    this.message = message;
    this.response = response;
  }
}

app.get('/openapi', (req, res) => {
  res.download(path.join(__dirname, 'openapi.json'));
});

app.get('/clubs', (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`SELECT
    klub_id,
    klub_naziv,
    kratica,
    nadimak,
    klub_grad,
    klub_drzava,
    osnovan,
    predsjednik,
    trener,
    liga,
    web,
    stadion_id
    FROM klub`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      if (result.rows.length == 0) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', 'Clubs not found', null)));
        res.end();
        return
      }
      res.contentType('application/json');
      res.send(JSON.stringify(new ResponseWrapper('OK', 'Fetched club objects', result.rows)));
      console.log(`Clubs sent...`);
      res.end();
    })
  })
});

app.get('/clubs/:id', (req, res) => {
  var club_id = req.params.id;
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`SELECT
    klub_id,
    klub_naziv,
    kratica,
    nadimak,
    klub_grad,
    klub_drzava,
    osnovan,
    predsjednik,
    trener,
    liga,
    web,
    stadion_id
    FROM klub
    WHERE klub_id = ${club_id}`, (err, result) => {
      release()
      if (err) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', `Club with ID ${club_id} not found`, null)));
        res.end();
        return console.error('Error executing query', err.stack)
      }
      if (result.rows.length == 0) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', `Club with ID ${club_id} not found`, null)));
        res.end();
        return
      }
      res.contentType('application/json');
      res.send(JSON.stringify(new ResponseWrapper('OK', `Fetched club object`, result.rows)));
      console.log(`Clubs sent...`);
      res.end();
    })
  })
});

app.get('/players', (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`SELECT
    igrac_id, 
    ime,
    prezime,
    igrac_drzava,
    pozicija,
    datum_rod,
    klub_id
    FROM igrac`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      if (result.rows.length == 0) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', 'Players not found', null)));
        res.end();
        return
      }
      res.contentType('application/json');
      res.send(JSON.stringify(new ResponseWrapper('OK', 'Fetched player objects', result.rows)));
      console.log(`Players sent...`);
      res.end();
    })
  })
});

app.get('/players/:id', (req, res) => {
  var player_id = req.params.id;
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`SELECT
    igrac_id, 
    ime,
    prezime,
    igrac_drzava,
    pozicija,
    datum_rod,
    klub_id
    FROM igrac
    WHERE igrac_id = ${player_id}`, (err, result) => {
      release()
      if (err) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', `Player with ID ${player_id} not found`, null)));
        res.end();
        return console.error('Error executing query', err.stack)
      }
      if (result.rows.length == 0) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', `Player with ID ${player_id} not found`, null)));
        res.end();
        return
      }
      res.contentType('application/json');
      res.send(JSON.stringify(new ResponseWrapper('OK', 'Fetched player object', result.rows)));
      console.log(`Players sent...`);
      res.end();
    })
  })
});

app.get('/stadiums', (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`SELECT 
    stadion_id,
    stadion_naziv,
    stadion_grad,
    stadion_drzava,
    adresa,
    kapacitet,
    podloga
    FROM stadion`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      if (result.rows.length == 0) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', 'Stadiums not found', null)));
        res.end();
        return
      }
      res.contentType('application/json');
      res.send(JSON.stringify(new ResponseWrapper('OK', 'Fetched stadium objects', result.rows)));
      console.log(`Stadiums sent...`);
      res.end();
    })
  })
});

app.get('/stadiums/:id', (req, res) => {
  var stadium_id = req.params.id;
  pool.connect((err, client, release) => {
    if (err) {
      res.status(404);
      res.contentType('application/json');
      res.send(JSON.stringify(new ResponseWrapper('Not Found', `Stadium with ID ${stadium_id} not found`, null)));
      res.end();
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`SELECT 
    stadion_id,
    stadion_naziv,
    stadion_grad,
    stadion_drzava,
    adresa,
    kapacitet,
    podloga
    FROM stadion
    WHERE stadion_id = ${stadium_id}`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      if (result.rows.length == 0) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', `Stadium with ID ${stadium_id} not found`, null)));
        res.end();
        return
      }
      res.contentType('application/json');
      res.send(JSON.stringify(new ResponseWrapper('OK', 'Fetched stadium object', result.rows)));
      console.log(`Stadium sent...`);
      res.end();
    })
  })
});

app.post('/stadiums', (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }

    client.query(`INSERT INTO stadion VALUES (
      ${req.body.stadion_id}, '${req.body.stadion_naziv}', '${req.body.stadion_grad}', 
      '${req.body.stadion_drzava}', '${req.body.adresa}', ${req.body.kapacitet}, '${req.body.podloga}');`, (err, result) => {
      release()
      if (err) {
        if (err.message.startsWith("duplicate key value")) {
          res.status(409);
          res.contentType('application/json');
          res.location(`stadiums/${req.body.stadion_id}`);
          res.send(JSON.stringify(new ResponseWrapper('Conflict', `Stadium with ID ${req.body.stadion_id} already exists`, null)));
          res.end();
          return
        }

        res.status(400);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Bad Request', `Invalid request body parameters`, null)));
        res.end();
        return console.error('Error executing query', err.message)
      }
      res.status(201);
      res.contentType('application/json');
      res.location(`stadiums/${req.body.stadion_id}`);
      res.send(JSON.stringify(new ResponseWrapper('Created', 'Stadium object created', null)));
      console.log(`Stadium object created...`);
      res.end();
    })
  })
});

app.put('/stadiums/:id', (req, res) => {
  var stadium_id = req.params.id;
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }

    var query = 'UPDATE SET ';
    if (req.body.stadion_naziv) query += 'stadion_naziv = ' + "'" + req.body.stadion_naziv + "',";
    if (req.body.stadion_grad) query += 'stadion_grad = ' + "'" + req.body.stadion_grad + "',";
    if (req.body.stadion_drzava) query += 'stadion_drzava = ' + "'" + req.body.stadion_drzava + "',";
    if (req.body.adresa) query += 'adresa = ' + "'" + req.body.adresa + "',";
    if (req.body.kapacitet) query += 'kapacitet = ' + req.body.kapacitet + ",";
    if (req.body.podloga) query += 'podloga =' + "'" + req.body.podloga + "',";
    query = query.slice(0, -1) + ';';
    console.log(query);

    client.query(`SELECT stadion_id FROM stadion WHERE stadion_id = ${stadium_id}; INSERT INTO stadion VALUES (
      ${stadium_id}, '${req.body.stadion_naziv}', '${req.body.stadion_grad}', 
      '${req.body.stadion_drzava}', '${req.body.adresa}', ${req.body.kapacitet?req.body.kapacitet:"0"}, '${req.body.podloga}')
      ON CONFLICT (stadion_id)
      DO ${query}`, (err, result) => {
      release()
      if (err) {
        res.status(400);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Bad Request', `Invalid request body parameters`, null)));
        res.end();
        return console.error('Error executing query', err.message)
      }
      if(result[0].rows.length > 0){
        res.status(200);
        res.contentType('application/json');
        res.location(`stadiums/${req.body.stadion_id}`);
        res.send(JSON.stringify(new ResponseWrapper('OK', 'Stadium object updated', null)));
        console.log(`Stadium object created...`);
        res.end();
      }
      res.status(201);
      res.contentType('application/json');
      res.location(`stadiums/${req.body.stadion_id}`);
      res.send(JSON.stringify(new ResponseWrapper('Created', 'Stadium object created', null)));
      console.log(`Stadium object created...`);
      res.end();
    })
  })
});

app.delete('/stadiums/:id', (req, res) => {
  var stadium_id = req.params.id;
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`DELETE FROM stadion
    WHERE stadion_id = ${stadium_id}`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      if (result.rowCount == 0) {
        res.status(404);
        res.contentType('application/json');
        res.send(JSON.stringify(new ResponseWrapper('Not Found', `Stadium with ID ${stadium_id} not found`, null)));
        res.end();
        return
      }
      res.contentType('application/json');
      res.send(JSON.stringify(new ResponseWrapper('OK', 'Deleted stadium object', null)));
      console.log(`Stadium sent...`);
      res.end();
    })
  })
});

// Handle 404/501 - Keep this as a last route
app.use(function (req, res, next) {
  res.status(501);
  res.contentType('application/json');
  res.send(JSON.stringify(new ResponseWrapper('Not Implemented', `Method not implemented for requested resource`, null)));
  res.end();
});