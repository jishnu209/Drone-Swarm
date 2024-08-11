import React, { useState } from 'react';
import { GoogleMap, LoadScript, OverlayView, Polygon ,Marker} from '@react-google-maps/api';
import axios from 'axios';
import droneImage from './drone.png'; 

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 17.397053,
  lng: 78.490183
};

function MyMap() {
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [droneMarkers, setDroneMarkers] = useState([]);
  
  
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState({});
const [currentEvent, setCurrentEvent] = useState(null);
const [maxDoubleClickMarkers, setMaxDoubleClickMarkers] = useState(5);

let singleClickTimeout = null;
const saveEventDataToServer = () => {
  const url = "http://localhost:5000/receive_data";

  const dataToSend = {
    geofence: polygonPoints,
    droneMarkers: droneMarkers,
    events: events
  };

  axios.post(url, dataToSend)
     .then(response => {
         console.log("Response:", response.data);
     })
     .catch(error => {
         console.error("There was an error sending the data:", error);
     });
}

 //validation func






const handleMapDoubleClick = event => {
  clearTimeout(singleClickTimeout); 
  if (!currentEvent) return;
  if (events[currentEvent] && events[currentEvent].positions.length >= maxDoubleClickMarkers) {
    alert("You've reached the maximum number of Drones avalaible  for this event!");
    return;
}

  const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };

  const polygon = new window.google.maps.Polygon({ paths: polygonPoints });
  if (!window.google.maps.geometry.poly.containsLocation(event.latLng, polygon)) {
      alert("Double-clicked outside the geofence");
      return;
  }
  //validation lall


  setEvents(prevEvents => {
      const updatedEvent = [...prevEvents[currentEvent].positions, newPoint];
      return { ...prevEvents, [currentEvent]: { ...prevEvents[currentEvent], positions: updatedEvent } };
  });
};

// the validation of the points
// Checks if a point is inside the polygon


// Checks if a new drone collides with existing drones



// Now validate the droneMarkers and events


// Use the function





const handleAddEvent = () => {
  if (eventName && !events[eventName]) {
    setEvents(prevEvents => ({
      ...prevEvents,
      [eventName]: { positions: [], height: 4 }
    }));
    setCurrentEvent(eventName);
    setEventName('');
  }
};

// changing of the points in .....
const handleDragEnd = (e, idx) => {
  const newLat = e.latLng.lat();
  const newLng = e.latLng.lng();

  // If it's a drone marker:
  

  // If it's an event position:
  setEvents(prevEvents => {
    const updatedEvents = { ...prevEvents };
    updatedEvents[currentEvent].positions[idx] = { lat: newLat, lng: newLng };
    return updatedEvents;
  });
};



  

  const handleMapClick = event => {
    singleClickTimeout = setTimeout(() => {
      console.log("Map clicked!"); 
   // This should log on every map click

    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };

    if (polygonPoints.length < 4) {
        setPolygonPoints(points => [...points, newPoint]);
        return;
    }

    if (droneMarkers.length < 5) {
        const polygon = new window.google.maps.Polygon({ paths: polygonPoints });
        if (window.google.maps.geometry.poly.containsLocation(event.latLng, polygon)) {
            console.log("Clicked inside the geofence!"); // Check if this logs
            setDroneMarkers(markers => [...markers, newPoint]);
        }
        else{
          alert("clicked outside the geofence");
        }
    }
  }, 200);
};


  return (
    <div>
            <input 
                value={eventName} 
                onChange={e => setEventName(e.target.value)} 
                placeholder="Event Name" 
            />
            <button onClick={handleAddEvent}>Add Event</button>
            <br>
            </br>
            <div>
    <label>Set Max drone Markers: </label>
    <input 
        type="number" 
        value={maxDoubleClickMarkers} 
        onChange={e => setMaxDoubleClickMarkers(Number(e.target.value))} 
    />
</div>
            
            <div>
            {Object.keys(events).map(name => (
  <div key={name}>
    <button 
      onClick={() => setCurrentEvent(name)}
      style={currentEvent === name ? { backgroundColor: 'blue', color: 'white' } : {}}
    >
      {name}
    </button>
    <input 
  type="range" 
  min="4" 
  max="15" // or whatever max height you want
  value={events[name].height}
  onChange={(e) => {
    const newHeight = Number(e.target.value);
    setEvents(prevEvents => ({
      ...prevEvents,
      [name]: { ...prevEvents[name], height: newHeight }
    }));
  }}
/>

    <span>{events[name].height} feets</span>
  </div>
))}

            </div>
    
    <LoadScript googleMapsApiKey="">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={19}
        onClick={handleMapClick}
        mapTypeId='satellite'
        onDblClick={handleMapDoubleClick}
      >
        
        {droneMarkers.map((point, idx) => (
                    <OverlayView
                        key={idx}
                        position={point}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div >
                            {idx + 1}
                        </div>
                    </OverlayView>
                ))}
        
        {polygonPoints.length >= 4 && (
    <Polygon
        paths={polygonPoints}
        options={{
            fillColor: 'lightgrey',
            fillOpacity: 0.4, 
            strokeColor: 'grey',
            strokeWeight: 2,
            clickable: false,
            draggable: false,
            editable: false,
            geodesic: false,
            zIndex: 1
        }}
    />
)}
 {
  currentEvent && events[currentEvent].positions.map((point, idx) => (
   
    <Marker 
  key={idx}
  position={point}
  label={(idx + 1).toString()}
  draggable={true}
  onDragEnd={(e) => handleDragEnd(e, idx)}
/>
    
    
  ))
}

      </GoogleMap>
     

<br></br>

    </LoadScript>
    <button onClick={saveEventDataToServer}>Save Events</button>
    </div>
    
  );
}

export default MyMap;
