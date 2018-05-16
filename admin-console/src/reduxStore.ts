import { combineReducers, createStore } from "redux";
import { reducer as form } from "redux-form";

// TODO: figure out why the type of form is incompatible
export default createStore(combineReducers({ form } as any));
