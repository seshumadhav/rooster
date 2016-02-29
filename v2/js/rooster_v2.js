// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        $('#authorize-div').hide();
        authorizeDiv.style.display = 'none';
        $('#stats').show();
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        $('#authorize-div').show();
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize(
        { client_id: CLIENT_ID, scope: SCOPES, immediate: false },
        handleAuthResult);
    return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    // gapi.client.load('calendar', 'v3', listUpcomingEvents);
    gapi.client.load('calendar', 'v3', getStatistics);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    <!--var request = gapi.client.calendar.events.list({-->
    <!--'calendarId': 'primary',-->
    <!--'timeMin': (new Date()).toISOString(),-->
    <!--'showDeleted': false,-->
    <!--'singleEvents': true,-->
    <!--'maxResults': 10,-->
    <!--'orderBy': 'startTime'-->
    <!--});-->

    <!--request.execute(function(resp) {-->
    <!--var events = resp.items;-->
    <!--appendPre('\n\nUpcoming events:');-->

    <!--if (events.length > 0) {-->
    <!--for (i = 0; i < events.length; i++) {-->
    <!--var event = events[i];-->
    <!--var when = event.start.dateTime;-->
    <!--if (!when) {-->
    <!--when = event.start.date;-->
    <!--}-->
    <!--appendPre(event.summary + ' (' + when + ')')-->
    <!--}-->
    <!--} else {-->
    <!--appendPre('No upcoming events found.');-->
    <!--}-->

    <!--});-->


    var request2 = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'showDeleted': false,
        'singleEvents': true,
        // 'orderBy': 'updated',
        'timeMax': (new Date()).toISOString(),
        'timeMin': '2016-01-01T00:00:00+05:30'
    });

    var total_meeting_time_mins = 0;
    var days_delta = Date.now() - Date.parse('2016-01-01T00:00:00+05:30')
    var num_days_in_quarter = Math.floor(days_delta/(1000*60*60*24));

    request2.execute(function(resp) {
        var total_meeting_time_mins = 0;
        var events = resp.items;
        // appendPre('\n\nPast events(seshu@indeed.com): (' + events.length + ')');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                duration = event.end.dateTime - event.start.dateTime;
                sd = Date.parse(event.start.dateTime);
                ed = Date.parse(event.end.dateTime);

                var declined = false;
                if (event.attendees != null) {
                    for (j = 0; j < event.attendees.length; j++) {
                        if (event.attendees[j].self && event.attendees[j].responseStatus == 'declined') {
                            declined = true;
                        }
                    }
                }

                duration2 = (ed - sd)/(1000 * 60);
                if (!isNaN(duration2) && !declined) {
                    total_meeting_time_mins = total_meeting_time_mins + duration2;
                }

                // appendPre(i + '. ' + event.summary + ' (' + when + ')\tDuration: ' + duration2 + 'mins\ttotal_meeting_time_mins: ' + total_meeting_time_mins + '\tNum Attendees: ' + (event.attendees != null ? event.attendees.length : 0) + '\nCreator: ' + event.creator.email + '\tAttended: ' + !declined);
            }

            appendPre('\n\n\nSummary(seshu@indeed.com)\n-------');
            total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
            total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
            offset = total_meeting_time_hours - total_meeting_time_days*8;

            weeks = Math.floor(num_days_in_quarter/7);
            weekend_hours = weeks * 16;
            days = num_days_in_quarter - weeks*2;
            hours = (num_days_in_quarter*8) - weekend_hours;
            var percentage = (total_meeting_time_hours*100/hours);
            var percent = parseFloat(percentage).toFixed(2);

            appendPre('Days in this quarter so far: ' + num_days_in_quarter);
            appendPre('Working days: ' + days);
            appendPre('Total meetings: ' + events.length);
            appendPre('Total time in meetings: ' + total_meeting_time_mins + 'm => ' +  total_meeting_time_hours + 'h => ' + total_meeting_time_days + 'd ' + offset + 'h');
            appendPre('Percentage time in meetings: ' + percent + '%');
        } else {
            appendPre('No past events found.');
        }
    });

    <!--var request3 = gapi.client.calendar.calendarList.list();-->
    <!--request3.execute(function(resp) {-->
    <!--var kind = resp.kind;-->
    <!--var summary = resp.id;-->
    <!--var numItems = resp.items.length;-->
    <!--appendPre('\n\nCalendar List Count: ' + numItems);-->
    <!--var shortlistedCalendars = [];-->
    <!--for (k = 0; k < numItems; k++) {-->
    <!--id = resp.items[k].id;-->
    <!--var colleague = false;-->
    <!--if (id.search('@indeed.com') != -1) {-->
    <!--colleague = true;-->
    <!--}-->
    <!--appendPre('\tID: ' + id + '\t(Colleague: ' + colleague + ')');-->
    <!--}-->
    <!--});-->

    // var stats = [];
    // var stat1 = {};
    // var stat2 = {};
    // var message = '';
    // var done1 = false, done2 = false;
    var request4 = gapi.client.calendar.events.list({
        'calendarId': 'goutham@indeed.com',
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'updated',
        'timeMax': (new Date()).toISOString(),
        'timeMin': '2016-01-01T00:00:00+05:30'
    });
    request4.execute(function(resp) {
        var total_meeting_time_mins = 0;
        var events = resp.items;
        // message += 'goutham@indeed.com' + ': ' + events.length;
        // appendPre('\n\n___\ngoutham@indeed.com' + ': ' + events.length);
        // stat1.name = 'goutham@indeed.com';
        // stat1.count = events.length;
        // stats['goutham@indeed.com'] = events.length;
        // done1 = true;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                var declined = false;
                if (event.attendees != null) {
                    for (j = 0; j < event.attendees.length; j++) {
                        if (event.attendees[j].email && event.attendees[j].email == 'goutham@indeed.com' && event.attendees[j].responseStatus == 'declined') {
                            declined = true;
                        }
                    }
                }

                duration = event.end.dateTime - event.start.dateTime;
                sd = Date.parse(event.start.dateTime);
                ed = Date.parse(event.end.dateTime);

                duration2 = (ed - sd)/(1000 * 60);
                if (!isNaN(duration2) && !declined) {
                    total_meeting_time_mins = total_meeting_time_mins + duration2;
                }

                // appendPre(i + '. ' + event.summary + ' (' + when + ')\tDuration: ' + duration2 + 'mins\t' + '\tNum Attendees: ' + (event.attendees != null ? event.attendees.length : 0) + '\nCreator: ' + (event.creator && event.creator.email ? event.creator.email : 'not known'));
            }

            appendPre('\n\n\nSummary(goutham@indeed.com)\n-------');
            total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
            total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
            offset = total_meeting_time_hours - total_meeting_time_days*8;

            weeks = Math.floor(num_days_in_quarter/7);
            weekend_hours = weeks * 16;
            days = num_days_in_quarter - weeks*2;
            hours = (num_days_in_quarter*8) - weekend_hours;
            var percentage = (total_meeting_time_hours*100/hours);
            var percent = parseFloat(percentage).toFixed(2);

            appendPre('Days in this quarter so far: ' + num_days_in_quarter);
            appendPre('Working days: ' + days);
            appendPre('Total meetings: ' + events.length);
            appendPre('Total time in meetings: ' + total_meeting_time_mins + 'm => ' +  total_meeting_time_hours + 'h => ' + total_meeting_time_days + 'd ' + offset + 'h');
            appendPre('Percentage time in meetings: ' + percent + '%');
        } else {
            appendPre('No past events found.');
        }
    });


    var request5 = gapi.client.calendar.events.list({
        'calendarId': 'prateek@indeed.com',
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'updated',
        'timeMax': (new Date()).toISOString(),
        'timeMin': '2016-01-01T00:00:00+05:30'
    });

    request5.execute(function(resp) {
        var total_meeting_time_mins = 0;
        var events = resp.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                var declined = false;
                if (event.attendees != null) {
                    for (j = 0; j < event.attendees.length; j++) {
                        if (event.attendees[j].email && event.attendees[j].email == 'prateek@indeed.com' && event.attendees[j].responseStatus == 'declined') {
                            declined = true;
                        }
                    }
                }

                duration = event.end.dateTime - event.start.dateTime;
                sd = Date.parse(event.start.dateTime);
                ed = Date.parse(event.end.dateTime);

                duration2 = (ed - sd)/(1000 * 60);
                if (!isNaN(duration2) && !declined) {
                    total_meeting_time_mins = total_meeting_time_mins + duration2;
                }

                // appendPre(i + '. ' + event.summary + ' (' + when + ')\tDuration: ' + duration2 + 'mins\t' + '\tNum Attendees: ' + (event.attendees != null ? event.attendees.length : 0) + '\nCreator: ' + (event.creator && event.creator.email ? event.creator.email : 'not known'));
            }

            appendPre('\n\n\nSummary(prateek@indeed.com)\n-------');
            total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
            total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
            offset = total_meeting_time_hours - total_meeting_time_days*8;

            weeks = Math.floor(num_days_in_quarter/7);
            weekend_hours = weeks * 16;
            days = num_days_in_quarter - weeks*2;
            hours = (num_days_in_quarter*8) - weekend_hours;
            var percentage = (total_meeting_time_hours*100/hours);
            var percent = parseFloat(percentage).toFixed(2);

            appendPre('Days in this quarter so far: ' + num_days_in_quarter);
            appendPre('Working days: ' + days);
            appendPre('Total meetings: ' + events.length);
            appendPre('Total time in meetings: ' + total_meeting_time_mins + 'm => ' +  total_meeting_time_hours + 'h => ' + total_meeting_time_days + 'd ' + offset + 'h');
            appendPre('Percentage time in meetings: ' + percent + '%');
        } else {
            appendPre('No past events found.');
        }
    });



    //var request6 = gapi.client.calendar.events.list({
    //    'calendarId': 'asutosh@indeed.com',
    //    'showDeleted': false,
    //    'singleEvents': true,
    //    'orderBy': 'updated',
    //    'timeMax': (new Date()).toISOString(),
    //    'timeMin': '2016-01-01T00:00:00+05:30'
    //});
    //
    //request6.execute(function(resp) {
    //    var total_meeting_time_mins = 0;
    //    var events6 = resp.items;
    //
    //    if (events6.length > 0) {
    //        for (i = 0; i < events6.length; i++) {
    //            var event = events6[i];
    //            var when = event.start.dateTime;
    //            if (!when) {
    //                when = event.start.date;
    //            }
    //
    //            var declined = false;
    //            if (event.attendees != null) {
    //                for (j = 0; j < event.attendees.length; j++) {
    //                    if (event.attendees[j].email && event.attendees[j].email == 'asutosh@indeed.com' && event.attendees[j].responseStatus == 'declined') {
    //                        declined = true;
    //                    }
    //                }
    //            }
    //
    //            duration = event.end.dateTime - event.start.dateTime;
    //            sd = Date.parse(event.start.dateTime);
    //            ed = Date.parse(event.end.dateTime);
    //
    //            duration2 = (ed - sd)/(1000 * 60);
    //            if (!isNaN(duration2) && !declined) {
    //                total_meeting_time_mins = total_meeting_time_mins + duration2;
    //            }
    //
    //            // appendPre(i + '. ' + event.summary + ' (' + when + ')\tDuration: ' + duration2 + 'mins\ttotal_meeting_time_mins: ' + total_meeting_time_mins + '\tNum Attendees: ' + (event.attendees != null ? event.attendees.length : 0) + '\nCreator: ' + event.creator.email + '\tAttended: ' + !declined);
    //        }
    //
    //        appendPre('\n\n\nSummary(asutosh@indeed.com)\n-------');
    //        total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
    //        total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
    //        offset = total_meeting_time_hours - total_meeting_time_days*8;
    //
    //        weeks = Math.floor(num_days_in_quarter/7);
    //        weekend_hours = weeks * 16;
    //        days = num_days_in_quarter - weeks*2;
    //        hours = (num_days_in_quarter*8) - weekend_hours;
    //        var percentage = (total_meeting_time_hours*100/hours);
    //        var percent = parseFloat(percentage).toFixed(2);
    //
    //        appendPre('Days in this quarter so far: ' + num_days_in_quarter);
    //        appendPre('Working days: ' + days);
    //        appendPre('Total meetings: ' + events6.length);
    //        appendPre('Total time in meetings: ' + total_meeting_time_mins + 'm => ' +  total_meeting_time_hours + 'h => ' + total_meeting_time_days + 'd ' + offset + 'h');
    //        appendPre('Percentage time in meetings: ' + percent + '%');
    //    } else {
    //        appendPre('No past events found.');
    //    }
    //});

    //var request7 = gapi.client.calendar.events.list({
    //    'calendarId': 'swarnabha@indeed.com',
    //    'showDeleted': false,
    //    'singleEvents': true,
    //    'orderBy': 'updated',
    //    'timeMax': (new Date()).toISOString(),
    //    'timeMin': '2016-01-01T00:00:00+05:30'
    //});
    //
    //request7.execute(function(resp) {
    //    var total_meeting_time_mins = 0;
    //    var events = resp.items;
    //
    //    if (events.length > 0) {
    //        for (i = 0; i < events.length; i++) {
    //            var event = events[i];
    //            var when = event.start.dateTime;
    //            if (!when) {
    //                when = event.start.date;
    //            }
    //
    //            var declined = false;
    //            if (event.attendees != null) {
    //                for (j = 0; j < event.attendees.length; j++) {
    //                    if (event.attendees[j].email && event.attendees[j].email == 'swarnabha@indeed.com' && event.attendees[j].responseStatus == 'declined') {
    //                        declined = true;
    //                    }
    //                }
    //            }
    //
    //            duration = event.end.dateTime - event.start.dateTime;
    //            sd = Date.parse(event.start.dateTime);
    //            ed = Date.parse(event.end.dateTime);
    //
    //            duration2 = (ed - sd)/(1000 * 60);
    //            if (!isNaN(duration2) && !declined) {
    //                total_meeting_time_mins = total_meeting_time_mins + duration2;
    //            }
    //
    //            // appendPre(i + '. ' + event.summary + ' (' + when + ')\tDuration: ' + duration2 + 'mins\t' + '\tNum Attendees: ' + (event.attendees != null ? event.attendees.length : 0) + '\nCreator: ' + (event.creator && event.creator.email ? event.creator.email : 'not known'));
    //        }
    //
    //        appendPre('\n\n\nSummary(swarnabha@indeed.com)\n-------');
    //        total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
    //        total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
    //        offset = total_meeting_time_hours - total_meeting_time_days*8;
    //
    //        weeks = Math.floor(num_days_in_quarter/7);
    //        weekend_hours = weeks * 16;
    //        days = num_days_in_quarter - weeks*2;
    //        hours = (num_days_in_quarter*8) - weekend_hours;
    //        var percentage = (total_meeting_time_hours*100/hours);
    //        var percent = parseFloat(percentage).toFixed(2);
    //
    //        appendPre('Days in this quarter so far: ' + num_days_in_quarter);
    //        appendPre('Working days: ' + days);
    //        appendPre('Total meetings: ' + events.length);
    //        appendPre('Total time in meetings: ' + total_meeting_time_mins + 'm => ' +  total_meeting_time_hours + 'h => ' + total_meeting_time_days + 'd ' + offset + 'h');
    //        appendPre('Percentage time in meetings: ' + percent + '%');
    //    } else {
    //        appendPre('No past events found.');
    //    }});

    var request00 = gapi.client.calendar.events.list({
        'calendarId': 'swarnabha@indeed.com',
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'updated',
        'timeMax': (new Date()).toISOString(),
        'timeMin': '2016-01-01T00:00:00+05:30'
    });

    request00.execute(function(resp) {
        blockFor = 'swarnabha';
        calendarId = blockFor + '@indeed.com';
        blockHeading = 'Summary (' + calendarId + ')';
        addBlock(blockFor, blockHeading);

        var total_meeting_time_mins = 0;
        var events = resp.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                var declined = false;
                if (event.attendees != null) {
                    for (j = 0; j < event.attendees.length; j++) {
                        if (event.attendees[j].email && event.attendees[j].email == calendarId && event.attendees[j].responseStatus == 'declined') {
                            declined = true;
                        }
                    }
                }

                duration = event.end.dateTime - event.start.dateTime;
                sd = Date.parse(event.start.dateTime);
                ed = Date.parse(event.end.dateTime);

                duration2 = (ed - sd)/(1000 * 60);
                if (!isNaN(duration2) && !declined) {
                    total_meeting_time_mins = total_meeting_time_mins + duration2;
                }

                // appendPre(i + '. ' + event.summary + ' (' + when + ')\tDuration: ' + duration2 + 'mins\t' + '\tNum Attendees: ' + (event.attendees != null ? event.attendees.length : 0) + '\nCreator: ' + (event.creator && event.creator.email ? event.creator.email : 'not known'));
            }

            total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
            total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
            offset = total_meeting_time_hours - total_meeting_time_days*8;

            weeks = Math.floor(num_days_in_quarter/7);
            weekend_hours = weeks * 16;
            days = num_days_in_quarter - weeks*2;
            hours = (num_days_in_quarter*8) - weekend_hours;
            var percentage = (total_meeting_time_hours*100/hours);
            var percent = parseFloat(percentage).toFixed(2);

            printf('Days in this quarter so far: ' + num_days_in_quarter, blockFor);
            printf('Working days: ' + days, blockFor);
            printf('Total meetings: ' + events.length, blockFor);
            printf('Total time in meetings: ' + total_meeting_time_mins + 'm => ' +  total_meeting_time_hours + 'h => ' + total_meeting_time_days + 'd ' + offset + 'h', blockFor);
            printf('Percentage time in meetings: ' + percent + '%', blockFor);
        } else {
            printf('No past events found.', blockFor);
        }});


    var request01 = gapi.client.calendar.events.list({
        'calendarId': 'asutosh@indeed.com',
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'updated',
        'timeMax': (new Date()).toISOString(),
        'timeMin': '2016-01-01T00:00:00+05:30'
    });

    request01.execute(function(resp) {
        blockFor = 'asutosh';
        calendarId = blockFor + '@indeed.com';
        blockHeading = 'Summary (' + calendarId + ')';
        addBlock(blockFor, blockHeading);

        var total_meeting_time_mins = 0;
        var events = resp.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                var declined = false;
                if (event.attendees != null) {
                    for (j = 0; j < event.attendees.length; j++) {
                        if (event.attendees[j].email && event.attendees[j].email == calendarId && event.attendees[j].responseStatus == 'declined') {
                            declined = true;
                        }
                    }
                }

                duration = event.end.dateTime - event.start.dateTime;
                sd = Date.parse(event.start.dateTime);
                ed = Date.parse(event.end.dateTime);

                duration2 = (ed - sd)/(1000 * 60);
                if (!isNaN(duration2) && !declined) {
                    total_meeting_time_mins = total_meeting_time_mins + duration2;
                }

                // appendPre(i + '. ' + event.summary + ' (' + when + ')\tDuration: ' + duration2 + 'mins\t' + '\tNum Attendees: ' + (event.attendees != null ? event.attendees.length : 0) + '\nCreator: ' + (event.creator && event.creator.email ? event.creator.email : 'not known'));
            }

            total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
            total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
            offset = total_meeting_time_hours - total_meeting_time_days*8;

            weeks = Math.floor(num_days_in_quarter/7);
            weekend_hours = weeks * 16;
            days = num_days_in_quarter - weeks*2;
            hours = (num_days_in_quarter*8) - weekend_hours;
            var percentage = (total_meeting_time_hours*100/hours);
            var percent = parseFloat(percentage).toFixed(2);

            printf('Days in this quarter so far: ' + num_days_in_quarter, blockFor);
            printf('Working days: ' + days, blockFor);
            printf('Total meetings: ' + events.length, blockFor);
            printf('Total time in meetings: ' + total_meeting_time_mins + 'm => ' +  total_meeting_time_hours + 'h => ' + total_meeting_time_days + 'd ' + offset + 'h', blockFor);
            printf('Percentage time in meetings: ' + percent + '%', blockFor);
        } else {
            printf('No past events found.', blockFor);
        }});
}

