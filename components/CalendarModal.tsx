import React, { useState } from "react";
import { Calendar } from "react-native-calendars";

import { Colors } from "../constants/colors";

type CalendarModalProps = {
  pendingDate: Date | { start: Date; end: Date } | null;
  setPendingDate: React.Dispatch<
    React.SetStateAction<Date | { start: Date; end: Date } | null>
  >;
  setCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function CalendarModal({
  pendingDate,
  setPendingDate,
  setCalendarVisible,
}: CalendarModalProps) {
  return (
    <Calendar
      onDayPress={(day) => {
        const selected = new Date(day.dateString);
        selected.setHours(0, 0, 0, 0);
        setPendingDate(selected);
        setCalendarVisible(false);
      }}
      markedDates={
        pendingDate && "getTime" in pendingDate
          ? {
              [(pendingDate as Date).toISOString().slice(0, 10)]: {
                selected: true,
                selectedColor: Colors.primaryRed,
                selectedTextColor: Colors.white,
              },
            }
          : {}
      }
      theme={{
        backgroundColor: Colors.white,
        calendarBackground: Colors.white,
        textSectionTitleColor: Colors.text500,
        selectedDayBackgroundColor: Colors.primaryRed,
        selectedDayTextColor: Colors.white,
        todayTextColor: Colors.primaryRed,
        dayTextColor: Colors.text800,
        textDisabledColor: Colors.text500,
        monthTextColor: Colors.primaryRed,
        arrowColor: Colors.primaryRed,
        textDayFontWeight: "bold",
        textMonthFontWeight: "bold",
        textDayHeaderFontWeight: "bold",
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 14,
      }}
      enableSwipeMonths={true}
    />
  );
}

export default CalendarModal;
