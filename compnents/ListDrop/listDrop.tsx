'use client';
import React, { CSSProperties, memo, ReactNode, useRef } from 'react';
import './listDrop.scss';
import Image from 'next/image';
import dropdownsvg from '@/compnents/assets/drop.svg';
interface ListDrop {
    title: string | ReactNode;
    children: ReactNode;
    style?: CSSProperties;
    styleTitle?: CSSProperties;
    groupButton?: ReactNode;
    autoClose?: boolean;
    showDropIcon?: boolean;
    showGroupIcon?: boolean;
}

const ListDropComponent = ({ title, children, autoClose, style, groupButton, showDropIcon = true, showGroupIcon = false, styleTitle }: ListDrop) => {
    const refEl = useRef<HTMLDivElement | null>(null);
    const refElimg = useRef<HTMLImageElement | null>(null);
    const refGroup = useRef<HTMLDivElement | null>(null);
    const onClick = () => {
        if (refEl.current) {
            if (refEl.current.style.gridTemplateRows == 'min-content 0fr') {
                refEl.current.style.gridTemplateRows = 'min-content 1fr';
                if (refElimg.current) refElimg.current.style.transform = 'rotate(180deg)';
                if (refGroup.current) refGroup.current.classList.add('GroupDrop-active');
            } else {
                refEl.current.style.gridTemplateRows = 'min-content 0fr';
                if (refElimg.current) refElimg.current.style.transform = 'rotate(0deg)';
                if (refGroup.current) refGroup.current.classList.remove('GroupDrop-active');
            }
        }
    };
    return (
        <div
            ref={(e: HTMLDivElement) => {
                if (e) {
                    refEl.current = e;
                    if (refEl.current.style.gridTemplateRows != 'min-content 0fr') {
                        if (refElimg.current) refElimg.current.style.transform = 'rotate(180deg)';
                        if (refGroup.current) refGroup.current.classList.add('GroupDrop-active');
                    }
                    // refEl.current.style.gridTemplateRows = "min-content 1fr";
                }
            }}
            style={{ gridTemplateRows: autoClose ? 'min-content 0fr' : '', ...style }}
            className="ListDrop"
        >
            <div
                style={styleTitle}
                onClick={() => {
                    onClick();
                }}
                className="listHead"
            >
                {showGroupIcon ? <div ref={refGroup} className="GroupDrop "></div> : <div></div>}
                {title}{' '}
                <div
                    style={{
                        display: 'flex',

                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    {groupButton}
                    {showDropIcon ? <Image ref={refElimg} src={dropdownsvg} alt=""></Image> : <div></div>}
                </div>
            </div>
            <div className="listContent">{children}</div>
        </div>
    );
};
export const ListDrop = memo(ListDropComponent);
