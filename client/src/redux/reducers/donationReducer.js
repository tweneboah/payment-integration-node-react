import { PAYMENT_SUCCESS_RECEIPT } from '../actions/actionTypes';
const donationReducer = (state = { amountPaid: '3000 GHS' }, action) => {
  switch (action.type) {
    case PAYMENT_SUCCESS_RECEIPT:
      return { ...state, amountPaid: action.payload };
    default:
      return state;
  }
};

export default donationReducer;
