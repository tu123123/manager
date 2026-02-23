/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import { donhangItem, donHangStore, hangxuatType, itemList } from '@/store/donhangStore';
import { Checkbox } from 'primereact/checkbox';
import { updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { InputNumber } from 'primereact/inputnumber';
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
const BillItem = ({ price, item, setState }: { price: boolean; item: donhangItem; setState: () => void }) => {
    return (
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div>
                    <span className="block text-500 font-medium mb-3">{item.name}</span>
                    {/* <div className="text-900 font-medium text-xl">152</div> */}
                </div>
                <table
                    style={{
                        width: '100%'
                    }}
                >
                    {item.itemList.map((i) => {
                        return (
                            <tr
                                style={{
                                    opacity: i.checked && !price ? 0.3 : 1,
                                    textDecoration: i.checked && !price ? 'line-through' : ''
                                }}
                                key={i.id}
                            >
                                <td>{i.ten}</td>
                                <td>:</td>
                                {price ? (
                                    <td>
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
            >
                <Button
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
                ></Button>
            </div>
            <div
                style={{
                    overflow: 'auto'
                }}
                className="grid"
            >
                {value &&
                    value.itemList.map((i) => {
                        return <BillItem price={price} key={i.id} setState={() => setValue((pre) => ({ ...pre }))} item={i}></BillItem>;
                    })}
            </div>
        </div>
    );
};

export default Dashboard;
