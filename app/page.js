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
      <canvas ref={canvaRef} onMouseDown={() => setFirstStroke(true)}></canvas>
      <button onClick={() => {setFirstStroke(false)}}>RESTART</button>
      <button onClick={() => {setEraser(prev => !prev)}}>BORRADOR</button>
      <h1>Posicion: {mousePos.x}</h1>
      <h1>Estado: {holding}</h1>
    </>
  )
}