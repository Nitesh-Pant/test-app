import { isDisabled } from "@testing-library/user-event/dist/utils";
import { useEffect, useState } from "react"

function Account(){


    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:8000/show-transactions")
            // console.log(res)
            if(!res) throw new Error("Error while fetching data")
    
            const data = await res.json()
            setAccountData(data)
        }
        fetchData();
      }, []);

      async function fetchData() {
        const res = await fetch("http://localhost:8000/show-transactions")
        // console.log(res)
        if(!res) throw new Error("Error while fetching data")

        const data = await res.json()
        setAccountData(data)
    }
    const [accountData, setAccountData] = useState([])
    const [popUp, setPopUp] = useState(false)
    const [amount, setAmount] = useState(0)
    const [desc, setDesc] = useState('')
    const [selectedType, setSelectedType] = useState('credit')
    const [errorState, setErrorState] = useState('')


    function openClose(){
        let p = !popUp
        setPopUp(p)
    }

    async function postCall(){
        async function call() {
            console.log({
                date: new Date(),
                type: selectedType,
                amount: parseInt(amount),
                desc: desc

            })
            const res = await fetch("http://localhost:8000/add-transactions", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                    "date": new Date,
                    "type": selectedType,
                    "amount": parseInt(amount),
                    "desc": desc
                  }
            )

            })
            if(!res) throw new Error("Error while fetching data")
    
            if(res){
            console.log(res.json())

                await fetchData()
            }
        }
        call()
        setAmount(0)
        setDesc('')
    }

    function checkDisbale(){
        return amount === "" || desc === ""
    }

    return(
        <>
        {/* <p>Error Occured</p> */}
        <span onClick={()=> openClose()}>+ Add Transaction</span>
        <table style={{border: "2px solid white"}}>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Running Balance</th>
            </tr>
            
                {
                    accountData && accountData.map((item, indx)=>{
                        return(
                            <>
                            <tr>
                            <td>{item.date}</td>
                            <td>{item.desc}</td>
                            <td>{item.credit}</td>
                            <td>{item.debit}</td>
                            <td>{item.balance}</td>
</tr>
                            </>

                        )
                    })
                }

        
        </table>

       {popUp?  (<div>
            <h5>New Transaction</h5>
            <label>Transaction type</label><br></br>
            <label>Credit</label>
            <input type="radio" value={selectedType} checked={selectedType == "credit"} onChange={(e)=> setSelectedType('credit')}/>
            <label>Debit</label>
            <input type="radio" value={selectedType} checked={selectedType == "debit"} onChange={(e)=> setSelectedType('debit')}/><br></br>

            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            <br></br>
            <label>Description</label>
            <input type="text" value={desc} onChange={(e)=> setDesc(e.target.value)}/>
            <br></br>

            <button onClick={()=> postCall()} disabled={checkDisbale()}>Save</button> 
            <button onClick={()=> openClose() }>Cancel</button>

        </div>)
        :
        <></>
}
        </>
    )

}

export default Account