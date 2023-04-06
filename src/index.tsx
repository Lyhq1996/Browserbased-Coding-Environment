import * as esbuild from 'esbuild-wasm';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin.ts';

const App = () => {
  //ref.current can refer to any type of variable
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  // init esbuild
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      // go to public directory and get the compiled binary
      wasmURL: '/esbuild.wasm' 
    });
  };
  //[] means we only run this function one time when component is first rendered into the screen
  useEffect(() => {
    startService();
  }, []); 

  // event handler for button clicks
  const onClick = async () => {
    // check if service is ready or not
    if (!ref.current) {
      return;
    }

    // transpilation with transform: get rid of jsx syntax, options(target)
    // const result = await ref.current.transform(input, {
    //   loader: 'jsx',
    //   target: 'es2015'
    // });

    // bundle with unpkg plugin and build
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()]
    });

    // console.log(result);

    // set the transpiled or bundled code
    setCode(result.outputFiles[0].text);
  }

  return <div>
    <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <pre>{code}</pre>
  </div>;
};

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);