import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Image, Transformer, Rect } from "react-konva";
import testImg1 from "./test.jpg";
import testImg2 from "./logo.svg";
const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => resolve(img);
  });
};

const ImageItem = ({ image, isSelected, onSelect, onChange }) => {
  const imageRef = useRef(null);
  const trRef = useRef(null);
  const [imgElement, setImgElement] = useState(null);

  useEffect(() => {
    loadImage(image.src).then(setImgElement);
  }, [image.src]);

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (!imgElement) return null;

  return (
    <>
      <Image
        ref={imageRef}
        image={imgElement}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        draggable
        onClick={() => onSelect(image.id)}
        onTap={() => onSelect(image.id)}
        onDragMove={(e) => {
          const node = imageRef.current;
          const box = node.getClientRect(); // 이미지 전체 실제 영역

          const stage = node.getStage();
          const stageWidth = stage.width();
          const stageHeight = stage.height();

          let dx = 0;
          let dy = 0;

          if (box.x < 0) dx = -box.x;
          if (box.y < 0) dy = -box.y;
          if (box.x + box.width > stageWidth)
            dx = stageWidth - (box.x + box.width);
          if (box.y + box.height > stageHeight)
            dy = stageHeight - (box.y + box.height);

          node.x(node.x() + dx);
          node.y(node.y() + dy);
        }}
        onDragEnd={(e) => {
          const node = imageRef.current;
          onChange(image.id, {
            x: node.x(),
            y: node.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange(image.id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(50, node.width() * scaleX),
            height: Math.max(50, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

const TestPage = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [images, setImages] = useState([
    {
      id: 1,
      src: testImg1,
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      rotation: 0,
    },
    {
      id: 2,
      src: testImg2,
      x: 300,
      y: 200,
      width: 250,
      height: 180,
      rotation: 0,
    },
  ]);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleChange = (id, newAttrs) => {
    setImages((prevImages) =>
      prevImages.map((img) => (img.id === id ? { ...img, ...newAttrs } : img))
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Konva 다중 이미지 이동, 크기 조절, 회전</h2>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
          }
        }}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={stageSize.width}
            height={stageSize.height}
            stroke="red"
            strokeWidth={2}
            dash={[10, 5]}
            listening={false}
          />
          {images.map((img) => (
            <ImageItem
              key={img.id}
              image={img}
              isSelected={img.id === selectedId}
              onSelect={handleSelect}
              onChange={handleChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

// 새로운 페이지로 렌더링
const rootElement = document.getElementById("test-root");
if (rootElement) {
  createRoot(rootElement).render(<TestPage />);
}

export default TestPage;
