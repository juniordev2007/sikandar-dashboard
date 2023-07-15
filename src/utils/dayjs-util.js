import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date) => {
  // return dayjs(date).format('DD-MM-YYYY');
  return dayjs(date).format('DD MMMM YYYY');
  // const dateInIST = dayjs(date, { timeZone: 'Asia/Kolkata' });
  // const dateInCT = dateInIST.tz('America/Chicago');
  // return dateInCT.format('DD-MM-YYYY');
};

export const formatDateTime = (date) => {
  // const dateInIST = dayjs(date, { timeZone: 'Asia/Kolkata' });
  // const dateInCT = dateInIST.tz('America/Chicago');
  // return dateInCT.format('DD-MM-YYYY h:mm a');

  return dayjs(date).format('DD-MM-YYYY h:mm a');
};
