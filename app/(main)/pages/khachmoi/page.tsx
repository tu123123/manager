'use client';

import { ListDrop } from '@/compnents/ListDrop/listDrop';
import { ListDropGroup } from '@/compnents/ListDropGroup/listDropgroup';
import './index.scss';
import { lienheStore } from '@/store/lienheStore';
import { danhsachphieuType, hangnhapStore } from '@/store/hangnhapStore';
import { useEffect, useRef, useState } from 'react';

import downSvg from '@/compnents/assets/download.svg';
import { formatNumber } from '@/compnents/e2e';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ActionSheet, Input } from 'antd-mobile';
import { dsthanhtoanType, thanhtoanStore } from '@/store/thanhtoanStore';
import { addData, delData, updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { confirmDialog } from 'primereact/confirmdialog';
import Image from 'next/image';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Upload } from 'antd';
import { toPng } from 'html-to-image';
import ImgCrop from 'antd-img-crop';
import { RadioButton } from 'primereact/radiobutton';
import { dbkhachmoi, dskhachmoistype, khachmoiStore } from '@/store/khachmoistore';
import { Checkbox } from 'primereact/checkbox';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
const dbThanhtoan = dbkhachmoi;
const DetailConngno = ({ onClose, dataEdit }: { dataEdit: dskhachmoistype; onClose: () => void }) => {
    const [value, setValue] = useState<dskhachmoistype>(
        dataEdit.id
            ? JSON.parse(JSON.stringify(dataEdit))
            : {
                 ten: '',
    status:false,
    sotien: 0,
              }
    );
    const { phieunhap } = hangnhapStore();
    const [open, setOpen] = useState(false);
    const { lienhe } = lienheStore();
    const footer = (
        <>
            <Button
                security="danger"
                outlined
                onClick={() => {
                    confirmDialog({
                        message: 'Bạn có chắc muốn xóa không',
                        header: 'Xác nhận!',
                        accept: () => {
                            loadingRef.current?.on();
                            delData(dbThanhtoan, dataEdit.id, () => {
                                loadingRef.current?.off();
                                onClose();
                            });
                        }
                    });
                }}
                label="Xóa"
            ></Button>
            <Button
                onClick={() => {
                    if(!value.ten)
                    return  confirmDialog({
                                                message: 'Vui lòng nhập tên',
                                                header: 'Lỗi!',
                                              
                                            });
                    loadingRef.current?.on();

                    if (dataEdit?.id)
                        
                        return updateData(
                            dbThanhtoan,
                            dataEdit.id,
                            value,
                            () => {
                                onClose();
                                loadingRef.current?.off();
                            },
                            () => loadingRef.current?.off()
                        );

                    addData(
                        dbThanhtoan,
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
        <Dialog footer={footer} header={dataEdit?.id ? 'Cập nhật' : 'Thêm mới'} visible={true} onHide={onClose}>
            <div className="DetailConngno">
                <label>
                    <div>Nhập tên</div>
                    <Input
                        onChange={(e) =>
                            setValue((pre) => ({
                                ...pre,
                                ten: e
                            }))
                        }
                        type="text"
                        value={value.ten}
                    ></Input>
                </label>
                <label>
                    <div>Nhập số tiền</div>
                    <Input
                        onChange={(e) =>
                            setValue((pre) => ({
                                ...pre,
                                sotien: e * 1000
                            }))
                        }
                        value={value.sotien / 1000}
                        type="number"
                    ></Input>
                </label> 
                  <label style={{
                    display:'flex',
                    alignItems:'center',
                    gap:'5px'
                  }}>
                  
                    <Checkbox checked={value.status}   onChange={(e) =>
                          
                              setValue((pre) => ({
                                ...pre,
                                status: e.checked
                            }))
                          
                        }></Checkbox>  <div>Đã mời</div>
                </label>
                   
       
            </div>
        </Dialog>
    );
};
export default function Khachmoi() {
    const { dsKhachmoi, getDsKhachmoi } = khachmoiStore();
    const { getLienhe, lienhe } = lienheStore();
    const [search,setSearch]=useState('')
    const [status,setStatus]=useState(null)
    useEffect(() => {
        getDsKhachmoi();
    }, []);
    const imgRef = useRef();
    const [open, setOpen] = useState<dsthanhtoanType[] | boolean>(false);
    return (
        <div className="khachhang-container">
            {open && <DetailConngno onClose={() => setOpen(false)} dataEdit={open as dsthanhtoanType[]}></DetailConngno>}
            <div
                style={{
                 
                   
                }}
            >
                <div  style={{
                    padding: '10px',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h4>Danh sách Khách mời</h4>
                  
       
                <div
                    style={{
                        display: 'flex',
                        gap: '5px'
                    }}
                >
                    <Button onClick={() => setOpen(true)} label="Thêm"></Button>
                    <Button
                        raised
                        outlined
                        size="small"
                        onClick={async () => {
                            const el = imgRef.current;
                            el.style.height = 'max-content';
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
                            el.style.height = '100%';
                        }}
                        icon={<Image src={downSvg} alt="" height={20}></Image>}
                    ></Button>
                </div>
                </div>
              <div style={{
                display:'grid',
                gridTemplateColumns:' auto 1fr',
                gap:'10px'
              }}>
                
                   <label style={{
                    width:'max-content',
                    display:'flex',
                    gap:'10px',
                    alignItems:'center'

                }}>  <TriStateCheckbox invalid value={status} onChange={(e) => setStatus(e.value)} />{status===null?'Tất cả':status?'Đã mời':'Chưa Mời'}</label>
                <Input style={{
                borderBottom:'1px solid gray'
                }} placeholder='Tìm kiếm...' value={search} onChange={(e)=>setSearch(e)}></Input>  
              </div>
            </div>
            <div ref={imgRef} className="congno-content">
                {dsKhachmoi.filter(x=>x.status==status||status===null).filter(e=>e.ten?.toLowerCase().includes(search?.toLowerCase())).map((i) => {
                    return (
                        <div
                            onClick={() => setOpen(i)}
                            className="congnoItem"
                            key={i.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}
                        >
                            <div style={{
                                display:'flex',
                                alignItems:'center',
                                gap:'10px'
                            }}><Tag severity={i.status?'success':'info'}>{i.status?"Đã mời":'Chưa mời'}</Tag>{i.ten} </div>
                            <div className="itemcongno">
                                <div>{formatNumber(i.sotien)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='total'>
                Tổng: {formatNumber(dsKhachmoi.reduce((a,b)=>a+b.sotien,0))}
            </div>
        </div>
    );
}
