import LineChart from "../Component/chart/LineChart";
import ShoppingCart from "../Component/chart/ShoppingCart";
import './dashboard.css';
import {db} from "../firebase";
import {collection, doc, getDocs, getDoc, query, orderBy} from "firebase/firestore";
import {useEffect, useState} from "react";

function formatDate(date) {
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
    const year = date.getFullYear();

    // Ensure day and month are always two digits
    const monthFormatted = month < 10 ? '0' + month : month;

    return `${monthFormatted}.${year}`;
}

async function getUserBudget(user){
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData.budget;
    }
}


async function getUserTransactions(user) {
    const userDocRef = doc(db, "users", user.uid);
    const transactionCollection = collection(userDocRef, 'transactions')
    const transactionsQuery = query(transactionCollection, orderBy("Date", 'asc'));

    let transactionDocs = (await getDocs(transactionsQuery)).docs;
    return transactionDocs.map(doc => doc.data())
}

function lineChartData(user, newUserData, setPayments, setPrivateHoldings) {
    getUserBudget(user).then(budget => {
        let payments = [
            [{ type: "date", label: "Monat" }, 'Zahlungen'],
        ];
        let privateHoldings = [
            [{ type: "date", label: "Monat" }, 'Konto'],
        ]

        let paymentsMonths = new Map();;
        let privateHoldingsMonths = new Map();

        newUserData.forEach(transaction => {
            console.log(transaction.Date.seconds);
            let date = new Date(transaction.Date.seconds*1000)
            console.log(date);

            let formatted = formatDate(date)
            if (!(formatted in paymentsMonths)) {
                paymentsMonths.set(formatted, 0);
                privateHoldingsMonths.set(formatted, 0);
            }

            if (transaction.isExpense) {
                paymentsMonths.set(formatted, paymentsMonths.get(formatted) + Number.parseInt(transaction.amount));
                privateHoldingsMonths.set(formatted, privateHoldingsMonths.get(formatted) - Number.parseInt(transaction.amount));
            }
            else {
                privateHoldingsMonths.set(formatted, privateHoldingsMonths.get(formatted) + Number.parseInt(transaction.amount));
            }
            console.log(privateHoldingsMonths);
        })

        for (let [key, amount] of paymentsMonths) {
            let [month, year] = key.split('.')
            let date = new Date(Number.parseInt(year), Number.parseInt(month))
            payments.push([date, amount])
        }
        console.log(payments)
        setPayments(payments)

        for (let [key, amount] of privateHoldingsMonths) {
            console.log(budget)
            console.log(amount)
            budget += amount;
            console.log(budget)
            let [month, year] = key.split('.')
            let date = new Date(Number.parseInt(year), Number.parseInt(month))
            privateHoldings.push([date, budget])
        }
        setPrivateHoldings(privateHoldings)
    })
}

export function Dashboard({user}) {
    const [payment, setPayment] = useState([]);
    const [privateHoldings, setPrivateHoldings] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if (!user) {
            return;
        }

        getUserTransactions(user).then((transactions => {
            setUserData(transactions)
            lineChartData(user, transactions, setPayment, setPrivateHoldings)
        }))
    }, [user]);

    return (
        <>
            <div className="lineCharts">
                <LineChart classes="leftChart" title="Zahlungen pro Monat" data={payment}/>
                <LineChart classes="chart" title="Geld im Konto" data={privateHoldings}/>
            </div>
            <div className="lineCharts">
                <ShoppingCart title="Warenkorb" data={userData}/>
            </div>
        </>
    )
}

export default Dashboard;
