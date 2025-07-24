import { createSignal, createEffect, onMount, type Component } from 'solid-js';
import { createStore } from 'solid-js/store';

import styles from './App.module.css';
import { render } from './render';
import { run } from './play';

const App: Component = () => {
  let myCanvas: HTMLCanvasElement;

  const [position, setPosition] = createSignal(0);
  const [angle, setAngle] = createSignal(40);
  const [isAnimating, setIsAnimating] = createSignal(false);

  const [store, setStore] = createStore<{
    easing?: string;
    begin: { position: number; angle: number } | undefined;
    end: { position: number; angle: number } | undefined;
  }>({
    begin: {
      position: 0,
      angle: 40,
    },
    end: {
      position: 1,
      angle: -60,
    },
    easing: 'ease-in-out-cubic',
  });
  createEffect(() => {
    render(myCanvas, {
      ...store,
      position: position(),
      angle: angle(),
    });
  });

  return (
    <div>
      <h1>Camera slider calculation</h1>
      <fieldset>
        <div>
          Position:{' '}
          <input
            disabled={isAnimating()}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={position()}
            onInput={(e) => {
              setPosition(
                parseFloat((e.target as unknown as HTMLInputElement).value)
              );
            }}
          />
        </div>
        <div>
          Angle:{' '}
          <input
            disabled={isAnimating()}
            type="range"
            min="-75"
            max="75"
            step="0.1"
            value={angle()}
            onInput={(e) => {
              setAngle(
                parseFloat((e.target as unknown as HTMLInputElement).value)
              );
            }}
          />
        </div>
        <div>
          Smooth start/end:{' '}
          <select
            disabled={isAnimating()}
            value={store.easing}
            onInput={(e) => {
              const el = e.target as unknown as HTMLSelectElement;
              setStore({
                ...store,
                easing: el.options[el.selectedIndex]?.value,
              });
            }}
          >
            <option value="linear">No</option>
            <option value="ease-in-out-sine">Low</option>
            <option value="ease-in-out-quad">Medium</option>
            <option value="ease-in-out-cubic">High</option>
          </select>
        </div>
        <button
          disabled={isAnimating()}
          onClick={() => {
            setStore({
              ...store,
              begin: {
                position: position(),
                angle: angle(),
              },
            });
          }}
        >
          Set Start
        </button>
        &nbsp;
        <button
          disabled={isAnimating()}
          onClick={() => {
            setStore({
              ...store,
              end: {
                position: position(),
                angle: angle(),
              },
            });
          }}
        >
          Set End
        </button>
        &nbsp;
        <button
          disabled={!store.begin || !store.end}
          onClick={() => {
            setIsAnimating(!isAnimating());
            run(
              8000,
              store,
              (position, angle) => {
                setPosition(position);
                setAngle(angle);
              },
              () => {
                setIsAnimating(false);
              },
              () => !isAnimating()
            );
          }}
        >
          {isAnimating() ? 'Stop' : 'Play'}
        </button>
      </fieldset>
      <br />
      <canvas
        ref={myCanvas}
        width="400px"
        height="400px"
        style={{ border: '1px solid #888', 'aspect-ratio': 1 }}
      />
    </div>
  );
};

export default App;
