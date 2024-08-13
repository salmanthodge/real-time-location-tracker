// const socket = io();

// if(navigator.geolocation){
//     navigator.geolocation.watchPosition((position)=>{
//         const {latitude,longitude} = position.coords;
//         socket.emit("send-location", {latitude, longitude})
//     },(error) =>{
//         console.error(error)
//     },
//     {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0
//     }
//     )
// }

// const map = L.map("map").setView([0,0],16)

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
//     attribution: "Sherlock"
// }).addTo(map)

// const markers = {}

// socket.on("recieve-location",(data) =>{
//     const { id, latitude, longitude } = data;
//     map.setView([latitude,longitude],16);

//     if(markers[id]){
//         markers[id].setLatLng([latitude,longitude]);
//     }else{
//         markers[id] = L.marker([latitude,longitude]).addTo(map)
//     }
// })

// socket.on("user-disconnected",(id)=>{
//     if(markers[id]){
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// })


//new 

const socket = io();

// Function to apply a small offset based on socket ID
function applyOffset(latitude, longitude, id) {
    // Convert socket ID to a number (e.g., using the char code of the first character)
    const offsetFactor = id.charCodeAt(0) % 10; // Simple hash-like function for id
    const latOffset = 0.0001 * offsetFactor; // Small offset for latitude
    const lngOffset = 0.0001 * offsetFactor; // Small offset for longitude

    return {
        latitude: latitude + latOffset,
        longitude: longitude + lngOffset,
    };
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Sherlock",
}).addTo(map);

const markers = {};

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;

    // Apply the offset based on the socket ID
    const { latitude: offsetLatitude, longitude: offsetLongitude } = applyOffset(
        latitude,
        longitude,
        id
    );

    map.setView([offsetLatitude, offsetLongitude], 16);

    if (markers[id]) {
        markers[id].setLatLng([offsetLatitude, offsetLongitude]);
    } else {
        markers[id] = L.marker([offsetLatitude, offsetLongitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
