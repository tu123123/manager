/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import downSvg from '@/compnents/assets/download.svg';
import { ChartData, ChartOptions } from 'chart.js';
import './style.scss'
import { donhangItem, donHangStore, hangxuatType, itemList } from '@/store/donhangStore';
import { Checkbox } from 'primereact/checkbox';
import { updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { formatNumber } from '@/compnents/e2e';
import { danhsachphieuType } from '@/store/hangnhapStore';
import { toPng } from 'html-to-image';
import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import Image from 'next/image';
const DetailConngno = ({ onClose, listCongno }: { listCongno: danhsachphieuType[]; onClose: () => void }) => {
    const [value, setValue] = useState();
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
                    }}>Danh sách đặt hàng</div>
                </div>
                <table className="table-congno">
                    <thead>
                        <tr>
                            <th>
                            Tên
                        </th>
                        <th>Số lượng</th>
                        </tr>
                    </thead>
                    {listCongno?.map((x) => {

                            return (
                                <tr key={x.id}>
                                  
                                    <td>{x.ten}:</td> <td>{x.soluong}</td>
                                    
                                </tr>
                            );
                      
                    })}
                </table>
               
            </div>
           </div>
        </Dialog>
    );
};
const Edit = ({ value, setValue }: { value: itemList; setValue: () => void }) => {
    const [edit, setEdit] = useState(false);
    return edit ? (
        <InputNumber
            onBlur={() => setEdit(!edit)}
            autoFocus
            size={1}
            style={{
                width: '50px'
            }}
            value={value.soluong}
            mode="decimal"
            minFractionDigits={0}
            maxFractionDigits={5}
            onChange={(x) => {
                value.soluong = x.value as number;
                setValue();
            }}
        ></InputNumber>
    ) : (
        <div
            onClick={() => {
                setEdit(!edit);
            }}
        >
            {value.soluong}
        </div>
    );
};
const BillItem = ({ price, item, setState,order }: {order:boolean; price: boolean; item: donhangItem; setState: () => void }) => {
    return (
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div>
                    <strong className="block text-500 font-medium mb-3">{item.name}</strong>
                    {/* <div className="text-900 font-medium text-xl">152</div> */}
                </div>
                <table
                    style={{
                        width: '100%'
                    }}
                >
                    {price&&!order ? (
                        <tr>
                            <th></th>
                            <th></th>
                            <th
                                style={{
                                    textAlign: 'start'
                                }}
                            >
                                Giá
                            </th>{' '}
                            <th
                                style={{
                                    textAlign: 'start'
                                }}
                            >
                                Vốn
                            </th>
                        </tr>
                    ) : (
                        <></>
                    )}
                    {item.itemList.map((i) => {
                        return (
                            <tr
                                className="trTable"
                                style={{
                                    opacity: i.checked && !price&&!order ? 0.3 : 1,
                                    textDecoration: i.checked && !price&&!order ? 'line-through' : ''
                                }}
                                key={i.id}
                            >
                                <td>{i.ten}
                                <div>
                                    <div style={{
                                        padding:'5px',
                                        borderBottom:'1px dashed #dbdbdb',
                                        color:'#949494',
                                        fontSize:'12px'
                                    }}>{i.note}</div>
                                </div>
                                </td>
                                <td>:</td>
                                {order?<><td>{i.soluong}</td><td> <Checkbox
                                                onChange={(e) => {
                                                    i.order = e.checked;
                                                    setState();
                                                }}
                                                checked={i.order}
                                            ></Checkbox></td></>:price ? (
                                    <>
                                        <td
                                            style={{
                                                display: 'flex',
                                                gap: '10px'
                                            }}
                                        >
                                            <InputNumber
                                                size={1}
                                                mode="decimal"
                                                minFractionDigits={0}
                                                maxFractionDigits={5}
                                                value={i.gia / 1000}
                                                onChange={(e) => {
                                                    i.gia = e.value * 1000;
                                                    setState();
                                                }}
                                            ></InputNumber>
                                        </td>
                                        <td>
                                            <InputNumber
                                                size={1}
                                                mode="decimal"
                                                minFractionDigits={0}
                                                maxFractionDigits={5}
                                                value={i.cost / 1000}
                                                onChange={(e) => {
                                                    i.cost = e.value * 1000;
                                                    setState();
                                                }}
                                            ></InputNumber>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            <Edit value={i} setValue={setState}></Edit>
                                        </td>
                                        <td>
                                            <Checkbox
                                                onChange={(e) => {
                                                    i.checked = e.checked;
                                                    setState();
                                                }}
                                                checked={i.checked}
                                            ></Checkbox>
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </table>
            </div>
        </div>
    );
};
const Dashboard = () => {
    const [price, setPrice] = useState(false);
      const [order, setorder] = useState(false);
      const [getorder,setGetorder]=useState(false);
    const { getHangxuat, hangxuat } = donHangStore();
    const [value, setValue] = useState<hangxuatType>();
    useEffect(() => {
        getHangxuat();
    }, []);
    useEffect(() => {
        if (hangxuat[0]) setValue(JSON.parse(JSON.stringify(hangxuat[0])));
    }, [hangxuat]);
    return (
        <div
            className="dasboard"
            style={{
                display: 'grid',
                gap: '10px',
                gridTemplateRows: 'auto 1fr',
                height: '100%'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'end'
                }}
            >  <Button
                    onClick={() => {
                        setorder(!order);
                    }}
                    label={order?'Quay lại':'Đặt hàng'}
                ></Button>
                {order?<Button
                    onClick={() => {
                        let listorder=[];
                        for(let i of value?.itemList)
                        {
                            listorder=[...listorder,...i.itemList.filter(a=>a.order)]
                        }
                       const result = Object.values(
  listorder.reduce((acc, item) => {
    if (!acc[item.ten]) {
      acc[item.ten] = { ...item };
    } else {
      acc[item.ten].soluong += item.soluong;
    }
    return acc;
  }, {})
);

                        setGetorder(result);
                    }}
                    label="Đặt"
                ></Button>:<></>}
              {!order?<>  <Button
                    onClick={() => {
                        setValue(JSON.parse(JSON.stringify(hangxuat[0])));
                    }}
                    label="Reset"
                ></Button>
                
                <Button
                    onClick={() => {
                        setPrice(!price);
                    }}
                    label="Giá"
                ></Button>
                <Button
                    outlined
                    onClick={() => {
                        loadingRef.current?.on();
                        updateData(
                            'hangxuat',
                            value?.id,
                            value,
                            () => {
                                loadingRef.current?.off();
                            },
                            () => {
                                loadingRef.current?.off();
                            }
                        );
                    }}
                    label="Lưu"
                ></Button></>:<></>}
            </div>
            {getorder?<DetailConngno onClose={()=>setGetorder(null)} listCongno={getorder}></DetailConngno>:<></>}
            <div
                style={{
                    overflow: 'auto'
                }}
                className="grid"
            >
                {value &&
                    value.itemList.map((i) => {
                        return <BillItem order={order} price={price} key={i.id} setState={() => setValue((pre) => ({ ...pre }))} item={i}></BillItem>;
                    })}
            </div>
           
        </div>
    );
};

export default Dashboard;
