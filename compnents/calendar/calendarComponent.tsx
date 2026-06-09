import  './calendar.scss'
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Sidebar } from "primereact/sidebar";
import { ModalKhachhang } from '@/app/(main)/pages/xuathang/page';
import { donHangStore } from '@/store/donhangStore';
import { useRouter } from 'next/navigation';
const vnLunar = require("@min98/vnlunar");



const CalendarWithLunar: React.FC = () => {
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month() + 1);
  const [add,setAdd]=useState('')
  const [visibleMonth, setVisibleMonth] = useState(false);
  const [visibleYear, setVisibleYear] = useState(false);
  const { hangxuat, getHangxuat } = donHangStore();
  const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const firstDayOfMonth = moment(`${year}-${month}-01`, "YYYY-MM-DD").day();
    const router = useRouter();
  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const solarDate = moment(`${year}-${month}-${i}`, "YYYY-MM-DD");
      const lunarInfo = vnLunar.getFullInfo(
        solarDate.date(),
        solarDate.month() + 1,
        solarDate.year()
      );
      const lunarDate = lunarInfo.lunar;

      const isToday = solarDate.isSame(moment(), "day");
      const isSpecialLunar = lunarDate.day === 1 || lunarDate.day === 15;

      days.push(
        <div
         onClick={()=>{
          let find= hangxuat?.find(i=>i.ten==`${lunarDate.day}/${lunarDate.month}/${lunarDate.year}`)
          if(find)
          return router.push('/pages/chitietdonhang?id=' + find.id)
          setAdd(`${lunarDate.day}/${lunarDate.month}/${lunarDate.year}`)
         }}
          key={i}
          className={`day-cell ${isToday ? "today" : ""} ${
            isSpecialLunar ? "highlight" : ""
          }`}
        >
          <div className="solar">{solarDate.format("DD/MM")}</div>
          <div className="lunar">{`${lunarDate.day}/${lunarDate.month}`}</div>
        </div>
      );
    }

    return days;
  };
 useEffect(()=>{
 getHangxuat()
 },[])
  return (
    <div className='calendarss'>
      {add?<ModalKhachhang iscalendar date={add} onClose={()=>{
      setAdd('')}}></ModalKhachhang>:<></>}
      <h2>Lịch {month}/{year}</h2>
      <div className="filters">
        <button onClick={() => setVisibleMonth(true)}>Chọn tháng</button>
        <button onClick={() => setVisibleYear(true)}>Chọn năm</button>
      </div>

      {/* Bottom Sheet chọn tháng */}
      <Sidebar
        visible={visibleMonth}
        position="bottom"
        style={{
          minHeight:'40dvh'
        }}
        onHide={() => setVisibleMonth(false)}
      >
        <div className="month-list">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i + 1}
              className={`month-item ${month === i + 1 ? "active" : ""}`}
              onClick={() => {
                setMonth(i + 1);
                setVisibleMonth(false);
              }}
            >
              Tháng {i + 1}
            </div>
          ))}
        </div>
      </Sidebar>

      {/* Bottom Sheet chọn năm */}
      <Sidebar
        visible={visibleYear}
        position="bottom"
              style={{
          minHeight:'40dvh'
        }}
        onHide={() => setVisibleYear(false)}
      >
        <h3>Chọn năm</h3>
        <div className="year-list">
          {Array.from({ length: 21 }, (_, i) => {
            const y = 2020 + i;
            return (
              <div
                key={y}
                className={` month-item year-item ${year === y ? "active" : ""}`}
                onClick={() => {
                  setYear(y);
                  setVisibleYear(false);
                }}
              >
                Năm {y}
              </div>
            );
          })}
        </div>
      </Sidebar>

      <div className="calendar-grid">
        {weekDays.map((d, i) => (
          <div key={i} className="day-cell header">{d}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarWithLunar;
