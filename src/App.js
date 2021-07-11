import logo from './logo.svg';
import './App.css';
import React,{ Component, useState} from "react";

function App() {
  const uploadedImage = React.useRef(null);
  const [state, setState] = useState("");

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
    <div className="App" style = {{
      backgroundColor: "#2b2b2b",
    }}>
        <img src={logo} className="App-logo" alt="logo"/>
        <p style = {{
          color: "white",
        }}>
          someday, this will be done and your passport will be done...
        </p>
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                        <div className="form-group files color">
                            <label className="input-color">Upload Your File </label>
                            <input type="file" className="form-control input-color" name="file" 
                            onChange={onFileChangeHandler}/>
                        </div>
                </div>
            </div>
            <div className="row">
              <img ref = {uploadedImage}/>
            </div>
        </div>
    </div>
  );
}

export default App;
