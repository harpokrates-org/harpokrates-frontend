'use client'
import { useEffect, useState } from "react";
import init, { SocialNetwork } from "wasm-lib";

const exampleNet = {
  nodes: [
      'ana',
      'brian',
      'carolina',
      'daniel',
      'emilia'
  ],
  edges: [
      ['ana', 'brian'],
      ['ana', 'carolina'],
      ['carolina', 'daniel'],
      ['carolina', 'brian'],
      ['brian', 'emilia'],
  ]
}

export default function Network() {
  const [net, setNet] = useState()

  useEffect(() => {
    init()
      .then(() => {
        const parsed_input = JSON.stringify(exampleNet)
        let socialNetwork = SocialNetwork.new()
        socialNetwork.set_net(parsed_input)
        const net = JSON.parse(socialNetwork.get_net())
        setNet(net)
        console.log(net)
      })
      .catch((e) => {
        console.log(`Error al crear grafo en WASM: ${e}`)
      });
  }, [])

  return (
    <>
        <h1>Nodos: {net? JSON.stringify(net.nodes) : null}</h1>
        <h1>Aristas: {net? JSON.stringify(net.edges) : null}</h1>
    </>
  );
}