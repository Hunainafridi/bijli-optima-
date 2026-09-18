export const getPKTDate = (): Date => {
  const date = new Date();
  const pktStr = date.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
  return new Date(pktStr);
};

export const getPKTTimeString = (): string => {
  return new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi' });
};

export const getPKTTimeShort = (): string => {
  return new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' });
};

export const isPKTPeakHour = (): boolean => {
  const pktDate = getPKTDate();
  const hour = pktDate.getHours();
  // Peak is 17:00 (5 PM) to 21:00 (9 PM)
  return hour >= 17 && hour < 21;
};
