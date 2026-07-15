export const getCurrentDate = (): Date => {
  return new Date();
};

export const getDateWithoutTime = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  const totalMinutes = timeToMinutes(time) + minutes;
  return minutesToTime(totalMinutes);
};

export const isTimeSlotAvailable = (
  startTime: string,
  endTime: string,
  existingSlots: Array<{ startTime: string; endTime: string }>,
): boolean => {
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  return !existingSlots.some((slot) => {
    const existingStart = timeToMinutes(slot.startTime);
    const existingEnd = timeToMinutes(slot.endTime);

    return !(newEnd <= existingStart || newStart >= existingEnd);
  });
};

export const getDayOfWeek = (date: Date): number => {
  const day = date.getDay();
  // Convert Sunday (0) to 6, others stay the same
  return day === 0 ? 6 : day - 1;
};
