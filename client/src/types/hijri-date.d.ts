declare module 'hijri-date' {
  class HijriDate {
    constructor();
    getDate(): number;
    getMonth(): number;
    getFullYear(): number;
    toString(): string;
  }
  
  export default HijriDate;
}