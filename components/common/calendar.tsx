import { ChevronLeft, ChevronRight, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  selectedDate?: string; // Format: YYYY-MM-DD
  selectedTime?: string; // Format: HH:MM (24-hour)
  availableTimes?: string[]; // Array of available times for the selected date
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTime,
  availableTimes = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentView, setCurrentView] = useState<'date' | 'time'>('date');
  
  // Generate days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = getDaysInMonth(year, month);
    const today = new Date();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', date: '', isCurrentMonth: false, isPast: false });
    }
    
    // Add cells for each day in the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = formatDate(date);
      
      days.push({
        day: i.toString(),
        date: dateString,
        isCurrentMonth: true,
        isPast: date < new Date(today.setHours(0, 0, 0, 0)),
      });
    }
    
    return days;
  };
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };
  
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };
  
  const handleDateSelect = (date: string) => {
    onDateSelect(date);
    if (availableTimes.length > 0) {
      setCurrentView('time');
    }
  };

  const formatTimeDisplay = (time: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  const renderDateView = () => {
    const calendarDays = generateCalendarDays();
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <ChevronLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.monthYearText}>{formatMonthYear(currentMonth)}</Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <ChevronRight size={20} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekdayLabels}>
          {dayLabels.map((day, index) => (
            <Text key={index} style={styles.weekdayLabel}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day.isCurrentMonth ? styles.currentMonth : styles.otherMonth,
                day.isPast ? styles.pastDay : null,
                day.date === selectedDate ? styles.selectedDay : null,
              ]}
              disabled={!day.isCurrentMonth || day.isPast}
              onPress={() => day.date && handleDateSelect(day.date)}
            >
              <Text style={[
                styles.dayText,
                day.isPast ? styles.pastDayText : null,
                day.date === selectedDate ? styles.selectedDayText : null,
              ]}>
                {day.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };
  
  const renderTimeView = () => {
    return (
      <>
        <View style={styles.timeViewHeader}>
          <TouchableOpacity 
            style={styles.backToDateButton}
            onPress={() => setCurrentView('date')}
          >
            <ChevronLeft size={18} color="#3B82F6" />
            <Text style={styles.backToDateText}>Back to calendar</Text>
          </TouchableOpacity>
          
          <Text style={styles.selectedDateText}>
            {selectedDate && new Date(selectedDate).toLocaleDateString('default', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        
        <View style={styles.timesContainer}>
          {availableTimes.length > 0 ? (
            availableTimes.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  time === selectedTime ? styles.selectedTimeSlot : null
                ]}
                onPress={() => onTimeSelect(time)}
              >
                <Clock size={16} color={time === selectedTime ? "#FFFFFF" : "#4B5563"} />
                <Text style={[
                  styles.timeText,
                  time === selectedTime ? styles.selectedTimeText : null
                ]}>
                  {formatTimeDisplay(time)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noTimesContainer}>
              <Text style={styles.noTimesText}>No available times for this date</Text>
            </View>
          )}
        </View>
      </>
    );
  };
  
  return (
    <View style={styles.container}>
      {currentView === 'date' ? renderDateView() : renderTimeView()}
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  navButton: {
    padding: 8,
    borderRadius: 4,
  },
  weekdayLabels: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  currentMonth: {
    backgroundColor: '#FFFFFF',
  },
  otherMonth: {
    backgroundColor: '#F9FAFB',
  },
  pastDay: {
    opacity: 0.5,
  },
  selectedDay: {
    backgroundColor: '#3B82F6',
    borderRadius: 100,
  },
  dayText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '400',
  },
  pastDayText: {
    color: '#9CA3AF',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timeViewHeader: {
    marginBottom: 16,
  },
  backToDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backToDateText: {
    color: '#3B82F6',
    fontWeight: '500',
    fontSize: 14,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTimeSlot: {
    backgroundColor: '#3B82F6',
  },
  timeText: {
    marginLeft: 6,
    color: '#4B5563',
    fontWeight: '500',
    fontSize: 14,
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  noTimesContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  noTimesText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default Calendar;