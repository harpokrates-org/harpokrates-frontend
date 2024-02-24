'use client'
import { useEffect, useState } from "react";
import init, { add } from "wasm-lib";

export default function WasmTest() {
  const [num, setNum] = useState()

  useEffect(() => {
    init()
      .then(() => {
        setNum(add(15,10))
      })
      .catch((e) => {
        console.log(`Error al sumar numeros en WASM: ${e}`)
      });
  }, [])

  return (
    <h1>{num}</h1>
  );
}
