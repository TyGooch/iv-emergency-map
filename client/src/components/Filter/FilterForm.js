import React from 'react';
import ReactDOM from 'react-dom';
// import DatePicker from 'react-datepicker';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import FilterCalendar from './FilterCalendar';
import FilterPopover from './FilterPopover';
import Cleave from 'cleave.js/react';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import {Overlay, OverlayTrigger, Popover, Portal, Nav, NavItem, Tabs, Tab, ButtonToolbar, ButtonGroup, ToggleButtonGroup, ToggleButton, Button} from 'react-bootstrap';


import style from './style.js'
import './filter.css';

class FilterForm extends React.Component {

  constructor(props){
    super(props);
    this.state={
      showOverlay: false,
      selectedOverlay: null,
      readOnlyCalendar: true,
      dateRange:'7',
      activeButton: false
    }
  }

  toggleOverlay(){
    this.setState({ showOverlay: !this.state.showOverlay })
  }

  handleLiveUpdateToggle(event){
    this.props.toggleLiveUpdates()
    this.setState({activeButton: !this.state.activeButton})
  };

  handleLimitChange(event){
    this.props.updateFilter('limit', event.target.value)
  };

  showAllEmergencies(event){
    this.props.updateFilter('limit', this.props.filteredEmergencyCount)
  };

  handleStartDateChange(event){
    if(event.target.value.length === 10){
      let date = new Date(event.target.value);
      if(this.props.timeBounds.endDate === null || date <= this.props.timeBounds.endDate){
        this.props.updateFilter('timeBounds', {startDate: new Date(event.target.value), endDate: this.props.timeBounds.endDate})
        this.endDateInput.focus();
        // debugger;
      } else{
        this.props.updateFilter('timeBounds', {startDate: new Date(event.target.value), endDate: null})
      }
    }
  };

  handleEndDateChange(event){
    if(event.target.value.length === 10){
      let date = new Date(event.target.value);
      if(date <= new Date(moment().set({'hours':11, 'minutes':59, 'seconds':59}))){
        this.props.updateFilter('timeBounds', {startDate: this.props.timeBounds.startDate, endDate: new Date(event.target.value)})
      } else{
        this.props.updateFilter('timeBounds', {startDate: this.props.timeBounds.startDate, endDate: this.props.timeBounds.endDate})
      }
    }
  };

  handleDateToggle(dateRange) {
    if(dateRange === 'custom'){
      var startDate = null;
      var endDate = null;
      this.setState({readOnlyCalendar: false, dateRange: dateRange});
      this.startDateInput.focus();
      this.props.toggleLiveUpdates();
    } else{
      startDate = new Date(Date.now() - (dateRange*24*60*60*1000));
      endDate = new Date()
      this.setState({readOnlyCalendar: true, dateRange: dateRange});
      if(!this.props.liveUpdate){
        this.props.toggleLiveUpdates();
      }
    }
    this.props.updateFilter('timeBounds', {startDate: startDate, endDate: endDate})
  }


  handleTypeToggle(activeTypes){
    var newTypes = {}
    Object.keys(this.props.types).map(type =>
      {
        if(activeTypes.includes(type)){
          newTypes[type] = true;
        }
        else{
          newTypes[type] = false
        }
      });
    this.props.updateFilter('types', newTypes)
  }

  componentDidUpdate(prevProps, prevState){
    if(!this.state.readOnlyCalendar && prevState.readOnlyCalendar){
      this.startDateInput.focus();
    }
  }

