import { useEffect, useRef}  from "react"
import { useImmerReducer} from "use-immer"
import data from "./bquizqs/bible_quizzes.json"
import alert from "./bquizqs/alert1.mp3"
import song from "./bquizqs/rightans1.mp3"
import { render } from "react-dom"
import bg from "./images/bible.jpeg"



function ourReducer(draft,action){
  if(draft.points > draft.highScore) draft.highScore = draft.points
  if(draft.attempts > draft.totalAttempts) draft.totalAttempts= draft.attempts
  if(draft.totalAttempts >=4) draft.disabled = true 
 
  switch(action.type){
    
      case "reset":
        draft.count=0
        draft.timeRemaining = 90
        draft.points = 0
        draft.strikes = 0
        draft.playing = false
        draft.highScore = 0
        draft.attempts =0
        draft.totalAttempts = 0
        draft.show = false
        draft.disabled= false
        
        return

    case "Close":
      draft.show = false
      return

      case "receiveAttempts":
        draft.totalAttempts = action.value
        if(!action.value){
           draft.totalAttempts = 0
        }
        return

    case "receiveHighScore":
      draft.highScore = action.value
      if(!action.value){
         draft.highScore = 0
      }
      return

    case "restart":
       draft.count=0
       draft.timeRemaining = 90
       draft.points = 0
       draft.strikes = 0
       draft.playing = true
       draft.highScore = 0
       draft.attempts =1
       draft.totalAttempts = 0
       draft.show = true
       

      return

    case "decreaseTime":
      if(draft.timeRemaining <=0){
          draft.playing = false
      }else if ((draft.playing = true || !draft.bigCollection) && (!draft.disabled)){
          draft.timeRemaining--
      }else{
        draft.timeRemaining = 90
      }
      return
    case "addToCollection":
      draft.bigCollection = action.value
     
      return
   
      case "startPlaying":
        draft.show = true
        draft.attempts++
        draft.timeRemaining = 90
        draft.points = 0
        draft.strikes = 0
        draft.playing = true
       
        return  
      case "guessAttempt": 
      if(!draft.playing) return
        if(action.value === draft.bigCollection.ans){
           draft.count++
           draft.currentQuestion = draft.bigCollection
           draft.points++
           success()  
           
        }else{
          draft.strikes++
          if(draft.strikes >= 4){
            draft.playing = false  
          }
           failed()
        }


  }

 function failed(){

  const song = new Audio(alert)
  song.play()
 }


 function success(){

  const yesright = new Audio(song)
  yesright.play()
 }

}


const initialState = {
  points:0,
  strikes:0,
  timeRemaining:0,
  highScore:0,
  bigCollection:[],
  currentQuestion: null,
  playing:false,
  fetchCount:0,
  count:0,
  failed:0,
  attempts:0,
  gameover:[],
  show: false,
  disabled: false,
  totalAttempts:0
 
}

function HeartIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className={props.className} viewBox="0 0 16 16">
    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
   </svg>
  )

  
}




