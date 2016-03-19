/**
 * Created by seshu on 3/18/16.
 */
function Statistics(name, num_meetings, total_meeting_time_mins) {
    this.name = name;
    this.num_meetings = num_meetings;
    this.total_meeting_time_mins = total_meeting_time_mins;
}

Statistics.prototype.getStatsInString = function() {
    if (this.total_meeting_time_mins <= 0) {
        return "No Meetings";
    }

    total_meeting_time_hours = Math.floor(this.total_meeting_time_mins/ 60);
    total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
    offset = total_meeting_time_hours - total_meeting_time_days*8;
    return total_meeting_time_days + 'd ' + offset + 'h';
}

Statistics.prototype.getPercentage = function() {
    if (this.total_meeting_time_mins <= 0) {
        return "0";
    }

    var num_days_in_quarter = this.getNumDaysInQuarter();
    weeks = Math.floor(num_days_in_quarter/7);
    weekend_hours = weeks * 16;
    days = num_days_in_quarter - weeks*2;
    hours = (num_days_in_quarter*8) - weekend_hours;

    var percentage = this.getTotalMeetingHours() * 100 / hours;
    var percent = parseFloat(percentage).toFixed(2);
    return percent;
}

Statistics.prototype.getTotalMeetingHours = function() {
    return this.total_meeting_time_mins <= 0 ? 0 : Math.floor(this.total_meeting_time_mins/ 60);
}

Statistics.prototype.getNumDaysInQuarter = function() {
    var days_delta = Date.now() - Date.parse('2016-01-01T00:00:00+05:30')
    var num_days_in_quarter = Math.floor(days_delta/(1000*60*60*24));
    return num_days_in_quarter;
}

Statistics.prototype.getWorkingDays = function() {
    var num_days_in_quarter = this.getNumDaysInQuarter();
    weeks = Math.floor(num_days_in_quarter/7);
    weekend_hours = weeks * 16;
    days = num_days_in_quarter - weeks*2;

    return days;
}
