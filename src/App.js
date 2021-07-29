import logo from './logo.svg';
import './App.css';
import React,{ Component, useState} from "react";

function App() {
  const [state, setState] = useState(null);
  const apiURL = 'http://localhost:8080/upload';
  var imgFile = "";

  const changeGridDisplay = () => {
    document.getElementById("imgHolder").classList = 'col-m-6 col-sm-6 col-xs-12';
  }
  
  const updateImage = () => {
    var imgDisplay = document.getElementById("img");
    imgDisplay.src = imgFile;
  }
  
  const showLoading = () => {
    var container = document.getElementById("loadingBar");
    container.innerHTML = "<div class='progress'><div class='progress-bar bg-warning' id='progBar' role='progressbar' style=\"width:0%; background-color:#f0ad4e\"></div></div>";
    //update percentage completed
    setTimeout(function () {
      updateLoadingPct(100);
      setTimeout(function() {hideLoading()}, 1000)},
      500);
      //setTimeout(updateLoadingPct(100), 10000);
  }

  const hideLoading = () => {
    var container = document.getElementById("loadingBar");
    container.innerHTML = "";
  }

  const updateLoadingPct = (pct) => {
    var container = document.getElementById("progBar");
    var newStyle = "width:" + pct + "%; background-color: #f0ad4e";
    container.style = newStyle;
  }

  async function onFileChangeHandler (e) {
    showLoading();
    changeGridDisplay();
    const [file] = e.target.files;
    imgFile = URL.createObjectURL(file);
    updateImage();

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

    setTimeout(function () {displayFinal(res)}, 1000);
    
  }

  async function displayFinal (res) {
    if(res.ok) {      
      const reader = await res.body.getReader();
        let chunks = [];
        reader.read().then(function processText({ done, value }) {

            if (done) {
                const blob = new Blob([chunks], { type: "image/png" });
                imgFile = URL.createObjectURL(blob);
                updateImage();
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
            
              <div id="loadingBar">
              </div>
              <div class="text-white" style={{borderRadius: 5, backgroundColor: "#454545"}}>
                <div class="" style={{padding:10}}>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
