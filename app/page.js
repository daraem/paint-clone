"use client"

import {useEffect, useRef, useState } from "react"

export default function home() {
  const [mousePos, setMousePos] = useState({x: null, y: null});
  const [holding, setHolding] = useState();
  const [firstStroke, setFirstStroke] = useState(false)
  const [eraser, setEraser] = useState(false)

  let canvaRef = useRef(null)

  useEffect(() => {

    let canva = canvaRef.current
    let ctx = canva.getContext('2d')

    if(!firstStroke) {
      canva.width = window.innerWidth
      canva.height = window.innerHeight
    }

    const updateMouse = e => {
      setMousePos({x:e.clientX, y:e.clientY})
      if(holding) {
        ctx.strokeStyle = eraser ? "white" : "black"
        ctx.lineWidth = eraser ? 10 : 5
        ctx.arc(mousePos.x, mousePos.y, 5, 0, 0, false)
        ctx.stroke()
      }
    }

    const mouseDown = e => {
      setHolding(true)
      ctx.beginPath()
    }

    const mouseUp = e => {
      setHolding(false)
      ctx.closePath()
    }

    window.addEventListener("mousedown", mouseDown)
    window.addEventListener("mouseup", mouseUp)
    window.addEventListener("mousemove", updateMouse)

    return () => {
      window.removeEventListener("mousedown", mouseDown)
      window.removeEventListener("mouseup", mouseUp)
      window.removeEventListener("mousemove", updateMouse)
    }
  }, [holding, mousePos, eraser])

  return(
    <>
      <canvas ref={canvaRef} onMouseDown={() => setFirstStroke(true)} className="absolute"></canvas>
      <div className="table h-full w-full">
        <div className="table-cell align-middle">
          <div className="w-24 h-96 mx-10 bg-white border border-black rounded-md shadow-xl relative">
            <div className="flex flex-col items-center my-5 gap-12">
              <button onClick={() => setEraser(false)} className="w-10 h-10"><img src="brush.svg"></img></button>
              <button onClick={() => setEraser(true)} className="w-10 h-10"><img src="eraser.svg"></img></button>
              <button onClick={() => setFirstStroke(false)} className="w-10 h-10"><img src="clean.svg"></img></button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}