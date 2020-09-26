import axios from 'axios';
import { PAY_DONATION, PAYMENT_SUCCESS_RECEIPT } from './actionTypes';

export const payDonation = donationFormData => {
  console.log('Payment Action called');
  return async dispath => {
    const res = await axios.post('/api/paystack/pay', donationFormData);

    dispath({
      type: PAY_DONATION,
    });
    //Redirect to pay
    window.location.replace(res.data.url);
  };
};

export const getReceipt = props => {
  return async dispath => {
    const res = await axios.get(
      `http://localhost:5000/payment-success/${props.match.params.id}`
    );

    dispath({
      type: PAYMENT_SUCCESS_RECEIPT,
      payload: res.data.user,
    });
  };
};
