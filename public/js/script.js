const socket=io();     //a connection request goes to backend through socket 

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
     const{latitude,longitude}=position.coords;
     socket.emit("send-location",{latitude,longitude});
    },
    (error)=>{
         console.error(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,
    }
 );
}

var map=L.map("map");
map.setView([0,0],10);

    
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers={};

socket.on("receive-location",(data)=>{
    const{id,latitude,longitude}=data;
    map.setView([latitude,longitude],10);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})