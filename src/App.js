import logo from './logo.svg';
import './App.css';
import React,{ Component, useState} from "react";

function App() {
  const uploadedImage = React.useRef(null);
  const [state, setState] = useState("");

  const submitFile = () => {
    if (state != null) {
      var button = document.getElementById("submitBtn");
      button.innerHTML = "image submitted! now comes the wait...";
    }
  }

  async function onFileChangeHandler (e) {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const {current} = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
          current.src = e.target.result;
      }
      reader.readAsDataURL(file);
    };

    e.preventDefault();
    setState({
        selectedFile: e.target.files[0],
    });
    const formData = new FormData();
    formData.append('file', file);
    
    let res = await fetch ('http://localhost:8080/upload', {
        method: 'post',
        body: formData
    });
    if(res.ok) {
        console.log(res.data)
        alert("File uploaded successfully.")
    };
    console.log(res.status);
  }

  return (
    <div className="App">
      <h1 class="App-logo float-start" style={{color:"white"}}>|</h1>
      <h1 class="title float-end">Passport Photo Placer</h1>
      <div class="container">
          <div class="row" style={{borderRadius:5}}>
            <div class = "col-sm-6 col-md-6 col-xs-6" style={{minWidth:"18rem"}}>
                  <div class = "border border-warning" 
                      style={{borderRadius: 5, 
                              border:5,
                              borderColor: "pink",
                              maxHeight:200}}>
                      <img ref = {uploadedImage} 
                      class="img-fluid"
                      style={{width:"100%"}}/>
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
