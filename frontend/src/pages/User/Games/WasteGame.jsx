import React, { useState, useEffect, useRef } from "react";
import solidwaste from "../../../../public/Game/solidwaste.png";
import organicwaste from "../../../../public/Game/organicwaste.png";
import liquidwaste from "../../../../public/Game/liquidwaste.png";
import bottle from "../../../../public/Game/bottle.png";
import apple from "../../../../public/Game/apple.png";
import milk from "../../../../public/Game/milk.png";

const WASTE_ITEMS = [
  { id: 1, name: "Plastic Bottle", type: "solid", img: bottle },
  { id: 2, name: "Apple", type: "organic", img: apple },
  { id: 3, name: "Milk", type: "liquid", img: milk },
];

const ITEM_SIZE = 64;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const WasteGame = ({ score, setScore }) => {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const dragRef = useRef({ id: null, offsetX: 0, offsetY: 0 });
  const bins = {
    solid: useRef(null),
    organic: useRef(null),
    liquid: useRef(null),
  };

  // spawn items
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      setItems((prev) => {
        if (prev.length >= 4) return prev;
        const random =
          WASTE_ITEMS[Math.floor(Math.random() * WASTE_ITEMS.length)];
        const uid = Date.now() + Math.random();
        const rect = containerRef.current?.getBoundingClientRect();
        const startX = rect ? rect.width / 2 - ITEM_SIZE / 2 : 50;
        const startY = 12;
        return [...prev, { ...random, uid, x: startX, y: startY }];
      });
    }, 1800);

    return () => clearInterval(spawnInterval);
  }, []);

  // Show floating feedback
  const showFeedback = (msg, color, x, y) => {
    const id = Date.now() + Math.random();
    setFeedbacks((prev) => [...prev, { id, msg, color, x, y }]);
    setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }, 1000); // disappear after 1s
  };

  const onPointerDown = (e, uid) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const item = items.find((it) => it.uid === uid);
    if (!item) return;

    const offsetX = e.clientX - (rect.left + item.x);
    const offsetY = e.clientY - (rect.top + item.y);

    dragRef.current = { id: uid, offsetX, offsetY };

    const onMove = (ev) => {
      const drag = dragRef.current;
      if (!drag.id) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newX = ev.clientX - rect.left - drag.offsetX;
      const newY = ev.clientY - rect.top - drag.offsetY;

      setItems((prev) =>
        prev.map((it) => {
          if (it.uid !== drag.id) return it;

          const movedItem = {
            ...it,
            x: clamp(newX, 0, rect.width - ITEM_SIZE),
            y: clamp(newY, 0, rect.height - ITEM_SIZE),
          };

          // live collision detection
          const centerX = rect.left + movedItem.x + ITEM_SIZE / 2;
          const centerY = rect.top + movedItem.y + ITEM_SIZE / 2;

          const binEntries = [
            ["solid", bins.solid.current],
            ["organic", bins.organic.current],
            ["liquid", bins.liquid.current],
          ];

          for (const [type, binEl] of binEntries) {
            if (!binEl) continue;
            const r = binEl.getBoundingClientRect();
            if (
              centerX >= r.left &&
              centerX <= r.right &&
              centerY >= r.top &&
              centerY <= r.bottom
            ) {
              if (it.type === type) {
                setScore((s) => s + 10); // correct → +10
                showFeedback("+10", "green", movedItem.x, movedItem.y);
              } else {
                setScore((s) => (s > 0 ? s - 10 : 0)); // wrong → -10
                showFeedback("-10 Wrong Item", "red", movedItem.x, movedItem.y);
              }

              // remove item immediately
              setTimeout(() => {
                setItems((all) => all.filter((obj) => obj.uid !== it.uid));
              }, 0);

              // stop dragging this item
              dragRef.current = { id: null, offsetX: 0, offsetY: 0 };
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", onUp);
            }
          }

          return movedItem;
        })
      );
    };

    const onUp = () => {
      dragRef.current = { id: null, offsetX: 0, offsetY: 0 };
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-3xl mx-auto"
      style={{
        height: "48vh",
        borderRadius: 12,
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        padding: 12,
      }}
    >
      {/* Items */}
      {items.map((it) => (
        <div
          key={it.uid}
          onPointerDown={(e) => onPointerDown(e, it.uid)}
          style={{
            position: "absolute",
            left: it.x,
            top: it.y,
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            touchAction: "none",
            userSelect: "none",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab",
          }}
        >
          <img
            src={it.img}
            alt={it.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
            draggable={false}
          />
        </div>
      ))}

      {feedbacks.map((f) => (
        <span
          key={f.id}
          style={{
            position: "absolute",
            left: f.x,
            top: f.y,
            color: f.color,
            fontWeight: "bold",
            fontSize: "18px",
            animation: "floatUp 1s ease-out forwards",
            pointerEvents: "none",
          }}
        >
          {f.msg}
        </span>
      ))}

      {/* Bins */}
      <div
        className="absolute left-0 right-0 mx-auto flex items-end justify-center gap-6"
        style={{ bottom: 12, zIndex: 10 }}
      >
        <div ref={bins.solid} style={{ width: 120, height: 140 }}>
          <img
            src={solidwaste}
            alt="solid"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div ref={bins.organic} style={{ width: 120, height: 140 }}>
          <img
            src={organicwaste}
            alt="organic"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div ref={bins.liquid} style={{ width: 120, height: 140 }}>
          <img
            src={liquidwaste}
            alt="liquid"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
      `}</style>
    </div>
  );
};

export default WasteGame;
