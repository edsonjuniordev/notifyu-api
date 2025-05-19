export class Datetime {
  public static convertToUnix(date: string): number {
    const newDate = new Date(date);
    const dateInUnix = Math.floor(newDate.getTime() / 1000);

    return dateInUnix;
  }

  public static addHoursToIsoString(dateIsoString: string, hours: number): string {
    const date = new Date(dateIsoString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid ISO date string');
    }

    date.setHours(date.getHours() + hours);

    return date.toISOString();
  }
}
