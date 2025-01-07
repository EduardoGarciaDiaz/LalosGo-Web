window.onload = function () {
    fetch('/src/shared/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
    loadProfile();
};

function loadProfile() {
    if (getInstance()) {
    const listGroup = document.getElementById('profile-list');
    fullNameItem = document.createElement('li');
    fullNameItem.classList.add('list-group-item');
    fullNameItem.innerHTML = `<strong>Nombre:</strong> ${getInstance().fullname}`;
    listGroup.appendChild(fullNameItem);

    usernameItem = document.createElement('li');
    usernameItem.classList.add('list-group-item');
    usernameItem.innerHTML = `<strong>Username:</strong> ${getInstance().username}`;
    listGroup.appendChild(usernameItem);

    emailItem = document.createElement('li');
    emailItem.classList.add('list-group-item');
    emailItem.innerHTML = `<strong>Email:</strong> ${getInstance().email}`;
    listGroup.appendChild(emailItem);
    }
}