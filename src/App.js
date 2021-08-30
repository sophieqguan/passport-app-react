import logo from './logo.svg';
import loader from './loader';
import './App.css';
import React,{ Component, useState} from "react";
import test from "./test.png";

function App() {
  const [state, setState] = useState(null);
  const apiURL = 'https://passport-formatter.herokuapp.com/upload';
  var imgFileURL = "";

  const changeGridDisplay = () => {
    document.getElementById("imgHolder").classList = 'col-m-6 col-sm-6 col-xs-12';
  }
  
  const updateImage = () => {
    var imgDisplay = document.getElementById("img");
    imgDisplay.src = imgFileURL;
  }

  const downloadFile = () => {
    var link = document.createElement('a');
    link.href = document.getElementById("img").src;
    link.setAttribute('download', "downloadSample.png");
    document.body.appendChild(link);
    link.click();
  }

  const showDownloadButton = () => {
    document.getElementById("downloadBtn").style.display = "";
  }

  let text;
  const showLoading = () => {
    document.getElementById("loading").innerHTML = ".";
    document.getElementById("loading").classList.add("loader");
    const loadingText = new loader(document.getElementById("loadText"));
    loadingText.start();
    text = setInterval(function(){document.getElementById("loadText").innerHTML = loadingText.get()},1000);
    loadingText.stop();
  }

  const hideLoading = () => {
    document.getElementById("loading").innerHTML = "";
    clearInterval(text);
    document.getElementById("loadText").style.display = "none";
  }
  
  async function onFileChangeHandler (e) {
    changeGridDisplay();
    const [file] = e.target.files;
    imgFileURL = URL.createObjectURL(file);
    updateImage();
    showLoading();

    e.preventDefault();
    setState({
        selectedFile: file,
    });  

    const formData = new FormData();
    formData.append('file', file);
    
    let res = await fetch (apiURL, {
        method: 'post',
        body: formData
    });

    displayFinal(res);
    hideLoading();
    
  }

  async function displayFinal (res) {
    if(res.ok) {      
      const reader = await res.body.getReader();
        let chunks = [];
        reader.read().then(function processText({ done, value }) {

            if (done) {
                const blob = new Blob([chunks], { type: "image/png" });
                imgFileURL = URL.createObjectURL(blob);
                updateImage();
                showDownloadButton();
                return;
            }
            const tempArray = new Uint8Array(chunks.length + value.length);
            tempArray.set(chunks);
            tempArray.set(value, chunks.length);
            chunks = tempArray

            return reader.read().then(processText)
        })

  };
  console.log(res.status);
  }

  return (
    <div className="App">
      <h1 class="App-logo float-start" style={{color:"white"}}>|</h1>
      <h1 id="P3" style={{display:"none"}}>P3</h1>
      <h1 id="appTitle" class="title float-end">Passport Photo Formatter</h1>
      <div class="container">
          <div class="row" style={{borderRadius:5}}>
            <div id="imgHolder" class = "col-sm-3 col-md-3 col-xs-3">
                  <div id="imgLeft" class = "border border-warning" 
                      style={{borderRadius: 5, 
                              border:5,
                              borderColor: "pink",
                              maxHeight:200}}>
                      <img id = "img" src = "" 
                        class="img-fluid"
                        style={{width:"100%"}}/>
                  </div>
            </div>

            <div class = "col-md-6 col-sm-6 col-xs-12">
                         
              <div id="loading" style={{color:"white", paddingBottom:"1%", fontSize: "30px"}}></div>
              <div id="loadText" style={{color:"white", paddingBottom:"4%"}}></div>
              <div class="text-white" style={{borderRadius: 5, backgroundColor: "#454545"}}>
                <div class="infoCard" style={{padding:10}}>
                  <div id="cardTitle" class="card-header text-warning">Upload an image</div>
                  
                  <div class="card-body text-white">
                      <p id="instruction" class="card-text" style={{padding:15, color: "white", fontSize: "10px"}}>
                        import an image and we'll place it on 
                        a standard passport photo grid for you, 
                        which you can save and use to print.
                      </p>
                  </div>
                  <div class="form-group files color bg-muted">
                    <input type="file" className="form-control input-color" name="file" 
                    onChange={onFileChangeHandler}/>
                  </div>
              </div>
            </div>

            <div id = "downloadBtn" style={{display:"none"}}>
                <button type="button" class="btn btn-warning" onClick={downloadFile} style={{width:"100%"}}>Save Image</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
