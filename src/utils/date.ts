export const getHour = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = '00';
  return `${hours}:${minutes}`;
};
