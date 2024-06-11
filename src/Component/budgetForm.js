import React from "react";
import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { toggleModal } from "./modal";

const BudgetForm = ({ budget, setBudget }) => {
  const saveBudget = async () => {
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, { budget: parseFloat(budget) }, { merge: true });
        toggleModal({
          currentTarget: { getAttribute: () => "setBudgetModal" },
          preventDefault: () => {},
        });
      }
    } catch (error) {
      console.error("Error saving budget: ", error);
    }
  };

  return (
    <dialog id="setBudgetModal">
      <article>
        <a href="#close" aria-label="Close" className="close" data-target="setBudgetModal" onClick={toggleModal}></a>
        <h5>Set Budget</h5>
        <form id="budgetForm">
          <label htmlFor="budget">Budget</label>
          <input type="number" id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} required />
          <footer>
            <button type="button" className="secondary" data-target="setBudgetModal" onClick={toggleModal}>
              Close
            </button>
            <button type="button" className="primary" onClick={saveBudget}>
              Save Budget
            </button>
          </footer>
        </form>
      </article>
    </dialog>
  );
};

export default BudgetForm;
