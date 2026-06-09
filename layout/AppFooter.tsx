/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import calendarsvg from '@/compnents/assets/calendar.svg'
import importsvg from '@/compnents/assets/impor.svg'
import exportsvg from '@/compnents/assets/export2.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const listmenu=[
        {
            icon:exportsvg,
            link:'/pages/xuathang'
        }
        ,
         {
            icon:calendarsvg,
            link:'/pages/lich'
        }
        , {
            icon:importsvg,
            link:'/pages/nhaphang'
        }
    ]
    return (
        <div className="layout-footer">
            {listmenu.map(i=>{
                return  <div onClick={()=>router.push(i.link)} key={i.link}>
              <Image height={30}  src={i.icon} alt=''></Image>
          </div>
            })}
         
    
            
        </div>
    );
};

export default AppFooter;
