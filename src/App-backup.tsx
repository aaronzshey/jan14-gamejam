import React, { useEffect, useRef, useState } from 'react';
import { Stage, Container, Graphics } from '@pixi/react';
import webgazer from 'webgazer';

interface Coordinate {
    x: number;
    y: number;
}

const drawCircles = (g, coordinates: Coordinate[]) => {
    g.clear();
    console.log(coordinates);
    coordinates.forEach(point => {
        g.beginFill(0xff0000); // Red color
        g.drawCircle(point.x, point.y, 5); // Draw a circle with radius 5
        g.endFill();
    });
};

const App: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

    useEffect(() => {
        // Initialize WebGazer
        webgazer.setGazeListener((data: any, elapsedTime: number) => {
            if (data) {
                const { x, y } = data;
                setCoordinates(prevCoords => [...prevCoords, { x, y }]);
            }
        }).begin();

        // Clean up on component unmount
        return () => {
            webgazer.end();
        };
    }, []);

    return (
        <Stage width={800} height={600}>
            <Container>
                <Graphics draw={(g) => drawCircles(g, coordinates)} />
            </Container>
        </Stage>
    );
};

export default App;
