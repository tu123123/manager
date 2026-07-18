'use client';

import { ListDrop } from '@/compnents/ListDrop/listDrop';
import { ListDropGroup } from '@/compnents/ListDropGroup/listDropgroup';
import './index.scss';
import editsvg from '@/compnents/assets/edit.svg';
import { lienheStore } from '@/store/lienheStore';
import { danhsachphieuType, hangnhapStore } from '@/store/hangnhapStore';
import { useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import downSvg from '@/compnents/assets/download.svg';
import { formatNumber } from '@/compnents/e2e';
import { Dialog } from 'primereact/dialog';
import { thanhtoanStore } from '@/store/thanhtoanStore';
import { Button } from 'primereact/button';
import Image from 'next/image';
import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { toPng } from 'html-to-image';
const formatvalue='DD-MM-YYYY'
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { Input } from 'antd-mobile';
import { messhangnhapStore } from '@/store/messhangnhap';
const DetailConngno = ({ onClose, listCongno }: { listCongno: danhsachphieuType[]; onClose: () => void }) => {
    const [value, setValue] = useState();
    const { dsThanhtoan } = thanhtoanStore();
    const { phieunhap } = hangnhapStore();
        const [show,setShow]=useState(false)
         const index = listCongno.findIndex(x=>x.endbill)
         console.log(index)
    const total = listCongno.reduce((a, b) => a + b.itemList.reduce((c, d) => c + d.soluong * d.gia, 0), 0);
    const payment = dsThanhtoan.filter(x=>(!show?x.group==listCongno[index]?.id:true)&& x?.idDoitac === listCongno[0].idDoitac).reduce((a, b) => a + b.sotien, 0);
   console.log(listCongno)
   
    

     
        const imgRef = useRef();
      const footerContent = () => {
        return (
            <div
                style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'end'
                }}
            >
                <Button onClick={()=>setShow(!show)} raised outlined size="small" security="" height={20}>Show</Button>
                <Button
                    raised
                    outlined
                    size="small"
                    onClick={async () => {
                        const el = imgRef.current
                      
                        const dataUrl = await toPng(el, { cacheBust: true, backgroundColor: '#ffffff' });

                        const base64Data = dataUrl.split(',')[1];

                        if (Capacitor.isNativePlatform()) {
                            // ✅ ANDROID / IOS
                            await Filesystem.requestPermissions();

                            await Filesystem.writeFile({
                                path: `export-${Date.now()}.png`,
                                data: base64Data,
                                directory: Directory.Documents,
                                encoding: Encoding.Base64
                            });

                            alert('Đã lưu vào Documents 📁');
                        } else {
                            // ✅ WEB
                            const link = document.createElement('a');
                            link.href = dataUrl;
                            link.download = 'export.png';
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        }
               
                    }}
                    icon={<Image src={downSvg} alt="" height={20}></Image>}
                ></Button>
                
            </div>
        );
    };
    return (
        <Dialog footer={footerContent} header={'Danh sách đơn'} visible={true} onHide={onClose}>
           <div ref={imgRef} className='printerdetail'>
             <div className="DetailConngno2">
                <div className='headerdonhang'>
                    <h4>Hoa tươi Hoàng vũ</h4>
                    <p>ĐC: 306 Nguyên Tử Lực, phường Lâm Viên, Đà Lạt, Lâm Đồng</p>
                 <p>SĐT: 0977625859 - 0357577926</p>
                    <div style={{
                        padding:'5px',
                        fontSize:'20px',
                        fontWeight:'bold',
                        textAlign:'center'
                    }}>Hóa đơn nhập hàng</div>
                    <h6>Người bán: {listCongno[0].tenDoiTac}</h6>
                </div>
                <table className="table-congno">
                    {[...listCongno.slice(0,index<0||show?listCongno.length:index)]?.reverse()?.map((i) => {
                        return i.itemList.map((x, index) => {
                            return (
                                <tr key={x.id}>
                                    <td>{index == 0 ? phieunhap.find((xx) => xx.id === i.group)?.ten : ''}</td>
                                    <td>{x.ten}:</td> <td>{x.soluong}</td>
                                    <td>x</td>
                                    <td>{x.gia}</td>
                                    <td>=</td>
                                    <td>{formatNumber(x.gia * x.soluong)}</td>
                                </tr>
                            );
                        });
                    })}
                </table>
                {show?<div className="footercongno">
                    <table>
                        <tr>
                            <td>Tổng:</td>
                            <td>{formatNumber(total)}</td>
                        </tr>
                        <tr>
                            <td>Đã thanh toán:</td>
                            <td>{formatNumber(payment)}</td>
                        </tr>
                        <tr
                            style={{
                                color:'red',
                                fontWeight: 'bold'
                            }}
                        >
                            <td>Còn lại:</td>
                            <td
                                style={{
                                    textAlign: 'end'
                                }}
                            >
                                {formatNumber(total - payment)}
                            </td>
                        </tr>
                    </table>
                </div>: <div className="footercongno">
                    <table  >
                        <tr    style={{
                           
                                fontWeight: 'bold'
                            }}>
                            <td>Tổng:</td>
                            <td>{formatNumber(listCongno.slice(0,index<0?listCongno.length:index).reduce((a,b)=>a+b.itemList.reduce((c,d)=>c+d.gia*d.soluong,0),0))}</td>
                        </tr>
                          <tr >
                            <td>Đã thanh toán:</td>
                            <td>{formatNumber(payment)}</td>
                        </tr>
                         <tr    style={{
                                color:'red',
                                fontWeight: 'bold'
                            }}>
                            <td>Còn lại:</td>
                            <td>{formatNumber(listCongno.slice(0,index<0?listCongno.length:index).reduce((a,b)=>a+b.itemList.reduce((c,d)=>c+d.gia*d.soluong,0),0)-payment)}</td>
                        </tr>
                    </table>
                </div> }
            </div>
           </div>
        </Dialog>
    );
};
export default function Congno() {
    const { getmessPhieunhap,phieunhapmess } = messhangnhapStore();
    const { danhsachPhieu, getPhieunhap, getDanhSachPhieunhap } = hangnhapStore();
    const { getLienhe, lienhe } = lienheStore();
    const router = useRouter();
        const [search,setSearch]=useState('')
    const { getThanhtoan, dsThanhtoan } = thanhtoanStore();
    useEffect(() => {
        getmessPhieunhap()
        getLienhe();
    }, []);
    const [open, setOpen] = useState<danhsachphieuType[] | null>();

    return (
        <div className="khachhang-container">
            {open && <DetailConngno onClose={() => setOpen(null)} listCongno={open as danhsachphieuType[]}></DetailConngno>}
            <div
                style={{
                    padding: '10px',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h4>Danh sách Công nợ</h4>
            </div>
            <Input style={{
                            borderBottom:'1px solid gray'
                            }} placeholder='Tìm kiếm...' value={search} onChange={(e)=>setSearch(e)}></Input>
            <div className="congno-content">
                {/* {lienhe
                    .sort((x, y) => {
                        const listCongno = (xx) => {
                            const payment = dsThanhtoan.filter((x) => x.idDoitac === xx.id).reduce((a, b) => a + b.sotien, 0);
                            return danhsachPhieu.filter((x) => x.idDoitac === xx.id).reduce((a, b) => a + b.itemList.reduce((c, d) => c + d.soluong * d.gia, 0), 0) - payment;
                        };
                        let a = listCongno(x);
                        let b = listCongno(y);
                        return b - a;
                    })
                    .map((i) => {
                        const listCongno = danhsachPhieu.filter((x) => x.idDoitac === i.id);
                        const total = listCongno.reduce((a, b) => a + b.itemList.reduce((c, d) => c + d.soluong * d.gia, 0), 0);
                        const payment = dsThanhtoan.filter((x) => x.idDoitac === i.id).reduce((a, b) => a + b.sotien, 0);
                        return (
                            <div
                                onClick={() => listCongno.length && setOpen(listCongno)}
                                className="congnoItem"
                                key={i.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}
                            >
                                <div>{i.name}</div>
                                <div className="itemcongno">{formatNumber(total - payment)}</div>
                            </div>
                        );
                    })} */}
                      {lienhe.filter(i=>i.name?.toLowerCase().includes(search?.toLowerCase()))              
                    .map((i) => {
                        const total=phieunhapmess?.find(x=>x.iduser===i.id)?.itemList.reduce((a,b)=>a+b.gia*b.soluong*(b.pay?-1:1),0)
                        return (
                            <div
                                 onClick={() => router.push('/pages/nhaphangmess?id=' + i.id)}
                                className="congnoItem"
                                key={i.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}
                            >
                                <div>{i.name}</div>
                            <div className="itemcongno">{formatNumber(total||0)}</div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
