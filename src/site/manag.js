import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, onSnapshot, doc, addDoc } from "firebase/firestore";
import TransactionForm from "../Component/transactionForm";
import TypeForm from "../Component/typeForm";
import BudgetForm from "../Component/budgetForm";
import ExpensesList from "../Component/expensesList";
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

  useEffect(() => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribeFromBudgetSnapshot = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setBudget(doc.data().budget);
        }
      });

      return () => unsubscribeFromBudgetSnapshot();
    }
  }, []);

  const addNewType = async () => {
    try {
      if (newType && !types.includes(newType)) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await addDoc(collection(userDocRef, "types"), { name: newType });
        setTypes([...types, newType]);
        setNewType("");
        toggleModal({
          currentTarget: { getAttribute: () => "addTypeModal" },
          preventDefault: () => {},
        });
      }
    } catch (error) {
      console.error("Error adding new type: ", error);
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
      <TransactionForm
        types={types}
        newType={newType}
        setNewType={setNewType}
        setTypes={setTypes}
        isRegular={isRegular}
        setIsRegular={setIsRegular}
        isExpense={isExpense}
        setIsExpense={setIsExpense}
        addNewType={addNewType}
      />
      <TypeForm
        newType={newType}
        setNewType={setNewType}
        types={types}
        setTypes={setTypes}
      />
      <BudgetForm budget={budget} setBudget={setBudget} />
      <ExpensesList expenses={userDatas} />
    </div>
  );
};

export default Manage;
