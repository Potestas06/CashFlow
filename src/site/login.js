import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { toggleModal } from "../Component/modal";

const Manage = () => {
  const navigate = useNavigate();
  const [userDatas, setUserDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegular, setIsRegular] = useState(false);
  const [isExpense, setIsExpense] = useState(true);
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        setIsLoading(false);
        const userDocRef = doc(db, "users", user.uid);
        const userCollectionRef = collection(userDocRef, "transactions");
        const typesCollectionRef = collection(userDocRef, "types");

        const unsubscribeFromSnapshot = onSnapshot(
          userCollectionRef,
          (snapshot) => {
            setUserDatas(
              snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
          }
        );

        const unsubscribeFromTypesSnapshot = onSnapshot(
          typesCollectionRef,
          (snapshot) => {
            setTypes(snapshot.docs.map((doc) => doc.data().name));
          }
        );

        return () => {
          unsubscribeFromSnapshot();
          unsubscribeFromTypesSnapshot();
        };
      }
    });

    return () => unsubscribeFromAuth();
  }, [navigate]);

  const addNewTransaction = async (
    amount,
    title,
    payDay = null,
    isExpense = true,
    type = "Undefined"
  ) => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
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

      await addDoc(collection(userDocRef, "transactions"), transactionData);
    }
  };

  const addNewType = async () => {
    if (newType && !types.includes(newType)) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await addDoc(collection(userDocRef, "types"), { name: newType });
      setTypes([...types, newType]);
      setNewType(""); // Clear the new type input field after adding
      toggleModal({
        currentTarget: { getAttribute: () => "addTypeModal" },
        preventDefault: () => {},
      });
    }
  };

  const saveBudget = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { budget: parseFloat(budget) }, { merge: true });
      setBudget(""); // Clear the budget input field after saving
      toggleModal({
        currentTarget: { getAttribute: () => "setBudgetModal" },
        preventDefault: () => {},
      });
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
      <button
        className="contrast"
        data-target="setBudgetModal"
        onClick={toggleModal}
      >
        Set Budget
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
              <input
                type="checkbox"
                id="isExpense"
                checked={isExpense}
                onChange={(e) => setIsExpense(e.target.checked)}
              />{" "}
              Is Expense
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
            <select
              defaultValue="Undefined"
              id="type"
              onChange={(e) => {
                if (e.target.value === "new") {
                  toggleModal({
                    currentTarget: { getAttribute: () => "addTypeModal" },
                    preventDefault: () => {},
                  });
                }
              }}
            >
              <option value="Undefined" disabled>
                Choose the type
              </option>
              {types.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
              <option value="new">Create new type</option>
            </select>

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
                  let type = document.getElementById("type").value;

                  if (type === "new") {
                    type = newType;
                    addNewType();
                  }

                  addNewTransaction(amount, title, payDay, isExpense, type);
                  document.getElementById("transactionForm").reset();
                  setIsRegular(false);
                  setNewType("");
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

      <dialog id="addTypeModal">
        <article>
          <a
            href="#close"
            aria-label="Close"
            className="close"
            data-target="addTypeModal"
            onClick={toggleModal}
          ></a>
          <h5>Add New Type</h5>
          <form id="typeForm">
            <label htmlFor="newType">New Type</label>
            <input
              type="text"
              id="newType"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              required
            />
            <footer>
              <button
                type="button"
                className="secondary"
                data-target="addTypeModal"
                onClick={toggleModal}
              >
                Close
              </button>
              <button type="button" className="primary" onClick={addNewType}>
                Add Type
              </button>
            </footer>
          </form>
        </article>
      </dialog>

      <dialog id="setBudgetModal">
        <article>
          <a
            href="#close"
            aria-label="Close"
            className="close"
            data-target="setBudgetModal"
            onClick={toggleModal}
          ></a>
          <h5>Set Budget</h5>
          <form id="budgetForm">
            <label htmlFor="budget">Budget</label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
            <footer>
              <button
                type="button"
                className="secondary"
                data-target="setBudgetModal"
                onClick={toggleModal}
              >
                Close
              </button>
              <button type="button" className="primary" onClick={saveBudget}>
                Save Budget
              </button>
            </footer>
          </form>
        </article>
      </dialog>
    </div>
  );
};

export default Manage;
