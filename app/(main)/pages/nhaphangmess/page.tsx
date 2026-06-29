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
import { SelectComponent } from '@/compnents/InputSearch/selectComponent';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { loadingRef } from '@/layout/AppConfig';
import { addData, updateData } from '@/compnents/config';
import { messhangnhapStore, phieunhaptypemess } from '@/store/messhangnhap';
import { uuid } from 'uuidv4';
import { Checkbox } from 'antd-mobile';
import { confirmDialog } from 'primereact/confirmdialog';
const dbPhieunhap = 'donnhaphang';
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
             <div className="DetailConngno">
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
const ModalDonhang = ({ onClose, dataEdit,id }: {id:string, onClose: () => void; dataEdit: phieunhaptype }) => {
    const [value, setValue] = useState(
        dataEdit?.id
            ? JSON.parse(JSON.stringify(dataEdit))
            : {
                  ten: '',
                  iduser:id,
                  itemList: []
              }
    );
    const footer = (
        <>
            <Button
                onClick={() => {
                    loadingRef.current?.on();
                    if (dataEdit?.id)
                        return updateData(
                            dbPhieunhap,
                            dataEdit.id,
                            value,
                            () => {
                                onClose();
                                loadingRef.current?.off();
                            },
                            () => loadingRef.current?.off()
                        );

                    addData(
                        dbPhieunhap,
                        value,
                        () => {
                            onClose();
                            loadingRef.current?.off();
                        },
                        () => loadingRef.current?.off()
                    );
                }}
                label="Lưu"
            ></Button>
        </>
    );
    return (
        <Dialog onHide={onClose} header="Thêm đơn hàng" footer={footer} visible>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập tên phiếu nhập</label>
                <InputText id="username" value={value.ten} onChange={(e) => setValue((pre) => ({ ...pre, ten: e.target.value }))} />
            </label>
        </Dialog>
    );
};
export default function Congno() {
    const { getmessPhieunhap,phieunhapmess } = messhangnhapStore();
    const { getLienhe, lienhe } = lienheStore();
    const [id,setId]=useState()
    const { getThanhtoan, dsThanhtoan } = thanhtoanStore();
    const [value,setValue]=useState({
        ten:'',
        time:'',
        soluong:0,
        gia:0,
        id:'',
        pay:false
    })
const timerRef = useRef<number>();

const handleMouseDown = (a) => {
  timerRef.current = window.setTimeout(() => {
   confirmDialog({
                           message: 'Bạn có chắc muốn xóa đơn hàng này này',
                           header: 'Xác nhận!',
                           accept: () => {
                            a.delete=true
                            data.itemList=data.itemList.filter(i=>!i.delete)
                               loadingRef.current?.on();
                                  updateData(
                                    dbPhieunhap,
                                    data.id,
                                   data,
                                    () => {
                                        loadingRef.current?.off();
                                        
                                    },
                                    () => {
                                        loadingRef.current?.off();
                                    }
                                );
                              
                           }
                       });
  }, 2000);
};

const handleMouseUp = () => {
  clearTimeout(timerRef.current);
};
    const [data,setData]=useState<phieunhaptypemess>();
    useEffect(() => {
        getmessPhieunhap();
        getLienhe();
             const params = new URLSearchParams(window.location.search);
        
                const id = params.get('id');
                setId(id)
          
    }, []);
    const [open, setOpen] = useState();

    return (
      
            <div className="nhaphangmess-content">
                {open&&<ModalDonhang id={id} onClose={()=>setOpen(false)}></ModalDonhang>}
              <div className='nhaphangmess-head'><Button onClick={()=>{setOpen(true)}} label='Tạo đơn'></Button><SelectComponent
                    data={phieunhapmess.filter(i=>i.iduser==id)}
                    label='ten'
                    onChange={(e) => {
                        setData(e)
                      
                    }}
                    value={data?.ten}
                ></SelectComponent></div>
              {data?.id?<>  <div ref={e=>{
                if(e)
                e.scrollTop = e.scrollHeight;
              }} className='nhaphangmess-body'>
                   {data.itemList?.map((a,index)=>{
                    let time=false
                    if(index===0)
                        time=true
                   else if(moment(a.time).format('DD/MM/YYYY')!==moment(data.itemList[index].time).format('DD/MM/YYYY'))
                        time=true
                    return  <div key={a.id} className='mess-text'> 
                        {time?<div className='time'>{moment(a.time).format('DD/MM/YYYY')}</div>:<></>}
                        <div onTouchStart={()=>handleMouseDown(a)}
                            onTouchEnd={handleMouseUp}
                        onClick={()=>{
                            setValue(JSON.parse(JSON.stringify(a)))
                        }} style={{
                           
                            justifySelf:a.pay?'start':''
                        }} className={`mess-content ${a.pay?'pay':''}`}>{`${a.ten} : ${a.soluong} * ${formatNumber(a.gia)} = ${formatNumber(a.soluong*a.gia)}`}</div>
                      
                    </div>
                   })}
                    
                </div>
                <div className='total'>{`Tổng tiền: ${formatNumber(data.itemList.reduce((a,b)=>a+b.gia*b.soluong*(b.pay?-1:1),0))}`}</div>
                <div className='nhaphangmess-footer'>
                    <div className='footer-content'>
                     <div className='textinput'>
                           <InputText    value={value.ten}
                    onChange={(e) => {
                        value.ten = e.target.value;
                   setValue(pre=>({...pre}))
                    }}
                    autoFocus placeholder='tên...'></InputText>
                    <Checkbox
                                                onChange={(e) => {
                                                    value.pay = e;
                                                    setValue(pre=>({...pre}));
                                                }}
                                                checked={value.pay}
                                            ></Checkbox>
                     </div>
                        <div className='footer-number'>
                            <InputNumber  value={value.soluong}
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(e) => {
                        value.soluong = (e.value as number);
                        setValue(pre=>({...pre}))
                    }} placeholder='số lượng..'></InputNumber>  <InputNumber  value={value.gia / 1000}
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(e) => {
                        value.gia = (e.value as number) * 1000;
                        setValue(pre=>({...pre}))
                    }} placeholder='giá..'></InputNumber>
                        </div>
                    </div>
                    <Button onClick={()=>{
                        if(value.id)
                        {
                            const index = data.itemList.findIndex(x => x.id === value.id);

if (index !== -1) {
  data.itemList[index] = value;
}
                        }
                        else
                        data.itemList.push({...value,time:moment().format("YYYY-MM-DDTHH:mm:ss"),id:uuid()})
                    setValue({
                                ten:'',
        time:'',
        soluong:0,
        gia:0,
        pay:false
                    })
                                                loadingRef.current?.on()
                      updateData(
                                    dbPhieunhap,
                                    data.id,
                                    data,
                                    () => {
                                        loadingRef.current?.off();
                                        
                                    },
                                    () => {
                                        loadingRef.current?.off();
                                    }
                                );
                    }} label={value.id?"Sửa":'Nhập'}></Button>
                </div></>:<><div></div><div></div></>}
            </div>
      
    );
}
