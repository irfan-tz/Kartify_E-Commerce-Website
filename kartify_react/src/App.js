import './App.css';
import {useState, useEffect} from "react";
import axios from "axios";
import NavBar from './Components/NavBar/NavBar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {

  const [item, setItem] = useState([])

  useEffect(() => {
    async function getAllItems(){
      try {
        const item = await axios.get("http://127.0.0.1:8000/item/")
        //remove this console log later
        console.log(item.data)
        setItem(item.data)
      } catch (error) {
        console.log(error)
      }
    }

    getAllItems()

  }, [])
  return (
   <div className="App">
     <h1> <NavBar/> </h1>
     { 
     //<h1>🚧Website under construction🚧👷🏻</h1>
     item.map((item, i) => {
       return ( 
         <h2 key={i}>{item.item_name}; ₹ {item.price.toLocaleString('en-IN')}</h2>
       )
     })
     } 
   </div>
 );
}

export default App;