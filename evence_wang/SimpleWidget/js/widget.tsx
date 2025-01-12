import React from "react";
import { createRender } from "@anywidget/react";
import { useState, useRef, useEffect } from "react";
import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";
import ReactMarkdown from "react-markdown";
import "./widget.css";

const render = createRender(() => {
  const [showHello, setShowHello] = useState(false);
  const fireworksRef = useRef<FireworksHandlers>(null);

  useEffect(() => {
	if (showHello && fireworksRef.current) {
		fireworksRef.current.start();

		setTimeout(async () => {
            if (fireworksRef.current) {
                await fireworksRef.current.waitStop();
            }
        }, 3000);
	}
  }, [showHello]);

  const handleClick = () => {
	setShowHello(true);
  };

  return (
    <div className="hello_widget">
		<button type="button" onClick={handleClick}>
			Hello!
		</button>
		{showHello && (
		<div>
			<ReactMarkdown className="hello_text">
				{"### 🎆 Hello World! 🎆"}
			</ReactMarkdown>
			<Fireworks
			ref={ fireworksRef }
			options={{
				rocketsPoint: { min: 50, max: 70 },
				hue: { min: 0, max: 360 },
				brightness: { min: 50, max: 80 },
			}}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				pointerEvents: "none",
			}}
			/>
		</div>
		)}
	</div>
  );
});

export default { render };
