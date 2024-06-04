import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { toggleModal } from "../Component/modal";

const Manage = () => {
  const navigate = useNavigate();
  const [userDatas, setUserDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegular, setIsRegular] = useState(false);

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        setIsLoading(false);
        const unsubscribeFromSnapshot = onSnapshot(
          collection(db, user.uid),
          (snapshot) => {
            setUserDatas(
              snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
          }
        );

        return () => unsubscribeFromSnapshot();
      }
    });

    return () => unsubscribeFromAuth();
  }, [navigate]);

  const addNewTransaction = async (
    amount,
    title,
    payDay = null,
    isExpense = false,
    type = "Undefined"
  ) => {
    if (auth.currentUser) {
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

      await addDoc(collection(db, auth.currentUser.uid), transactionData);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Manage</h1>
      <p>Only authenticated users can access this page.</p>
      <button
        className="contrast"
        data-target="addTransactionModal"
        onClick={toggleModal}
      >
        Add New Transaction
      </button>
      <dialog id="addTransactionModal">
        <article>
          <a
            href="#close"
            aria-label="Close"
            className="close"
            data-target="addTransactionModal"
            onClick={toggleModal}
          ></a>
          <h5>Add New Transaction</h5>
          <form id="transactionForm">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" required />

            <label>
              <input type="checkbox" id="isExpense" /> Is Expense
            </label>

            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" required />

            <label>
              <input
                type="checkbox"
                id="isRegular"
                checked={isRegular}
                onChange={(e) => setIsRegular(e.target.checked)}
              />{" "}
              Is this a regular transaction?
            </label>

            {isRegular && (
              <div>
                <label htmlFor="payDay">Pay Day</label>
                <input type="date" id="payDay" />
              </div>
            )}

            <label htmlFor="type">Type</label>
            <input type="text" id="type" checked />

            <footer>
              <button
                type="button"
                className="secondary"
                data-target="addTransactionModal"
                onClick={toggleModal}
              >
                Close
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => {
                  const amount = document.getElementById("amount").value;
                  const title = document.getElementById("title").value;
                  const payDay = isRegular
                    ? document.getElementById("payDay").value
                    : null;
                  const isExpense =
                    document.getElementById("isExpense").checked;
                  const type = document.getElementById("type").value;

                  addNewTransaction(amount, title, payDay, isExpense, type);
                  document.getElementById("transactionForm").reset();
                  setIsRegular(false); // Reset the regular transaction state
                  toggleModal({
                    currentTarget: {
                      getAttribute: () => "addTransactionModal",
                    },
                    preventDefault: () => {},
                  });
                }}
              >
                Save changes
              </button>
            </footer>
          </form>
        </article>
      </dialog>
    </div>
  );
};

export default Manage;
