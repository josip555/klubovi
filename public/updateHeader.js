updateHeader();


const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

async function updateHeader() {
    try {
        const res = await fetch('/authenticated');
        const authenticated = await res.json();
        console.log(res);
        let item1 = document.getElementById('item1');
        let item2 = document.getElementById('item2');
        let item3 = document.getElementById('item3');

        if (authenticated) {
            item1.children[0].textContent = "Korisnički profil";
            item1.children[0].href = "/profile.html";
            item1.style.display = 'inline';

            item2.children[0].textContent = "Osvježi preslike";
            item2.children[0].href = "/download/refresh";
            item2.style.display = 'inline';

            item3.children[0].textContent = "Odjava";
            item3.children[0].href = "/logout";
            item3.style.display = 'inline';
        } else {
            item1.children[0].textContent = "Prijava";
            item1.children[0].href = "/login";
            item1.style.display = 'inline';
        }
    } catch (e) {
        console.log(`fetching authentication status failed.${e}`);
    }
}