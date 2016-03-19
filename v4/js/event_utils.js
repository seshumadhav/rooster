/**
 * Created by seshu on 3/18/16.
 */
function getTotalMeetingTimeMinutes(person, events) {
    if (events.length <= 0) {
        return 0;
    }

    var total_meeting_time_mins = 0;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
            when = event.start.date;
        }

        var declined = false;
        if (event.attendees != null) {
            for (j = 0; j < event.attendees.length; j++) {
                if (event.attendees[j].email && event.attendees[j].email == this.person && event.attendees[j].responseStatus == 'declined') {
                    declined = true;
                }
            }
        }

        duration = event.end.dateTime - event.start.dateTime;
        sd = Date.parse(event.start.dateTime);
        ed = Date.parse(event.end.dateTime);

        duration2 = (ed - sd) / (1000 * 60);
        if (!isNaN(duration2) && !declined) {
            total_meeting_time_mins = total_meeting_time_mins + duration2;
        }
    }

    return total_meeting_time_mins;
}
