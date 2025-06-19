// src/utils/audioController.js

import * as Tone from 'tone';

// ИЗМЕНЕНО: Добавляем ссылки на музыкальные треки - УДАЛЕНЫ СЛЭШИ В КОНЦЕ
// ВНИМАНИЕ: Вам нужно будет заменить эти заглушки на реальные URL ваших аудиофайлов.
// Рекомендуется использовать локальные файлы в папке public/audio для Production.
const musicTracks = [
    '../../public/audio/cithare-medieval-1-307558.mp3', // Пример: Ambient track 1
    '../../public/audio/fantasy-medieval-ambient-237371.mp3', // Пример: Ambient track 2
    '../../public/audio/fantasy-medieval-mystery-ambient-292418.mp3', // Пример: Ambient track 3
    '../../public/audio/medieval-ambient-236809.mp3', // Пример: Ambient track 4
    '../../public/audio/medieval-background-196571.mp3', // Пример: Ambient track 5
    '../../public/audio/medieval-background-351307.mp3', // Пример: Ambient track 6
    '../../public/audio/medieval-citytavern-ambient-235876.mp3', // Пример: Ambient track 7
    '../../public/audio/medieval-track-161051.mp3', // Пример: Ambient track 8
    '../../public/audio/the-ballad-of-my-sweet-fair-maiden-medieval-style-music-358306.mp3', // Пример: Ambient track 9
];

export const audioController = {
    isInitialized: false,
    synths: {},
    musicPlayer: null,
    sfxVolume: new Tone.Volume(-10).toDestination(),
    musicVolume: new Tone.Volume(-18).toDestination(), // Начальная громкость музыки
    meter: null, // <-- ВОССТАНОВЛЕНО: Tone.Meter для анализа аудио

    init() {
        // Убрал проверку Tone.context.state !== 'suspended' из init(), т.к. Tone.start() сам это делает.
        if (this.isInitialized) return;

        return Tone.start().then(() => {
            try {
                this.synths.click = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 } }).connect(this.sfxVolume);
                this.synths.crit = new Tone.MetalSynth({ frequency: 50, envelope: { attack: 0.01, decay: 0.2, release: 0.1 }, harmonicity: 8.5, modulationIndex: 20, resonance: 4000, octaves: 1.5 }).connect(this.sfxVolume);
                this.synths.complete = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.1 } }).connect(this.sfxVolume);
                this.synths.levelup = new Tone.FMSynth({ harmonicity: 3.01, modulationIndex: 14, detune: 0, oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 }, modulation: { type: 'square' }, modulationEnvelope: { attack: 0.02, decay: 0.3, sustain: 0, release: 0.5 } }).connect(this.sfxVolume);
                this.synths.cash = new Tone.Synth({
                    oscillator: { type: 'square' },
                    envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.05 }
                }).connect(this.sfxVolume);

                // ИНИЦИАЛИЗАЦИЯ МУЗЫКАЛЬНОГО ПЛЕЕРА
                if (!this.musicPlayer) {
                    this.musicPlayer = new Tone.Player().connect(this.musicVolume);
                    this.musicPlayer.loop = false; // <-- ВАЖНО: Убираем loop, будем планировать следующий трек вручную
                    this.musicPlayer.fadeIn = 2;
                    this.musicPlayer.fadeOut = 2;
                    this.currentTrackIndex = 0;

                    this.meter = new Tone.Meter(); // <-- ВОССТАНОВЛЕНО: Инициализируем анализатор
                    this.musicPlayer.connect(this.meter); // <-- ВОССТАНОВЛЕНО: Подключаем плеер к анализатору

                    // Планируем первый трек
                    this.loadAndPlayNextTrack();
                }

                // Запускаем Tone.Transport
                Tone.Transport.start();

                this.isInitialized = true;
                console.log("Audio initialized.");
            } catch (e) {
                console.error("Failed to initialize audio:", e);
            }
        }).catch(e => console.error("Tone.start() failed", e));
    },

    // ИЗМЕНЕНА: Загрузка и проигрывание следующего трека для кроссфейда и бесшовного перехода
    loadAndPlayNextTrack() {
        if (musicTracks.length === 0) {
            console.warn("No music tracks defined.");
            return;
        }

        // Выбираем следующий трек случайным образом, избегая повторения, если треков больше одного
        let nextTrackIndex;
        if (musicTracks.length > 1) {
            do {
                nextTrackIndex = Math.floor(Math.random() * musicTracks.length);
            } while (nextTrackIndex === this.currentTrackIndex);
        } else {
            nextTrackIndex = 0; // Если только один трек
        }
        this.currentTrackIndex = nextTrackIndex;
        const nextTrackUrl = musicTracks[this.currentTrackIndex];

        console.log(`Loading music track: ${nextTrackUrl}`);

        this.musicPlayer.load(nextTrackUrl).then(() => {
            console.log(`Music track loaded: ${nextTrackUrl}`);

            // Если плеер не играет, запускаем его немедленно
            if (this.musicPlayer.state !== 'started') {
                this.musicPlayer.start();
                console.log(`Music started: ${nextTrackUrl}`);
            }

            // Отменяем все предыдущие события, связанные с переключением треков
            Tone.Transport.cancel(this._nextTrackEventId);

            // Планируем вызов loadAndPlayNextTrack на момент окончания текущего трека
            const currentDuration = this.musicPlayer.buffer.duration;
            const fadeOutTime = this.musicPlayer.fadeOut || 0;
            this._nextTrackEventId = Tone.Transport.scheduleOnce(() => {
                this.loadAndPlayNextTrack();
            }, `+${currentDuration - (fadeOutTime / 2)}`); // Начинаем планировать чуть раньше окончания

        }).catch(error => {
            console.error(`Failed to load music track ${nextTrackUrl}:`, error);
            // В случае ошибки загрузки, попробуем следующий трек через короткое время
            setTimeout(() => this.loadAndPlayNextTrack(), 3000);
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
        if (!this.isInitialized) return;
        const db = level === 0 ? -Infinity : Tone.gainToDb(level / 100);
        this.sfxVolume.volume.rampTo(db, 0.1);
    },

    setMusicVolume(level) {
         if (!this.isInitialized || !this.musicPlayer) return;
         const db = level === 0 ? -Infinity : Tone.gainToDb(level / 100);
         this.musicPlayer.volume.rampTo(db, 0.1); // Плавно меняем громкость
         if (level > 0 && this.musicPlayer.state === 'stopped' && this.isInitialized) {
             this.loadAndPlayNextTrack();
         }
    },

    // НОВОЕ: Метод для получения текущих данных громкости от анализатора
    getVolume() {
        if (this.meter) {
            return this.meter.getValue(); // Возвращает значение в децибелах (от -100 до 0)
        }
        return -100; // Низкое значение, если анализатор не готов
    }
};