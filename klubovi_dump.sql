CREATE TABLE stadion
(
	stadion_id INT PRIMARY KEY,
	stadion_naziv VARCHAR(100) NOT NULL,
	stadion_grad VARCHAR(100),
	stadion_drzava VARCHAR(100),
	adresa VARCHAR(100),
	kapacitet INTEGER,
	podloga VARCHAR(50)
);

CREATE TABLE klub
(
	klub_id SERIAL PRIMARY KEY,
	klub_naziv VARCHAR(100) NOT NULL,
	kratica VARCHAR(10),
	nadimak VARCHAR(50),
	klub_grad VARCHAR(100),
	klub_drzava VARCHAR(100),
	osnovan DATE,
	predsjednik VARCHAR(70),
	trener VARCHAR(70),
	liga VARCHAR(50),
	web VARCHAR(200),
	stadion_id INT,
	FOREIGN KEY (stadion_id) REFERENCES stadion(stadion_id)
);

CREATE TABLE igrac
(
	igrac_id SERIAL PRIMARY KEY,
	ime VARCHAR(100) NOT NULL,
	prezime VARCHAR(100),
	igrac_drzava VARCHAR(100),
	pozicija VARCHAR(20),
	datum_rod DATE,
	klub_id INT,
	FOREIGN KEY (klub_id) REFERENCES klub(klub_id)
);

INSERT INTO stadion (stadion_id, stadion_naziv, stadion_grad, stadion_drzava, adresa, kapacitet, podloga) VALUES 
(1, 'Stadio Giuseppe Meazza', 'Milano', 'Italija', 'Via Piccolomini 5, 20151', 80018, 'hibridna trava'),
(2, 'Stadio Olimpico', 'Rim', 'Italija', 'Viale dei Gladiatori, 00135', 72698, 'prirodna trava'),
(3, 'Stamford Bridge', 'London', 'Engleska', 'Fulham Road, SW6 1HS', 41837, 'hibridna trava'),
(4, 'Anfield', 'Liverpool', 'Engleska', 'Anfield Road, L4 0TH', 53394, 'hibridna trava'),
(5, 'Estadio Metropolitano', 'Madrid', 'Španjolska', 'Avenida de Luis Aragonés 4, 28022', 68456, 'prirodna trava'),
(6, 'Estadio Santiago Bernabéu', 'Madrid', 'Španjolska', 'Avenida de Concha Espina 1, 28036', 81044, 'hibridna trava'),
(7, 'Allianz Arena', 'München', 'Njemačka', 'Werner-Heisenberg-Allee 25, 80939', 75024, 'prirodna trava'),
(8, 'Signal Iduna Park', 'Dortmund', 'Njemačka', 'Strobelallee 50, 44139', 81365, 'prirodna trava');

SET datestyle= 'German, DMY';
INSERT INTO klub (klub_id, klub_naziv, kratica, nadimak, klub_grad, klub_drzava, osnovan, predsjednik, trener, liga, web, stadion_id) VALUES 
(1, 'AC Milan', 'MIL', 'I Rossoneri', 'Milano', 'Italija', '16.12.1899', 'Paolo Scaroni', 'Stefano Pioli', 'Serie A', 'https://www.acmilan.com/en', 1),
(2, 'FC Internazionale Milano', 'INT', 'I Nerazzurri', 'Milano', 'Italija', '09.03.1908', 'Steven Zhang', 'Simone Inzaghi', 'Serie A', 'https://www.inter.it/en', 1),
(3, 'AS Roma', 'ROM', 'I Giallorossi', 'Rim', 'Italija', '07.06.1926', 'Dan Friedkin', 'José Mourinho', 'Serie A', 'https://www.asroma.com/', 2),
(4, 'SS Lazio', 'LAZ', 'I Biancocelesti', 'Rim', 'Italija', '09.01.1900', 'Claudio Lotito', 'Maurizio Sarri', 'Serie A', 'https://www.sslazio.it/en/', 2),
(5, 'Chelsea FC', 'CHE', 'The Blues', 'London', 'Engleska', '10.03.1905', 'Bruce Buck', 'Thomas Tuchel', 'Premier League', 'https://www.chelseafc.com/en', 3),
(6, 'Liverpool FC', 'LIV', 'The Reds', 'Liverpool', 'Engleska', '03.06.1892', 'Tom Werner', 'Jürgen Klopp', 'Premier League', 'https://www.liverpoolfc.com/', 4),
(7, 'Atlético Madrid', 'ATM', 'Los Colchoneros', 'Madrid', 'Španjolska', '26.04.1903', 'Enrique Cerezo', 'Diego Simeone', 'La Liga', 'https://en.atleticodemadrid.com/', 5),
(8, 'Real Madrid CF', 'RMA', 'Los Blancos', 'Madrid', 'Španjolska', '06.03.1902', 'Florentino Pérez', 'Carlo Ancelotti', 'La Liga', 'https://www.realmadrid.com/en', 6),
(9, 'FC Bayern München', 'BAY', 'Die Bayern', 'München', 'Njemačka', '27.02.1900', 'Herbert Hainer', 'Julian Nagelsmann', 'Bundesliga', 'https://fcbayern.com/en', 7),
(10, 'Borussia Dortmund', 'DOR', 'Die Borussen', 'Dortmund', 'Njemačka', '19.12.1909', 'Reinhard Rauball', 'Marco Rose', 'Bundesliga', 'https://www.bvb.de/eng/', 8);

