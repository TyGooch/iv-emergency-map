import React from 'react';

import Helmet from 'react-helmet';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export default class FilterCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      from: this.props.startDate,
      to: this.props.endDate,
      enteredTo: this.props.endDate,
      readOnly: this.props.readOnly
    };
  }

  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  handleDayClick(day) {
    const { from, to } = this.state;
    if (from && to && day >= from && day <= to) {
      this.softReset();
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
      });
      this.props.updateFilter('timeBounds', {startDate: day, endDate:null});
    } else if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
      });
      this.props.updateFilter('timeBounds', {startDate: day, endDate:null});
    } else {
      this.setState({
        to: day,
        enteredTo: day,
      });
      day.setHours(23);
      day.setMinutes(59);
      day.setSeconds(59);
      this.props.updateFilter('timeBounds', {startDate: from, endDate:day});
      if(this.props.liveUpdate && new Date().toString().slice(0,15) !== day.toString().slice(0,15)){
        this.props.toggleLiveUpdates();
      }
    }
  }

  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day,
      });
    }
  }

  handleResetClick() {
    this.props.updateFilter('timeBounds', {startDate: null, endDate: null})

  }
  softReset() {
    this.setState({
      from: null,
      to: null,
      enteredTo: null,
      readOnly: false
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props !== prevProps){
      this.setState({
        from: this.props.startDate,
        to: this.props.endDate,
        enteredTo: this.props.endDate,
        readOnly: this.props.readOnly
      })
    }
}

  render() {
    const { from, to, enteredTo } = this.state;
    const { startDate, endDate } = this.props;
    // debugger;
    // const from = this.props.startDate;
    // const to = this.props.endDate;
    // const enteredTo = this.props.endDate;
    const modifiers = { start: from, end: enteredTo };
    const selectedDays = [from, { from, to: enteredTo }];
    if(this.props.readOnly){
      const disabledDays = { before: from, after: to };
      return (
        <div>
            <DayPicker
            className="Range"
            toMonth={new Date()}
            numberOfMonths={2}
            selectedDays={selectedDays}
            disabledDays={disabledDays}
            modifiers={modifiers}
            />

            <Helmet>
            <style>{`
              .Range {
                background-color: rgb(255,255,255);
              }
              .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                background-color: #f0f8ff !important;
                color: #4a90e2;
              }
              .Range .DayPicker-Day {
                border-radius: 0 !important;
              }
              .DayPicker-Day--today.DayPicker-Day--selected {

              }
              `}</style>
              </Helmet>
              </div>
            );
    } else{
      const disabledDays = { after: new Date() };
      return(
        <div>
            <DayPicker
            className="Range"
            numberOfMonths={2}
            selectedDays={selectedDays}
            disabledDays={disabledDays}
            modifiers={modifiers}
            onDayClick={this.handleDayClick}
            onDayMouseEnter={this.handleDayMouseEnter}
            />

            <Helmet>
            <style>{`
              .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                background-color: #f0f8ff !important;
                color: #4a90e2;
              }
              .Range .DayPicker-Day {
                border-radius: 0 !important;
              }
              .DayPicker-Day--today.DayPicker-Day--selected {

              }
              `}</style>
              </Helmet>
              </div>
      )
    }
  }
}
