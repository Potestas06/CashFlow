import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const processRecurringTransactions = async () => {
  if (!auth.currentUser) return;

  console.log("Processing recurring transactions...");

  const userDocRef = doc(db, "users", auth.currentUser.uid);
  const transactionsRef = collection(userDocRef, "transactions");
  const q = query(transactionsRef, where("recurrence", "==", "monthly"));
  const snapshot = await getDocs(q);
  const currentDate = new Date();
  console.log("Current date:", currentDate);
  console.log("Transactions to process:", snapshot.docs.length);

  snapshot.forEach(async (docSnapshot) => {
    const transactionData = docSnapshot.data();
    const lastProcessed = transactionData.lastProcessedDate
      ? transactionData.lastProcessedDate.toDate()
      : null;
    console.log("Processing transaction:", transactionData);

    if (
      !lastProcessed ||
      lastProcessed.getMonth() !== currentDate.getMonth() ||
      lastProcessed.getFullYear() !== currentDate.getFullYear()
    ) {
      const newTransactionData = {
        ...transactionData,
        date: currentDate,
        lastProcessedDate: currentDate,
      };
      console.log("Adding new transaction:", newTransactionData);

      delete newTransactionData.recurrence; // Avoid creating another recurring transaction
      delete newTransactionData.lastProcessedDate; // Remove last processed date for new transactions

      await addDoc(transactionsRef, newTransactionData);
      await updateDoc(docSnapshot.ref, { lastProcessedDate: currentDate });
    }
    console.log();
    console.log("Transaction processed successfully!");
  });
};

export { processRecurringTransactions };