INSERT INTO igrac (ime, prezime, igrac_drzava, pozicija, datum_rod, klub_id) VALUES
('Sandro', 'Tonali', 'Italija', 'MF', '08.05.2000', 1),
('Mike', 'Maignan', 'Francuska', 'GK', '03.07.1995', 1),
('Zlatan', 'Ibrahimović', 'Švedska', 'FW', '03.10.1981', 1),
('Simon', 'Kjaer', 'Danska', 'DF', '26.03.1989', 1),
('Lautaro', 'Martínez', 'Argentina', 'FW', '22.8.1997', 2),
('Marcelo', 'Brozović', 'Hrvatska', 'MF', '16.11.1992', 2),
('Milan', 'Škriniar', 'Slovačka', 'DF', '11.02.1995', 2),
('Samir', 'Handanovič', 'Slovenija', 'GK', '14.07.1984', 2),
('Tammy', 'Abraham', 'Engleska', 'FW', '02.10.1997', 3),
('Rui', 'Patrício', 'Portugal', 'GK', '15.02.1988', 3),
('Nicolò', 'Zaniolo', 'Italija', 'MF', '02.07.1999', 3),
('Gianluca', 'Mancini', 'Italija', 'DF', '17.04.1996', 3),
('Pepe', 'Reina', 'Španjolska', 'GK', '31.08.1982', 4),
('Sergej', 'Milinković-Savić', 'Srbija', 'MF', '27.02.1995', 4),
('Ciro', 'Immobile', 'Italija', 'FW', '20.02.1990', 4),
('Francesco', 'Acerbi', 'Italija', 'DF', '10.02.1988', 4),
('Edouard', 'Mendy', 'Senegal', 'GK', '01.03.1992', 5),
('Thiago', 'Silva', 'Brazil', 'DF', '22.09.1984', 5),
('Mateo', 'Kovačić', 'Hrvatska', 'MF', '06.05.1994', 5),
('Romelu', 'Lukaku', 'Belgija', 'FW', '13.05.1993', 5),
('Alisson', 'Becker', 'Brazil', 'GK', '02.10.1992', 6),
('Virgil', 'van Dijk', 'Nizozemska', 'DF', '08.07.1991', 6),
('Jordan', 'Henderson', 'Engleska', 'MF', '17.06.1990', 6),
('Mohamed', 'Salah', 'Egipat', 'FW', '15.06.1992', 6),
('Jan', 'Oblak', 'Slovenija', 'GK', '07.01.1993', 7),
('José María', 'Giménez', 'Španjolska', 'DF', '20.01.1995', 7),
('Marcos', 'Llorente', 'Španjolska', 'MF', '30.01.1995', 7),
('Luis', 'Suárez', 'Urugvaj', 'FW', '24.01.1987', 7),
('Thibaut', 'Courtois', 'Belgija', 'GK', '11.05.1992', 8),
('David', 'Alaba', 'Austrija', 'DF', '24.06.1992', 8),
('Luka', 'Modrić', 'Hrvatska', 'MF', '09.09.1985', 8),
('Karim', 'Benzema', 'Francuska', 'FW', '19.12.1987', 8),
('Manuel', 'Neuer', 'Njemačka', 'GK', '27.03.1986', 9),
('Josip', 'Stanišić', 'Hrvatska', 'DF', '02.04.2000', 9),
('Joshua', 'Kimmich', 'Njemačka', 'MF', '08.02.1995', 9),
('Robert', 'Lewandowski', 'Poljska', 'FW', '21.08.1988', 9),
('Roman', 'Bürki', 'Švicarska', 'GK', '14.11.1990', 10),
('Mats', 'Hummels', 'Njemačka', 'DF', '16.12.1988', 10),
('Jude', 'Bellingham', 'Engleska', 'MF', '29.06.2003', 10),
('Erling Braut', 'Haaland', 'Norveška', 'FW', '21.07.2000', 10);
SET datestyle= 'ISO, YMD';