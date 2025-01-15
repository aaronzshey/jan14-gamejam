import "@pixi/events";
import { Stage, Sprite, Text } from "@pixi/react";
import { useState, useRef } from "react";

export default function App() {

    let timer: NodeJS.Timeout;
    const [score, setScore] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    return (
        <Stage width={750} height={550} options={{ background: 0xfff }}>
            <Sprite
                interactive={true}
                image={"https://pixijs.io/pixi-react/img/bunny.png"}
                x={300}
                y={300}
                mouseover={() => {
                    timerRef.current = setInterval(() => {
                        setScore((score) => score + 1);
                        console.log(score);
                    }, 1);
                }}
                mouseout={() => {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                }}
            />
            <Text
                text={score.toString()}
                anchor={0.5}
                x={220}
                y={150}
            />
        </Stage>
    );
}
