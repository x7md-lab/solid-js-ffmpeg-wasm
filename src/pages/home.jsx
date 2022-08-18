import { createSignal, Show } from 'solid-js';
import { createEffect } from 'solid-js';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export default function Home() {
  const [isLoaded, setLoaded] = createSignal(true);
  const [isDone, setDone] = createSignal(false);
  const [useProgress, setProgress] = createSignal(0);
  const [useURL, setURL] = createSignal("");
  const ffmpeg = createFFmpeg({
    log: false,
    corePath: new URL("ffmpeg-core.js", new URL(import.meta.url).origin).href
  });

  createEffect(async()=>{
    console.log(new URL("ffmpeg-core.js", new URL(import.meta.url).origin).href)
    await ffmpeg.load();
    setLoaded(false);
  })

  const clearAll = () => {
    setURL("");
    setDone(false);
    setProgress(0);
  }

  const transcode = async ({ target: { files } }) => {
    clearAll();
    const { name } = files[0];
    ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
    ffmpeg.setProgress(({ratio}) => setProgress(ratio));
    await ffmpeg.run(...['-i', name, '-c:v', 'libmp3lame', 'audio.mp3']);
    const data = ffmpeg.FS('readFile', 'audio.mp3');
    // const video = document.getElementById('player');
   setURL(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })) );
   setDone(true);
  }
  return (
    <section class="bg-gray-100 text-gray-700 p-8">
      <input onChange={(e)=> transcode(e)} type="file" disabled={isLoaded()} />
      <h2>Output:</h2>
      <progress id="loading" max="100" value={Math.round(useProgress() * 100)}></progress>
      <Show when={isDone()}>
        <audio controls={true} src={useURL()} />
      </Show>
    </section>
  );
}
