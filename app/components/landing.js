"use client";
import React , {useState} from "react";
import { Input } from "@/components/ui/input";


function Landing() {  
    const [inputValue, setInputValue] = useState('');
    const [list, setList] = useState([]);
  
    const handleAdd = () => {
      if (inputValue.trim() !== '') {
        setList([...list, inputValue.trim()]);
        setInputValue('');
      }
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleAdd();
      }
    };
  return (
    <>
      <div className="h-[70vh] relative flex  items-center justify-center">
        <img
          src="/veggies.jpg"
          alt="food Image"
          className="w-full h-[70vh] object-cover  "
        />
        <div className="absolute  w-[80%] h-[65%] bg-amber-800/70 rounded-4xl flex justify-center items-center">
          <div className=" h-[80%] w-[90%]  flex justify-around items-center">
            <div className=" h-[80%] flex flex-col gap-16 justify-around font-">
              <div>
                <h1 className="text-white  text-6xl font-extrabold   ">
                  Need to list your grocceries?
                </h1>
                <h1 className="text-white  text-6xl font-extrabold  ">
                  Go with the pros.
                </h1>
              </div>
              <div className="flex  relative">
                <img src="/location.svg" alt="location" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"/>
                <input
                  type="text"
                  className="h-12 w-[70%]  rounded-l-[3px] rounded-r-none bg-white pl-12 text-lg "
                  placeholder="Enter Item..."
                  onChange={(e) => setInputValue(e.target.value)}
                  value = {inputValue}
                  onKeyDown={handleKeyPress}
                />
                <button onClick={handleAdd} className="w-[30%] bg-red-400 rounded-r-[3px] rounded-l-none text-white font-bold font-mono">
                  Add Item
                </button>
              </div>
            </div>

            <div className=" h-[80%] text-white font-light text-2xl gap-y-4 flex flex-col justify-center">
              <p>Over a million users worldwide</p>
              <p>Anybody be it a mother,a father or kid can use it</p>
              <p>With a few simple steps make ur kitchen life easier</p>
            </div>
          </div>
        </div>
      </div>
      <div className = "relative flex  items-center justify-center">
        <ul style={{ marginTop: '20px' }}>
          {list.map((item, index) => (
            <li key={index} style={{ padding: '5px 0' }}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
}


export default Landing;
