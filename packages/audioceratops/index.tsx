import React, {
    FC,
    MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';

import {
    convertKeyCode,
    formatTime,
    roundNumber,
} from '@terrible-lizard/utilidon';
import { RangodonProps } from '@terrible-lizard/rangodon';

import AudioceratopsIcon, { PlayIconProps } from './components/AudioceratopsIcon';
import AudioceratopsTime, { TimeProps } from './components/AudioceratopsTime';
import AudioceratopsTrackBar from './components/AudioceratopsTrackBar';
import {
    AudioceratopsControls,
    AudioceratopsPlayBtn,
    AudioceratopsTimeline,
} from './styles';

type AudioSourceData = {
    url: string,
    type: string
};

interface AudioceratopsProps {
    id: string;
    onEnd: (id: string) => void;
    onPlay: (id: string) => void;
    onTogglePlay: (id: string, isPlaying: boolean) => void;
    play: boolean;
    playerTime: FC<TimeProps>;
    playIcon: FC<PlayIconProps>;
    progressColor: string;
    showTimestamps: boolean;
    sources: AudioSourceData[];
    trackBar: FC<RangodonProps>;
    trackColor?: string;
}

function renderAudioSource(source: AudioSourceData) {
    return <source key={ `src-${source.type}` } src={ source.url } type={ `audio/${source.type}` } />;
}

const Audioceratops: FC<AudioceratopsProps> = (props) => {
    const {
        id,
        onEnd,
        onPlay,
        onTogglePlay,
        play,
        playerTime: PlayerTime,
        playIcon: PlayIcon,
        progressColor,
        showTimestamps,
        sources,
        trackBar: TrackBar,
        trackColor,
        ...rest
    } = props;
    const defaultPlayState = {
        timeLeft      : '00:00',
        timePlayed    : '00:00',
        percentPlayed : 0,
    }
    const [isPlaying, setIsPlaying] = useState(false);
    const [playState, setPlayState] = useState(defaultPlayState);
    const [isControlled, setIsControlled] = useState(typeof (play) !== 'undefined');

    const audioNode = useRef<HTMLAudioElement>(null!);
    const audioTimeUpdating = useRef<any>(null);
    const getNewPlayerCurrentTime = (percent: number) => {
        const duration = _get(audioNode, 'current.duration', 0);

        return duration * roundNumber((percent / 100), 2);
    };
    // set current time to formatted audio current time
    const updateTime = (callback: () => void = () => {}) => {
        setPlayState({
            timePlayed    : formatTime(audioNode.current.currentTime),
            timeLeft      : `-${formatTime(Math.floor(audioNode.current.duration) - Math.floor(audioNode.current.currentTime))}`,
            percentPlayed : roundNumber(100 * (audioNode.current.currentTime / audioNode.current.duration), 4),
        });

        callback();
    };
    const onUpdateTime = useCallback(() => {
        updateTime();
    }, [audioNode, setPlayState]);
    const updateLoop = () => {
        updateTime();
        audioTimeUpdating.current = window.requestAnimationFrame(updateLoop);
    };
    const playAudio = () => {
        if (!audioTimeUpdating.current) {
            audioTimeUpdating.current = window.requestAnimationFrame(updateLoop);
        }
        audioNode.current.play();
        setIsPlaying(true);
        onPlay(id);
    };
    const pauseAudio = () => {
        setIsPlaying(false);
        audioNode.current.pause();
        window.cancelAnimationFrame(audioTimeUpdating.current);
        audioTimeUpdating.current = null;
        onEnd(id);
    };
    const toggleAudio = () => {
        if (isControlled) {
            onTogglePlay(id, isPlaying);
        } else {
            if (!isPlaying) {
                playAudio();
            } else {
                pauseAudio();
            }
        }
    };
    const onAudioEnded = () => {
        pauseAudio();
        onEnd(id);
    };
    const scrubAudio = (inputValue: number) => {
        const newTime: number = getNewPlayerCurrentTime(inputValue);
        
        if (!isNaN(newTime) && audioNode.current) {
            audioNode.current.currentTime = newTime;
            updateTime();
        }
    };
    const startScrubbing = () => {
        if (isPlaying) {
            audioNode.current.pause();
        }
    };
    const doneScrubbing = (e: MouseEvent<HTMLInputElement>) => {
        const inputValue = parseFloat((e.target as HTMLInputElement).value);
        const newTime: number = getNewPlayerCurrentTime(inputValue);
        
        if (!isNaN(newTime)) {
            audioNode.current.currentTime = newTime;
            updateTime(() => {
                if (isPlaying) {
                    audioNode.current.play();
                }
            });
        }
    };
    const handleKeyboard = (e: KeyboardEvent) => {
        const {
            isEnter,
            isSpace,
        } = convertKeyCode(e);
        if (isEnter || isSpace) {
            toggleAudio();
        }
    };
    const renderAudioTime = (time: string) => {
        if (showTimestamps) {
            return <PlayerTime time={time} />;
        }
        
        return null;
    };

    useEffect(() => {
        audioNode.current.addEventListener('canplaythrough', onUpdateTime);
        audioNode.current.addEventListener('loadedmetadata', onUpdateTime);
        audioNode.current.addEventListener('timeupdate', onUpdateTime);

        return () => {
            audioNode.current.removeEventListener('canplaythrough', onUpdateTime);
            audioNode.current.removeEventListener('loadedmetadata', onUpdateTime);
            audioNode.current.removeEventListener('timeupdate', onUpdateTime);
            window.cancelAnimationFrame(audioTimeUpdating.current);
        }
    }, []);

    useEffect(() => {
        const isControlled = typeof (play) !== 'undefined';
        
        setIsControlled(isControlled);

        if (isControlled) {
            if (play) {
                playAudio();
            } else {
                pauseAudio();
            }
        }
    }, [play]);

    return (
        <div { ...rest }>
            <audio
                id={id}
                ref={audioNode}
                onEnded={onAudioEnded}
            >
                {sources.map(renderAudioSource)}
            </audio>
            <AudioceratopsControls>
                <AudioceratopsPlayBtn onClick={toggleAudio}>
                    <PlayIcon isPlaying={isPlaying} />
                </AudioceratopsPlayBtn>
                <AudioceratopsTimeline>
                    {renderAudioTime(playState.timePlayed)}
                    <TrackBar
                        id={`${id}-trackbar`}
                        onChange={scrubAudio}
                        onKeyDown={handleKeyboard}
                        onMouseDown={startScrubbing}
                        onMouseUp={doneScrubbing}
                        value={playState.percentPlayed}
                    />
                    {renderAudioTime(playState.timeLeft)}
                </AudioceratopsTimeline>
            </AudioceratopsControls>
        </div>
    );
};

Audioceratops.defaultProps = {
    onEnd          : () => {},
    onPlay         : () => {},
    onTogglePlay   : () => {},
    playerTime     : AudioceratopsTime,
    playIcon       : AudioceratopsIcon,
    showTimestamps : true,
    trackBar       : AudioceratopsTrackBar,
} as Partial<AudioceratopsProps>;

export default Audioceratops;
    