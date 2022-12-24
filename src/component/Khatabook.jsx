import React, {useState} from "react";
import swal from "sweetalert";
import "./App.css"
import {useEffect} from "react";
const Khatabook = () => {
    let [bkddata, setbkddata] = useState({})
    let [input, setinput] = useState({
        addcustomer: false,
        val: "",
        amountval: "",
        phoneno: "",
        gmail: "",
        type: "debit",
        lastdate: "",
        updatemode: false,
        search: "",
        iid: ""
    })
    useEffect(() => {
        sendReminder()
        mycustomer()
    }, [])

    // reminder
    async function sendReminder() {
        fetch("https://khatabook-backend2.onrender.com/remind")
    }
    let name;
    function handleChange(e) {
        name = e.target.name
        setinput({
            ...input,
            [name]: e.target.value
        })
    }
    async function mycustomer() {
        const res = await fetch("https://khatabook-backend2.onrender.com/getcustomer")
        const data = await res.json()
        console.log("i m backend data", data)
        setbkddata(data)
    }

    async function savedata() {
        if (input.val && input.amountval && input.lastdate && input.phoneno) {

            const res = await fetch("https://khatabook-backend2.onrender.com/savedata", {

                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)

            })
            let data = await res.json() // res.json wala ayrga
            console.log("im data", data)
            // console.log(data.message)
            if (data[0].phone === input.phoneno) {
                swal(`${
                    data[0].name
                } with this number already exists`)
            } else if (data[0].name === input.val) {
                swal("customer with this name  already exists")
            } else {

                setbkddata(data)
                console.log("first")
                setinput({
                    ...input,
                    val: "",
                    amountval: "",
                    phoneno: "",
                    lastdate: "",
                    addcustomer: false,
                    gmail: ""
                })
            }
        } else {

            swal("ensure name, amount, phone and pay date  fields are filled")
        }
        return;
    }
    function deletedata(ind) { // let cnf = window.confirm("are you sure")
        swal("Are you sure? this user's record will be deleted permanently", {
            dangerMode: true,
            buttons: true
        }).then((e) => {
            console.log(`ime ${e}`)
            if (e === true) {

                deleteitem(ind)
            }
        })
        async function deleteitem(ind) {


            const res = await fetch("https://khatabook-backend2.onrender.com/delete", {

                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ind})

            })
            let data = await res.json() // res.json wala ayrga
            console.log(data)
            // setsearch("")
            setinput({
                ...input,
                search: " "
            })
            setbkddata(data)
            mycustomer()


        }

    }

    async function updatedatabcknd() {
        console.log("i got called")
        console.log(input.amountval)
        const res = await fetch("https://khatabook-backend2.onrender.com/updatedatabcknd", {

            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)

        })
        const data = await res.json()
        setbkddata(data)
        setinput({
            ...input,
            val: "",
            amountval: "",
            phone: "",
            lastdate: "",
            addcustomer: false,
            type: "debit",
            gmail: "",
            updatemode: false
        })
        mycustomer()
    }
    //
    async function updatefrontend(_id, name, phone, gmail1, paydate) {
        console.log("val of gmail1", gmail1)
        console.log("i m value of", phone)
        setinput({
            ...input,
            val: name,
            amountval: 0,
            phoneno: phone,
            lastdate: paydate,
            addcustomer: true,
            type: "debit",
            gmail: gmail1,
            updatemode: true,
            iid: _id
        })
        console.log(input.updatemode) // true
    }

    // call***********
    function call(id, phone) {
        let PhoneNumber = phone
        window.location.href = 'tel://' + PhoneNumber;
    }

    // search customer

    function searchcustomer(e) {
        setinput({
            ...input,
            search: e.target.value
        })
        let searcheddata = bkddata.filter((elm) => {
            return(elm.name).includes(input.search)
        })
        setbkddata(searcheddata)
        if (searcheddata.length === 0) {
            swal("no customer found")
            window.location.reload(false)
        } else if (input.search.length <= 1) {
            mycustomer()
        }
        console.log("im filterder", searcheddata)
        console.log("i m bkd data", bkddata)
    }

    return (
        <div>
            <div className="flexcontainer">
                <h1 className="head">LEDGER</h1>
            </div>

            {
            input.addcustomer ? (

                <>
                    <div className="flexcontainer">
                        <input className="todoinpt" id="customer" type="text" name="val" placeholder="Enter Name*"
                            value={
                                input.val
                            }
                            onChange={
                                (e) => handleChange(e)
                            }/>
                        <pre> </pre>

                        <input className="todoinpt" id="amount" type="number"
                            min={0}
                            placeholder="Enter Amount*"
                            name="amountval"
                            value={
                                input.amountval
                            }
                            onChange={
                                (e) => handleChange(e)
                            }/>
                    </div>
                    <div className="flexcontainer">

                        <select onChange={
                                (e) => handleChange(e)
                            }
                            name="type"
                            id="select">
                            <option value="debit">Debit</option>
                            <option value="credit">Credit</option>
                        </select>
                    </div>


                    <div className="flexcontainer">
                        <input className="todoinpt" id="phone" type="phone" placeholder="Enter Phone*" name="phoneno"
                            value={
                                input.phoneno
                            }
                            onChange={
                                (e) => handleChange(e)
                            }/>
                        <pre> </pre>
                        <input type="email" id="gmail" className="todoinpt" placeholder="Enter Gmail"
                            value={
                                input.gmail
                            }
                            name="gmail"
                            onChange={
                                (e) => handleChange(e)
                            }/>
                        <pre> </pre>
                    </div>

                    <div className="flexcontainer">
                        <span className="paylabel">Select Pay date</span>
                    </div>
                    <div className="flexcontainer">

                        <input value={
                                input.lastdate
                            }
                            className="todoinpt"
                            type="date"
                            name="lastdate"
                            id="date"
                            onChange={
                                (e) => handleChange(e)
                            }/>
                    </div>

                    <div className="flexcontainer">

                        {
                        (input.updatemode) ? <button id="tick" className="btn"
                            onClick={updatedatabcknd}>✅</button> : <button className="btn" id="plus"
                            onClick={savedata}>➕</button>
                    } </div>
                </>
            ) : (
                <>
                    <div className="flexcontainer">

                        <input type="text" name="search" id="search" placeholder="Search customer"
                            value={
                                input.search
                            }
                            onChange={
                                (e) => searchcustomer(e)
                            }/>
                    </div>
                    <div className="flexcontainer+">
                        <div className="icon">
                            <button id="addbtn"
                                onClick={
                                    () => setinput({
                                        ...input,
                                        addcustomer: true
                                    })
                            }>➕</button>
                        </div>
                    </div>
                    {

                    (bkddata.length > 0) ? bkddata.map((elm, indx) => {
                        return (
                            <>

                                <div className="flexcontainer">
                                    <p key={
                                        elm._id
                                    }>
                                        {
                                        elm.name
                                    }</p>
                                    <p>{
                                        (elm.amount)
                                    }</p>
                                    <div className="flexcontainerbtn">
                                        <button className="edtpls"
                                            onClick={
                                                () => updatefrontend(elm._id, elm.name, elm.phone, elm.gmail, elm.paydate, elm.paytype)
                                        }>🖊️</button>
                                        <button className="dlt"
                                            onClick={
                                                () => deletedata(elm._id)
                                        }>⛔</button>
                                        <button className="call"
                                            onClick={
                                                () => call(elm._id, elm.phone)
                                        }>📱</button>
                                    </div>
                                </div>
                                <div className="flexcontainerdate">
                                    <span className="showdate">
                                        {
                                        (elm.date).slice(0, 10)
                                    }</span>
                                    <span className="showdate">
                                        pay date: {
                                        (elm.paydate).slice(0, 10)
                                    }</span>
                                </div>
                            </>
                        );
                    }) : ""
                } </>
            )
        } </div>

    );
};
export default Khatabook;
