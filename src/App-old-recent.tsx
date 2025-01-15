import { Stage, Container, Text, Sprite } from '@pixi/react';
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js'
import '@pixi/events';

export default function App() {
    const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png';
    const firstSpriteRef = useRef<Sprite>(null);
    //const [score, setScore] = useState(0);

    useEffect(() => {
        if (!firstSpriteRef.current) {
            //firstSpriteRef.current.interactive = true;
            firstSpriteRef.current.addEventListener('mouseenter', () => {
                console.log('mouse enter');
            })

            firstSpriteRef.current.addEventListener('mouseleave', () => {
                console.log('mouse leave');
            })
        } else {
            console.log('no ref');
        }
    }, []);

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} options={{ background: 0x1099bb }}>
            <Sprite image={bunnyUrl} x={300} y={150} ref={firstSpriteRef} />
            <Container x={200} y={200}>
                <Text
                    text="asdf"
                    anchor={0.5}
                    x={220}
                    y={150}
                />
            </Container>
        </Stage>
    );
};
