import logo from './logo.svg';
import './App.css';
import React,{ Component, useState} from "react";

function App() {
  const [state, setState] = useState(null);

  var imgFile = "";

  const submitFile = () => {
    if (state != null) {
      var button = document.getElementById("submitBtn");
      button.innerHTML = "<p class='text-muted' style={{color: 'white'}}>image submitted! now comes the wait...</p>";
    }
  }

  const changeGridDisplay = () => {
    document.getElementById("imgHolder").classList = 'col-sm-6';
  }

  const updateImage = () => {
    var imgDisplay = document.getElementById("img");
    imgDisplay.src = imgFile;
  }

  async function onFileChangeHandler (e) {
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
    
    let res = await fetch ('http://localhost:8080/upload', {
        method: 'post',
        body: formData
    });
    if(res.ok) {
        alert("File uploaded successfully.")
        
        const reader = await res.body.getReader();

          let chunks = [];
          reader.read().then(function processText({ done, value }) {

              if (done) {
                  // console.log('Stream finished. Content received:')

                  // console.log(chunks);

                  const blob = new Blob([chunks], { type: "image/png" });
                  // console.log(blob);

                  imgFile = URL.createObjectURL(blob);
                  updateImage();
                  return;
              }

              // console.log(`Received ${chunks.length} chars so far!`)
              // console.log(value);
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
      <h1 class="title float-end">Passport Photo Formatter</h1>
      <div class="container">
          <div class="row" style={{borderRadius:5}}>
            <div id="imgHolder" class = "col-sm-3 col-md-3 col-xs-3">
                  <div class = "border border-warning" 
                      style={{borderRadius: 5, 
                              border:5,
                              borderColor: "pink",
                              maxHeight:200}}>
                      <img id = "img" src = "" 
                        class="img-fluid"
                        style={{width:"100%"}}/>
                      {/*<img ref = {uploadedImage} 
                      class="img-fluid"
                      style={{width:"100%"}}/>*/}
                  </div>
            </div>

            <div class = "col-md-6 col-sm-6 col-xs-6">
              <div class="text-white" style={{borderRadius: 5, backgroundColor: "#454545"}}>
                <div class="" style={{padding:10}}>
                  <div class="card-header text-warning">Upload an image</div>
                  
                  <div class="card-body text-white">
                      <p class="card-text" style={{padding:15, color: "white", fontSize: "10px"}}>
                        import an image and we'll place it on 
                        a standard passport photo grid for you, 
                        which you can save and use to print.
                      </p>
                  </div>
                  <div class="form-group files color bg-muted">
                    <input type="file" className="form-control input-color" name="file" 
                    onChange={onFileChangeHandler}/>
                  </div>  

                  <div id = "submitBtn">
                    <button type="button" class="btn btn-warning btn-block" onClick={submitFile}>Go!</button>
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
