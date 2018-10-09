import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from '../reducers';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['likedJobs']
};

const persistedReducer = persistCombineReducers(persistConfig, reducers);

export default function configureStore(initialState = {}) {
  const store = createStore(
    persistedReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
    )
  );

  const persistor = persistStore(store);

  return { persistor, store };
}
