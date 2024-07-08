import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const toggleModal = (e) => {
  const target = e.target.getAttribute("data-target");
  const modal = document.getElementById(target);
  if (modal.open) {
    modal.close();
  } else {
    modal.showModal();
  }
};

const ExpensesTable = ({ expenses }) => {
  const [sortBy, setSortBy] = useState("date");
  const [modalData, setModalData] = useState(null);

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "date") {
      return new Date(b.Date.seconds * 1000) - new Date(a.Date.seconds * 1000);
    } else if (sortBy === "amount") {
      return b.amount - a.amount;
    } else if (sortBy === "type") {
      return a.type.localeCompare(b.type);
    } else if (sortBy === "isOneTime") {
      return (a.payDay ? 1 : 0) - (b.payDay ? 1 : 0);
    }
    return 0;
  });

  const handleDelete = async (expense) => {
    if (auth.currentUser) {
      const expenseDocRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "transactions",
        expense.id
      );
      await deleteDoc(expenseDocRef);
      setModalData(null);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
      <div className="filters">
        <label>
          Sort By:
          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
            <option value="name">Name</option>
            <option value="amount">Amount</option>
            <option value="type">Type</option>
            <option value="date">Date</option>
            <option value="isOneTime">One Time Payment</option>
          </select>
        </label>
      </div>
      <table className="expenses-list">
        <thead>
          <tr>
            <td>Name</td>
            <td>Amount</td>
            <td>Date</td>
            <td>Type</td>
            <td>Payment Type</td>
            <td>Frequency</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
        {sortedExpenses.map((expense) => (
            <tr>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{new Date(expense.Date.seconds * 1000).toLocaleDateString()}</td>
              <td>{expense.type}</td>
              <td>{expense.isExpense ? "Expense" : "Income"}</td>
              <td>{expense.payDay ? "Recurring" : "One Time Payment"}</td>
              <td>
                <button
                    data-target="deleteModal"
                    onClick={(e) => {
                      setModalData(expense);
                      toggleModal(e);
                    }}
                >
                  Delete
                </button>
              </td>
            </tr>
            ))}
          </tbody>
      </table>
      {modalData && (
          <dialog id="deleteModal">
            <article>
              <a
                  href="#close"
                  aria-label="Close"
                  className="close"
              data-target="deleteModal"
              onClick={toggleModal}
            ></a>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete the following expense?</p>
            <p>Title: {modalData.title}</p>
            <p>Amount: {modalData.amount}</p>
            <p>
              Date:{" "}
              {new Date(modalData.Date.seconds * 1000).toLocaleDateString()}
            </p>
            <footer>
              <button
                type="button"
                className="secondary"
                data-target="deleteModal"
                onClick={(e) => {
                  setModalData(null);
                  toggleModal(e);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary"
                data-target="deleteModal"
                onClick={async (e) => {
                  await handleDelete(modalData);
                  toggleModal(e);
                }}
              >
                Confirm
              </button>
            </footer>
          </article>
        </dialog>
      )}
    </div>
  );
};

export default ExpensesTable;