function App() {
 
  const timer = useRef(null)
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  
  useEffect(()=>{
    dispatch({type:"receiveAttempts", value:localStorage.getItem("totalAttempts")})
  },[])

  useEffect(()=>{
    if(state.totalAttempts>0){
      localStorage.setItem("totalAttempts", state.totalAttempts)
    }
  },[state.totalAttempts])
  
  useEffect(()=>{
    dispatch({type:"receiveHighScore", value:localStorage.getItem("highscore")})
  },[])

  useEffect(()=>{
    if(state.highScore > 0){
      localStorage.setItem("highscore", state.highScore)
    }
  },[state.highScore])
  useEffect(()=>{
   
    function go(){
     const quizquestions = (data[2].data[state.count])
     dispatch({type:"addToCollection", value:quizquestions})
   
    }
    go()


  },[state.count])



  useEffect(() => {
    if (state.playing) {
    
      timer.current = setInterval(() => {
        dispatch({ type: "decreaseTime" })
      }, 1000)

      return () => {
      
        clearInterval(timer.current)
      }
    }
  }, [state.playing])

   
    return (

      
      <div>
     
       {state.bigCollection  && state.playing === true &&(
        <>
          <div className="text-center min-h-screen bg-gradient-to-r from-indigo-900 via-amber-400 to-indigo-500">
          <p className="text-center p-2">
            <span className="text-zinc-400 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className={"inline-block " + (state.playing ? "animate-spin" : "")} viewBox="0 0 16 16">
                  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
                  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
                  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                </svg>
            </span>
            <span className="font-mono text-4xl relative top-2 ml-3">0:{state.timeRemaining <10 ? "0" + state.timeRemaining : state.timeRemaining }</span>
            {[...Array(4 - state.strikes)].map((item, index) => {
              return <HeartIcon key={index} className="inline text-green-800 mx-1" />
            })}
             {[...Array(state.strikes)].map((item, index) => {
              return <HeartIcon key={index} className="inline text-pink-100 mx-1" />
            })}
           
          </p>
               
                <div className="max-w-4xl py-10 mx-auto ">
                   <p className="bg-amber-400 max-w-4xl py-2 px-2 mb-6 text-2xl font-bold text-amber-900 mx-auto rounded-xl ml-2 mr-2">
                   {state.bigCollection.question}
                   </p>
       
                   <div className="grid grid-cols-2 gap-2 mx-2">
                        <button disabled={state.disabled} onClick={()=>dispatch({type:"guessAttempt", value:"1"})} className="  text-blue-800 text-xl md:text-2xl font-bold " style={{ width:'auto',height:'200px', backgroundImage:`url(${bg})`, objectFit:'cover',opacity: .70,lightingColor:"grey"}}>
                        {state.bigCollection.optn1}
                        </button>
                        <button disabled={state.disabled}  onClick={()=>dispatch({type:"guessAttempt", value:"2"})} className="  text-blue-800 text-xl md:text-2xl font-bold " style={{width:'auto',height:'200px', backgroundImage:`url(${bg})`, objectFit:'cover',opacity: .70,lightingColor:"grey"}}>
                        {state.bigCollection.optn2}
                        </button>
                        <button disabled={state.disabled}  onClick={()=>dispatch({type:"guessAttempt", value:"3"})} className="  text-blue-800 text-xl md:text-2xl font-bold" style={{ width:'auto',height:'200px',backgroundImage:`url(${bg})`, objectFit:'cover',opacity: .70,lightingColor:"grey"}}>
                        {state.bigCollection.optn3}
                        </button>
                        <button disabled={state.disabled}  onClick={()=>dispatch({type:"guessAttempt", value:"4"})} className="  text-blue-800 text-xl md:text-2xl font-bold" style={{width:'auto',height:'200px', backgroundImage:`url(${bg})`, objectFit:'cover',opacity: .70,lightingColor:"grey"}}>
                        {state.bigCollection.optn4}
                        </button>
                   </div>
                      
                </div>
                { state.points >0 && (
                    <div className=" max-w-lg mx-auto ">
                    <p className="text-2xl font-bold text-blue-800">Your Score</p>
                  <p className=" text-4xl text-amber-800">{state.points}</p>
                  </div>
                )}
                 
          </div>
       </>
       )} 
        { state.playing === false   && (
          <>
          
            
         <div className="text-center min-h-screen bg-gradient-to-r from-indigo-900 via-amber-400 to-indigo-500">
         <div className="max-w-5xl mx-auto py-10  bg-amber-300 text-center text-blue-800 text-3xl font-bold">Welcome to QUIZ</div>
         <p className="mt-8 p-2  max-w-3xl mx-auto text-center bg-gradient-to-br from-indigo-700 via-amber-500 to-indigo-500 rounded-xl text-xl font-bold text-blue-700">
            Rules of the game 
         </p>
         <div className="text-xl max-w-2xl mx-auto mt-4 ">
          <div className="font-bold bg-gradient-to-tr from-indigo-300 to-indigo-500 text-purple-900 rounded-lg m-2 p-10 mb-8 text-justify">
          <h3>Total time for each session is <span className="text-2xl text-amber-700 font-bold">90 seconds</span></h3>
           <h3>Maximum number of wrong answers allowed for each session are  <span className="text-2xl text-amber-700 font-bold">4</span></h3>
           <h3>The play ends after 60 seconds or after 4 wrong answers which ever is earlier</h3>
           <h3>Only 3 sessions are allowed, highest of the three scores is retained</h3>
          </div>
          
         </div>

         { state.bigCollection && state.totalAttempts < 3 && (
           <button onClick={()=> dispatch({type:"startPlaying"})} className="text-white text-xl font-bold bg-gradient-to-b from-indigo-800 to-indigo-500 px-4 py-3 rounded-lg">Play</button>
         )}
        

           { state.bigCollection && state.totalAttempts >=3 && (
            <p className="mb-5">Your all-time high score: <span className="text-xl text-amber-200 font-bold">{state.highScore}</span></p>
           )}

       


       </div>
          
       </>
       ) }


         {( state.timeRemaining <= 0 || state.strikes >= 4 || !state.bigCollection ) && (state.show) &&  (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-amber-800 opacity-75 text-white flex justify-center items-center text-center">
            
        <div>
        <button onClick={()=>dispatch({type:"Close"})} className="px-3 -mt-10 py-2 bg-amber-600 text-white">Close</button>
          
         {state.timeRemaining <= 0 && <p className="text-6xl mb-4 font-bold">Time's Up!</p>}
         {state.strikes >= 3 && <p className="text-6xl mb-4 font-bold">4 Wrong Answers</p>}
         {!state.bigCollection  && <p className="text-6xl mb-4 font-bold">Game Over</p>}
         
         <p>
           Your score:{" "}
           <span className="text-amber-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="inline-block relative bottom-1 mx-1" viewBox="0 0 16 16">
               <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
             </svg>
             <span className="text-2xl text-amber-200 font-bold">{state.points}</span>
           </span>
           <p className="mb-5">Your all-time high score: <span className="text-xl text-amber-200 font-bold">{state.highScore}</span></p>
           <p className="mb-5">no. of sessions: <span className="text-xl text-amber-200 font-bold">{state.totalAttempts}</span></p>
         </p>

        
      { state.bigCollection && state.totalAttempts < 3 && (
          <button onClick={() => dispatch({ type: "startPlaying" })} className="text-white bg-gradient-to-b from-indigo-500 to-indigo-600 px-4 py-3 rounded text-lg font-bold mr-4">
          Continue
        </button>
      ) }

       { state.bigCollection && state.attempts >= 3 && (
         <div className="px-4 py-3 bg-red-800 text-2xl text-red-300 ">All Three sessions are over, Thank you for participating</div>
      ) }
    
      {/*
         { state.attempts >=3 && (
             <button onClick={() => dispatch({ type: "restart" })} className="text-white bg-gradient-to-b from-indigo-500 to-indigo-600 px-4 py-3 rounded text-lg font-bold">
             Restart Game
           </button>
         )}
         */}
          
       
     </div>
     </div>
   )}
         
     


       </div>    

       

       
       
    )

   
       
   
}

export default App
