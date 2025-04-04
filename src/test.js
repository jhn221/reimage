// import React, { useRef, useState, useEffect } from "react";
// import Moveable from "react-moveable";
// import logo from "./logo.svg";

// const App = () => {
//   const targetRef = useRef(null);
//   const [frame, setFrame] = useState({
//     translate: [100, 100],
//     rotate: 0,
//     width: 300,
//     height: 200,
//   });
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     // DOM이 렌더되고 나서 ref가 생기면 moveable 렌더링
//     if (targetRef.current) {
//       setIsReady(true);
//     }
//   }, []);

//   useEffect(() => {
//     const el = targetRef.current;
//     if (el) {
//       el.style.transform = `
//         translate(${frame.translate[0]}px, ${frame.translate[1]}px)
//         rotate(${frame.rotate}deg)
//       `;
//       el.style.width = `${frame.width}px`;
//       el.style.height = `${frame.height}px`;
//     }
//   }, [frame]);

//   return (
//     <div
//       style={{
//         height: "100vh",
//         background: "#f0f0f0",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         ref={targetRef}
//         style={{
//           position: "absolute",

//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//         }}
//       >
//         <img
//           src={logo}
//           alt="logo"
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             pointerEvents: "none",
//           }}
//         />
//       </div>

//       {isReady && (
//         <Moveable
//           target={targetRef.current}
//           draggable={true}
//           resizable={true}
//           rotatable={true}
//           throttleDrag={0}
//           throttleResize={0}
//           throttleRotate={0}
//           origin={false}
//           edge={true}
//           onDrag={({ beforeTranslate }) => {
//             setFrame((prev) => ({
//               ...prev,
//               translate: beforeTranslate,
//             }));
//           }}
//           onResize={({ width, height }) => {
//             setFrame((prev) => ({
//               ...prev,
//               width,
//               height,
//               // translate는 그대로 유지
//             }));
//           }}
//           onRotate={({ beforeRotate }) => {
//             setFrame((prev) => ({
//               ...prev,
//               rotate: beforeRotate,
//             }));
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default App;

//회전 뺴고는 다 잘됨
import logo from "./logo.svg";
import img from "./test.jpg";

import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";

const App = () => {
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [rotation, setRotation] = useState(0);
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    setUpdateKey((prev) => prev + 1);
  }, [position]);
  const [items, setItems] = useState([
    {
      id: 1,
      src: logo,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      rotation: 0,
    },
    {
      id: 2,
      src: img,
      position: { x: 400, y: 200 },
      size: { width: 200, height: 150 },
      rotation: 0,
    },
  ]);

  const updateItem = (id, newProps) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...newProps } : item))
    );
  };

  return (
    <div
      className="App"
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        background: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {items.map((item) => (
        <Rnd
          key={item.id}
          size={item.size}
          position={item.position}
          bounds="parent"
          minWidth={100}
          minHeight={100}
          onDragStop={(e, d) =>
            updateItem(item.id, { position: { x: d.x, y: d.y } })
          }
          onResizeStop={(e, dir, ref, delta, pos) =>
            updateItem(item.id, {
              size: { width: ref.offsetWidth, height: ref.offsetHeight },
              position: pos,
            })
          }
          style={{
            transform: `rotate(${item.rotation}deg)`,
            transformOrigin: "center center",
            position: "absolute",
            border: "2px solid #4a90e2",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={item.src}
            alt="이미지"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </Rnd>
      ))}
    </div>
  );
};

export default App;
