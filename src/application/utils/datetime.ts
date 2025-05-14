export class Datetime {
  public static convertToUnix(date: string): number {
    const newDate = new Date(date);
    const dateInUnix = Math.floor(newDate.getTime() / 1000);

    return dateInUnix;
  }
}
