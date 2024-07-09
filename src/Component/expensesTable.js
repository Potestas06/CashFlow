import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const ExpensesTable = ({ expenses }) => {
  const [sortBy, setSortBy] = useState("date");
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const getNormalizedDate = (expense) => {
    if (expense.Date && expense.Date.seconds) {
      return expense.Date;
    } else if (expense.date && expense.date.seconds) {
      return expense.date;
    }
    return null;
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    try {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "date") {
        const dateA = getNormalizedDate(a);
        const dateB = getNormalizedDate(b);
        if (!dateA || !dateB) {
          console.error("Invalid Date field in expense:", a, b);
          return 0;
        }
        return new Date(dateB.seconds * 1000) - new Date(dateA.seconds * 1000);
      } else if (sortBy === "amount") {
        return b.amount - a.amount;
      } else if (sortBy === "type") {
        return a.type.localeCompare(b.type);
      } else if (sortBy === "isOneTime") {
        return (a.payDay ? 1 : 0) - (b.payDay ? 1 : 0);
      }
    } catch (error) {
      console.error("Error sorting expenses:", error);
    }
    return 0;
  });

  const handleDelete = async (expense) => {
    if (auth.currentUser) {
      try {
        const expenseDocRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "transactions",
          expense.id
        );
        await deleteDoc(expenseDocRef);
        setModalData(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting expense:", error);
        setError("Failed to delete expense. Please try again.");
      }
    } else {
      setError("User not authenticated.");
    }
  };

  const openModal = (expense) => {
    setModalData(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalData(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Expenses</h2>
      {error && <p className="error">{error}</p>}
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
          {sortedExpenses.map((expense) => {
            const normalizedDate = getNormalizedDate(expense);
            return (
              <tr key={expense.id}>
                <td>{expense.title}</td>
                <td>{expense.amount}</td>
                <td>
                  {normalizedDate
                    ? new Date(
                        normalizedDate.seconds * 1000
                      ).toLocaleDateString()
                    : "Invalid Date"}
                </td>
                <td>{expense.type}</td>
                <td>{expense.isExpense ? "Expense" : "Income"}</td>
                <td>{expense.payDay ? "Recurring" : "One Time Payment"}</td>
                <td>
                  <button onClick={() => openModal(expense)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isModalOpen && (
        <dialog id="deleteModal" open>
          <article>
            <a
              href="#close"
              aria-label="Close"
              className="close"
              onClick={closeModal}
            ></a>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete the following expense?</p>
            <p>Title: {modalData.title}</p>
            <p>Amount: {modalData.amount}</p>
            <p>
              Date:{" "}
              {modalData.Date && modalData.Date.seconds
                ? new Date(modalData.Date.seconds * 1000).toLocaleDateString()
                : "Invalid Date"}
            </p>
            <footer>
              <button type="button" className="secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="primary"
                onClick={async () => {
                  await handleDelete(modalData);
                  if (!error) {
                    closeModal();
                  }
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
