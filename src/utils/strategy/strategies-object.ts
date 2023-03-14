type frequencyStrategy = {
  name: string;
  shouldSendEmail: (
    currentDate: Date,
    cutOffDay: number,
    lastSentDate?: Date,
  ) => boolean;
};

export const FREQUENCY_STRATEGIES: frequencyStrategy[] = [
  {
    name: '1',
    shouldSendEmail: (currentDate, cutOffDay) => true,
  },
  {
    name: '7',
    shouldSendEmail: (currentDate, cutOffDay) => {
      return currentDate.getDay() === cutOffDay;
    },
  },
  {
    name: '15',
    shouldSendEmail: (currentDate, cutOffDay, lastSentDate) => {
      if (!lastSentDate) {
        // Si no se ha enviado nunca, se compara la fecha actual con el día de corte configurado
        if (currentDate.getDate() === cutOffDay) {
          return true;
        } else {
          const nextSendDate = new Date();
          nextSendDate.setDate(cutOffDay + parseInt('15'));

          if (nextSendDate < currentDate) {
            nextSendDate.setMonth(nextSendDate.getMonth() + 1);
          }
          return currentDate.getDate() === nextSendDate.getDate();
        }
      }
      const lastSentDay = lastSentDate.getDate();
      const daysSinceLastSent =
        (currentDate.getTime() - lastSentDate.getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceLastSent >= 15) {
        // Si han pasado al menos 15 días desde el último envío, se calcula la próxima fecha de envío
        let nextSendDay;
        if (cutOffDay <= lastSentDay) {
          // Si la fecha de corte ya pasó el mes anterior, se suma 15 días a la fecha del último envío
          const nextMonth = new Date(
            lastSentDate.getFullYear(),
            lastSentDate.getMonth() + 1,
            1,
          );
          nextSendDay = Math.min(lastSentDay + 15, nextMonth.getDate());
        } else {
          // Si la fecha de corte aún no ha pasado, se suma 15 días a la fecha de corte configurado
          nextSendDay = cutOffDay + 15;
          if (nextSendDay > 31) {
            // Si la próxima fecha de envío es en el mes siguiente, se usa el día de corte como referencia
            nextSendDay -= 31;
          }
        }
        return currentDate.getDate() === nextSendDay;
      }
      return false;
    },
  },
  {
    name: '30',
    shouldSendEmail: (currentDate, cutOffDay) =>
      currentDate.getDate() === cutOffDay,
  },
];
