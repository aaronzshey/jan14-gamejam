import "@pixi/events";
import { Stage, Sprite, Text } from "@pixi/react";
import { useState, useRef, useEffect } from "react";

export default function App() {
    // all sorts of states 
    const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png';
    const [score, setScore] = useState(0);
    const [position, setPosition] = useState({ x: 300, y: 300 });
    const [targetPosition, setTargetPosition] = useState({ x: 300, y: 300 });
    const [distractionPosition, setDistractionPosition] = useState({ x: 100, y: 100 });
    const [distracted, setDistracted] = useState<boolean>(false);
    const [distractedScore, setDistractedScore] = useState(0);
    const [done, setDone] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const distractionTimerRef = useRef<NodeJS.Timeout | null>(null);

    // five seconds of undistracted play
    useEffect(() => {
        const timer = setTimeout(() => {
            setDistracted(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // ten seconds of playtime total
    useEffect(() => {
        const timer = setTimeout(() => {
            setDone(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    // ai generated lerp function
    const lerp = (start: number, end: number, t: number) => {
        return start + (end - start) * t;
    };

    // moving the bunny
    useEffect(() => {
        if (done) {
            return;
        }

        const moveSprite = () => {
            setTargetPosition({
                x: Math.random() * 750,
                y: Math.random() * 550
            });
        };

        const interval = setInterval(() => {
            moveSprite();
        }, 2000);

        return () => clearInterval(interval);
    }, [done]);

    useEffect(() => {
        if (done) {
            return;
        }

        const updatePosition = () => {
            setPosition((prevPosition) => ({
                x: lerp(prevPosition.x, targetPosition.x, 0.05),
                y: lerp(prevPosition.y, targetPosition.y, 0.05)
            }));
        };

        const animationFrame = requestAnimationFrame(updatePosition);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [position, targetPosition, done]);

    // moving the distraction
    useEffect(() => {
        if (distracted && !done) {
            distractionTimerRef.current = setInterval(() => {
                setDistractionPosition({
                    x: Math.random() * 750,
                    y: Math.random() * 550
                });
            }, 1);
        }

        return () => {
            if (distractionTimerRef.current) {
                clearInterval(distractionTimerRef.current);
            }
        };
    }, [distracted, done]);

    let styleProps = {
        display: distracted ? 'block' : 'none',
        backgroundColor: done ? "green" : "red",
        width: "100px",
        height: "100px"
    };

    return (
        <>
            <h1>Focus Aim Trainer</h1>
            <p>Track the bunny with your mouse. For every millisecond your mouse stays on it, you gain one point.</p>
            <p>You'll play one five second round with no distractions, and then another five second round with distractions</p>
            <p>Compare your final scores to see if you aim better with or without distractions</p>
            <p>Original score: {score}</p>
            <p>Distracted score: {distractedScore} </p>
            <div style={{ ...styleProps }}>You're {done ? "Done!" : "Distracted"}</div>

            <Stage width={750} height={550} options={{ background: 0xfff }}>
                <Sprite
                    interactive={true}
                    image={bunnyUrl}
                    x={position.x}
                    y={position.y}

                    // edge case: if the game is done, but your mouse is on top of the sprite, the score keeps going up
                    mouseover={() => {
                        if (done)
                            return;

                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                        timerRef.current = setInterval(() => {
                            if (done)
                                return;
                            distracted ? setDistractedScore(
                                (distractedScore) => {
                                    if (done) {
                                        return distractedScore;
                                    }
                                    return distractedScore + 1
                                }) : setScore((score) => score + 1);
                        }, 1);
                    }}
                    mouseout={() => {
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                    }}
                />
                <Sprite
                    image={"https://pixijs.com/assets/tutorials/fish-pond/fish3.png"}
                    x={done ? 100 : distractionPosition.x}
                    y={done ? 100 : distractionPosition.y}
                    width={50}
                    height={20}
                    alpha={distracted ? 1 : 0}
                />
                <Text
                    text={distracted ? distractedScore.toString() : score.toString()}
                    anchor={0.5}
                    x={220}
                    y={150}
                />
            </Stage>
        </>
    );
}
