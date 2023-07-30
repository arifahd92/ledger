import React, { useState } from "react";
import swal from "sweetalert";
import "./App.css";
import { useEffect } from "react";
const Khatabook = () => {
  let [dataFlag, setDataFlag] = useState(false);
  const [saveFlag, setSaveFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  let [bkddata, setbkddata] = useState({});
  // let [sort , setsort]=useState("date")
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
    iid: "",
    myfilter: "date",
  });
  useEffect(() => {
    mycustomer(input.myfilter);
  }, [input.myfilter]);

  // handling sort
  function handlesort(data1, sort1) {
    if (sort1 === "date") {
      console.log("i got sorted by recent");
      data1.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      console.log(data1, "recent");
      setbkddata(data1);
    } else if (sort1 === "name") {
      console.log("i got sorted by name");
      data1.sort((a, b) => {
        let fa = a.name.toLowerCase();
        let fb = b.name.toLowerCase();
        if (fa > fb) return 1;

        if (fa < fb) return -1;

        if (fa === fb) return 0;
      });
      console.log("named sorteddata", data1);
      setbkddata(data1);
    } else if (sort1 === "lastdate") {
      data1.sort(
        (a, b) =>
          new Date(a.paydate.slice(0, 10)) - new Date(b.paydate.slice(0, 10))
      );
      console.log("i got sorted by lastdate", data1);
      setbkddata(data1);
    } else if (sort1 === "amount") {
      console.log("i got sorted by amount");
      data1.sort((a, b) => a.amount - b.amount);
      setbkddata(data1);
    }
  }

  // reminder
  async function sendReminder() {
    fetch("https://khatabook-backend2.onrender.com/remind");
    swal("remider sent to customers whose last date has already passed");
  }
  // hanle onChange in every  input field
  let name;
  function handleChange(e) {
    name = e.target.name;
    setinput({
      ...input,
      [name]: e.target.value,
    });
    if (name === "myfilter") {
      console.log(e.target.value);
      mycustomer(e.target.value);
    }
  }
  // fetching all data fom backend
  async function mycustomer(filtervalue) {
    try {
      setDataFlag(true);
      const res = await fetch(
        "https://khatabook-backend2.onrender.com/getcustomer"
      );
      const data = await res.json();
      setDataFlag(false);
      console.log("i m backend data", data);
      handlesort(data, filtervalue);
      // setbkddata(data)
    } catch (err) {
      setDataFlag(false);
      swal("Could not fetch data! try again...");
      setTimeout(() => {
        mycustomer();
      }, 1000);
    }
  }

  async function savedata() {
    try {
      if (input.val && input.amountval && input.lastdate && input.phoneno) {
        setSaveFlag(true);
        const res = await fetch(
          "https://khatabook-backend2.onrender.com/savedata",
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
          }
        );
        let data = await res.json(); // res.json wala ayega
        setSaveFlag(false);
        console.log("im data", data);
        // console.log(data.message)
        if (data[0].phone === input.phoneno) {
          swal(`${data[0].name} with this number already exists`);
        } else if (data[0].name === input.val) {
          swal("customer with this name  already exists");
        } else {
          handlesort(data, input.myfilter);
          // setbkddata(data)
          console.log("first");
          setinput({
            ...input,
            val: "",
            amountval: "",
            phoneno: "",
            lastdate: "",
            addcustomer: false,
            search: "",
            gmail: "",
          });
        }
      } else {
        swal("ensure name, amount, phone and pay date  fields are filled");
      }
      return;
    } catch (err) {
      setSaveFlag(false);
      swal("something went wrong");
    }
  }
  function deletedata(ind) {
    // let cnf = window.confirm("are you sure")
    swal("Are you sure? this user's record will be deleted permanently", {
      dangerMode: true,
      buttons: true,
    }).then((e) => {
      console.log(`ime ${e}`);
      if (e === true) {
        deleteitem(ind);
      }
    });
    async function deleteitem(ind) {
      const res = await fetch(
        "https://khatabook-backend2.onrender.com/delete",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ind }),
        }
      );
      let data = await res.json(); // res.json wala ayrga
      console.log(data);
      // setsearch("")
      setinput({
        ...input,
        search: " ",
      });
      // handlesort(data,sort)
      // setbkddata(data)
      mycustomer(input.myfilter);
    }
  }

  async function updatedatabcknd() {
    try {
      setEditFlag(true);
      console.log("i got called");
      console.log(input.amountval);
      const res = await fetch(
        "https://khatabook-backend2.onrender.com/updatedatabcknd",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );
      const data = await res.json();

      //console.log(data);
      // handlesort(data,sort)
      // setbkddata(data)
      setEditFlag(false);
      setinput({
        ...input,
        val: "",
        amountval: "",
        phoneno: "",
        lastdate: "",
        addcustomer: false,
        type: "debit",
        gmail: "",
        updatemode: false,
        search: "",

        // filter:"date"
      });
      mycustomer(input.myfilter);
    } catch (err) {
      setEditFlag(false);
      swal("Updation failed");
    }
  }
  //
  async function updatefrontend(_id, name, phone, gmail1, paydate) {
    console.log("val of gmail1", gmail1);
    console.log("i m value of", phone);
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
      search: "",
      iid: _id,
    });
    console.log(input.updatemode); // true
  }

  // call***********
  function call(id, phone) {
    let PhoneNumber = phone;
    window.location.href = "tel://" + PhoneNumber;
  }

  // search customer

  async function searchcustomer(e) {
    console.log("search got called");
    let current = e.target.value;
    console.log(current);
    setinput({
      ...input,
      search: e.target.value,
    });

    const res = await fetch(
      "https://khatabook-backend2.onrender.com/getcustomer"
    );
    const data = await res.json();

    let searcheddata = data.filter((elm) => {
      return elm.name.toLowerCase().includes(e.target.value);
    });
    setbkddata(searcheddata);
    console.log(searcheddata);
    if (searcheddata.length == 0) {
      swal("no customer found");
    } else if (e.target.value == "") {
      console.log("i m null");
      mycustomer(input.myfilter);
    }
    //console.log("im filterder", searcheddata);
   // console.log("i m bkd data", bkddata);
  }

  return (
    <div>
      <div className="flexcontainer">
        <h1 className="head">LEDGER</h1>
      </div>
      {dataFlag && (
        <div className="flexcontainer">
          <h1 className="head"> Fetching data...</h1>
        </div>
      )}
      {saveFlag && (
        <div className="flexcontainer">
          <h1 className="head"> Saving data...</h1>
        </div>
      )}
      {editFlag && (
        <div className="flexcontainer">
          <h1 className="head"> Updating...</h1>
        </div>
      )}
      {input.addcustomer ? (
        <>
          <div className="flexcontainer">
            <input
              className="todoinpt"
              id="customer"
              type="text"
              name="val"
              placeholder="Enter Name*"
              value={input.val}
              onChange={(e) => handleChange(e)}
            />
            <pre> </pre>

            <input
              className="todoinpt"
              id="amount"
              type="number"
              min={0}
              placeholder="Enter Amount*"
              name="amountval"
              value={input.amountval}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flexcontainer">
            <select onChange={(e) => handleChange(e)} name="type" id="select">
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          <div className="flexcontainer">
            <input
              className="todoinpt"
              id="phone"
              type="phone"
              placeholder="Enter Phone*"
              name="phoneno"
              value={input.phoneno}
              onChange={(e) => handleChange(e)}
            />
            <pre> </pre>
            <input
              type="email"
              id="gmail"
              className="todoinpt"
              placeholder="Enter Gmail"
              value={input.gmail}
              name="gmail"
              onChange={(e) => handleChange(e)}
            />
            <pre> </pre>
          </div>

          <div className="flexcontainer">
            <span className="paylabel">Select Pay date</span>
          </div>
          <div className="flexcontainer">
            <input
              value={input.lastdate}
              className="todoinpt"
              type="date"
              name="lastdate"
              id="date"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flexcontainer">
            {input.updatemode ? (
              <>
                <button id="tick" className="btn" onClick={updatedatabcknd}>
                  ✅
                </button>
              </>
            ) : (
              <button className="btn" id="plus" onClick={savedata}>
                save
              </button>
            )}{" "}
          </div>
        </>
      ) : (
        <>
          <div className="flexcontainer">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search customer"
              value={input.search}
              onChange={(e) => searchcustomer(e)}
            />
          </div>
          <div className="flexcontainer+">
            <div className="icon">
              <button
                id="addbtn"
                onClick={() =>
                  setinput({
                    ...input,
                    addcustomer: true,
                  })
                }
              >
                ➕
              </button>
            </div>
          </div>
          <div className="bellcont">
            <div className="bell" onClick={sendReminder}>
              🔔
            </div>
          </div>
          <div className="sortcont">
            <select
              name="myfilter"
              id=""
              className="sort"
              onChange={(e) => handleChange(e)}
            >
              <option defaultValue disabled>
                Sort by
              </option>
              <option value="date">recent</option>
              <option value="name">name</option>
              <option value="amount">amount</option>
              <option value="lastdate">pay date</option>
            </select>
          </div>
          {bkddata.length > 0
            ? bkddata.map((elm, indx) => {
                return (
                  <>
                    <div className="flexcontainer">
                      <p key={elm._id}>{elm.name}</p>
                      <p>{elm.amount}</p>
                      <div className="flexcontainerbtn">
                        <button
                          className="edtpls"
                          onClick={() =>
                            updatefrontend(
                              elm._id,
                              elm.name,
                              elm.phone,
                              elm.gmail,
                              elm.paydate,
                              elm.paytype
                            )
                          }
                        >
                          🖊️
                        </button>
                        <button
                          className="dlt"
                          onClick={() => deletedata(elm._id)}
                        >
                          ⛔
                        </button>
                        <button
                          className="call"
                          onClick={() => call(elm._id, elm.phone)}
                        >
                          📱
                        </button>
                      </div>
                    </div>
                    <div className="flexcontainerdate">
                      <span className="showdate">{elm.date.slice(0, 10)}</span>
                      <span className="showdate">
                        pay date: {elm.paydate.slice(0, 10)}
                      </span>
                    </div>
                  </>
                );
              })
            : ""}{" "}
        </>
      )}{" "}
    </div>
  );
};
export default Khatabook;
