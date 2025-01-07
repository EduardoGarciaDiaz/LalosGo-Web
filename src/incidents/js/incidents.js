window.onload = function () {
    let role = getInstance().role;
    if (role !== roles.SALES_EXECUTIVE) {
        window.history.back();
    }

    fetch('/src/shared/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });

    loadIncidents();
}

async function loadIncidents() {
    let token = getInstance().token;

    try {
        let response = await axios.get(API_URL + '/incidents', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status < 300 && response.status > 199) {
            let incidents = response.data;
            let incidentsContainer = document.getElementById('incidents-container');
            incidentsContainer.innerHTML = '';
            for (const incident of incidents) {
                let card = await createIncidentCard(incident);
                incidentsContainer.appendChild(card);
            }
        }
    } catch (error) {
        handleException(error);
    }
}


async function createIncidentCard(incident) {
    let card = document.createElement('div');
    card.className = 'card';
    card.style.display = 'flex';
    card.style.flexDirection = 'row';
    card.style.alignItems = 'center';
    card.style.marginBottom = '16px';
    card.style.border = '1px solid #ddd';
    card.style.borderRadius = '8px';
    card.style.overflow = 'hidden';

    let cardImage = document.createElement('img');
    cardImage.className = 'card-img';
    cardImage.alt = 'Incident Image';
    cardImage.style.width = '255px';
    cardImage.style.height = '255px';
    cardImage.style.objectFit = 'cover';

    try {
        cardImage.src = await getImageUrl(incident._id);
    } catch (error) {
        cardImage.src = 'https://archive.org/download/placeholder-image/placeholder-image.jpg';
    }

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.style.padding = '16px';
    cardBody.style.flexGrow = '1';

    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = 'Incidente en Orden: ' + incident.orderNumber.orderNumber;

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = incident.description;

    let cardDate = document.createElement('p');
    cardDate.className = 'card-text';
    cardDate.textContent = 'Fecha: ' + formatDate(incident.date);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    card.appendChild(cardImage);
    card.appendChild(cardBody);

    return card;
}

function formatDate(date) {
    let dateFormatted = new Date(date);
    return dateFormatted.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

async function getImageUrl(incidentId) {
    let token = getInstance().token;
    try {
        let response = await axios.get(API_URL + '/incidents/' + incidentId + '/photo', {
            headers: { 'Authorization': `Bearer ${token}` },
            responseType: 'blob',
        });

        if (response.status >= 200 && response.status < 300) {
            let blob = response.data;
            return URL.createObjectURL(blob); // Asegúrate de devolver el URL
        } else {
            return 'https://archive.org/download/placeholder-image/placeholder-image.jpg';
        }
    } catch (error) {
        return 'https://archive.org/download/placeholder-image/placeholder-image.jpg';
    }
}