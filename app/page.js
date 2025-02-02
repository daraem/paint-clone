"use client"

import {useEffect, useRef, useState } from "react"

export default function home() {
  const [mousePos, setMousePos] = useState({x: null, y: null})
  const [inLinePos, setInLinePos] = useState({x: null, y:null})
  const [holding, setHolding] = useState()
  const [firstStroke, setFirstStroke] = useState(false)
  const [eraser, setEraser] = useState(false)
  const [brushWidth, setBrushWidth] = useState(10)
  const [brushColor, setBrushColor] = useState("#00000")
  const [eraserWidth, setEraserWidth] = useState(10)
  const [lineEnable, setLine] = useState(false)

  let canvaRef = useRef(null)
  let tempCanvaRef = useRef(null)

  useEffect(() => {

    let canva = canvaRef.current
    let ctx = canva.getContext('2d')
    let tempCanva = tempCanvaRef.current
    let tempCtx = tempCanva.getContext('2d')

    if(!firstStroke) {
      canva.width = window.innerWidth
      canva.height = window.innerHeight
      tempCanva.width = canva.width
      tempCanva.height = canva.height
    }

    const updateMouse = e => {
      setMousePos({x:e.clientX, y:e.clientY})
      ctx.strokeStyle = eraser ? "white" : brushColor
      ctx.lineWidth = eraser ? eraserWidth : brushWidth
      
      tempCtx.strokeStyle = eraser ? "white" : brushColor
      tempCtx.lineWidth = eraser ? eraserWidth : brushWidth
      if(holding && !lineEnable) {
        ctx.arc(mousePos.x, mousePos.y, 5, 0, 0, false)
        ctx.stroke()
      } else if (holding && lineEnable) {
        tempCtx.clearRect(0,0, window.innerWidth, window.innerHeight)
        tempCtx.beginPath()
        if(inLinePos.x == null) {
          setInLinePos({x: mousePos.x, y: mousePos.y})
        }
        tempCtx.moveTo(inLinePos.x, inLinePos.y)
        tempCtx.lineTo(mousePos.x, mousePos.y)
        tempCtx.stroke()
      } else {
        setInLinePos({x: null, y: null})
      }
    }

    const mouseDown = e => {
      setHolding(true)
      if(lineEnable && inLinePos.x == null) {
        setInLinePos({x: mousePos.x, y:mousePos.y})
      }
      ctx.beginPath()
    }

    const mouseUp = e => {
      setHolding(false)
      if(lineEnable) {
        ctx.drawImage(tempCanva, 0, 0)
      }
      console.log(brushColor)
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
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-96 h-12 bg-white border border-black rounded-md shadow-md flex items-center justify-center z-50">
        <div className="h-full w-full flex items-center">
          <button onClick={() => {setLine(prev => !prev)}} className="w-10 h-10"><img src="line.svg"></img></button>
        </div>
      </div>

      <canvas ref={tempCanvaRef} className="absolute"></canvas>
      <canvas ref={canvaRef} onMouseDown={() => setFirstStroke(true)} className="absolute"></canvas>
      <div className="table h-full w-full">
        <div className="table-cell align-middle">
          <div className="w-24 h-96 mx-10 bg-white border border-black rounded-md shadow-xl relative group hover:w-52 transition-all ease-in-out delay-100">
            <div className="flex flex-col my-5 gap-12 mx-6 group-hover:items-start transition-all ease-in-out">
              <button onClick={() => {setEraser(false) ; setLine(false)}} className="w-10 h-10"><img src="brush.svg"></img><input type="range" min={0} max={100} defaultValue={10} step={1} onChange={(e) => setBrushWidth(e.target.value)} className="opacity-0 group-hover:opacity-100 delay-75 transition-all ease-in-out"></input><input className="opacity-0 group-hover:opacity-100 delay-75 transition-all ease-in-out" onChange={(e) => setBrushColor(e.target.value)} type="color"></input></button>
              <button onClick={() => setEraser(true)} className="w-10 h-10"><img src="eraser.svg"></img><input type="range" min={0} max={100} defaultValue={10} step={1} onChange={(e) => setEraserWidth(e.target.value)} className="opacity-0 group-hover:opacity-100 delay-75 transition-all ease-in-out"></input></button>
              <button onClick={() => setFirstStroke(false)} className="w-10 h-10"><img src="clean.svg"></img></button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}