import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const BackToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 
                    dark:hover:bg-blue-600 text-white w-12 h-12 rounded-full border-none cursor-pointer 
                    flex items-center justify-center shadow-lg transform hover:scale-110 hover:shadow-xl 
                    active:scale-95 transition-all duration-300 ease-in-out group z-50"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp className="w-5 h-5 transition-transform duration-300 ease-in-out 
                    group-hover:-translate-y-1" />
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity 
                    duration-300 text-sm bg-gray-800 text-white px-3 py-1 rounded-md whitespace-nowrap">
                        Back to top
                    </div>
                </button>
            )}
        </>
    );
};

export default BackToTopButton;
