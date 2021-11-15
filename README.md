# Nogometni klubovi - otvoreni skup podataka

Dobrodošli u repozitorij otvorenih podataka o nogometnim klubovima.

Ovaj kataloški skup podataka napravljen je u sklopu laboratorijskih vježbi predmeta Otvoreno računarstvo preddiplomskog i diplomskog studija Fakulteta elektrotehnike i računarstva u Zagrebu. Skupu je moguće pristupiti preko web-stranice čiji se izvorni kod nalazi u repozitoriju.

Cilj ovog skupa podataka je pružiti podatke za pregled i analizu nogometnih klubova, igrača i stadiona na kojima ti klubovi igraju. Podaci su trenutno isključivo dostupni na hrvatskom jeziku u različitim formatima.

Skup podataka koristi MIT licencu. MIT licenca je kratka i jednostavna otvorena licenca s jedinim uvjetom da proizvodi nastali iz originalnog sadrže informacije o autorskim pravima i istu licencu nad onim dijelom proizvoda koji je identičan originalnom.

## Info

| Naziv  | Nogometni klubovi     |
| :--- | :--- |
| Licenca     | [MIT License](https://opensource.org/licenses/MIT) |
| Autor       | Josip Arelić (josip555@example-mail.com)|
| Jezik | hrvatski |
| Dostupni formati | CSV, JSON |
| Format datuma | [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) (YYYY-MM-DD)|
| Verzija     |  1.0   |


## Struktura podataka

Baza podataka se sastoji od tri relacije(klub, stadion, igrac). Svaki klub ima najviše jedan stadion, a na jednom stadionu može biti više klubova. Svaki igrač ima jedan klub, a svaki klub ima više igrača.

### Klub

| Polje | Opis | Tip podatka | 
| :--- | :--- | :------ | 
| klub_id | identifikator kluba | int | 
| klub_naziv | službeni naziv kluba | string | 
| kratica | skraćena verzija naziva | string | 
| nadimak | nadimak kluba | string | 
| klub_grad | grad kojeg taj klub predstavlja | string | 
| klub_drzava | država kojoj klub pripada | string | 
| osnovan | datum osnutka kluba | date | 
| predsjednik | ime i prezime predsjednika kluba | string | 
| trener | ime i prezime trenera kluba | string | 
| liga | liga u kojoj taj klub nastupa | string | 
| web | URL službene web stranice kluba | string | 

### Stadion

| Polje | Opis | Tip podatka | 
| :--- | :--- | :------ | 
| stadion_id | identifikator stadiona | int |
| stadion_naziv | službeni naziv stadiona | string | 
| stadion_grad | grad u kojem se stadion nalazi | string | 
| stadion_drzava | država u kojoj se klub nalazi | string | 
| adresa | ime ulice i broj te poštanski broj | string | 
| kapacitet | koliko gledatelja stadion može primiti | int | 
| podloga | podloga terena(travnati, umjetni...) | string | 

### Igrač

| Polje | Opis | Tip podatka | 
| :--- | :--- | :------ | 
| igrac_id | identifikator igrača | int | true 
| ime | ime igrača | string | 
| prezime | prezime igrača | string | 
| igrac_drzava | država za koju igrač igra | string | 
| pozicija | GK-vratar, DF-branič, MF-veznjak, FW-napadač | string | 
| datum_rod | datum rođenja | date | 
