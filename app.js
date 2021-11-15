const fs = require('fs');
const https = require('https');
const path = require('path');
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/cert.pem', 'utf8');
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