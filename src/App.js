import React, { useState, useEffect, } from 'react';
import './App.css';

function App() {
  const [settings, setSettings] = useState({
    brightness: { default: 100, curr: 0, min: 0, max: 200 },
    saturation: { default: 100, curr: 0, min: 0, max: 200 },
    contrast: { default: 100, curr: 0, min: 0, max: 100 },
    blur: { default: 0, curr: 0, min: 0, max: 25 },
    grayscale: { default: 0, curr: 0, min: 0, max: 100 },
    opacity: { default: 100, curr: 0, min: 0, max: 100 },
    hueRotate: { default: 0, curr: 0, min: 0, max: 360 },
    sepia: { default: 0, curr: 0, min: 0, max: 100 },
    inversion: { default: 0, curr: 0, min: 0, max: 100 },
  });

  const [filterContent, setFilterContent] = useState([]);
  const [image, setImage] = useState('');

  const filterList = Array.from({ length: 8 }, (_, index) => (
    <canvas key={index} className="canvas filter" height="100" width="100"></canvas>
  ));

  function generateFilter() {
    const { brightness, saturation, contrast, blur, grayscale, opacity, hueRotate, sepia, inversion } = settings;
    return `brightness(${brightness.curr}%) saturate(${saturation.curr}%) contrast(${contrast.curr}%) blur(${blur.curr}px) grayscale(${grayscale.curr}%) opacity(${opacity.curr}%) hue-rotate(${hueRotate.curr}deg) sepia(${sepia.curr}%) invert(${inversion.curr}%)`;
  }

  function renderImage(image) {
    const canvas = document.getElementById('main-canvas');
    const canvasCtx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    canvasCtx.filter = generateFilter();
    canvasCtx.drawImage(image, 0, 0);
  }

  const updateSettings = (event) => {
    if (!image) return;
    const key = event.target.id;
    const value = event.target.value;
    console.log(key, value);
    setSettings((prevSettings) => ({ ...prevSettings, [key]: { ...prevSettings[key], curr: value } }));
    renderImage(image);
  };

  useEffect(() => {
    if (image) {
      renderImage(image);
    }
  }, [image, settings]);

  // const handleFilterList = () => {
  //   setFilterContent(filterList);
  //   renderSubImages();
  // };

  const slider = (event) => {
    return (
      <div id='slider-div'>
        <input
          type="range"
          id={event.target.id}
          className='range-'
          min={settings[event.target.id].min}
          max={settings[event.target.id].max}
          defaultValue={settings[event.target.id].curr}
          onChange={updateSettings}
        />
        <h4>{event.target.id}</h4>
      </div>
    );
  };

  const showSlider = (event) => {
    setFilterContent([slider(event)]);
  };

  const editList = [
    // <div onClick={handleFilterList}>
    //   <img src="/filter.svg" alt="Filter" />
    //   <h5>Filter</h5>
    // </div>,
    <div id='brightness' className='icon' onClick={showSlider} > <img src='/brightness.svg' alt='brightness' />
      <h5>Brightness</h5></div>,
    <div id='contrast' className='icon' onClick={showSlider} > <img src="/contrast.svg" alt='contrast'/> <h5>Contrast</h5></div>,
    <div id='blur' className='icon' onClick={showSlider} > <img src="blur.svg" alt='blur' /> <h5>Blur</h5></div>,
    <div id='opacity' className='icon' onClick={showSlider} > <img src='/opacity.svg' alt='opacity'/>
      <h5>Opacity</h5></div>,
    <div id='grayscale' className='icon' onClick={showSlider} > <img src="/grayscale.svg" alt='grayscale'/> <h5>Grayscale</h5></div>,
    <div id='hueRotate' className='icon' onClick={showSlider} > <img src="/hueRotate.svg" alt='hue-rotate'/> <h5>Hue-rotate</h5></div>,
    <div id='inversion' className='icon' onClick={showSlider} ><img src='/rotate.svg' alt='inversion' />
      <h5>Inversion</h5></div>,
    <div id='saturation' className='icon' onClick={showSlider} > <img src='/saturation.svg' alt='saturation'/>
      <h5>Saturation</h5></div>,
    <div id='sepia' className='icon' onClick={showSlider} > <img src="sepia.svg" alt='sepia' /> <h5>Sepia</h5></div>,
  ];

  const renderSubImages = (img) => {
    const canvasList = document.getElementsByClassName('canvas');
    for (let i = 0; i < canvasList.length; i++) {
      const subCanvas = canvasList[i];
      const subContext = subCanvas.getContext('2d');
      subContext.drawImage(img, 0, 0, 100, 100);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSettings((prevSettings) => {
          // Reset the settings to default values
          const newSettings = {};
          for (const key in prevSettings) {
            newSettings[key] = { ...prevSettings[key], curr: prevSettings[key].default.toString() };
          }
          return newSettings;
        });
        renderImage(img);
        renderSubImages(img);
      };

      img.src = e.target.result;
      setImage(img);
    };

    reader.readAsDataURL(file);
  };

  const undoFilter = () => {
    // Create a copy of the settings state with default values
    const resetSettings = Object.keys(settings).reduce((acc, key) => {
      acc[key] = { ...settings[key], curr: settings[key].default };
      return acc;
    }, {});

    // Set the state to resetSettings
    setSettings(resetSettings);

    // Render the image with the default filters
    renderImage(image);
  };

  function downloadImage() {
    const canvas = document.getElementById('main-canvas');
    const image = canvas.toDataURL('image/png');

    // Add the _edited suffix to the saved image name
    const imageName = 'edited_image.png';

    // Save the image to local storage
    localStorage.setItem(imageName, image);

    const alertStyle = {
      position: 'fixed',
      top: '10%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'transparent',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '20px',
      fontWeight: 'bold',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    };

    
    // Show the custom alert
    const customAlert = document.createElement('div');
    customAlert.innerHTML = 'Image saved to local storage!';
    Object.assign(customAlert.style, alertStyle);
    document.body.appendChild(customAlert);

    // Remove the custom alert after 2 seconds
    setTimeout(() => {
      document.body.removeChild(customAlert);
    }, 2000);
  };




  return (
    <div id="editor">
      <div id="topbar">
        <input className='icon' id="file-input" type="file" name="image" onChange={handleFileUpload} />
        <div id="topbar-icons">
          <div className='icon' onClick={undoFilter}><img src="/reset.svg" alt="Icon 1" />Reset</div>
          <div className='icon' onClick={downloadImage}><img src="/download.svg" alt="Icon 2" />Download</div>
        </div>
      </div>
      <div id="canvas-container">
        <canvas
          id="main-canvas"
          style={{ maxWidth: '600px', maxHeight: '300px', borderRadius: '8px' }}
        ></canvas>
      </div>
      <div id="filter-area">{filterContent}</div>
      <div id="edit-list">{editList}</div>
    </div>
  );
}

export default App;