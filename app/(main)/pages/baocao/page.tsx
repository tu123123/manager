'use client';

import { ListDrop } from '@/compnents/ListDrop/listDrop';
import { ListDropGroup } from '@/compnents/ListDropGroup/listDropgroup';
import './index.scss';
import { lienheStore } from '@/store/lienheStore';
import { danhsachphieuType, hangnhapStore } from '@/store/hangnhapStore';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';
import { formatNumber } from '@/compnents/e2e';
import { Dialog } from 'primereact/dialog';
import { thanhtoanStore } from '@/store/thanhtoanStore';
import { donhangItem, donHangStore, hangxuatType } from '@/store/donhangStore';
import { Button } from 'primereact/button';
const DetailConngno = ({ onClose, listCongno }: { listCongno: donhangItem[]; onClose: () => void }) => {
    
    return (
        <Dialog header={'Danh sách đơn'} visible={true} onHide={onClose}>
            <div className="DetailConngno3">
                <table className="table-congno">
                    {listCongno.map((i) => {
                        return (
                            <tr key={i.id}>
                                <td>{i.name}</td>

                                <td
                                    style={{
                                        textAlign: 'end'
                                    }}
                                >
                                    {formatNumber(i.itemList.reduce((a, b) => a + (b.gia - b.cost) * b.soluong, 0))}
                                </td>
                            </tr>
                        );
                    })}
                </table>
                <div className="footercongno">
                    <table>
                        <tr>
                            <td>Tổng:</td>
                            <td>{formatNumber(listCongno.reduce((ii, i) => ii + i.itemList.reduce((a, b) => a + (b.gia - b.cost) * b.soluong, 0), 0))}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </Dialog>
    );
};
const Danhsachphieu = ({ onClose, onChange }: { listCongno: donhangItem[]; onClose: () => void ,onChange:(e)=>void}) => {
       const { hangxuat, getHangxuat } = donHangStore();
       const [value,setValue]=useState({
        start:null,
        end:null
       })
         const footer = (
               <div
                   style={{
                       display: 'flex',
                       gap: '5px',
                       justifyContent: 'end'
                   }}>
    
                   <Button
                       size="small"
                       onClick={(()=>{
                        onClose()
                        onChange(value)
                       })}
                       label="Xác nhận"
                   ></Button>
                    <Button size="small"  onClick={()=>{
                        setValue({
                            start:null,
                            end:null
                        })
                    }} label="Chọn lại"></Button> 
                   <Button size="small" onClick={onClose} label="Đóng"></Button> 
               </div>
           );
    return (
        <Dialog header={'Danh sách phiếu'} footer={footer} visible={true} onHide={onClose}>
            <div className="Danhsachphieu">
              {hangxuat.map((i,indx)=>{
                return <div  key={i.id} onClick={()=>{
                                        value.end=indx
                    if(value.start ===null)
                        value.start=indx
                    if(value.start !==null&&value.start>value.end)
                        value.start=value.end
                   
                    setValue(pre=>({...pre}))
                }} className={`phieuitem ${value.start!==null&&value.start<=indx&&indx<=value.end?"selectday":""}`}>
                    {i.ten}
                </div>
              })}
            </div>
        </Dialog>
    );
};
export default function Congno() {
    const { hangxuat, getHangxuat } = donHangStore();
    useEffect(() => {
        getHangxuat();
    }, []);
    const [open, setOpen] = useState<danhsachphieuType[] | null>();
    const [openbill,setOpenBill]=useState(false)
       const [filter,setFilter]=useState({
        start:null,
        end:null
       })
    return (
        <div className="khachhang-container">
          {openbill? <Danhsachphieu onClose={()=>setOpenBill(false)} onChange={setFilter}></Danhsachphieu>:<></>} 
            {open && <DetailConngno onClose={() => setOpen(null)} listCongno={open as donhangItem}></DetailConngno>}
            <div
                style={{
                    padding: '10px',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h4>Báo cáo</h4>
                <Button onClick={()=>{
                    setOpenBill(true)
                }} label="Chọn phiếu"></Button>
            </div>
            <div className="congno-content">
                {hangxuat.filter((a,i)=>filter.start!==null&&filter.start<=i&&filter.end>=i).map((i) => {
                    return (
                        <div
                            onClick={() => setOpen(i.itemList)}
                            className="congnoItem"
                            key={i.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}
                        >
                            <div>{i.ten}</div>
                            <div className="itemcongno">{formatNumber(i.itemList.reduce((a, b) => a + b.itemList.reduce((c, d) => c + (d.gia * d.soluong - d.cost * d.soluong), 0), 0))}</div>
                        </div>
                    );
                })}
            </div>
            <div className='footerTotal'>
                <div>Tổng: {formatNumber(hangxuat.filter((a,i)=>filter.start!==null&&filter.start<=i&&filter.end>=i).reduce((a,b)=>a+b.itemList.reduce((x,y)=>x+y.itemList.reduce((i,ii)=>i+(ii.gia-ii.cost)*ii.soluong,0),0),0))}</div>
            </div>
        </div>
    );
}
