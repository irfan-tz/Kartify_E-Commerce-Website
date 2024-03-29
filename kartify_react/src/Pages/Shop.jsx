import React from 'react'
import NavBar from '../Components/NavBar/NavBar';
import {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom"
import axios from "axios";
import {listItems} from "../Components/Actions/ItemActions";
import {useDispatch, useSelector} from 'react-redux';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';

//not using redux-devtools
function Shop() {
  // const dispatch = useDispatch()
  // const itemsList = useSelector((state)=>state.itemsList);
  // const {error, loading, items} = itemsList
  const [item, setItem] = useState([])

  useEffect(() => {
      async function getAllItems(){
        try {
          const item = await axios.get("/item/")
          setItem(item.data)
        } catch (error) {
          console.log(error)
        }
      }

      getAllItems()
    //dispatch(listItems())
  //}, [dispatch]);
      }, []);
  return (
    <>
    <h1> <NavBar/> </h1>
    <div className="App" style={{ marginTop: '40px' }}>
      {item.map((item, i) => (
        <Link key={i} to={`/item/${item.item_id}`} style={{ display: 'block', marginBottom: '20px' }}>
          <h2>{item.item_name} ₹ {item.item_price.toLocaleString('en-IN')}</h2>
        </Link>
      ))}
    </div>
    </>
  );
}

export default Shop