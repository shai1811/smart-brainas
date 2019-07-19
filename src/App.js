import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

//we move the api fron the frontend to the backend to the image.js
// const app = new Clarifai.App({
//  apiKey: '30efb5ac10ed47a4a00f0009eca1628d' /*api key i got from ww.clarifai.com*/
// });


{/* the particles took from https://www.npmjs.com/package/react-particles-js*/}
const particlesOptions = {
  particles: {
                number: {
                  value: 30,
                  density: {
                    enable: true,
                    value_area: 800
                  }
                }
             }
}

const initialState= {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin', /*the routte will choose in what component to start. mena that if we want the 
      first page to be signin so we need to chane the route to be signin*/
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;

    }
  
 
// componentDidMount(){
//   fetch('http://localhost:3000')
//     .then(response => response.json())
//     .then(console.log)
// } // connecting the server

loadUser = (data) => {
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
  }})
}

calculateFaceLocation = (data) => {
  /*the things we will write now taken from the clarifai site where it saw us trhe array that the model hve*/
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width= Number(image.width);
  const height = Number(image.height);
  return { /*the calculate of the box*/
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}


displayFaceBox = (box) => {
  this.setState({box: box});
}

 /* the onInputChange give the recogniztion of what we type*/
onInputChange = (event) => {
  this.setState({input: event.target.value});
}

/* the onbuttonsubmit recognize that we click on the submit*/
onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input}); /*when we click on submit he recognize the url we give in the input*/
  /*from now its the api we tool from www.clarifai.com , the FACE_DETECT_MODEL IS A MODEL WE CHOOSE FROM THERE*/
    fetch('https://sheltered-garden-10417.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          id: this.state.input
          
        })
      })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://sheltered-garden-10417.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
          
        })
      })
        .then(response => response.json())
        .then (count => {
          this.setState(Object.assign(this.state.user, {entries:count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
}

onRouteChange = (route) => {
  if( route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}


  render() {
  const { isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
   {/* the particles took from https://www.npmjs.com/package/react-particles-js*/}
      <Particles className='particles'  
        params={particlesOptions}
      
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange= {this.onRouteChange} />
      {route === 'home' 
      ? <div>
        <Logo />
        <Rank 
         name={this.state.user.name}
         entries={this.state.user.entries}
        />
        <ImageLinkForm
         onInputChange={this.onInputChange } 
         onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        : (
            this.state.route ==='signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
    }
    </div>
  );
}
}

export default App;
