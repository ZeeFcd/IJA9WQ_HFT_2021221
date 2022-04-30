﻿let weddings = [];
let connection = null;
getweddingdata();
setupSignalRwedding();

function setupSignalRwedding() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:18885/hub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("WeddingCreated", (user, message) => {
        getweddingdata();
    });

    connection.on("WeddingUpdated", (user, message) => {
        getweddingdata();
    });

    connection.on("WeddingDeleted", (user, message) => {
        getweddingdata();
    });

    connection.onclose(async () => {
        await start();
    });
    start();


}

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function getweddingdata() {
    await fetch('http://localhost:18885/wedding')
        .then(x => x.json())
        .then(y => {
            weddings = y;
            console.log(weddings);
            //display();
        });
}

function remove(id) {
    fetch('http://localhost:18885/wedding/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
        body: null
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            getweddingdata();
        })
        .catch((error) => { console.error('Error:', error); });

}

function create() {
    let name = document.getElementById('actorname').value;
    fetch('http://localhost:18885/wedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { actorName: name })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            getweddingdata();
        })
        .catch((error) => { console.error('Error:', error); });

}