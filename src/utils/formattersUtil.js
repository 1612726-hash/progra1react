export const formatTimestamp = (date = new Date()) => {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num);
};
