import React, { useState } from "react";
import { addDoc, collection, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { toggleModal } from "../Component/modal";

const TransactionForm = ({
  types,
  newType,
  setNewType,
  setTypes,
  isRegular,
  setIsRegular,
  isExpense,
  setIsExpense,
  addNewType,
}) => {
  const addNewTransaction = async (
    amount,
    title,
    payDay = null,
    isExpense = true,
    type = "Undefined"
  ) => {
    try {
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
    } catch (error) {
      console.error("Error adding new transaction: ", error);
    }
  };

  const handleTransactionSave = () => {
    const amount = document.getElementById("amount").value;
    const title = document.getElementById("title").value;
    const payDay = isRegular ? document.getElementById("payDay").value : null;
    const isExpense = document.getElementById("isExpense").checked;
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
  };

  return (
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
              onClick={handleTransactionSave}
            >
              Save changes
            </button>
          </footer>
        </form>
      </article>
    </dialog>
  );
};

export default TransactionForm;
