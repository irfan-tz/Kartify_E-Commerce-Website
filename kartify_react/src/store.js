import {createStore,combineReducers,applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import { productListReducers } from './Components/Reducers/ProductReducers';
import { userLoginReducers, userSignUpReducers } from './Components/Reducers/userReducers';

const reducer = combineReducers({
    productsList:productListReducers,
    userLogin : userLoginReducers,
    userSignUp : userSignUpReducers,
})

const initialState={}
const middleware=[thunk]
const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...
    middleware)))

export default store;   