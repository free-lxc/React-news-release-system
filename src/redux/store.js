import { legacy_createStore as createStore, combineReducers } from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['LoadingReducer']
}
// 合并多个reducer
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})
// 持久化处理
const persistedReducer = persistReducer(persistConfig, reducer)

// 单一管理原则
const store = createStore(persistedReducer)
let persistor = persistStore(store)

export {
    store,
    persistor
}

/*
    store.dispatch()

    store.subsribe()
*/