import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup  } from 'react-map-gl';
import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
    const [logEntries, setLogEntries] = useState([]);
    const [showPopup, setShowPopup] = useState({});
    const [addEntryLocation, setAddEntryLocation] = useState(null);
    const [viewport, setViewport] = useState({
        width: '100vw',
        height: '100vh',
        latitude: 41.902782,
        longitude: 12.496366,
        zoom: 12
    });
   


    const getEntries = async () => {
        const logEntries = await listLogEntries();
        setLogEntries(logEntries);
    };

    useEffect(() => {
        getEntries();
    }, []);

    const showAddMarkerPopup = (event) => {
        const [longitude, latitude] = event.lngLat;
        setAddEntryLocation({
            latitude,
            longitude,
        });
    };

    
    return (
        <ReactMapGL
            {...viewport}
            mapStyle="mapbox://styles/tuber/ckay0d2wv14vj1io1j2o2cy6u"
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            onViewportChange={nextViewport => setViewport(nextViewport)}
            onDblClick={showAddMarkerPopup}

        >
            {

                logEntries.map(entry => (
                    <React.Fragment key= { entry._id } >
                    <Marker
                            latitude={entry.latitude}
                            longitude={entry.longitude}
                        >
                            <div
                                    onClick={() => setShowPopup({
                                    //...showPopup,
                                        [entry._id]: true,
                                    })}

                        >
                            <img className="marker"
                                style={{
                                    height: `${6 * viewport.zoom}px`,
                                    width: `${6 * viewport.zoom}px`,

                                }}

                                src="https://i.imgur.com/y0G5YTX.pngrker" 
                                alt="marker"
                                />
                            </div>
                        </Marker>
                        {
                            showPopup[entry._id] ? (
                                <Popup
                                    latitude={entry.latitude}
                                    longitude={entry.longitude}
                                    closeButton={true}
                                    closeOnClick={false}
                                    dynamicPosition={true}
                                    onClose={() => setShowPopup({})}
                                    anchor="top" >
                                    <div className="popup">
                                        <h3>{entry.title}</h3>
                                        <p>{entry.comments}</p>
                                        <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                                        {entry.image && <img src={entry.image} alt={entry.title} />}
                                    </div>
                                </Popup>
                            ) : null
                        }
                    </React.Fragment>
                  ))
            }
            {
                addEntryLocation ? (
                    <React.Fragment>
                        <Marker
                            latitude={addEntryLocation.latitude}
                             longitude={addEntryLocation.longitude}
                        >
                            <div>

                                <svg xmlns="http://www.w3.org/2000/svg" className="marker red" height="96px" viewBox="-96 0 464 464" width="96px"><path d="m272 428c0-19.882812-60.890625-36-136-36s-136 16.117188-136 36 60.890625 36 136 36 136-16.117188 136-36zm0 0" fill="#adabac" /><path d="m120 160h32v256c0 8.835938-7.164062 16-16 16s-16-7.164062-16-16zm0 0" fill="#494342" /><path d="m232 96c0 53.019531-42.980469 96-96 96s-96-42.980469-96-96 42.980469-96 96-96 96 42.980469 96 96zm0 0" fill="#ad2943" /><path d="m200 96c0 35.347656-28.652344 64-64 64s-64-28.652344-64-64 28.652344-64 64-64 64 28.652344 64 64zm0 0" fill="#ee3446" /></svg>




                            </div>
                          
                        </Marker>
                    <Popup
                        latitude={addEntryLocation.latitude}
                        longitude={addEntryLocation.longitude}
                        closeButton={true}
                        closeOnClick={false}
                        dynamicPosition={true}
                        onClose={() => setAddEntryLocation(null)}
                        anchor="top" >
                        <div className="popup">
                                <LogEntryForm onClose={() => {
                                    setAddEntryLocation(null);
                                    getEntries();
                                }} location={addEntryLocation} />
                            </div>
                    </Popup>
                    </React.Fragment>
    ) : null
}
    </ReactMapGL >
  );
}
export default App;