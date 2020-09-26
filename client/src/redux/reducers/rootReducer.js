import { combineReducers } from 'redux';
import donationReducer from './donationReducer';

const rootReducer = combineReducers({
  donationPayments: donationReducer,
});

export default rootReducer;
