import React, { useState} from "react"
import { useAuth } from "../contexts/AuthContext"
import { Question, Instrument } from "../utilities/types"
import TwoWay from "./twoWay";
import gadEnPt from "../utilities/testPosts"
import postData from "../utilities/postData";


export default function Results(results) {
  const inst = new Instrument("GAD7", "en", "gadID")
  const q1 = new Question ("Gad question 1", "GAD01")
  const q2 = new Question ("Gad question 2", "GAD02")
  const [apiData, updateApiData] = useState({results});
  q1.setInstrument(inst)
  q2.setInstrument(inst)
  postData('https://api.harmonydata.org/text/match', gadEnPt).then((data) =>{
    //updateApiData(data);
    console.log(data);
  })


  

  return (
    <>
    <TwoWay Q1={q1} Q2={q2} percentage={20}></TwoWay>
    <TwoWay Q1={q1} Q2={q2} percentage={60}></TwoWay>
    <TwoWay Q1={q1} Q2={q2} percentage={80}></TwoWay>
    <TwoWay Q1={q1} Q2={q2} percentage={95}></TwoWay>
    </>
  )
}
