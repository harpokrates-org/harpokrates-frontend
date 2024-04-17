'use client'
import { useWindowSize } from '@react-hook/window-size';
import { drawerWidth } from './SideBar';
import Image from 'next/image';


export default function EmptyState({ title, message }) {
  const [width, height] = useWindowSize();

  return (
    <div
      style={{
        position: 'absolute',
        left: `${(width - drawerWidth)/2 + drawerWidth}px`,
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Image
        src="/imgs/lens.png"
        width={100}
        height={100}
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        alt=''
      />
      <h1 style={{ fontSize:30, textAlign: "center" }}>{title}</h1>
      <p style={{ textAlign: "center" }}>{message}</p>
    </div>
  )
}
