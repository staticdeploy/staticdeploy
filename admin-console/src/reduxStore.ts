import { combineReducers, createStore } from "redux";
import { reducer as form } from "redux-form";

export default createStore(combineReducers({ form }));
