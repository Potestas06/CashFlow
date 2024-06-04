import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

const Manage = () => {
  const navigate = useNavigate();
  const [userDatas, setUserDatas] = useState([]);

  useEffect(() => {
    const unsubscribeFromSnapshot = db
      .collection(auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        setUserDatas(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });

    return () => unsubscribeFromSnapshot();
  }, []);

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribeFromAuth();
  }, [navigate]);

  const addNewTransaction = (
    amount,
    title,
    payDay = null,
    isExpense = true,
    type = "Undefined"
  ) => {
    const collectionRef = db.collection(auth.currentUser.uid);
    const transactionData = {
      title,
      amount,
      isExpense,
      type,
      Date: new Date(),
    };

    if (payDay !== null) {
      transactionData.payDay = payDay;
    }

    collectionRef.add(transactionData);
  };

  return (
    <div className="container">
      <h1>Manage</h1>
      <p>Only authenticated users can access this page.</p>
    </div>
  );
};

export default Manage;
