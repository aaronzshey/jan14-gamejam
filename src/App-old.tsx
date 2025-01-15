import { Stage, Container, Sprite, Text, Graphics } from '@pixi/react';
import webgazer from 'webgazer'
import { useEffect } from 'react';

interface GazeData {
  data: {
    x: number;
    y: number;
  };
}


export default function App() {
  // Red color g.drawCircle(100, 100, 50); // Draw a circle at (100, 100) with radius 50 g.endFill(); };
  useEffect(() => {
    // Initialize WebGazer
    webgazer.setGazeListener((data: GazeData, elapsedTime: number) => {
      if (data == null) {
        return;
      }
      console.log(data); // data.x, data.y
    }).begin();

    // Clean up WebGazer on component unmount
    return () => {
      webgazer.end();
    };
  }, []);

  return (
    <Stage options={{ background: 0xffffff }} id="webgazerFaceOverlay">
      <Sprite
        image="https://pixijs.io/pixi-react/img/bunny.png"
        x={400}
        y={270}
        anchor={{ x: 0.5, y: 0.5 }}
      />

      <Container x={400} y={330}>
        <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} />
      </Container>
    </Stage>
  );
};