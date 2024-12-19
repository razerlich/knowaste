import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../../../animations/AnimationLoading.json';

const LoadingOverlay = ({ text }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-half_transparent z-50">
            <div className="text-center">
                <Player
                    autoplay
                    loop
                    src={animationData}
                    className="w-24 h-24"
                />
                <p className="text-green text-2xl font-semibold mt-4">{text}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;