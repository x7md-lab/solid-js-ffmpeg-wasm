import { createSignal, Show } from 'solid-js';
import { createEffect } from 'solid-js';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export default function SingleThread() {
  const [isLoaded, setLoaded] = createSignal(true);
  const [isDone, setDone] = createSignal(false);
  const [useProgress, setProgress] = createSignal(0);
  const [useURL, setURL] = createSignal("");
  const ffmpeg = createFFmpeg({
    log: true,
    mainName: 'main',
    corePath: "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js"
  });

  createEffect(async()=>{
    // console.log(new URL("ffmpeg-core.js", new URL(import.meta.url).origin).href)
    await ffmpeg.load();
    // console.log(ffmpeg);
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
    ffmpeg.setProgress((obj) => { console.log(obj); setProgress(obj.ratio)});
    await ffmpeg.run(...['-i', name, '-acodec', 'libmp3lame', 'audio.mp3']);
    const data = ffmpeg.FS('readFile', 'audio.mp3');
    // const video = document.getElementById('player');
   setURL(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' })) );
   setDone(true);
  }
  return (
    <section class="bg-gray-100 text-gray-700 p-8">
      <p>progress don't work on single thread version, main thread (UI) is busy</p>
      <input onChange={(e)=> transcode(e)} type="file" disabled={isLoaded()} />
      <h2>Output:</h2>
      <progress id="loading" max="100" value={useProgress() * 100}></progress>
      <Show when={isDone()}>
        <audio controls={true} src={useURL()} />
      </Show>
    </section>
  );
}
