import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Shop from './Pages/Shop'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Item from "./Pages/Item";
import Cart from './Pages/Cart';
import Order from './Pages/Order';
import OrderComplete from './Pages/OrderComplete';

function App() {
  return ( 
    <BrowserRouter>
     <Routes>
       <Route path='/' element={<Shop/>}> </Route>
       <Route exact path="/item/:id" element={<Item/>}></Route>
       <Route path='/cart' element={<Cart/>}> </Route>
       <Route path='/order' element={<Order/>}> </Route>
       <Route path='/orderComplete' element={<OrderComplete/>}></Route>
       <Route path='/login' element={<Login/>}> </Route>  
       <Route path='/signup' element={<SignUp/>}> </Route>
     </Routes>
    </BrowserRouter>
  );
}

export default App;