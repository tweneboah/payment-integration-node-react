import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { payDonation } from '../redux/actions/donationPaymentActions';

const Home = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [fullName, setFullName] = useState('');

  const donationData = {
    email,
    amount,
    fullName,
  };

  const onFormSubmit = e => {
    e.preventDefault();
    dispatch(payDonation(donationData));
    console.log(donationData);
  };
  return (
    <div>
      <h1>Welcome to Real Payment</h1>
      <form onSubmit={onFormSubmit}>
        <input
          type='text'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type='number'
          placeholder='Amount'
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <input
          type='text'
          placeholder='Full name'
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <button type='submit'>Pay only GHS 2</button>
      </form>
    </div>
  );
};

export default Home;
