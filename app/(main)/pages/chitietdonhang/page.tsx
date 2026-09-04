'use client';
import { Card } from 'primereact/card';
import './index.scss';
import { Button } from 'primereact/button';
import { donhangItem, donHangStore, hangxuatType, itemList } from '@/store/donhangStore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatNumber } from '@/compnents/e2e';
import deletesvg from '@/compnents/assets/delete.svg';
import editsvg from '@/compnents/assets/edit.svg';
import downSvg from '@/compnents/assets/download.svg';
import Image from 'next/image';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import detailsvg from '@/compnents/assets/detail.svg'
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { CascadeSelect } from 'primereact/cascadeselect';
import { lienheStore } from '@/store/lienheStore';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { addData, delData, updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { ToggleButton } from 'primereact/togglebutton';
import { confirmDialog } from 'primereact/confirmdialog';
import { toPng } from 'html-to-image';
import moment from 'moment';
import { uuid } from 'uuidv4';
import { toast } from '@/layout/AppMenu';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import InputSearch from '@/compnents/InputSearch/inputsearch';
import { SelectComponent } from '@/compnents/InputSearch/selectComponent';
import { InputTextarea } from 'primereact/inputtextarea';
const db = 'hangxuat';
const dataContent = React.createContext();
const ItemDonhang = ({ item, setValue }: { item: itemList; setValue: unknown }) => {
    const [note, setNote] = useState(false);
        const { hangxuat } = donHangStore();
    return (
        <div className="itemDonhang">
            <InputSearch
                onChangeSelect={(e) => {
                  try{
                      let itemfind=null
                     
                    const find=[...hangxuat].reverse().find(x=>x.itemList.find(y=> {
                        itemfind=y.itemList.find(z=>z.ten==e.ten)
                        return itemfind
                    }))
                    if(find)
                    {
                    item.ten = itemfind.ten;
                    item.cost = itemfind.cost||0;
                    item.gia = itemfind.gia;
                    setValue((pre) => ({ ...pre }));
                    }
                    else
                 {
                       item.ten = e.ten;
                    item.cost = e.cost||0;
                    item.gia = e.gia;
                    setValue((pre) => ({ ...pre }));
                 }
                  }
                  catch{
      item.ten = e.ten;
                    item.cost = e.cost||0;
                    item.gia = e.gia;
                    setValue((pre) => ({ ...pre }));
                  }
                }}
                value={item.ten}
                onChange={(e) => {
                    item.ten = e;
                    setValue((pre) => ({ ...pre }));
                }}
            ></InputSearch>
            {/* <InputText
                value={item.ten}
                onChange={(x) => {
                    item.ten = x.target.value;
                    setValue((pre) => ({ ...pre }));
                }}
            ></InputText> */}
            <div className="itemDonhang-content">
                <InputNumber
                    value={item.soluong}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(x) => {
                        item.soluong = x.value as number;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputNumber>{' '}
                x{' '}
                <InputNumber
                    value={item.gia / 1000}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(x) => {
                        item.gia = (x.value as number) * 1000;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputNumber>{' '}
                = {formatNumber(item.gia * item.soluong)}
            </div>
     
            <InputNumber
                value={(item.cost || 0) / 1000}
                mode="decimal"
                placeholder="Giá vốn"
                minFractionDigits={0}
                maxFractionDigits={5}
                onChange={(x) => {
                    item.cost = (x.value as number) * 1000;
                    setValue((pre) => ({ ...pre }));
                }}
            ></InputNumber>
            {note && (
                <InputTextarea
                    placeholder="Ghi chú"
                    value={item.note}
                    onChange={(x) => {
                        item.note = x.target.value;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputTextarea>
            )}
            <div className="itemDonhang-footer">
                <Button
                    onClick={() => {
                        setNote(!note);
                    }}
                    outlined
                    icon={<Image height={20} alt="" src={editsvg}></Image>}
                ></Button>
                <Button
                    onClick={() => {
                        confirmDialog({
                            message: 'Bạn có chắc muốn xóa mặt hàng này',
                            header: 'Xác nhận!',
                            accept: () => {
                                item.delete = true;

                                setValue((pre) => ({ ...pre, itemList: pre.itemList.filter((x) => !x.delete) }));
                            }
                        });
                    }}
                    security="danger"
                    outlined
                    icon={<Image height={20} alt="" src={deletesvg}></Image>}
                ></Button>
            </div>
        </div>
    );
};
const EditTable = ({ onClose, dataEdit }: { onClose: () => void; dataEdit?: donhangItem }) => {
    const [value, setValue] = useState(
        dataEdit?.id
            ? { ...dataEdit }
            : {
                  date: moment().format('DD/MM/YYYY HH:mm'),
                  endbill: false,
                  id: '',
                  sothung: 0,
                  cost: 0,
                  itemList: [],
                  name: '',
                  time: ''
              }
    );
    const colums = [
        {
            label: 'Tên',
            dataIndex: 'ten',
            render: (e: itemList) => (
                <InputText
                    style={{ width: '100px' }}
                    value={e.ten}
                    onChange={(x) => {
                        e.ten = x.target.value as string;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputText>
            )
        },
        {
            label: 'Số lượng',
            dataIndex: 'soluong',
            render: (e: itemList) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={e.soluong}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(x) => {
                        e.soluong = x.value as number;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputNumber>
            )
        },
        {
            label: 'Giá',
            dataIndex: 'gia',
            render: (e: itemList) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={e.gia / 1000}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(x) => {
                        e.gia = (x.value as number) * 1000;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputNumber>
            )
        },
        {
            label: 'Thành tiền',
            dataIndex: '',
            render: (e: itemList) => formatNumber(e.soluong * e.gia)
        }
    ];
    const itemEmpty = {
        checked: false,
        cost: 0,
        gia: 0,
        id: uuid(),
        new: true,
        note: '',
        soluong: 0,
        ten: ''
    };
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const { data } = useContext(dataContent);
    const update = () => {
        try {
            loadingRef.current?.on();
            const find = data.itemList.findIndex((x) => x.id == value.id);
            data.itemList[find] = { ...value };
            updateData(
                db,
                data.id,
                data,
                () => {
                    onClose();
                    loadingRef.current?.off();
                },
                () => {
                    loadingRef.current?.off();
                }
            );
        } catch (e) {
            console.log(e);
            loadingRef.current?.off();
        }
    };
    const add = () => {
        if (!value.id)
            return confirmDialog({
                message: 'Chưa chọn người nhận!',
                header: 'Cảnh báo!'
            });
        try {
            loadingRef.current?.on();
            updateData(db, data.id, { itemList: [...data.itemList, value] }, () => {
                onClose();
                loadingRef.current?.off();
            });
        } catch (e) {
            console.log(e);
            loadingRef.current?.off();
        }
    };

    const footer = (
        <div
            style={{
                display: 'flex',
                gap: '5px',
                justifyContent: 'end'
            }}
        >
            <ToggleButton
                style={{
                    height: '35px'
                }}
                onLabel="Kết thúc"
                offLabel="Kết thúc"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                checked={value.endbill}
                onChange={(e) => setValue((pre) => ({ ...pre, endbill: e.value }))}
                className="w-9rem"
            />
            <Button
                size="small"
                onClick={() => {
                    setValue((pre) => ({ ...pre, itemList: [...pre.itemList, itemEmpty] }));
                }}
                label="Thêm dòng"
            ></Button>
            <Button size="small" onClick={onClose} label="Đóng"></Button> <Button size="small" onClick={dataEdit?.id ? update : add} label="Lưu"></Button>
        </div>
    );
    const { getLienhe, lienhe } = lienheStore();
    useEffect(() => {
        getLienhe();
    }, []);

    return (
        <Dialog footer={footer} onHide={onClose} visible header="Cập nhật đơn hàng">
            <div className="modaldonhang">
                <div
                    style={{
                        display: 'grid',
                        gap: '5px',
                        alignItems: 'center',
                        gridTemplateColumns: '60% 40%'
                    }}
                >
                    {dataEdit?.id ? (
                        <div>{value.name}</div>
                    ) : (
                        <SelectComponent
                            data={lienhe}
                            value={value.name}
                            onChange={(e) => {
                                const find = lienhe.find((x) => x.id === e.value);
                                value.id = e?.id as string;
                                value.name = e?.name as string;
                                setValue((pre) => ({ ...pre }));
                            }}
                        ></SelectComponent>
                    )}
                    <InputNumber
                        value={value.sothung}
                        onChange={(e) => {
                            setValue((pre) => ({ ...pre, sothung: e.value }));
                        }}
                        placeholder="Số thùng.."
                    ></InputNumber>
                </div>
                {value.itemList.map((i, index) => {
                    return <ItemDonhang setValue={setValue} key={i.id + index} item={i}></ItemDonhang>;
                })}
            </div>
        </Dialog>
    );
};
const ChitietDon=({listBill, onClose}:{listBill:donhangItem[],onClose:()=>void})=>{
      const imgRef = useRef();

    return <Dialog footer={
                <Button
                raised
                outlined
                size="small"
                onClick={async () => {
                    const el = imgRef.current;
                const footer = imgRef.current.querySelector('.p-card-footer');
                    const loinhuan=imgRef.current.querySelectorAll('.loinhuan')
          
                    if(loinhuan)
                        for(let i of loinhuan)
                          i.style.display = 'none';
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
                if(loinhuan)
                        for(let i of loinhuan)
                          i.style.display = 'revert';
                }}
                icon={<Image src={downSvg} alt="" height={20}></Image>}
            ></Button>
    } onHide={onClose} visible>
        <Card className='chitietdon' d header={
            <div className='headerdonhang'>
                <h4>Hoa tươi Hoàng Vũ</h4>
                <p>ĐC: 306 Nguyên Tử Lực, phường Lâm Viên, Đà Lạt, Lâm Đồng</p>
                 <p>SĐT: 0977625859 - 0357577926</p>
                       <div>Hóa đơn bán hàng</div>

            </div>
        } ref={imgRef} title={<div><span style={{
            fontSize:'15px',
            fontWeight:'500'
        }}>Người nhận:</span> {listBill[0].name}</div>} subTitle={`Ngày âm: ${listBill[0].ten} - ${listBill[listBill.length-1].ten}`} >

           
            <div className="ItemDon-content">
                <table>
                    {listBill.map((i) => {
                   
                        return (
                           <React.Fragment key={i.id}>
                             
                            {i.itemList?.map((j,index)=>{
                                return  <tr   key={j.id}>
                                    <td className='daysgroup'> <div >{index==0?i.ten:''}</div></td>
                                <td>{j.ten}</td>
                                <td>{j.soluong}</td>
                                <td>x</td>
                                <td>{formatNumber(j.gia)}</td>
                                <td>=</td>
                                <td>{formatNumber(j.soluong * j.gia)}</td>
                            </tr>
                            })}
                           </React.Fragment>
                        );
                    })}
                </table>

                <div className="ItemDon-total">
                    <strong>Tổng:</strong>
                    <strong>{formatNumber(listBill.reduce((a,b)=>a+b.itemList.reduce((c,d)=>c+d.gia*d.soluong,0),0))}</strong>
    <p className='loinhuan'>Lợi nhuận:</p>
                    <p className='loinhuan'>{formatNumber(listBill.reduce((a,b)=>a+b.itemList.reduce((c,d)=>c+(d.gia-d.cost)*d.soluong,0),0))}</p>
                        
                           
                
                </div>
            </div>
        </Card>
    </Dialog>
}
const ItemDon = ({ item }: { item: donhangItem }) => {
    const imgRef = useRef();
    const fakeref = useRef<HTMLDivElement>();
    const [showdetail,setShowdetail]=useState<donhangItem[]>()
    const [open, setOpen] = useState<donhangItem | null>();
    const { data } = useContext(dataContent);
    const [show, setShow] = useState(true);
    const { hangxuat } = donHangStore();
    const footerContent = (
        <div
            style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'end'
            }}
        >
            <ToggleButton height={30} checked={show} onLabel="Total ON" offLabel="Total OFF" onChange={(e) => setShow(e.value)} />
         <Button onClick={() => setShowdetail(listBill.arr)} raised outlined size="small" security="" icon={<Image src={detailsvg} alt="" height={20}></Image>}></Button>
            <Button onClick={() => setOpen(item)} raised outlined size="small" security="" icon={<Image src={editsvg} alt="" height={20}></Image>}></Button>
            <Button
                raised
                outlined
                size="small"
                onClick={async () => {
                    const el = imgRef.current;
                  
                    const footer = imgRef.current.querySelector('.p-card-footer');
                    const loinhuan=imgRef.current.querySelectorAll('.loinhuan')
                    footer.style.display = 'none';
                    if(loinhuan)
                        for(let i of loinhuan)
                          i.style.display = 'none';
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
                    footer.style.display = 'revert';
                      if(loinhuan)
                        for(let i of loinhuan)
                          i.style.display = 'revert';
                }}
                icon={<Image src={downSvg} alt="" height={20}></Image>}
            ></Button>
            <Button
                onClick={() => {
                    confirmDialog({
                        message: 'Bạn có chắc muốn xóa đơn hàng này này',
                        header: 'Xác nhận!',
                        accept: () => {
                            loadingRef.current?.on();
                            item.delete = true;

                            updateData(db, data.id, { itemList: data.itemList.filter((x) => !x.delete) }, () => loadingRef.current?.off());
                        }
                    });
                }}
                raised
                outlined
                size="small"
                severity="danger"
                icon={<Image src={deletesvg} alt="" height={20}></Image>}
            ></Button>
        </div>
    );
    const [listBill, setListBill] = useState({ arr: [] });

    const TinhTongNo = (arrTong2, arr2 = [], total = 0, payment = 0) => {
        try {
            listBill.arr = [];
            if (!arrTong2) return 0;
            let arrTong = arrTong2.filter((i) => i.itemList.find((a) => a.id === item.id));
            let date = { from: data.ten, to: data.ten };
            let itemfindIndex = arrTong.findIndex((i) => i.id == data.id);
            let indexarr = {
                from: itemfindIndex,
                to: itemfindIndex
            };
            let loopTotal = (index: number, tang = false) => {
                let getTotal = (idx) =>
                    arrTong[idx]?.itemList
                        ?.find((i) => i.id === item.id)
                        ?.itemList.filter((i) => !i.thanhtoan)
                        .reduce((a, b) => a + b.soluong * b.gia, 0) || 0;
                let getPayment = (idx) =>
                    arrTong[idx]?.itemList
                        ?.find((i) => i.id === item.id)
                        ?.itemList.filter((i) => i.thanhtoan)
                        .reduce((a, b) => a + b.soluong * b.gia, 0) || 0;
                if (index >= 0 && arrTong[index]) {
                    if (!tang) {
                        for (let c = index; c >= 0; c--) {
                            if (arrTong[c] && arrTong[c]?.itemList?.find((i) => i.id === item.id)?.endbill === true) break;

                            total += getTotal(c);
                            payment += getPayment(c);
                            date.from = arrTong[c].ten;
                            if (c < itemfindIndex) indexarr.from = c;
                        }
                    } else {
                        for (let c = index; c < arrTong.length; c++) {
                            total += getTotal(c);
                            payment += getPayment(c);
                            date.to = arrTong[c].ten;

                            if (c > itemfindIndex) indexarr.to = c;
                            if (arrTong[c] && arrTong[c]?.itemList?.find((i) => i.id === item.id)?.endbill === true) break;
                        }
                    }
                }
            };

            if (itemfindIndex >= 0) {
                loopTotal(itemfindIndex - 1);

                if (item.endbill !== true) loopTotal(itemfindIndex + 1, true);
            }

            for (let i = indexarr.from; i <= indexarr.to; i++) {
                let findIndex = arrTong[i]?.itemList?.findIndex((i) => i.id === item.id);
                if (findIndex >= 0)
                    listBill.arr.push({
                        ...arrTong[i]?.itemList?.find((i) => i.id === item.id),
                        index: findIndex,
                        ten: arrTong[i].ten,
                        idUpdate: arrTong[i].id
                    });
            }
            listBill.date = date;
            listBill.total = total;

            listBill.payment = payment;
            // return {date,total}
        } catch (e) {
            console.log(e);
        }
    };
    const totalOld = (a = 0) => {
        const index = hangxuat.findIndex((x) => x.id === data.id);
        let index1 = 0;
        let index2 = 0;

        // duyệt về phía sau
        for (let i = index + 1; i < hangxuat.length; i++) {
            const find = hangxuat[i]?.itemList.find((x) => x.id === item.id);
            if (!find || !find[i]) continue;
            index2 = i;
            if (find?.endbill) break;
            if (find[i]) a += find[i].itemList.reduce((sum, b) => sum + b.soluong * b.gia, 0);
        }

        // duyệt về phía trước
        if (!hangxuat[index].itemList.find((x) => x.id === item.id)?.endbill) {
            for (let i = index - 1; i >= 0; i--) {
                const find = hangxuat[i]?.itemList.find((x) => x.id === item.id);
                if (!find) continue;
                if (find[i]) a += find[i].itemList.reduce((sum, b) => sum + b.soluong * b.gia, 0);
                index1 = i;

                if (find?.endbill) break;
            }
        }

        return {
            total: a,
            index1,
            index2
        };
    };

    useEffect(() => {
        TinhTongNo(hangxuat);
        setListBill({ ...listBill });
    }, [hangxuat]);
    return (
        <Card header={
            <div className='headerdonhang'>
                <h4>Hoa tươi Hoàng Vũ</h4>
                <p>ĐC: 306 Nguyên Tử Lực, phường Lâm Viên, Đà Lạt, Lâm Đồng</p>
                 <p>SĐT: 0977625859 - 0357577926</p>
     <div>Hóa đơn bán hàng</div>
            </div>
        } ref={imgRef} title={<div><span style={{
            fontSize:'15px',
            fontWeight:'500'
        }}>Người nhận:</span> {item.name}</div>} subTitle={`Ngày âm: ${data.ten} - Ngày dương: ${moment(data.time).format('DD/MM/YYYY')}`} footer={footerContent} className="md:w-25rem">
  {showdetail&&<ChitietDon onClose={()=>setShowdetail(null)} listBill={showdetail}></ChitietDon>}
            {open && <EditTable onClose={() => setOpen(null)} dataEdit={open}></EditTable>}
            <div className="ItemDon-content">
                <table>
                    {item.itemList.map((i) => {
                        return (
                            <tr key={i.id}>
                                <td>{i.ten}</td>
                                <td>{i.soluong}</td>
                                <td>x</td>
                                <td>{formatNumber(i.gia)}</td>
                                <td>=</td>
                                <td>{formatNumber(i.soluong * i.gia)}</td>
                            </tr>
                        );
                    })}
                </table>

                <div className="ItemDon-total">
                    <strong>Tổng</strong>
                    <strong className="itemtotal">{formatNumber(item.itemList.reduce((a, b) => a + b.soluong * b.gia, 0))}</strong>
                    <div>Tổng mặt hàng:</div>
                    <div className="itemtotal">{item.itemList.length}</div>
                    <div>Số thùng:</div>
                    <div className="itemtotal">{item.sothung}</div>
                  
                    {show && listBill?.total ? (
                        <>
                            <div>Nợ cũ:</div>
                            <div className="itemtotal">{formatNumber(listBill?.total)}</div>
                            <strong>
                                Tổng toa({listBill?.date.from}-{listBill?.date.to}):
                            </strong>
                            <strong className="itemtotal">{formatNumber(listBill?.total + item.itemList.reduce((a, b) => a + b.soluong * b.gia, 0))}</strong>
                            <div className='loinhuan'>Lợi nhuận:</div>
                            <div className="itemtotal loinhuan">{formatNumber(item.itemList.reduce((a, b) => a + (b.soluong * (b.gia-b.cost)), 0))}</div>
                        </>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </Card>
    );
};
export default function ChiTietDonHang() {
    const [data, setData] = useState<hangxuatType>();

    const { getHangxuatById } = donHangStore();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const id = params.get('id');
        getHangxuatById(id as string, setData);
    }, []);
    const [open, setOpen] = useState(false);
    return (
        <dataContent.Provider
            value={{
                data
            }}
        >
            {open && <EditTable onClose={() => setOpen(false)}></EditTable>}
            <div className="ChiTietDonHang">
                <div className="ChiTietDonHang-header">
                    <div>Chi tiết đơn hàng ngày {data?.ten}</div>
                    <Button onClick={() => setOpen(true)} label="Thêm đơn hàng"></Button>
                </div>
                <div className="ChiTietDonHang-body">
                    {data?.itemList.map((i) => {
                        return <ItemDon item={i} key={i.id}></ItemDon>;
                    })}
                </div>
            </div>
        </dataContent.Provider>
    );
}
