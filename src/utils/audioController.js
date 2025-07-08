// src/utils/audioController.js

import * as Tone from 'tone';
import { AUDIO_PATHS } from '../constants/paths';

export const audioController = {
    isInitialized: false,
    synths: {},
    musicPlayer: null,
    sfxVolume: null,
    musicVolume: null,
    meter: null,
    // --- НОВЫЕ СВОЙСТВА ---
    loadedTracks: new Set(),
    currentTrackIndex: -1,

    init() {
        if (this.isInitialized) return;

        return Tone.start().then(() => {
            try {
                // Создаем узлы громкости ПОСЛЕ того, как контекст был запущен
                this.sfxVolume = new Tone.Volume(-10).toDestination();
                this.musicVolume = new Tone.Volume(-18).toDestination();
                
                // Подключаем все синтезаторы к созданному узлу громкости
                this.synths.click = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 } }).connect(this.sfxVolume);
                this.synths.crit = new Tone.MetalSynth({ frequency: 50, envelope: { attack: 0.01, decay: 0.2, release: 0.1 }, harmonicity: 8.5, modulationIndex: 20, resonance: 4000, octaves: 1.5 }).connect(this.sfxVolume);
                this.synths.complete = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.1 } }).connect(this.sfxVolume);
                this.synths.levelup = new Tone.FMSynth({ harmonicity: 3.01, modulationIndex: 14, detune: 0, oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 }, modulation: { type: 'square' }, modulationEnvelope: { attack: 0.02, decay: 0.3, sustain: 0, release: 0.5 } }).connect(this.sfxVolume);
                this.synths.cash = new Tone.Synth({
                    oscillator: { type: 'square' },
                    envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.05 }
                }).connect(this.sfxVolume);

                if (!this.musicPlayer) {
                    // Подключаем плеер к созданному узлу громкости
                    this.musicPlayer = new Tone.Player().connect(this.musicVolume);
                    this.musicPlayer.loop = false;
                    this.musicPlayer.fadeIn = 2;
                    this.musicPlayer.fadeOut = 2;
                    
                    this.meter = new Tone.Meter();
                    this.musicPlayer.connect(this.meter);

                    // --- ИЗМЕНЕННАЯ ЛОГИКА ---
                    // Отмечаем первый трек как "загруженный", т.к. assetLoader его уже загрузил
                    if (AUDIO_PATHS.MUSIC.length > 0) {
                        this.loadedTracks.add(AUDIO_PATHS.MUSIC[0]);
                    }
                    this.playNextTrack(); // Запускаем воспроизведение
                    this.loadRemainingTracksInBackground(); // Начинаем фоновую загрузку остальных
                }

                Tone.Transport.start();

                this.isInitialized = true;
                console.log("Audio initialized.");
            } catch (e) {
                console.error("Failed to initialize audio:", e);
            }
        }).catch(e => console.error("Tone.start() failed", e));
    },
    
    // --- НОВАЯ ФУНКЦИЯ ФОНОВОЙ ЗАГРУЗКИ ---
    loadRemainingTracksInBackground() {
        console.log("Starting background audio loading...");
        AUDIO_PATHS.MUSIC.forEach(trackUrl => {
            if (!this.loadedTracks.has(trackUrl)) {
                new Tone.Buffer(
                    trackUrl,
                    () => {
                        this.loadedTracks.add(trackUrl);
                        console.log(`Background loaded track: ${trackUrl}. Total loaded: ${this.loadedTracks.size}`);
                    },
                    (error) => {
                        console.error(`Failed to load background track ${trackUrl}:`, error);
                    }
                );
            }
        });
    },

    // --- ИЗМЕНЕННАЯ ЛОГИКА ВОСПРОИЗВЕДЕНИЯ ---
    playNextTrack() {
        const availableTracks = Array.from(this.loadedTracks);
        if (availableTracks.length === 0) {
            console.warn("No music tracks loaded to play.");
            return;
        }

        let nextTrackUrl;
        if (availableTracks.length > 1) {
            let nextTrackIndex;
            do {
                nextTrackIndex = Math.floor(Math.random() * availableTracks.length);
            } while (availableTracks[nextTrackIndex] === this.musicPlayer.buffer.url && availableTracks.length > 1);
            nextTrackUrl = availableTracks[nextTrackIndex];
        } else {
            nextTrackUrl = availableTracks[0];
        }

        if (this.musicPlayer.state === 'started' && this.musicPlayer.buffer.url === nextTrackUrl) {
            return; 
        }

        console.log(`Loading music track to player: ${nextTrackUrl}`);
        this.musicPlayer.load(nextTrackUrl).then(() => {
            console.log(`Music player loaded: ${nextTrackUrl}`);
            if (this.musicPlayer.state !== 'started') {
                this.musicPlayer.start();
                console.log(`Music started: ${nextTrackUrl}`);
            }

            if (this._nextTrackEventId) {
                 Tone.Transport.clear(this._nextTrackEventId);
            }
            
            const currentDuration = this.musicPlayer.buffer.duration;
            const fadeOutTime = this.musicPlayer.fadeOut || 0;
            this._nextTrackEventId = Tone.Transport.scheduleOnce(() => {
                this.playNextTrack();
            }, `+${currentDuration - (fadeOutTime / 2)}`);

        }).catch(error => {
            console.error(`Failed to load music track ${nextTrackUrl} into player:`, error);
            setTimeout(() => this.playNextTrack(), 5000); // Повторная попытка через 5 сек в случае ошибки
        });
    },

    play(sound, note = 'C4', duration = '8n') {
        if (!this.isInitialized || !this.synths[sound]) return;
        try {
            this.synths[sound].triggerAttackRelease(note, duration);
        } catch (e) {
            // silent fail
        }
    },

    setSfxVolume(level) {
        if (!this.isInitialized || !this.sfxVolume) return;
        const db = level === 0 ? -Infinity : Tone.gainToDb(level / 100);
        this.sfxVolume.volume.rampTo(db, 0.1);
    },

    setMusicVolume(level) {
         if (!this.isInitialized || !this.musicPlayer || !this.musicVolume) return;
         const db = level === 0 ? -Infinity : Tone.gainToDb(level / 100);
         this.musicVolume.volume.rampTo(db, 0.1);
         if (level > 0 && this.musicPlayer.state === 'stopped' && this.isInitialized) {
             this.playNextTrack();
         }
    },

    getVolume() {
        if (this.meter) {
            return this.meter.getValue();
        }
        return -100;
    }
};