import { Component, forwardRef, HostBinding, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

interface Idate {
  month: number;
  year: number;
}

@Component({
  selector: 'app-month-date-picker',
  templateUrl: './month-date-picker.component.html',
  styleUrls: ['./month-date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthDatePickerComponent),
      multi: true
    }
  ]
})
export class MonthDatePickerComponent implements ControlValueAccessor {
  date: Idate;
  dateTxt: string;
  separator: string;
  monthFirst: boolean;
  place: number;

  isyear = false;
  incr = 0;

  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Allow the input to be disabled, and when it is make it somewhat transparent.
  @Input()
  disabled = false;
  @Input()
  mask = 'mm-yyyy';

  @ViewChild('calendarPanel')
  calendar: NgbDropdown;

  constructor() {
    this.separator = this.mask.replace(/[myM]/gi, '');
    this.monthFirst = this.mask.indexOf('y') > 0;
    this.place = this.mask.indexOf(this.separator);
  }

  change(value: string) {
    value =
      this.separator === ' '
        ? value.replace(/\.|-|\//, ' ')
        : this.separator === '/'
          ? value.replace(/\.|-| /, '/')
          : this.separator === '-'
            ? value.replace(/\.| |\//, '-')
            : value.replace(/.| |\/ /, '-');

    const lastchar = value.substr(value.length - 1);
    if (lastchar === this.separator && value.length <= this.place) {
      if (this.monthFirst) {
        value = '0' + value;
      }
    }
    if (value.length > this.place && value.indexOf(this.separator) < 0) {
      value = value.substr(0, value.length - 1) + this.separator + lastchar;
    }
    this.dateTxt = value;
    const items = value.split(this.separator);
    if (items.length === 2) {
      const year = this.monthFirst ? items[1] : items[0];
      const month = this.monthFirst ? items[0] : items[1];
      let imonth = this.months.indexOf(month);
      if (imonth < 0) {
        imonth = parseInt(month, 10);
      } else {
        imonth = imonth + 1;
      }
      let iyear = parseInt(year, 10);
      if (iyear < 100) {
        iyear = iyear + 2000;
      }

      this.date = {
        year: iyear,
        month: imonth
      };
      this.incr = this.getIncr(this.date.year);
    }
    this.writeValue(this.date);
  }

  selectYearMonth($event: any, index: number) {
    if (this.isyear) {
      $event.stopPropagation();
      this.date.year = index + this.incr;
      this.dateTxt = this.formatData(this.date);
      this.isyear = false;
      this.incr = this.getIncr(this.date.year);
      this.onChange(this.date);
    } else {
      this.date.month = index + 1;
      this.dateTxt = this.formatData(this.date);
      this.onChange(this.date);
    }
  }

  showYear($event: any) {
    $event.stopPropagation();
    this.isyear = !this.isyear;
  }

  addYear($event: any, incr: number) {
    $event.stopPropagation();
    const year = this.isyear ? this.date.year + 10 * incr : this.date.year + incr;
    this.date.year = year;
    this.incr = this.getIncr(year);
    this.dateTxt = this.formatData(this.date);
  }

  onChange = (date: Idate) => {
    this.date = date;
    this.dateTxt = this.monthFirst
      ? '' + date.month + this.separator + date.year
      : '' + date.year + this.separator + date.month;
    this.incr = this.getIncr(this.date.year);
  };

  getIncr(year: number): number {
    return year - (year % 10) - 1;
  }

  formatData(date: Idate): string {
    const monthTxt = date.month < 10 ? '0' + date.month : '' + date.month;
    return this.monthFirst ? monthTxt + this.separator + date.year : '' + date.year + this.separator + monthTxt;
  }

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {};

  writeValue(date: Idate): void {
    this.date = date;
    this.onChange(this.date);
  }

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (date: Idate) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