function getStatistics() {
     //people = ['asutosh', 'goutham', 'prateek', 'seshu', 'swarnabha'];
    people = ['asutosh', 'swarnabha'];
    people.forEach(fetchStats);
}

function fetchStats(person) {
    var calendarId = person + '@indeed.com';

    var total_meeting_time_mins = 0;
    var days_delta = Date.now() - Date.parse('2016-01-01T00:00:00+05:30')
    var num_days_in_quarter = Math.floor(days_delta/(1000*60*60*24));

    var request = gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'updated',
        'timeMax': (new Date()).toISOString(),
        'timeMin': '2016-01-01T00:00:00+05:30'
    });

    request.execute(function(resp) {
        // var blockFor = user;
        // var calendarId = getCalendarId(user);

        var calendarId = resp.summary;
        var blockFor = calendarId.split('@')[0];
        var user = blockFor;

        if (calendarId.indexOf('@') == -1) {
            return;
        }

        window.alert(user);
        window.alert(calendarId);


        var blockHeading = 'Summary (' + calendarId + ')';
        addBlock(blockFor, blockHeading);

        var total_meeting_time_mins = 0;
        var events = resp.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                var declined = false;
                if (event.attendees != null) {
                    for (j = 0; j < event.attendees.length; j++) {
                        if (event.attendees[j].email && event.attendees[j].email == calendarId && event.attendees[j].responseStatus == 'declined') {
                            declined = true;
                        }
                    }
                }

                duration = event.end.dateTime - event.start.dateTime;
                sd = Date.parse(event.start.dateTime);
                ed = Date.parse(event.end.dateTime);

                duration2 = (ed - sd)/(1000 * 60);
                if (!isNaN(duration2) && !declined) {
                    total_meeting_time_mins = total_meeting_time_mins + duration2;
                }

                // appendPre(i + '. ' + event.summary + ' (' + when + ')\tDuration: ' + duration2 + 'mins\t' + '\tNum Attendees: ' + (event.attendees != null ? event.attendees.length : 0) + '\nCreator: ' + (event.creator && event.creator.email ? event.creator.email : 'not known'));
            }

            total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
            total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
            offset = total_meeting_time_hours - total_meeting_time_days*8;

            weeks = Math.floor(num_days_in_quarter/7);
            weekend_hours = weeks * 16;
            days = num_days_in_quarter - weeks*2;
            hours = (num_days_in_quarter*8) - weekend_hours;
            var percentage = (total_meeting_time_hours*100/hours);
            var percent = parseFloat(percentage).toFixed(2);

            printf('Days in this quarter so far: ' + num_days_in_quarter, user);
            printf('Working days: ' + days, user);
            printf('Total meetings: ' + events.length, user);
            printf('Total time in meetings: '
                + total_meeting_time_mins + 'm => '
                +  total_meeting_time_hours + 'h => '
                + total_meeting_time_days + 'd ' + offset + 'h',
                user);
            printf('Percentage time in meetings: ' + percent + '%', user);
        } else {
            printf('No past events found.', user);
        }});
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    //var pre = document.getElementById('output');
    //var textContent = document.createTextNode(message + '\n');
    //pre.appendChild(textContent);

    $('<p>', {
        style: 'white-space: pre-wrap;'
    }).html(message + '\n').appendTo( $('#output') );
}

function getCalendarId(person) {
    return person + '@indeed.com';
}

function bodyId(blockFor) {
    return "body-" + blockFor;
}

function headingId(blockFor) {
    return "heading-" + blockFor;
}

function printf(message, blockFor) {
    var $panel = $('#' + blockFor);
    var $body = $panel.find('#' + bodyId(blockFor));

    $('<p>', {
        style: 'white-space: pre-wrap;'
    }).html(message + '\n').appendTo( $body );
}

function addBlock(blockFor, blockHeading) {
    var $template = $(".template");
    var $newPanel = $template.clone();

    $newPanel.attr("id", blockFor);
    $newPanel.find("#heading").attr("id", headingId(blockFor));
    $newPanel.find("#body").attr("id", bodyId(blockFor));

    $newPanel.find('#' + headingId(blockFor)).text(blockHeading);

    // TODO: Prefer to make ids specific to each user

    $newPanel.show();
    $('#output').append($newPanel);
}