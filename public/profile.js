fetchUser()

async function fetchUser() {
    try {
        const res = await fetch('/profile');
        const user = await res.json();
        console.log(user);

        document.getElementById('picture').src = user.picture;
        document.getElementById('name').textContent = user.name;
        document.getElementById('nickname').textContent = user.nickname;
        document.getElementById('email').textContent = user.email;
    } catch (e) {
        console.log(`fetching user failed.${e}`);
    }
}