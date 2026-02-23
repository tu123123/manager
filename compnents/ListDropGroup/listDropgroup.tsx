'use client';
import { CSSProperties, ReactNode, useRef } from 'react';
import './listDropgroup.scss';
import Image from 'next/image';
import dropdownsvg from '@/compnents/assets/drop.svg';
interface ListDrop {
    title: string;
    children: ReactNode;
    style?: CSSProperties;
    styleHeader?: CSSProperties;
    classNameHeader?: string;
}
export function ListDropGroup({ title, children, style, styleHeader, classNameHeader }: ListDrop) {
    const refEl = useRef<HTMLDivElement | null>(null);
    const refElimg = useRef<HTMLImageElement | null>(null);

    return (
        <div
            ref={(e: HTMLDivElement) => {
                if (e) {
                    refEl.current = e;
                    if (refElimg.current && refEl.current.style.gridTemplateRows != 'min-content 0fr') {
                        refElimg.current.style.transform = 'rotate(180deg)';
                    }

                    // refEl.current.style.height = refEl.current.scrollHeight + "px";
                    // refEl.current.style.gridTemplateRows = "min-content 1fr";
                }
            }}
            style={style}
            className="ListDropgroup"
        >
            <div
                onClick={() => {
                    if (refEl.current && refElimg.current) {
                        if (refEl.current.style.gridTemplateRows == 'min-content 0fr') {
                            refEl.current.style.gridTemplateRows = 'min-content 1fr';
                            refElimg.current.style.transform = 'rotate(180deg)';
                        } else {
                            refEl.current.style.gridTemplateRows = 'min-content 0fr';
                            refElimg.current.style.transform = 'rotate(0deg)';
                        }
                        // if (refEl.current.style.height === "0px") {
                        //   refEl.current.style.height = "max-content";
                        //   refElimg.current.style.transform = "rotate(180deg)";
                        // } else {
                        //   refEl.current.style.height = "0px";
                        //   refElimg.current.style.transform = "rotate(0deg)";
                        // }
                    }
                }}
                style={styleHeader}
                className={'listHead ' + classNameHeader}
            >
                <Image ref={refElimg} src={dropdownsvg} alt=""></Image> {title}
            </div>
            <div className="listContent">{children}</div>
        </div>
    );
}
