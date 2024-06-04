import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { db } from "../firebase";

const Manage = () => {
  const navigate = useNavigate();
  const [userDatas, setUserDatas] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection(auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        setUserDatas(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
    console.log(userDatas);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return unsubscribe;
  }, [navigate]);

  return (
    <div className="container">
      <h1>Manage</h1>
      <p>Only authenticated users can access this page.</p>
    </div>
  );
};

export default Manage;