  render() {
    bootstrapUtils.addStyle(Button, 'custom');
    bootstrapUtils.addStyle(Button, 'nav');

    return(
      <div className='filter-container' >
        <div className='filter-nav'>
        <ButtonGroup justified  >
          <ButtonGroup>
            <Button bsStyle='nav' active={this.state.selectedOverlay === 'emergencyType'} ref="emergencyTypesButton" onClick={() => this.setState({selectedOverlay:'emergencyType'})}>
              Visible Emergency Types
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button bsStyle='nav' active={this.state.selectedOverlay === 'emergencyLimit'} ref="emergencyLimitButton" onClick={() => this.setState({selectedOverlay:'emergencyLimit'})}>
              Maximum Emergencies Shown
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button bsStyle='nav' active={this.state.selectedOverlay === 'emergencyDate'} ref="emergencyDateButton" onClick={() => this.setState({selectedOverlay:'emergencyDate'})}>
              Range of Dates
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button bsStyle='nav' active={this.state.selectedOverlay === 'liveUpdates'} ref="liveUpdatesButton" onClick={() => this.setState({selectedOverlay:'liveUpdates'})}>
              Live Updates
            </Button>
          </ButtonGroup>
        </ButtonGroup>

        <Overlay
          animation={false}
          show={this.state.selectedOverlay === 'emergencyType'}
          onHide={() => this.setState({ selectedOverlay: null })}
          rootClose={true}
          placement="top"
          target={() => ReactDOM.findDOMNode(this.refs.emergencyTypesButton)}
        >
          <FilterPopover  >
            <ButtonToolbar>
              <ToggleButtonGroup type="checkbox" defaultValue={Object.keys(this.props.types).filter(type => this.props.types[type] === true)} onChange={this.handleTypeToggle.bind(this)}>
                <ToggleButton bsStyle='custom' data-key='Medical' value={'Medical'} >Medical</ToggleButton>
                <ToggleButton bsStyle='custom' data-key='Fire' value={'Fire'}>Fire</ToggleButton>
                <ToggleButton bsStyle='custom' data-key='Vehicle' value={'Vehicle'}>Vehicle</ToggleButton>
                <ToggleButton bsStyle='custom' data-key='Other' value={'Other'}>Other</ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
          </FilterPopover>
        </Overlay>

        <Overlay
          animation={false}
          show={this.state.selectedOverlay === 'emergencyLimit'}
          onHide={() => this.setState({ selectedOverlay: null })}
          rootClose={true}
          placement="top"
          target={() => ReactDOM.findDOMNode(this.refs.emergencyLimitButton)}
        >
          <FilterPopover >
            <div className='filter-limit-popover'>
              <input
                className='filter-limit-input'
                type="number"
                min="1"
                pattern="[0-9]*"
                value={this.props.limit}
                onChange={this.handleLimitChange.bind(this)}
              />
              <Button
                bsStyle='custom'
                onClick={this.showAllEmergencies.bind(this)}
              >
              Show All
              </Button>
            </div>
          </FilterPopover>
        </Overlay>

        <Overlay
          animation={false}
          show={this.state.selectedOverlay === 'emergencyDate'}
          onHide={() => this.setState({ selectedOverlay: null })}
          rootClose={true}
          placement="top"
          target={() => ReactDOM.findDOMNode(this.refs.emergencyDateButton)}
        >
          <FilterPopover>
            <div className='date-range-popover'>
              <div className='date-range-buttons'>
              <span>View Emergencies Since</span>
                <ButtonToolbar>
                  <ToggleButtonGroup vertical type="radio" name="dateRanges" defaultValue={this.state.dateRange} onChange={this.handleDateToggle.bind(this)}>
                    <ToggleButton bsStyle='custom' value={'1'}>Yesterday</ToggleButton>
                    <ToggleButton bsStyle='custom' value={'7'}>1 Week Ago</ToggleButton>
                    <ToggleButton bsStyle='custom' value={'31'}>1 Month Ago</ToggleButton>
                    <ToggleButton bsStyle='custom' value={'custom'}>Custom Range</ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>
              </div>
              <div className='date-range-calendar'>
                <div className='date-range-calendar-input'>
                  <Cleave htmlRef={(ref) => this.startDateInput = ref }
                          className='date-input'
                          disabled={this.state.readOnlyCalendar}
                          style={!this.state.readOnlyCalendar ? {cursor:'pointer'} : null}
                          placeholder="From"
                          options={{date: true, datePattern: ['m', 'd', 'Y']}}
                          onChange={this.handleStartDateChange.bind(this)}
                          value={moment(this.props.timeBounds.startDate).format('MM/DD/YYYY')}/>
                  {' – '}
                  <Cleave htmlRef={(ref) => this.endDateInput = ref }
                          className='date-input'
                          disabled={this.state.readOnlyCalendar}
                          style={!this.state.readOnlyCalendar ? {cursor:'pointer'} : null}
                          placeholder="To"
                          options={{date: true, datePattern: ['m', 'd', 'Y']}}
                          onChange={this.handleEndDateChange.bind(this)}
                          value={moment(this.props.timeBounds.endDate).format('MM/DD/YYYY')}/>
                </div>
                <div className='date-range-calendar-view'>
                  <FilterCalendar startDate={this.props.timeBounds.startDate} endDate={this.props.timeBounds.endDate} updateFilter={this.props.updateFilter} liveUpdate={this.props.liveUpdate} toggleLiveUpdates={this.props.toggleLiveUpdates} readOnly={this.state.readOnlyCalendar} />
                </div>
              </div>
            </div>
          </FilterPopover>
        </Overlay>

        <Overlay
          animation={false}
          show={this.state.selectedOverlay === 'liveUpdates'}
          onHide={() => this.setState({ selectedOverlay: null })}
          rootClose={true}
          placement="top"
          target={() => ReactDOM.findDOMNode(this.refs.liveUpdatesButton)}
        >
          <FilterPopover >
            <Button
              bsStyle='custom'
              active={!this.props.liveUpdate}
              disabled={this.props.timeBounds.endDate === null || this.props.timeBounds.endDate === new Date(new Date().setHours(23,59,59,999))}
              onClick={this.handleLiveUpdateToggle.bind(this)}
            >
            {this.props.liveUpdate ? 'Disable' : 'Enable'}
            </Button>
          </FilterPopover>
        </Overlay>
        </div>

      </div>
    )
  }
}

export default FilterForm;
