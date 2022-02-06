import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import userReducer from "./reducers/user_reducer";
import thunk from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";

// const configureStore = () => {
//     const rootReducer = combineReducers({ userReducer });
//     const middleware = [thunk];
//     const composeEnhancers = typeof window === 'object' &&
//         window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
//         window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
//     const enhancer = composeEnhancers(applyMiddleware(...middleware));
//     const makeStore = () => createStore(rootReducer, enhancer);
//     return createWrapper(makeStore);
// }
// export default configureStore;

const rootReducer = combineReducers({ userReducer });
const middleware = [thunk];
const composeEnhancers = typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const enhancer = composeEnhancers(applyMiddleware(...middleware));
const makeStore = () => createStore(rootReducer, enhancer);
export const wrapper = createWrapper(makeStore)
