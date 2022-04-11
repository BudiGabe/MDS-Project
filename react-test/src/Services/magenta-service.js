import * as mm from '@magenta/music'

const TWINKLE_TWINKLE = {
    notes: [
        {pitch: 60, startTime: 0.0, endTime: 0.5},
        {pitch: 60, startTime: 0.5, endTime: 1.0},
        {pitch: 67, startTime: 1.0, endTime: 1.5},
        {pitch: 67, startTime: 1.5, endTime: 2.0},
        {pitch: 69, startTime: 2.0, endTime: 2.5},
        {pitch: 69, startTime: 2.5, endTime: 3.0},
        {pitch: 67, startTime: 3.0, endTime: 4.0},
        {pitch: 65, startTime: 4.0, endTime: 4.5},
        {pitch: 65, startTime: 4.5, endTime: 5.0},
        {pitch: 64, startTime: 5.0, endTime: 5.5},
        {pitch: 64, startTime: 5.5, endTime: 6.0},
        {pitch: 62, startTime: 6.0, endTime: 6.5},
        {pitch: 62, startTime: 6.5, endTime: 7.0},
        {pitch: 60, startTime: 7.0, endTime: 8.0},
    ],
    totalTime: 8
};

const JUMP_SONG = {
    notes: [
        { pitch: 62, startTime: 0.5, endTime: 0.75 },
        { pitch: 64, startTime: 1.25, endTime: 1.5 },
        { pitch: 60, startTime: 2.0, endTime: 2.25 },
        { pitch: 60, startTime: 2.75, endTime: 3.0 },
        { pitch: 62, startTime: 3.25, endTime: 3.5 },
        { pitch: 62, startTime: 3.75, endTime: 4.5 },
        { pitch: 64, startTime: 4.5, endTime: 4.75 },
        { pitch: 60, startTime: 5.25, endTime: 5.5 },
        { pitch: 57, startTime: 5.75, endTime: 6.25 },
        { pitch: 55, startTime: 6.25, endTime: 6.75 },
        { pitch: 55, startTime: 6.75, endTime: 8.0 },
    ],
    totalTime: 8
};

const ASCENDING_DESCENDING = {
    notes: [
        {pitch: 60, startTime: 0.0, endTime: 0.4},
        {pitch: 62, startTime: 0.4, endTime: 0.8},
        {pitch: 64, startTime: 0.8, endTime: 1.2},
        {pitch: 66, startTime: 1.2, endTime: 2.0},
        {pitch: 58, startTime: 3.0, endTime: 3.4},
        {pitch: 60, startTime: 3.4, endTime: 3.8},
        {pitch: 62, startTime: 3.8, endTime: 4.2},
        {pitch: 64, startTime: 4.2, endTime: 5.0},
        {pitch: 58, startTime: 6.0, endTime: 6.4},
        {pitch: 56, startTime: 6.4, endTime: 6.8},
        {pitch: 52, startTime: 6.8, endTime: 7.2},
        {pitch: 50, startTime: 7.2, endTime: 8.0},
    ],
    totalTime: 8
};

let music_vae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2');
let Player = new mm.Player();
music_vae.initialize();

function combine_sample(){

    const numInterpolations=12;
    //const track1 = mm.sequences.quantizeNoteSequence(sample1, 4);
    //const track2 = mm.sequences.quantizeNoteSequence(sample2, 4);
    const star = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4);
    const jump = mm.sequences.quantizeNoteSequence(JUMP_SONG, 4);
    const ascending = mm.sequences.quantizeNoteSequence(ASCENDING_DESCENDING, 4);

    let interpolatedMelodies =
        music_vae.interpolate([star,jump],numInterpolations)
            .then((samples) =>{
        return samples[numInterpolations/2];
    });
    return interpolatedMelodies;
}

function play_sample(sample){
    if(Player.isPlaying()){
        Player.stop()
    }
    else
    {
        Player.start(sample);
    }
}

function download_sample(sample){

    const sample1=mm.sequences.quantizeNoteSequence(sample,4);
    sample1.notes.forEach(n => n.velocity=80)
    const midi = mm.sequenceProtoToMidi(sample1);
    const file = new Blob([midi], {type: 'audio/midi'});

        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = 'interp.mid';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
}

export {combine_sample,play_sample,download_sample}