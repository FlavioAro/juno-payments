import { combineReducers } from 'redux'
import loadingReducer from './loading.reducer'
import notifyReducer from './notify.reducer'
import alertReducer from './alert.reducer'
import paymentReducer from './payment.reducer'

const rootReducer = combineReducers({
    loadingReducer,
    notifyReducer,
    alertReducer,
    paymentReducer
})

export default rootReducer;