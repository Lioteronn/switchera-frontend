import { Clock, Download, Minus, Plus, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface TimeSlot {
  id: string;
  time: string;
  duration: number;
}

interface MultipleDayCalProps {
  onDatesChange?: (dates: string[], timeSlots: TimeSlot[]) => void;
  onExportData?: (exportData: any) => void;
  serviceDuration?: number; // Duration in minutes
}

type CalendarMode = 'multiple' | 'consecutive' | 'range';

const MultipleDayCal: React.FC<MultipleDayCalProps> = ({
  onDatesChange,
  onExportData,
  serviceDuration = 60,
}) => {
  const [mode, setMode] = useState<CalendarMode>('multiple');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  
  // Time management
  const [timeInput, setTimeInput] = useState('');
  const [duration, setDuration] = useState(serviceDuration);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [autoGenerate, setAutoGenerate] = useState(false);

  // Update marked dates when selected dates change
  useEffect(() => {
    const marked: any = {};
    
    if (mode === 'range' && rangeStart && rangeEnd) {
      const start = new Date(rangeStart);
      const end = new Date(rangeEnd);
      const current = new Date(start);
      
      while (current <= end) {
        const dateString = current.toISOString().split('T')[0];
        marked[dateString] = {
          color: current.getTime() === start.getTime() || current.getTime() === end.getTime() 
            ? '#3b82f6' : '#93c5fd',
          textColor: 'white',
          startingDay: current.getTime() === start.getTime(),
          endingDay: current.getTime() === end.getTime(),
        };
        current.setDate(current.getDate() + 1);
      }
    } else {
      selectedDates.forEach((date, index) => {
        marked[date] = {
          selected: true,
          selectedColor: mode === 'consecutive' ? '#3b82f6' : '#10b981',
          selectedTextColor: 'white',
        };
      });
    }
    
    setMarkedDates(marked);
  }, [selectedDates, mode, rangeStart, rangeEnd]);

  // Notify parent component of changes
  useEffect(() => {
    if (onDatesChange) {
      const dates = mode === 'range' && rangeStart && rangeEnd 
        ? getDatesInRange(rangeStart, rangeEnd)
        : selectedDates;
      onDatesChange(dates, timeSlots);
    }
  }, [selectedDates, timeSlots, rangeStart, rangeEnd, mode]);

  const getDatesInRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const formatDateForExport = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generateExportData = () => {
    const dates = mode === 'range' && rangeStart && rangeEnd 
      ? getDatesInRange(rangeStart, rangeEnd)
      : selectedDates;

    if (dates.length === 0 || timeSlots.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos una fecha y un horario');
      return null;
    }

    const exportData: any = {};

    dates.forEach(date => {
      const formattedDate = formatDateForExport(date);
      const dayKey = `Day ${formattedDate}`;
      
      exportData[dayKey] = {
        "Time available": timeSlots.map(slot => `${slot.time} (${slot.duration}min)`)
      };
    });

    return exportData;
  };

  const handleExport = () => {
    const exportData = generateExportData();
    if (exportData) {
      console.log('Export Data:', JSON.stringify(exportData, null, 2));
      
      if (onExportData) {
        onExportData(exportData);
      }
      
      Alert.alert(
        'Datos Exportados',
        'Los datos han sido exportados. Revisa la consola para ver el JSON.',
        [
          {
            text: 'Ver JSON',
            onPress: () => {
              Alert.alert(
                'JSON Export',
                JSON.stringify(exportData, null, 2)
              );
            }
          },
          { text: 'OK' }
        ]
      );
    }
  };

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString;
    
    switch (mode) {
      case 'multiple':
        setSelectedDates(prev => 
          prev.includes(dateString)
            ? prev.filter(date => date !== dateString)
            : [...prev, dateString].sort()
        );
        break;
        
      case 'consecutive':
        setSelectedDates(prev => {
          if (prev.includes(dateString)) {
            return prev.filter(date => date !== dateString);
          }
          
          const newDates = [...prev, dateString].sort();
          
          // Check if dates are consecutive
          if (newDates.length > 1) {
            const dates = newDates.map(d => new Date(d));
            for (let i = 1; i < dates.length; i++) {
              const prevDate = new Date(dates[i - 1]);
              const currentDate = new Date(dates[i]);
              const diffTime = currentDate.getTime() - prevDate.getTime();
              const diffDays = diffTime / (1000 * 3600 * 24);
              
              if (diffDays !== 1) {
                Alert.alert('Error', 'Los días deben ser consecutivos');
                return prev;
              }
            }
          }
          
          return newDates;
        });
        break;
        
      case 'range':
        if (!rangeStart || (rangeStart && rangeEnd)) {
          setRangeStart(dateString);
          setRangeEnd(null);
          setSelectedDates([]);
        } else {
          if (new Date(dateString) < new Date(rangeStart)) {
            setRangeStart(dateString);
            setRangeEnd(null);
          } else {
            setRangeEnd(dateString);
            setSelectedDates(getDatesInRange(rangeStart, dateString));
          }
        }
        break;
    }
  };

  const addTimeSlot = () => {
    if (!timeInput.match(/^\d{1,2}$/)) {
      Alert.alert('Error', 'Ingrese una hora válida (0-23)');
      return;
    }
    
    const hour = parseInt(timeInput);
    if (hour < 0 || hour > 23) {
      Alert.alert('Error', 'La hora debe estar entre 0 y 23');
      return;
    }
    
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    
    // Check if time slot already exists
    if (timeSlots.some(slot => slot.time === timeString)) {
      Alert.alert('Error', 'Este horario ya existe');
      return;
    }
    
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      time: timeString,
      duration: duration,
    };
    
    setTimeSlots(prev => [...prev, newSlot].sort((a, b) => a.time.localeCompare(b.time)));
    setTimeInput('');
    
    if (autoGenerate) {
      generateTimeSlots(hour);
    }
  };

  const generateTimeSlots = (startHour: number) => {
    const slots: TimeSlot[] = [];
    const slotsPerDay = Math.floor((24 * 60) / duration);
    
    for (let i = 0; i < slotsPerDay; i++) {
      const totalMinutes = (startHour * 60) + (i * duration);
      if (totalMinutes >= 24 * 60) break;
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      slots.push({
        id: `${Date.now()}-${i}`,
        time: timeString,
        duration: duration,
      });
    }
    
    setTimeSlots(prev => {
      const combined = [...prev, ...slots];
      return combined.filter((slot, index, self) => 
        index === self.findIndex(s => s.time === slot.time)
      ).sort((a, b) => a.time.localeCompare(b.time));
    });
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const clearAll = () => {
    setSelectedDates([]);
    setRangeStart(null);
    setRangeEnd(null);
    setTimeSlots([]);
    setTimeInput('');
  };

  const renderTimeSlot = ({ item }: { item: TimeSlot }) => (
    <View style={styles.timeSlotItem}>
      <Clock size={16} color="#64748b" />
      <Text style={styles.timeSlotText}>
        {item.time} ({item.duration}min)
      </Text>
      <TouchableOpacity onPress={() => removeTimeSlot(item.id)}>
        <X size={16} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Mode Selection */}
        <View style={styles.modeSelector}>
          <Text style={styles.sectionTitle}>Modo de Selección</Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'multiple' && styles.activeModeButton]}
              onPress={() => {
                setMode('multiple');
                clearAll();
              }}
            >
              <Text style={[styles.modeButtonText, mode === 'multiple' && styles.activeModeButtonText]}>
                Días Múltiples
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'consecutive' && styles.activeModeButton]}
              onPress={() => {
                setMode('consecutive');
                clearAll();
              }}
            >
              <Text style={[styles.modeButtonText, mode === 'consecutive' && styles.activeModeButtonText]}>
                Días Consecutivos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'range' && styles.activeModeButton]}
              onPress={() => {
                setMode('range');
                clearAll();
              }}
            >
              <Text style={[styles.modeButtonText, mode === 'range' && styles.activeModeButtonText]}>
                Rango
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType={mode === 'range' ? 'period' : 'dot'}
            theme={{
              todayTextColor: '#3b82f6',
              selectedDayBackgroundColor: '#3b82f6',
              selectedDayTextColor: '#ffffff',
              arrowColor: '#3b82f6',
              monthTextColor: '#1e293b',
              indicatorColor: '#3b82f6',
            }}
          />
        </View>

        {/* Selected Dates Display */}
        {(selectedDates.length > 0 || (rangeStart && rangeEnd)) && (
          <View style={styles.selectedDatesContainer}>
            <Text style={styles.sectionTitle}>Fechas Seleccionadas</Text>
            <Text style={styles.selectedDatesText}>
              {mode === 'range' && rangeStart && rangeEnd
                ? `${rangeStart} - ${rangeEnd} (${getDatesInRange(rangeStart, rangeEnd).length} días)`
                : selectedDates.join(', ')
              }
            </Text>
          </View>
        )}

        {/* Export Preview */}
        {selectedDates.length > 0 && timeSlots.length > 0 && (
          <View style={styles.exportPreviewContainer}>
            <Text style={styles.sectionTitle}>Vista Previa del Export</Text>
            <Text style={styles.exportPreviewText}>
              {JSON.stringify(generateExportData(), null, 2)}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Time Management Panel */}
      <View style={styles.timePanel}>
        <Text style={styles.sectionTitle}>Gestión de Horarios</Text>
        
        {/* Duration Setting */}
        <View style={styles.durationContainer}>
          <Text style={styles.label}>Duración del Servicio (min):</Text>
          <View style={styles.durationSelector}>
            <TouchableOpacity 
              style={styles.durationButton}
              onPress={() => setDuration(Math.max(15, duration - 15))}
            >
              <Minus size={16} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.durationText}>{duration}</Text>
            <TouchableOpacity 
              style={styles.durationButton}
              onPress={() => setDuration(duration + 15)}
            >
              <Plus size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Input */}
        <View style={styles.timeInputContainer}>
          <Text style={styles.label}>Agregar Horario:</Text>
          <View style={styles.timeInputRow}>
            <TextInput
              style={styles.timeInput}
              value={timeInput}
              onChangeText={setTimeInput}
              placeholder="Ej: 9, 14, 18"
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.timeInputSuffix}>:00</Text>
            <TouchableOpacity style={styles.addButton} onPress={addTimeSlot}>
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Auto Generate Toggle */}
        <TouchableOpacity
          style={styles.autoGenerateButton}
          onPress={() => setAutoGenerate(!autoGenerate)}
        >
          <Text style={[styles.autoGenerateText, autoGenerate && styles.autoGenerateActiveText]}>
            {autoGenerate ? '✓' : '○'} Generar automáticamente horarios para todo el día
          </Text>
        </TouchableOpacity>

        {/* Time Slots List */}
        {timeSlots.length > 0 && (
          <View style={styles.timeSlotsContainer}>
            <Text style={styles.label}>Horarios Agregados:</Text>
            <FlatList
              data={timeSlots}
              renderItem={renderTimeSlot}
              keyExtractor={item => item.id}
              style={styles.timeSlotsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Download size={16} color="white" />
          <Text style={styles.exportButtonText}>Exportar JSON</Text>
        </TouchableOpacity>

        {/* Clear All Button */}
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Limpiar Todo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 2,
    padding: 16,
  },
  modeSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activeModeButtonText: {
    color: 'white',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDatesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDatesText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  exportPreviewContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exportPreviewText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    lineHeight: 16,
  },
  timePanel: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  durationContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    minWidth: 40,
    textAlign: 'center',
  },
  timeInputContainer: {
    marginBottom: 20,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  timeInputSuffix: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoGenerateButton: {
    marginBottom: 20,
  },
  autoGenerateText: {
    fontSize: 14,
    color: '#64748b',
  },
  autoGenerateActiveText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  timeSlotsContainer: {
    marginBottom: 20,
  },
  timeSlotsList: {
    maxHeight: 200,
  },
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    marginBottom: 4,
    gap: 8,
  },
  timeSlotText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#10b981',
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MultipleDayCal;