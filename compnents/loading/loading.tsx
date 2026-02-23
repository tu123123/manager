import Image from 'next/image';
import loading from './loading.svg';
import './index.scss';
import React from 'react';

export default function Loading({ loadingref }) {
    return (
        <div
            style={{
                display: 'none'
            }}
            ref={(e) => {
                console.log(e);
                if (e && loadingref) {
                    loadingref.current = {
                        on: () => (e.style.display = 'flex'),
                        off: () => (e.style.display = 'none')
                    };
                }
            }}
            className="loadingcomponent"
        >
            <Image alt="" src={loading}></Image>
        </div>
    );
}
