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
       <div className="container">
              <h1 class="App-logo float-start" style={{color:"white"}}>|</h1>
              <h1 className="title float-end">Passport Photo Placer</h1>

          <div className="row">
            
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div class="card">
                <div class="card-body-1">
                  <h5 class="font-weight-bold card-title">About The App</h5>
                  <p class="card-text">
                    import an image and we'll place it on 
                    a standard passport photo grid for you, 
                    which you can save and use to print.
                  </p>

                  <div className="form-group files color">
                        <input type="file" className="form-control input-color" name="file" 
                        onChange={onFileChangeHandler}/>
                  </div>  

                  <div id = "submitBtn">
                    <button type="button" class="btn btn-light"
                            onClick={submitFile}>Go!</button>
                  </div>

                </div>
              </div>
            </div>
            
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                 <p style={{color: 'white'}}> image selected: </p>
                 <div class="text-center"
                      style={{marginLeft: "25%",
                              borderStyle: "solid", borderColor: "white", 
                              width: "50%", height: "40%",}}>
                    <img 
                      ref = {uploadedImage} 
                      class="card-img-top"
                      style={{width:"90%", height:"90%"}}/>
                 </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;
